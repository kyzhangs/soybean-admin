<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { fetchResetUserPassword } from '@/service/api';
  import { useFormRules, useNaiveForm } from '@/hooks/common/form';
  import { $t } from '@/locales';

  defineOptions({
    name: 'ResetPasswordModal'
  });

  interface Props {
    /** 要重置密码的用户ID */
    userId: number;
  }

  const props = defineProps<Props>();

  interface Emits {
    (e: 'submitted'): void;
  }

  const emit = defineEmits<Emits>();

  const visible = defineModel<boolean>('visible', {
    default: false
  });

  const { formRef, validate, restoreValidation } = useNaiveForm();
  const { formRules } = useFormRules();

  interface FormModel {
    password: string;
  }

  const model: FormModel = reactive({
    password: ''
  });

  // 生成随机密码
  function generateRandomPassword() {
    // 生成8-12位的随机密码
    const minLen = 8;
    const maxLen = 12;
    const length = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789';
    let password = '';
    for (let i = 0; i < length; i += 1) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    model.password = password;
    window.$message?.success($t('page.manage.user.msg.randomPasswordSuccess'));
  }

  const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
    return {
      password: formRules.pwd
    };
  });

  function closeModal() {
    visible.value = false;
    restoreValidation();
    model.password = '';
  }

  async function handleSubmit() {
    await validate();

    const { error } = await fetchResetUserPassword(props.userId, { password: model.password });

    if (!error) {
      window.$message?.success($t('page.manage.user.msg.resetPasswordSuccess'));
      emit('submitted');
      closeModal();
    }
  }
</script>

<template>
  <NModal
    v-model:show="visible"
    :title="$t('page.manage.user.title.reset')"
    preset="dialog"
    class="w-400px"
    :mask-closable="false"
  >
    <NDivider />
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-align="right"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <NFormItem :label="$t('page.manage.user.password')" path="password">
        <NInput
          v-model:value="model.password"
          type="password"
          show-count
          :maxlength="16"
          show-password-on="click"
          :placeholder="$t('page.manage.user.placeholder.password')"
        >
          <template #suffix>
            <NButton
              size="small"
              quaternary
              circle
              :title="$t('common.generateRandom')"
              @click="generateRandomPassword"
            >
              <template #icon>
                <IconIcRoundRefresh class="text-16px" />
              </template>
            </NButton>
          </template>
        </NInput>
      </NFormItem>
    </NForm>
    <template #action>
      <NSpace justify="end" :size="16">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
