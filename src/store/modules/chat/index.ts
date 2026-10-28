import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { fetchSetting, updateSetting } from '@/service/api/system-manage/settings';

export interface ChatSettings {
  chatbox: {
    enabled: boolean;
    baseUrl: string;
    token: string;
  };
  chatbot: { enabled: boolean; baseUrl: string; token: string; width: number };
}

type ChatboxSettings = ChatSettings['chatbox'];
type ChatbotSettings = ChatSettings['chatbot'];

const defaultSettings: ChatSettings = {
  chatbox: {
    enabled: false,
    baseUrl: '',
    token: ''
  },
  chatbot: {
    enabled: false,
    baseUrl: '',
    token: '',
    width: 360
  }
};

function toApiSettings(settings: ChatSettings) {
  return {
    chatbox: {
      enabled: settings.chatbox.enabled,
      base_url: settings.chatbox.baseUrl,
      token: settings.chatbox.token
    },
    chatbot: {
      enabled: settings.chatbot.enabled,
      base_url: settings.chatbot.baseUrl,
      token: settings.chatbot.token
    }
  };
}

type SettingValue = Record<string, unknown>;

function asSettingValue(value: unknown): SettingValue | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as SettingValue) : null;
}

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}

function readToken(value: unknown, fallback: string) {
  if (value === '********') return fallback || '********';
  return typeof value === 'string' ? value : fallback;
}

function fromApiChatbox(value: SettingValue, fallback: ChatSettings['chatbox']) {
  return {
    enabled: typeof value.enabled === 'boolean' ? value.enabled : fallback.enabled,
    baseUrl: readString(value.base_url ?? value.baseUrl ?? value.iframe_url ?? value.iframeUrl, fallback.baseUrl),
    token: readToken(value.token, fallback.token)
  };
}

function fromApiChatbot(value: SettingValue, fallback: ChatSettings['chatbot']) {
  return {
    enabled: typeof value.enabled === 'boolean' ? value.enabled : fallback.enabled,
    baseUrl: readString(value.base_url ?? value.baseUrl, fallback.baseUrl),
    token: readToken(value.token, fallback.token),
    width: typeof value.width === 'number' ? value.width : fallback.width
  };
}

export const useChatStore = defineStore('chat', () => {
  const namespace = 'ai.floating';
  const settings = reactive<ChatSettings>(structuredClone(defaultSettings));
  const initialized = ref(false);
  const loading = ref(false);
  const chatboxEnabled = computed(() => settings.chatbox.enabled);
  const chatbotEnabled = computed(() => settings.chatbot.enabled);
  const chatbotRevision = ref(0);

  async function load() {
    if (loading.value) return false;
    loading.value = true;
    try {
      const [{ data: chatbox }, { data: chatbot }] = await Promise.all([
        fetchSetting({ namespace, setting_key: 'chatbox' }),
        fetchSetting({ namespace, setting_key: 'chatbot' })
      ]);
      const chatboxSettings = asSettingValue(chatbox?.costume_value ?? chatbox?.setting_value);
      const chatbotSettings = asSettingValue(chatbot?.costume_value ?? chatbot?.setting_value);
      if (chatboxSettings) Object.assign(settings.chatbox, fromApiChatbox(chatboxSettings, settings.chatbox));
      if (chatbotSettings) Object.assign(settings.chatbot, fromApiChatbot(chatbotSettings, settings.chatbot));
      return Boolean(chatbox && chatbot);
    } finally {
      initialized.value = true;
      loading.value = false;
    }
  }

  async function saveChatbox(value: ChatboxSettings = settings.chatbox) {
    const { data, error } = await updateSetting({
      namespace,
      setting_key: 'chatbox',
      costume_value: toApiSettings({ ...settings, chatbox: value }).chatbox
    });
    const chatboxSettings = asSettingValue(data?.costume_value ?? data?.setting_value);
    if (chatboxSettings) Object.assign(settings.chatbox, fromApiChatbox(chatboxSettings, settings.chatbox));
    return !error && Boolean(data);
  }

  async function saveChatbot(value: ChatbotSettings = settings.chatbot) {
    const { data, error } = await updateSetting({
      namespace,
      setting_key: 'chatbot',
      costume_value: toApiSettings({ ...settings, chatbot: value }).chatbot
    });
    const success = !error && Boolean(data);
    if (!success) return false;

    const chatbotSettings = asSettingValue(data?.costume_value ?? data?.setting_value);
    if (chatbotSettings) Object.assign(settings.chatbot, fromApiChatbot(chatbotSettings, settings.chatbot));
    chatbotRevision.value += 1;
    return true;
  }

  async function reset() {
    return load();
  }

  return {
    settings,
    initialized,
    loading,
    chatboxEnabled,
    chatbotEnabled,
    chatbotRevision,
    load,
    saveChatbox,
    saveChatbot,
    reset
  };
});
