<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import {
  fetchAuthBindingFlow,
  fetchDeleteAuthIdentity,
  fetchGetAuthIdentities,
  fetchGetPasskeys,
  fetchGetRoleList,
  fetchGetTwoFactorStatus,
  fetchPublicAuthProviders
} from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';
import PasswordChangeModal from './modules/password-change-modal.vue';
import PasskeyDeleteModal from './modules/passkey-delete-modal.vue';
import PasskeyModal from './modules/passkey-modal.vue';
import TwoFactorModal from './modules/two-factor-modal.vue';

defineOptions({
  name: 'UserCenter'
});

const authStore = useAuthStore();
const route = useRoute();
const userInfo = authStore.userInfo;
const loading = ref(false);
const roles = ref<Api.SystemManage.Role[]>([]);
const passwordChangeVisible = ref(false);
const passkeyVisible = ref(false);
const passkeyDeleteVisible = ref(false);
const passkeys = ref<Api.UserCenter.Passkey[]>([]);
const selectedPasskey = ref<Api.UserCenter.Passkey | null>(null);
const twoFactorVisible = ref(false);
const twoFactorAction = ref<'toggle' | 'regenerate'>('toggle');
const twoFactorStatus = ref<Api.Common.Status>('2');
const authIdentities = ref<Api.UserCenter.AuthIdentity[]>([]);
const authProviders = ref<Api.Authx.PublicAuthProvider[]>([]);
const bindingProviderCode = ref('');

const genderLabel = computed(() => $t(userGenderRecord[userInfo.gender]));
const genderTagType = computed(() => {
  const tagMap: Record<Api.SystemManage.Gender, NaiveUI.ThemeColor> = {
    '1': 'info',
    '2': 'error',
    '3': 'default'
  };

  return tagMap[userInfo.gender];
});

const roleMap = computed(() => new Map(roles.value.map(role => [role.code, role.name])));
const displayRoles = computed(() => userInfo.roles.map(role => roleMap.value.get(role) || role));
const statusTagType = computed(() => {
  const tagMap: Record<Api.Common.Status, NaiveUI.ThemeColor> = {
    '1': 'success',
    '2': 'warning'
  };

  return tagMap[userInfo.status];
});
const statusLabel = computed(() => $t(enableStatusRecord[userInfo.status]));
const twoFactorEnabled = computed(() => twoFactorStatus.value === '1');
const passkeyCards = computed(() =>
  passkeys.value.map(passkey => ({
    passkey,
    addedAt: passkey.create_time || $t('common.noData'),
    lastUsedAt: passkey.last_used_at || $t('page.user-center.passkey.neverUsed')
  }))
);
const boundProviderCodes = computed(() => new Set(authIdentities.value.map(identity => identity.provider_code)));
const bindableProviders = computed(() =>
  authProviders.value.filter(provider => provider.protocol === 'oauth2' && !boundProviderCodes.value.has(provider.code))
);

function valueOrEmpty(value: string | null | undefined) {
  return value || $t('common.noData');
}

async function refreshUserInfo() {
  loading.value = true;
  const [, roleRes, twoFactorStatusRes, passkeyRes, identityRes, providerRes] = await Promise.all([
    authStore.getUserInfo(),
    fetchGetRoleList(),
    fetchGetTwoFactorStatus(),
    fetchGetPasskeys(),
    fetchGetAuthIdentities(),
    fetchPublicAuthProviders()
  ]);

  if (!roleRes.error) {
    roles.value = roleRes.data;
  }
  if (!twoFactorStatusRes.error) {
    twoFactorStatus.value = twoFactorStatusRes.data.status;
  }
  if (!passkeyRes.error) {
    passkeys.value = passkeyRes.data;
  }
  if (!identityRes.error) authIdentities.value = identityRes.data;
  if (!providerRes.error) authProviders.value = providerRes.data;

  loading.value = false;
}

async function bindAuthProvider(providerCode: string) {
  bindingProviderCode.value = providerCode;
  try {
    const callbackUrl = `${window.location.origin}/user-center`;
    const { data, error } = await fetchAuthBindingFlow(providerCode, callbackUrl);
    if (!error) window.location.assign(data.authorization_url);
  } finally {
    bindingProviderCode.value = '';
  }
}

async function unbindAuthIdentity(identityId: string) {
  const { error } = await fetchDeleteAuthIdentity(identityId);
  if (!error) {
    window.$message?.success('解绑成功');
    const { data, error: refreshError } = await fetchGetAuthIdentities();
    if (!refreshError) authIdentities.value = data;
  }
}

async function handleTwoFactorChanged() {
  twoFactorVisible.value = false;
  const { data, error } = await fetchGetTwoFactorStatus();
  if (!error) {
    twoFactorStatus.value = data.status;
  }
}

async function handlePasskeyChanged() {
  const { data, error } = await fetchGetPasskeys();
  if (!error) {
    passkeys.value = data;
  }
}

function openPasskeyDelete(passkey: Api.UserCenter.Passkey) {
  selectedPasskey.value = passkey;
  passkeyDeleteVisible.value = true;
}

function openTwoFactorModal(action: 'toggle' | 'regenerate') {
  twoFactorAction.value = action;
  twoFactorVisible.value = true;
}

onMounted(() => {
  if (route.query.binding === 'success') {
    window.$message?.success('外部账号绑定成功');
    window.history.replaceState({}, '', route.path);
  } else if (route.query.error) {
    window.$message?.error(`外部账号绑定失败（${String(route.query.error)}）`);
    window.history.replaceState({}, '', route.path);
  }
  refreshUserInfo();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-x-hidden overflow-y-auto">
    <NCard :bordered="false" size="small" class="card-wrapper" :loading="loading">
      <div class="flex flex-wrap items-center gap-18px">
        <SoybeanAvatar :url="userInfo.avatar" class="size-84px! shrink-0" />
        <div class="min-w-0 flex-1">
          <h2 class="m-0 flex flex-wrap items-center gap-6px text-22px font-semibold leading-30px">
            <span>{{ authStore.userDisplayName }}</span>
            <SvgIcon v-if="userInfo.is_superuser" icon="eos-icons:admin" class="text-22px text-primary" />
          </h2>
          <div class="mt-8px flex flex-wrap items-center gap-8px">
            <span class="text-13px text-#6b7280">{{ $t('page.user-center.roles') }}:</span>
            <template v-if="displayRoles.length">
              <NTag v-for="role in displayRoles" :key="role" type="warning" size="small">
                {{ role }}
              </NTag>
            </template>
            <span v-else class="text-13px text-#6b7280">{{ $t('page.user-center.unassignedRole') }}</span>
          </div>
          <div class="mt-8px flex flex-wrap gap-x-16px gap-y-6px text-13px text-#6b7280">
            <span>@{{ userInfo.username }}</span>
            <span class="break-all">{{ $t('page.user-center.userId') }}: {{ userInfo.userId }}</span>
          </div>
        </div>
      </div>
    </NCard>

    <NCard
      :title="$t('page.user-center.personalInfo')"
      :bordered="false"
      size="small"
      class="card-wrapper"
      :loading="loading"
    >
      <NGrid responsive="screen" item-responsive :x-gap="16" :y-gap="12">
        <NGi span="24 s:12">
          <NDescriptions label-placement="left" bordered :column="1" size="small">
            <NDescriptionsItem :label="$t('page.system-manage.users.name')">
              {{ valueOrEmpty(userInfo.name) }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.system-manage.users.gender')">
              <NTag :type="genderTagType" size="small">{{ genderLabel }}</NTag>
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.system-manage.users.phone')">
              {{ valueOrEmpty(userInfo.phone) }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.system-manage.users.email')">
              {{ valueOrEmpty(userInfo.email) }}
            </NDescriptionsItem>
          </NDescriptions>
        </NGi>
        <NGi span="24 s:12">
          <NDescriptions label-placement="left" bordered :column="1" size="small">
            <NDescriptionsItem :label="$t('page.user-center.accountStatus')">
              <NTag :type="statusTagType" size="small">{{ statusLabel }}</NTag>
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('common.create_time')">
              {{ valueOrEmpty(userInfo.create_time) }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.user-center.activeTime')">
              {{ valueOrEmpty(userInfo.active_time) }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.user-center.lastLogin')">
              {{ valueOrEmpty(userInfo.last_login) }}
            </NDescriptionsItem>
          </NDescriptions>
        </NGi>
      </NGrid>
    </NCard>

    <NCard
      :title="$t('page.user-center.securitySettings')"
      :bordered="false"
      size="small"
      class="card-wrapper"
      :loading="loading"
    >
      <div class="flex flex-wrap items-center justify-between gap-16px">
        <div class="min-w-0 flex-1">
          <div class="text-15px font-medium">{{ $t('page.user-center.loginPwd') }}</div>
          <div class="mt-6px text-13px text-#6b7280">{{ $t('page.user-center.loginPwdTip') }}</div>
        </div>
        <NButton class="shrink-0" secondary @click="passwordChangeVisible = true">
          {{ $t('page.user-center.modifyPwd') }}
        </NButton>
      </div>
      <NDivider />
      <div class="flex flex-wrap items-center justify-between gap-16px">
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-8px text-15px font-medium">
            {{ $t('page.user-center.twoFactor.title') }}
            <NTag :type="twoFactorEnabled ? 'success' : 'default'" size="small">
              {{
                twoFactorEnabled ? $t('page.user-center.twoFactor.enabled') : $t('page.user-center.twoFactor.disabled')
              }}
            </NTag>
          </div>
          <div class="mt-6px text-13px text-#6b7280">{{ $t('page.user-center.twoFactor.tip') }}</div>
        </div>
        <div class="flex shrink-0 flex-wrap justify-end gap-8px">
          <NButton v-if="twoFactorEnabled" secondary @click="openTwoFactorModal('regenerate')">
            {{ $t('page.user-center.twoFactor.regenerateRecoveryCodes') }}
          </NButton>
          <NButton :type="twoFactorEnabled ? 'error' : 'primary'" secondary @click="openTwoFactorModal('toggle')">
            {{ twoFactorEnabled ? $t('page.user-center.twoFactor.disable') : $t('page.user-center.twoFactor.enable') }}
          </NButton>
        </div>
      </div>
      <NDivider />
      <div>
        <div class="flex flex-wrap items-center justify-between gap-16px">
          <div class="min-w-0 flex-1">
            <div class="text-15px font-medium">第三方账号</div>
            <div class="mt-6px text-13px text-#6b7280">绑定后可直接使用对应的 OAuth2 账号登录</div>
          </div>
          <NSpace>
            <NButton
              v-for="provider in bindableProviders"
              :key="provider.code"
              type="primary"
              secondary
              :loading="bindingProviderCode === provider.code"
              @click="bindAuthProvider(provider.code)"
            >
              绑定 {{ provider.name }}
            </NButton>
          </NSpace>
        </div>
        <NGrid v-if="authIdentities.length" responsive="screen" item-responsive :x-gap="12" :y-gap="12" class="mt-12px">
          <NGi v-for="identity in authIdentities" :key="identity.id" span="24 s:12">
            <NCard size="small" embedded>
              <div class="flex items-center justify-between gap-12px">
                <div class="min-w-0 flex items-center gap-10px">
                  <SvgIcon :icon="identity.provider_icon || 'mdi:account-key-outline'" class="text-22px text-primary" />
                  <div class="min-w-0">
                    <div class="font-medium">{{ identity.provider_name }}</div>
                    <div class="truncate text-12px text-#6b7280">
                      {{ identity.username || identity.email || '已绑定' }}
                    </div>
                  </div>
                </div>
                <NPopconfirm @positive-click="unbindAuthIdentity(identity.id)">
                  <template #trigger><NButton text type="error" size="small">解绑</NButton></template>
                  确认解绑该第三方账号？
                </NPopconfirm>
              </div>
            </NCard>
          </NGi>
        </NGrid>
      </div>
      <NDivider />
      <div>
        <div class="flex flex-wrap items-center justify-between gap-16px">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-8px text-15px font-medium">
              {{ $t('page.user-center.passkey.title') }}
              <NTag :type="passkeys.length ? 'success' : 'default'" size="small">
                {{ $t('page.user-center.passkey.boundCount', { count: passkeys.length }) }}
              </NTag>
            </div>
            <div class="mt-6px text-13px text-#6b7280">{{ $t('page.user-center.passkey.tip') }}</div>
          </div>
          <NButton class="shrink-0" type="primary" secondary @click="passkeyVisible = true">
            {{ $t('page.user-center.passkey.bind') }}
          </NButton>
        </div>

        <NGrid v-if="passkeyCards.length" responsive="screen" item-responsive :x-gap="12" :y-gap="12" class="mt-12px">
          <NGi v-for="card in passkeyCards" :key="card.passkey.id" span="24 s:12">
            <NCard size="small" embedded class="h-full">
              <div class="flex items-start justify-between gap-12px">
                <div class="min-w-0 flex-y-center gap-8px text-15px font-medium">
                  <SvgIcon icon="mdi:fingerprint" class="shrink-0 text-20px text-primary" />
                  <span class="truncate">{{ card.passkey.name }}</span>
                </div>
                <NButton text type="error" size="tiny" class="shrink-0" @click="openPasskeyDelete(card.passkey)">
                  <template #icon><SvgIcon icon="mdi:trash-can-outline" /></template>
                  {{ $t('page.user-center.passkey.delete') }}
                </NButton>
              </div>
              <div class="mt-12px flex-col-stretch gap-8px text-13px">
                <div class="flex items-start justify-between gap-12px">
                  <span class="shrink-0 text-#6b7280">{{ $t('page.user-center.passkey.addedAt') }}</span>
                  <span class="break-all text-right">{{ card.addedAt }}</span>
                </div>
                <div class="flex items-start justify-between gap-12px">
                  <span class="shrink-0 text-#6b7280">{{ $t('page.user-center.passkey.lastUsedAt') }}</span>
                  <span class="break-all text-right">{{ card.lastUsedAt }}</span>
                </div>
              </div>
            </NCard>
          </NGi>
        </NGrid>
      </div>
    </NCard>

    <PasswordChangeModal v-model:visible="passwordChangeVisible" />
    <PasskeyModal v-model:visible="passkeyVisible" @submitted="handlePasskeyChanged" />
    <PasskeyDeleteModal
      v-model:visible="passkeyDeleteVisible"
      :passkey="selectedPasskey"
      @submitted="handlePasskeyChanged"
    />
    <TwoFactorModal
      v-model:visible="twoFactorVisible"
      :enabled="twoFactorEnabled"
      :action="twoFactorAction"
      @submitted="handleTwoFactorChanged"
    />
  </div>
</template>

<style scoped></style>
