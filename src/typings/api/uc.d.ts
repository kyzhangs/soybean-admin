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
      email: string | null;
      avatar: string | null;
      last_login_at: string | null;
      create_time: string;
    }
  }
}
