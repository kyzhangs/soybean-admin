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
  }
}
