<script setup lang="tsx">
  import { reactive } from 'vue';
  import { NPopconfirm, NSwitch, NTag, NTooltip } from 'naive-ui';
  import { fetchGetApiList, fetchRefreshApi, fetchUpdateApiStatus } from '@/service/api';
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
      api: () => fetchGetApiList(searchParams),
      transform: response => defaultTransform(response),
      onPaginationParamsChange: params => {
        searchParams.page = params.page!;
        searchParams.page_size = params.pageSize!;
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
          render: row => {
            return (
              <NTooltip placement="left-start">
                {{
                  trigger: () => <span>{row.summary}</span>,
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
          align: 'center',
          width: 240
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
          width: 120,
          render: row => {
            const value = row.status === '1';
            const switchValue = row.status === '1' ? '2' : '1';

            return (
              <NPopconfirm
                onPositiveClick={() => handleUpdate(row.id, switchValue)}
                positive-text={$t('common.confirm')}
                negative-text={$t('common.cancel')}
                v-slots={{
                  default: () => (value ? $t('common.confirmDisable') : $t('common.confirmEnable')),
                  trigger: () => (
                    <NSwitch
                      value={value}
                      size="small"
                      checked-children={$t('common.enable')}
                      unchecked-children={$t('common.disable')}
                      // 阻止直接切换，必须通过二次确认
                      onUpdateValue={() => {}}
                    />
                  )
                }}
              />
            );
          }
        }
      ]
    });

  const {
    checkedRowKeys
    // closeDrawer
  } = useTableOperate(data, 'id', getData);

  async function handleUpdate(api_id: number, status: Api.Common.EnableStatus) {
    const { error } = await fetchUpdateApiStatus(api_id, { status });
    if (!error) {
      const message = status === '1' ? $t('common.enableSuccess') : $t('common.disableSuccess');
      window.$message?.success(message);
      getData();
    }
  }

  async function handleRefreshApi() {
    const { error } = await fetchRefreshApi();
    if (!error) {
      window.$message?.success('接口同步成功');
      getData();
    }
  }
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ApiSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard :title="$t('page.manage.api.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @refresh="getData"
        >
          <template #default>
            <NButton size="small" ghost type="warning" @click="handleRefreshApi">
              <template #icon>
                <icon-mdi-refresh class="text-icon" />
              </template>
              {{ $t('page.manage.api.refreshApi') }}
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
