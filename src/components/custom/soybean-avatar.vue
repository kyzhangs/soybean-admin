<script setup lang="ts">
import soybeanImg from '@/assets/imgs/soybean.jpg';
import { computed } from 'vue';

defineOptions({
  name: 'SoybeanAvatar'
});

interface Props {
  url?: string | null;
}

const props = defineProps<Props>();

const avatar = computed(() => props.url || soybeanImg);
</script>

<template>
  <div class="size-72px overflow-hidden rd-1/2 border-2">
    <img :src="avatar" class="size-full" />
  </div>
</template>

<style scoped></style>
