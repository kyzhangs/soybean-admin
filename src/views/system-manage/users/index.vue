<script setup lang="tsx">
  import { reactive, ref } from 'vue';
  import { NButton, NPopconfirm, NTag, NTooltip } from 'naive-ui';
  import { enableStatusRecord, userGenderRecord } from '@/constants/business';
  import { yesOrNoRecord } from '@/constants/common';
  import { fetchBatchOperateUser, fetchDeleteUser, fetchGetUserPaginatingData } from '@/service/api';
  import { useAppStore } from '@/store/modules/app';
  import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
  import { BatchOperateEnum } from '@/enum/business';
  import { $t } from '@/locales';
  import UserOperateDrawer from './modules/user-operate-drawer.vue';
  import UserSearch from './modules/user-search.vue';
  import ResetPasswordModal from './modules/reset-password-modal.vue';

  const appStore = useAppStore();

  const searchParams: Api.SystemManage.UserSearchParams = reactive({
    page: 1,
    page_size: 10,
    keyword: null,
    contact: null,
    gender: null,
    is_active: null,
    status: null
  });

  const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } =
    useNaivePaginatedTable({
      api: () => fetchGetUserPaginatingData(searchParams),
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
          width: 62
        },
        {
          key: 'username',
          title: $t('page.manage.user.username'),
          align: 'center',
          width: 100
        },
        {
          key: 'name',
          title: $t('page.manage.user.name'),
          align: 'center',
          width: 100
        },
        {
          key: 'gender',
          title: $t('page.manage.user.gender'),
          align: 'center',
          width: 100,
          render: row => {
            const tagMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
              1: 'primary',
              2: 'error',
              3: 'warning'
            };

            const value = row.gender;
            const label = $t(userGenderRecord[value]);

            return <NTag type={tagMap[value]}>{label}</NTag>;
          }
        },
        {
          key: 'phone',
          title: $t('page.manage.user.phone'),
          align: 'center',
          width: 120
        },
        {
          key: 'email',
          title: $t('page.manage.user.email'),
          align: 'center',
          width: 200
        },
        {
          key: 'is_active',
          title: $t('page.manage.user.isActive'),
          align: 'center',
          width: 120,
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
                    default: () => $t('page.manage.user.activeTime', { time: row.active_time }),
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
          title: $t('page.manage.user.lastLogin'),
          align: 'center',
          width: 180
        },
        {
          key: 'status',
          title: $t('page.manage.user.status'),
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
          key: 'operate',
          title: $t('common.operate'),
          align: 'center',
          width: 200,
          render: row => (
            <div class="flex-center gap-8px">
              <NButton type="warning" ghost size="small" onClick={() => handleResetPassword(row.id)}>
                {$t('page.manage.user.button.resetPassword')}
              </NButton>
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

  // 重置密码弹框状态管理
  const resetPasswordModalVisible = ref(false);
  const currentUserId = ref<number>(0);

  function handleResetPassword(id: number) {
    currentUserId.value = id;
    resetPasswordModalVisible.value = true;
  }

  async function handleBatchOperate(operate: Api.Common.BatchOperateType) {
    const batch_data: Api.Common.BatchOperateParams = {
      operate,
      ids: checkedRowKeys.value
    };
    const { error, response } = await fetchBatchOperateUser(batch_data);
    if (!error) {
      onBatchDeleted(response.data);
    }
  }

  async function handleDelete(id: number) {
    const { error } = await fetchDeleteUser(id);
    if (!error) {
      onDeleted();
    }
  }

  function edit(id: number) {
    handleEdit(id);
  }
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard
      :title="$t('page.manage.user.title.table')"
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
          @delete="handleBatchOperate(BatchOperateEnum.DELETE)"
          @refresh="getData"
        />
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
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
      <ResetPasswordModal v-model:visible="resetPasswordModalVisible" :user-id="currentUserId" @submitted="getData" />
    </NCard>
  </div>
</template>

<style scoped></style>
