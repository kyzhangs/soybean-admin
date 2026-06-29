<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { fetchCreateUser, fetchUpdateUser } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'UserOperateModal'
});

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData: Api.SystemManage.User | null;
  roleOptions: CommonType.Option[];
}

const props = defineProps<Props>();

const userId = computed(() => props.rowData?.id ?? '');

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
    add: $t('page.system-manage.users.add'),
    edit: $t('page.system-manage.users.edit')
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
    roles: ['R_USER']
  };
}

type RuleKey = Extract<keyof Model, 'username' | 'email' | 'phone' | 'roles' | 'status' | 'gender'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  username: [patternRules.username, defaultRequiredRule],
  email: [patternRules.email],
  phone: [patternRules.phone],
  roles: [defaultRequiredRule],
  status: [defaultRequiredRule],
  gender: [defaultRequiredRule]
};

// 将 roles 数组转为单选 Select 的计算属性
const userRolesComputed = computed({
  get: () => {
    if (model.value.roles === null || model.value.roles === undefined) {
      return null;
    }
    return model.value.roles[0];
  },
  set: (value: string | null) => {
    if (value === null) {
      model.value.roles = [];
    } else {
      model.value.roles = [value];
    }
  }
});

const isEdit = computed(() => props.operateType === 'edit');
const IsSuperUser = computed(() => Boolean(props.rowData?.is_superuser));

/** name 字段是否已被用户手动编辑过，用于控制 add 模式下的自动同步行为 */
const nameEdited = ref(false);

function handleUsernameUpdate(value: string) {
  if (!isEdit.value && !nameEdited.value) {
    model.value.name = value;
  }
}

function handleNameUpdate(value: string) {
  nameEdited.value = true;
  model.value.name = value;
}

function handleInitModel() {
  model.value = createDefaultModel();

  nameEdited.value = false;

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

watch(visible, async () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" :mask-closable="false" class="min-w-750px w-750px">
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-align="right"
      label-width="auto"
      require-mark-placement="right-hanging"
      class="w-full pt-5px"
    >
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="12" :label="$t('page.system-manage.users.username')" path="username">
          <NInput
            v-model:value="model.username"
            :placeholder="$t('page.system-manage.users.form.username')"
            show-count
            :maxlength="16"
            clearable
            :disabled="isEdit"
            @update:value="handleUsernameUpdate"
          />
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.system-manage.users.name')" path="name">
          <NInput
            v-model:value="model.name"
            :placeholder="$t('page.system-manage.users.form.name')"
            show-count
            :maxlength="16"
            clearable
            @update:value="handleNameUpdate"
          />
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.system-manage.users.phone')" path="phone">
          <NInput
            v-model:value="model.phone"
            :placeholder="$t('page.system-manage.users.form.phone')"
            clearable
            show-count
            :maxlength="11"
          />
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.system-manage.users.email')" path="email">
          <NInput
            v-model:value="model.email"
            :placeholder="$t('page.system-manage.users.form.email')"
            clearable
            show-count
            :maxlength="64"
          />
        </NFormItemGi>

        <NFormItemGi :span="12" :label="$t('page.system-manage.users.is_active')" path="is_active">
          <NCheckbox v-model:checked="model.is_active" :disabled="isEdit && IsSuperUser" />
        </NFormItemGi>

        <NFormItemGi span="12" :label="$t('page.system-manage.users.gender')" path="gender">
          <NRadioGroup v-model:value="model.gender">
            <NRadio v-for="item in userGenderOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItemGi>

        <NFormItemGi :span="12" :label="$t('page.system-manage.users.status')" path="status">
          <NRadioGroup v-model:value="model.status" :disabled="isEdit && IsSuperUser">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItemGi>

        <NFormItemGi span="24" :label="$t('page.system-manage.users.roles')" path="roles" class="w-1/2">
          <NSelect v-model:value="userRolesComputed" :options="props.roleOptions" />
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
