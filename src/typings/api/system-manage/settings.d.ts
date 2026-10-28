declare namespace Api {
  namespace SystemManage {
    interface SettingQuery {
      namespace: string;
      setting_key: string;
    }

    interface SettingUpdate extends SettingQuery {
      name?: string;
      costume_value: unknown;
    }

    interface Setting extends SettingQuery {
      name: string;
      setting_value: unknown;
      costume_value: unknown | null;
      version: number;
      is_secret: boolean;
      description: string | null;
    }
  }
}
