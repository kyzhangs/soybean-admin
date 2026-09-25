<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

const SCRIPT_ID = 'HbZzdoc1SDJhl3zP';
const WIDGET_SELECTORS = [
  '#dify-chatbot-bubble-button',
  '#dify-chatbot-bubble-window',
  '.wisagent-chatbot-bubble-button',
  '.wisagent-chatbot-bubble-window'
];

function removeWidget() {
  document.getElementById(SCRIPT_ID)?.remove();

  document.querySelectorAll(WIDGET_SELECTORS.join(',')).forEach(element => {
    element.remove();
  });

  const chatbotWindow = window as Window & {
    wisagentChatbotConfig?: unknown;
  };
  delete chatbotWindow.wisagentChatbotConfig;
}

function loadWidget() {
  const chatbotWindow = window as Window & {
    wisagentChatbotConfig?: {
      token: string;
      baseUrl: string;
      systemVariables: Record<string, string>;
      dynamicScript?: boolean;
    };
  };

  chatbotWindow.wisagentChatbotConfig = {
    token: SCRIPT_ID,
    baseUrl: 'https://aitest.wisedu.com',
    systemVariables: {},
    // 脚本默认等待 body 的 load 事件初始化，而动态插入的脚本不会再触发该事件，故开启立即初始化
    dynamicScript: true
  };

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = 'https://aitest.wisedu.com/embed.min.js';
  document.head.appendChild(script);
}

onMounted(() => {
  removeWidget();
  loadWidget();
});

onBeforeUnmount(removeWidget);
</script>

<template>
  <span aria-hidden="true" />
</template>

<style>
.wisagent-chatbot-bubble-button {
  background-color: #1c64f2 !important;
}

.wisagent-chatbot-bubble-window {
  width: 24rem !important;
  height: 40rem !important;
}
</style>
