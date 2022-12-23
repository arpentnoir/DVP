import axios from 'axios';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { InternetApp } from './apps';
import { getApiBaseUrl } from './config';

axios.defaults.baseURL = getApiBaseUrl();

// Start the mocking conditionally.
if (
  process.env['NODE_ENV'] === 'development' &&
  process.env['NX_SERVICE_WORKER']
) {
  // eslint-disable-next-line
  const { worker } = require('./mocks');
  worker.start();
}

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
  <StrictMode>
    <InternetApp />
  </StrictMode>
);
