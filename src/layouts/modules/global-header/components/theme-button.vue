<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';

defineOptions({
  name: 'ThemeButton'
});

const appStore = useAppStore();
const { hasAuth } = useAuth();
</script>

<template>
  <ButtonIcon
    v-if="hasAuth('B_THEME_SETTINGS')"
    icon="majesticons:color-swatch-line"
    :tooltip-content="$t('icon.themeConfig')"
    @click="appStore.openThemeDrawer"
  />
</template>

<style scoped></style>
