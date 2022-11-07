import { rest, RequestHandler } from 'msw';

export const handlers: RequestHandler[] = [
  rest.get('api/foobar', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(1500),
      ctx.json({ message: 'Welcome to VC-UI!' })
    );
  }),
];
