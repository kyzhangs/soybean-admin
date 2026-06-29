<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { TreeOption } from 'naive-ui';
import { fetchGetButtonTree, fetchGetMenuButtons, fetchUpdateMenuButtons } from '@/service/api';
import { $t } from '@/locales';

defineOptions({
  name: 'MenuButtonBindModal'
});

interface Props {
  rowData: Api.SystemManage.Menu | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const menuId = computed(() => props.rowData?.id ?? '');
const title = computed(() => `${$t('page.system-manage.menus.bindButtons')} - ${props.rowData?.title ?? ''}`);

const loading = ref(false);
const submitting = ref(false);
const pattern = ref('');
const buttonTree = ref<TreeOption[]>([]);
const checkedButtonKeys = ref<string[]>([]);

function normalizeTree<T extends { label: string; value: string; children?: T[] }>(nodes: T[]): TreeOption[] {
  return nodes.map(node => ({
    label: node.label,
    key: node.value,
    children: node.children?.length ? normalizeTree(node.children) : undefined
  }));
}

function filterTree(searchPattern: string, option: TreeOption) {
  return String(option.label ?? '')
    .toLowerCase()
    .includes(searchPattern.toLowerCase());
}

function collectLeafKeys(options: TreeOption[]): string[] {
  return options.reduce<string[]>((keys, option) => {
    const children = option.children ?? [];
    if (children.length) {
      keys.push(...collectLeafKeys(children));
    } else if (!option.disabled && !option.checkboxDisabled) {
      keys.push(String(option.key));
    }
    return keys;
  }, []);
}

const leafButtonKeys = computed(() => collectLeafKeys(buttonTree.value));

function handleCheckAll() {
  checkedButtonKeys.value = leafButtonKeys.value;
}

function handleClearChecked() {
  checkedButtonKeys.value = [];
}

async function handleLoadData() {
  if (!menuId.value) return;

  loading.value = true;
  const [bindingRes, buttonTreeRes] = await Promise.all([fetchGetMenuButtons(menuId.value), fetchGetButtonTree()]);

  if (!bindingRes.error) {
    checkedButtonKeys.value = bindingRes.data.buttons;
  }
  if (!buttonTreeRes.error) {
    buttonTree.value = normalizeTree(buttonTreeRes.data);
  }
  loading.value = false;
}

function closeModal() {
  visible.value = false;
}

async function handleSubmit() {
  if (!menuId.value) return;

  const leafSet = new Set(leafButtonKeys.value);
  const buttons = checkedButtonKeys.value.filter(key => leafSet.has(key));

  submitting.value = true;
  const { error } = await fetchUpdateMenuButtons(menuId.value, { buttons });
  submitting.value = false;

  if (!error) {
    window.$message?.success($t('common.updateSuccess'));
    closeModal();
    emit('submitted');
  }
}

watch(visible, () => {
  if (visible.value) {
    pattern.value = '';
    checkedButtonKeys.value = [];
    handleLoadData();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" :mask-closable="false" class="w-720px max-w-95vw">
    <NSpin :show="loading">
      <div class="mb-12px flex items-center gap-12px">
        <NInput
          v-model:value="pattern"
          clearable
          size="small"
          :placeholder="$t('page.system-manage.menus.form.buttonKeyword')"
        />
        <NSpace :size="8" :wrap="false">
          <NButton size="small" type="primary" ghost @click="handleCheckAll">
            {{ $t('common.selectAll') }}
          </NButton>
          <NButton size="small" ghost @click="handleClearChecked">
            {{ $t('common.reset') }}
          </NButton>
        </NSpace>
      </div>

      <NScrollbar class="h-430px rounded-4px border border-#e5e7eb p-12px dark:border-#333">
        <NTree
          v-model:checked-keys="checkedButtonKeys"
          checkable
          cascade
          block-line
          :data="buttonTree"
          :pattern="pattern"
          :filter="filterTree"
        />
      </NScrollbar>
    </NSpin>

    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" :loading="submitting" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
