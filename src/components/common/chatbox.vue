<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useChatStore } from '@/store/modules/chat';

defineOptions({
  name: 'WisChatbox'
});

interface WisAIStarterOptions {
  iframeUrl: string;
  app: {
    appName: string;
    viewMode: 'min' | 'max';
    starterIcon?: {
      url: string;
    };
  };
  runtime: {
    name: string;
    urlPrefix: string;
    urlSuffix: string;
    XAIAuthorization: string;
    params: {
      user: string;
    };
    supportRestful: boolean;
  };
}

interface WisAIStarterInstance {
  on(event: string, callback: (data: unknown) => void): void;
  destroy(): void;
}

interface WisAIStarterConstructor {
  new (options: WisAIStarterOptions): WisAIStarterInstance;
}

declare global {
  interface Window {
    WisAIStarter?: WisAIStarterConstructor;
  }
}

const authStore = useAuthStore();
const chatStore = useChatStore();
let starter: WisAIStarterInstance | null = null;
let starterScriptPromise: Promise<void> | null = null;

function chatboxBaseUrl() {
  return chatStore.settings.chatbox.baseUrl.replace(/\/+$/, '');
}

function loadStarterScript() {
  const scriptUrl = `${chatboxBaseUrl()}/chatbox/starter/ai-starter.min.js`;
  if (window.WisAIStarter) return Promise.resolve();
  if (starterScriptPromise) return starterScriptPromise;

  starterScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);

    const handleLoad = () => {
      if (window.WisAIStarter) {
        resolve();
      } else {
        reject(new Error('AI 启动器脚本已加载，但未找到 WisAIStarter'));
      }
    };
    const handleError = () => reject(new Error('AI 启动器脚本加载失败'));

    if (existingScript) {
      if (window.WisAIStarter) {
        resolve();
      } else {
        existingScript.addEventListener('load', handleLoad, { once: true });
        existingScript.addEventListener('error', handleError, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    document.head.appendChild(script);
  });

  return starterScriptPromise;
}

async function createAIStarter() {
  await loadStarterScript();

  if (!window.WisAIStarter) {
    throw new Error('WisAIStarter 未加载');
  }

  starter = new window.WisAIStarter({
    iframeUrl: `${chatboxBaseUrl()}/chatbox/web/`,
    app: {
      appName: 'WisagentAI',
      viewMode: 'min',
      starterIcon: {
        url: '/robot.png'
      }
    },
    runtime: {
      name: 'Authorization',
      urlSuffix: '',
      XAIAuthorization: `Bearer ${chatStore.settings.chatbox.token}`,
      urlPrefix: `${chatboxBaseUrl()}/v1`,
      params: {
        user: authStore.userInfo.username || 'dtp-admin'
      },
      supportRestful: true
    }
  });

  // WisAIStarter defaults this property to [60, 60] and writes it inline even when omitted.
  document.querySelector('.wis-ai-starter-icon')?.removeAttribute('style');

  starter.on('ready', data => {
    console.info('AI 启动器已就绪', data);
  });
  starter.on('error', data => {
    console.error('AI 启动器运行失败', data);
  });
}

let mountId = 0;

onMounted(() => {
  const currentMountId = ++mountId;
  createAIStarter()
    .then(() => {
      if (currentMountId !== mountId) starter?.destroy();
    })
    .catch(error => {
      console.error('AI 启动器初始化失败', error);
    });
});

onBeforeUnmount(() => {
  mountId += 1;
  starter?.destroy();
  starter = null;
});
</script>

<template>
  <span aria-hidden="true" />
</template>

<style>
.wis-chatbox,
.wis-ai-starter {
  position: fixed !important;
  left: 24px !important;
  right: auto !important;
  bottom: 24px !important;
  width: 80px !important;
  height: 80px !important;
  overflow: hidden !important;
  margin: 0 !important;
  z-index: 10000 !important;
  transform: translateX(-50%) !important;
  transition: transform 0.3s ease !important;
}

.wis-ai-starter-icon,
.wis-ai-starter img,
.wis-chatbox img {
  width: 64px !important;
  height: 64px !important;
  object-fit: contain !important;
}

.wis-chatbox:hover,
.wis-ai-starter:hover {
  transform: translateX(0) !important;
}

.wis-ai-container.min-mode {
  top: 50% !important;
  left: 50% !important;
  right: auto !important;
  bottom: auto !important;
  width: min(760px, calc(100vw - 32px)) !important;
  height: min(720px, calc(100vh - 82px)) !important;
  margin: 0 !important;
  transform: translate(-50%, -50%) !important;
  border-radius: 18px !important;
  overflow: hidden !important;
  box-shadow: 0 22px 64px rgb(15 23 42 / 28%) !important;
  z-index: 10001 !important;
}

.wis-ai-container.max-mode {
  position: fixed !important;
  inset: 41px !important;
  width: auto !important;
  height: auto !important;
  margin: 0 !important;
  transform: none !important;
  border-radius: 18px !important;
  overflow: hidden !important;
  box-shadow: 0 22px 64px rgb(15 23 42 / 28%) !important;
  z-index: 10001 !important;
}

.wis-ai-container.min-mode iframe {
  width: 100% !important;
  height: 100% !important;
}

.wis-ai-container.max-mode iframe {
  width: 100% !important;
  height: 100% !important;
}

.wis-ai-container:has(> .wis-ai-iframe.fullscreen) {
  position: fixed !important;
  inset: 16px !important;
  width: auto !important;
  height: auto !important;
  margin: 0 !important;
  transform: none !important;
  border-radius: 18px !important;
  overflow: hidden !important;
}

.wis-ai-container > .wis-ai-iframe.fullscreen {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  border: 0 !important;
  border-radius: inherit !important;
}
</style>
