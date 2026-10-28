<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import { NButton, NDataTable, NInput, NModal, NTag, useMessage, type DataTableColumns } from 'naive-ui';
import { fetchSettingList, updateSetting } from '@/service/api/system-manage/settings';

const message = useMessage();
const rows = ref<Api.SystemManage.Setting[]>([]);
const loading = ref(false);
const submitting = ref(false);
const editorOpen = ref(false);
const selected = ref<Api.SystemManage.Setting | null>(null);
const nameText = ref('');
const costumeValueText = ref('');

const columns = computed<DataTableColumns<Api.SystemManage.Setting>>(() => [
  {
    title: '配置名称',
    key: 'name',
    minWidth: 160
  },
  {
    title: '命名空间',
    key: 'namespace',
    minWidth: 180
  },
  {
    title: '配置键',
    key: 'setting_key',
    minWidth: 150
  },
  {
    title: '说明',
    key: 'description',
    minWidth: 180,
    render: row => row.description || '—'
  },
  {
    title: '当前值',
    key: 'value',
    minWidth: 220,
    render: row =>
      row.is_secret
        ? h(NTag, { type: 'warning' }, { default: () => '含敏感字段，已脱敏' })
        : JSON.stringify(row.costume_value ?? row.setting_value)
  },
  {
    title: '版本',
    key: 'version',
    width: 80
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render: row =>
      h(NButton, { size: 'small', type: 'primary', onClick: () => openEditor(row) }, { default: () => '修改' })
  }
]);

async function loadSettings() {
  loading.value = true;
  const { data, error } = await fetchSettingList();
  if (!error) rows.value = data;
  loading.value = false;
}

function openEditor(row: Api.SystemManage.Setting) {
  selected.value = row;
  nameText.value = row.name;
  costumeValueText.value = JSON.stringify(row.costume_value ?? row.setting_value, null, 2);
  editorOpen.value = true;
}

async function saveSetting() {
  if (!selected.value) return;
  let costumeValue: unknown;
  try {
    costumeValue = JSON.parse(costumeValueText.value);
  } catch {
    message.error('配置内容必须是有效的 JSON');
    return;
  }
  submitting.value = true;
  const { error } = await updateSetting({
    namespace: selected.value.namespace,
    setting_key: selected.value.setting_key,
    name: nameText.value,
    costume_value: costumeValue
  });
  submitting.value = false;
  if (!error) {
    message.success('配置已保存');
    editorOpen.value = false;
    await loadSettings();
  }
}

onMounted(loadSettings);
</script>

<template>
  <div class="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden">
    <NCard title="配置管理" :bordered="false" size="small" class="sm:flex-1-hidden">
      <template #header-extra>
        <NButton secondary :loading="loading" @click="loadSettings">刷新</NButton>
      </template>
      <NDataTable :columns="columns" :data="rows" :loading="loading" :pagination="false" :scroll-x="900" />
    </NCard>

    <NModal v-model:show="editorOpen" preset="card" title="修改配置" class="w-720px max-w-90vw">
      <div v-if="selected" class="mb-12px text-14px text-gray-500">
        {{ selected.namespace }} / {{ selected.setting_key }}
        <span v-if="selected.is_secret">· 敏感字段以 ******** 显示，保持原样即可保留</span>
      </div>
      <NInput v-model:value="nameText" class="mb-12px" placeholder="配置名称" />
      <NInput
        v-model:value="costumeValueText"
        type="textarea"
        :autosize="{ minRows: 12, maxRows: 24 }"
        placeholder="JSON 配置"
      />
      <template #footer>
        <div class="flex justify-end gap-8px">
          <NButton @click="editorOpen = false">取消</NButton>
          <NButton type="primary" :loading="submitting" @click="saveSetting">保存</NButton>
        </div>
      </template>
    </NModal>
  </div>
</template>
