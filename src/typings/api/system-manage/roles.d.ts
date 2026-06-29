declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    /** role */
    type Role = Common.CommonRecord<{
      name: string;
      code: string;
      is_system: boolean;
    }> &
      CommonType.RecordNullable<{
        description: string;
        home: string;
      }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Common.CommonSearchParams &
        Pick<Api.SystemManage.Role, 'is_system' | 'status'> & {
          keyword: string;
        }
    >;

    /** create role params */
    type RoleCreateParams = Pick<Role, 'name' | 'code' | 'description' | 'home' | 'status'>;

    /** update role params */
    type RoleUpdateParams = Pick<Role, 'name' | 'description' | 'home' | 'status'>;

    /** role permissions */
    type RolePermissions = {
      menus: string[];
      buttons: string[];
      apis: string[];
    };

    /** role page list */
    type RolePageList = Common.PaginatingQueryRecord<Role>;
  }
}
