<script setup lang="ts">
import { computed } from 'vue';
import default_avatar from '@/assets/imgs/soybean.jpg';

defineOptions({
  name: 'SoybeanAvatar'
});

interface Props {
  url?: string | null;
}

const props = defineProps<Props>();

const avatar = computed(() => props.url ?? default_avatar);
</script>

<template>
  <div class="size-72px overflow-hidden rd-1/2">
    <img :src="avatar" class="size-full" />
  </div>
</template>

<style scoped></style>
