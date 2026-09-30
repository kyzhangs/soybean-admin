<script setup lang="tsx">
import { ref, watch } from 'vue';
import { NButton, NPopconfirm, NTag, NTooltip } from 'naive-ui';
import { useClipboard } from '@vueuse/core';
import {
  fetchDeleteModelChannel,
  fetchModelChannelPage,
  fetchUpdateModelChannelStatus
} from '@/service/api';
import { defaultTransform, useNaivePaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import { getTableIndex } from '@/utils/common';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({ name: 'AiModelChannelModal' });

interface Emits {
  (e: 'create'): void;
  (e: 'edit', row: Api.AI.ModelChannel): void;
  (e: 'changed'): void;
}

const emit = defineEmits<Emits>();
const visible = defineModel<boolean>('visible', { default: false });
const { copy, isSupported } = useClipboard();
const searchParams = ref<Api.AI.ModelChannelSearchParams>({
  page: 1,
  page_size: 10,
  keyword: null,
  code: null,
  status: null
});
const statusOptions = [
  { label: '启用', value: '1' },
  { label: '停用', value: '2' }
];

const { columns, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchModelChannelPage(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    if (params.page !== undefined) searchParams.value.page = params.page;
    if (params.pageSize !== undefined) searchParams.value.page_size = params.pageSize;
  },
  columns: () => [
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64,
      render: (_, index) => getTableIndex(index, searchParams.value)
    },
    {
      key: 'code',
      title: '渠道',
      align: 'center',
      width: 64,
      render: row => (
        <NTooltip placement="top">
          {{
            trigger: () => (
              <span class="flex w-full items-center justify-center">
                {row.icon ? <SvgIcon icon={row.icon} class="text-18px" /> : null}
              </span>
            ),
            default: () => row.channel_name
          }}
        </NTooltip>
      )
    },
    {
      key: 'name',
      title: '名称',
      align: 'center',
      width: 120,
      ellipsis: { tooltip: true }
    },
    {
      key: 'type',
      title: '协议类型',
      align: 'center',
      width: 140,
      render: row => <NTag type="info" size="small">{row.type}</NTag>
    },
    {
      key: 'base_url',
      title: 'Base URL',
      align: 'center',
      minWidth: 120,
      render: row => (
        <div class="flex w-full items-center justify-between gap-4px">
          <NTooltip placement="top">
            {{
              trigger: () => <span class="min-w-0 flex-1 truncate whitespace-nowrap">{row.base_url}</span>,
              default: () => row.base_url
            }}
          </NTooltip>
          <NButton text type="primary" size="tiny" aria-label="复制 Base URL" onClick={() => copyBaseUrl(row.base_url)}>
            <SvgIcon icon="mdi:content-copy" class="text-16px" />
          </NButton>
        </div>
      )
    },
    {
      key: 'api_key_configured',
      title: 'API Key',
      align: 'center',
      width: 120,
      render: row => (
        <NTag type={row.api_key_configured ? 'success' : 'default'}>
          {row.api_key_configured ? '已配置' : '未配置'}
        </NTag>
      )
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 60,
      render: row => (
        <NTag type={row.status === '1' ? 'success' : 'warning'}>
          {row.status === '1' ? '启用' : '停用'}
        </NTag>
      )
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 200,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => emit('edit', row)}>
            {$t('common.edit')}
          </NButton>
          <NButton
            type={row.status === '1' ? 'warning' : 'success'}
            ghost
            size="small"
            onClick={() => toggleStatus(row)}
          >
            {row.status === '1' ? '停用' : '启用'}
          </NButton>
          <NPopconfirm onPositiveClick={() => deleteChannel(row)}>
            {{
              default: () => '确认删除该渠道？',
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

async function toggleStatus(row: Api.AI.ModelChannel) {
  const { error } = await fetchUpdateModelChannelStatus(row.id, row.status === '1' ? '2' : '1');
  if (!error) {
    await getData();
    emit('changed');
  }
}

async function deleteChannel(row: Api.AI.ModelChannel) {
  const { error } = await fetchDeleteModelChannel(row.id);
  if (!error) {
    await getData();
    emit('changed');
  }
}

async function copyBaseUrl(value: string) {
  if (!isSupported.value) {
    window.$message?.error('当前浏览器不支持复制');
    return;
  }
  await copy(value);
  window.$message?.success('Base URL 已复制');
}

watch(visible, value => {
  if (value) void getDataByPage();
});

defineExpose({ refresh: getData });
</script>

<template>
  <NModal v-model:show="visible" preset="card" title="渠道管理" :mask-closable="false" class="w-min-1150px w-1150px">
    <div class="mb-12px flex items-center justify-between gap-12px">
      <div class="flex items-center gap-12px">
        <div class="flex items-center gap-8px">
          <span class="whitespace-nowrap text-14px">名称</span>
          <NInput
            v-model:value="searchParams.keyword"
            class="w-160px"
            placeholder="请输入名称"
            clearable
            @keyup.enter="() => getDataByPage()"
          />
        </div>
        <div class="flex items-center gap-8px">
          <span class="whitespace-nowrap text-14px">状态</span>
          <NSelect
            v-model:value="searchParams.status"
            class="w-120px"
            :options="statusOptions"
            clearable
            placeholder="请选择"
            @update:value="getDataByPage"
          />
        </div>
      </div>
      <div class="flex items-center gap-12px">
        <NButton size="small" ghost type="primary" @click="getDataByPage()">
          <template #icon><icon-ic-round-refresh class="text-icon" /></template>
          刷新
        </NButton>
        <NButton size="small" type="primary" @click="emit('create')">
          <template #icon><icon-ic-round-plus class="text-icon" /></template>
          新增
        </NButton>
      </div>
    </div>
    <div class="h-260px">
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="true"
        :scroll-x="930"
        :header-cell-props="{ class: 'whitespace-nowrap' }"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="h-full"
      />
    </div>
  </NModal>
</template>
