<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { userGenderOptions } from '@/constants/business';
  import { yesOrNoOptions } from '@/constants/common';
  import { fetchCreateUser, fetchUpdateUser } from '@/service/api';
  import { useFormRules, useNaiveForm } from '@/hooks/common/form';
  import { $t } from '@/locales';

  defineOptions({
    name: 'UserOperateDrawer'
  });

  interface Props {
    /** the type of operation */
    operateType: NaiveUI.TableOperateType;
    /** the edit row data */
    rowData?: Api.SystemManage.User4Admin | null;
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
      add: $t('page.manage.user.addUser'),
      edit: $t('page.manage.user.editUser')
    };
    return titles[props.operateType];
  });

  type Model = Api.SystemManage.UserCreate & {
    password?: string;
  };

  const isEdit = computed(() => props.operateType === 'edit');
  const userId = computed(() => props.rowData?.id || -1);

  const model = ref(createDefaultModel());

  function createDefaultModel(): Model {
    return {
      username: '',
      name: null,
      gender: null,
      phone: null,
      email: null,
      is_active: true,
      is_forbid: false,
      password: ''
    };
  }

  type RuleKey = Extract<keyof Model, 'username' | 'password'>;

  const rules: Record<RuleKey, App.Global.FormRule> = {
    username: defaultRequiredRule,
    password: defaultRequiredRule
  };

  /** the enabled role options */
  // const roleOptions = ref<CommonType.Option<string>[]>([]);

  // async function getRoleOptions() {
  //   const { error, data } = await fetchGetAllRoles();

  //   if (!error) {
  //     const options = data.map(item => ({
  //       label: item.roleName,
  //       value: item.roleCode
  //     }));

  //     // the mock data does not have the roleCode, so fill it
  //     // if the real request, remove the following code
  //     const userRoleOptions = model.value.userRoles.map(item => ({
  //       label: item,
  //       value: item
  //     }));
  //     // end

  //     roleOptions.value = [...userRoleOptions, ...options];
  //   }
  // }

  function handleInitModel() {
    model.value = createDefaultModel();

    if (isEdit.value && props.rowData) {
      Object.assign(model.value, props.rowData);
      // 确保性别字段类型正确（数字转字符串）
      if (props.rowData.gender !== null && props.rowData.gender !== undefined) {
        model.value.gender = String(props.rowData.gender) as Api.SystemManage.UserGender;
      }
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
      }
    } else {
      const { error } = await fetchUpdateUser(userId.value, model.value);
      if (!error) {
        window.$message?.success($t('common.updateSuccess'));
      }
    }

    closeModal();
    emit('submitted');
  }

  watch(visible, () => {
    if (visible.value) {
      handleInitModel();
      restoreValidation();
      // getRoleOptions();
    }
  });
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="min-w-800px w-800px">
    <NScrollbar class="pr-20px">
      <NForm
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        :label-width="120"
        require-mark-placement="right-hanging"
      >
        <NGrid responsive="screen" item-responsive>
          <NFormItemGi span="12" :label="$t('page.manage.user.username')" path="username">
            <NInput
              v-model:value="model.username"
              :placeholder="$t('page.manage.user.form.username')"
              :disabled="isEdit"
            />
          </NFormItemGi>
          <NFormItemGi v-if="!isEdit" span="12" :label="$t('page.manage.user.password')" path="password">
            <NInput
              v-model:value="model.password"
              type="password"
              show-password-on="click"
              :placeholder="$t('page.manage.user.form.password')"
            />
          </NFormItemGi>
          <NFormItemGi span="12" :label="$t('page.manage.user.name')" path="name">
            <NInput v-model:value="model.name" :placeholder="$t('page.manage.user.form.name')" />
          </NFormItemGi>
          <NFormItemGi span="12" :label="$t('page.manage.user.phone')" path="phone">
            <NInput v-model:value="model.phone" :placeholder="$t('page.manage.user.form.phone')" />
          </NFormItemGi>
          <NFormItemGi span="12" :label="$t('page.manage.user.email')" path="email">
            <NInput v-model:value="model.email" :placeholder="$t('page.manage.user.form.email')" />
          </NFormItemGi>
          <NFormItemGi span="12" :label="$t('page.manage.user.gender')" path="gender">
            <NRadioGroup v-model:value="model.gender">
              <NRadio v-for="item in userGenderOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="12" :label="$t('page.manage.user.form.isActive')" path="is_active">
            <NRadioGroup v-model:value="model.is_active">
              <NRadio
                v-for="item in yesOrNoOptions"
                :key="item.value"
                :value="item.value === 'Y'"
                :label="$t(item.label)"
              />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="12" :label="$t('page.manage.user.form.isForbid')" path="is_forbid">
            <NRadioGroup v-model:value="model.is_forbid">
              <NRadio
                v-for="item in yesOrNoOptions"
                :key="item.value"
                :value="item.value === 'N'"
                :label="$t(item.label)"
              />
            </NRadioGroup>
          </NFormItemGi>
          <!--
          <NFormItemGi span="24" :label="$t('page.manage.user.userRole')" path="roles">
            <NSelect
              v-model:value="model.userRoles"
              multiple
              :options="roleOptions"
              :placeholder="$t('page.manage.user.form.userRole')"
            />
          </NFormItemGi> 
-->
        </NGrid>
      </NForm>
    </NScrollbar>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
