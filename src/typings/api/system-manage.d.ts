declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "system-manage"
   */
  namespace SystemManage {
    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     * - "3": "unknown"
     */
    type UserGender = '1' | '2' | '3';

    /** user */
    type User = Common.CommonRecord<{
      username: string;
      gender: UserGender;
      is_active: boolean;
      roles: string[];
    }> &
      CommonType.RecordNullable<{
        name: string;
        email: string;
        phone: string;
        is_superuser: boolean;
        avatar: string;
        active_time: string;
        last_login: string;
      }>;

    /** user search params */
    type UserSearchParams = Common.PageSearchParams &
      CommonType.RecordNullable<
        Pick<Api.SystemManage.User, 'gender' | 'is_active' | 'status'> & { keyword: string; contact: string }
      >;

    /** user create params */
    type UserCreateParams = Pick<
      User,
      'username' | 'name' | 'email' | 'phone' | 'gender' | 'is_active' | 'status' | 'roles'
    >;

    /** user update params */
    type UserUpdateParams = Pick<User, 'name' | 'email' | 'phone' | 'gender' | 'is_active' | 'status' | 'roles'>;

    /** user page list */
    type UserPageList = Common.PaginatingQueryRecord<User>;

    /** role */
    type Role = Common.CommonRecord<{
      name: string;
      code: string;
    }> &
      CommonType.RecordNullable<{
        description: string;
        home: string;
      }>;

    /** role search params */
    type RoleSearchParams = Common.PageSearchParams &
      CommonType.RecordNullable<Pick<Api.SystemManage.Role, 'code' | 'status'> & { keyword: string }>;

    /** role create params */
    type RoleCreateParams = Pick<Role, 'name' | 'code' | 'description' | 'status' | 'home'>;

    /** role update params */
    type RoleUpdateParams = CommonType.RecordNullable<Exclude<RoleCreateParams, 'code'>>;

    /** role page list */
    type RolePageList = Common.PaginatingQueryRecord<Role>;

    /** role permissions */
    type RolePermissions = {
      role: Role;
      menus: string[];
      buttons: string[];
      apis: number[];
    };

    /** role permissions search params */
    type RolePermissionsSearchParams = { code: string };

    /** role permissions update params */
    type RolePermissionsUpdateParams = {
      code: string;
      menus?: string[];
      buttons?: string[];
      apis?: number[];
    };

    /** api request method */
    type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

    /** api */
    type Api = Common.CommonRecord<{
      name: string;
      path: string;
      method: ApiMethod;
      summary: string;
      operation_id: string;
      tags: string[];
    }> &
      CommonType.RecordNullable<{
        description: string;
      }>;

    /** api search params */
    type ApiSearchParams = Common.PageSearchParams &
      CommonType.RecordNullable<
        Pick<Api, 'method' | 'status'> & {
          keyword: string;
        }
      >;

    /** api update params */
    type ApiUpdateParams = Pick<Api, 'id' | 'status'>;

    /** api page list */
    type ApiPageList = Common.PaginatingQueryRecord<Api>;

    /** api tree */
    type ApiTree = {
      label: string;
      value: number;
      children?: ApiTree[];
    };

    /**
     * menu type
     *
     * - "1": directory
     * - "2": menu
     */
    type MenuType = '1' | '2';

    type Button = Common.CommonRecord<{
      name: string;
      code: string;
    }> &
      CommonType.RecordNullable<{
        description: string;
      }>;

    type ButtonSearchParams = Common.PageSearchParams &
      CommonType.RecordNullable<
        Pick<Button, 'status'> & {
          keyword: string;
        }
      >;

    type ButtonCreateParams = Pick<Button, 'name' | 'code' | 'description' | 'status'>;

    type ButtonUpdateParams = CommonType.RecordNullable<Exclude<ButtonCreateParams, 'code'>>;

    type ButtonPageList = Common.PaginatingQueryRecord<Button>;

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = '1' | '2';

    type MenuPropsOfRoute = Pick<
      import('vue-router').RouteMeta,
      | 'i18nKey'
      | 'keepAlive'
      | 'constant'
      | 'order'
      | 'href'
      | 'hideInMenu'
      | 'activeMenu'
      | 'multiTab'
      | 'fixedIndexInTab'
      | 'query'
    >;

    type Menu = Common.CommonRecord<{
      parentId: number;
      type: MenuType;
      name: string;
      title: string;
      path: string;
      component?: string;
      icon: string;
      iconType: IconType;
      buttons?: Button[] | null;
      children?: Menu[] | null;
    }> &
      MenuPropsOfRoute;

    /** menu page list */
    type MenuPageList = Common.PaginatingQueryRecord<Menu>;

    /** menu search params */
    type MenuSearchParams = Common.PageSearchParams &
      CommonType.RecordNullable<
        Pick<Menu, 'status'> & {
          keyword: string;
          hide_in_menu: boolean;
        }
      >;

    type MenuTree = {
      label: string;
      value: string;
      children?: MenuTree[];
    };
  }
}
