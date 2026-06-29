declare namespace Api {
  /**
   * namespace UserCenter
   *
   * backend api module: "uc"
   */
  namespace UserCenter {
    type UserInfo = Pick<
      Api.SystemManage.User,
      'username' | 'name' | 'gender' | 'phone' | 'email' | 'active_time' | 'last_login' | 'is_superuser' | 'avatar'
    > & { userId: string; roles: string[]; buttons: string[] };
  }
}
