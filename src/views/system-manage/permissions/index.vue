<script setup lang="tsx">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const routeQuery = computed(() => route.query);
</script>

<template>
  <LookForward>
    <div>{{ routeQuery }}</div>
  </LookForward>
</template>

<style scoped></style>
