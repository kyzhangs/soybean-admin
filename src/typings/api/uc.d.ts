declare namespace Api {
  /**
   * namespace UC
   *
   * backend api module: "User Center"
   */
  namespace UC {
    /** User info */
    type UserInfo = Pick<Api.SystemManage.User, 'username' | 'gender'> &
      CommonType.RecordNullable<
        Pick<Api.SystemManage.User, 'name' | 'email' | 'phone' | 'avatar' | 'active_time' | 'last_login'>
      > & {
        userId: number;
        roles: string[];
        buttons: string[];
      };
  }
}
