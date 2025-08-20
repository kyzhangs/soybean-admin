declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token_type: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }

    interface UserInfo {
      userId: string;
      username: string;
      roles: string[];
      buttons: string[];
    }
  }
}
