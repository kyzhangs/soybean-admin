declare namespace Api {
  /**
   * namespace Authx
   *
   * backend api module: "authx"
   */
  namespace Authx {
    interface BindingFlow {
      authorization_url: string;
    }
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

    interface PasskeyOptions {
      flow_id: string;
      public_key: import('@simplewebauthn/browser').PublicKeyCredentialRequestOptionsJSON;
    }

    interface PasskeyVerifyParams {
      flow_id: string;
      credential: import('@simplewebauthn/browser').AuthenticationResponseJSON;
    }

    interface CasConfig {
      enabled: boolean;
    }

    interface CasExchangeResult extends Token {
      redirect: string;
    }

    interface PublicAuthProvider {
      code: string;
      name: string;
      protocol: AuthProtocol;
      icon: string | null;
      sort: number;
    }
  }
}
