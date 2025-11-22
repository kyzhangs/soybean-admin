declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type PageSearchParams = CommonType.RecordNullable<Api.Common.CommonSearchParams>;

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
        avatar: string;
        active_time: string;
        last_login: string;
      }>;

    /** user search params */
    type UserSearchParams = PageSearchParams &
      CommonType.RecordNullable<
        Pick<Api.SystemManage.User, 'gender' | 'is_active' | 'status'> & { keyword: string; contact: string }
      >;

    type UserCreateParams = Pick<
      User,
      'username' | 'name' | 'email' | 'phone' | 'gender' | 'is_active' | 'status' | 'roles'
    >;

    type UserUpdateParams = Pick<User, 'name' | 'email' | 'phone' | 'gender' | 'is_active' | 'status' | 'roles'>;

    type UserDeleteParams = Pick<User, 'id'>;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      roleName: string;
      /** role code */
      roleCode: string;
      /** role description */
      roleDesc: string;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'status'> & PageSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Common.CommonRecord<{
      name: string;
      code: string;
      description: string;
    }>;

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
      menuType: MenuType;
      /** menu name */
      menuName: string;
      /** route name */
      routeName: string;
      /** route path */
      routePath: string;
      /** component */
      component?: string;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType;
      /** buttons */
      buttons?: MenuButton[] | null;
      /** children menu */
      children?: Menu[] | null;
    }> &
      MenuPropsOfRoute;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuTree = {
      id: number;
      label: string;
      pId: number;
      children?: MenuTree[];
    };
  }
}
