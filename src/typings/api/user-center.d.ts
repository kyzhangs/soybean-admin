declare namespace Api {
  /**
   * namespace UserCenter
   *
   * backend api module: "user-center"
   */
  namespace UserCenter {
    type UserInfo = {
      userId: number;
      username: string;
      gender: string;
      active_time: string;
      last_login: string;
      roles: string[];
      buttons: string[];
    } & CommonType.RecordNullable<{
      gender: string;
      name: string;
      phone: string;
      email: string;
      is_superuser: boolean;
    }>;
  }
}
