declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     * - "3": "unknown"
     */
    type UserGender = '1' | '2' | '3';

    /** user */
    type User = Common.CommonRecord<{
      /** username */
      username: string;
      /** user gender */
      gender: UserGender;
      /** is avtive */
      is_active: boolean;
      /** is superuser */
      is_superuser: boolean;
    }> &
      CommonType.RecordNullable<{
        /** user name */
        name: string;
        /** user phone */
        phone: string;
        /** user email */
        email: string;
        /** active time */
        active_time: string;
        /** last login at */
        last_login: string;
        /** avatar */
        avatar: string;
      }> & {
        roles: string[];
      };

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Common.PaginatingCommonParams &
        Pick<Api.SystemManage.User, 'gender' | 'is_active' | 'status'> & { keyword: string; contact: string }
    >;

    /** user list */
    type UserPageList = Common.PaginatingQueryRecord<User>;

    /** user create */
    type UserCreateParams = Pick<
      User,
      'username' | 'name' | 'gender' | 'email' | 'phone' | 'is_active' | 'status' | 'roles'
    >;

    type UserUpdateParams = Pick<User, 'name' | 'gender' | 'email' | 'phone' | 'is_active' | 'status' | 'roles'>;
  }
}
