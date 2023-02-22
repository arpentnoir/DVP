import { RequestHandler } from 'express';
import { AuthorizationError } from '../error';

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return next(
        new AuthorizationError(req.path, '', 'Authorization header', authHeader)
      );
    }

    const accessToken = authHeader.substring(7, authHeader.length);

    if (!accessToken) {
      return next(
        new AuthorizationError(req.path, '', 'Access token', accessToken)
      );
    }

    const { userId, userAbn } = req.invocationContext;

    if (!userId || !userAbn) {
      {
        return next(
          new AuthorizationError(
            req.path,
            '',
            'Authorization',
            'Invalid access token'
          )
        );
      }
    }

    return next();
  } catch (err: unknown) {
    return next(
      new AuthorizationError(req.path, '', 'Authorization', 'Unauthorized')
    );
  }
};
