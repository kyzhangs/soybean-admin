<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import type { InputOtpInst } from 'naive-ui';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: '2fa'
});

const authStore = useAuthStore();
const { replaceLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  code: string;
}

const model: FormModel = reactive({
  code: ''
});
const useRecoveryCode = ref(false);
const otpRef = ref<InputOtpInst | null>(null);
const otpValue = computed<string[]>({
  get: () => model.code.slice(0, useRecoveryCode.value ? 16 : 6).split(''),
  set: value => {
    const code = value.join('');
    model.code = useRecoveryCode.value ? code.toUpperCase() : code;
  }
});
const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { createRequiredRule } = useFormRules();

  return {
    code: [createRequiredRule($t('page.login.twoFactor.codePlaceholder'))]
  };
});

async function focusFirstInput() {
  await nextTick();
  otpRef.value?.focusOnChar(0);
}

async function handleSubmit() {
  if (authStore.loginLoading) return;

  await validate();
  await authStore.verifyTwoFactor(model.code);
}

function allowOtpInput(char: string) {
  return /^\d$/.test(char);
}

function allowRecoveryCodeInput(char: string) {
  return /^[\dA-Fa-f]$/.test(char);
}

async function toggleRecoveryCode() {
  model.code = '';
  useRecoveryCode.value = !useRecoveryCode.value;
  await focusFirstInput();
}

async function backToLogin() {
  authStore.cancelTwoFactor();
  await replaceLoginModule('pwd-login');
}

onMounted(async () => {
  if (!authStore.requiresTwoFactor) {
    await replaceLoginModule('pwd-login');
    return;
  }

  await focusFirstInput();
});
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem path="code">
      <NInputOtp
        ref="otpRef"
        v-model:value="otpValue"
        :length="useRecoveryCode ? 16 : 6"
        class="two-factor-otp"
        :class="[{ 'two-factor-otp--recovery': useRecoveryCode }]"
        :allow-input="useRecoveryCode ? allowRecoveryCodeInput : allowOtpInput"
        @finish="handleSubmit"
      />
    </NFormItem>

    <NSpace vertical :size="18" align="center">
      <NButton text type="primary" :disabled="authStore.loginLoading" @click="toggleRecoveryCode">
        {{
          useRecoveryCode ? $t('page.login.twoFactor.useAuthenticatorCode') : $t('page.login.twoFactor.useRecoveryCode')
        }}
      </NButton>
      <NButton text :disabled="authStore.loginLoading" @click="backToLogin">
        {{ $t('page.login.common.back') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped>
.two-factor-otp {
  --otp-gap: clamp(10px, 2vw, 20px);

  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  width: 100%;
  gap: var(--otp-gap);
}

.two-factor-otp :deep(.n-input) {
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 1;
}

.two-factor-otp :deep(.n-input-wrapper) {
  align-items: center;
}

.two-factor-otp :deep(.n-input__input-el) {
  font-size: clamp(20px, 4vw, 24px);
  font-weight: 600;
}

.two-factor-otp :deep(.n-input + .n-input::before) {
  content: '-';
  position: absolute;
  top: 50%;
  left: calc(var(--otp-gap) / -2);
  color: var(--n-text-color);
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: 700;
  opacity: 0.7;
}

.two-factor-otp--recovery {
  --otp-gap: 10px;

  grid-template-columns: repeat(8, minmax(0, 1fr));
  row-gap: 12px;
}

.two-factor-otp--recovery :deep(.n-input + .n-input::before) {
  content: none;
}

.two-factor-otp--recovery :deep(.n-input:nth-child(5)::before),
.two-factor-otp--recovery :deep(.n-input:nth-child(13)::before) {
  content: '-';
}
</style>
