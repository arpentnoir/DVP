import '@testing-library/jest-dom';
import axios from 'axios';
import { server } from './src/mocks/server';

beforeAll(() => {
  global.window.URL.createObjectURL = jest.fn();

  // Establish API mocking before all tests.
  axios.defaults.baseURL = 'http://localhost:4200/api';
  server.listen();
});
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
