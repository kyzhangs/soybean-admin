<script setup lang="ts">
import { computed } from 'vue';
import { browserSupportsWebAuthn } from '@simplewebauthn/browser';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';

defineOptions({
  name: 'PasskeyLogin'
});

const authStore = useAuthStore();
const supported = computed(() => browserSupportsWebAuthn());

function loginWithPasskey() {
  if (!supported.value || authStore.loginLoading) return;

  authStore.loginWithPasskey();
}
</script>

<template>
  <div class="flex-col-stretch gap-24px">
    <div class="flex-col-center gap-14px py-8px text-center h-200px">
      <button
        type="button"
        class="size-96px flex-center cursor-pointer border-0 rd-50% bg-primary/12 text-42px text-primary transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!supported || authStore.loginLoading"
        :aria-label="$t('page.login.passkey.login')"
        @click="loginWithPasskey"
      >
        <SvgIcon
          :icon="authStore.loginLoading ? 'mdi:loading' : 'mdi:fingerprint'"
          :class="{ 'animate-spin': authStore.loginLoading }"
        />
      </button>
    </div>

    <NAlert v-if="!supported" type="warning" :show-icon="true">
      {{ $t('page.login.passkey.unsupported') }}
    </NAlert>

    <NButton
      text
      type="primary"
      size="large"
      class="self-center text-18px"
      :disabled="!supported || authStore.loginLoading"
      @click="loginWithPasskey"
    >
      {{ $t('page.login.passkey.login') }}
    </NButton>
  </div>
</template>
