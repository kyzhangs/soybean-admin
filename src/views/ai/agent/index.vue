<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { NButton, NCard, NEmpty, NInput, NModal, NPopconfirm, NSelect, NSpin, NTag } from 'naive-ui';
import domPurify from 'dompurify';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { useAuthStore } from '@/store/modules/auth';
import {
  createAgentConversation,
  deleteAgentConversation,
  fetchAgentChatHistory,
  fetchAgentConversations,
  fetchModelPage,
  renameAgentConversation,
  streamAgentChat
} from '@/service/api';
defineOptions({ name: 'AiAgent' });

const authStore = useAuthStore();

type ChatMessage = {
  role: 'user' | 'assistant' | 'reasoning' | 'tool' | 'skill';
  content: string;
  renderedContent?: string;
  streaming?: boolean;
  toolId?: string;
  name?: string;
  arguments?: string;
  output?: string;
  status?: 'running' | 'done' | 'error';
};

const models = ref<Api.AI.Model[]>([]);
const conversations = ref<Api.AI.AgentConversation[]>([]);
const selectedConversationId = ref<string | null>(null);
const selectedModelId = ref<string | null>(null);
const modelLoading = ref(false);
const modelError = ref(false);
const conversationsLoading = ref(false);
const conversationsError = ref(false);
const conversationCreating = ref(false);
const conversationCreateError = ref(false);
const conversationDeleting = ref(false);
const conversationDeleteError = ref(false);
const renameDialogVisible = ref(false);
const renamingConversationId = ref<string | null>(null);
const renameValue = ref('');
const renameLoading = ref(false);
const renameError = ref('');
const historyLoading = ref(false);
const historyError = ref(false);
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
const selectedConversationStorageKey = computed(
  () => `dtp:ai-conversation:${authStore.userInfo.username || 'current-user'}`
);

function rememberSelectedConversation(conversationId: string) {
  selectedConversationId.value = conversationId;
  localStorage.setItem(selectedConversationStorageKey.value, conversationId);
}

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

async function loadChatHistory(conversationId: string) {
  historyLoading.value = true;
  historyError.value = false;
  messages.value = [];
  try {
    const { data: history, error } = await fetchAgentChatHistory(conversationId);
    if (error) throw error;
    if (!history) throw new Error('历史消息加载失败');
    messages.value = await Promise.all(
      history.map(async message => ({
        role: message.role,
        content: message.content,
        renderedContent:
          message.role === 'assistant' || message.role === 'reasoning'
            ? await renderMarkdown(message.content)
            : undefined,
        toolId: message.tool_id || undefined,
        name: message.name || undefined,
        arguments: message.arguments ? JSON.stringify(message.arguments, null, 2) : undefined,
        output: message.output || undefined,
        status: message.status || undefined
      }))
    );
    await scrollToBottom();
  } catch {
    historyError.value = true;
  } finally {
    historyLoading.value = false;
  }
}

async function loadConversations() {
  conversationsLoading.value = true;
  conversationsError.value = false;
  try {
    const { data, error } = await fetchAgentConversations();
    if (error) throw error;
    if (!data) throw new Error('会话列表加载失败');
    conversations.value = data;
  } catch {
    conversationsError.value = true;
    conversationsLoading.value = false;
    return;
  }
  conversationsLoading.value = false;

  const rememberedId = localStorage.getItem(selectedConversationStorageKey.value);
  const preferredId = selectedConversationId.value || rememberedId;
  const selectedExists = conversations.value.some(item => item.id === preferredId);
  const conversationId = selectedExists ? preferredId : conversations.value[0]?.id || null;
  if (conversationId) {
    rememberSelectedConversation(conversationId);
    await loadChatHistory(conversationId);
  }
}

async function switchConversation(conversationId: string) {
  if (sending.value || historyLoading.value || conversationId === selectedConversationId.value) return;
  rememberSelectedConversation(conversationId);
  await loadChatHistory(conversationId);
}

async function startNewConversation() {
  if (sending.value || historyLoading.value || conversationsLoading.value || conversationCreating.value) return;
  conversationCreateError.value = false;
  conversationCreating.value = true;
  try {
    const { data: conversation, error } = await createAgentConversation();
    if (error) throw error;
    if (!conversation) throw new Error('新建会话失败');
    conversations.value = [conversation, ...conversations.value];
    rememberSelectedConversation(conversation.id);
    messages.value = [];
    historyError.value = false;
  } catch {
    conversationCreateError.value = true;
  } finally {
    conversationCreating.value = false;
  }
}

function retryChatHistory() {
  if (selectedConversationId.value) void loadChatHistory(selectedConversationId.value);
}

function beginRename(conversation: Api.AI.AgentConversation) {
  renamingConversationId.value = conversation.id;
  renameValue.value = conversation.description || '';
  renameError.value = '';
  renameDialogVisible.value = true;
}

async function saveConversationName() {
  const conversationId = renamingConversationId.value;
  const description = renameValue.value.trim();
  if (!conversationId || !description || renameLoading.value) return false;

  renameLoading.value = true;
  renameError.value = '';
  try {
    const { data: updated, error } = await renameAgentConversation(conversationId, description);
    if (error) throw error;
    if (!updated) throw new Error('会话名称修改失败');
    const index = conversations.value.findIndex(item => item.id === updated.id);
    if (index >= 0) conversations.value[index] = updated;
    conversations.value.sort((a, b) => b.update_time.localeCompare(a.update_time));
    renameDialogVisible.value = false;
    return true;
  } catch (error) {
    renameError.value = error instanceof Error ? error.message : '会话名称修改失败';
    return false;
  } finally {
    renameLoading.value = false;
  }
}

async function deleteConversation(conversation: Api.AI.AgentConversation) {
  if (sending.value || historyLoading.value || conversationDeleting.value) return;
  conversationDeleting.value = true;
  conversationDeleteError.value = false;
  try {
    const { error } = await deleteAgentConversation(conversation.id);
    if (error) throw error;
    conversations.value = conversations.value.filter(item => item.id !== conversation.id);
    if (selectedConversationId.value === conversation.id) {
      selectedConversationId.value = null;
      localStorage.removeItem(selectedConversationStorageKey.value);
      messages.value = [];
      await loadConversations();
    }
  } catch {
    conversationDeleteError.value = true;
  } finally {
    conversationDeleting.value = false;
  }
}

function formatConversationTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
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
  const conversationId = selectedConversationId.value;
  if (!query || sending.value || !selectedModelId.value || !conversationId) return;

  input.value = '';
  const selected = conversations.value.find(item => item.id === conversationId);
  if (selected && !selected.description) selected.description = query.replace(/\s+/g, ' ').slice(0, 160);
  if (selected) {
    selected.update_time = new Date().toISOString();
    conversations.value.sort((a, b) => b.update_time.localeCompare(a.update_time));
  }
  messages.value.push({ role: 'user', content: query });
  messages.value.push({ role: 'assistant', content: '', streaming: true });
  const assistantMessage = messages.value[messages.value.length - 1];
  sending.value = true;
  abortController = new AbortController();
  const pendingCharacters: string[] = [];
  let draining = false;
  let drainPromise: Promise<void> | null = null;
  let streamError: string | null = null;
  let reasoningMessage: ChatMessage | null = null;
  const toolMessages = new Map<string, ChatMessage>();
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
    for await (const event of streamAgentChat(query, selectedModelId.value, conversationId, abortController.signal)) {
      if (event.event === 'answer.delta' && typeof event.data.content === 'string') {
        enqueueAnswer(event.data.content);
      } else if (event.event === 'reasoning.delta' && typeof event.data.content === 'string') {
        if (!reasoningMessage) {
          reasoningMessage = { role: 'reasoning', content: '', streaming: true };
          messages.value.splice(messages.value.length - 1, 0, reasoningMessage);
          void scrollToBottom();
        }
        reasoningMessage.content += event.data.content;
      } else if (event.event === 'tool.call') {
        const toolId = String(event.data.id || `tool-${Date.now()}-${toolMessages.size}`);
        const name = typeof event.data.name === 'string' ? event.data.name : 'unknown';
        const args = event.data.arguments;
        const argsObject = args && typeof args === 'object' ? (args as Record<string, unknown>) : {};
        const skillPath = argsObject.file_path ?? argsObject.path;
        const role =
          name === 'read_file' && typeof skillPath === 'string' && skillPath.endsWith('SKILL.md') ? 'skill' : 'tool';
        const toolMessage: ChatMessage = {
          role,
          content: '',
          toolId,
          name,
          arguments: JSON.stringify(argsObject, null, 2),
          status: 'running'
        };
        messages.value.splice(messages.value.length - 1, 0, toolMessage);
        toolMessages.set(toolId, toolMessage);
        void scrollToBottom();
      } else if (event.event === 'tool.result' || event.event === 'tool.error') {
        const toolId = String(event.data.id || '');
        const toolMessage = toolMessages.get(toolId);
        if (toolMessage) {
          toolMessage.status = event.event === 'tool.error' ? 'error' : 'done';
          toolMessage.output = String(event.data.output ?? '');
        }
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
    if (reasoningMessage) reasoningMessage.streaming = false;
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

onMounted(() => {
  void loadModels();
  void loadConversations();
});
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

      <div class="chat-layout flex min-h-0 flex-1 gap-12px">
        <aside class="conversation-sidebar flex min-h-0 flex-col rounded-12px bg-layout p-12px">
          <div class="mb-12px flex items-center justify-between gap-8px">
            <span class="font-semibold">会话列表</span>
            <NButton
              size="small"
              type="primary"
              secondary
              :loading="conversationCreating"
              :disabled="sending || historyLoading || conversationsLoading || conversationCreating"
              @click="startNewConversation"
            >
              新聊天
            </NButton>
          </div>
          <div v-if="conversationCreateError" class="mb-8px text-12px text-error">新建会话失败，请重试</div>
          <div v-if="conversationDeleteError" class="mb-8px text-12px text-error">删除会话失败，请重试</div>
          <NEmpty v-if="conversationsError" description="会话加载失败" size="small">
            <template #extra>
              <NButton size="tiny" secondary @click="loadConversations">重试</NButton>
            </template>
          </NEmpty>
          <div v-else class="conversation-list min-h-0 flex-1 space-y-6px overflow-y-auto">
            <div
              v-for="conversation in conversations"
              :key="conversation.id"
              class="conversation-entry"
              :class="{ 'conversation-item-active': conversation.id === selectedConversationId }"
            >
              <button
                type="button"
                class="conversation-item"
                :disabled="sending || historyLoading || conversationsLoading"
                @click="switchConversation(conversation.id)"
              >
                <span class="conversation-description">{{ conversation.description || '新会话' }}</span>
                <time>{{ formatConversationTime(conversation.update_time) }}</time>
              </button>
              <div class="conversation-actions">
                <NButton
                  quaternary
                  circle
                  size="tiny"
                  :disabled="sending || historyLoading || conversationDeleting"
                  aria-label="重命名会话"
                  title="重命名"
                  @click="beginRename(conversation)"
                >
                  <template #icon>
                    <SvgIcon icon="mdi:pencil-outline" class="text-14px" />
                  </template>
                </NButton>
                <NPopconfirm @positive-click="deleteConversation(conversation)">
                  <template #trigger>
                    <NButton
                      quaternary
                      circle
                      size="tiny"
                      type="error"
                      :disabled="sending || historyLoading || conversationDeleting"
                      aria-label="删除会话"
                      title="删除"
                    >
                      <template #icon>
                        <SvgIcon icon="mdi:delete-outline" class="text-14px" />
                      </template>
                    </NButton>
                  </template>
                  删除此会话及其历史消息？
                </NPopconfirm>
              </div>
            </div>
          </div>
        </aside>

        <div class="chat-main flex min-h-0 min-w-0 flex-1 flex-col">
          <div class="chat-body flex min-h-0 flex-1 flex-col">
            <div
              v-if="modelLoading || conversationsLoading || historyLoading"
              class="flex min-h-0 flex-1 items-center justify-center"
            >
              <NSpin size="small" />
            </div>
            <div
              v-else
              ref="messagesContainer"
              class="chat-scroll min-h-0 flex-1 overflow-y-auto bg-layout px-8px py-16px"
            >
              <NEmpty v-if="historyError" description="历史消息加载失败，请稍后重试">
                <template #extra>
                  <NButton secondary @click="retryChatHistory">重试</NButton>
                </template>
              </NEmpty>
              <NEmpty v-else-if="modelError" description="模型列表加载失败，请稍后重试">
                <template #extra>
                  <NButton secondary @click="loadModels">重试</NButton>
                </template>
              </NEmpty>
              <NEmpty v-else-if="!modelOptions.length" description="暂无可用模型，请先在模型管理中启用模型" />
              <div v-else-if="!selectedConversationId" class="flex h-full items-center justify-center">
                <NEmpty description="请选择会话，或新建一个会话" />
              </div>
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
                  <details
                    v-if="message.role === 'reasoning'"
                    class="chat-process-card reasoning-card max-w-80%"
                    :open="message.streaming"
                  >
                    <summary>
                      <NTag type="warning" size="small">思考过程</NTag>
                      <span class="process-caption">模型推理内容</span>
                    </summary>
                    <div class="process-content whitespace-pre-wrap">{{ message.content }}</div>
                  </details>
                  <details
                    v-else-if="message.role === 'tool' || message.role === 'skill'"
                    class="chat-process-card max-w-80%"
                    :class="message.role === 'skill' ? 'skill-card' : 'tool-card'"
                  >
                    <summary>
                      <NTag :type="message.role === 'skill' ? 'success' : 'info'" size="small">
                        {{ message.role === 'skill' ? '技能调用' : '工具调用' }}
                      </NTag>
                      <span class="process-name">{{ message.name }}</span>
                      <NTag
                        size="small"
                        :type="message.status === 'error' ? 'error' : message.status === 'done' ? 'success' : 'warning'"
                      >
                        {{ message.status === 'error' ? '失败' : message.status === 'done' ? '完成' : '执行中' }}
                      </NTag>
                    </summary>
                    <div v-if="message.arguments" class="process-section">
                      <div class="process-label">参数</div>
                      <pre>{{ message.arguments }}</pre>
                    </div>
                    <div v-if="message.output" class="process-section">
                      <div class="process-label">结果</div>
                      <pre>{{ message.output }}</pre>
                    </div>
                  </details>
                  <div
                    v-else
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
                :disabled="sending || historyLoading || !selectedModelId || !selectedConversationId"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="输入消息，Ctrl / ⌘ + Enter 发送"
                @keydown="handleKeydown"
              >
                <template #suffix>
                  <NButton
                    type="primary"
                    :loading="sending"
                    :disabled="!input.trim() || historyLoading || !selectedModelId || !selectedConversationId"
                    @click="sendMessage"
                  >
                    发送
                  </NButton>
                </template>
              </NInput>
            </div>
          </div>
        </div>
      </div>
    </NCard>
    <NModal
      v-model:show="renameDialogVisible"
      preset="dialog"
      title="编辑会话名称"
      positive-text="保存"
      negative-text="取消"
      :mask-closable="!renameLoading"
      :closable="!renameLoading"
      :positive-button-props="{ loading: renameLoading, disabled: !renameValue.trim() }"
      :negative-button-props="{ disabled: renameLoading }"
      @positive-click="saveConversationName"
    >
      <NInput v-model:value="renameValue" maxlength="160" show-count placeholder="输入会话名称" />
      <div v-if="renameError" class="mt-8px text-12px text-error">{{ renameError }}</div>
    </NModal>
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

.markdown-content.vditor-reset {
  color: inherit;
}

.markdown-content.vditor-reset :deep(blockquote) {
  color: inherit;
  border-left-color: var(--n-border-color);
}

.markdown-content.vditor-reset :deep(table tr),
.markdown-content.vditor-reset :deep(table tbody tr:nth-child(2n)) {
  background-color: transparent;
  border-color: var(--n-border-color);
}

.markdown-content.vditor-reset :deep(table th),
.markdown-content.vditor-reset :deep(table td) {
  color: inherit;
  background-color: transparent;
  border-color: var(--n-border-color);
}

.conversation-sidebar {
  width: 248px;
  flex: 0 0 248px;
}

.conversation-entry {
  display: flex;
  align-items: center;
  gap: 2px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 4px;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.conversation-entry:hover,
.conversation-item-active {
  border-color: var(--n-primary-color);
  background: var(--n-color);
}

.conversation-item {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  background: transparent;
  padding: 5px 6px;
  color: var(--n-text-color);
  text-align: left;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.conversation-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.conversation-entry:hover .conversation-actions,
.conversation-entry:focus-within .conversation-actions {
  opacity: 1;
  pointer-events: auto;
}

.conversation-item:disabled {
  cursor: default;
  opacity: 0.65;
}

.conversation-description {
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-item time {
  color: var(--n-text-color-3);
  font-size: 11px;
}

.chat-process-card {
  width: min(80%, 760px);
  align-self: flex-start;
  overflow: hidden;
  border: 1px solid var(--n-border-color);
  border-radius: 10px;
  background: var(--n-color);
  color: var(--n-text-color);
  font-size: 13px;
}

.reasoning-card {
  border-left: 3px solid #e0a33a;
}

.tool-card {
  border-left: 3px solid #4786d8;
}

.skill-card {
  border-left: 3px solid #39a879;
}

.chat-process-card summary {
  display: flex;
  min-height: 40px;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  cursor: pointer;
  list-style-position: inside;
}

.process-caption,
.process-name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: var(--n-text-color-2);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.process-name {
  color: var(--n-text-color);
  font-family: monospace;
}

.process-content,
.process-section {
  border-top: 1px solid var(--n-border-color);
  padding: 10px 12px;
}

.process-label {
  margin-bottom: 4px;
  color: var(--n-text-color-3);
  font-size: 12px;
}

.chat-process-card pre {
  max-height: 240px;
  overflow: auto;
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
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

@media (max-width: 768px) {
  .conversation-sidebar {
    width: 180px;
    flex-basis: 180px;
  }
}

@media (max-width: 560px) {
  .conversation-sidebar {
    width: 138px;
    flex-basis: 138px;
    padding: 8px;
  }

  .conversation-sidebar :deep(.n-empty__description) {
    display: none;
  }

  .conversation-actions {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
