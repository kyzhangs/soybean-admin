<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { fetchGetRoleList, fetchGetTwoFactorStatus } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';
import PasswordChangeModal from './modules/password-change-modal.vue';
import TwoFactorModal from './modules/two-factor-modal.vue';

defineOptions({
  name: 'UserCenter'
});

const authStore = useAuthStore();
const userInfo = authStore.userInfo;
const loading = ref(false);
const roles = ref<Api.SystemManage.Role[]>([]);
const passwordChangeVisible = ref(false);
const twoFactorVisible = ref(false);
const twoFactorAction = ref<'toggle' | 'regenerate'>('toggle');
const twoFactorStatus = ref<Api.Common.Status>('2');

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

function valueOrEmpty(value: string | null | undefined) {
  return value || $t('common.noData');
}

async function refreshUserInfo() {
  loading.value = true;
  const [, roleRes, twoFactorStatusRes] = await Promise.all([
    authStore.getUserInfo(),
    fetchGetRoleList(),
    fetchGetTwoFactorStatus()
  ]);

  if (!roleRes.error) {
    roles.value = roleRes.data;
  }
  if (!twoFactorStatusRes.error) {
    twoFactorStatus.value = twoFactorStatusRes.data.status;
  }

  loading.value = false;
}

async function handleTwoFactorChanged() {
  twoFactorVisible.value = false;
  const { data, error } = await fetchGetTwoFactorStatus();
  if (!error) {
    twoFactorStatus.value = data.status;
  }
}

function openTwoFactorModal(action: 'toggle' | 'regenerate') {
  twoFactorAction.value = action;
  twoFactorVisible.value = true;
}

onMounted(() => {
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
    </NCard>

    <PasswordChangeModal v-model:visible="passwordChangeVisible" />
    <TwoFactorModal
      v-model:visible="twoFactorVisible"
      :enabled="twoFactorEnabled"
      :action="twoFactorAction"
      @submitted="handleTwoFactorChanged"
    />
  </div>
</template>

<style scoped></style>
