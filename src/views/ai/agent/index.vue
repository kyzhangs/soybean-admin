<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { NButton, NCard, NEmpty, NInput, NSelect, NSpin, NTag } from 'naive-ui';
import domPurify from 'dompurify';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { fetchModelPage, streamAgentChat } from '@/service/api';

defineOptions({ name: 'AiAgent' });

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  renderedContent?: string;
  streaming?: boolean;
};

const models = ref<Api.AI.Model[]>([]);
const selectedModelId = ref<string | null>(null);
const modelLoading = ref(false);
const modelError = ref(false);
const input = ref('');
const messages = ref<ChatMessage[]>([]);
const sending = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
let abortController: AbortController | null = null;
const TYPEWRITER_INTERVAL_MS = 18;

const modelOptions = computed(() =>
  models.value.map(model => ({
    label: `${model.display_name || model.name} · ${model.channel_name}`,
    value: model.id
  }))
);

const selectedModel = computed(() => models.value.find(model => model.id === selectedModelId.value));

async function loadModels() {
  modelLoading.value = true;
  modelError.value = false;
  const { data, error } = await fetchModelPage({ page: 1, page_size: 1000 });
  if (!error && data) {
    models.value = data.rows.filter(model => model.status === '1');
    if (!selectedModelId.value || !models.value.some(model => model.id === selectedModelId.value)) {
      selectedModelId.value = models.value[0]?.id || null;
    }
  } else {
    modelError.value = true;
  }
  modelLoading.value = false;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    void sendMessage();
  }
}

function wait(milliseconds: number) {
  return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}

async function renderMarkdown(content: string) {
  if (!content) return '';

  try {
    const html = await Vditor.md2html(content, {
      mode: 'light',
      markdown: {
        sanitize: true
      }
    });
    return domPurify.sanitize(html);
  } catch {
    return '';
  }
}

async function sendMessage() {
  const query = input.value.trim();
  if (!query || sending.value || !selectedModelId.value) return;

  input.value = '';
  messages.value.push({ role: 'user', content: query });
  messages.value.push({ role: 'assistant', content: '', streaming: true });
  const assistantMessage = messages.value[messages.value.length - 1];
  sending.value = true;
  abortController = new AbortController();
  const pendingCharacters: string[] = [];
  let draining = false;
  let drainPromise: Promise<void> | null = null;
  let streamError: string | null = null;
  let markdownTimer: number | null = null;
  let markdownRenderRequested = false;
  let markdownRenderPromise: Promise<void> | null = null;

  const flushMarkdown = async () => {
    if (markdownRenderPromise) return markdownRenderPromise;

    markdownRenderPromise = (async () => {
      while (markdownRenderRequested) {
        markdownRenderRequested = false;
        const source = assistantMessage.content;
        assistantMessage.renderedContent = await renderMarkdown(source);
      }
    })();

    try {
      await markdownRenderPromise;
    } finally {
      markdownRenderPromise = null;
    }
  };

  const scheduleMarkdownRender = () => {
    markdownRenderRequested = true;
    if (markdownTimer !== null || markdownRenderPromise) return;

    markdownTimer = window.setTimeout(() => {
      markdownTimer = null;
      void flushMarkdown();
    }, 80);
  };

  const enqueueAnswer = (content: string) => {
    pendingCharacters.push(...Array.from(content));
    if (draining) return;

    draining = true;
    drainPromise = (async () => {
      while (pendingCharacters.length) {
        const character = pendingCharacters.shift();
        if (character === undefined) continue;
        assistantMessage.content += character;
        scheduleMarkdownRender();
        await scrollToBottom();
        if (pendingCharacters.length) await wait(TYPEWRITER_INTERVAL_MS);
      }
      draining = false;
    })();
  };

  await scrollToBottom();

  try {
    for await (const event of streamAgentChat(query, selectedModelId.value, abortController.signal)) {
      if (event.event === 'answer.delta' && typeof event.data.content === 'string') {
        enqueueAnswer(event.data.content);
      } else if (event.event === 'error') {
        streamError = String(event.data.message || '模型生成失败');
      }
    }
  } catch (error) {
    if (!abortController?.signal.aborted) {
      streamError = error instanceof Error ? error.message : '聊天请求失败';
    }
  } finally {
    if (drainPromise) await drainPromise;
    if (streamError) assistantMessage.content = streamError;
    if (markdownTimer !== null) {
      window.clearTimeout(markdownTimer);
      markdownTimer = null;
    }
    markdownRenderRequested = true;
    await flushMarkdown();
    assistantMessage.streaming = false;
    sending.value = false;
    abortController = null;
    await scrollToBottom();
  }
}

async function scrollToBottom() {
  await nextTick();
  const container = messagesContainer.value;
  if (container) container.scrollTop = container.scrollHeight;
}

onMounted(loadModels);
onBeforeUnmount(() => abortController?.abort());
</script>

<template>
  <div class="chat-page h-full min-h-0 flex flex-col">
    <NCard :bordered="false" size="small" class="min-h-0 flex-1 card-wrapper" content-class="chat-card-content">
      <template #header>
        <div class="flex items-center gap-10px">
          <span class="text-18px font-semibold">智能体</span>
          <NTag v-if="selectedModel" type="info" size="small">
            {{ selectedModel.display_name || selectedModel.name }}
          </NTag>
        </div>
      </template>
      <template #header-extra>
        <NSelect
          v-model:value="selectedModelId"
          :options="modelOptions"
          :loading="modelLoading"
          :disabled="modelLoading || sending || !modelOptions.length"
          placeholder="选择模型"
          filterable
          class="w-280px"
        />
      </template>

      <div class="chat-body flex min-h-0 flex-1 flex-col">
        <div v-if="modelLoading" class="flex min-h-0 flex-1 items-center justify-center">
          <NSpin size="small" />
        </div>
        <div v-else ref="messagesContainer" class="chat-scroll min-h-0 flex-1 overflow-y-auto bg-layout px-8px py-16px">
          <NEmpty v-if="modelError" description="模型列表加载失败，请稍后重试">
            <template #extra>
              <NButton secondary @click="loadModels">重试</NButton>
            </template>
          </NEmpty>
          <NEmpty v-else-if="!modelOptions.length" description="暂无可用模型，请先在模型管理中启用模型" />
          <div v-else-if="!messages.length" class="flex h-full items-center justify-center">
            <div class="text-center text-gray-500">
              <div class="mb-8px text-22px font-semibold text-gray-700 dark:text-gray-200">开始和智能体对话</div>
              <div>当前对话使用右上角选择的模型，按 Ctrl / ⌘ + Enter 发送消息</div>
            </div>
          </div>
          <div v-else class="mx-auto max-w-900px space-y-16px">
            <div
              v-for="(message, index) in messages"
              :key="`${message.role}-${index}`"
              class="flex"
              :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-80% rounded-12px px-16px py-10px text-14px leading-6"
                :class="
                  message.role === 'user'
                    ? 'bg-primary color-white'
                    : 'bg-gray-100 color-gray-800 dark:bg-gray-800 dark:color-gray-100'
                "
              >
                <template v-if="message.role === 'assistant'">
                  <!-- Rendered by Vditor then sanitized by DOMPurify. -->
                  <!-- eslint-disable vue/no-v-html -->
                  <div
                    v-if="message.renderedContent"
                    class="markdown-content vditor-reset"
                    v-html="message.renderedContent"
                  ></div>
                  <!-- eslint-enable vue/no-v-html -->
                  <span v-else class="whitespace-pre-wrap">
                    {{ message.content || (message.streaming ? '正在思考…' : '') }}
                  </span>
                </template>
                <span v-else class="whitespace-pre-wrap">{{ message.content }}</span>
                <span v-if="message.streaming" class="typing-cursor" aria-hidden="true">▍</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mx-auto mt-12px w-full max-w-900px">
          <NInput
            v-model:value="input"
            type="textarea"
            :disabled="sending || !selectedModelId"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="输入消息，Ctrl / ⌘ + Enter 发送"
            @keydown="handleKeydown"
          >
            <template #suffix>
              <NButton
                type="primary"
                :loading="sending"
                :disabled="!input.trim() || !selectedModelId"
                @click="sendMessage"
              >
                发送
              </NButton>
            </template>
          </NInput>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.chat-page :deep(.chat-card-content) {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.chat-scroll {
  scrollbar-width: thin;
  border-radius: 12px;
}

.typing-cursor {
  display: inline-block;
  margin-left: 2px;
  animation: typing-cursor-blink 0.9s steps(1, end) infinite;
}

@keyframes typing-cursor-blink {
  50% {
    opacity: 0;
  }
}
</style>
