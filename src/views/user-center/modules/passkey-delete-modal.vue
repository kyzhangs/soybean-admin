<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { fetchDeletePasskey } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'PasskeyDeleteModal' });

interface Props {
  visible: boolean;
  passkey: Api.UserCenter.Passkey | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  submitted: [];
}>();

const { formRef, validate } = useNaiveForm();
const loading = ref(false);
const model = reactive({ password: '' });
const rules = computed(() => {
  const { createRequiredRule } = useFormRules();
  return {
    password: [createRequiredRule($t('page.user-center.passkey.form.password'))]
  };
});

function close() {
  emit('update:visible', false);
}

function reset() {
  model.password = '';
  formRef.value?.restoreValidation();
}

async function submit() {
  if (!props.passkey || loading.value) return;
  await validate();

  loading.value = true;
  try {
    const { error } = await fetchDeletePasskey(props.passkey.id, model.password);
    if (!error) {
      window.$message?.success($t('page.user-center.passkey.deleteSuccess'));
      emit('submitted');
      close();
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <NModal :show="props.visible" preset="card" class="w-480px lt-sm:w-90%" @after-leave="reset" @close="close">
    <template #header>{{ $t('page.user-center.passkey.deleteTitle') }}</template>

    <NAlert type="warning" class="mb-16px">
      {{ $t('page.user-center.passkey.deleteTip', { name: props.passkey?.name || '' }) }}
    </NAlert>

    <NForm ref="formRef" :model="model" :rules="rules" label-placement="top">
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
        <NButton type="error" :loading="loading" @click="submit">
          {{ $t('page.user-center.passkey.delete') }}
        </NButton>
      </div>
    </template>
  </NModal>
</template>
