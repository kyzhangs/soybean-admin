<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useLoading } from '@sa/hooks';
import { userGenderRecord } from '@/constants/business';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';

defineOptions({
  name: 'UserCenter'
});

const appStore = useAppStore();
const authStore = useAuthStore();

const column = computed(() => (appStore.isMobile ? 1 : 2));

const displayName = computed(() => authStore.userInfo.name ?? authStore.userInfo.username);

const genderLabel = computed(() => $t(userGenderRecord[authStore.userInfo.gender]));

const genderMeta = computed(() => {
  const gender = authStore.userInfo.gender;

  const typeMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
    '1': 'primary',
    '2': 'error',
    '3': 'default'
  };

  const iconMap: Record<Api.SystemManage.UserGender, string> = {
    '1': 'ph:gender-male',
    '2': 'ph:gender-female',
    '3': 'ph:question'
  };

  return {
    type: typeMap[gender],
    icon: iconMap[gender],
    label: genderLabel.value
  };
});

const { loading, startLoading, endLoading } = useLoading();

async function refreshUserInfo() {
  startLoading();
  await authStore.initUserInfo();
  endLoading();
}

onMounted(() => {
  if (!authStore.userInfo.userId) {
    refreshUserInfo();
  }
});
</script>

<template>
  <div class="min-h-500px overflow-hidden lt-sm:overflow-auto">
    <NSpace vertical :size="16">
      <NCard :title="$t('common.userCenter')" :bordered="false" size="small" segmented class="card-wrapper">
        <template #header-extra>
          <NButton size="small" :loading="loading" @click="refreshUserInfo">
            <template #icon>
              <icon-ic-round-refresh class="text-icon" />
            </template>
            {{ $t('common.refresh') }}
          </NButton>
        </template>

        <div class="flex gap-16px lt-sm:flex-col">
          <div class="flex-y-center gap-12px">
            <SoybeanAvatar :url="authStore.userInfo.avatar" />
            <div class="min-w-0 flex-col gap-6px">
              <div class="flex-y-center gap-8px">
                <span class="text-18px font-semibold">{{ displayName }}</span>
                <NTag v-if="authStore.userInfo.is_superuser" type="warning" size="small">超级管理员</NTag>
              </div>
              <div class="text-12px text-#666">
                <span class="mr-12px">ID: {{ authStore.userInfo.userId }}</span>
                <span>{{ $t('page.system-manage.users.username') }}: {{ authStore.userInfo.username }}</span>
              </div>
            </div>
          </div>
        </div>
      </NCard>

      <NCard title="基本信息" :bordered="false" size="small" segmented class="card-wrapper">
        <NDescriptions label-placement="left" bordered size="small" :column="column">
          <NDescriptionsItem :label="$t('page.system-manage.users.name')">
            {{ authStore.userInfo.name ?? '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.system-manage.users.gender')">
            <NTag size="small" :type="genderMeta.type">
              <span class="flex-y-center gap-4px">
                <SvgIcon :icon="genderMeta.icon" />
                <span>{{ genderMeta.label }}</span>
              </span>
            </NTag>
          </NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.system-manage.users.phone')">
            {{ authStore.userInfo.phone ?? '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.system-manage.users.email')">
            {{ authStore.userInfo.email ?? '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem label="激活时间">
            {{ authStore.userInfo.active_time || '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.system-manage.users.last_login')">
            {{ authStore.userInfo.last_login || '-' }}
          </NDescriptionsItem>
        </NDescriptions>
      </NCard>
    </NSpace>
  </div>
</template>

<style scoped></style>
