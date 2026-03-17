declare namespace Api {
  /**
   * namespace AI
   *
   * backend api module: "AI"
   */
  namespace AI {
    /** Model */
    type LLMModel = Common.CommonRecord<{
      /** name */
      name: string;
      /** model */
      model: string;
      /** provider */
      provider_id: number;
    }> &
      CommonType.RecordNullable<{
        /** description */
        description: string;
      }>;

    /** model page list */
    type LLMModelPageList = Common.PaginatingQueryRecord<LLMModel>;

    /** model search params */
    type LLMModelSearchParams = CommonType.RecordNullable<
      Common.PaginatingCommonParams & Pick<LLMModel, 'status'> & { keyword: string; provider_id: number }
    >;

    /** model create params */
    type LLMModelCreateParams = Pick<LLMModel, 'name' | 'model' | 'description' | 'status'> &
      Pick<LLMModelSearchParams, 'provider_id'>;

    type LLMModelUpdateParams = Pick<LLMModel, 'name' | 'description' | 'status'>;
  }
}
