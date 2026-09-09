<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import {
  fetchAuthBindingFlow,
  fetchCancelAuthBinding,
  fetchConfirmAuthBinding,
  fetchDeleteAuthIdentity,
  fetchGetAuthSessions,
  fetchGetAuthIdentities,
  fetchGetOwnLoginLogPage,
  fetchGetPasskeys,
  fetchGetRoleList,
  fetchGetTwoFactorStatus,
  fetchPendingAuthBinding,
  fetchPublicAuthProviders,
  fetchRevokeAuthSession,
  fetchSyncAuthIdentity,
  fetchUpdateTimezone
} from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import { formatDateTime, getTimeZoneOptions, resolveTimeZone } from '@/utils/datetime';
import PasswordChangeModal from './modules/password-change-modal.vue';
import PasskeyDeleteModal from './modules/passkey-delete-modal.vue';
import PasskeyModal from './modules/passkey-modal.vue';
import TwoFactorModal from './modules/two-factor-modal.vue';

defineOptions({
  name: 'UserCenter'
});

const authStore = useAuthStore();
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();
const userInfo = authStore.userInfo;
const loading = ref(false);
const roles = ref<Api.SystemManage.Role[]>([]);
const passwordChangeVisible = ref(false);
const passkeyVisible = ref(false);
const passkeyDeleteVisible = ref(false);
const passkeys = ref<Api.UserCenter.Passkey[]>([]);
const selectedPasskey = ref<Api.UserCenter.Passkey | null>(null);
const twoFactorVisible = ref(false);
const twoFactorAction = ref<'toggle' | 'regenerate'>('toggle');
const twoFactorStatus = ref<Api.Common.Status>('2');
const authIdentities = ref<Api.UserCenter.AuthIdentity[]>([]);
const authProviders = ref<Api.Authx.PublicAuthProvider[]>([]);
const bindingProviderCode = ref('');
const pendingBinding = ref<Api.UserCenter.PendingAuthBinding | null>(null);
const pendingBindingVisible = ref(false);
const pendingBindingLoading = ref(false);
const pendingBindingSubmitting = ref(false);
const syncingIdentityId = ref('');
const authSessions = ref<Api.UserCenter.AuthSession[]>([]);
const revokingSessionId = ref('');
const loginLogs = ref<Api.UserCenter.LoginLog[]>([]);
const loginLogPage = ref(1);
const loginLogTotal = ref(0);
const loginLogLoading = ref(false);
const LOGIN_LOG_PAGE_SIZE = 10;
const timezoneSaving = ref(false);
const DEVICE_TIMEZONE = '__device__';
const timezoneValue = ref(DEVICE_TIMEZONE);
const timezoneOptions = computed(() => [
  { label: $t('page.user-center.timezone.followDevice'), value: DEVICE_TIMEZONE },
  ...getTimeZoneOptions()
]);
const selectedTimezone = computed(() => (timezoneValue.value === DEVICE_TIMEZONE ? null : timezoneValue.value));
const effectiveTimezone = computed(() => resolveTimeZone(selectedTimezone.value));
type UserCenterSection = 'profile' | 'security' | 'sessions' | 'loginLogs';
const sectionHashRecord: Record<UserCenterSection, string> = {
  profile: '#profile',
  security: '#security',
  sessions: '#sessions',
  loginLogs: '#login-logs'
};
const sectionByHash = new Map(Object.entries(sectionHashRecord).map(([section, hash]) => [hash, section]));
const activeSection = ref<UserCenterSection>('profile');
const sectionNavigation = computed<Array<{ key: UserCenterSection; label: string; icon: string }>>(() => [
  { key: 'profile', label: $t('page.user-center.personalInfo'), icon: 'mdi:account-outline' },
  { key: 'security', label: $t('page.user-center.securitySettings'), icon: 'mdi:shield-key-outline' },
  { key: 'sessions', label: $t('page.user-center.sessions.title'), icon: 'mdi:devices' },
  { key: 'loginLogs', label: $t('page.user-center.loginLogs.title'), icon: 'mdi:history' }
]);

watch(
  () => route.hash,
  hash => {
    activeSection.value = (sectionByHash.get(hash) as UserCenterSection | undefined) || 'profile';
  },
  { immediate: true }
);

const genderLabel = computed(() => $t(userGenderRecord[userInfo.gender]));
const genderTagType = computed(() => {
  const tagMap: Record<Api.SystemManage.Gender, NaiveUI.ThemeColor> = {
    '1': 'info',
    '2': 'error',
    '3': 'default'
  };

  return tagMap[userInfo.gender];
});

const roleMap = computed(() => new Map(roles.value.map(role => [role.code, role.name])));
const displayRoles = computed(() => userInfo.roles.map(role => roleMap.value.get(role) || role));
const statusTagType = computed(() => {
  const tagMap: Record<Api.Common.Status, NaiveUI.ThemeColor> = {
    '1': 'success',
    '2': 'warning'
  };

  return tagMap[userInfo.status];
});
const statusLabel = computed(() => $t(enableStatusRecord[userInfo.status]));
const twoFactorEnabled = computed(() => twoFactorStatus.value === '1');
const passkeyCards = computed(() =>
  passkeys.value.map(passkey => ({
    passkey,
    addedAt: formatDateTime(passkey.create_time, selectedTimezone.value, 'datetime', appStore.locale),
    lastUsedAt: passkey.last_used_at
      ? formatDateTime(passkey.last_used_at, selectedTimezone.value, 'datetime', appStore.locale)
      : $t('page.user-center.passkey.neverUsed')
  }))
);
const boundProviderCodes = computed(() => new Set(authIdentities.value.map(identity => identity.provider_code)));
const bindableProviders = computed(() =>
  authProviders.value.filter(provider => !boundProviderCodes.value.has(provider.code))
);

const deviceIconRecord: Record<Api.UserCenter.DeviceType, string> = {
  pc: 'mdi:monitor',
  mobile: 'mdi:cellphone',
  tablet: 'mdi:tablet',
  bot: 'mdi:robot-outline',
  unknown: 'mdi:devices'
};

function sessionLocation(session: Api.UserCenter.AuthSession) {
  return (
    [session.country, session.region, session.city]
      .filter((value, index, values) => value && values.indexOf(value) === index)
      .join(' · ') || $t('common.noData')
  );
}

function sessionDevice(session: Api.UserCenter.AuthSession) {
  const details = [session.browser, session.os, $t(`page.user-center.sessions.device.${session.device}`)].filter(
    Boolean
  );
  return details.join(' · ');
}

function sessionProtocol(session: Api.UserCenter.AuthSession) {
  return session.provider_name || $t(`page.user-center.sessions.protocol.${session.login_protocol}`);
}

function loginLogLocation(loginLog: Api.UserCenter.LoginLog) {
  return (
    [loginLog.country, loginLog.region, loginLog.city]
      .filter((value, index, values) => value && values.indexOf(value) === index)
      .join(' · ') || $t('common.noData')
  );
}

function loginLogDevice(loginLog: Api.UserCenter.LoginLog) {
  return [loginLog.browser, loginLog.os, $t(`page.user-center.sessions.device.${loginLog.device}`)]
    .filter(Boolean)
    .join(' · ');
}

function loginLogProtocol(loginLog: Api.UserCenter.LoginLog) {
  if (loginLog.provider_name) return loginLog.provider_name;
  if (!loginLog.login_protocol) return $t('common.noData');
  return $t(`page.user-center.sessions.protocol.${loginLog.login_protocol}`);
}

function valueOrEmpty(value: string | null | undefined) {
  return value || $t('common.noData');
}

async function refreshUserInfo() {
  loading.value = true;
  loginLogPage.value = 1;
  const [, roleRes, twoFactorStatusRes, passkeyRes, identityRes, providerRes, sessionRes, loginLogRes] =
    await Promise.all([
      authStore.getUserInfo(),
      fetchGetRoleList(),
      fetchGetTwoFactorStatus(),
      fetchGetPasskeys(),
      fetchGetAuthIdentities(),
      fetchPublicAuthProviders(),
      fetchGetAuthSessions(),
      fetchGetOwnLoginLogPage({ page: 1, page_size: LOGIN_LOG_PAGE_SIZE })
    ]);

  if (!roleRes.error) {
    roles.value = roleRes.data;
  }
  if (!twoFactorStatusRes.error) {
    twoFactorStatus.value = twoFactorStatusRes.data.status;
  }
  if (!passkeyRes.error) {
    passkeys.value = passkeyRes.data;
  }
  if (!identityRes.error) authIdentities.value = identityRes.data;
  if (!providerRes.error) authProviders.value = providerRes.data;
  if (!sessionRes.error) authSessions.value = sessionRes.data;
  if (!loginLogRes.error) {
    loginLogs.value = loginLogRes.data.rows;
    loginLogTotal.value = loginLogRes.data.total;
  }
  timezoneValue.value = userInfo.timezone || DEVICE_TIMEZONE;

  loading.value = false;
}

async function loadLoginLogs(page: number) {
  loginLogLoading.value = true;
  try {
    const { data, error } = await fetchGetOwnLoginLogPage({ page, page_size: LOGIN_LOG_PAGE_SIZE });
    if (!error) {
      loginLogPage.value = data.page;
      loginLogs.value = data.rows;
      loginLogTotal.value = data.total;
    }
  } finally {
    loginLogLoading.value = false;
  }
}

async function revokeAuthSession(session: Api.UserCenter.AuthSession) {
  revokingSessionId.value = session.id;
  try {
    const { error } = await fetchRevokeAuthSession(session.id);
    if (error) return;
    window.$message?.success($t('page.user-center.sessions.revokeSuccess'));
    if (session.is_current) {
      await authStore.resetStore();
      return;
    }
    const { data, error: refreshError } = await fetchGetAuthSessions();
    if (!refreshError) authSessions.value = data;
  } finally {
    revokingSessionId.value = '';
  }
}

async function updateTimezone(value: string) {
  timezoneValue.value = value;
  timezoneSaving.value = true;
  const { error } = await fetchUpdateTimezone({ timezone: selectedTimezone.value });
  if (!error) {
    await authStore.getUserInfo();
    window.$message?.success($t('page.user-center.timezone.saveSuccess'));
  } else {
    timezoneValue.value = userInfo.timezone || DEVICE_TIMEZONE;
  }
  timezoneSaving.value = false;
}

async function bindAuthProvider(providerCode: string) {
  bindingProviderCode.value = providerCode;
  try {
    const callbackUrl = `${window.location.origin}/user-center`;
    const { data, error } = await fetchAuthBindingFlow(providerCode, callbackUrl);
    if (!error) window.location.assign(data.authorization_url);
  } finally {
    bindingProviderCode.value = '';
  }
}

async function clearBindingQuery() {
  await router.replace({ path: route.path, hash: route.hash });
}

async function selectSection(section: UserCenterSection) {
  activeSection.value = section;
  const hash = sectionHashRecord[section];
  if (route.hash !== hash) await router.push({ path: route.path, query: route.query, hash });
}

async function closePendingBinding() {
  pendingBindingVisible.value = false;
  pendingBinding.value = null;
  await clearBindingQuery();
}

async function loadPendingAuthBinding() {
  pendingBindingLoading.value = true;
  try {
    const { data, error } = await fetchPendingAuthBinding();
    if (!error) {
      pendingBinding.value = data;
      pendingBindingVisible.value = true;
    } else {
      await clearBindingQuery();
    }
  } finally {
    pendingBindingLoading.value = false;
  }
}

async function confirmPendingAuthBinding() {
  const binding = pendingBinding.value;
  if (!binding || pendingBindingSubmitting.value) return;
  pendingBindingSubmitting.value = true;
  try {
    const { error } = await fetchConfirmAuthBinding(binding.flow_id);
    if (!error) {
      await closePendingBinding();
      window.$message?.success($t('page.user-center.authIdentity.bindSuccess'));
      await refreshUserInfo();
    } else if (String(error.response?.data?.code) === '100183') {
      await closePendingBinding();
    }
  } finally {
    pendingBindingSubmitting.value = false;
  }
}

async function cancelPendingAuthBinding() {
  const binding = pendingBinding.value;
  if (!binding || pendingBindingSubmitting.value) return;
  pendingBindingSubmitting.value = true;
  try {
    await fetchCancelAuthBinding(binding.flow_id);
  } finally {
    await closePendingBinding();
    pendingBindingSubmitting.value = false;
  }
}

async function unbindAuthIdentity(identityId: string) {
  const { error } = await fetchDeleteAuthIdentity(identityId);
  if (!error) {
    window.$message?.success($t('page.user-center.authIdentity.unbindSuccess'));
    const { data, error: refreshError } = await fetchGetAuthIdentities();
    if (!refreshError) authIdentities.value = data;
  }
}

async function syncAuthIdentity(identityId: string) {
  syncingIdentityId.value = identityId;
  try {
    const { error } = await fetchSyncAuthIdentity(identityId);
    if (!error) {
      window.$message?.success($t('page.user-center.authIdentity.syncSuccess'));
      await refreshUserInfo();
    }
  } finally {
    syncingIdentityId.value = '';
  }
}

async function handleTwoFactorChanged() {
  twoFactorVisible.value = false;
  const { data, error } = await fetchGetTwoFactorStatus();
  if (!error) {
    twoFactorStatus.value = data.status;
  }
}

async function handlePasskeyChanged() {
  const { data, error } = await fetchGetPasskeys();
  if (!error) {
    passkeys.value = data;
  }
}

function openPasskeyDelete(passkey: Api.UserCenter.Passkey) {
  selectedPasskey.value = passkey;
  passkeyDeleteVisible.value = true;
}

function openTwoFactorModal(action: 'toggle' | 'regenerate') {
  twoFactorAction.value = action;
  twoFactorVisible.value = true;
}

onMounted(async () => {
  if (route.query.binding === 'confirm') {
    await loadPendingAuthBinding();
  } else if (route.query.binding === 'success') {
    window.$message?.success($t('page.user-center.authIdentity.bindSuccess'));
    await clearBindingQuery();
  } else if (route.query.error) {
    window.$message?.error($t('page.user-center.authIdentity.bindFailed', { error: String(route.query.error) }));
    await clearBindingQuery();
  }
  await refreshUserInfo();
});
</script>

<template>
  <div
    class="user-center-page min-h-500px"
    :class="{ 'user-center-page--table': activeSection === 'sessions' || activeSection === 'loginLogs' }"
  >
    <NSpin :show="loading" class="user-center-spin">
      <div class="user-center-shell card-wrapper">
        <aside class="user-center-aside">
          <div class="user-profile">
            <SoybeanAvatar :url="userInfo.avatar" class="size-76px! shrink-0" />
            <div class="min-w-0">
              <h2 class="m-0 flex items-center justify-center gap-6px text-20px font-semibold leading-28px">
                <span class="truncate">{{ authStore.userDisplayName }}</span>
                <SvgIcon v-if="userInfo.is_superuser" icon="eos-icons:admin" class="shrink-0 text-20px text-primary" />
              </h2>
              <div class="mt-4px truncate text-13px text-#6b7280">@{{ userInfo.username }}</div>
              <div class="mt-10px flex flex-wrap justify-center gap-6px">
                <NTag :type="statusTagType" size="small" round>{{ statusLabel }}</NTag>
                <NTag v-for="role in displayRoles" :key="role" type="warning" size="small" round>{{ role }}</NTag>
              </div>
            </div>
          </div>

          <nav class="user-center-nav" :aria-label="$t('route.user-center')">
            <button
              v-for="item in sectionNavigation"
              :key="item.key"
              type="button"
              class="user-center-nav-item"
              :class="{ 'is-active': activeSection === item.key }"
              @click="selectSection(item.key)"
            >
              <SvgIcon :icon="item.icon" class="text-19px" />
              <span>{{ item.label }}</span>
            </button>
          </nav>
        </aside>

        <main class="user-center-content">
          <section v-if="activeSection === 'profile'" class="user-center-section">
            <div class="section-heading">
              <h3>{{ $t('page.user-center.personalInfo') }}</h3>
            </div>
            <div class="profile-info-grid">
              <div class="min-w-0">
                <NDescriptions label-placement="left" :column="1" size="medium" class="profile-descriptions">
                  <NDescriptionsItem :label="$t('page.system-manage.users.name')">
                    {{ valueOrEmpty(userInfo.name) }}
                  </NDescriptionsItem>
                  <NDescriptionsItem :label="$t('page.system-manage.users.gender')">
                    <NTag :type="genderTagType" size="small">{{ genderLabel }}</NTag>
                  </NDescriptionsItem>
                  <NDescriptionsItem :label="$t('page.system-manage.users.phone')">
                    {{ valueOrEmpty(userInfo.phone) }}
                  </NDescriptionsItem>
                  <NDescriptionsItem :label="$t('page.system-manage.users.email')">
                    {{ valueOrEmpty(userInfo.email) }}
                  </NDescriptionsItem>
                </NDescriptions>
              </div>
              <div class="min-w-0">
                <NDescriptions label-placement="left" :column="1" size="medium" class="profile-descriptions">
                  <NDescriptionsItem :label="$t('page.user-center.userId')">
                    <span class="break-all">{{ userInfo.userId }}</span>
                  </NDescriptionsItem>
                  <NDescriptionsItem :label="$t('common.create_time')">
                    {{ formatDateTime(userInfo.create_time, selectedTimezone, 'datetime', appStore.locale) }}
                  </NDescriptionsItem>
                  <NDescriptionsItem :label="$t('page.user-center.activeTime')">
                    {{ formatDateTime(userInfo.active_time, selectedTimezone, 'datetime', appStore.locale) }}
                  </NDescriptionsItem>
                  <NDescriptionsItem :label="$t('page.user-center.lastLogin')">
                    {{ formatDateTime(userInfo.last_login, selectedTimezone, 'datetime', appStore.locale) }}
                  </NDescriptionsItem>
                </NDescriptions>
              </div>
            </div>

            <NDivider />
            <div class="section-heading section-heading--small">
              <h3>{{ $t('page.user-center.timezone.title') }}</h3>
            </div>
            <div class="timezone-setting flex flex-wrap items-center justify-between gap-16px">
              <div class="min-w-0 flex-1 text-13px text-#6b7280">
                {{ $t('page.user-center.timezone.tip', { timezone: effectiveTimezone }) }}
              </div>
              <NSelect
                :value="timezoneValue"
                :options="timezoneOptions"
                filterable
                class="max-w-full w-280px"
                :loading="timezoneSaving"
                @update:value="updateTimezone"
              />
            </div>
          </section>

          <section v-else-if="activeSection === 'sessions'" class="user-center-section user-center-section--table">
            <div class="section-heading">
              <h3>{{ $t('page.user-center.sessions.title') }}</h3>
            </div>
            <p class="section-tip">{{ $t('page.user-center.sessions.tip') }}</p>
            <NEmpty v-if="!authSessions.length" :description="$t('page.user-center.sessions.empty')" />
            <div v-else class="table-scroll">
              <NTable :bordered="false" :single-line="false" size="small" class="user-center-table session-table">
                <colgroup>
                  <col style="width: 31%" />
                  <col style="width: 20%" />
                  <col style="width: 13%" />
                  <col style="width: 25%" />
                  <col style="width: 11%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>{{ $t('page.user-center.loginLogs.device') }}</th>
                    <th>
                      {{ $t('page.user-center.loginLogs.ipAddress') }} / {{ $t('page.user-center.loginLogs.location') }}
                    </th>
                    <th>{{ $t('page.user-center.sessions.loginMethod') }}</th>
                    <th>
                      {{ $t('page.user-center.sessions.loginTime') }} / {{ $t('page.user-center.sessions.lastSeen') }}
                    </th>
                    <th class="text-center">{{ $t('common.action') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="session in authSessions" :key="session.id">
                    <td>
                      <div class="flex flex-wrap items-center gap-8px">
                        <SvgIcon :icon="deviceIconRecord[session.device]" class="shrink-0 text-20px text-primary" />
                        <span>{{ sessionDevice(session) }}</span>
                        <NTag v-if="session.is_current" type="success" size="small" round>
                          {{ $t('page.user-center.sessions.current') }}
                        </NTag>
                      </div>
                    </td>
                    <td>
                      <div>{{ session.ip_address || $t('common.noData') }}</div>
                      <div class="mt-2px text-12px text-#6b7280">{{ sessionLocation(session) }}</div>
                    </td>
                    <td>{{ sessionProtocol(session) }}</td>
                    <td>
                      <div>{{ formatDateTime(session.auth_time, selectedTimezone, 'datetime', appStore.locale) }}</div>
                      <div class="mt-2px text-12px text-#6b7280">
                        {{ $t('page.user-center.sessions.lastSeen') }}：
                        {{ formatDateTime(session.last_seen_at, selectedTimezone, 'datetime', appStore.locale) }}
                      </div>
                    </td>
                    <td class="text-center">
                      <NPopconfirm @positive-click="revokeAuthSession(session)">
                        <template #trigger>
                          <NButton text type="error" size="small" :loading="revokingSessionId === session.id">
                            {{ $t('page.user-center.sessions.revoke') }}
                          </NButton>
                        </template>
                        {{
                          session.is_current
                            ? $t('page.user-center.sessions.revokeCurrentConfirm')
                            : $t('page.user-center.sessions.revokeConfirm')
                        }}
                      </NPopconfirm>
                    </td>
                  </tr>
                </tbody>
              </NTable>
            </div>
          </section>

          <section v-else-if="activeSection === 'loginLogs'" class="user-center-section user-center-section--table">
            <div class="section-heading">
              <h3>{{ $t('page.user-center.loginLogs.title') }}</h3>
            </div>
            <p class="section-tip">{{ $t('page.user-center.loginLogs.tip') }}</p>
            <NSpin :show="loginLogLoading" class="table-section-spin">
              <NEmpty v-if="!loginLogs.length" :description="$t('page.user-center.loginLogs.empty')" />
              <div v-else class="table-scroll">
                <NTable :bordered="false" :single-line="false" size="small" class="user-center-table login-log-table">
                  <colgroup>
                    <col style="width: 14%" />
                    <col style="width: 25%" />
                    <col style="width: 13%" />
                    <col style="width: 10%" />
                    <col style="width: 19%" />
                    <col style="width: 19%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>{{ $t('page.system-manage.loginLogs.loginMethod') }}</th>
                      <th>{{ $t('page.user-center.loginLogs.device') }}</th>
                      <th>
                        {{ $t('page.user-center.loginLogs.ipAddress') }} /
                        {{ $t('page.user-center.loginLogs.location') }}
                      </th>
                      <th>{{ $t('page.system-manage.loginLogs.result.title') }}</th>
                      <th>{{ $t('page.system-manage.loginLogs.loginTime') }}</th>
                      <th>{{ $t('page.system-manage.loginLogs.logoutTime') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="loginLog in loginLogs" :key="loginLog.id">
                      <td>{{ loginLogProtocol(loginLog) }}</td>
                      <td>
                        <div class="flex items-center gap-8px">
                          <SvgIcon :icon="deviceIconRecord[loginLog.device]" class="shrink-0 text-20px text-primary" />
                          <span>{{ loginLogDevice(loginLog) }}</span>
                        </div>
                      </td>
                      <td>
                        <div>{{ loginLog.ip_address || $t('common.noData') }}</div>
                        <div class="mt-2px text-12px text-#6b7280">{{ loginLogLocation(loginLog) }}</div>
                        <div v-if="loginLog.failure_code !== null" class="mt-2px text-12px text-error">
                          {{ $t('page.user-center.loginLogs.failureCode') }}：{{ loginLog.failure_code }}
                        </div>
                      </td>
                      <td>
                        <NTag :type="loginLog.result === 'success' ? 'success' : 'error'" size="small" round>
                          {{
                            loginLog.result === 'success'
                              ? $t('page.user-center.loginLogs.result.success')
                              : $t('page.user-center.loginLogs.result.failure')
                          }}
                        </NTag>
                      </td>
                      <td>
                        {{ formatDateTime(loginLog.create_time, selectedTimezone, 'datetime', appStore.locale) }}
                      </td>
                      <td>
                        {{
                          loginLog.logout_time
                            ? formatDateTime(loginLog.logout_time, selectedTimezone, 'datetime', appStore.locale)
                            : $t('common.noData')
                        }}
                      </td>
                    </tr>
                  </tbody>
                </NTable>
              </div>
              <div v-if="loginLogTotal > LOGIN_LOG_PAGE_SIZE" class="mt-16px flex justify-end">
                <NPagination
                  :page="loginLogPage"
                  :page-size="LOGIN_LOG_PAGE_SIZE"
                  :item-count="loginLogTotal"
                  @update:page="loadLoginLogs"
                />
              </div>
            </NSpin>
          </section>

          <section v-else class="user-center-section">
            <div class="section-heading">
              <h3>{{ $t('page.user-center.securitySettings') }}</h3>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-16px">
              <div class="min-w-0 flex-1">
                <div class="text-15px font-medium">{{ $t('page.user-center.loginPwd') }}</div>
                <div class="mt-6px text-13px text-#6b7280">{{ $t('page.user-center.loginPwdTip') }}</div>
              </div>
              <NButton class="shrink-0" secondary @click="passwordChangeVisible = true">
                {{ $t('page.user-center.modifyPwd') }}
              </NButton>
            </div>
            <NDivider />
            <div class="flex flex-wrap items-center justify-between gap-16px">
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-8px text-15px font-medium">
                  {{ $t('page.user-center.twoFactor.title') }}
                  <NTag :type="twoFactorEnabled ? 'success' : 'default'" size="small">
                    {{
                      twoFactorEnabled
                        ? $t('page.user-center.twoFactor.enabled')
                        : $t('page.user-center.twoFactor.disabled')
                    }}
                  </NTag>
                </div>
                <div class="mt-6px text-13px text-#6b7280">{{ $t('page.user-center.twoFactor.tip') }}</div>
              </div>
              <div class="flex shrink-0 flex-wrap justify-end gap-8px">
                <NButton v-if="twoFactorEnabled" secondary @click="openTwoFactorModal('regenerate')">
                  {{ $t('page.user-center.twoFactor.regenerateRecoveryCodes') }}
                </NButton>
                <NButton :type="twoFactorEnabled ? 'error' : 'primary'" secondary @click="openTwoFactorModal('toggle')">
                  {{
                    twoFactorEnabled
                      ? $t('page.user-center.twoFactor.disable')
                      : $t('page.user-center.twoFactor.enable')
                  }}
                </NButton>
              </div>
            </div>
            <NDivider />
            <div>
              <div class="flex flex-wrap items-center justify-between gap-16px">
                <div class="min-w-0 flex-1">
                  <div class="text-15px font-medium">{{ $t('page.user-center.authIdentity.title') }}</div>
                  <div class="mt-6px text-13px text-#6b7280">{{ $t('page.user-center.authIdentity.tip') }}</div>
                </div>
                <NSpace>
                  <NButton
                    v-for="provider in bindableProviders"
                    :key="provider.code"
                    type="primary"
                    secondary
                    :loading="bindingProviderCode === provider.code"
                    @click="bindAuthProvider(provider.code)"
                  >
                    {{ $t('page.user-center.authIdentity.bind', { provider: provider.name }) }}
                  </NButton>
                </NSpace>
              </div>
              <NGrid
                v-if="authIdentities.length"
                responsive="screen"
                item-responsive
                :x-gap="12"
                :y-gap="12"
                class="mt-12px"
              >
                <NGi v-for="identity in authIdentities" :key="identity.id" span="24 s:12">
                  <NCard size="small" embedded>
                    <div class="flex items-center justify-between gap-12px">
                      <div class="min-w-0 flex items-center gap-10px">
                        <SvgIcon
                          :icon="identity.provider_icon || 'mdi:account-key-outline'"
                          class="text-22px text-primary"
                        />
                        <div class="min-w-0">
                          <div class="font-medium">{{ identity.provider_name }}</div>
                          <div class="truncate text-12px text-#6b7280">
                            {{ identity.username || identity.email || $t('page.user-center.authIdentity.bound') }}
                          </div>
                        </div>
                      </div>
                      <NSpace size="small">
                        <NButton
                          text
                          type="primary"
                          size="small"
                          :loading="syncingIdentityId === identity.id"
                          @click="syncAuthIdentity(identity.id)"
                        >
                          {{ $t('page.user-center.authIdentity.sync') }}
                        </NButton>
                        <NPopconfirm @positive-click="unbindAuthIdentity(identity.id)">
                          <template #trigger>
                            <NButton text type="error" size="small">
                              {{ $t('page.user-center.authIdentity.unbind') }}
                            </NButton>
                          </template>
                          {{ $t('page.user-center.authIdentity.unbindConfirm') }}
                        </NPopconfirm>
                      </NSpace>
                    </div>
                  </NCard>
                </NGi>
              </NGrid>
            </div>
            <NDivider />
            <div>
              <div class="flex flex-wrap items-center justify-between gap-16px">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-8px text-15px font-medium">
                    {{ $t('page.user-center.passkey.title') }}
                    <NTag :type="passkeys.length ? 'success' : 'default'" size="small">
                      {{ $t('page.user-center.passkey.boundCount', { count: passkeys.length }) }}
                    </NTag>
                  </div>
                  <div class="mt-6px text-13px text-#6b7280">{{ $t('page.user-center.passkey.tip') }}</div>
                </div>
                <NButton class="shrink-0" type="primary" secondary @click="passkeyVisible = true">
                  {{ $t('page.user-center.passkey.bind') }}
                </NButton>
              </div>

              <NGrid
                v-if="passkeyCards.length"
                responsive="screen"
                item-responsive
                :x-gap="12"
                :y-gap="12"
                class="mt-12px"
              >
                <NGi v-for="card in passkeyCards" :key="card.passkey.id" span="24 s:12">
                  <NCard size="small" embedded class="h-full">
                    <div class="flex items-start justify-between gap-12px">
                      <div class="min-w-0 flex-y-center gap-8px text-15px font-medium">
                        <SvgIcon icon="mdi:fingerprint" class="shrink-0 text-20px text-primary" />
                        <span class="truncate">{{ card.passkey.name }}</span>
                      </div>
                      <NButton text type="error" size="tiny" class="shrink-0" @click="openPasskeyDelete(card.passkey)">
                        <template #icon><SvgIcon icon="mdi:trash-can-outline" /></template>
                        {{ $t('page.user-center.passkey.delete') }}
                      </NButton>
                    </div>
                    <div class="mt-12px flex-col-stretch gap-8px text-13px">
                      <div class="flex items-start justify-between gap-12px">
                        <span class="shrink-0 text-#6b7280">{{ $t('page.user-center.passkey.addedAt') }}</span>
                        <span class="break-all text-right">{{ card.addedAt }}</span>
                      </div>
                      <div class="flex items-start justify-between gap-12px">
                        <span class="shrink-0 text-#6b7280">{{ $t('page.user-center.passkey.lastUsedAt') }}</span>
                        <span class="break-all text-right">{{ card.lastUsedAt }}</span>
                      </div>
                    </div>
                  </NCard>
                </NGi>
              </NGrid>
            </div>
          </section>
        </main>
      </div>
    </NSpin>

    <PasswordChangeModal v-model:visible="passwordChangeVisible" />
    <PasskeyModal v-model:visible="passkeyVisible" @submitted="handlePasskeyChanged" />
    <PasskeyDeleteModal
      v-model:visible="passkeyDeleteVisible"
      :passkey="selectedPasskey"
      @submitted="handlePasskeyChanged"
    />
    <TwoFactorModal
      v-model:visible="twoFactorVisible"
      :enabled="twoFactorEnabled"
      :action="twoFactorAction"
      @submitted="handleTwoFactorChanged"
    />
    <NModal
      v-model:show="pendingBindingVisible"
      preset="card"
      :title="$t('page.user-center.authIdentity.confirmTitle')"
      :mask-closable="false"
      :close-on-esc="false"
      :closable="false"
      class="max-w-95vw w-520px"
    >
      <NSpin :show="pendingBindingLoading">
        <NAlert type="warning" show-icon class="mb-16px">
          {{ $t('page.user-center.authIdentity.confirmTip') }}
        </NAlert>
        <NDescriptions v-if="pendingBinding" bordered label-placement="left" :column="1" size="small">
          <NDescriptionsItem :label="$t('page.user-center.authIdentity.confirmProvider')">
            {{ pendingBinding.provider_name }}
          </NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.user-center.authIdentity.confirmAccount')">
            {{ pendingBinding.username || pendingBinding.subject }}
          </NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.user-center.authIdentity.confirmName')">
            {{ valueOrEmpty(pendingBinding.name) }}
          </NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.user-center.authIdentity.confirmEmail')">
            {{ valueOrEmpty(pendingBinding.email) }}
          </NDescriptionsItem>
        </NDescriptions>
      </NSpin>
      <template #footer>
        <NSpace justify="end">
          <NButton :disabled="pendingBindingSubmitting" @click="cancelPendingAuthBinding">
            {{ $t('common.cancel') }}
          </NButton>
          <NButton type="primary" :loading="pendingBindingSubmitting" @click="confirmPendingAuthBinding">
            {{ $t('page.user-center.authIdentity.confirmAction') }}
          </NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>

<style scoped>
.user-center-page {
  overflow-x: hidden;
  overflow-y: auto;
}

.user-center-page--table {
  height: 100%;
  overflow: hidden;
}

.user-center-page--table .user-center-spin,
.user-center-page--table :deep(.n-spin-content) {
  height: 100%;
  min-height: 0;
}

.user-center-shell {
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr);
  min-height: 620px;
  overflow: hidden;
  border: 1px solid rgb(229 231 235 / 70%);
  border-radius: 12px;
  background: #fff;
}

.user-center-page--table .user-center-shell {
  height: 100%;
  min-height: 0;
}

.user-center-aside {
  border-right: 1px solid #edf0f5;
  background: linear-gradient(180deg, rgb(245 249 255 / 92%) 0%, #fff 48%);
}

.user-profile {
  display: flex;
  min-height: 188px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 20px 20px;
  text-align: center;
}

.user-center-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px 20px;
}

.user-center-nav-item {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 7px;
  padding: 12px 16px;
  background: transparent;
  color: #4b5563;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition:
    color 160ms ease,
    background-color 160ms ease;
}

.user-center-nav-item:hover {
  background: rgb(var(--primary-color) / 8%);
  color: rgb(var(--primary-color));
}

.user-center-nav-item.is-active {
  background: rgb(var(--primary-color) / 11%);
  color: rgb(var(--primary-color));
  font-weight: 600;
}

.user-center-nav-item.is-active::before {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 0;
  width: 3px;
  border-radius: 3px;
  background: rgb(var(--primary-color));
  content: '';
}

.user-center-content {
  min-width: 0;
  padding: 28px 40px 36px;
}

.user-center-page--table .user-center-content {
  min-height: 0;
  overflow: hidden;
}

.user-center-section {
  min-width: 0;
}

.user-center-section--table {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
}

.user-center-section--table > .table-scroll {
  min-height: 0;
  flex: 1;
  overflow: auto;
}

.table-section-spin {
  min-height: 0;
  flex: 1;
}

.table-section-spin :deep(.n-spin-content) {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
}

.table-section-spin .table-scroll {
  min-height: 0;
  flex: 1;
  overflow: auto;
}

.profile-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 24px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.section-heading::before {
  width: 4px;
  height: 16px;
  border-radius: 4px;
  background: rgb(var(--primary-color));
  content: '';
}

.section-heading h3 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
}

.section-heading--small {
  margin-bottom: 14px;
}

.section-heading--small h3 {
  font-size: 16px;
}

.section-tip {
  margin: -10px 0 18px 14px;
  color: #6b7280;
  font-size: 13px;
  line-height: 20px;
}

.table-scroll {
  overflow-x: auto;
  border-top: 1px solid #edf0f5;
}

.user-center-table {
  width: 100%;
  table-layout: fixed;
}

.user-center-table :deep(th) {
  padding: 12px 16px;
  background: #f7f8fa;
  color: #374151;
  font-weight: 600;
  white-space: normal;
}

.user-center-table :deep(td) {
  padding: 13px 16px;
  color: #374151;
  overflow-wrap: anywhere;
}

.login-log-table {
  min-width: 960px;
}

.login-log-table :deep(th:nth-child(2)),
.login-log-table :deep(td:nth-child(2)),
.login-log-table :deep(th:nth-child(5)),
.login-log-table :deep(th:nth-child(6)),
.login-log-table :deep(td:nth-child(5)),
.login-log-table :deep(td:nth-child(6)) {
  white-space: nowrap;
  overflow-wrap: normal;
}

.user-center-section :deep(.n-descriptions-table) {
  width: 100%;
  table-layout: fixed;
}

.user-center-section :deep(.n-descriptions-table-content),
.user-center-section :deep(.n-descriptions-table-content__content) {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.dark .user-center-shell {
  border-color: rgb(255 255 255 / 10%);
  background: #18181c;
}

.dark .user-center-aside {
  border-right-color: rgb(255 255 255 / 9%);
  background: linear-gradient(180deg, rgb(var(--primary-color) / 10%) 0%, #18181c 48%);
}

.dark .user-center-nav-item,
.dark .section-tip,
.dark .user-center-table :deep(td) {
  color: #c3c7ce;
}

.dark .section-heading h3 {
  color: #f3f4f6;
}

.dark .table-scroll {
  border-top-color: rgb(255 255 255 / 10%);
}

.dark .user-center-table :deep(th) {
  background: rgb(255 255 255 / 5%);
  color: #e5e7eb;
}

@media (max-width: 800px) {
  .user-center-page--table,
  .user-center-page--table .user-center-spin,
  .user-center-page--table :deep(.n-spin-content) {
    height: auto;
    overflow: visible;
  }

  .user-center-shell {
    display: block;
  }

  .user-center-page--table .user-center-shell {
    height: auto;
    min-height: 620px;
  }

  .user-center-aside {
    border-right: 0;
    border-bottom: 1px solid #edf0f5;
  }

  .user-profile {
    min-height: auto;
    flex-direction: row;
    justify-content: flex-start;
    padding: 18px 20px 14px;
    text-align: left;
  }

  .user-profile > div:last-child {
    text-align: left;
  }

  .user-profile :deep(.n-tag) {
    margin-right: auto;
  }

  .user-center-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 4px 12px 12px;
  }

  .user-center-nav-item {
    width: auto;
    flex: 0 0 auto;
    padding: 10px 12px;
  }

  .user-center-nav-item.is-active::before {
    top: auto;
    right: 12px;
    bottom: 2px;
    left: 12px;
    width: auto;
    height: 2px;
  }

  .user-center-content {
    overflow: visible;
    padding: 22px 18px 28px;
  }

  .user-center-section--table {
    height: auto;
    overflow: visible;
  }

  .user-center-section--table > .table-scroll,
  .table-section-spin .table-scroll {
    overflow: auto;
  }

  .profile-info-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .timezone-setting {
    display: block;
  }

  .timezone-setting :deep(.n-select) {
    width: 100%;
    margin-top: 14px;
  }

  .user-center-table {
    min-width: 760px;
  }

  .section-tip {
    margin-left: 0;
  }
}
</style>
