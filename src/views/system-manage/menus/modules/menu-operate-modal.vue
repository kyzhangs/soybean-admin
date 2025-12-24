<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { enableStatusOptions, menuIconTypeOptions, menuTypeOptions } from '@/constants/business';
import { fetchGetRoleHomeOptions, fetchGetRoleOptions } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { getLocalIcons } from '@/utils/icon';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';
import {
  getLayoutAndPage,
  getPathParamFromRoutePath,
  getRoutePathByRouteName,
  getRoutePathWithParam,
  transformLayoutAndPageToComponent
} from './shared';

defineOptions({
  name: 'MenuOperateModal'
});

export type OperateType = NaiveUI.TableOperateType | 'addChild';

interface Props {
  /** the type of operation */
  operateType: OperateType;
  /** the edit menu data or the parent menu data when adding a child menu */
  rowData?: Api.SystemManage.Menu | null;
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
  const titles: Record<OperateType, string> = {
    add: $t('page.system-manage.menus.addMenu'),
    addChild: $t('page.system-manage.menus.addChildMenu'),
    edit: $t('page.system-manage.menus.editMenu')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Menu,
  | 'type'
  | 'name'
  | 'title'
  | 'path'
  | 'component'
  | 'order'
  | 'i18nKey'
  | 'icon'
  | 'iconType'
  | 'status'
  | 'parentId'
  | 'keepAlive'
  | 'constant'
  | 'href'
  | 'hideInMenu'
  | 'activeMenu'
  | 'multiTab'
  | 'fixedIndexInTab'
> & {
  query: NonNullable<Api.SystemManage.Menu['query']>;
  buttons: NonNullable<Api.SystemManage.Menu['buttons']>;
  layout: string;
  page: string;
  pathParam: string;
};

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    type: '1',
    name: '',
    title: '',
    path: '',
    pathParam: '',
    component: '',
    layout: '',
    page: '',
    i18nKey: null,
    icon: '',
    iconType: '1',
    parentId: 0,
    status: '1',
    keepAlive: null,
    constant: null,
    order: null,
    href: null,
    hideInMenu: false,
    activeMenu: null,
    multiTab: false,
    fixedIndexInTab: null,
    query: [],
    buttons: []
  };
}

type RuleKey = Extract<keyof Model, 'name' | 'status' | 'title' | 'path'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  status: defaultRequiredRule,
  title: defaultRequiredRule,
  path: defaultRequiredRule
};

const disabledMenuType = computed(() => props.operateType === 'edit');

const localIcons = getLocalIcons();
const localIconOptions = localIcons.map<SelectOption>(item => ({
  label: () => (
    <div class="flex-y-center gap-16px">
      <SvgIcon localIcon={item} class="text-icon" />
      <span>{item}</span>
    </div>
  ),
  value: item
}));

const showLayout = computed(() => model.value.parentId === 0);

const showPage = computed(() => model.value.type === '2');

const pageOptions = ref<CommonType.Option[]>([]);

async function handleGetAllPageOptions() {
  const { error, data } = await fetchGetRoleHomeOptions();
  if (!error) {
    pageOptions.value = data;
  }
}

const layoutOptions: CommonType.Option[] = [
  {
    label: 'base',
    value: 'base'
  },
  {
    label: 'blank',
    value: 'blank'
  }
];

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  const { error, response } = await fetchGetRoleOptions();

  if (!error) {
    roleOptions.value = response.data.data;
  }
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (!props.rowData) return;

  if (props.operateType === 'addChild') {
    const { id } = props.rowData;

    Object.assign(model.value, { parentId: id });
  }

  if (props.operateType === 'edit') {
    const { component, ...rest } = props.rowData;

    const { layout, page } = getLayoutAndPage(component);
    const { path, param } = getPathParamFromRoutePath(rest.path);

    Object.assign(model.value, rest, { layout, page, routePath: path, pathParam: param });
  }

  if (!model.value.query) {
    model.value.query = [];
  }
  if (!model.value.buttons) {
    model.value.buttons = [];
  }
}

function closeDrawer() {
  visible.value = false;
}

function handleUpdateRoutePathByRouteName() {
  if (model.value.name) {
    model.value.path = getRoutePathByRouteName(model.value.name);
  } else {
    model.value.path = '';
  }
}

function handleUpdateI18nKeyByRouteName() {
  if (model.value.name) {
    model.value.i18nKey = `route.${model.value.name}` as App.I18n.I18nKey;
  } else {
    model.value.i18nKey = null;
  }
}

function handleCreateButton() {
  const buttonItem: Api.SystemManage.ButtonCreateParams = {
    name: '',
    code: '',
    description: null,
    status: '1'
  };

  return buttonItem;
}

function getSubmitParams() {
  const { layout, page, pathParam, ...params } = model.value;

  const component = transformLayoutAndPageToComponent(layout, page);
  const routePath = getRoutePathWithParam(model.value.path, pathParam);

  params.component = component;
  params.path = routePath;

  return params;
}

async function handleSubmit() {
  await validate();

  const params = getSubmitParams();

  console.log('params: ', params);

  // request
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getRoleOptions();
    handleGetAllPageOptions();
  }
});

watch(
  () => model.value.title,
  () => {
    handleUpdateRoutePathByRouteName();
    handleUpdateI18nKeyByRouteName();
  }
);
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" :mask-closable="false" class="min-w-800px w-800px">
    <NScrollbar class="h-400px pr-20px">
      <NForm
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-align="right"
        label-width="100px"
        require-mark-placement="left"
        class="w-full pt-5px"
      >
        <NGrid responsive="screen" item-responsive>
          <NFormItemGi span="24 m:12" :label="$t('page.system-manage.menus.menuType')" path="type">
            <NRadioGroup v-model:value="model.type" :disabled="disabledMenuType">
              <NRadio v-for="item in menuTypeOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.system-manage.menus.menuName')" path="title" class="pr-24px">
            <NInput v-model:value="model.title" :placeholder="$t('page.system-manage.menus.form.menuName')" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.system-manage.menus.routeName')" path="name" class="pr-24px">
            <NInput v-model:value="model.name" :placeholder="$t('page.system-manage.menus.form.routeName')" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.system-manage.menus.routePath')" path="path" class="pr-24px">
            <NInput v-model:value="model.path" disabled :placeholder="$t('page.system-manage.menus.form.routePath')" />
          </NFormItemGi>
          <NFormItemGi
            span="24 m:12"
            :label="$t('page.system-manage.menus.pathParam')"
            path="pathParam"
            class="pr-24px"
          >
            <NInput v-model:value="model.pathParam" :placeholder="$t('page.system-manage.menus.form.pathParam')" />
          </NFormItemGi>
          <NFormItemGi
            v-if="showLayout"
            span="24 m:12"
            :label="$t('page.system-manage.menus.layout')"
            path="layout"
            class="pr-24px"
          >
            <NSelect
              v-model:value="model.layout"
              :options="layoutOptions"
              :placeholder="$t('page.system-manage.menus.form.layout')"
            />
          </NFormItemGi>
          <NFormItemGi v-if="showPage" span="24 m:12" :label="$t('page.system-manage.menus.page')" path="page">
            <NSelect
              v-model:value="model.page"
              :options="pageOptions"
              :placeholder="$t('page.system-manage.menus.form.page')"
            />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.system-manage.menus.i18nKey')" path="i18nKey" class="pr-24px">
            <NInput v-model:value="model.i18nKey" :placeholder="$t('page.system-manage.menus.form.i18nKey')" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.system-manage.menus.order')" path="order" class="pr-24px">
            <NInputNumber
              v-model:value="model.order"
              class="w-full"
              :placeholder="$t('page.system-manage.menus.form.order')"
            />
          </NFormItemGi>
          <NFormItemGi
            span="24 m:12"
            :label="$t('page.system-manage.menus.iconTypeTitle')"
            path="iconType"
            class="pr-24px"
          >
            <NRadioGroup v-model:value="model.iconType">
              <NRadio
                v-for="item in menuIconTypeOptions"
                :key="item.value"
                :value="item.value"
                :label="$t(item.label)"
              />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.system-manage.menus.icon')" path="icon" class="pr-24px">
            <template v-if="model.iconType === '1'">
              <NInput v-model:value="model.icon" :placeholder="$t('page.system-manage.menus.form.icon')" class="flex-1">
                <template #suffix>
                  <SvgIcon v-if="model.icon" :icon="model.icon" class="text-icon" />
                </template>
              </NInput>
            </template>
            <template v-if="model.iconType === '2'">
              <NSelect
                v-model:value="model.icon"
                :placeholder="$t('page.system-manage.menus.form.localIcon')"
                :options="localIconOptions"
              />
            </template>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.system-manage.menus.menuStatus')" path="status" class="pr-24px">
            <NRadioGroup v-model:value="model.status">
              <NRadio
                v-for="item in enableStatusOptions"
                :key="item.value"
                :value="item.value"
                :label="$t(item.label)"
              />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi
            span="24 m:12"
            :label="$t('page.system-manage.menus.keepAlive')"
            path="keepAlive"
            class="pr-24px"
          >
            <NRadioGroup v-model:value="model.keepAlive">
              <NRadio :value="true" :label="$t('common.yesOrNo.yes')" />
              <NRadio :value="false" :label="$t('common.yesOrNo.no')" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.system-manage.menus.constant')" path="constant" class="pr-24px">
            <NRadioGroup v-model:value="model.constant">
              <NRadio :value="true" :label="$t('common.yesOrNo.yes')" />
              <NRadio :value="false" :label="$t('common.yesOrNo.no')" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.system-manage.menus.href')" path="href" class="pr-24px">
            <NInput v-model:value="model.href" :placeholder="$t('page.system-manage.menus.form.href')" />
          </NFormItemGi>
          <NFormItemGi
            span="24 m:12"
            :label="$t('page.system-manage.menus.hideInMenu')"
            path="hideInMenu"
            class="pr-24px"
          >
            <NRadioGroup v-model:value="model.hideInMenu">
              <NRadio :value="true" :label="$t('common.yesOrNo.yes')" />
              <NRadio :value="false" :label="$t('common.yesOrNo.no')" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi
            v-if="model.hideInMenu"
            span="24 m:12"
            :label="$t('page.system-manage.menus.activeMenu')"
            path="activeMenu"
            class="pr-24px"
          >
            <NSelect
              v-model:value="model.activeMenu"
              :options="pageOptions"
              clearable
              :placeholder="$t('page.system-manage.menus.form.activeMenu')"
            />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.system-manage.menus.multiTab')" path="multiTab" class="pr-24px">
            <NRadioGroup v-model:value="model.multiTab">
              <NRadio :value="true" :label="$t('common.yesOrNo.yes')" />
              <NRadio :value="false" :label="$t('common.yesOrNo.no')" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi
            span="24 m:12"
            :label="$t('page.system-manage.menus.fixedIndexInTab')"
            path="fixedIndexInTab"
            class="pr-24px"
          >
            <NInputNumber
              v-model:value="model.fixedIndexInTab"
              class="w-full"
              clearable
              :placeholder="$t('page.system-manage.menus.form.fixedIndexInTab')"
            />
          </NFormItemGi>
          <NFormItemGi span="24" :label="$t('page.system-manage.menus.query')" class="pr-24px">
            <NDynamicInput
              v-model:value="model.query"
              preset="pair"
              :key-placeholder="$t('page.system-manage.menus.form.queryKey')"
              :value-placeholder="$t('page.system-manage.menus.form.queryValue')"
            >
              <template #action="{ index, create, remove }">
                <NSpace class="ml-12px">
                  <NButton size="medium" @click="() => create(index)">
                    <icon-ic-round-plus class="text-icon" />
                  </NButton>
                  <NButton size="medium" @click="() => remove(index)">
                    <icon-ic-round-remove class="text-icon" />
                  </NButton>
                </NSpace>
              </template>
            </NDynamicInput>
          </NFormItemGi>

          <NFormItemGi span="24" :label="$t('page.system-manage.menus.button')" class="pr-24px">
            <NDynamicInput v-model:value="model.buttons" :on-create="handleCreateButton">
              <template #default="{ value }">
                <div class="ml-8px flex-y-center flex-1 gap-12px">
                  <NInput
                    v-model:value="value.name"
                    :placeholder="$t('page.system-manage.menus.form.buttonCode')"
                    class="flex-1"
                  />
                  <NInput
                    v-model:value="value.code"
                    :placeholder="$t('page.system-manage.menus.form.buttonCode')"
                    class="flex-1"
                  />
                  <NInput
                    v-model:value="value.desc"
                    :placeholder="$t('page.system-manage.menus.form.buttonDesc')"
                    class="flex-1"
                  />
                </div>
              </template>
              <template #action="{ index, create, remove }">
                <NSpace class="ml-12px">
                  <NButton size="medium" @click="() => create(index)">
                    <icon-ic-round-plus class="text-icon" />
                  </NButton>
                  <NButton size="medium" @click="() => remove(index)">
                    <icon-ic-round-remove class="text-icon" />
                  </NButton>
                </NSpace>
              </template>
            </NDynamicInput>
          </NFormItemGi>
        </NGrid>
      </NForm>
    </NScrollbar>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
