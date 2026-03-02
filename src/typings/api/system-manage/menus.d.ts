declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
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

    type Menu = MenuPropsOfRoute &
      Common.CommonRecord<{
        /** parent menu id */
        parentId: number;
        /** menu type */
        type: MenuType;
        /** menu name */
        name: string;
        /** route name */
        title: string;
        /** route path */
        path: string;
        /** component */
        component?: string;
        /** iconify icon name or local icon name */
        icon: string;
        /** icon type */
        iconType: IconType;
      }> &
      CommonType.RecordNullable<{
        /** buttons */
        buttons: MenuButton[];
        /** children menu */
        children: Menu[];
      }>;

    type MenuTree = {
      id: number;
      label: string;
      pId: number;
      children?: MenuTree[];
    };
  }
}
