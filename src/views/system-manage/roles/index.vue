<script setup lang="tsx">
import { computed, onMounted, reactive, ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { enableStatusRecord } from '@/constants/business';
import { fetchBatchOperateRole, fetchDeleteRole, fetchGetMenuOptions, fetchGetRolePageList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { getTableIndex, transformOptionToRecord } from '@/utils/common';
import { $t } from '@/locales';
import RoleOperateModal from './modules/role-operate-modal.vue';
import RoleSearch from './modules/role-search.vue';

const appStore = useAppStore();

const searchParams: Api.SystemManage.RoleSearchParams = reactive({
  page: 1,
  page_size: 10,
  keyword: null,
  code: null,
  status: null
});

const menuOptions = ref<CommonType.Option<string>[]>([]);
const menuRecords = computed(() => transformOptionToRecord(menuOptions.value));

async function getMenuOptions() {
  const { error, response } = await fetchGetMenuOptions();
  if (!error) {
    menuOptions.value = response.data.data;
  }
}

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetRolePageList(searchParams),
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
      align: 'center',
      render: (_, index) => getTableIndex(index, searchParams)
    },
    {
      key: 'name',
      title: $t('page.system-manage.roles.name'),
      align: 'center',
      width: 120
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
          maxWidth: 800
        }
      },
      width: 200
    },
    {
      key: 'home',
      title: $t('page.system-manage.roles.home'),
      align: 'center',
      width: 120,
      render: row => {
        if (row.home === null || row.home === undefined) {
          return null;
        }
        const label = menuRecords.value[row.home];
        return <NTag type="info">{label}</NTag>;
      }
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
        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'error'
        };

        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}> {label}</NTag>;
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

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchOperate } =
  useTableOperate(data, 'id', getData);

async function handleBatchOperate(operate: Api.Common.BatchOperateType) {
  const ids = checkedRowKeys.value;
  const { error, response } = await fetchBatchOperateRole({ operate, ids });
  if (!error) {
    onBatchOperate(response.data);
  }
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteRole({ id });
  if (!error) {
    getData();
    window.$message?.success($t('common.deleteSuccess'));
  }
}

function edit(id: number) {
  handleEdit(id);
}

onMounted(async () => {
  await getMenuOptions();
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
        <TableBatchOperation
          v-model:columns="columnChecks"
          :disabled-operate="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @batch="handleBatchOperate"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
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
    </NCard>
  </div>
</template>

<style scoped></style>
