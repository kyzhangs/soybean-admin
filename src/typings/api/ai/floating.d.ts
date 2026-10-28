declare namespace Api {
  namespace AI {
    interface ChatboxSettings {
      enabled: boolean;
      base_url: string;
      token: string;
    }
    interface ChatbotSettings {
      enabled: boolean;
      base_url: string;
      token: string;
      width: number;
    }
  }
}
