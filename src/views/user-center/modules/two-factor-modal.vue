<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useClipboard } from '@vueuse/core';
import {
  fetchDisableTwoFactor,
  fetchEnableTwoFactor,
  fetchRegenerateTwoFactorRecoveryCodes,
  fetchSetupTwoFactor
} from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'TwoFactorModal'
});

interface Props {
  enabled: boolean;
  action?: 'toggle' | 'regenerate';
}

const props = withDefaults(defineProps<Props>(), {
  action: 'toggle'
});

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

type Stage = 'password' | 'scan' | 'recovery' | 'disable' | 'regenerate';

const stage = ref<Stage>('password');
const loading = ref(false);
const setup = ref<Api.UserCenter.TwoFactorSetup | null>(null);
const recoveryCodes = ref<string[]>([]);
const useRecoveryCode = ref(false);
const { formRef, validate, restoreValidation } = useNaiveForm();
const { copy, isSupported } = useClipboard();
const model = reactive({
  password: '',
  code: ''
});
const otpCode = computed<string[]>({
  get: () => model.code.slice(0, useRecoveryCode.value ? 16 : 6).split(''),
  set: value => {
    const code = value.join('');
    model.code = useRecoveryCode.value ? code.toUpperCase() : code;
  }
});

const rules = computed(() => {
  const { formRules, createRequiredRule } = useFormRules();

  return {
    password: formRules.pwd,
    code: [createRequiredRule($t('page.user-center.twoFactor.form.code'))]
  };
});

const title = computed(() => {
  if (props.action === 'regenerate') return $t('page.user-center.twoFactor.regenerateRecoveryCodes');

  return props.enabled ? $t('page.user-center.twoFactor.disable') : $t('page.user-center.twoFactor.enable');
});
const formAlert = computed<{ type: 'info' | 'warning'; message: App.I18n.I18nKey }>(() => {
  if (stage.value === 'password') {
    return {
      type: 'info',
      message: 'page.user-center.twoFactor.reauthenticateTip'
    };
  }
  if (stage.value === 'disable') {
    return {
      type: 'warning',
      message: 'page.user-center.twoFactor.disableTip'
    };
  }

  return {
    type: 'warning',
    message: 'page.user-center.twoFactor.regenerateTip'
  };
});

function closeModal() {
  visible.value = false;
}

function allowOtpInput(char: string) {
  return /^\d$/.test(char);
}

function allowRecoveryCodeInput(char: string) {
  return /^[\dA-Fa-f]$/.test(char);
}

function showOtpSeparator(index: number) {
  if (useRecoveryCode.value) return index === 4 || index === 12;

  return index > 0;
}

function toggleRecoveryCode() {
  model.code = '';
  useRecoveryCode.value = !useRecoveryCode.value;
  restoreValidation();
}

async function handleSetup() {
  await validate();
  loading.value = true;
  try {
    const { data, error } = await fetchSetupTwoFactor({ password: model.password });
    if (!error) {
      setup.value = data;
      model.code = '';
      stage.value = 'scan';
      restoreValidation();
    }
  } finally {
    loading.value = false;
  }
}

async function handleEnable() {
  if (loading.value) return;

  await validate();
  loading.value = true;
  try {
    const { data, error } = await fetchEnableTwoFactor({ code: model.code });
    if (!error) {
      recoveryCodes.value = data.recovery_codes;
      stage.value = 'recovery';
    }
  } finally {
    loading.value = false;
  }
}

async function handleDisable() {
  if (loading.value) return;

  await validate();
  loading.value = true;
  try {
    const { error } = await fetchDisableTwoFactor({
      password: model.password,
      code: model.code
    });
    if (!error) {
      window.$message?.success($t('common.modifySuccess'));
      emit('submitted');
      closeModal();
    }
  } finally {
    loading.value = false;
  }
}

async function handleRegenerate() {
  if (loading.value) return;

  await validate();
  loading.value = true;
  try {
    const { data, error } = await fetchRegenerateTwoFactorRecoveryCodes({
      password: model.password,
      code: model.code
    });
    if (!error) {
      recoveryCodes.value = data.recovery_codes;
      stage.value = 'recovery';
    }
  } finally {
    loading.value = false;
  }
}

async function handleCodeFinished() {
  if (stage.value === 'regenerate') {
    await handleRegenerate();
    return;
  }

  await handleDisable();
}

async function copyRecoveryCodes() {
  if (!isSupported.value) {
    window.$message?.error($t('page.user-center.twoFactor.clipboardUnsupported'));
    return;
  }

  await copy(recoveryCodes.value.join('\n'));
  window.$message?.success($t('page.user-center.twoFactor.copySuccess'));
}

function exportRecoveryCodes() {
  const content = `${recoveryCodes.value.join('\n')}\n`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  link.href = url;
  link.download = `two-factor-recovery-codes-${timestamp}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  window.$message?.success($t('page.user-center.twoFactor.exportSuccess'));
}

function handleComplete() {
  closeModal();
  emit('submitted');
}

watch(visible, () => {
  if (!visible.value) return;

  stage.value = props.action === 'regenerate' ? 'regenerate' : props.enabled ? 'disable' : 'password';
  model.password = '';
  model.code = '';
  useRecoveryCode.value = false;
  setup.value = null;
  recoveryCodes.value = [];
  restoreValidation();
});
</script>

<template>
  <NModal
    v-model:show="visible"
    :title="title"
    preset="card"
    :mask-closable="false"
    :close-on-esc="stage !== 'recovery'"
    :closable="stage !== 'recovery'"
    class="w-520px max-w-95vw"
  >
    <NForm
      v-if="stage === 'password' || stage === 'disable' || stage === 'regenerate'"
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="top"
      label-width="auto"
    >
      <NAlert :type="formAlert.type" class="mb-18px">
        {{ $t(formAlert.message) }}
      </NAlert>
      <NFormItem :label="$t('page.user-center.twoFactor.password')" path="password">
        <NInput
          v-model:value="model.password"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.user-center.twoFactor.form.password')"
        />
      </NFormItem>
      <NFormItem v-if="stage !== 'password'" :label="$t('page.user-center.twoFactor.code')" path="code">
        <div class="w-full">
          <NInputOtp
            v-model:value="otpCode"
            :length="useRecoveryCode ? 16 : 6"
            class="two-factor-otp"
            :class="[{ 'two-factor-otp--recovery': useRecoveryCode }]"
            :allow-input="useRecoveryCode ? allowRecoveryCodeInput : allowOtpInput"
            @finish="handleCodeFinished"
          >
            <template #default="{ index, ref: inputRef, ...inputProps }">
              <span v-if="showOtpSeparator(index)" class="otp-separator">-</span>
              <NInput :ref="inputRef as any" v-bind="inputProps" />
            </template>
          </NInputOtp>
        </div>
      </NFormItem>
    </NForm>

    <div v-else-if="stage === 'scan' && setup" class="flex-col items-center gap-16px">
      <NAlert type="info" class="w-full">
        {{ $t('page.user-center.twoFactor.scanTip') }}
      </NAlert>
      <img :src="setup.qr_code" :alt="$t('page.user-center.twoFactor.qrCode')" class="size-220px" />
      <div class="w-full">
        <div class="mb-6px text-13px text-#6b7280">{{ $t('page.user-center.twoFactor.manualSecret') }}</div>
        <NInput :value="setup.secret" readonly />
      </div>
      <NForm ref="formRef" :model="model" :rules="rules" class="w-full">
        <NFormItem :label="$t('page.user-center.twoFactor.code')" path="code">
          <NInputOtp v-model:value="otpCode" class="two-factor-otp" :allow-input="allowOtpInput" @finish="handleEnable">
            <template #default="{ index, ref: inputRef, ...inputProps }">
              <span v-if="showOtpSeparator(index)" class="otp-separator">-</span>
              <NInput :ref="inputRef as any" v-bind="inputProps" />
            </template>
          </NInputOtp>
        </NFormItem>
      </NForm>
    </div>

    <div v-else class="flex-col-stretch gap-16px">
      <NAlert type="warning">
        {{ $t('page.user-center.twoFactor.recoveryTip') }}
      </NAlert>
      <div class="relative">
        <pre class="m-0 rd-6px bg-#f3f4f6 p-16px text-center leading-28px dark:bg-#1f2937">{{
          recoveryCodes.join('\n')
        }}</pre>
        <NButton
          class="absolute right-8px top-8px"
          quaternary
          circle
          size="small"
          :disabled="!isSupported"
          :title="$t('page.user-center.twoFactor.copyRecoveryCodes')"
          :aria-label="$t('page.user-center.twoFactor.copyRecoveryCodes')"
          @click="copyRecoveryCodes"
        >
          <template #icon>
            <SvgIcon icon="mdi:content-copy" />
          </template>
        </NButton>
      </div>
    </div>

    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton v-if="stage === 'disable'" secondary @click="toggleRecoveryCode">
          {{
            useRecoveryCode
              ? $t('page.user-center.twoFactor.useAuthenticatorCode')
              : $t('page.user-center.twoFactor.useRecoveryCode')
          }}
        </NButton>
        <NButton v-if="stage !== 'recovery'" :disabled="loading" @click="closeModal">
          {{ $t('common.cancel') }}
        </NButton>
        <NButton v-if="stage === 'password'" type="primary" :loading="loading" @click="handleSetup">
          {{ $t('page.user-center.twoFactor.next') }}
        </NButton>
        <template v-else-if="stage === 'recovery'">
          <NButton @click="exportRecoveryCodes">
            {{ $t('page.user-center.twoFactor.exportRecoveryCodes') }}
          </NButton>
          <NButton type="primary" @click="handleComplete">{{ $t('page.user-center.twoFactor.complete') }}</NButton>
        </template>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped>
.two-factor-otp {
  --otp-size: clamp(34px, 8vw, 48px);

  display: grid;
  grid-template-columns: repeat(5, var(--otp-size) minmax(0, 1fr)) var(--otp-size);
  width: 100%;
  column-gap: 0;
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

.otp-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--n-text-color);
  font-size: 16px;
  font-weight: 700;
  opacity: 0.7;
}

.two-factor-otp--recovery {
  --otp-size: clamp(24px, 6vw, 42px);

  grid-template-columns: repeat(4, var(--otp-size)) minmax(0, 1fr) repeat(4, var(--otp-size));
  column-gap: 8px;
  row-gap: 12px;
}
</style>
