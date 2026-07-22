<script setup lang="tsx">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NTag, NTooltip } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord, menuTypeRecord } from '@/constants/business';
import { fetchBatchMenu, fetchDeleteMenu, fetchGetMenuList, fetchGetMenuOptions } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useNaiveTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';
import MenuButtonBindModal from './modules/menu-button-bind-modal.vue';
import MenuOperateModal, { type OperateType } from './modules/menu-operate-modal.vue';

const appStore = useAppStore();

const { bool: visible, setTrue: openModal } = useBoolean();

const { columns, columnChecks, data, loading, getData, scrollX } = useNaiveTable({
  api: () => fetchGetMenuList(),
  transform: response => response.data || [],
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'type',
      title: $t('page.system-manage.menus.menuType'),
      align: 'center',
      width: 100,
      render: row => {
        const tagMap: Record<Api.SystemManage.MenuType, NaiveUI.ThemeColor> = {
          1: 'primary',
          2: 'default'
        };

        const label = $t(menuTypeRecord[row.type]);

        return <NTag type={tagMap[row.type]}>{label}</NTag>;
      }
    },
    {
      key: 'icon',
      title: $t('page.system-manage.menus.icon'),
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
      key: 'title',
      title: $t('page.system-manage.menus.menuName'),
      align: 'center',
      width: 180,
      render: row => {
        return row.i18nKey ? $t(row.i18nKey) : row.title;
      }
    },
    {
      key: 'name',
      title: $t('page.system-manage.menus.routeName'),
      align: 'center',
      width: 120,
      render: row => {
        return (
          <NTooltip placement="left-start">
            {{
              trigger: () => <span>{row.name}</span>,
              default: () => <span>{`${$t('page.system-manage.menus.routePath')}: ${row.path}`}</span>
            }}
          </NTooltip>
        );
      }
    },
    {
      key: 'constant',
      title: $t('page.system-manage.menus.constant'),
      align: 'center',
      width: 120,
      render: row => {
        const constant: CommonType.YesOrNo = row.constant ? 'Y' : 'N';
        const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
          Y: 'warning',
          N: 'default'
        };

        const label = $t(yesOrNoRecord[constant]);

        return <NTag type={tagMap[constant]}>{label}</NTag>;
      }
    },
    {
      key: 'hideInMenu',
      title: $t('page.system-manage.menus.hideInMenu'),
      align: 'center',
      width: 80,
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
      key: 'multiTab',
      title: $t('page.system-manage.menus.multiTab'),
      align: 'center',
      width: 120,
      render: row => {
        const multiTab: CommonType.YesOrNo = row.multiTab ? 'Y' : 'N';
        const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
          Y: 'primary',
          N: 'default'
        };

        const label = $t(yesOrNoRecord[multiTab]);

        return <NTag type={tagMap[multiTab]}>{label}</NTag>;
      }
    },
    {
      key: 'order',
      title: $t('page.system-manage.menus.order'),
      align: 'center',
      width: 60
    },
    {
      key: 'status',
      title: $t('page.system-manage.menus.menuStatus'),
      align: 'center',
      width: 120,
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
      width: 200,
      render: row => (
        <div class="flex-center justify-end gap-8px pr-20px">
          {row.type === '1' && (
            <NButton type="primary" ghost size="small" onClick={() => handleAddChildMenu(row)}>
              {$t('page.system-manage.menus.addChildMenu')}
            </NButton>
          )}
          <NButton type="primary" ghost size="small" onClick={() => handleEdit(row)}>
            {$t('common.edit')}
          </NButton>
          <NButton type="info" ghost size="small" onClick={() => handleBindButtons(row)}>
            {$t('page.system-manage.menus.bindButtons')}
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

const { checkedRowKeys, onBatchOperate, onDeleted } = useTableOperate(data, 'id', getData);

const operateType = ref<OperateType>('add');
const buttonBindVisible = ref(false);
const buttonBindData = ref<Api.SystemManage.Menu | null>(null);

function handleAdd() {
  operateType.value = 'add';
  openModal();
}

async function handleBatchOperate(key: string) {
  const actionMap: Record<string, Api.Common.BatchAction> = {
    ENABLE: 'ENABLE',
    DISABLE: 'DISABLE',
    DELETE: 'DELETE'
  };

  const action = actionMap[key];
  if (!action) return;

  const { error } = await fetchBatchMenu({ operate: action, ids: checkedRowKeys.value });
  if (!error) {
    await onBatchOperate();
  }
}

async function handleDelete(menuId: string) {
  // request
  const { error} = await fetchDeleteMenu(menuId)
  if (!error) {
    onDeleted();
  }
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

function handleBindButtons(item: Api.SystemManage.Menu) {
  buttonBindData.value = { ...item };
  buttonBindVisible.value = true;
}

const allPages = ref<CommonType.Option[]>([]);

async function getAllPages() {
  const { error, data: options } = await fetchGetMenuOptions();
  if (!error) {
    allPages.value = options;
  }
}

function init() {
  getAllPages();
}

// init
init();
</script>

<template>
  <div class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard
      :title="$t('page.system-manage.menus.title')"
      :bordered="false"
      size="small"
      class="card-wrapper sm:flex-1-hidden"
    >
      <template #header-extra>
        <TableHeaderBatchOperation
          v-model:columns="columnChecks"
          :disabled="checkedRowKeys.length === 0"
          :loading="loading"
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
        :scroll-x="scrollX"
        :loading="loading"
        :row-key="row => row.id"
        remote
        class="sm:h-full"
      />
      <MenuOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-pages="allPages"
      />
      <MenuButtonBindModal v-model:visible="buttonBindVisible" :row-data="buttonBindData" @submitted="getData" />
    </NCard>
  </div>
</template>

<style scoped></style>
