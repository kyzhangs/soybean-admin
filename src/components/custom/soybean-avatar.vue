<script setup lang="ts">
  import { computed } from 'vue';
  import { useAuthStore } from '@/store/modules/auth';
  import soybeanImg from '@/assets/imgs/soybean.jpg';

  const authStore = useAuthStore();

  const avatar = computed(() => {
    return authStore.userInfo?.avatar || soybeanImg;
  });

  defineOptions({
    name: 'SoybeanAvatar'
  });
</script>

<template>
  <div class="size-72px flex-y-center justify-center overflow-hidden border rd-1/2">
    <NAvatar :size="72" round :src="avatar" />
  </div>
</template>

<style scoped></style>
