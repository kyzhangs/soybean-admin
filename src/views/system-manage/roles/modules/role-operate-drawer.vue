<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useBoolean } from '@sa/hooks';
  import { enableStatusOptions } from '@/constants/business';
  import { fetchAddRole, fetchUpdateRole } from '@/service/api';
  import { useFormRules, useNaiveForm } from '@/hooks/common/form';
  import { $t } from '@/locales';
  import MenuAuthModal from './menu-auth-modal.vue';
  import ButtonAuthModal from './button-auth-modal.vue';

  defineOptions({
    name: 'RoleOperateDrawer'
  });

  interface Props {
    /** the type of operation */
    operateType: NaiveUI.TableOperateType;
    /** the edit row data */
    rowData?: Api.SystemManage.Role | null;
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

  const title = computed(() => {
    const titles: Record<NaiveUI.TableOperateType, string> = {
      add: $t('page.manage.role.addRole'),
      edit: $t('page.manage.role.editRole')
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
      status: '1'
    };
  }

  type RuleKey = Exclude<keyof Model, 'description'>;

  const rules: Record<RuleKey, App.Global.FormRule> = {
    name: defaultRequiredRule,
    code: defaultRequiredRule,
    status: defaultRequiredRule
  };

  const roleId = computed(() => props.rowData?.id || -1);

  const isEdit = computed(() => props.operateType === 'edit');

  function handleInitModel() {
    model.value = createDefaultModel();

    if (props.operateType === 'edit' && props.rowData) {
      Object.assign(model.value, props.rowData);
    }
  }

  function closeDrawer() {
    visible.value = false;
  }

  async function handleSubmit() {
    await validate();
    if (!isEdit.value) {
      const { error } = await fetchAddRole(model.value);
      if (!error) {
        window.$message?.success($t('common.addSuccess'));
        closeDrawer();
        emit('submitted');
      }
    } else {
      const { error } = await fetchUpdateRole(roleId.value, model.value);
      if (!error) {
        window.$message?.success($t('common.updateSuccess'));
        closeDrawer();
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
  <NModal v-model:show="visible" :title="title" preset="dialog" :mask-closable="false" class="min-w-450px w-500px">
    <NDivider />
    <NForm ref="formRef" :model="model" :rules="rules">
      <NFormItem :label="$t('page.manage.role.name')" path="name">
        <NInput v-model:value="model.name" :placeholder="$t('page.manage.role.form.name')" show-count :maxlength="16" />
      </NFormItem>
      <NFormItem :label="$t('page.manage.role.code')" path="code">
        <NInput
          v-model:value="model.code"
          :placeholder="$t('page.manage.role.form.code')"
          :disabled="isEdit"
          show-count
          :maxlength="16"
        />
      </NFormItem>
      <NFormItem :label="$t('page.manage.role.status')" path="status">
        <NRadioGroup v-model:value="model.status">
          <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
        </NRadioGroup>
      </NFormItem>
      <NFormItem :label="$t('page.manage.role.description')" path="description">
        <NInput
          v-model:value="model.description"
          :placeholder="$t('page.manage.role.form.description')"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 3 }"
          maxlength="255"
          show-count
        />
      </NFormItem>
    </NForm>
    <NSpace v-if="isEdit">
      <NButton @click="openMenuAuthModal">{{ $t('page.manage.role.menuAuth') }}</NButton>
      <MenuAuthModal v-model:visible="menuAuthVisible" :role-id="roleId" />
      <NButton @click="openButtonAuthModal">{{ $t('page.manage.role.buttonAuth') }}</NButton>
      <ButtonAuthModal v-model:visible="buttonAuthVisible" :role-id="roleId" />
    </NSpace>
    <template #action>
      <NSpace :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
