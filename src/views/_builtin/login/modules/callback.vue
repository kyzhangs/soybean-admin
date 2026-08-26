<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { authExceptionMessageRecord } from '@/constants/business';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

defineOptions({ name: 'Callback' });

const route = useRoute();
const authStore = useAuthStore();
const { toLogin } = useRouterPush();
const failed = ref(false);
const testProfile = ref<any>(null);
const failureMessage = computed(() => {
  const errorCode = typeof route.query.error === 'string' ? route.query.error : '';
  const messageKey = authExceptionMessageRecord[errorCode] || 'page.login.callback.failed';
  return $t(messageKey);
});

function decodeTestProfile(rawData: string) {
  try {
    const padLength = rawData.length + ((4 - (rawData.length % 4)) % 4);
    const normalized = rawData.replace(/-/g, '+').replace(/_/g, '/').padEnd(padLength, '=');
    const decoded = atob(normalized);
    const bytes = Uint8Array.from(decoded, char => char.charCodeAt(0));
    testProfile.value = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    testProfile.value = null;
    failed.value = true;
  }
}

onMounted(async () => {
  const testProfileData = route.query.test_profile_data;
  if (route.query.test_profile === '1') {
    if (typeof testProfileData === 'string') {
      decodeTestProfile(testProfileData);
      if (testProfile.value && route.query.provider_code) {
        const messagePayload = {
          type: 'AUTH_PROVIDER_TEST_PROFILE',
          providerCode: String(route.query.provider_code),
          profile: JSON.parse(JSON.stringify(testProfile.value))
        };
        if (window.opener) {
          window.opener.postMessage(messagePayload, window.location.origin);
          window.close();
        }
      }
    } else {
      failed.value = true;
    }
    return;
  }

  const ticket = typeof route.query.ticket === 'string' ? route.query.ticket : '';
  if (!ticket || !(await authStore.loginWithCasTicket(ticket))) failed.value = true;
});
</script>

<template>
  <div class="flex flex-col items-center gap-20px py-20px text-center">
    <template v-if="!failed">
      <NSpin size="large" />
      <p class="text-15px text-#64748b">{{ $t('page.login.callback.exchanging') }}</p>
    </template>
    <template v-else>
      <SvgIcon icon="mdi:alert-circle-outline" class="text-42px text-error" />
      <p class="text-15px text-#64748b">{{ failureMessage }}</p>
      <NButton type="primary" @click="toLogin('pwd-login', '/')">{{ $t('page.login.callback.back') }}</NButton>
    </template>
  </div>
</template>
