<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';
import { $t } from '@/locales';
import { useSvgIcon } from '@/hooks/common/icon';

defineOptions({
  name: 'TableHeaderBatchOperation'
});

interface Props {
  disabled?: boolean;
  loading?: boolean;
  defaultActions?: ('enable' | 'disable' | 'delete')[];
  extraActionConfig?: Api.Common.BatchActionConfig[];
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  defaultActions: () => ['enable', 'disable', 'delete'],
  extraActionConfig: () => []
});

interface Emits {
  (e: 'add'): void;
  (e: 'refresh'): void;
  (e: 'batch', key: string): void;
}

const emit = defineEmits<Emits>();

const allOperations = computed((): Api.Common.BatchActionConfig[] => {
  const defaults: Api.Common.BatchActionConfig[] = [
    {
      key: 'enable',
      label: $t('common.batchEnable'),
      icon: 'ph:check-circle',
      confirmMessage: $t('common.confirmBatchEnable'),
      dialogType: 'success'
    },
    {
      key: 'disable',
      label: $t('common.batchDisable'),
      icon: 'ph:prohibit',
      confirmMessage: $t('common.confirmBatchDisable'),
      dialogType: 'warning'
    },
    {
      key: 'delete',
      label: $t('common.batchDelete'),
      icon: 'ph:trash',
      confirmMessage: $t('common.confirmDelete'),
      dialogType: 'error'
    }
  ];

  const extras = props.extraActionConfig ?? [];
  const merged = defaults.filter(op => props.defaultActions.includes(op.key as 'enable' | 'disable' | 'delete'));
  for (const extra of extras) {
    const idx = merged.findIndex(op => op.key === extra.key);
    if (idx >= 0) {
      merged[idx] = extra;
    } else {
      merged.push(extra);
    }
  }
  return merged;
});

const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  default: () => []
});

const { SvgIconVNode } = useSvgIcon();

const dropdownOptions = computed(() => {
  return allOperations.value.map(op => {
    const option: {
      key: string;
      label: string;
      icon?: () => VNode;
      props?: Record<string, unknown>;
    } = {
      key: op.key,
      label: op.label,
      icon: op.icon ? SvgIconVNode({ icon: op.icon, fontSize: 18 }) : undefined
    };

    return option;
  });
});

function add() {
  emit('add');
}

function refresh() {
  emit('refresh');
}

function handleSelect(key: string) {
  const operation = allOperations.value.find(op => op.key === key);
  if (!operation) {
    emit('batch', key);
    return;
  }

  const options = {
    title: operation.label || $t('common.warning'),
    content: operation.confirmMessage || $t('common.confirmDelete'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      emit('batch', key);
    }
  };

  const type = operation.dialogType ?? 'warning';
  window.$dialog?.create({ ...options, type });
}
</script>

<template>
  <NSpace wrap justify="end" class="lt-sm:w-200px">
    <slot name="prefix"></slot>
    <slot name="default">
      <NButton size="small" ghost type="primary" @click="add">
        <template #icon>
          <icon-ic-round-plus class="text-icon" />
        </template>
        {{ $t('common.add') }}
      </NButton>
    </slot>
    <NButton size="small" @click="refresh">
      <template #icon>
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
      {{ $t('common.refresh') }}
    </NButton>
    <slot name="batch">
      <NDropdown :disabled="props.disabled" :options="dropdownOptions" @select="handleSelect">
        <NButton size="small" ghost :disabled="props.disabled">
          <template #icon>
            <icon-mdi-apps class="text-icon" />
          </template>
          {{ $t('common.batchOperation') }}
        </NButton>
      </NDropdown>
    </slot>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </NSpace>
</template>

<style scoped></style>
