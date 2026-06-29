<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { TreeOption } from 'naive-ui';
import {
  fetchGetApiTree,
  fetchGetButtonTree,
  fetchGetMenuTree,
  fetchGetRolePermissions,
  fetchUpdateRolePermissions
} from '@/service/api';
import { $t } from '@/locales';

defineOptions({
  name: 'RolePermissionModal'
});

interface Props {
  rowData: Api.SystemManage.Role | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const roleId = computed(() => props.rowData?.id ?? '');
const title = computed(() => `${$t('page.system-manage.roles.permissions')} - ${props.rowData?.name ?? ''}`);

const loading = ref(false);
const submitting = ref(false);

const activeTab = ref<'menus' | 'buttons' | 'apis'>('menus');
const menuPattern = ref('');
const buttonPattern = ref('');
const apiPattern = ref('');

const menuTree = ref<TreeOption[]>([]);
const buttonTree = ref<TreeOption[]>([]);
const apiTree = ref<TreeOption[]>([]);

const model = ref<Api.SystemManage.RolePermissions>(createDefaultModel());

function createDefaultModel(): Api.SystemManage.RolePermissions {
  return {
    menus: [],
    buttons: [],
    apis: []
  };
}

function normalizeTree<T extends { label: string; value: string; children?: T[] }>(nodes: T[]): TreeOption[] {
  return nodes.map(node => ({
    label: node.label,
    key: node.value,
    children: node.children?.length ? normalizeTree(node.children) : undefined
  }));
}

function filterTree(pattern: string, option: TreeOption) {
  return String(option.label ?? '')
    .toLowerCase()
    .includes(pattern.toLowerCase());
}

function collectTreeKeys(options: TreeOption[], leafOnly = false): string[] {
  return options.reduce<string[]>((keys, option) => {
    const children = option.children ?? [];
    const key = String(option.key);
    const selectable = !option.disabled && !option.checkboxDisabled;

    if (children.length) {
      if (!leafOnly && selectable) {
        keys.push(key);
      }
      keys.push(...collectTreeKeys(children, leafOnly));
    } else if (selectable) {
      keys.push(key);
    }

    return keys;
  }, []);
}

function handleCheckAll(type: keyof Api.SystemManage.RolePermissions) {
  const treeMap: Record<keyof Api.SystemManage.RolePermissions, TreeOption[]> = {
    menus: menuTree.value,
    buttons: buttonTree.value,
    apis: apiTree.value
  };

  model.value[type] = collectTreeKeys(treeMap[type], type !== 'menus');
}

function handleClearChecked(type: keyof Api.SystemManage.RolePermissions) {
  model.value[type] = [];
}

async function handleLoadData() {
  if (!roleId.value) return;

  loading.value = true;
  const [permissionRes, menuRes, buttonRes, apiRes] = await Promise.all([
    fetchGetRolePermissions(roleId.value),
    fetchGetMenuTree(),
    fetchGetButtonTree(),
    fetchGetApiTree()
  ]);

  if (!permissionRes.error) {
    model.value = {
      menus: permissionRes.data.menus,
      buttons: permissionRes.data.buttons,
      apis: permissionRes.data.apis
    };
  }

  if (!menuRes.error) {
    menuTree.value = normalizeTree(menuRes.data);
  }
  if (!buttonRes.error) {
    buttonTree.value = normalizeTree(buttonRes.data);
  }
  if (!apiRes.error) {
    apiTree.value = normalizeTree(apiRes.data);
  }

  loading.value = false;
}

function closeModal() {
  visible.value = false;
}

async function handleSubmit() {
  if (!roleId.value) return;

  submitting.value = true;
  const { error } = await fetchUpdateRolePermissions(roleId.value, model.value);
  submitting.value = false;

  if (!error) {
    window.$message?.success($t('common.updateSuccess'));
    closeModal();
    emit('submitted');
  }
}

watch(visible, () => {
  if (visible.value) {
    activeTab.value = 'menus';
    menuPattern.value = '';
    buttonPattern.value = '';
    apiPattern.value = '';
    model.value = createDefaultModel();
    handleLoadData();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" :mask-closable="false" class="w-860px max-w-95vw">
    <NSpin :show="loading">
      <NTabs v-model:value="activeTab" type="segment" animated>
        <NTabPane name="menus" :tab="$t('page.system-manage.roles.permissionMenus')">
          <div class="mb-12px flex items-center gap-12px">
            <NInput
              v-model:value="menuPattern"
              clearable
              size="small"
              :placeholder="$t('page.system-manage.roles.form.permissionKeyword')"
            />
            <NSpace :size="8" :wrap="false">
              <NButton size="small" type="primary" ghost @click="handleCheckAll('menus')">
                {{ $t('common.selectAll') }}
              </NButton>
              <NButton size="small" ghost @click="handleClearChecked('menus')">
                {{ $t('common.reset') }}
              </NButton>
            </NSpace>
          </div>
          <NScrollbar class="h-430px rounded-4px border border-#e5e7eb p-12px dark:border-#333">
            <NTree
              v-model:checked-keys="model.menus"
              checkable
              cascade
              block-line
              :data="menuTree"
              :pattern="menuPattern"
              :filter="filterTree"
            />
          </NScrollbar>
        </NTabPane>

        <NTabPane name="buttons" :tab="$t('page.system-manage.roles.permissionButtons')">
          <div class="mb-12px flex items-center gap-12px">
            <NInput
              v-model:value="buttonPattern"
              clearable
              size="small"
              :placeholder="$t('page.system-manage.roles.form.permissionKeyword')"
            />
            <NSpace :size="8" :wrap="false">
              <NButton size="small" type="primary" ghost @click="handleCheckAll('buttons')">
                {{ $t('common.selectAll') }}
              </NButton>
              <NButton size="small" ghost @click="handleClearChecked('buttons')">
                {{ $t('common.reset') }}
              </NButton>
            </NSpace>
          </div>
          <NScrollbar class="h-430px rounded-4px border border-#e5e7eb p-12px dark:border-#333">
            <NTree
              v-model:checked-keys="model.buttons"
              checkable
              cascade
              block-line
              :data="buttonTree"
              :pattern="buttonPattern"
              :filter="filterTree"
            />
          </NScrollbar>
        </NTabPane>

        <NTabPane name="apis" :tab="$t('page.system-manage.roles.permissionApis')">
          <div class="mb-12px flex items-center gap-12px">
            <NInput
              v-model:value="apiPattern"
              clearable
              size="small"
              :placeholder="$t('page.system-manage.roles.form.permissionKeyword')"
            />
            <NSpace :size="8" :wrap="false">
              <NButton size="small" type="primary" ghost @click="handleCheckAll('apis')">
                {{ $t('common.selectAll') }}
              </NButton>
              <NButton size="small" ghost @click="handleClearChecked('apis')">
                {{ $t('common.reset') }}
              </NButton>
            </NSpace>
          </div>
          <NScrollbar class="h-430px rounded-4px border border-#e5e7eb p-12px dark:border-#333">
            <NTree
              v-model:checked-keys="model.apis"
              checkable
              cascade
              block-line
              :data="apiTree"
              :pattern="apiPattern"
              :filter="filterTree"
            />
          </NScrollbar>
        </NTabPane>
      </NTabs>
    </NSpin>

    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" :loading="submitting" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
