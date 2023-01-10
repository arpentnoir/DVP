global.window.URL.createObjectURL = jest.fn();

global.window['_env_'] = {
  SITE_URL: '',
  API_URL: 'http://localhost:4200/api',
  AUTH_DOMAIN:
    'dvp-dev-auth-internet-user-pool-domain.auth.ap-southeast-2.amazoncognito.com',
  AUTH_REGION: 'ap-southeast-2',
  AUTH_CLIENT: '3bldsrvim5mbchuv3ue0rtjruu',
  AUTH_USER_POOL: 'ap-southeast-2_77WijBpne',
  AUTH_OAUTH_SCOPE: 'email',
  VC_CONTEXT_ENDPOINT:
    'https://dev-dvp-context.s3.ap-southeast-2.amazonaws.com',
  VC_RENDERER_ENDPOINT: 'https://dev.renderer.dvp.ha.showthething.com',
  DISABLE_SIGNUP: false,
};
