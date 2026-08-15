<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

defineOptions({ name: 'Callback' });

const route = useRoute();
const authStore = useAuthStore();
const { toLogin } = useRouterPush();
const failed = ref(false);
const authExceptionMessages: Record<string, string> = {
  '100160': '统一身份认证未启用',
  '100161': '统一身份认证流程无效或已过期',
  '100162': '统一身份认证票据丢失',
  '100163': '统一身份认证服务暂时不可用',
  '100164': '统一身份认证票据验证失败',
  '100165': '统一身份认证验证响应格式无效',
  '100166': '统一身份认证未返回稳定身份标识',
  '100167': '统一身份认证尚未绑定本地账号',
  '100168': '统一身份认证票据无效或已过期',
  '100169': '统一身份认证退出通知格式无效',
  '100170': '统一身份认证请求过于频繁，请稍后重试',
  '100180': '认证提供方不存在',
  '100181': '认证提供方未启用',
  '100182': '认证提供方配置无效',
  '100183': '认证登录流程无效或已过期',
  '100184': '认证登录请求过于频繁，请稍后重试',
  '100185': '认证登录票据无效或已过期',
  '100186': '外部身份尚未绑定本地账号',
  '100187': '认证提供方回调无效',
  '100188': '认证提供方暂时不可用',
  '100189': '该外部账号已绑定其他用户',
  '100190': '当前用户已绑定该认证提供方'
};
const failureMessage = computed(() => {
  const errorCode = typeof route.query.error === 'string' ? route.query.error : '';
  return authExceptionMessages[errorCode] || $t('page.login.cas.failed');
});

onMounted(async () => {
  const ticket = typeof route.query.ticket === 'string' ? route.query.ticket : '';
  if (!ticket || !(await authStore.loginWithCasTicket(ticket))) failed.value = true;
});
</script>

<template>
  <div class="flex flex-col items-center gap-20px py-20px text-center">
    <template v-if="!failed">
      <NSpin size="large" />
      <p class="text-15px text-#64748b">{{ $t('page.login.cas.exchanging') }}</p>
    </template>
    <template v-else>
      <SvgIcon icon="mdi:alert-circle-outline" class="text-42px text-error" />
      <p class="text-15px text-#64748b">{{ failureMessage }}</p>
      <NButton type="primary" @click="toLogin('pwd-login', '/')">{{ $t('page.login.cas.back') }}</NButton>
    </template>
  </div>
</template>
