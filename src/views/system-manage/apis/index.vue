<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag, NTooltip } from 'naive-ui';
import { enableStatusRecord } from '@/constants/business';
import { fetchGetApiPageList, fetchApiSync, fetchUpdateApi, fetchBatchApi } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import { getTableIndex } from '@/utils/common.js';
import ApiSearch from './modules/api-search.vue';

const appStore = useAppStore();

const { hasAuth } = useAuth();

const searchParams = ref<Api.SystemManage.ApiSearchParams>({
  page: 1,
  page_size: 10,
  keyword: null,
  method: null,
  tags: null
});

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetApiPageList(searchParams.value),
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
      align: 'center',
      width: 240,
      ellipsis: {
        tooltip: true
      },
      render: row => {
        return <NTag type="default">{row.path}</NTag>
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
        return row.tags?.map((tag, index) => (
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

async function handleBatchOperate(key: string) {
  const actionMap: Record<string, Api.Common.BatchAction> = {
    ENABLE: 'ENABLE',
    DISABLE: 'DISABLE'
  };

  const action = actionMap[key];
  if (!action) return;

  const { error } = await fetchBatchApi({ operate: action, ids: checkedRowKeys.value });
  if (!error) {
    await onBatchOperate();
  }
}

async function handleUpdateStatus(row: Api.SystemManage.Api) {
  const form_data: Api.SystemManage.ApiUpdateParams = {
    status: row.status === '1' ? '2' : '1'
  };

  const { error } = await fetchUpdateApi(row.id, form_data);
  if (!error) {
    const message = row.status === '1' ? $t('common.disableSuccess') : $t('common.enableSuccess');
    window.$message?.success(message);
    getData();
  }
}

async function handleApiSync() {
  const { error, response } = await fetchApiSync();
  if (!error) {
    window.$message?.success(response.data.message);
    getData();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ApiSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard :title="$t('page.system-manage.apis.title')" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderBatchOperation
          v-model:columns="columnChecks"
          :disabled="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="false"
          :default-actions="['ENABLE', 'DISABLE']"
          @refresh="getData"
          @batch="handleBatchOperate"
        >
          <template #default>
            <NPopconfirm v-if="hasAuth('B_SYNC_API')" @positive-click="handleApiSync">
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
        </TableHeaderBatchOperation>
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
