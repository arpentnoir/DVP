import { RequestHandler, rest } from 'msw';
import { invalidEncryptedVCPayload, validEncryptedVCPayload } from './fixtures';

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

  // Revocation
  rest.post(
    'http://localhost:4200/api/credentials/status',
    async (req, res, ctx) => {
      const body = await req.json();

      return res(
        ctx.status(
          body.credentialId === 'urn:uuid:mock-success-credential-id'
            ? 200
            : 500
        )
      );
    }
  ),
];
