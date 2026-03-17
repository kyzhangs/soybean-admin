<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'TableHeaderOperation'
});

interface Props {
  itemAlign?: NaiveUI.Align;
  loading?: boolean;
  disabledBatchOperate?: boolean;
  batchConfigs?: Api.Common.BatchConfig[];
  defaultBatchKeys?: Array<Api.Common.BatchOperateType>;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'add'): void;
  (e: 'batch', key: Api.Common.BatchOperateType): void;
  (e: 'refresh'): void;
}

const emit = defineEmits<Emits>();

const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  default: () => []
});

function add() {
  emit('add');
}

function handleBatchSelect(key: Api.Common.BatchOperateType) {
  emit('batch', key);
}

function refresh() {
  emit('refresh');
}
</script>

<template>
  <NSpace :align="itemAlign" wrap justify="end" class="lt-sm:w-200px">
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
      <BatchOperation
        :disabled="props.disabledBatchOperate"
        :batch-configs="props.batchConfigs"
        :default-batch-keys="props.defaultBatchKeys"
        @batch="handleBatchSelect"
      />
    </slot>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </NSpace>
</template>

<style scoped></style>
