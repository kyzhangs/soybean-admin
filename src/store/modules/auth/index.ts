import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { startAuthentication } from '@simplewebauthn/browser';
import {
  fetchAuthProviderExchange,
  fetchGetUserInfo,
  fetchLogin,
  fetchLogout,
  getAuthProviderLogoutUrl,
  fetchPasskeyLoginOptions,
  fetchVerifyPasskey,
  fetchVerifyTwoFactor
} from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const authStore = useAuthStore();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { routerPush, toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref('');
  const authProvider = ref(localStg.get('authProvider'));
  const twoFactorChallengeToken = ref('');
  const requiresTwoFactor = computed(() => Boolean(twoFactorChallengeToken.value));
  const canGlobalLogout = computed(() => authProvider.value?.protocol === 'cas');

  function createDefaultUserInfo(): Api.UserCenter.UserInfo {
    return {
      userId: '',
      username: '',
      name: null,
      gender: '3',
      email: null,
      phone: null,
      status: '1',
      is_superuser: false,
      create_time: null,
      active_time: null,
      last_login: null,
      avatar: null,
      roles: [],
      buttons: []
    };
  }

  const userInfo: Api.UserCenter.UserInfo = reactive(createDefaultUserInfo());

  /** name or username */
  const userDisplayName = computed(() => userInfo.name || userInfo.username);

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;
    if (VITE_AUTH_ROUTE_MODE === 'static') {
      return userInfo.roles.includes(VITE_STATIC_SUPER_ROLE) || userInfo.is_superuser === true;
    }
    return false;
  });

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore(redirectToLogin = true) {
    recordUserId();

    clearAuthStorage();

    authStore.$reset();
    clearAuthProvider();

    if (redirectToLogin && !route.meta.constant) {
      await toLogin();
    }

    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  /** Record the user ID of the previous login session Used to compare with the current user ID on next login */
  function recordUserId() {
    if (!userInfo.userId) {
      return;
    }

    // Store current user ID locally for next login comparison
    localStg.set('lastLoginUserId', userInfo.userId);
  }

  /**
   * Check if current login user is different from previous login user If different, clear all tabs
   *
   * @returns {boolean} Whether to clear all tabs
   */
  async function checkTabClear(): Promise<boolean> {
    if (!userInfo.userId) {
      return false;
    }

    const lastLoginUserId = localStg.get('lastLoginUserId');

    // Clear all tabs if current user is different from previous user
    if (!lastLoginUserId || lastLoginUserId !== userInfo.userId) {
      localStg.remove('globalTabs');

      await tabStore.clearTabs();

      localStg.remove('lastLoginUserId');
      return true;
    }

    localStg.remove('lastLoginUserId');
    return false;
  }

  /**
   * Login
   *
   * @param username Username
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(username: string, password: string, redirect = true) {
    clearAuthProvider();
    startLoading();

    const { data: loginResult, error } = await fetchLogin(username, password);

    if (!error) {
      if ('challenge_token' in loginResult) {
        twoFactorChallengeToken.value = loginResult.challenge_token;
      } else {
        await completeLogin(loginResult, redirect);
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  async function verifyTwoFactor(code: string, redirect = true) {
    if (!twoFactorChallengeToken.value) return;

    startLoading();
    try {
      const { data: loginToken, error } = await fetchVerifyTwoFactor({
        challenge_token: twoFactorChallengeToken.value,
        code
      });
      if (!error) {
        twoFactorChallengeToken.value = '';
        await completeLogin(loginToken, redirect);
      }
    } finally {
      endLoading();
    }
  }

  async function loginWithPasskey(redirect = true) {
    if (loginLoading.value) return;

    clearAuthProvider();
    startLoading();
    try {
      const { data: options, error: optionsError } = await fetchPasskeyLoginOptions();
      if (optionsError) return;

      const credential = await startAuthentication({
        optionsJSON: options.public_key
      });
      const { data: loginToken, error } = await fetchVerifyPasskey({
        flow_id: options.flow_id,
        credential
      });
      if (!error) {
        await completeLogin(loginToken, redirect);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'NotAllowedError')) {
        window.$message?.error($t('page.login.passkey.failed'));
      }
    } finally {
      endLoading();
    }
  }

  async function loginWithCasTicket(loginTicket: string) {
    startLoading();
    try {
      const { data, error } = await fetchAuthProviderExchange(loginTicket);
      if (error) return false;
      return await completeLogin(data, true, data.redirect, {
        code: data.provider_code,
        protocol: data.provider_protocol
      });
    } finally {
      endLoading();
    }
  }

  function clearAuthProvider() {
    authProvider.value = null;
    localStg.remove('authProvider');
  }

  async function logout(globalLogout = false) {
    const providerCode = canGlobalLogout.value ? authProvider.value?.code : undefined;
    const logoutUrl =
      globalLogout && providerCode ? getAuthProviderLogoutUrl(providerCode, window.location.origin) : undefined;
    try {
      await fetchLogout();
    } finally {
      await resetStore(!logoutUrl);
      if (logoutUrl) window.location.assign(logoutUrl);
    }
  }

  function cancelTwoFactor() {
    twoFactorChallengeToken.value = '';
  }

  async function completeLogin(
    loginToken: Api.Authx.Token,
    redirect = true,
    redirectPath?: string,
    provider?: Pick<Api.Authx.PublicAuthProvider, 'code' | 'protocol'>
  ) {
    const pass = await loginByToken(loginToken);
    if (!pass) return false;

    if (provider) {
      authProvider.value = provider;
      localStg.set('authProvider', authProvider.value);
    } else {
      clearAuthProvider();
    }

    await routeStore.initAuthRoute();
    const isClear = await checkTabClear();
    const needRedirect = isClear ? false : redirect;
    if (redirectPath) {
      await routerPush(redirectPath);
    } else {
      await redirectFromLogin(needRedirect);
    }

    window.$notification?.success({
      title: $t('page.login.common.loginSuccess'),
      content: $t('page.login.common.welcomeBack', {
        username: userDisplayName.value
      }),
      duration: 4500
    });
    return true;
  }

  async function loginByToken(loginToken: Api.Authx.Token) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('token', loginToken.access_token);
    localStg.set('refreshToken', loginToken.refresh_token);

    // 2. get user info
    const pass = await getUserInfo();

    if (pass) {
      token.value = loginToken.access_token;

      return true;
    }

    return false;
  }

  async function getUserInfo() {
    const { data: info, error } = await fetchGetUserInfo();

    if (!error) {
      // update store
      Object.assign(userInfo, createDefaultUserInfo(), info);

      return true;
    }

    return false;
  }

  async function initUserInfo() {
    const maybeToken = getToken();

    if (maybeToken) {
      token.value = maybeToken;
      const pass = await getUserInfo();

      if (!pass) {
        resetStore();
      }
    }
  }

  return {
    token,
    userInfo,
    userDisplayName,
    isStaticSuper,
    isLogin,
    canGlobalLogout,
    loginLoading,
    requiresTwoFactor,
    resetStore,
    login,
    loginWithPasskey,
    loginWithCasTicket,
    logout,
    verifyTwoFactor,
    cancelTwoFactor,
    getUserInfo,
    initUserInfo
  };
});
