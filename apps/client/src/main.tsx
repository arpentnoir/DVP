import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

// Start the mocking conditionally.
if (process.env['NODE_ENV'] === 'development') {
  // eslint-disable-next-line
  const { worker } = require('./mocks');
  worker.start();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
