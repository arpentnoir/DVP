import { rest, RequestHandler } from 'msw';
import {
  validEncryptedVCPayload,
  invalidEncryptedVCPayload,
  validVC,
  invalidVC,
} from './fixtures';

export const handlers: RequestHandler[] = [
  // Storage API
  rest.get('http://localhost:4200/api/storage/valid', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(1500),
      ctx.json(validEncryptedVCPayload)
    );
  }),

  rest.get('http://localhost:4200/api/storage/invalid', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(1500),
      ctx.json(invalidEncryptedVCPayload)
    );
  }),

  // VC API
  rest.get('http://localhost:4200/api', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'soopadooopa' }));
  }),

  rest.post('http://localhost:4200/api/verify', async (req, res, ctx) => {
    const result = await req.json();

    // Fail
    if (result.verifiableCredential.test) {
      return res(ctx.status(400), ctx.delay(1500), ctx.json(invalidVC));
    }

    // Success
    return res(ctx.status(200), ctx.delay(1500), ctx.json(validVC));
  }),

  rest.get('http://localhost:4200/api/foobar', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(1500),
      ctx.json({ message: 'Welcome to VC-UI!' })
    );
  }),
];
