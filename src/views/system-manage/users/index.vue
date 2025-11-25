<script setup lang="tsx">
import { reactive } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { yesOrNoRecord } from '@/constants/common';
import { fetchDeteleUser, fetchGetUserList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';

const appStore = useAppStore();

const searchParams = reactive<Api.SystemManage.UserSearchParams>({
  page: 1,
  page_size: 10,
  keyword: null,
  contact: null,
  gender: null,
  is_active: null,
  status: null
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetUserList(searchParams),
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
      align: 'center',
      width: 64
    },
    {
      key: 'username',
      title: $t('page.system-manage.users.username'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'name',
      title: $t('page.system-manage.users.name'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'gender',
      title: $t('page.system-manage.users.gender'),
      align: 'center',
      width: 100,
      render: row => {
        const tagMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
          1: 'primary',
          2: 'error',
          3: 'default'
        };

        const label = $t(userGenderRecord[row.gender]);

        return <NTag type={tagMap[row.gender]}>{label}</NTag>;
      }
    },
    {
      key: 'phone',
      title: $t('page.system-manage.users.phone'),
      align: 'center',
      width: 120
    },
    {
      key: 'email',
      title: $t('page.system-manage.users.email'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'is_active',
      title: $t('page.system-manage.users.is_active'),
      align: 'center',
      render: row => {
        const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
          Y: 'primary',
          N: 'error'
        };

        const value = row.is_active ? 'Y' : 'N';
        const label = $t(yesOrNoRecord[value]);

        const tag = <NTag type={tagMap[value]}>{label}</NTag>;

        if (row.is_active && row.active_time) {
          return (
            <NTooltip>
              {{
                default: () => $t('page.system-manage.users.active_time', { active_time: row.active_time }),
                trigger: () => tag
              }}
            </NTooltip>
          );
        }
        return tag;
      }
    },
    {
      key: 'last_login',
      title: $t('page.system-manage.users.last_login'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'status',
      title: $t('page.system-manage.users.status'),
      align: 'center',
      width: 100,
      render: row => {
        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'error'
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
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, 'id', getData);

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

async function handleDelete(id: number) {
  // request
  const form_data = { id };
  await fetchDeteleUser(form_data);
  onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard
      :title="$t('page.system-manage.users.title')"
      :bordered="false"
      size="small"
      class="card-wrapper sm:flex-1-hidden"
    >
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
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
