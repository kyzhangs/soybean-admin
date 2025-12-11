<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { useBoolean } from '@sa/hooks';
import { enableStatusOptions } from '@/constants/business';
import { fetchCreateRole, fetchUpdateRole } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import MenuAuthModal from './menu-auth-modal.vue';
import ButtonAuthModal from './button-auth-modal.vue';
import ApiAuthModal from './api-auth-modal.vue';

defineOptions({
  name: 'RoleOperateModal'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Role | null;
  menuOptions: CommonType.Option<string>[];
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
const { bool: menuAuthVisible, setTrue: openMenuAuthModal } = useBoolean();
const { bool: buttonAuthVisible, setTrue: openButtonAuthModal } = useBoolean();
const { bool: ApiAuthVisible, setTrue: openApiAuthModal } = useBoolean();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.system-manage.roles.add'),
    edit: $t('page.system-manage.roles.edit')
  };
  return titles[props.operateType];
});

type Model = Api.SystemManage.RoleCreateParams;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    name: '',
    code: '',
    description: null,
    home: 'home',
    status: '1'
  };
}

type RuleKey = Exclude<keyof Model, 'description'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  code: defaultRequiredRule,
  status: defaultRequiredRule,
  home: defaultRequiredRule
};

const roleId = computed(() => props.rowData?.id || -1);

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
    const { error } = await fetchCreateRole(model.value);
    if (!error) {
      window.$message?.success($t('common.addSuccess'));
      closeModal();
      emit('submitted');
    }
  } else {
    const { error } = await fetchUpdateRole(model.value);
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
  <NModal v-model:show="visible" :title="title" preset="dialog" :mask-closable="false" class="min-w-450px">
    <NDivider />
    <NForm ref="formRef" :model="model" :rules="rules">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="12" :label="$t('page.system-manage.roles.name')" path="name" class="pr-12px">
          <NInput
            v-model:value="model.name"
            :placeholder="$t('page.system-manage.roles.form.name')"
            show-count
            :maxlength="16"
          />
        </NFormItemGi>
        <NFormItemGi span="12" :label="$t('page.system-manage.roles.code')" path="code" class="pl-12px">
          <NInput
            v-model:value="model.code"
            :placeholder="$t('page.system-manage.roles.form.code')"
            :disabled="isEdit"
            show-count
            :maxlength="16"
          />
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.system-manage.roles.home')" path="home">
          <NSelect
            v-model:value="model.home"
            :options="props.menuOptions"
            :placeholder="$t('page.system-manage.roles.form.home')"
            size="small"
            class="pr-12px"
            clearable
          />
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.system-manage.roles.status')" path="status" class="pl-12px">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItemGi>
        <NFormItemGi span="24" :label="$t('page.system-manage.roles.description')" path="description">
          <NInput
            v-model:value="model.description"
            :placeholder="$t('page.system-manage.roles.form.description')"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4 }"
            maxlength="255"
            show-count
          />
        </NFormItemGi>
      </NGrid>
    </NForm>

    <NSpace v-if="isEdit" justify="space-between">
      <NButton type="primary" ghost @click="openMenuAuthModal">{{ $t('page.system-manage.roles.menuAuth') }}</NButton>
      <NButton type="primary" ghost @click="openButtonAuthModal">
        {{ $t('page.system-manage.roles.buttonAuth') }}
      </NButton>
      <NButton type="primary" ghost @click="openApiAuthModal">{{ $t('page.system-manage.roles.apiAuth') }}</NButton>
    </NSpace>

    <NSpace>
      <MenuAuthModal v-model:visible="menuAuthVisible" :role-id="roleId" />
      <ButtonAuthModal v-model:visible="buttonAuthVisible" :role-id="roleId" />
      <ApiAuthModal v-model:visible="ApiAuthVisible" :role-id="roleId" />
    </NSpace>

    <template #action>
      <NSpace :size="16">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
