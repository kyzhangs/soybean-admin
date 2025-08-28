<script setup lang="tsx">
  import { reactive } from 'vue';
  import { NButton, NPopconfirm, NTag } from 'naive-ui';
  import { enableStatusRecord } from '@/constants/business';
  import { fetchBatchDeleteRoles, fetchDeleteRole, fetchGetRolePaginatingData } from '@/service/api';
  import { useAppStore } from '@/store/modules/app';
  import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
  import { $t } from '@/locales';
  import RoleOperateDrawer from './modules/role-operate-drawer.vue';
  import RoleSearch from './modules/role-search.vue';

  const appStore = useAppStore();

  const searchParams: Api.SystemManage.RoleSearchParams = reactive({
    page: 1,
    page_size: 10,
    keyword: null,
    code: null,
    status: null
  });

  const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination, scrollX } =
    useNaivePaginatedTable({
      api: () => fetchGetRolePaginatingData(searchParams),
      transform: response => defaultTransform(response),
      onPaginationParamsChange: params => {
        searchParams.page = params.page;
        searchParams.page_size = params.pageSize;
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
          align: 'center'
        },
        {
          key: 'name',
          title: $t('page.manage.role.name'),
          align: 'center',
          width: 120
        },
        {
          key: 'code',
          title: $t('page.manage.role.code'),
          align: 'center',
          width: 120
        },
        {
          key: 'description',
          title: $t('page.manage.role.description'),
          align: 'center',
          ellipsis: {
            tooltip: {
              width: 800
            }
          },
          width: 200
        },
        {
          key: 'create_time',
          title: $t('common.createTime'),
          align: 'center',
          width: 180
        },
        {
          key: 'update_time',
          title: $t('common.updateTime'),
          align: 'center',
          width: 180
        },
        {
          key: 'status',
          title: $t('page.manage.role.status'),
          align: 'center',
          width: 100,
          render: row => {
            const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
              1: 'success',
              2: 'error'
            };

            const value = row.status;
            const label = $t(enableStatusRecord[value]);

            return <NTag type={tagMap[value]}>{label}</NTag>;
          }
        },
        {
          key: 'operate',
          title: $t('common.operate'),
          align: 'center',
          width: 130,
          render: row => (
            <div class="flex-center gap-8px">
              <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
                {$t('common.edit')}
              </NButton>
              <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
                {{
                  default: () => $t('common.confirmDelete'),
                  trigger: () => (
                    <NButton type="error" ghost size="small">
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
    onBatchDeleted,
    onDeleted
    // closeDrawer
  } = useTableOperate(data, 'id', getData);

  async function handleBatchDelete() {
    const { error } = await fetchBatchDeleteRoles(checkedRowKeys.value);
    if (!error) {
      onBatchDeleted();
    }
  }

  async function handleDelete(id: number) {
    const { error } = await fetchDeleteRole(id);
    if (!error) {
      onDeleted();
    }
  }

  function edit(id: number) {
    handleEdit(id);
  }
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard :title="$t('page.manage.role.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="scrollX"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <RoleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
