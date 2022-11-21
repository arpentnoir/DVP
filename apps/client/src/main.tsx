import axios from 'axios';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

axios.defaults.baseURL = process.env['NX_API_URL'];

// Start the mocking conditionally.
if (process.env['NODE_ENV'] === 'development') {
  // eslint-disable-next-line
  const { worker } = require('./mocks');
  worker.start();
}

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
