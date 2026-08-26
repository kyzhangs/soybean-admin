<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  fetchDeleteAuthProvider,
  fetchGetAuthProviderPage,
  fetchTestAuthProvider,
  fetchUpdateAuthProviderStatus
} from '@/service/api';
import { $t } from '@/locales';
import AuthProviderOperateModal from './modules/auth-provider-operate-modal.vue';

defineOptions({ name: 'Authx' });

const loading = ref(false);
const providers = ref<Api.Authx.AuthProvider[]>([]);
const pagination = ref({ page: 1, page_size: 12, total: 0 });
const drawerVisible = ref(false);
const operateType = ref<NaiveUI.TableOperateType>('add');
const editingData = ref<Api.Authx.AuthProvider | null>(null);

const pageCount = computed(() => Math.max(1, Math.ceil(pagination.value.total / pagination.value.page_size)));

const protocolMeta: Record<Api.Authx.AuthProtocol, { label: string; icon: string; color: string }> = {
  cas: { label: 'CAS', icon: 'mdi:shield-account-outline', color: '#2080f0' },
  oauth2: { label: 'OAuth2', icon: 'mdi:key-chain-variant', color: '#18a058' }
};

async function getData() {
  loading.value = true;
  try {
    const { data, error } = await fetchGetAuthProviderPage({
      page: pagination.value.page,
      page_size: pagination.value.page_size
    });
    if (!error) {
      providers.value = data.rows;
      pagination.value.total = data.total;
    }
  } finally {
    loading.value = false;
  }
}

function handleAdd() {
  operateType.value = 'add';
  editingData.value = null;
  drawerVisible.value = true;
}

function openProviderConfig(provider: Api.Authx.AuthProvider) {
  operateType.value = 'edit';
  editingData.value = provider;
  drawerVisible.value = true;
}

async function testProvider(id: string) {
  const { error } = await fetchTestAuthProvider(id);
  if (!error) window.$message?.success($t('page.authx.message.validateSuccess'));
}

async function toggleStatus(provider: Api.Authx.AuthProvider) {
  const status: Api.Common.Status = provider.status === '1' ? '2' : '1';
  const { error } = await fetchUpdateAuthProviderStatus(provider.id, status);
  if (!error) {
    window.$message?.success(status === '1' ? $t('page.authx.message.enabled') : $t('page.authx.message.disabled'));
    await getData();
  }
}

async function deleteProvider(id: string) {
  const { error } = await fetchDeleteAuthProvider(id);
  if (!error) {
    window.$message?.success($t('page.authx.message.deleteSuccess'));
    if (providers.value.length === 1 && pagination.value.page > 1) pagination.value.page -= 1;
    await getData();
  }
}

async function changePage(page: number) {
  pagination.value.page = page;
  await getData();
}

onMounted(getData);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px">
    <div class="flex flex-wrap items-center justify-between gap-12px">
      <div>
        <h2 class="m-0 text-20px font-600">{{ $t('page.authx.title') }}</h2>
        <p class="mb-0 mt-6px text-13px text-gray-500">{{ $t('page.authx.description') }}</p>
      </div>
      <NSpace>
        <NButton secondary :loading="loading" @click="getData">
          <template #icon><SvgIcon icon="mdi:refresh" /></template>
          {{ $t('common.refresh') }}
        </NButton>
        <NButton type="primary" @click="handleAdd">
          <template #icon><SvgIcon icon="mdi:plus" /></template>
          {{ $t('page.authx.addProvider') }}
        </NButton>
      </NSpace>
    </div>

    <NSpin :show="loading">
      <NEmpty v-if="!loading && providers.length === 0" :description="$t('page.authx.empty')" class="py-80px">
        <template #extra>
          <NButton type="primary" @click="handleAdd">{{ $t('page.authx.addProvider') }}</NButton>
        </template>
      </NEmpty>

      <div v-else class="grid grid-cols-1 gap-16px lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4">
        <NCard v-for="provider in providers" :key="provider.id" size="small" class="provider-card">
          <div class="flex items-start gap-14px">
            <div
              class="h-46px w-46px flex shrink-0 items-center justify-center rounded-12px"
              :style="{
                color: protocolMeta[provider.protocol].color,
                backgroundColor: `${protocolMeta[provider.protocol].color}14`
              }"
            >
              <SvgIcon :icon="provider.icon || protocolMeta[provider.protocol].icon" class="text-25px" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-8px">
                <div class="min-w-0">
                  <h3 class="m-0 truncate text-16px font-600">{{ provider.name }}</h3>
                  <p class="mb-0 mt-4px truncate font-mono text-12px text-gray-500">{{ provider.code }}</p>
                </div>
                <NTag :type="provider.status === '1' ? 'success' : 'default'" size="small" round>
                  {{ provider.status === '1' ? $t('page.authx.status.enabled') : $t('page.authx.status.disabled') }}
                </NTag>
              </div>
            </div>
          </div>

          <div class="my-16px h-1px bg-gray-200 dark:bg-gray-700" />

          <div class="grid grid-cols-2 gap-12px text-13px">
            <div>
              <div class="text-gray-500">{{ $t('page.authx.protocol') }}</div>
              <div class="mt-5px font-500">{{ protocolMeta[provider.protocol].label }}</div>
            </div>
            <div>
              <div class="text-gray-500">{{ $t('page.authx.sort') }}</div>
              <div class="mt-5px font-500">{{ provider.sort }}</div>
            </div>
            <div>
              <div class="text-gray-500">{{ $t('page.authx.autoProvision') }}</div>
              <div class="mt-5px font-500">
                {{ provider.auto_provision ? $t('page.authx.allowed') : $t('page.authx.off') }}
              </div>
            </div>
            <div>
              <div class="text-gray-500">{{ $t('page.authx.clientSecret') }}</div>
              <div class="mt-5px font-500">
                {{
                  provider.protocol === 'oauth2'
                    ? provider.client_secret_configured
                      ? $t('page.authx.configured')
                      : $t('page.authx.notConfigured')
                    : $t('page.authx.notApplicable')
                }}
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between gap-8px">
              <NSpace :size="6">
                <NButton size="small" quaternary @click="openProviderConfig(provider)">{{ $t('common.edit') }}</NButton>
                <NButton size="small" quaternary @click="testProvider(provider.id)">
                  {{ $t('page.authx.validate') }}
                </NButton>
                <NButton
                  size="small"
                  quaternary
                  :type="provider.status === '1' ? 'warning' : 'success'"
                  @click="toggleStatus(provider)"
                >
                  {{ provider.status === '1' ? $t('common.disable') : $t('common.enable') }}
                </NButton>
              </NSpace>
              <NPopconfirm @positive-click="deleteProvider(provider.id)">
                <template #trigger>
                  <NButton size="small" quaternary type="error"><SvgIcon icon="mdi:delete-outline" /></NButton>
                </template>
                {{ $t('page.authx.deleteConfirm') }}
              </NPopconfirm>
            </div>
          </template>
        </NCard>
      </div>
    </NSpin>

    <div v-if="pagination.total > pagination.page_size" class="flex justify-end">
      <NPagination :page="pagination.page" :page-count="pageCount" @update:page="changePage" />
    </div>

    <AuthProviderOperateModal
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getData"
    />
  </div>
</template>

<style scoped>
.provider-card {
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.provider-card:hover {
  border-color: rgba(var(--primary-color), 0.4);
  box-shadow: 0 8px 24px rgb(0 0 0 / 7%);
  transform: translateY(-2px);
}
</style>
