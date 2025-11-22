declare namespace Api {
  /**
   * namespace UserCenter
   *
   * backend api module: "uc"
   */
  namespace UC {
    type UserInfo = Pick<
      Api.SystemManage.User,
      'username' | 'name' | 'gender' | 'email' | 'phone' | 'avatar' | 'active_time' | 'last_login' | 'roles'
    > & { userId: string; buttons: string[] };
  }
}
