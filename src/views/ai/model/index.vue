<script setup lang="tsx">
import { nextTick, onMounted, ref } from 'vue';
import { NButton, NPopconfirm, NTag, NTooltip } from 'naive-ui';
import {
  fetchDeleteModel,
  fetchModelPage,
  fetchModelChannelCatalog,
  fetchModelChannelPage,
  fetchTestModel,
  fetchUpdateModelStatus
} from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import { getTableIndex } from '@/utils/common';
import SvgIcon from '@/components/custom/svg-icon.vue';
import ModelOperateModal from './modules/model-operate-modal.vue';
import ModelChannelModal from './modules/model-channel-modal.vue';
import ChannelOperateModal from './modules/channel-operate-modal.vue';
import ModelSearch from './modules/model-search.vue';

defineOptions({ name: 'AiModel' });

const appStore = useAppStore();
const catalog = ref<Api.AI.ChannelCatalog>({ channels: [] });
const channels = ref<Api.AI.ModelChannel[]>([]);
const searchParams = ref<Api.AI.ModelSearchParams>({
  page: 1,
  page_size: 10,
  channel_id: null,
  type: null,
  keyword: null
});
const modelModalVisible = ref(false);
const channelModalVisible = ref(false);
const channelOperateModalVisible = ref(false);
const channelModalRef = ref<{ refresh: () => Promise<void> } | null>(null);
const modelOperateType = ref<NaiveUI.TableOperateType>('add');
const channelOperateType = ref<NaiveUI.TableOperateType>('add');
const editingModel = ref<Api.AI.Model | null>(null);
const editingChannel = ref<Api.AI.ModelChannel | null>(null);
const submitting = ref(false);
const testingModelId = ref<string | null>(null);
const checkedRowKeys = ref<string[]>([]);

const inputModalityLabels: Record<Api.AI.ModelInputType, string> = {
  text: '文本',
  image: '图像',
  audio: '音频',
  video: '视频'
};



const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } = useNaivePaginatedTable({
  api: () => fetchModelPage(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    if (params.page !== undefined) searchParams.value.page = params.page;
    if (params.pageSize !== undefined) searchParams.value.page_size = params.pageSize;
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
      key: 'channel_id',
      title: '模型渠道',
      align: 'center',
      width: 70,
      render: row => {
        const channel = channels.value.find(item => item.id === row.channel_id);
        return (
          <NTooltip placement="top">
            {{
              trigger: () => (
                <span class="flex w-full items-center justify-center">
                  <SvgIcon icon={channel?.icon || 'mdi:lan-connect'} class="text-18px" />
                </span>
              ),
              default: () => channel?.name
            }}
          </NTooltip>
        );
      }
    },
    {
      key: 'model_name',
      title: '模型名称',
      align: 'center',
      width: 180,
      render: row => (
        <NTooltip placement="top">
          {{
            trigger: () => <span class="block truncate">{row.display_name || row.model_name}</span>,
            default: () => row.model_name
          }}
        </NTooltip>
      )
    },
    {
      key: 'type',
      title: '协议类型',
      align: 'center',
      width: 150,
      render: row => <NTag type="info">{row.type}</NTag>
    },
    {
      key: 'input_modalities',
      title: '输入模态',
      align: 'center',
      width: 200,
      render: row => (
        <div class="flex-center flex-wrap gap-4px">
          {row.input_modalities.map(modality => (
            <NTag key={modality}>{inputModalityLabels[modality]}</NTag>
          ))}
        </div>
      )
    },
    {
      key: 'context_window',
      title: '上下文窗口',
      align: 'center',
      width: 90
    },
    {
      key: 'max_tokens',
      title: '最大 Tokens',
      align: 'center',
      width: 90
    },
    {
      key: 'reasoning',
      title: '推理能力',
      align: 'center',
      width: 80,
      render: row => <NTag type={row.reasoning ? 'success' : 'default'} >{row.reasoning ? '支持' : '不支持'}</NTag>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 75,
      render: row => <NTag type={row.status === '1' ? 'success' : 'warning'} >{row.status === '1' ? '启用' : '停用'}</NTag>
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 250,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="info" ghost size="small" loading={testingModelId.value === row.id} onClick={() => testModel(row)}>
            测试
          </NButton>
          <NButton type="primary" ghost size="small" onClick={() => editModel(row)}>编辑</NButton>
          <NButton
            type={row.status === '1' ? 'warning' : 'success'}
            ghost
            size="small"
            onClick={() => toggleModelStatus(row)}
          >
            {row.status === '1' ? '停用' : '启用'}
          </NButton>
          <NPopconfirm onPositiveClick={() => deleteModel(row)}>
            {{
              default: () => '确认删除该模型？',
              trigger: () => <NButton type="error" ghost size="small">{$t('common.delete')}</NButton>
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

async function loadCatalog() {
  const { data: channelCatalog, error } = await fetchModelChannelCatalog();
  if (!error && channelCatalog) catalog.value = channelCatalog;
}

async function loadChannels() {
  const rows: Api.AI.ModelChannel[] = [];
  let page = 1;
  while (true) {
    const { data: result, error } = await fetchModelChannelPage({ page, page_size: 1000 });
    if (error || !result) return;
    rows.push(...result.rows);
    if (rows.length >= result.total || result.rows.length === 0) break;
    page += 1;
  }
  channels.value = rows;
}

async function testModel(row: Api.AI.Model) {
  testingModelId.value = row.id;
  try {
    const { data: result, error } = await fetchTestModel(row.id);
    if (!error && result) {
      if (result.ok) window.$message?.success(result.message);
      else window.$message?.error(result.message);
    }
  } finally {
    testingModelId.value = null;
  }
}

function openCreateModel() {
  modelOperateType.value = 'add';
  editingModel.value = null;
  modelModalVisible.value = true;
}

function editModel(row: Api.AI.Model) {
  modelOperateType.value = 'edit';
  editingModel.value = row;
  modelModalVisible.value = true;
}

function openChannelCreate() {
  channelModalVisible.value = false;
  channelOperateType.value = 'add';
  editingChannel.value = null;
  channelOperateModalVisible.value = true;
}

function handleChannelEdit(row: Api.AI.ModelChannel) {
  channelModalVisible.value = false;
  channelOperateType.value = 'edit';
  editingChannel.value = row;
  channelOperateModalVisible.value = true;
}

async function handleModelSubmitted() {
  await getDataByPage();
  await loadChannels();
}

async function handleChannelSubmitted() {
  await loadChannels();
  await getDataByPage();
  channelModalVisible.value = true;
  await nextTick();
  await channelModalRef.value?.refresh();
}

async function toggleModelStatus(row: Api.AI.Model) {
  const { error } = await fetchUpdateModelStatus(row.id, row.status === '1' ? '2' : '1');
  if (!error) await getDataByPage();
}

async function deleteModel(row: Api.AI.Model) {
  const { error } = await fetchDeleteModel(row.id);
  if (!error) await getDataByPage();
}

async function handleBatchOperate(key: string) {
  const ids = [...checkedRowKeys.value];
  if (!ids.length) return;

  if (key === 'ENABLE' || key === 'DISABLE') {
    const status = key === 'ENABLE' ? '1' : '2';
    const results = await Promise.all(ids.map(id => fetchUpdateModelStatus(id, status)));
    if (results.some(result => result.error)) return;
  } else if (key === 'DELETE') {
    const results = await Promise.all(ids.map(id => fetchDeleteModel(id)));
    if (results.some(result => result.error)) return;
  } else {
    return;
  }

  checkedRowKeys.value = [];
  await getDataByPage();
}

onMounted(async () => {
  await Promise.all([loadCatalog(), loadChannels()]);
  await getData();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ModelSearch v-model:model="searchParams" :channels="channels" @search="getDataByPage" />
    <NCard title="模型管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderBatchOperation
          v-model:columns="columnChecks"
          :disabled="checkedRowKeys.length === 0"
          :loading="loading"
          @add="openCreateModel"
          @refresh="getData"
          @batch="handleBatchOperate"
        >
          <template #prefix>
            <NButton size="small" type="default" @click="channelModalVisible = true">
              <template #icon><icon-ic-round-settings class="text-icon" /></template>
              渠道管理
            </NButton>
          </template>
        </TableHeaderBatchOperation>
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
    </NCard>
    <ModelChannelModal
      ref="channelModalRef"
      v-model:visible="channelModalVisible"
      @create="openChannelCreate"
      @edit="handleChannelEdit"
      @changed="handleChannelSubmitted"
    />
    <ChannelOperateModal
      v-model:visible="channelOperateModalVisible"
      v-model:submitting="submitting"
      :operate-type="channelOperateType"
      :row-data="editingChannel"
      :catalog="catalog"
      @submitted="handleChannelSubmitted"
    />
    <ModelOperateModal
      v-model:visible="modelModalVisible"
      v-model:submitting="submitting"
      :operate-type="modelOperateType"
      :row-data="editingModel"
      :channels="channels"
      @submitted="handleModelSubmitted"
    />
  </div>
</template>
