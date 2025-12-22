<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchGetMenuTree } from '@/service/api';

defineOptions({ name: 'MenuPermissions' });

const checkedKeys = defineModel<string[]>('checkedKeys', { default: () => [] });
const loading = defineModel<boolean>('loading', { default: false });
const menuTree = ref<Api.SystemManage.MenuTree[]>([]);
const search = ref('');

const filteredMenuTree = computed(() => {
  if (!search.value) return menuTree.value;
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

  return filterTree(menuTree.value);
});

async function getMenuTree() {
  loading.value = true;
  const { error, data } = await fetchGetMenuTree();
  if (!error) {
    menuTree.value = data;
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
    checkedKeys.value = getAllKeys(menuTree.value);
  }
}

onMounted(() => {
  getMenuTree();
});
</script>

<template>
  <NCard
    title="菜单权限"
    :bordered="false"
    class="flex-1 shadow-sm"
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
      <NInput v-model:value="search" size="small" placeholder="搜索菜单名称" clearable />
    </div>

    <NTree
      v-model:checked-keys="checkedKeys"
      class="h-420px w-full p-15px"
      :data="filteredMenuTree"
      key-field="value"
      :loading="loading"
      checkable
      cascade
      block-line
      virtual-scroll
      expand-on-click
      show-line
    />
  </NCard>
</template>

<style scoped></style>
