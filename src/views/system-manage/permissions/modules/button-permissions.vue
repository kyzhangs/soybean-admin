<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useLoading } from '@sa/hooks';
import { fetchGetButtonPageList } from '@/service/api';

defineOptions({ name: 'ButtonPermissions' });

const checkedKeys = defineModel<string[]>('checkedKeys', { default: () => [] });
const { loading, startLoading, endLoading } = useLoading();
const buttonList = ref<Api.SystemManage.Button[]>([]);
const search = ref('');

const filteredButtons = computed(() => {
  if (!search.value) return buttonList.value;
  const s = search.value.toLowerCase();
  return buttonList.value.filter(btn => btn.name.toLowerCase().includes(s) || btn.code.toLowerCase().includes(s));
});

const allChecked = computed(() => {
  return filteredButtons.value.length > 0 && filteredButtons.value.every(b => checkedKeys.value.includes(b.code));
});

async function getButtonList() {
  startLoading();
  const { error, data } = await fetchGetButtonPageList({
    page: 1,
    page_size: 999
  });
  if (!error) {
    buttonList.value = data.rows;
  }
  endLoading();
}

function handleToggle(code: string) {
  if (checkedKeys.value.includes(code)) {
    checkedKeys.value = checkedKeys.value.filter(k => k !== code);
  } else {
    checkedKeys.value.push(code);
  }
}

function toggleAll() {
  const allIds = filteredButtons.value.map(btn => btn.code);
  const selectedInFiltered = allIds.filter(code => checkedKeys.value.includes(code));

  if (selectedInFiltered.length === allIds.length) {
    checkedKeys.value = checkedKeys.value.filter(code => !allIds.includes(code));
  } else {
    const otherIds = checkedKeys.value.filter(code => !allIds.includes(code));
    checkedKeys.value = [...otherIds, ...allIds];
  }
}

onMounted(() => {
  getButtonList();
});
</script>

<template>
  <NCard
    title="按钮权限"
    :bordered="false"
    class="flex-1 shadow-sm"
    content-style="padding: 0; display: flex; flex-direction: column;"
  >
    <template #header-extra>
      <NButton size="tiny" quaternary @click="toggleAll">
        {{ allChecked ? '全不选' : '全选' }}
      </NButton>
    </template>
    <div class="px-24px">
      <NInput v-model:value="search" size="small" placeholder="搜索按钮名称/编码" clearable />
    </div>
    <NScrollbar class="flex-1" :loading="loading">
      <div class="grid grid-cols-1 gap-8px px-24px py-10px">
        <div
          v-for="button in filteredButtons"
          :key="button.id"
          class="group flex-y-center cursor-pointer gap-8px border-1 border-transparent rounded-8px bg-gray-50 p-8px transition-all hover:border-primary/20 dark:bg-gray-800/50 hover:bg-primary/5"
          :class="{
            '!bg-primary/10 !border-primary/30': checkedKeys.includes(button.code)
          }"
          @click="handleToggle(button.code)"
        >
          <NCheckbox :checked="checkedKeys.includes(button.code)" />
          <div class="flex-1">
            <div class="text-13px font-medium" :class="{ 'text-primary': checkedKeys.includes(button.code) }">
              {{ button.name }}
            </div>
            <div class="text-11px text-gray-400 transition-colors group-hover:text-primary/60">
              {{ button.code }}
            </div>
          </div>
        </div>
      </div>
      <NEmpty v-if="filteredButtons.length === 0" description="未找到匹配按钮" class="py-40px" />
    </NScrollbar>
  </NCard>
</template>
