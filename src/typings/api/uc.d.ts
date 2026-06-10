declare namespace Api {
  /**
   * namespace UserCenter
   *
   * backend api module: "uc"
   */
  namespace UserCenter {
    type UserInfo = {
      userId: string;
      username: string;
      roles: string[];
      buttons: string[];
    } & CommonType.RecordNullable<{
      name: string;
      gender: string;
      phone: string;
      email: string;
      active_time: string;
      last_login: string;
    }>;
  }
}
