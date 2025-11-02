declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
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

    type User = Common.CommonRecord<{
      username: string;
      gender: UserGender;
      is_active: boolean;
      status: Api.Common.EnableStatus;
    }> &
      CommonType.RecordNullable<{
        name: string;
        email: string;
        phone: string;
        avatar: string;
        active_time: string;
        last_login: string;
      }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<User, 'gender' | 'is_active' | 'status'> & {
        keyword: string;
        contact: string;
      } & Api.Common.CommonSearchParams
    >;

    type UserCreateParams = CommonType.RecordNullable<Pick<Api.User.UserInfo, 'name' | 'email' | 'phone' | 'roles'>> & {
      gender: UserGender;
      username: string;
      is_active: boolean;
      status: Api.Common.EnableStatus;
    };

    type UserUpdateParams = Pick<
      UserCreateParams,
      'name' | 'gender' | 'email' | 'phone' | 'is_active' | 'status' | 'roles'
    >;

    /** user paginating data */
    type UserPaginatingData = Common.PaginatingQueryRecord<User>;

    type ResetUserPassword = {
      /** new password */
      password: string;
    };

    type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

    type Api = Common.CommonRecord<{
      name: string;
      path: string;
      method: ApiMethod;
      tags: string[];
      in_whitelist: boolean;
    }> &
      CommonType.RecordNullable<{
        summary: string;
        description: string;
      }>;

    type ApiSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Api, 'method' | 'status'> & {
        keyword: string;
        tag: string;
        in_whitelist: boolean;
      } & Api.Common.CommonSearchParams
    >;

    type ApiUpdateStatusParams = Pick<Api, 'id'> & {
      status?: null | string;
      in_whitelist?: null | boolean;
    };

    type ApiPaginatingData = Common.PaginatingQueryRecord<Api>;

    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      name: string;
      /** role code */
      code: string;
      /** role description */
      description: string;
      /** role home */
      home: string;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'code' | 'status'> &
        Api.Common.CommonSearchParams & {
          keyword: string;
        }
    >;

    /** role create params */
    type RoleCreateParams = Pick<Role, 'name' | 'code' | 'status'> &
      CommonType.RecordNullable<Pick<Role, 'description' | 'home'>>;

    /** role update params */
    type RoleUpdateParams = Pick<Role, 'name' | 'status'> &
      CommonType.RecordNullable<Pick<Role, 'description' | 'home'>>;

    /** role paginating data */
    type RolePaginatingData = Common.PaginatingQueryRecord<Role>;

    /**
     * menu type
     *
     * - "1": directory
     * - "2": menu
     */
    type MenuType = '1' | '2';

    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string;
      /** button description */
      desc: string;
    };

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
      /** parent menu id */
      parentId: number;
      /** menu type */
      type: MenuType;
      /** menu name */
      title: string;
      /** route name */
      name: string;
      /** route path */
      path: string;
      /** component */
      component?: string;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType | null;
      /** buttons */
      buttons?: MenuButton[] | null;
      /** children menu */
      children?: Menu[] | null;
    }> &
      MenuPropsOfRoute;

    /** menu list */
    type MenuList = Menu[];

    type MenuTree = {
      id: number;
      label: string;
      pId: number;
      children?: MenuTree[];
    };
  }
}
