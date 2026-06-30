declare namespace Api {
  /**
   * namespace UserCenter
   *
   * backend api module: "uc"
   */
  namespace UserCenter {
    type UserInfo = Pick<
      Api.SystemManage.User,
      | 'username'
      | 'name'
      | 'gender'
      | 'phone'
      | 'email'
      | 'status'
      | 'active_time'
      | 'last_login'
      | 'is_superuser'
      | 'avatar'
    > & { userId: string; create_time: string | null; roles: string[]; buttons: string[] };
  }
}
