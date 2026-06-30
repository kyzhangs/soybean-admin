<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { fetchGetRoleList } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';

defineOptions({
  name: 'UserCenter'
});

const authStore = useAuthStore();
const userInfo = authStore.userInfo;
const loading = ref(false);
const roles = ref<Api.SystemManage.Role[]>([]);

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

function valueOrEmpty(value: string | null | undefined) {
  return value || $t('common.noData');
}

async function refreshUserInfo() {
  loading.value = true;
  const [, roleRes] = await Promise.all([authStore.getUserInfo(), fetchGetRoleList()]);

  if (!roleRes.error) {
    roles.value = roleRes.data;
  }

  loading.value = false;
}

onMounted(() => {
  refreshUserInfo();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="card-wrapper" :loading="loading">
      <div class="flex flex-wrap items-center justify-between gap-24px">
        <div class="flex items-center gap-18px">
          <SoybeanAvatar :url="userInfo.avatar" class="size-84px!" />
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-10px">
              <h2 class="m-0 flex items-center gap-6px text-22px font-semibold leading-30px">
                <span>{{ authStore.userDisplayName }}</span>
                <SvgIcon v-if="userInfo.is_superuser" icon="eos-icons:admin" class="text-22px text-primary" />
              </h2>
            </div>
            <div class="mt-8px flex flex-wrap items-center gap-8px">
              <span class="text-13px text-#6b7280">{{ $t('page.user-center.roles') }}:</span>
              <template v-if="displayRoles.length">
                <NTag v-for="role in displayRoles" :key="role" type="warning" size="small">
                  {{ role }}
                </NTag>
              </template>
              <span v-else class="text-13px text-#6b7280">{{ $t('page.user-center.unassignedRole') }}</span>
            </div>
            <div class="mt-8px flex flex-wrap items-center gap-x-16px gap-y-6px text-13px text-#6b7280">
              <span>{{ $t('page.system-manage.users.username') }}: {{ userInfo.username }}</span>
              <span>{{ $t('page.user-center.userId') }}: {{ userInfo.userId }}</span>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <NGrid responsive="screen" item-responsive :x-gap="16" :y-gap="16">
      <NGi span="24 l:14">
        <NCard
          :title="$t('page.user-center.personalInfo')"
          :bordered="false"
          size="small"
          class="card-wrapper h-full"
          :loading="loading"
        >
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
        </NCard>
      </NGi>

      <NGi span="24 l:10">
        <NCard
          :title="$t('page.user-center.accountInfo')"
          :bordered="false"
          size="small"
          class="card-wrapper h-full"
          :loading="loading"
        >
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
        </NCard>
      </NGi>

      <NGi span="24">
        <NCard
          :title="$t('page.user-center.securitySettings')"
          :bordered="false"
          size="small"
          class="card-wrapper h-full"
          :loading="loading"
        >
          <div class="flex items-center justify-between gap-16px">
            <div>
              <div class="text-15px font-medium">{{ $t('page.user-center.loginPwd') }}</div>
              <div class="mt-6px text-13px text-#6b7280">{{ $t('page.user-center.loginPwdTip') }}</div>
            </div>
            <NButton secondary disabled>{{ $t('page.user-center.modifyPwd') }}</NButton>
          </div>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped></style>
