<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { loginModuleRecord } from '@/constants/app';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  username: string;
  password: string;
  twoFactorCode: string;
}

const model: FormModel = reactive({
  username: 'sysadmin',
  password: '111111',
  twoFactorCode: ''
});
const useRecoveryCode = ref(false);
const twoFactorOtp = computed<string[]>({
  get: () => model.twoFactorCode.slice(0, useRecoveryCode.value ? 16 : 6).split(''),
  set: value => {
    const code = value.join('');
    model.twoFactorCode = useRecoveryCode.value ? code.toUpperCase() : code;
  }
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules, createRequiredRule } = useFormRules();

  return {
    username: formRules.username,
    password: formRules.pwd,
    twoFactorCode: [createRequiredRule($t('page.login.twoFactor.codePlaceholder'))]
  };
});

async function handleSubmit() {
  if (authStore.requiresTwoFactor) {
    await handleTwoFactorSubmit();
    return;
  }
  await validate();
  await authStore.login(model.username, model.password);
}

async function handleTwoFactorSubmit() {
  if (authStore.loginLoading) return;

  await validate();
  await authStore.verifyTwoFactor(model.twoFactorCode);
}

function allowOtpInput(char: string) {
  return /^\d$/.test(char);
}

function allowRecoveryCodeInput(char: string) {
  return /^[\dA-Fa-f]$/.test(char);
}

function toggleRecoveryCode() {
  model.twoFactorCode = '';
  useRecoveryCode.value = !useRecoveryCode.value;
}

type AccountKey = 'super' | 'admin' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  username: string;
  password: string;
}

const accounts = computed<Account[]>(() => [
  {
    key: 'super',
    label: $t('page.login.pwdLogin.superAdmin'),
    username: 'sysadmin',
    password: '111111'
  },
  {
    key: 'admin',
    label: $t('page.login.pwdLogin.admin'),
    username: 'admin',
    password: '111111'
  },
  {
    key: 'user',
    label: $t('page.login.pwdLogin.user'),
    username: 'user',
    password: '111111'
  }
]);

async function handleAccountLogin(account: Account) {
  await authStore.login(account.username, account.password);
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <template v-if="!authStore.requiresTwoFactor">
      <NFormItem path="username">
        <NInput v-model:value="model.username" :placeholder="$t('page.login.common.usernamePlaceholder')" />
      </NFormItem>
      <NFormItem path="password">
        <NInput
          v-model:value="model.password"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.login.common.passwordPlaceholder')"
        />
      </NFormItem>
    </template>
    <template v-else>
      <NFormItem path="twoFactorCode">
        <NInputOtp
          v-model:value="twoFactorOtp"
          :length="useRecoveryCode ? 16 : 6"
          class="two-factor-otp"
          :class="[{ 'two-factor-otp--recovery': useRecoveryCode }]"
          :allow-input="useRecoveryCode ? allowRecoveryCodeInput : allowOtpInput"
          @finish="handleTwoFactorSubmit"
        />
      </NFormItem>
    </template>
    <NSpace vertical :size="24">
      <div v-if="!authStore.requiresTwoFactor" class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </NButton>
      </div>
      <NButton
        v-if="!authStore.requiresTwoFactor"
        type="primary"
        size="large"
        round
        block
        :loading="authStore.loginLoading"
        @click="handleSubmit"
      >
        {{ $t('common.confirm') }}
      </NButton>
      <NButton v-if="authStore.requiresTwoFactor" size="large" round block @click="toggleRecoveryCode">
        {{
          useRecoveryCode ? $t('page.login.twoFactor.useAuthenticatorCode') : $t('page.login.twoFactor.useRecoveryCode')
        }}
      </NButton>
      <template v-else>
        <div class="flex-y-center justify-between gap-12px">
          <NButton class="flex-1" block @click="toggleLoginModule('code-login')">
            {{ $t(loginModuleRecord['code-login']) }}
          </NButton>
          <NButton class="flex-1" block @click="toggleLoginModule('register')">
            {{ $t(loginModuleRecord.register) }}
          </NButton>
        </div>
        <NDivider class="text-14px text-#666 !m-0">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</NDivider>
        <div class="flex-center gap-12px">
          <NButton v-for="item in accounts" :key="item.key" type="primary" @click="handleAccountLogin(item)">
            {{ item.label }}
          </NButton>
        </div>
      </template>
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
