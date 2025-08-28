<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { enableStatusOptions, userGenderOptions } from '@/constants/business';
  import { fetchCreateUser, fetchGetAllEnabledRoles, fetchUpdateUser } from '@/service/api';
  import { useFormRules, useNaiveForm } from '@/hooks/common/form';
  import { $t } from '@/locales';

  defineOptions({
    name: 'UserOperateDrawer'
  });

  interface Props {
    /** the type of operation */
    operateType: NaiveUI.TableOperateType;
    /** the edit row data */
    rowData: Api.SystemManage.User | null;
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
  const { defaultRequiredRule, patternRules } = useFormRules();

  const title = computed(() => {
    const titles: Record<NaiveUI.TableOperateType, string> = {
      add: $t('page.manage.user.addUser'),
      edit: $t('page.manage.user.editUser')
    };
    return titles[props.operateType];
  });

  type Model = Api.SystemManage.UserCreateParams;

  const model = ref<Model>(createDefaultModel());

  function createDefaultModel(): Model {
    return {
      username: '',
      name: null,
      gender: '3',
      phone: null,
      email: null,
      is_active: true,
      status: '1',
      roles: []
    };
  }

  type RuleKey = Extract<keyof Model, 'username' | 'email' | 'phone' | 'gender' | 'status' | 'is_active'>;

  const rules: Record<RuleKey, App.Global.FormRule[]> = {
    username: [defaultRequiredRule, patternRules.username],
    email: [patternRules.email],
    phone: [patternRules.phone],
    gender: [defaultRequiredRule],
    status: [defaultRequiredRule],
    is_active: [defaultRequiredRule]
  };

  const isEdit = computed(() => props.operateType === 'edit');
  const userId = computed(() => props.rowData?.id || -1);

  const isNameManual = ref({
    is_edit: false,
    is_clear: false
  });

  const handleUsernameUpdate = (value: string) => {
    if (!isEdit.value && !isNameManual.value.is_edit) {
      model.value.name = value;
    }
  };

  const handleNameUpdate = (value: string) => {
    // 当用户手动编辑 name 时，设置手动编辑标记
    if (value || isNameManual.value.is_clear) {
      isNameManual.value.is_edit = true;
    } else {
      isNameManual.value.is_edit = false;
    }
    model.value.name = value;
  };

  /** the enabled role options */
  const roleOptions = ref<CommonType.Option<string>[]>([]);

  async function getRoleOptions() {
    const { error, data } = await fetchGetAllEnabledRoles();

    if (!error) {
      const options = data.map(item => ({
        label: item.name,
        value: item.code
      }));

      roleOptions.value = [...options];
    }
  }

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
    // request
    if (!isEdit.value) {
      const { error } = await fetchCreateUser(model.value);
      if (!error) {
        window.$message?.success($t('common.addSuccess'));
        closeModal();
        emit('submitted');
      }
    } else {
      const { error } = await fetchUpdateUser(userId.value, model.value);
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
      getRoleOptions();
    }
  });
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="dialog" :mask-closable="false" class="min-w-750px w-750px">
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
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="12" :label="$t('page.manage.user.username')" path="username">
          <NInput
            v-model:value="model.username"
            :placeholder="$t('page.manage.user.form.username')"
            show-count
            :maxlength="16"
            clearable
            :disabled="isEdit"
            @update:value="handleUsernameUpdate"
          />
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.manage.user.name')" path="name">
          <NInput
            v-model:value="model.name"
            :placeholder="$t('page.manage.user.form.name')"
            show-count
            :maxlength="16"
            clearable
            @clear="isNameManual.is_clear = true"
            @update:value="handleNameUpdate"
          />
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.manage.user.phone')" path="phone">
          <NInput
            v-model:value="model.phone"
            :placeholder="$t('page.manage.user.form.phone')"
            clearable
            show-count
            :maxlength="11"
          />
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.manage.user.email')" path="email">
          <NInput
            v-model:value="model.email"
            :placeholder="$t('page.manage.user.form.email')"
            clearable
            show-count
            :maxlength="64"
          />
        </NFormItemGi>

        <NFormItemGi :span="12" :label="$t('page.manage.user.isActive')" path="is_active">
          <NCheckbox v-model:checked="model.is_active"></NCheckbox>
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.manage.user.gender')" path="gender">
          <NRadioGroup v-model:value="model.gender">
            <NRadio v-for="item in userGenderOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItemGi>

        <NFormItemGi :span="12" :label="$t('page.manage.user.form.isForbid')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItemGi>

        <NFormItemGi span="24" :label="$t('page.manage.user.role')" path="roles" class="w-1/2">
          <NSelect v-model:value="model.roles" :options="roleOptions" multiple />
        </NFormItemGi>
      </NGrid>
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
