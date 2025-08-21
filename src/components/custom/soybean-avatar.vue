<script setup lang="ts">
  import { useAuthStore } from '@/store/modules/auth';
  import { useThemeStore } from '@/store/modules/theme';

  const authStore = useAuthStore();

  const themeStore = useThemeStore();

  defineOptions({
    name: 'SoybeanAvatar'
  });
</script>

<template>
  <div class="size-72px flex-y-center justify-center overflow-hidden border rd-1/2">
    <NAvatar v-if="authStore.userInfo?.avatar" :size="72" round :src="authStore.userInfo?.avatar" />
    <NAvatar v-else :size="72" round class="text-32px" :color="themeStore.themeColors.primary">
      {{ authStore.userDisplayName.slice(0, 1) }}
    </NAvatar>
  </div>
</template>

<style scoped></style>
