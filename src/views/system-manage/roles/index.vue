<script setup lang="tsx">
import { computed, onMounted, ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { enableStatusRecord } from '@/constants/business';
import { fetchGetRolePageList, fetchBatchRole, fetchGetMenuList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import RoleOperateModal from './modules/role-operate-modal.vue';
import RolePermissionModal from './modules/role-permission-modal.vue';
import RoleSearch from './modules/role-search.vue';

const appStore = useAppStore();

const menus = ref<Api.SystemManage.Menu[]>([]);

function flattenMenuOptions(menusData: Api.SystemManage.Menu[]): CommonType.Option[] {
  return menusData.reduce<CommonType.Option[]>((options, menu) => {
    options.push({ label: menu.title || menu.name, value: menu.name });
    if (menu.children?.length) {
      options.push(...flattenMenuOptions(menu.children));
    }
    return options;
  }, []);
}

const menuOptions = computed(() => flattenMenuOptions(menus.value));

async function getMenus() {
  const { error, data } = await fetchGetMenuList();
  if (!error) {
    menus.value = data;
  }
}

const searchParams = ref<Api.SystemManage.RoleSearchParams>({
  page: 1,
  page_size: 10,
  keyword: null,
  is_system: null,
  status: null
});

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetRolePageList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.page = params.page;
    searchParams.value.page_size = params.pageSize;
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      width: 64,
      align: 'center',
      render: (_, index) => index + 1
    },
    {
      key: 'name',
      title: $t('page.system-manage.roles.name'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'code',
      title: $t('page.system-manage.roles.code'),
      align: 'center',
      width: 120,
      render: row => <NTag type="default">{row.code}</NTag>
    },
    {
      key: 'description',
      title: $t('page.system-manage.roles.description'),
      align: 'center',
      ellipsis: {
        tooltip: {
          maxWidth: 450
        }
      },
      minWidth: 200
    },
    {
      key: 'update_time',
      title: $t('common.update_time'),
      align: 'center',
      width: 200
    },
    {
      key: 'status',
      title: $t('page.system-manage.roles.status'),
      align: 'center',
      width: 100,
      render: row => {
        const tagMap: Record<Api.Common.Status, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'warning'
        };

        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 220,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NButton type="info" ghost size="small" onClick={() => handlePermission(row)}>
            {$t('page.system-manage.roles.permissions')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small" disabled={row.is_system}>
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchOperate,
  onDeleted
  // closeDrawer
} = useTableOperate(data, 'id', getData);

const permissionVisible = ref(false);
const permissionData = ref<Api.SystemManage.Role | null>(null);

async function handleBatchOperate(key: string) {
  const actionMap: Record<string, Api.Common.BatchAction> = {
    ENABLE: 'ENABLE',
    DISABLE: 'DISABLE',
    DELETE: 'DELETE'
  };

  const action = actionMap[key];
  if (!action) return;

  const { error } = await fetchBatchRole({ operate: action, ids: checkedRowKeys.value });
  if (!error) {
    await onBatchOperate();
  }
}

function handleDelete(id: string) {
  // request
  console.log(id);

  onDeleted();
}

function edit(id: string) {
  handleEdit(id);
}

function handlePermission(row: Api.SystemManage.Role) {
  permissionData.value = row;
  permissionVisible.value = true;
}

onMounted(() => {
  getMenus();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard
      :title="$t('page.system-manage.roles.title')"
      :bordered="false"
      size="small"
      class="card-wrapper sm:flex-1-hidden"
    >
      <template #header-extra>
        <TableHeaderBatchOperation
          v-model:columns="columnChecks"
          :disabled="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
          @batch="handleBatchOperate"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="702"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <RoleOperateModal
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        :menu-options="menuOptions"
        @submitted="getDataByPage"
      />
      <RolePermissionModal v-model:visible="permissionVisible" :row-data="permissionData" @submitted="getDataByPage" />
    </NCard>
  </div>
</template>

<style scoped></style>
