<script setup lang="tsx">
  import { reactive } from 'vue';
  import { NButton, NPopconfirm, NSwitch, NTag, NTooltip } from 'naive-ui';
  import { enableStatusRecord } from '@/constants/business';
  import { fetchGetApiPaginatingData, fetchSyncApi, fetchUpdateApi } from '@/service/api';
  import { useAppStore } from '@/store/modules/app';
  import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
  import { $t } from '@/locales';
  import ApiSearch from './modules/api-search.vue';

  const appStore = useAppStore();

  const searchParams: Api.SystemManage.ApiSearchParams = reactive({
    page: 1,
    page_size: 10
  });

  const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination, scrollX } =
    useNaivePaginatedTable({
      api: () => fetchGetApiPaginatingData(searchParams),
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
          key: 'summary',
          title: $t('page.manage.api.summary'),
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
          title: $t('page.manage.api.method'),
          align: 'center',
          width: 120,
          render: row => {
            const tagMap: Record<Api.SystemManage.ApiMethod, NaiveUI.ThemeColor> = {
              GET: 'info',
              POST: 'success',
              PATCH: 'primary',
              PUT: 'warning',
              DELETE: 'error'
            };

            return <NTag type={tagMap[row.method]}>{row.method}</NTag>;
          }
        },
        {
          key: 'path',
          title: $t('page.manage.api.path'),
          align: 'left',
          width: 240,
          ellipsis: {
            tooltip: true
          }
        },
        {
          key: 'description',
          title: $t('page.manage.api.description'),
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
          title: $t('page.manage.api.tags'),
          align: 'center',
          width: 240,
          render: row => {
            return row.tags.map((tag, index) => (
              <span>
                <NTag type="warning">{tag}</NTag>
                {index < row.tags!.length - 1 && <span style="margin-right: 4px;"> -&gt;</span>}
              </span>
            ));
          }
        },
        {
          key: 'status',
          title: $t('page.manage.api.status'),
          align: 'center',
          width: 100,
          render: row => {
            const statusMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
              '1': 'success',
              '2': 'error'
            };

            const value = row.status;
            const label = $t(enableStatusRecord[value]);

            return <NTag type={statusMap[value]}>{label}</NTag>;
          }
        },
        {
          key: 'in_whitelist',
          title: $t('page.manage.api.in_whitelist'),
          align: 'center',
          width: 120,
          render: row => {
            return (
              <NPopconfirm onPositiveClick={() => handleUpdateWhitelist(row)}>
                {{
                  default: () =>
                    row.in_whitelist
                      ? $t('page.manage.api.msg.confirmRemoveWhitelist')
                      : $t('page.manage.api.msg.confirmAddWhitelist'),
                  trigger: () => (
                    <NSwitch
                      value={row.in_whitelist}
                      size="small"
                      // 阻止直接切换，必须通过二次确认
                      onUpdateValue={() => {}}
                    />
                  )
                }}
              </NPopconfirm>
            );
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
                  <NButton type={row.status === '1' ? 'warning' : 'info'} ghost size="small">
                    {row.status === '1' ? $t('common.disable') : $t('common.enable')}
                  </NButton>
                )
              }}
            </NPopconfirm>
          )
        }
      ]
    });

  const {
    checkedRowKeys
    // closeDrawer
  } = useTableOperate(data, 'id', getData);

  async function handleUpdateStatus(row: any) {
    const updateData = {
      id: row.id,
      status: row.status === '1' ? '2' : '1'
    };

    const { error } = await fetchUpdateApi(updateData);
    if (!error) {
      const message = row.status === '1' ? $t('common.disableSuccess') : $t('common.enableSuccess');
      window.$message?.success(message);
      getData();
    }
  }

  async function handleUpdateWhitelist(row: any) {
    const updateData = {
      id: row.id,
      in_whitelist: !row.in_whitelist
    };

    const { error } = await fetchUpdateApi(updateData);
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
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
      :title="$t('page.manage.api.title.table')"
      :bordered="false"
      size="small"
      class="card-wrapper sm:flex-1-hidden"
    >
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @refresh="getData"
        >
          <template #default>
            <NPopconfirm
              :positive-text="$t('common.confirm')"
              :negative-text="$t('common.cancel')"
              @positive-click="handleSyncApi"
            >
              <template #default>
                {{ $t('page.manage.api.msg.confirmRefreshApi') }}
              </template>
              <template #trigger>
                <NButton size="small" type="warning" ghost>
                  <template #icon>
                    <icon-mdi-refresh class="text-icon" />
                  </template>
                  {{ $t('page.manage.api.button.refreshApi') }}
                </NButton>
              </template>
            </NPopconfirm>
          </template>
        </TableHeaderOperation>
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
        :row-key="row => row.index"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
