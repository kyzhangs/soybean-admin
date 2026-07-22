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
    type Gender = '1' | '2' | '3';

    /** user */
    type User = Common.CommonRecord<{
      username: string;
      gender: Gender;
      is_active: boolean;
      is_superuser: boolean;
    }> &
      CommonType.RecordNullable<{
        name: string;
        phone: string;
        email: string;
        active_time: string;
        last_login: string;
        avatar: string;
      }> & {
        roles: string[];
      };

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Common.CommonSearchParams &
        Pick<Api.SystemManage.User, 'is_active' | 'is_superuser' | 'gender' | 'status'> & {
          keyword: string;
          contact: string;
        }
    >;

    /** user create params */
    type UserCreateParams = Pick<
      User,
      'username' | 'name' | 'gender' | 'email' | 'phone' | 'is_active' | 'status' | 'roles'
    >;

    /** user update params */
    type UserUpdateParams = Pick<User, 'name' | 'gender' | 'email' | 'phone' | 'is_active' | 'status' | 'roles'>;

    type UserPasswordResetParams = {
      password: string;
    };

    type UserBatchAction = Common.BatchAction | 'RESET_PASSWORD';

    type UserBatchOperateParams =
      | (Common.BatchOperateParams & { password?: never })
      | {
          operate: 'RESET_PASSWORD';
          ids: string[];
          password: string;
        };

    /** user page list */
    type UserPageList = Common.PaginatingQueryRecord<User>;
  }
}
