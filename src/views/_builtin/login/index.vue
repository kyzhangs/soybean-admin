<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { getPaletteColorByNumber, mixColor } from '@sa/color';
import { loginModuleRecord } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import PwdLogin from './modules/pwd-login.vue';
import PasskeyLogin from './modules/passkey-login.vue';
import TwoFactor from './modules/2fa.vue';
import Callback from './modules/callback.vue';
import CodeLogin from './modules/code-login.vue';
import Register from './modules/register.vue';
import ResetPwd from './modules/reset-pwd.vue';
import BindWechat from './modules/bind-wechat.vue';

interface Props {
  /** The login module */
  module?: UnionKey.LoginModule;
}

const props = defineProps<Props>();

const appStore = useAppStore();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const { toggleLoginModule } = useRouterPush();

interface LoginModule {
  label: App.I18n.I18nKey;
  component: Component;
}

const moduleMap: Record<UnionKey.LoginModule, LoginModule> = {
  'pwd-login': { label: loginModuleRecord['pwd-login'], component: PwdLogin },
  'passkey-login': { label: loginModuleRecord['passkey-login'], component: PasskeyLogin },
  '2fa': { label: loginModuleRecord['2fa'], component: TwoFactor },
  callback: { label: loginModuleRecord['callback'], component: Callback },
  'code-login': { label: loginModuleRecord['code-login'], component: CodeLogin },
  register: { label: loginModuleRecord.register, component: Register },
  'reset-pwd': { label: loginModuleRecord['reset-pwd'], component: ResetPwd },
  'bind-wechat': { label: loginModuleRecord['bind-wechat'], component: BindWechat }
};

const activeModule = computed(() => moduleMap[props.module || 'pwd-login']);
const currentModule = computed(() => props.module || 'pwd-login');
const showLoginModeTabs = computed(
  () => !authStore.requiresTwoFactor && ['pwd-login', 'passkey-login'].includes(currentModule.value)
);
const activeModuleLabel = computed<App.I18n.I18nKey>(() => activeModule.value.label);

const bgThemeColor = computed(() =>
  themeStore.darkMode ? getPaletteColorByNumber(themeStore.themeColor, 600) : themeStore.themeColor
);

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff';

  const ratio = themeStore.darkMode ? 0.5 : 0.2;

  return mixColor(COLOR_WHITE, themeStore.themeColor, ratio);
});
</script>

<template>
  <div class="relative size-full flex-center overflow-hidden" :style="{ backgroundColor: bgColor }">
    <WaveBg :theme-color="bgThemeColor" />
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px">
      <div class="w-400px lt-sm:w-300px">
        <header class="flex-y-center justify-between">
          <SystemLogo class="size-64px lt-sm:size-48px" />
          <h3 class="text-28px text-primary font-500 lt-sm:text-22px">{{ $t('system.title') }}</h3>
          <div class="i-flex-col">
            <ThemeSchemaSwitch
              :theme-schema="themeStore.themeScheme"
              :show-tooltip="false"
              class="text-20px lt-sm:text-18px"
              @switch="themeStore.toggleThemeScheme"
            />
            <LangSwitch
              v-if="themeStore.header.multilingual.visible"
              :lang="appStore.locale"
              :lang-options="appStore.localeOptions"
              :show-tooltip="false"
              @change-lang="appStore.changeLocale"
            />
          </div>
        </header>
        <main class="pt-24px">
          <div v-if="showLoginModeTabs" class="login-mode-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              class="login-mode-tab"
              :class="{ 'login-mode-tab--active': currentModule === 'pwd-login' }"
              :style="currentModule === 'pwd-login' ? { color: themeStore.themeColor } : undefined"
              :aria-selected="currentModule === 'pwd-login'"
              @click="toggleLoginModule('pwd-login')"
            >
              {{ $t('page.login.passkey.accountTab') }}
            </button>
            <button
              type="button"
              role="tab"
              class="login-mode-tab"
              :class="{ 'login-mode-tab--active': currentModule === 'passkey-login' }"
              :style="currentModule === 'passkey-login' ? { color: themeStore.themeColor } : undefined"
              :aria-selected="currentModule === 'passkey-login'"
              @click="toggleLoginModule('passkey-login')"
            >
              {{ $t('page.login.passkey.biometricTab') }}
            </button>
          </div>
          <div v-else class="flex-y-center gap-6px">
            <h3 class="text-18px text-primary font-medium">{{ $t(activeModuleLabel) }}</h3>
            <NTooltip v-if="authStore.requiresTwoFactor" placement="right">
              <template #trigger>
                <span class="inline-flex cursor-pointer text-18px text-primary">
                  <SvgIcon icon="mdi:information-outline" />
                </span>
              </template>
              <span>{{ $t('page.login.twoFactor.help') }}</span>
            </NTooltip>
          </div>
          <div class="pt-24px">
            <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
              <component :is="activeModule.component" />
            </Transition>
          </div>
        </main>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.login-mode-tabs {
  display: flex;
  justify-content: flex-start;
  gap: 28px;
}

.login-mode-tab {
  position: relative;
  padding: 0 0 14px;
  border: 0;
  color: #9099a6;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  background: transparent;
  cursor: pointer;
  transition: color 0.2s ease;
}

.login-mode-tab--active::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 32px;
  height: 5px;
  border-radius: 3px;
  background: currentcolor;
  content: '';
  transform: translateX(-50%);
}

@media (max-width: 640px) {
  .login-mode-tabs {
    gap: 22px;
  }

  .login-mode-tab {
    font-size: 17px;
  }
}
</style>
