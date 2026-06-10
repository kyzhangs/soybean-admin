declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface Token {
      token_type: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }
  }
}
