declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

    /** api tag tree node (for NCascader) */
    interface ApiTagOption {
      label: string;
      value: string;
      children?: ApiTagOption[];
    }

    /** api */
    type Api = Common.CommonRecord<{
      /** api name */
      name: string;
      /** api code */
      path: string;
      /** api method */
      method: ApiMethod;
      /** whether the api is in the whitelist */
      is_whitelisted: boolean;
    }> &
      CommonType.RecordNullable<{
        /** api summary */
        summary: string;
        /** api description */
        description: string;
        /** api operation_id */
        operation_id: string;
        /** api tags */
        tags: string[];
      }>;

    /** api search params */
    type ApiSearchParams = CommonType.RecordNullable<
      Common.PaginatingCommonParams &
        Pick<Api.SystemManage.Api, 'method' | 'status'> & {
          keyword: string;
          tags: string;
          is_whitelisted: string;
        }
    >;

    /** api list */
    type ApiPageList = Common.PaginatingQueryRecord<Api>;

    type ApiUpdateParams = Pick<Role, 'status'>;

    type ApiWhitelistBatchParams = {
      ids: string[];
    };

    type ApiTree = {
      label: string;
      value: string;
      description?: string;
      children?: ApiTree[];
    };
  }
}
