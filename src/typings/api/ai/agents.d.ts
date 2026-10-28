declare namespace Api {
  namespace AI {
    type AgentConversation = {
      id: string;
      description: string | null;
      create_time: string;
      update_time: string;
    };

    type AgentChatHistoryMessage = {
      role: 'user' | 'assistant' | 'reasoning' | 'tool' | 'skill';
      content: string;
      tool_id?: string | null;
      name?: string | null;
      arguments?: Record<string, unknown> | null;
      output?: string | null;
      status?: 'running' | 'done' | 'error' | null;
    };

    type AgentStreamEvent = {
      event: string;
      data: Record<string, unknown>;
    };
  }
}
