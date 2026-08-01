<script setup lang="tsx">
import { computed, ref } from 'vue';
import { NButton, NPopconfirm, NTag, NTooltip } from 'naive-ui';
import { enableStatusRecord } from '@/constants/business';
import {
  fetchAddApiWhitelist,
  fetchApiSync,
  fetchBatchAddApiWhitelist,
  fetchBatchApi,
  fetchBatchRemoveApiWhitelist,
  fetchGetApiPageList,
  fetchRemoveApiWhitelist,
  fetchUpdateApi
} from '@/service/api';
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
  tags: null,
  is_whitelisted: null
});

const whitelistBatchActionConfig = computed<Api.Common.BatchActionConfig[]>(() => {
  const actions: Api.Common.BatchActionConfig[] = [];
  if (hasAuth('B_ADD_API_WHITELIST')) {
    actions.push({
      key: 'ADD_WHITELIST',
      label: $t('page.system-manage.apis.batchAddWhitelist'),
      icon: 'ph:shield-check',
      confirmMessage: $t('page.system-manage.apis.confirmBatchAddWhitelist'),
      dialogType: 'warning'
    });
  }
  if (hasAuth('B_REMOVE_API_WHITELIST')) {
    actions.push({
      key: 'REMOVE_WHITELIST',
      label: $t('page.system-manage.apis.batchRemoveWhitelist'),
      icon: 'ph:shield-slash',
      confirmMessage: $t('page.system-manage.apis.confirmBatchRemoveWhitelist'),
      dialogType: 'error'
    });
  }
  return actions;
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
          contentStyle: {
            maxWidth: '800px'
          }
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
      width: 220,
      render: row => (
        <div class="flex-center gap-8px">
          {hasAuth(row.is_whitelisted ? 'B_REMOVE_API_WHITELIST' : 'B_ADD_API_WHITELIST') && (
            <NPopconfirm onPositiveClick={() => handleWhitelist(row)}>
              {{
                default: () =>
                  $t(
                    row.is_whitelisted
                      ? 'page.system-manage.apis.confirmRemoveWhitelist'
                      : 'page.system-manage.apis.confirmAddWhitelist'
                  ),
                trigger: () => (
                  <NButton type={row.is_whitelisted ? 'error' : 'warning'} ghost size="small">
                    {$t(
                      row.is_whitelisted
                        ? 'page.system-manage.apis.removeWhitelist'
                        : 'page.system-manage.apis.addWhitelist'
                    )}
                  </NButton>
                )
              }}
            </NPopconfirm>
          )}
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
        </div>
      )
    }
  ]
});

const { checkedRowKeys, onBatchOperate } = useTableOperate(data, 'id', getData);

async function handleBatchOperate(key: string) {
  if (key === 'ADD_WHITELIST' || key === 'REMOVE_WHITELIST') {
    const request = key === 'ADD_WHITELIST' ? fetchBatchAddApiWhitelist : fetchBatchRemoveApiWhitelist;
    const { error } = await request({ ids: checkedRowKeys.value });
    if (!error) {
      await onBatchOperate();
    }
    return;
  }

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

async function handleWhitelist(row: Api.SystemManage.Api) {
  const { error } = row.is_whitelisted
    ? await fetchRemoveApiWhitelist(row.id)
    : await fetchAddApiWhitelist(row.id);
  if (!error) {
    window.$message?.success(
      $t(
        row.is_whitelisted
          ? 'page.system-manage.apis.removeWhitelistSuccess'
          : 'page.system-manage.apis.addWhitelistSuccess'
      )
    );
    await getData();
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
          :extra-action-config="whitelistBatchActionConfig"
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
