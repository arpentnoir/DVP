import { Auth } from 'aws-amplify';
import axios from 'axios';
import { getApiBaseUrl } from '../config';

// Default config options
const defaultOptions = {
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
};

export const axiosInstance = axios.create(defaultOptions);

// Set the AUTH token for any request
axiosInstance.interceptors.request.use(async function (config: any) {
  if (!config.headers) {
    config.headers = {};
  }
  try {
    const session = await Auth.currentSession();
    const accessToken = session?.getIdToken().getJwtToken();
    config.headers['Authorization'] = accessToken
      ? `Bearer ${accessToken}`
      : '';
  } catch (_error) {
    // Refresh token, skipping it because we will replace it with SSO and MyGov
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return config;
});
