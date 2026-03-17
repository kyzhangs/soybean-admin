<script setup lang="tsx">
import { ref, onMounted, computed } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { enableStatusRecord } from '@/constants/business';
import { fetchBatchOperateLLMModel, fetchDeleteLLMModel, fetchGetLLMModelPageList, fetchGetLLMProviderOptions } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { getTableIndex, transformOptionToRecord } from '@/utils/common';
import { $t } from '@/locales';
import LLMModelOperateModal from './modules/model-operate-modal.vue';
import LLMModelSearch from './modules/model-search.vue';
import ModelProviderDrawer from './modules/model-provider-drawer.vue';

const appStore = useAppStore();

const searchParams = ref<Api.AI.LLMModelSearchParams>({
  page: 1,
  page_size: 10,
  keyword: null,
  provider_id: null,
  status: null
});

const providerOptions = ref<CommonType.Option[]>([]);
const providerRecords = computed(() => transformOptionToRecord(providerOptions.value));

const providerLoading = ref(false);

const providerDrawerVisible = ref(false);

function handleOpenProviderDrawer() {
  providerDrawerVisible.value = true;
}

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetLLMModelPageList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.page = params.page;
    searchParams.value.page_size = params.pageSize;
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48,
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64,
      render: (_, index) => getTableIndex(index, searchParams.value)
    },
    {
      key: 'name',
      title: $t('page.ai.models.name'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'model',
      title: $t('page.ai.models.model'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'provider',
      title: $t('page.ai.models.provider'),
      align: 'center',
      width: 120,
      render: row => {
        if (row.provider_id === null || row.provider_id === undefined) {
          return null;
        }
        const label = providerRecords.value[row.provider_id];
        return <NTag type="default">{label}</NTag>;
      }
    },
    {
      key: 'update_time',
      title: $t("common.update_time"),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'status',
      title: $t('page.ai.models.status'),
      align: 'center',
      width: 100,
      render: row => {
        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
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
  onDeleted,
  onBatchOperate
  // closeDrawer
} = useTableOperate(data, 'id', getData);

async function handleDelete(id: number) {
  // request
  const { error } = await fetchDeleteLLMModel(id);
  if (!error) {
    onDeleted();
  }
}

function edit(id: number) {
  handleEdit(id);
}

async function handleBatchOperate(operate:Api.Common.BatchOperateType) {
  const ids = checkedRowKeys.value;
  const { error, response } = await fetchBatchOperateLLMModel({ operate, ids });
  if (!error) {
    onBatchOperate(response.data);
  }
}

async function getProviderOptions() {
  providerLoading.value = true;
  const { data: results, error } = await fetchGetLLMProviderOptions();
  if (!error) {
    providerOptions.value = results
  }
  providerLoading.value = false;
}

onMounted(() => {
  getProviderOptions();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <LLMModelSearch v-model:model="searchParams" :provider-options="providerOptions" @search="getDataByPage" />
    <NCard :title="$t('page.ai.models.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="loading"
          :disabled-batch-operate="checkedRowKeys.length === 0"
          @add="handleAdd"
          @refresh="getData"
          @batch="handleBatchOperate"
        >
          <template #prefix>
            <NButton size="small" ghost type="default" @click="handleOpenProviderDrawer">
              <template #icon>
                <icon-ic-round-business class="text-icon" />
              </template>
              {{ $t('page.ai.models.providerManage') }}
            </NButton>
          </template>
        </TableHeaderOperation>
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <LLMModelOperateModal
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        :provider-options="providerOptions"
        @submitted="getDataByPage"
      />
      <ModelProviderDrawer v-model:visible="providerDrawerVisible" />
    </NCard>
  </div>
</template>

<style scoped></style>
