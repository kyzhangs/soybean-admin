declare namespace Api {
  namespace SystemManage {
    type LoginResult = 'success' | 'failure';
    type LoginStage = 'password' | 'mfa' | 'passkey' | 'provider_callback' | 'ticket_exchange';

    type LoginLog = Api.Common.CommonRecord<{
      user_id: string | null;
      username: string | null;
      name: string | null;
      session_id: string | null;
      result: LoginResult;
      stage: LoginStage;
      login_protocol: Api.UserCenter.LoginProtocol | null;
      provider_name: string | null;
      logout_time: string | null;
      failure_code: number | null;
      ip_address: string | null;
      browser: string | null;
      os: string | null;
      device: Api.UserCenter.DeviceType;
      country_code: string | null;
      country: string | null;
      region: string | null;
      city: string | null;
      request_id: string | null;
    }>;

    type LoginLogSearchParams = Api.Common.CommonSearchParams & {
      keyword: string | null;
      result: LoginResult | null;
      login_protocol: Api.UserCenter.LoginProtocol | null;
      device: Api.UserCenter.DeviceType | null;
      ip_address: string | null;
      start_time: string | null;
      end_time: string | null;
    };

    type LoginLogPage = Api.Common.PaginatingQueryRecord<LoginLog>;
  }
}
