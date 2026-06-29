declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    /** button */
    type Button = Common.CommonRecord<{
      /** button name */
      name: string;
      /** button code */
      code: string;
    }> &
      CommonType.RecordNullable<{
        /** button description */
        description: string;
      }>;

    /** button search params */
    type ButtonSearchParams = CommonType.RecordNullable<
      Common.PaginatingCommonParams & Pick<Api.SystemManage.Button, 'status'> & { keyword: string }
    >;

    /** button page list */
    type ButtonPageList = Common.PaginatingQueryRecord<Button>;

    type ButtonCreateParams = Pick<Button, 'name' | 'code' | 'description' | 'status'>;

    type ButtonUpdateParams = Pick<Button, 'name' | 'description' | 'status'>;

    type ButtonTree = {
      label: string;
      value: string;
      children?: ButtonTree[];
    };
  }
}
