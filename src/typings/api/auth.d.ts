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

    interface TwoFactorChallenge {
      challenge_token: string;
      expires_in: number;
    }

    type LoginResult = Token | TwoFactorChallenge;

    interface TwoFactorVerifyParams {
      challenge_token: string;
      code: string;
    }
  }
}
