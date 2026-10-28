declare namespace Api {
  namespace AI {
    type ModelInputType = 'text' | 'image' | 'audio' | 'video';

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

    type ModelPage = Common.PaginatingQueryRecord<Model>;
    type ModelSearchParams = {
      page: number;
      page_size: number;
      channel_id: string | null;
      code: string | null;
      type: ProtocolType | null;
      keyword: string | null;
    };
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
  }
}
