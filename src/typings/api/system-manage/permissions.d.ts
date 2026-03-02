declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    /** permission */
    type Permissions = {
      role: Role;
      menus: string[];
      buttons: string[];
      apis: number[];
    };

    type PermissionsUpdateParams = Pick<Permissions, 'menus' | 'buttons' | 'apis'>;
  }
}
