<script setup lang="tsx">
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  import { NButton, NPopconfirm, NTag } from 'naive-ui';
  import { useBoolean } from '@sa/hooks';
  import { yesOrNoRecord } from '@/constants/common';
  import { enableStatusRecord, menuTypeRecord } from '@/constants/business';
  import { fetchBatchOperateMenu, fetchGetFirstLevelMenus, fetchGetMenuList } from '@/service/api';
  import { useAppStore } from '@/store/modules/app';
  import { defaultTableTransform, useNaiveTable, useTableOperate } from '@/hooks/common/table';
  import { $t } from '@/locales';
  import SvgIcon from '@/components/custom/svg-icon.vue';
  import MenuOperateModal, { type OperateType } from './modules/menu-operate-modal.vue';

  const appStore = useAppStore();

  const { bool: visible, setTrue: openModal } = useBoolean();

  const wrapperRef = ref<HTMLElement | null>(null);

  const { columns, columnChecks, scrollX, data, loading, getData } = useNaiveTable({
    api: () => fetchGetMenuList(),
    transform: response => defaultTableTransform(response),
    columns: () => [
      {
        type: 'selection',
        align: 'center',
        width: 48
      },
      {
        key: 'x',
        align: 'center',
        width: 30
      },
      {
        key: 'index',
        title: $t('common.index'),
        align: 'center',
        width: 62
      },
      {
        key: 'type',
        title: $t('page.manage.menu.menuType'),
        align: 'center',
        width: 80,
        render: row => {
          const tagMap: Record<Api.SystemManage.MenuType, NaiveUI.ThemeColor> = {
            '1': 'primary',
            '2': 'default'
          };

          const label = $t(menuTypeRecord[row.type]);

          return <NTag type={tagMap[row.type]}>{label}</NTag>;
        }
      },
      {
        key: 'name',
        title: $t('page.manage.menu.menuName'),
        align: 'center',
        width: 120,
        render: row => {
          const { i18nKey, name } = row;

          const label = i18nKey ? $t(i18nKey as App.I18n.I18nKey) : name;

          return <span>{label}</span>;
        }
      },
      {
        key: 'icon',
        title: $t('page.manage.menu.icon'),
        align: 'center',
        width: 60,
        render: row => {
          const icon = row.iconType === '1' ? row.icon : undefined;

          const localIcon = row.iconType === '2' ? row.icon : undefined;

          return (
            <div class="flex-center">
              <SvgIcon icon={icon} localIcon={localIcon} class="text-icon" />
            </div>
          );
        }
      },
      {
        key: 'name',
        title: $t('page.manage.menu.routeName'),
        align: 'center',
        width: 120
      },
      {
        key: 'path',
        title: $t('page.manage.menu.routePath'),
        align: 'center',
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },

      {
        key: 'hideInMenu',
        title: $t('page.manage.menu.hideInMenu'),
        align: 'center',
        width: 100,
        render: row => {
          const hide: CommonType.YesOrNo = row.hideInMenu ? 'Y' : 'N';

          const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
            Y: 'error',
            N: 'default'
          };

          const label = $t(yesOrNoRecord[hide]);

          return <NTag type={tagMap[hide]}>{label}</NTag>;
        }
      },
      {
        key: 'constant',
        title: '常量路由',
        align: 'center',
        width: 80,
        render: row => {
          const constant: CommonType.YesOrNo = row.constant ? 'Y' : 'N';

          const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
            Y: 'primary',
            N: 'default'
          };

          const label = $t(yesOrNoRecord[constant]);

          return <NTag type={tagMap[constant]}>{label}</NTag>;
        }
      },
      {
        key: 'order',
        title: $t('page.manage.menu.order'),
        align: 'center',
        width: 60
      },

      {
        key: 'status',
        title: $t('page.manage.menu.menuStatus'),
        align: 'center',
        width: 100,
        render: row => {
          if (row.status === null || row.status === undefined) {
            return null;
          }

          const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
            1: 'success',
            2: 'error'
          };

          const value = row.status;
          const label = $t(enableStatusRecord[value]);

          return <NTag type={tagMap[value]}>{label}</NTag>;
        }
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 180,
        render: row => (
          <div class="flex-center justify-end gap-8px">
            {row.type === '1' && (
              <NButton type="primary" ghost size="small" onClick={() => handleAddChildMenu(row)}>
                {$t('page.manage.menu.addChildMenu')}
              </NButton>
            )}
            <NButton type="primary" ghost size="small" onClick={() => handleEdit(row)}>
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

  const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, 'id', getData);

  const operateType = ref<OperateType>('add');

  function handleAdd() {
    operateType.value = 'add';
    openModal();
  }

  async function handleBatchDelete() {
    // request
    const batch_data: Api.Common.BatchOperateParams = {
      operate: 'DELETE',
      ids: checkedRowKeys.value
    };
    const { error, response } = await fetchBatchOperateMenu(batch_data);
    if (!error) {
      onBatchDeleted(response.data);
    }
  }

  function handleDelete(id: number) {
    // request

    // eslint-disable-next-line no-console
    console.log(id);

    onDeleted();
  }

  /** the edit menu data or the parent menu data when adding a child menu */
  const editingData: Ref<Api.SystemManage.Menu | null> = ref(null);

  function handleEdit(item: Api.SystemManage.Menu) {
    operateType.value = 'edit';
    editingData.value = { ...item };

    openModal();
  }

  function handleAddChildMenu(item: Api.SystemManage.Menu) {
    operateType.value = 'addChild';

    editingData.value = { ...item };

    openModal();
  }

  const allPages = ref<string[]>([]);

  async function getAllPages() {
    const { data: pages } = await fetchGetFirstLevelMenus();
    allPages.value = pages || [];
  }

  function init() {
    getAllPages();
  }

  // init
  init();
</script>

<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('page.manage.menu.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="scrollX"
        :loading="loading"
        :row-key="row => row.id"
        class="sm:h-full"
      />
      <MenuOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-pages="allPages"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
