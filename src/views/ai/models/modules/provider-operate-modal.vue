<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchCreateLLMProvider, fetchUpdateLLMProvider } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'ProviderOperateModal'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData: Api.AI.LLMProvider | null;
}

const props = defineProps<Props>();

const providerId = computed(() => props.rowData?.id ?? 0);

const isEdit = computed(() => props.operateType === 'edit');

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.ai.providers.add'),
    edit: $t('page.ai.providers.edit')
  };
  return titles[props.operateType];
});

type Model = Api.AI.LLMProviderCreateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    name: '',
    base_url: '',
    api_key: null,
    description: null,
    status: '1'
  };
}

type RuleKey = Extract<keyof Model, 'name' | 'base_url'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  base_url: defaultRequiredRule
};

function handleInitModel() {
  model.value = createDefaultModel();

  if (isEdit.value && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeModal() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  if (!isEdit.value) {
    const { error } = await fetchCreateLLMProvider(model.value);
    if (!error) {
      window.$message?.success($t('common.addSuccess'));
      closeModal();
      emit('submitted');
    }
  } else {
    const { error } = await fetchUpdateLLMProvider(providerId.value, model.value);
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      closeModal();
      emit('submitted');
    }
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" :mask-closable="false" class="min-w-450px w-450px">
    <NForm ref="formRef" :model="model" :rules="rules" require-mark-placement="right" class="w-full pt-5px">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="24" :label="$t('page.ai.providers.name')" path="name">
          <NInput
            v-model:value="model.name"
            :placeholder="$t('page.ai.providers.form.name')"
            show-count
            :maxlength="32"
            clearable
          />
        </NFormItemGi>

        <NFormItemGi span="24" :label="$t('page.ai.providers.baseUrl')" path="base_url">
          <NInput
            v-model:value="model.base_url"
            :placeholder="$t('page.ai.providers.form.baseUrl')"
            show-count
            :maxlength="255"
            clearable
          />
        </NFormItemGi>

        <NFormItemGi span="24" :label="$t('page.ai.providers.apiKey')" path="api_key">
          <NInput
            v-model:value="model.api_key"
            :placeholder="$t('page.ai.providers.form.apiKey')"
            type="password"
            show-password-on="click"
            :maxlength="255"
            clearable
          />
        </NFormItemGi>
      </NGrid>
    </NForm>

    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
