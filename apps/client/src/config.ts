function getEnvConfig() {
  if (!window._env_) {
    throw new Error('Unable to find environment config');
  }

  return {
    ...window._env_,
    SITE_URL: `${window.location.protocol}//${window.location.host}`,
  };
}

export const getAwsCognitoConfig = () => {
  const config = getEnvConfig();

  return {
    Auth: {
      region: config.AUTH_REGION,
      userPoolId: config.AUTH_USER_POOL,
      userPoolWebClientId: config.AUTH_CLIENT,

      oauth: {
        domain: config.AUTH_DOMAIN,
        scope: config.AUTH_OAUTH_SCOPE.split(' '),
        redirectSignIn: `${config.SITE_URL}/`,
        redirectSignOut: `${config.SITE_URL}/logout`,
        responseType: 'code',
      },
    },
  };
};

export const getApiBaseUrl = () => {
  const config = getEnvConfig();
  return config.API_URL;
};

export const getVcContextAndRendererEndpoints = () => {
  const config = getEnvConfig();
  return {
    contextUrl: config.VC_CONTEXT_ENDPOINT,
    rendererUrl: config.VC_RENDERER_ENDPOINT,
  };
};
