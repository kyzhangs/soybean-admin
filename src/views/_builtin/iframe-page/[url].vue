<script setup lang="ts">
import type { CSSProperties } from 'vue';

interface Props {
  url: string;
  /** Inline styles for the iframe element. */
  style?: CSSProperties | string;
  /** Permissions Policy for the embedded page, for example `microphone`. */
  allow?: string;
  /** Legacy iframe border attribute. Prefer `style.border` for new routes. */
  frameborder?: string | number;
}

withDefaults(defineProps<Props>(), {
  allow: undefined,
  frameborder: 0,
  style: undefined
});
</script>

<template>
  <div class="h-full">
    <iframe
      id="iframePage"
      class="size-full"
      :src="url"
      :style="style"
      :allow="allow"
      :frameborder="frameborder"
    ></iframe>
  </div>
</template>

<style scoped></style>
