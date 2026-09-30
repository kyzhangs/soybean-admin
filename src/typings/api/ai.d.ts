declare namespace Api {
  namespace AI {
    type ProtocolType = 'openai-completions' | 'openai-responses' | 'anthropic-messages' | 'gemini-generate-content';
    type ModelInputType = 'text' | 'image' | 'audio' | 'video';

    type ModelChannel = Common.CommonRecord<{
      name: string;
      code: string;
      channel_name: string;
      icon: string;
      type: ProtocolType;
      base_url: string;
      api_key_configured: boolean;
      api_key_masked: string | null;
    }>;

    type Model = Common.CommonRecord<{
      channel_id: string;
      code: string;
      channel_name: string;
      type: ProtocolType;
      base_url: string;
      name: string;
      display_name: string | null;
      context_window: number;
      max_tokens: number;
      input_modalities: ModelInputType[];
      reasoning: boolean;
    }>;

    type ModelDiscovery = {
      model_name: string;
      display_name: string | null;
      context_window: number;
      max_tokens: number;
      input_modalities: ModelInputType[];
      reasoning: boolean;
    };

    type ChannelProtocol = {
      type: ProtocolType;
      url: string | null;
    };

    type Channel = {
      code: string;
      name: string;
      icon: string;
      protocols: ChannelProtocol[];
      default_base_url: string | null;
      requires_api_key: boolean;
      capabilities: ModelInputType[];
    };

    type ChannelCatalog = {
      channels: Channel[];
    };

    type ModelPage = Common.PaginatingQueryRecord<Model>;
    type ModelChannelPage = Common.PaginatingQueryRecord<ModelChannel>;
    type ModelChannelSearchParams = {
      page: number;
      page_size: number;
      keyword: string | null;
      code: string | null;
      status: Common.Status | null;
    };
    type ModelSearchParams = {
      page: number;
      page_size: number;
      channel_id: string | null;
      code: string | null;
      type: ProtocolType | null;
      keyword: string | null;
    };
    type ModelChannelCreateParams = {
      name: string;
      code: string;
      type: ProtocolType;
      base_url: string | null;
      api_key?: string | null;
    };
    type ModelChannelUpdateParams = Partial<ModelChannelCreateParams>;
    type ModelCreateParams = {
      channel_id: string;
      name: string;
      display_name: string | null;
      context_window: number;
      max_tokens: number;
      input_modalities: ModelInputType[];
      reasoning: boolean;
    };
    type ModelUpdateParams = Partial<ModelCreateParams>;
    type ModelTestResult = {
      ok: boolean;
      message: string;
      name: string | null;
    };

    type AgentStreamEvent = {
      event: string;
      data: Record<string, unknown>;
    };
  }
}
