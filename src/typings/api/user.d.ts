declare namespace Api {
  /**
   * namespace User
   *
   * backend api module: "user"
   */
  namespace User {
    /** user info */
    type UserInfo = Pick<Api.SystemManage.User, 'id' | 'username'> &
      CommonType.RecordNullable<
        Pick<Api.SystemManage.User, 'name' | 'email' | 'phone' | 'avatar' | 'active_time' | 'last_login'>
      > & {
        roles: string[];
        buttons: string[];
      };
  }
}
