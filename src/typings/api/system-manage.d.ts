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
    type RoleUpdateParams = Exclude<RoleCreateParams, 'code'>;

    /** role page list */
    type RolePageList = Common.PaginatingQueryRecord<Role>;

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
