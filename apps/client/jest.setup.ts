import '@testing-library/jest-dom';
import { server } from './src/mocks/server';
import axios from 'axios';

process.env.VC_CONTEXT_ENDPOINT = 'testContextUrl';
process.env.VC_RENDERER_ENDPOINT = 'testRendererUrl';

// Establish API mocking before all tests.
beforeAll(() => {
  axios.defaults.baseURL = 'http://localhost:4200/api';
  server.listen();
});
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
