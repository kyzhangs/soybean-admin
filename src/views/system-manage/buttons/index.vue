<script setup lang="tsx">
import { reactive } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { enableStatusRecord } from '@/constants/business';
import { fetchBatchOperateButton, fetchDeleteButton, fetchGetButtonPageList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { getTableIndex } from '@/utils/common';
import { $t } from '@/locales';
import ButtonSearch from './modules/button-search.vue';
import ButtonOperateModal from './modules/button-operate-modal.vue';

const appStore = useAppStore();

const searchParams: Api.SystemManage.ApiSearchParams = reactive({
  page: 1,
  page_size: 10
});

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetButtonPageList(searchParams),
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
      title: $t('page.system-manage.buttons.name'),
      align: 'center',
      width: 120
    },
    {
      key: 'code',
      title: $t('page.system-manage.buttons.code'),
      align: 'center',
      width: 120
    },
    {
      key: 'description',
      title: $t('page.system-manage.buttons.description'),
      align: 'center',
      width: 120,
      ellipsis: {
        tooltip: {
          maxWidth: 800
        }
      }
    },
    {
      key: 'create_time',
      title: $t('page.system-manage.buttons.create_time'),
      align: 'center',
      width: 120
    },
    {
      key: 'status',
      title: $t('page.system-manage.buttons.status'),
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
      width: 100,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" size="small">
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

const { drawerVisible, operateType, editingData, checkedRowKeys, onBatchOperate, handleEdit, handleAdd } =
  useTableOperate(data, 'id', getData);

async function handleBatchOperate(operate: Api.Common.BatchOperateType) {
  const ids = checkedRowKeys.value;
  const { error, response } = await fetchBatchOperateButton({ operate, ids });
  if (!error) {
    onBatchOperate(response.data);
  }
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteButton({ id });
  if (!error) {
    getData();
    window.$message?.success($t('common.deleteSuccess'));
  }
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ButtonSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard :title="$t('page.system-manage.buttons.title')" size="small" class="card-wrapper sm:flex-1-hidden">
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
    </NCard>
    <ButtonOperateModal
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />
  </div>
</template>

<style scoped></style>
