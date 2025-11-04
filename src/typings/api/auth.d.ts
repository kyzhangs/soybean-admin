declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginForm {
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
  }
}
