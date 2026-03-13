<script setup lang="ts">
interface Props {
  id: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div>
    <p class="w-full text-center">user_id: {{ props.id }}</p>
    <LookForward />
  </div>
</template>

<style scoped></style>
