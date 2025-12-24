<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions } from '@/constants/business';
import { fetchCreateButton, fetchUpdateButton } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'ButtonOperateModal'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData: Api.SystemManage.Button | null;
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
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.system-manage.buttons.add'),
    edit: $t('page.system-manage.buttons.edit')
  };
  return titles[props.operateType];
});

type Model = Api.SystemManage.ButtonCreateParams;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    name: '',
    code: '',
    description: null,
    status: '1'
  };
}

type RuleKey = Exclude<keyof Model, 'id' | 'description'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  code: defaultRequiredRule,
  status: defaultRequiredRule
};

const isEdit = computed(() => props.operateType === 'edit');

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
  }
}

function closeModal() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  if (!isEdit.value) {
    const { error } = await fetchCreateButton(model.value);
    if (!error) {
      window.$message?.success($t('common.addSuccess'));
      closeModal();
      emit('submitted');
    }
  } else {
    const { error } = await fetchUpdateButton(model.value);
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
        <NFormItemGi span="24" :label="$t('page.system-manage.buttons.name')" path="name">
          <NInput
            v-model:value="model.name"
            :placeholder="$t('page.system-manage.buttons.form.name')"
            show-count
            :maxlength="16"
          />
        </NFormItemGi>
        <NFormItemGi span="24" :label="$t('page.system-manage.buttons.code')" path="code">
          <NInput
            v-model:value="model.code"
            :placeholder="$t('page.system-manage.buttons.form.code')"
            :disabled="isEdit"
            show-count
            :maxlength="16"
          />
        </NFormItemGi>

        <NFormItemGi span="24" :label="$t('page.system-manage.buttons.status')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItemGi>

        <NFormItemGi span="24" :label="$t('page.system-manage.buttons.description')" path="description">
          <NInput
            v-model:value="model.description"
            :placeholder="$t('page.system-manage.buttons.form.description')"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4 }"
            maxlength="255"
            show-count
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
