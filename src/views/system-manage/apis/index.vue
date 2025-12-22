<script setup lang="tsx">
import { reactive } from 'vue';
import { NButton, NPopconfirm, NTag, NTooltip } from 'naive-ui';
import { enableStatusRecord } from '@/constants/business';
import { fetchBatchOperateApi, fetchGetApiPageList, fetchSyncApi, fetchUpdateApi } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useAuth } from '@/hooks/business/auth';
import { getTableIndex } from '@/utils/common';
import { $t } from '@/locales';
import ApiSearch from './modules/api-search.vue';

const appStore = useAppStore();
const { hasAuth } = useAuth();
const searchParams: Api.SystemManage.ApiSearchParams = reactive({
  page: 1,
  page_size: 10,
  keyword: null,
  method: null
});

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetApiPageList(searchParams),
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
      key: 'summary',
      title: $t('page.system-manage.apis.summary'),
      align: 'center',
      width: 120,
      ellipsis: {},
      render: row => {
        return (
          <NTooltip placement="left-start">
            {{
              trigger: () => <span>{row.summary ? row.summary : row.name}</span>,
              default: () => <span>{row.name}</span>
            }}
          </NTooltip>
        );
      }
    },
    {
      key: 'method',
      title: $t('page.system-manage.apis.method'),
      align: 'center',
      width: 120,
      render: row => {
        const tagMap: Record<Api.SystemManage.ApiMethod, NaiveUI.ThemeColor> = {
          GET: 'default',
          POST: 'primary',
          PATCH: 'warning',
          PUT: 'warning',
          DELETE: 'error'
        };

        return <NTag type={tagMap[row.method]}>{row.method}</NTag>;
      }
    },
    {
      key: 'path',
      title: $t('page.system-manage.apis.path'),
      align: 'left',
      width: 240,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'description',
      title: $t('page.system-manage.apis.description'),
      align: 'center',
      width: 120,
      ellipsis: {
        tooltip: {
          maxWidth: 800
        }
      }
    },
    {
      key: 'tags',
      title: $t('page.system-manage.apis.tags'),
      align: 'center',
      width: 240,
      render: row => {
        return row.tags.map((tag, index) => (
          <span>
            <NTag type="default">{tag}</NTag>
            {index < row.tags!.length - 1 && <span style="margin-right: 4px;"> -&gt;</span>}
          </span>
        ));
      }
    },
    {
      key: 'status',
      title: $t('page.system-manage.apis.status'),
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
        <NPopconfirm onPositiveClick={() => handleUpdateStatus(row)}>
          {{
            default: () => (row.status === '1' ? $t('common.confirmDisable') : $t('common.confirmEnable')),
            trigger: () => (
              <NButton type={row.status === '1' ? 'error' : 'primary'} ghost size="small">
                {row.status === '1' ? $t('common.disable') : $t('common.enable')}
              </NButton>
            )
          }}
        </NPopconfirm>
      )
    }
  ]
});

const { checkedRowKeys, onBatchOperate } = useTableOperate(data, 'id', getData);

async function handleBatchOperate(operate: Api.Common.BatchOperateType) {
  const ids = checkedRowKeys.value;
  const { error, response } = await fetchBatchOperateApi({ operate, ids });
  if (!error) {
    onBatchOperate(response.data);
  }
}

async function handleUpdateStatus(row: Api.SystemManage.Api) {
  const form_data: Api.SystemManage.ApiUpdateParams = {
    id: row.id,
    status: row.status === '1' ? '2' : '1'
  };

  const { error } = await fetchUpdateApi(form_data);
  if (!error) {
    const message = row.status === '1' ? $t('common.disableSuccess') : $t('common.enableSuccess');
    window.$message?.success(message);
    getData();
  }
}

async function handleSyncApi() {
  const { error, response } = await fetchSyncApi();
  if (!error) {
    window.$message?.success(response.data.message);
    getData();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ApiSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard
      :title="$t('page.system-manage.apis.title')"
      :bordered="false"
      size="small"
      class="card-wrapper sm:flex-1-hidden"
    >
      <template #header-extra>
        <TableBatchOperation
          v-model:columns="columnChecks"
          :show-add="false"
          :disabled-operate="checkedRowKeys.length === 0"
          :loading="loading"
          :default-batch-keys="['ENABLE', 'DISABLE']"
          @batch="handleBatchOperate"
          @refresh="getData"
        >
          <template v-if="hasAuth('B_SYNC_APIS')" #prefix>
            <NPopconfirm @positive-click="handleSyncApi">
              <template #default>
                {{ $t('page.system-manage.apis.confirmSyncApi') }}
              </template>
              <template #trigger>
                <NButton type="primary" ghost size="small">
                  <template #icon>
                    <icon-ic-round-sync class="text-icon" />
                  </template>
                  {{ $t('page.system-manage.apis.syncApi') }}
                </NButton>
              </template>
            </NPopconfirm>
          </template>
        </TableBatchOperation>
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
  </div>
</template>

<style scoped></style>
