<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  fetchDeleteAuthProvider,
  fetchGetAuthProviderPage,
  fetchUpdateAuthProvider,
  fetchUpdateAuthProviderStatus
} from '@/service/api';
import { $t } from '@/locales';
import { getServiceBaseURL } from '@/utils/service';
import AuthProviderAdvancedModal from './modules/auth-provider-advanced-modal.vue';
import AuthProviderBasicModal from './modules/auth-provider-basic-modal.vue';
import AuthProviderCasForm from './modules/auth-provider-cas-form.vue';
import AuthProviderOauth2Form from './modules/auth-provider-oauth2-form.vue';

defineOptions({ name: 'Authx' });

const loading = ref(false);
const providers = ref<Api.Authx.AuthProvider[]>([]);
const pagination = ref({ page: 1, page_size: 12, total: 0 });
const basicModalVisible = ref(false);
const configModalVisible = ref(false);
const advancedModalVisible = ref(false);
const basicOperateType = ref<NaiveUI.TableOperateType>('add');
const basicEditingData = ref<Api.Authx.AuthProvider | null>(null);
const configuringData = ref<Api.Authx.AuthProvider | null>(null);
const advancedData = ref<Api.Authx.AuthProvider | null>(null);
const configSubmitting = ref(false);
const configProtocol = ref<Api.Authx.AuthProtocol>('cas');
const configFormRef = ref<
  InstanceType<typeof AuthProviderCasForm> | InstanceType<typeof AuthProviderOauth2Form> | null
>(null);
const configForm = computed(() => (configProtocol.value === 'cas' ? AuthProviderCasForm : AuthProviderOauth2Form));
const defaultCallbackUrl = computed(() => {
  const code = configuringData.value?.code.trim();
  if (!code) return '';
  const { baseURL } = getServiceBaseURL(import.meta.env, false);
  const callbackUrl = `${baseURL.replace(/\/$/, '')}/authx/${encodeURIComponent(code)}/callback`;
  return new URL(callbackUrl, window.location.origin).toString();
});

const pageCount = computed(() => Math.max(1, Math.ceil(pagination.value.total / pagination.value.page_size)));

const protocolMeta: Record<Api.Authx.AuthProtocol, { label: string; icon: string; color: string }> = {
  cas: { label: 'CAS', icon: 'mdi:shield-account-outline', color: '#2080f0' },
  oauth2: { label: 'OAuth2', icon: 'mdi:key-chain-variant', color: '#18a058' }
};
function getProviderMenuOptions(provider: Api.Authx.AuthProvider) {
  return [
    { label: $t('common.edit'), key: 'edit' },
    {
      label: $t('page.authx.form.section.advanced'),
      key: 'advanced',
      disabled: !provider.configured
    },
    { label: $t('common.delete'), key: 'delete' }
  ];
}

function getClientSecretStatus(provider: Api.Authx.AuthProvider) {
  if (!provider.configured) return $t('page.authx.notConfigured');
  if (provider.protocol !== 'oauth2') return $t('page.authx.notApplicable');
  return provider.client_secret_configured ? $t('page.authx.configured') : $t('page.authx.notConfigured');
}

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
  basicOperateType.value = 'add';
  basicEditingData.value = null;
  basicModalVisible.value = true;
}

function openProviderConfig(provider: Api.Authx.AuthProvider) {
  configuringData.value = provider;
  configProtocol.value = provider.protocol;
  configModalVisible.value = true;
}

async function submitProviderConfig() {
  const form = configFormRef.value;
  const provider = configuringData.value;
  if (!form || !provider || configSubmitting.value) return;
  const selectedProtocol = configProtocol.value;
  configSubmitting.value = true;
  try {
    try {
      await form.validate();
    } catch {
      return;
    }
    const payload: Api.Authx.AuthProviderAccessUpdateParams = {
      protocol: selectedProtocol,
      settings: form.buildSettings()
    };
    const { error } = await fetchUpdateAuthProvider(provider.id, payload);
    if (!error) {
      window.$message?.success($t('page.authx.form.message.updateSuccess'));
      configModalVisible.value = false;
      await getData();
    }
  } finally {
    configSubmitting.value = false;
  }
}

function openProviderAdvanced(provider: Api.Authx.AuthProvider) {
  advancedData.value = provider;
  advancedModalVisible.value = true;
}

function editProviderBasic(provider: Api.Authx.AuthProvider) {
  basicOperateType.value = 'edit';
  basicEditingData.value = provider;
  basicModalVisible.value = true;
}

function handleProviderMenu(key: string, provider: Api.Authx.AuthProvider) {
  if (key === 'edit') {
    editProviderBasic(provider);
    return;
  }
  if (key === 'advanced') {
    openProviderAdvanced(provider);
    return;
  }
  if (key === 'delete') {
    window.$dialog?.warning({
      title: $t('common.warning'),
      content: $t('page.authx.deleteConfirm'),
      positiveText: $t('common.confirm'),
      negativeText: $t('common.cancel'),
      onPositiveClick: () => deleteProvider(provider.id)
    });
  }
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
        <NCard
          v-for="provider in providers"
          :key="provider.id"
          size="small"
          class="provider-card cursor-pointer"
          @click="openProviderConfig(provider)"
        >
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
                <div class="flex shrink-0 items-center gap-4px">
                  <NTag :type="provider.status === '1' ? 'success' : 'default'" size="small" round>
                    {{ provider.status === '1' ? $t('page.authx.status.enabled') : $t('page.authx.status.disabled') }}
                  </NTag>
                  <NDropdown
                    trigger="click"
                    placement="bottom-end"
                    :options="getProviderMenuOptions(provider)"
                    @select="key => handleProviderMenu(String(key), provider)"
                  >
                    <NButton quaternary circle size="small" :aria-label="$t('common.operate')" @click.stop>
                      <template #icon><SvgIcon icon="mdi:dots-vertical" /></template>
                    </NButton>
                  </NDropdown>
                </div>
              </div>
            </div>
          </div>

          <div class="my-16px h-1px bg-gray-200 dark:bg-gray-700" />

          <div class="grid grid-cols-2 gap-12px text-13px">
            <div>
              <div class="text-gray-500">{{ $t('page.authx.protocol') }}</div>
              <div class="mt-5px font-500">
                {{
                  provider.configured ? protocolMeta[provider.protocol].label : $t('page.authx.pendingConfiguration')
                }}
              </div>
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
              <div class="mt-5px font-500">{{ getClientSecretStatus(provider) }}</div>
            </div>
          </div>

          <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-8px">
              <span class="text-12px text-gray-500">{{ $t('page.authx.cardClickTip') }}</span>
              <NButton
                size="small"
                quaternary
                :disabled="!provider.configured"
                :type="provider.status === '1' ? 'warning' : 'success'"
                @click.stop="toggleStatus(provider)"
              >
                {{ provider.status === '1' ? $t('common.disable') : $t('common.enable') }}
              </NButton>
            </div>
          </template>
        </NCard>
      </div>
    </NSpin>

    <div v-if="pagination.total > pagination.page_size" class="flex justify-end">
      <NPagination :page="pagination.page" :page-count="pageCount" @update:page="changePage" />
    </div>

    <AuthProviderBasicModal
      v-model:visible="basicModalVisible"
      :operate-type="basicOperateType"
      :row-data="basicEditingData"
      @submitted="getData"
    />
    <NModal
      v-model:show="configModalVisible"
      :title="$t('page.authx.form.configTitle')"
      preset="card"
      :mask-closable="false"
      class="max-w-95vw w-680px"
      content-style="max-height: calc(100vh - 220px); overflow-y: auto;"
    >
      <KeepAlive v-if="configModalVisible && configuringData" :key="configuringData.id">
        <component
          :is="configForm"
          ref="configFormRef"
          :row-data="configuringData"
          :default-callback-url="defaultCallbackUrl"
        >
          <template #protocol>
            <NFormItemGi :span="12" :label="$t('page.authx.form.label.protocol')" required>
              <NSelect
                v-model:value="configProtocol"
                :disabled="configuringData.status === '1' || configSubmitting"
                :options="[
                  { label: 'CAS', value: 'cas' },
                  { label: 'OAuth2', value: 'oauth2' }
                ]"
              />
            </NFormItemGi>
          </template>
        </component>
      </KeepAlive>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="configModalVisible = false">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" :loading="configSubmitting" @click="submitProviderConfig">
            {{ $t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NModal>
    <AuthProviderAdvancedModal v-model:visible="advancedModalVisible" :row-data="advancedData" @submitted="getData" />
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
