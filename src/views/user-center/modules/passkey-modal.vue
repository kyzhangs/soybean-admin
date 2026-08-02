<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { WebAuthnError, browserSupportsWebAuthn, startRegistration } from '@simplewebauthn/browser';
import { fetchPasskeyRegistrationOptions, fetchVerifyPasskeyRegistration } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'PasskeyModal'
});

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  submitted: [];
}>();

const { formRef, validate } = useNaiveForm();
const loading = ref(false);
const model = reactive({
  name: '',
  password: ''
});
const supported = computed(() => browserSupportsWebAuthn());
const rules = computed(() => {
  const { createRequiredRule } = useFormRules();
  return {
    name: [createRequiredRule($t('page.user-center.passkey.form.name'))],
    password: [createRequiredRule($t('page.user-center.passkey.form.password'))]
  };
});

function close() {
  emit('update:visible', false);
}

function reset() {
  model.name = '';
  model.password = '';
  formRef.value?.restoreValidation();
}

function getRegistrationErrorMessage(error: unknown) {
  if (error instanceof WebAuthnError) {
    const messageMap: Record<WebAuthnError['code'], string> = {
      ERROR_CEREMONY_ABORTED: $t('page.user-center.passkey.registrationError.cancelled'),
      ERROR_INVALID_DOMAIN: $t('page.user-center.passkey.registrationError.invalidDomain'),
      ERROR_INVALID_RP_ID: $t('page.user-center.passkey.registrationError.invalidRpId'),
      ERROR_INVALID_USER_ID_LENGTH: $t('page.user-center.passkey.registrationError.invalidUserId'),
      ERROR_MALFORMED_PUBKEYCREDPARAMS: $t('page.user-center.passkey.registrationError.invalidOptions'),
      ERROR_AUTHENTICATOR_GENERAL_ERROR: $t('page.user-center.passkey.registrationError.deviceError'),
      ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT: $t(
        'page.user-center.passkey.registrationError.discoverableCredentialUnsupported'
      ),
      ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT: $t(
        'page.user-center.passkey.registrationError.userVerificationUnsupported'
      ),
      ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED: $t('page.user-center.passkey.registrationError.alreadyRegistered'),
      ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG: $t(
        'page.user-center.passkey.registrationError.algorithmUnsupported'
      ),
      ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE: $t(
        'page.user-center.passkey.registrationError.verificationFailed'
      ),
      ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY: $t('page.user-center.passkey.registrationError.cancelled')
    };

    return messageMap[error.code];
  }

  if (error instanceof DOMException) {
    const messageMap: Record<string, string> = {
      AbortError: $t('page.user-center.passkey.registrationError.cancelled'),
      ConstraintError: $t('page.user-center.passkey.registrationError.deviceUnsupported'),
      InvalidStateError: $t('page.user-center.passkey.registrationError.alreadyRegistered'),
      NotAllowedError: $t('page.user-center.passkey.registrationError.cancelled'),
      NotSupportedError: $t('page.user-center.passkey.registrationError.deviceUnsupported'),
      SecurityError: $t('page.user-center.passkey.registrationError.insecureContext')
    };

    return messageMap[error.name] || $t('page.user-center.passkey.bindFailed');
  }

  return $t('page.user-center.passkey.bindFailed');
}

function isRegistrationCancelled(error: unknown) {
  if (error instanceof WebAuthnError) {
    return error.code === 'ERROR_CEREMONY_ABORTED' || error.code === 'ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY';
  }

  return error instanceof DOMException && (error.name === 'AbortError' || error.name === 'NotAllowedError');
}

async function submit() {
  if (!supported.value || loading.value) return;
  await validate();

  loading.value = true;
  try {
    const { data: options, error: optionsError } = await fetchPasskeyRegistrationOptions(model.password);
    if (optionsError) return;

    const credential = await startRegistration({ optionsJSON: options.public_key });
    const { error } = await fetchVerifyPasskeyRegistration({
      flow_id: options.flow_id,
      credential,
      name: model.name
    });
    if (!error) {
      window.$message?.success($t('page.user-center.passkey.bindSuccess'));
      emit('submitted');
      close();
    }
  } catch (error) {
    const message = getRegistrationErrorMessage(error);
    if (isRegistrationCancelled(error)) {
      window.$message?.warning(message);
    } else {
      window.$message?.error(message);
      console.error('Passkey registration failed:', error);
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <NModal :show="props.visible" preset="card" class="w-480px lt-sm:w-90%" @after-leave="reset" @close="close">
    <template #header>{{ $t('page.user-center.passkey.bind') }}</template>

    <NAlert v-if="!supported" type="warning" class="mb-16px">
      {{ $t('page.login.passkey.unsupported') }}
    </NAlert>
    <NAlert v-else type="info" class="mb-16px">
      {{ $t('page.user-center.passkey.reauthenticateTip') }}
    </NAlert>

    <NForm ref="formRef" :model="model" :rules="rules" label-placement="top">
      <NFormItem path="name" :label="$t('page.user-center.passkey.name')">
        <NInput v-model:value="model.name" :placeholder="$t('page.user-center.passkey.form.name')" />
      </NFormItem>
      <NFormItem path="password" :label="$t('page.user-center.passkey.password')">
        <NInput
          v-model:value="model.password"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.user-center.passkey.form.password')"
          @keyup.enter="submit"
        />
      </NFormItem>
    </NForm>

    <template #footer>
      <div class="flex justify-end gap-12px">
        <NButton @click="close">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" :disabled="!supported" :loading="loading" @click="submit">
          {{ $t('page.user-center.passkey.bind') }}
        </NButton>
      </div>
    </template>
  </NModal>
</template>
