<script setup lang="ts">
import { computed, h } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'TableBatchOperation'
});

interface Props {
  disabledOperate?: boolean;
  loading?: boolean;
  /** 是否显示添加按钮 */
  showAdd?: boolean;
  /** 批量操作配置数组；如果不传则使用内置默认配置 */
  batchConfigs?: Api.Common.BatchConfig[];
  /** 指定默认批量操作类型；如果不传则使用全部 */
  defaultBatchKeys?: Array<Api.Common.BatchOperateType>;
}

const props = withDefaults(defineProps<Props>(), {
  showAdd: true,
  batchConfigs: undefined,
  defaultBatchKeys: () => ['ENABLE', 'DISABLE', 'DELETE'] as Array<Api.Common.BatchOperateType>
});

const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'refresh'): void;
  /** 统一的批量操作事件，参数为 BatchOperateType */
  (e: 'batch', action: Api.Common.BatchOperateType): void;
}>();

const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  default: () => []
});

const defaultBatchConfigs: Api.Common.BatchConfig[] = [
  {
    label: $t('common.batchEnable'),
    key: 'ENABLE',
    icon: 'icon-ic-round-check-circle',
    needConfirm: true,
    title: $t('common.batchEnable'),
    content: $t('common.confirmEnable'),
    type: 'primary'
  },
  {
    label: $t('common.batchDisable'),
    key: 'DISABLE',
    icon: 'icon-ic-round-block',
    needConfirm: true,
    title: $t('common.batchDisable'),
    content: $t('common.confirmDisable'),
    type: 'warning'
  },
  {
    label: $t('common.batchDelete'),
    key: 'DELETE',
    icon: 'icon-ic-round-delete',
    needConfirm: true,
    title: $t('common.batchDelete'),
    content: $t('common.confirmDelete'),
    type: 'error'
  }
];

const effectiveBatchConfigs = computed<Api.Common.BatchConfig[]>(() => {
  const builtin = defaultBatchConfigs.filter(item =>
    props.defaultBatchKeys.includes(item.key as Api.Common.BatchOperateType)
  );

  if (!props.batchConfigs?.length) return builtin;

  const map = new Map([...builtin, ...props.batchConfigs].map(item => [item.key, item]));
  return Array.from(map.values());
});

const batchOptions = computed(() =>
  effectiveBatchConfigs.value.map(item => ({
    key: item.key,
    label: item.label,
    icon: item.icon ? () => h('div', { class: [item.icon, 'text-icon'] }) : undefined
  }))
);

function add() {
  emit('add');
}

function refresh() {
  emit('refresh');
}

function handleBatchSelect(key: string | number) {
  const action = String(key) as Api.Common.BatchOperateType;
  const config = effectiveBatchConfigs.value.find(item => item.key === action);

  if (!config?.needConfirm) {
    emit('batch', action);
    return;
  }

  window.$dialog?.warning({
    title: config.title,
    content: config.content,
    positiveText: config.confirmText ?? $t('common.confirm'),
    negativeText: config.cancelText ?? $t('common.cancel'),
    positiveButtonProps: { type: config.type ?? 'primary' },
    onPositiveClick: () => emit('batch', action)
  });
}
</script>

<template>
  <NSpace wrap justify="end" class="lt-sm:w-200px">
    <slot name="prefix"></slot>
    <slot name="default">
      <NButton v-if="showAdd" size="small" ghost type="primary" @click="add">
        <template #icon>
          <icon-ic-round-plus class="text-icon" />
        </template>
        {{ $t('common.add') }}
      </NButton>
      <NDropdown :options="batchOptions" :disabled="disabledOperate" @select="handleBatchSelect">
        <NButton size="small" type="default" :disabled="disabledOperate">
          <template #icon>
            <icon-ic-round-more-vert class="text-icon" />
          </template>
          {{ $t('common.batchOperate') }}
        </NButton>
      </NDropdown>
    </slot>
    <NButton size="small" @click="refresh">
      <template #icon>
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
      {{ $t('common.refresh') }}
    </NButton>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </NSpace>
</template>

<style scoped></style>
