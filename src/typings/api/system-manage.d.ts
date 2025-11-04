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
    type GenderType = '1' | '2' | '3';

    type User = Common.CommonRecord<{
      username: string;
      gender: GenderType;
      is_active: boolean;
      status: Api.Common.EnableStatus;
    }> &
      CommonType.RecordNullable<{
        name: string;
        email: string;
        phone: string;
        avatar: string;
        active_time: string;
        last_login: string;
      }>;
  }
}
