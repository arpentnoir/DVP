import { RequestHandler } from 'express';
import { AuthorizationError } from '../error';

/**
 * Creates an Express middleware that checks if the Authorization request header is supplied in 
 * the correct format.
 * 
 * @param req The request to be extract the Authorization header from.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 */
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
