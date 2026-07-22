<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { enableStatusRecord } from '@/constants/business';
import { fetchDeleteButton, fetchGetButtonPageList, fetchBatchButton } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { getTableIndex } from '@/utils/common';
import { $t } from '@/locales';
import ButtonSearch from './modules/button-search.vue';
import ButtonOperateModal from './modules/button-operate-modal.vue';

const appStore = useAppStore();

const searchParams = ref<Api.SystemManage.ButtonSearchParams>({
  page: 1,
  page_size: 10,
  keyword: null,
  status: null
});

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetButtonPageList(searchParams.value),
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
      render: (_, index) => getTableIndex(index, searchParams.value)
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
      title: $t('common.create_time'),
      align: 'center',
      width: 120
    },
    {
      key: 'status',
      title: $t('page.system-manage.buttons.status'),
      align: 'center',
      width: 100,
      render: row => {
        const tagMap: Record<Api.Common.Status, NaiveUI.ThemeColor> = {
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
  checkedRowKeys,
  handleEdit,
  handleAdd,
  onBatchOperate
} = useTableOperate(data, 'id', getData);

async function handleDelete(button_id: string) {
  const { error } = await fetchDeleteButton(button_id);
  if (!error) {
    getData();
    window.$message?.success($t('common.deleteSuccess'));
  }
}

async function handleBatchOperate(key: string) {
  const actionMap: Record<string, Api.Common.BatchAction> = {
    ENABLE: 'ENABLE',
    DISABLE: 'DISABLE',
    DELETE: 'DELETE'
  };

  const action = actionMap[key];
  if (!action) return;

  const { error } = await fetchBatchButton({ operate: action, ids: checkedRowKeys.value });
  if (!error) {
    await onBatchOperate();
  }
}

function edit(id: string) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ButtonSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard :title="$t('page.system-manage.buttons.title')" size="small" class="card-wrapper sm:flex-1-hidden">
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
