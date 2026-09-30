import { getServiceBaseURL } from '@/utils/service';
import { getAuthorization } from '@/service/request/shared';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export async function* streamAgentChat(
  query: string,
  modelId: string | null,
  signal?: AbortSignal
): AsyncGenerator<Api.AI.AgentStreamEvent> {
  const params = new URLSearchParams({ query });
  if (modelId) params.set('model_id', modelId);

  const response = await fetch(`${baseURL}/ai/agent/chat-messages?${params.toString()}`, {
    method: 'POST',
    headers: {
      Authorization: getAuthorization() || ''
    },
    signal
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message || '聊天请求失败');
  }

  if (!response.body) throw new Error('聊天服务未返回数据流');

  const reader = response.body.getReader();
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
