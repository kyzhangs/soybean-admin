declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      name: string;
      /** role code */
      code: string;
    }> &
      CommonType.RecordNullable<{
        /** role description */
        description: string;
        /** role home */
        home: string;
      }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Common.PaginatingCommonParams & Pick<Api.SystemManage.Role, 'status'> & { keyword: string }
    >;

    /** role list */
    type RolePageList = Common.PaginatingQueryRecord<Role>;

    type RoleCreateParams = Pick<Role, 'name' | 'code' | 'description' | 'home' | 'status'>;
  }
}
