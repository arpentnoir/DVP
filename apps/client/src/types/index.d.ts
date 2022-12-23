export interface AppConfig {
  SITE_URL: string;

  // Cognito settings
  AUTH_DOMAIN: string;
  AUTH_REGION: string;
  AUTH_CLIENT: string;
  AUTH_USER_POOL: string;
  AUTH_OAUTH_SCOPE: string;

  // API Settings
  API_URL: string;

  // VC context and renderer
  VC_CONTEXT_ENDPOINT: string;
  VC_RENDERER_ENDPOINT: string;
}

declare global {
  interface Window {
    _env_: AppConfig;
  }
}

export { AppConfig };
