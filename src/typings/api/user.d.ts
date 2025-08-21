declare namespace Api {
  /**
   * namespace User
   *
   * backend api module: "user"
   */
  namespace User {
    interface UserInfo extends Api.SystemManage.User {
      roles: string[];
      buttons: string[];
    }
  }
}
