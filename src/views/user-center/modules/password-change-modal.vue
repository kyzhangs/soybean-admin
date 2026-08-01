<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { fetchChangePassword } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'PasswordChangeModal'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

const loading = ref(false);
const { formRef, validate, restoreValidation } = useNaiveForm();
const model = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const rules = computed(() => {
  const { formRules, createRequiredRule, createConfirmPwdRule } = useFormRules();

  return {
    oldPassword: [createRequiredRule($t('page.user-center.form.oldPassword'))],
    newPassword: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.newPassword)
  };
});

function closeModal() {
  visible.value = false;
}

async function handleSubmit() {
  if (loading.value) return;

  await validate();
  loading.value = true;

  try {
    const { error } = await fetchChangePassword({
      old_password: model.oldPassword,
      new_password: model.newPassword,
      confirm_password: model.confirmPassword
    });
    if (!error) {
      window.$message?.success($t('common.modifySuccess'));
      closeModal();
    }
  } finally {
    loading.value = false;
  }
}

watch(visible, () => {
  if (visible.value) {
    model.oldPassword = '';
    model.newPassword = '';
    model.confirmPassword = '';
    restoreValidation();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    :title="$t('page.user-center.modifyPwd')"
    preset="card"
    :mask-closable="false"
    class="w-480px max-w-95vw"
  >
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      @keyup.enter="handleSubmit"
    >
      <NFormItem :label="$t('page.user-center.oldPassword')" path="oldPassword">
        <NInput
          v-model:value="model.oldPassword"
          type="password"
          show-password-on="click"
          :maxlength="128"
          :placeholder="$t('page.user-center.form.oldPassword')"
        />
      </NFormItem>
      <NFormItem :label="$t('page.user-center.newPassword')" path="newPassword">
        <NInput
          v-model:value="model.newPassword"
          type="password"
          show-password-on="click"
          :maxlength="18"
          :placeholder="$t('page.user-center.form.newPassword')"
        />
      </NFormItem>
      <NFormItem :label="$t('page.user-center.confirmPassword')" path="confirmPassword">
        <NInput
          v-model:value="model.confirmPassword"
          type="password"
          show-password-on="click"
          :maxlength="18"
          :placeholder="$t('page.user-center.form.confirmPassword')"
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
