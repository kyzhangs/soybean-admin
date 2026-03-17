<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchCreateLLMModel, fetchUpdateLLMModel } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { enableStatusOptions } from '@/constants/business';
import { $t } from '@/locales';

defineOptions({
  name: 'LLMModelOperateModal'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData: Api.AI.LLMModel | null;
  providerOptions: CommonType.Option[];
}

const props = defineProps<Props>();

const llmModelId = computed(() => props.rowData?.id ?? 0);

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
    add: $t('page.ai.models.add'),
    edit: $t('page.ai.models.edit')
  };
  return titles[props.operateType];
});

type Model = Api.AI.LLMModelCreateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    name: '',
    model: '',
    description: null,
    provider_id: null,
    status: '1'
  };
}

type RuleKey = Extract<keyof Model, 'name' | 'model' | 'provider_id'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  model: defaultRequiredRule,
  provider_id: defaultRequiredRule
};

const isEdit = computed(() => props.operateType === 'edit');

const isNameManual = ref({
  is_edit: false,
  is_clear: false
});

const handleNameUpdate = (value: string) => {
  if (!isEdit.value && !isNameManual.value.is_edit) {
    model.value.model = value;
  }
};

const handleModelUpdate = (value: string) => {
  // 当用户手动编辑 name 时，设置手动编辑标记
  if (value || isNameManual.value.is_clear) {
    isNameManual.value.is_edit = true;
  } else {
    isNameManual.value.is_edit = false;
  }
  model.value.model = value;
};

function handleInitModel() {
  model.value = createDefaultModel();

  // 重置手动编辑状态
  isNameManual.value.is_edit = false;
  isNameManual.value.is_clear = false;

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
    const { error } = await fetchCreateLLMModel(model.value);
    if (!error) {
      window.$message?.success($t('common.addSuccess'));
      closeModal();
      emit('submitted');
    }
  } else {
    const { error } = await fetchUpdateLLMModel(llmModelId.value, model.value);
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
    <NForm ref="formRef" :model="model" :rules="rules" class="w-full pt-5px">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="12" :label="$t('page.ai.models.name')" path="name" class="pr-10px">
          <NInput
            v-model:value="model.name"
            :placeholder="$t('page.ai.models.form.name')"
            show-count
            :maxlength="16"
            clearable
            @update:value="handleNameUpdate"
          />
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.ai.models.model')" path="model" class="pl-10px">
          <NInput
            v-model:value="model.model"
            :placeholder="$t('page.ai.models.form.model')"
            show-count
            :maxlength="16"
            clearable
            :disabled="isEdit"
            @clear="isNameManual.is_clear = true"
            @update:value="handleModelUpdate"
          />
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.ai.models.provider')" path="provider_id" class="pr-10px">
          <NSelect
            v-model:value="model.provider_id"
            :placeholder="$t('page.ai.models.form.provider')"
            :options="providerOptions"
          />
        </NFormItemGi>

        <NFormItemGi :span="12" :label="$t('page.ai.models.status')" path="status" class="pl-10px">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItemGi>

        <NFormItemGi span="24" :label="$t('page.ai.models.description')" path="description">
          <NInput
            v-model:value="model.description"
            :placeholder="$t('page.ai.models.form.description')"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4 }"
            clearable
            show-count
            :maxlength="255"
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
