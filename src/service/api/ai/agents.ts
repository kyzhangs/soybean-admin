import { request } from '@/service/request';

export function fetchAgentConversations() {
  return request<Api.AI.AgentConversation[]>({
    url: '/ai/conversations'
  });
}

export function createAgentConversation() {
  return request<Api.AI.AgentConversation>({
    url: '/ai/conversations',
    method: 'POST'
  });
}

export function renameAgentConversation(conversationId: string, description: string) {
  return request<Api.AI.AgentConversation>({
    url: `/ai/conversations/${encodeURIComponent(conversationId)}`,
    method: 'PATCH',
    data: { description }
  });
}

export function deleteAgentConversation(conversationId: string) {
  return request<null>({
    url: `/ai/conversations/${encodeURIComponent(conversationId)}`,
    method: 'DELETE'
  });
}

export function fetchAgentChatHistory(conversationId: string) {
  return request<Api.AI.AgentChatHistoryMessage[]>({
    url: '/ai/agent/chat-messages',
    params: { conversation_id: conversationId }
  });
}

export async function* streamAgentChat(
  query: string,
  modelId: string | null,
  conversationId: string,
  signal?: AbortSignal
): AsyncGenerator<Api.AI.AgentStreamEvent> {
  const { data: stream, error } = await request<Api.AI.AgentStreamEvent, 'stream'>({
    url: '/ai/agent/chat-messages',
    method: 'POST',
    params: {
      query,
      conversation_id: conversationId,
      ...(modelId ? { model_id: modelId } : {})
    },
    adapter: 'fetch',
    responseType: 'stream',
    timeout: 0,
    signal
  });

  if (error) throw error;
  if (!stream) throw new Error('聊天服务未返回数据流');

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });

      const blocks = buffer.split('\n\n');
      buffer = blocks.pop() || '';
      for (const block of blocks) {
        const event = parseSseBlock(block);
        if (event) yield event;
      }

      if (done) break;
    }

    const event = parseSseBlock(buffer);
    if (event) yield event;
  } finally {
    reader.releaseLock();
  }
}

function parseSseBlock(block: string): Api.AI.AgentStreamEvent | null {
  const lines = block.split('\n');
  const event = lines
    .find(line => line.startsWith('event:'))
    ?.slice(6)
    .trim();
  const payload = lines
    .filter(line => line.startsWith('data:'))
    .map(line => line.slice(5).trimStart())
    .join('\n');

  if (!event || !payload) return null;

  try {
    return { event, data: JSON.parse(payload) as Record<string, unknown> };
  } catch {
    return null;
  }
}
