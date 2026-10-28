<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { useChatStore } from '@/store/modules/chat';

const chatStore = useChatStore();
const CHATBOT_ICON_URL = '/robot.png';
let widgetScript: HTMLScriptElement | null = null;
let bubbleIconObserver: MutationObserver | null = null;

const WIDGET_SELECTORS = [
  '#dify-chatbot-bubble-button',
  '#dify-chatbot-bubble-window',
  '.wisagent-chatbot-bubble-button',
  '.wisagent-chatbot-bubble-window'
];

function removeWidget() {
  bubbleIconObserver?.disconnect();
  bubbleIconObserver = null;
  const { token } = chatStore.settings.chatbot;
  widgetScript?.remove();
  widgetScript = null;
  document.getElementById(token)?.remove();

  document.querySelectorAll(WIDGET_SELECTORS.join(',')).forEach(element => {
    element.remove();
  });

  const chatbotWindow = window as Window & {
    wisagentChatbotConfig?: unknown;
  };
  delete chatbotWindow.wisagentChatbotConfig;
}

function normalizeBubbleIcon() {
  document
    .querySelectorAll<SVGElement>('#dify-chatbot-bubble-button #closeIcon, .wisagent-chatbot-bubble-button #closeIcon')
    .forEach(icon => {
      const image = document.createElement('img');
      image.src = CHATBOT_ICON_URL;
      image.alt = 'chatbot';
      icon.replaceWith(image);
    });
}

function loadWidget() {
  const chatbotWindow = window as Window & {
    wisagentChatbotConfig?: {
      token: string;
      baseUrl: string;
      inputs: Record<string, string>;
      isDev: boolean;
      icon: string;
      draggable: boolean;
      dragAxis: 'both' | 'x' | 'y';
      containerProps: Record<string, unknown>;
      dynamicScript?: boolean;
    };
  };

  chatbotWindow.wisagentChatbotConfig = {
    token: chatStore.settings.chatbot.token,
    baseUrl: chatStore.settings.chatbot.baseUrl,
    inputs: {},
    isDev: false,
    icon: CHATBOT_ICON_URL,
    draggable: false,
    dragAxis: 'both',
    containerProps: {},
    // 脚本默认等待 body 的 load 事件初始化，而动态插入的脚本不会再触发该事件，故开启立即初始化
    dynamicScript: true
  };

  const script = document.createElement('script');
  script.id = chatStore.settings.chatbot.token;
  const baseUrl = chatStore.settings.chatbot.baseUrl.replace(/\/+$/, '');
  script.src = `${baseUrl}/embed.min.js`;
  widgetScript = script;
  bubbleIconObserver = new MutationObserver(normalizeBubbleIcon);
  bubbleIconObserver.observe(document.body, { childList: true, subtree: true });
  document.head.appendChild(script);
  normalizeBubbleIcon();
}

onMounted(() => {
  removeWidget();
  loadWidget();
});

watch(
  () => chatStore.chatbotRevision,
  () => {
    removeWidget();
    loadWidget();
  }
);

onBeforeUnmount(removeWidget);
</script>

<template>
  <span aria-hidden="true" />
</template>

<style>
.wisagent-chatbot-bubble-button {
  position: fixed !important;
  right: 24px !important;
  bottom: 24px !important;
  display: flex !important;
  width: 80px !important;
  height: 80px !important;
  overflow: hidden !important;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  visibility: visible !important;
  opacity: 1 !important;
  cursor: pointer !important;
  z-index: 10000 !important;
  transform: translateX(50%) !important;
  transition: transform 0.3s ease !important;
}

.wisagent-chatbot-bubble-button img,
#dify-chatbot-bubble-button img {
  width: 64px !important;
  height: 64px !important;
  object-fit: contain !important;
}

.wisagent-chatbot-bubble-button:hover {
  transform: translateX(0) !important;
}

.wisagent-chatbot-bubble-window {
  position: fixed !important;
  right: 88px !important;
  bottom: 32px !important;
  z-index: 10001 !important;
  max-height: calc(100vh - 120px) !important;
  width: min(360px, calc(100vw - 32px)) !important;
  height: min(640px, calc(100vh - 120px)) !important;
  border-radius: 16px !important;
  box-shadow: -8px 0 24px rgb(70 79 105 / 12%) !important;
}

#dify-chatbot-bubble-button {
  position: fixed !important;
  right: 24px !important;
  bottom: 24px !important;
  display: flex !important;
  width: 80px !important;
  height: 80px !important;
  overflow: hidden !important;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  visibility: visible !important;
  opacity: 1 !important;
  cursor: pointer !important;
  z-index: 10000 !important;
  transform: translateX(50%) !important;
  transition: transform 0.3s ease !important;
}

#dify-chatbot-bubble-button:hover {
  transform: translateX(0) !important;
}

body:has(#dify-chatbot-bubble-window[style*='display: block']) #dify-chatbot-bubble-button {
  transform: translateX(0) !important;
}

#dify-chatbot-bubble-button svg path {
  stroke: #4f5c8a !important;
}

#dify-chatbot-bubble-window {
  position: fixed !important;
  right: 88px !important;
  bottom: 32px !important;
  z-index: 10001 !important;
  max-height: calc(100vh - 120px) !important;
  width: min(360px, calc(100vw - 32px)) !important;
  height: min(640px, calc(100vh - 120px)) !important;
  border-radius: 16px !important;
  box-shadow: -8px 0 24px rgb(70 79 105 / 12%) !important;
}
</style>
