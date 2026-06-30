<script setup lang="tsx">
import { ref, computed, onMounted } from 'vue';
import { yesOrNoRecord } from '@/constants/common';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { fetchGetUserPageList, fetchGetRoleList, fetchDeleteUser, fetchBatchUser } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { getTableIndex } from '@/utils/common.js';
import UserOperateModal from './modules/user-operate-modal.vue';
import UserSearch from './modules/user-search.vue';

const appStore = useAppStore();

const searchParams = ref<Api.SystemManage.UserSearchParams>({
  page: 1,
  page_size: 10,
  keyword: null,
  contact: null,
  gender: null,
  is_active: null,
  is_superuser: null,
  status: null
});

const extraActionConfig = computed<Api.Common.BatchActionConfig[]>(() => [
  {
    key: 'reset-password',
    label: $t('page.system-manage.users.batchResetPassword'),
    icon: 'ph:key',
    confirmMessage: $t('page.system-manage.users.confirmBatchResetPassword')
  }
]);

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetUserPageList(searchParams.value),
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
      align: 'center',
      width: 64,
      render: (_, index) => getTableIndex(index, searchParams.value)
    },
    {
      key: 'username',
      title: $t('page.system-manage.users.username'),
      align: 'center',
      width: 100
    },
    {
      key: 'name',
      title: $t('page.system-manage.users.name'),
      align: 'center',
      width: 100
    },
    {
      key: 'gender',
      title: $t('page.system-manage.users.gender'),
      align: 'center',
      width: 100,
      render: row => {

        const tagMap: Record<Api.SystemManage.Gender, NaiveUI.ThemeColor> = {
          '1': 'primary',
          '2': 'error',
          '3': 'default'
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
      width: 200
    },
    {
      key: 'is_active',
      title: $t('page.system-manage.users.is_active'),
      align: 'center',
      width: 100,
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
      width: 200
    },
    {
      key: 'status',
      title: $t('page.system-manage.users.status'),
      align: 'center',
      width: 100,
      render: row => {

        const tagMap: Record<Api.Common.Status, NaiveUI.ThemeColor> = {
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
                <NButton type="error" ghost size="small" disabled={row.is_superuser}>
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
  onBatchOperate,
  onDeleted
  // closeDrawer
} = useTableOperate(data, 'id', getData);

async function handleBatchOperate(key: string) {
  const ids = checkedRowKeys.value;

  const fieldMap: Record<string, Api.Common.BatchOperateParams['data']> = {
    enable: { field: 'status', value: "1" },
    disable: { field: 'status', value: "2" },
    delete: { field: 'is_deleted', value: true },
    'reset-password': { field: 'password', value: '111111' }
  };

  const batchData = fieldMap[key];
  if (!batchData) return;

  const { error } = await fetchBatchUser({ ids, data: batchData });
  if (!error) {
    onBatchOperate();
  }
}

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  const { error, data: roles } = await fetchGetRoleList();
  if (!error) {
    roleOptions.value = roles.map(role => ({
      label: role.name,
      value: role.code
    }));
  }
}

async function handleDelete(userId: string) {
  const {error} = await fetchDeleteUser(userId)
  if (!error) {
    onDeleted();
  }
}

function edit(id: string) {
  handleEdit(id);
}

onMounted(async() => {
  await getRoleOptions()
})
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
        <TableHeaderBatchOperation
          v-model:columns="columnChecks"
          :disabled="checkedRowKeys.length === 0"
          :loading="loading"
          :extra-action-config="extraActionConfig"
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
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <UserOperateModal
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        :role-options="roleOptions"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
