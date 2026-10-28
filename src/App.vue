<script setup lang="ts">
import { computed, watch } from 'vue';
import { NConfigProvider, darkTheme } from 'naive-ui';
import type { WatermarkProps } from 'naive-ui';
import WisChatbox from './components/common/chatbox.vue';
import { useAppStore } from './store/modules/app';
import WisChatbot from './components/common/chatbot.vue';
import { useChatStore } from './store/modules/chat';
import { useAuthStore } from './store/modules/auth';
import { useThemeStore } from './store/modules/theme';
import { naiveDateLocales, naiveLocales } from './locales/naive';

defineOptions({
  name: 'App'
});

const appStore = useAppStore();
const authStore = useAuthStore();
const chatStore = useChatStore();
const themeStore = useThemeStore();

watch(
  () => authStore.isLogin,
  isLogin => {
    if (isLogin) void chatStore.load();
  },
  { immediate: true }
);

const naiveDarkTheme = computed(() => (themeStore.darkMode ? darkTheme : undefined));

const naiveLocale = computed(() => {
  return naiveLocales[appStore.locale];
});

const naiveDateLocale = computed(() => {
  return naiveDateLocales[appStore.locale];
});

const watermarkProps = computed<WatermarkProps>(() => {
  return {
    content: themeStore.watermarkContent,
    cross: true,
    fullscreen: true,
    fontSize: 16,
    lineHeight: 16,
    width: 384,
    height: 384,
    xOffset: 12,
    yOffset: 60,
    rotate: -15,
    zIndex: 9999
  };
});
</script>

<template>
  <NConfigProvider
    :theme="naiveDarkTheme"
    :theme-overrides="themeStore.naiveTheme"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    class="h-full"
  >
    <AppProvider>
      <RouterView class="bg-layout" />
      <WisChatbot v-if="authStore.isLogin && chatStore.initialized && chatStore.chatbotEnabled" />
      <WisChatbox v-if="authStore.isLogin && chatStore.initialized && chatStore.chatboxEnabled" />
      <NWatermark v-if="themeStore.watermark.visible" v-bind="watermarkProps" />
    </AppProvider>
  </NConfigProvider>
</template>

<style scoped></style>
