declare namespace Api {
  /**
   * namespace UserCenter
   *
   * backend api module: "uc"
   */
  namespace UserCenter {
    type UserInfo = Pick<
      Api.SystemManage.User,
      | 'username'
      | 'name'
      | 'gender'
      | 'phone'
      | 'email'
      | 'status'
      | 'active_time'
      | 'last_login'
      | 'is_superuser'
      | 'avatar'
      | 'timezone'
    > & {
      userId: string;
      create_time: string | null;
      roles: string[];
      buttons: string[];
    };

    interface PasswordChangeParams {
      old_password: string;
      new_password: string;
      confirm_password: string;
    }

    interface TimezoneUpdateParams {
      timezone: string | null;
    }

    interface TwoFactorSetupParams {
      password: string;
    }

    interface TwoFactorStatus {
      status: Api.Common.Status;
    }

    interface TwoFactorSetup {
      secret: string;
      provisioning_uri: string;
      qr_code: string;
    }

    interface TwoFactorEnableParams {
      code: string;
    }

    interface TwoFactorEnableResult {
      recovery_codes: string[];
    }

    interface TwoFactorDisableParams {
      password: string;
      code: string;
    }

    interface TwoFactorRecoveryCodesRegenerateParams {
      password: string;
      code: string;
    }

    interface PasskeyRegistrationOptions {
      flow_id: string;
      public_key: import('@simplewebauthn/browser').PublicKeyCredentialCreationOptionsJSON;
    }

    interface PasskeyRegistrationVerifyParams {
      flow_id: string;
      credential: import('@simplewebauthn/browser').RegistrationResponseJSON;
      name: string;
    }

    interface Passkey {
      id: string;
      name: string;
      device_type: string | null;
      backed_up: boolean;
      transports: string[] | null;
      last_used_at: string | null;
      create_time: string;
    }

    interface AuthIdentity {
      id: string;
      provider_code: string;
      provider_name: string;
      provider_icon: string | null;
      username: string | null;
      name: string | null;
      phone: string | null;
      email: string | null;
      avatar: string | null;
      last_login_at: string | null;
      create_time: string;
    }

    interface PendingAuthBinding {
      flow_id: string;
      subject: string;
      provider_code: string;
      provider_name: string;
      provider_protocol: Api.Authx.AuthProtocol;
      provider_icon: string | null;
      username: string | null;
      name: string | null;
      email: string | null;
      avatar: string | null;
    }

    type DeviceType = 'pc' | 'mobile' | 'tablet' | 'bot' | 'unknown';
    type LoginProtocol = 'password' | 'cas' | 'oauth2' | 'oidc' | 'webauthn';

    interface AuthSession {
      id: string;
      is_current: boolean;
      login_protocol: LoginProtocol;
      provider_name: string | null;
      auth_time: string;
      last_seen_at: string;
      expires_at: string;
      ip_address: string | null;
      browser: string | null;
      os: string | null;
      device: DeviceType;
      country_code: string | null;
      country: string | null;
      region: string | null;
      city: string | null;
    }

    interface LoginLogSearchParams {
      page: number;
      page_size: number;
    }

    type LoginLog = Api.SystemManage.LoginLog;
    type LoginLogPage = Api.Common.PaginatingQueryRecord<LoginLog>;
  }
}
