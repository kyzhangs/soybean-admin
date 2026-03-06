declare namespace Api {
  /**
   * namespace UserCenter
   *
   * backend api module: "user-center"
   */
  namespace UserCenter {
    type UserInfo = Pick<
      Api.SystemManage.User,
      'username' | 'name' | 'gender' | 'phone' | 'email' | 'active_time' | 'last_login' | 'is_superuser' | 'avatar'
    > & { userId: number; roles: string[]; buttons: string[] };
  }
}
