<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { fetchBatchUser, fetchResetUserPassword } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'UserPasswordResetModal'
});

type ResetMode = 'single' | 'batch';

interface Props {
  mode: ResetMode;
  userId?: string;
  username?: string;
  ids?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  userId: '',
  username: '',
  ids: () => []
});

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const loading = ref(false);
const { formRef, validate, restoreValidation } = useNaiveForm();

const model = reactive({
  password: '',
  confirmPassword: ''
});

const rules = computed(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();

  return {
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  };
});

const title = computed(() => {
  if (props.mode === 'single') {
    return $t('page.system-manage.users.resetPasswordTitle', { username: props.username });
  }

  return $t('page.system-manage.users.batchResetPasswordTitle', { count: props.ids.length });
});

function closeModal() {
  visible.value = false;
}

async function resetPassword() {
  if (props.mode === 'single') {
    if (!props.userId) return true;

    const { error } = await fetchResetUserPassword(props.userId, { password: model.password });
    return error;
  }

  const { error } = await fetchBatchUser({
    operate: 'RESET_PASSWORD',
    ids: props.ids,
    password: model.password
  });
  return error;
}

async function handleSubmit() {
  if (loading.value) return;

  await validate();
  loading.value = true;

  try {
    const error = await resetPassword();
    if (!error) {
      closeModal();
      emit('submitted');
    }
  } finally {
    loading.value = false;
  }
}

watch(visible, () => {
  if (visible.value) {
    model.password = '';
    model.confirmPassword = '';
    restoreValidation();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" :mask-closable="false" class="w-480px max-w-95vw">
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      @keyup.enter="handleSubmit"
    >
      <NFormItem :label="$t('page.system-manage.users.newPassword')" path="password">
        <NInput
          v-model:value="model.password"
          type="password"
          show-password-on="click"
          :maxlength="18"
          :placeholder="$t('page.system-manage.users.form.newPassword')"
        />
      </NFormItem>
      <NFormItem :label="$t('page.system-manage.users.confirmPassword')" path="confirmPassword">
        <NInput
          v-model:value="model.confirmPassword"
          type="password"
          show-password-on="click"
          :maxlength="18"
          :placeholder="$t('page.system-manage.users.form.confirmPassword')"
        />
      </NFormItem>
    </NForm>

    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton :disabled="loading" @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" :loading="loading" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
