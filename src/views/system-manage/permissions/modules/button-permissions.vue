<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchGetButtonTree } from '@/service/api';

defineOptions({ name: 'ButtonPermissions' });

const checkedKeys = defineModel<string[]>('checkedKeys', { default: () => [] });
const loading = defineModel<boolean>('loading', { default: false });
const buttonTree = ref<Api.SystemManage.ButtonTree[]>([]);
const search = ref('');

const filteredButtonTree = computed(() => {
  if (!search.value) return buttonTree.value;
  const s = search.value.toLowerCase();

  const filterTree = (nodes: any[]): any[] => {
    return nodes
      .map(node => {
        const matches = node.label.toLowerCase().includes(s);
        const filteredChildren = node.children ? filterTree(node.children) : [];
        if (matches || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
        return null;
      })
      .filter(Boolean) as any[];
  };

  return filterTree(buttonTree.value);
});

async function getButtonTree() {
  loading.value = true;
  const { error, data } = await fetchGetButtonTree();
  if (!error) {
    buttonTree.value = data;
  }
  loading.value = false;
}

function toggleExpandAll() {
  if (checkedKeys.value.length > 0) {
    checkedKeys.value = [];
  } else {
    const getAllKeys = (nodes: any[]): any[] => {
      let keys: any[] = [];
      nodes.forEach(node => {
        keys.push(node.value);
        if (node.children) {
          keys = [...keys, ...getAllKeys(node.children)];
        }
      });
      return keys;
    };
    checkedKeys.value = getAllKeys(buttonTree.value);
  }
}

onMounted(() => {
  getButtonTree();
});
</script>

<template>
  <NCard
    title="按钮权限"
    :bordered="false"
    class="h-full min-h-0 flex-1 shadow-sm"
    content-style="padding: 0; display: flex; flex-direction: column;"
  >
    <template #header-extra>
      <div class="flex-y-center gap-8px">
        <NButton size="tiny" quaternary @click="toggleExpandAll">
          {{ checkedKeys.length > 0 ? '全不选' : '全选' }}
        </NButton>
      </div>
    </template>

    <div class="px-24px">
      <NInput v-model:value="search" size="small" placeholder="搜索按钮名称" clearable />
    </div>

    <div class="min-h-0 flex-1 overflow-hidden">
      <NTree
        v-model:checked-keys="checkedKeys"
        class="h-full w-full overflow-y-auto p-15px"
        :data="filteredButtonTree"
        key-field="value"
        :loading="loading"
        checkable
        default-expand-all
        check-strategy="child"
        cascade
        block-line
        virtual-scroll
        expand-on-click
        show-line
      />
    </div>
  </NCard>
</template>

<style scoped></style>
