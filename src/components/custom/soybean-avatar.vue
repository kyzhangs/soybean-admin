<script setup lang="ts">
import { computed } from 'vue';
import defaultAvatar from '@/assets/imgs/soybean.jpg';

interface Props {
  url?: string;
}

const props = defineProps<Props>();

defineOptions({
  name: 'SoybeanAvatar'
});

const avatarUrl = computed(() => {
  return props.url || defaultAvatar;
});
</script>

<template>
  <div class="size-72px overflow-hidden border rd-1/2">
    <img :src="avatarUrl" class="size-full" />
  </div>
</template>

<style scoped></style>
