declare namespace Api {
  /**
   * namespace AI
   *
   * backend api module: "AI"
   */
  namespace AI {
    type LLMProvider = Common.CommonRecord<{
      name: string;
      base_url: string;
    }> &
      CommonType.RecordNullable<{
        api_key: string;
        description: string;
      }>;

    /** provider search params */
    type LLMProviderSearchParams = CommonType.RecordNullable<
      Common.PaginatingCommonParams & Pick<LLMProvider, 'status'>
    >;

    /** provider create params */
    type LLMProviderCreateParams = Pick<LLMProvider, 'name' | 'base_url' | 'api_key' | 'description' | 'status'>;

    /** provider update params */
    type LLMProviderUpdateParams = CommonType.RecordNullable<
      Pick<LLMProvider, 'name' | 'base_url' | 'api_key' | 'description' | 'status'>
    >;
  }
}
