declare namespace Api {
  namespace AI {
    type ProtocolType = 'openai-completions' | 'openai-responses' | 'anthropic-messages' | 'gemini-generate-content';

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

    type ModelChannelPage = Common.PaginatingQueryRecord<ModelChannel>;
    type ModelChannelSearchParams = {
      page: number;
      page_size: number;
      keyword: string | null;
      code: string | null;
      status: Common.Status | null;
    };
    type ModelChannelCreateParams = {
      name: string;
      code: string;
      type: ProtocolType;
      base_url: string | null;
      api_key?: string | null;
    };
    type ModelChannelUpdateParams = Partial<ModelChannelCreateParams>;
  }
}
