<script setup lang="ts">
interface Props {
  id: string;
}

defineProps<Props>();
</script>

<template>
  <span class="hidden">{{ id }}</span>
  <LookForward />
</template>

<style scoped></style>
