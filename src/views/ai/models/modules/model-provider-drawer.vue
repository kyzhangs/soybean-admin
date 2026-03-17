<script setup lang="ts">
import { watch, ref } from 'vue';
import { $t } from '@/locales';

import { fetchDeleteLLMProvider, fetchGetLLMProviderList, fetchUpdateLLMProvider } from '@/service/api';
import { enableStatusRecord } from '@/constants/business';
import { jsonClone } from '~/packages/utils/src';
import { useClipboard } from '@vueuse/core';

import ProviderOperateModal from './provider-operate-modal.vue';

defineOptions({
  name: 'ModelProviderDrawer'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

const closeDrawer = function () {
  visible.value = false;
};

const { copy, isSupported } = useClipboard();

const providerModalVisible = ref(false);
const operateType = ref<NaiveUI.TableOperateType>('add');
const editingRow = ref<Api.AI.LLMProvider | null>(null);

function handleAdd() {
  operateType.value = 'add';
  editingRow.value = null;
  providerModalVisible.value = true;
}

function handleEdit(provider: Api.AI.LLMProvider) {
  operateType.value = 'edit';
  editingRow.value = provider;
  providerModalVisible.value = true;
}

const providers = ref<Api.AI.LLMProvider[]>([]);
const apiKeyVisible = ref<Record<number, boolean>>({});

async function getProviderList() {
  const { error, data } = await fetchGetLLMProviderList();
  if (!error) {
    providers.value = data;
  }
}

const statusTagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
  1: 'success',
  2: 'warning'
};

async function handleDelete(providerId: number) {
  const { error } = await fetchDeleteLLMProvider(providerId);
  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    getProviderList();
  }
}

async function handleProviderStatus(provider: Api.AI.LLMProvider) {
  const update_status = provider.status === '1' ? '2' : '1';
  const data = jsonClone(provider);
  data['status'] = update_status;
  const { error } = await fetchUpdateLLMProvider(provider.id, data);
  if (!error) {
    const message = provider.status === '1' ? $t('common.disableSuccess') : $t('common.enableSuccess');
    window.$message?.success(message);
    getProviderList();
  }
}

async function handleCopy(text: string) {
  if (!isSupported) {
    window.$message?.error('您的浏览器不支持Clipboard API');
    return;
  }

  if (!text) {
    window.$message?.error('请输入要复制的内容');
    return;
  }

  await copy(text);
  window.$message?.success(`复制成功：${text}`);
}

watch(visible, () => {
  if (visible.value) {
    getProviderList();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="400">
    <NDrawerContent :title="$t('page.ai.providers.title')" :native-scrollbar="false" closable>
      <NCard
        v-for="provider in providers"
        :key="provider.id"
        :title="provider.name"
        size="small"
        hoverable
        class="mb-10px cursor-pointer"
        @click="handleEdit(provider)"
      >
        <template #header-extra>
          <NTag :type="statusTagMap[provider.status]">
            {{ $t(enableStatusRecord[provider.status]) }}
          </NTag>
        </template>
        <NList bordered>
          <NListItem>
            <div class="flex items-center justify-between gap-8px" @click.stop>
              <NEllipsis style="max-width: 250px">{{ provider.base_url }}</NEllipsis>
              <NButton text size="small" class="shrink-0" @click="handleCopy(provider.base_url)">
                <SvgIcon icon="material-symbols:content-copy-outline-sharp" />
              </NButton>
            </div>
          </NListItem>
          <NListItem>
            <div class="flex items-center justify-between gap-8px" @click.stop>
              <NEllipsis style="max-width: 250px">
                {{ apiKeyVisible[provider.id] ? provider.api_key || '-' : '•••••••••••••••••••••••••••••••••••' }}
              </NEllipsis>
              <NButton
                text
                size="small"
                class="shrink-0"
                @click="apiKeyVisible[provider.id] = !apiKeyVisible[provider.id]"
              >
                <SvgIcon :icon="apiKeyVisible[provider.id] ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" />
              </NButton>
            </div>
          </NListItem>
        </NList>
        <template #footer>
          <NSpace justify="space-between" @click.stop>
            <NTag>
              <template #avatar>
                <SvgIcon icon="material-symbols:nest-clock-farsight-analog-outline" />
              </template>
              {{ provider.update_time }}
            </NTag>
            <NSpace justify="end">
              <NPopconfirm
                :positive-text="$t('common.confirm')"
                :negative-text="$t('common.cancel')"
                @positive-click="handleProviderStatus(provider)"
              >
                {{ provider.status === '1' ? $t('common.confirmDisable') : $t('common.confirmEnable') }}
                <template #trigger>
                  <NButton :type="provider.status === '1' ? 'warning' : 'success'" ghost size="small">
                    {{ provider.status === '1' ? $t('common.disable') : $t('common.enable') }}
                  </NButton>
                </template>
              </NPopconfirm>

              <NPopconfirm
                :positive-text="$t('common.confirm')"
                :negative-text="$t('common.cancel')"
                @positive-click="handleDelete(provider.id)"
              >
                {{ $t('common.confirmDelete') }}
                <template #trigger>
                  <NButton type="error" ghost size="small">删除</NButton>
                </template>
              </NPopconfirm>
            </NSpace>
          </NSpace>
        </template>
      </NCard>
      <template #footer>
        <NSpace :size="16">
          <NButton type="primary" @click="handleAdd">{{ $t('common.add') }}</NButton>
          <NButton @click="closeDrawer">{{ $t('common.close') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
  <ProviderOperateModal
    v-model:visible="providerModalVisible"
    :operate-type="operateType"
    :row-data="editingRow"
    @submitted="getProviderList"
  />
</template>

<style scoped></style>
