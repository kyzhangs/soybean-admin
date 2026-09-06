declare namespace Api {
  namespace Authx {
    type AuthProtocol = 'cas' | 'oauth2';

    type CasProviderSettings = {
      authorization_url: string;
      validation_url: string;
      logout_url: string | null;
      callback_url: string;
      version: 2 | 3;
      slo_enabled: boolean;
      subject_attribute: string | null;
      username_field: string | null;
      name_field: string | null;
      phone_field: string | null;
      email_field: string | null;
      avatar_field: string | null;
      principal_fallback_enabled: boolean;
    };

    type OAuth2ProviderSettings = {
      authorization_url: string;
      token_url: string;
      userinfo_url: string;
      callback_url: string;
      client_id: string;
      client_secret?: string;
      scopes: string[];
      use_pkce: boolean;
      user_id_field: string;
      username_field: string | null;
      name_field: string | null;
      phone_field: string | null;
      email_field: string | null;
      avatar_field: string | null;
      provider_type: 'generic' | 'github';
    };

    type AuthProviderSettings = Partial<CasProviderSettings> | Partial<OAuth2ProviderSettings>;

    type AuthProvider = Common.CommonRecord<{
      code: string;
      name: string;
      protocol: AuthProtocol;
      icon: string | null;
      sort: number;
      auto_bind: boolean;
      auto_provision: boolean;
      verify_tls: boolean;
      timeout: number;
      settings: AuthProviderSettings;
      configured: boolean;
      client_secret_configured: boolean;
    }>;

    type AuthProviderPageList = Common.PaginatingQueryRecord<AuthProvider>;

    type AuthProviderSearchParams = Common.CommonSearchParams;

    type AuthProviderCreateParams = Pick<AuthProvider, 'name' | 'code' | 'icon' | 'sort'>;

    type AuthProviderBasicUpdateParams = Pick<AuthProvider, 'name' | 'icon' | 'sort'>;

    type AuthProviderAccessUpdateParams = Pick<AuthProvider, 'protocol' | 'settings'>;

    type AuthProviderAdvancedUpdateParams = Pick<
      AuthProvider,
      'auto_bind' | 'auto_provision' | 'verify_tls' | 'timeout' | 'settings'
    >;

    type AuthProviderUpdateParams = Partial<
      AuthProviderBasicUpdateParams & AuthProviderAccessUpdateParams & AuthProviderAdvancedUpdateParams
    >;

    type AuthProviderProfileTestFlow = {
      authorization_url: string;
    };
  }
}
