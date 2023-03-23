import { RequestHandler } from 'express';
import { RequestInvocationContext } from '../context';

/**
 * Creates an Express middleware to inject a @see {RequestInvocationContext} object into the request.
 * 
 * @param req The request to be have the request invocation context injected into.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 */
export const contextMiddleware: RequestHandler = (req, _res, next) => {
  const invocationContext = new RequestInvocationContext(req);
  req.invocationContext = invocationContext;
  next();
};
