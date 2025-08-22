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
     */
    type UserGender = '1' | '2';

    /** user */
    type User = Common.CommonRecord<{
      /** username */
      username: string;
    }> &
      CommonType.RecordNullable<{
        /** name */
        name: string;
        /** user gender */
        gender: UserGender;
        /** user email */
        email: string;
        /** user phone */
        phone: string;
        /** avatar */
        avatar: string;
        /** active time */
        active_time: string;
      }>;

    type User4Admin = User & {
      /** is forbidden */
      is_forbid: boolean;
      /** user is_active */
      is_active: boolean;
    };

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Api.Common.CommonSearchParams &
        Api.Common.KeywordSearchParams &
        Pick<Api.SystemManage.User4Admin, 'email' | 'phone' | 'gender' | 'is_active' | 'is_forbid'>
    >;

    type UserCreate = Pick<
      User4Admin,
      'username' | 'gender' | 'name' | 'email' | 'phone' | 'avatar' | 'is_active' | 'is_forbid'
    >;

    type UserUpdateParams = Pick<
      User4Admin,
      'name' | 'gender' | 'email' | 'phone' | 'avatar' | 'is_active' | 'is_forbid'
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User4Admin>;

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
      Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'status'> & Api.Common.CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, 'id' | 'roleName' | 'roleCode'>;

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
