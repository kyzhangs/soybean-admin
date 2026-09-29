<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateAuthProvider, fetchUpdateAuthProvider } from '@/service/api';
import { icons } from '@/views/plugin/icon/icons';

defineOptions({ name: 'AuthProviderBasicModal' });

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData: Api.Authx.AuthProvider | null;
}

type FormModel = Api.Authx.AuthProviderCreateParams;

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'submitted'): void }>();
const visible = defineModel<boolean>('visible', { default: false });
const submitting = ref(false);
const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const isEdit = computed(() => props.operateType === 'edit');
const title = computed(() => (isEdit.value ? $t('page.authx.form.editTitle') : $t('page.authx.form.addTitle')));
const model = ref<FormModel>(createDefaultModel());
const providerIcons = ['mdi:shield-account-outline', ...icons];
const iconValue = computed({
  get: () => model.value.icon || '',
  set: value => {
    model.value.icon = value || null;
  }
});
const rules = computed<Record<string, App.Global.FormRule>>(() => ({
  name: { ...defaultRequiredRule, key: 'basic' },
  code: {
    key: 'basic',
    required: true,
    trigger: ['blur', 'input'],
    pattern: /^[a-z][a-z0-9_-]*$/,
    message: $t('page.authx.form.validation.code')
  }
}));

function createDefaultModel(): FormModel {
  return { name: '', code: '', icon: null, sort: 0 };
}

function initModel() {
  model.value = createDefaultModel();
  if (!props.rowData) return;
  Object.assign(model.value, {
    name: props.rowData.name,
    code: props.rowData.code,
    icon: props.rowData.icon,
    sort: props.rowData.sort
  });
}

async function submit() {
  submitting.value = true;
  try {
    await validate();
    const response = isEdit.value
      ? await fetchUpdateAuthProvider(props.rowData!.id, {
          name: model.value.name,
          icon: model.value.icon,
          sort: model.value.sort
        })
      : await fetchCreateAuthProvider(model.value);
    if (!response.error) {
      window.$message?.success(
        isEdit.value ? $t('page.authx.form.message.updateSuccess') : $t('page.authx.form.message.createSuccess')
      );
      visible.value = false;
      emit('submitted');
    }
  } finally {
    submitting.value = false;
  }
}

watch(visible, value => {
  if (!value) return;
  initModel();
  restoreValidation();
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" :mask-closable="false" class="max-w-95vw w-520px">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="top">
      <NAlert v-if="!isEdit" class="mb-16px" type="info" show-icon>
        {{ $t('page.authx.form.section.basicTip') }}
      </NAlert>
      <NGrid :cols="1">
        <NFormItemGi :label="$t('page.authx.form.label.name')" path="name">
          <NInput v-model:value="model.name" />
        </NFormItemGi>
        <NFormItemGi :label="$t('page.authx.form.label.code')" path="code">
          <NInput v-model:value="model.code" :disabled="isEdit" :placeholder="$t('page.authx.form.placeholder.code')" />
        </NFormItemGi>
        <NFormItemGi :label="$t('page.authx.form.label.icon')">
          <CustomIconSelect v-model:value="iconValue" :icons="providerIcons" />
        </NFormItemGi>
        <NFormItemGi :label="$t('page.authx.form.label.sort')">
          <NInputNumber v-model:value="model.sort" class="w-full" />
        </NFormItemGi>
      </NGrid>
    </NForm>
    <template #footer>
      <NSpace justify="end">
        <NButton @click="visible = false">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" :loading="submitting" @click="submit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
