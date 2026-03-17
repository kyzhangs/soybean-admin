<script setup lang="ts">
import { computed } from 'vue';
import { useThemeVars } from 'naive-ui';
import { $t } from '@/locales';
import { renderIcon } from '@/utils/common';

defineOptions({
  name: 'BatchOperation'
});

const themeVars = useThemeVars();

interface Props {
  disabled: boolean;
  batchConfigs?: Api.Common.BatchConfig[];
  defaultBatchKeys?: Array<Api.Common.BatchOperateType>;
}

const props = withDefaults(defineProps<Props>(), {
  batchConfigs: undefined,
  defaultBatchKeys: () => ['ENABLE', 'DISABLE', 'DELETE'] as Array<Api.Common.BatchOperateType>
});

interface Emits {
  (e: 'batch', key: Api.Common.BatchOperateType): void;
}

const emit = defineEmits<Emits>();

const defaultBatchConfigs: Api.Common.BatchConfig[] = [
  {
    label: $t('common.batchEnable'),
    key: 'ENABLE',
    icon: renderIcon('ic:round-check-circle-outline', themeVars.value.successColor),
    needConfirm: true,
    title: $t('common.batchEnable'),
    content: $t('common.confirmBatchEnable'),
    type: 'success'
  },
  {
    label: $t('common.batchDisable'),
    key: 'DISABLE',
    icon: renderIcon('ic:round-block', themeVars.value.warningColor),
    needConfirm: true,
    title: $t('common.batchDisable'),
    content: $t('common.confirmBatchDisable'),
    type: 'warning'
  },
  {
    label: $t('common.batchDelete'),
    key: 'DELETE',
    icon: renderIcon('ic:round-delete-outline', themeVars.value.errorColor),
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
  effectiveBatchConfigs.value.map(item => {
    return {
      label: item.label,
      key: item.key,
      icon: item.icon
    };
  })
);

function handleSelect(key: string) {
  const action = String(key) as Api.Common.BatchOperateType;
  const config = effectiveBatchConfigs.value.find(item => item.key === action);

  if (!config?.needConfirm) {
    emit('batch', action);
    return;
  }

  const dialogMethodMap: Record<string, keyof NonNullable<typeof window.$dialog>> = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    success: 'success'
  };
  const dialogMethod = dialogMethodMap[config.type ?? ''] ?? 'warning';
  window.$dialog?.[dialogMethod]({
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
    <slot name="default">
      <NDropdown :options="batchOptions" :disabled="props.disabled" @select="handleSelect">
        <NButton size="small" type="default" :disabled="props.disabled">
          <template #icon>
            <icon-ic-round-more-vert class="text-icon" />
          </template>
          {{ $t('common.batchOperate') }}
        </NButton>
      </NDropdown>
    </slot>
  </NSpace>
</template>

<style scoped></style>
