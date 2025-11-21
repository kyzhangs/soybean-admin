declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface AuthTokenParams {
      username: string;
      password: string;
    }

    interface Token {
      token_type: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }

    type RefreshTokenParams = Pick<Token, 'refresh_token'>;

    type Profile = Api.Common.CommonRecord<{
      userId: string;
      gender: string;
      username: string;
      is_active: boolean;
      roles: string[];
      buttons: string[];
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
