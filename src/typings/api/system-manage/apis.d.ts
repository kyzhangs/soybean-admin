declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

    /** api */
    type Api = Common.CommonRecord<{
      /** api name */
      name: string;
      /** api code */
      path: string;
      /** api method */
      method: ApiMethod;
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
      Common.PaginatingCommonParams & Pick<Api.SystemManage.Api, 'method' | 'tags' | 'status'> & { keyword: string }
    >;

    /** api list */
    type ApiPageList = Common.PaginatingQueryRecord<Api>;

    type ApiUpdateParams = Pick<Role, 'status'>;

    type ApiTree = {
      label: string;
      value: number;
      children?: ApiTree[];
    };
  }
}
