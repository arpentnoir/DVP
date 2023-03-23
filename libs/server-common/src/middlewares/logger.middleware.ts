import { RequestHandler } from 'express';
import { RequestInvocationContext } from '../context';
import { Logger } from '../utils';

/**
 * Creates an Express logging middleware to log requests. 
 * 
 * @param req The request to be logged.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 */
export const loggerMiddleware: RequestHandler = (req, res, next) => {
  const invocationContext = new RequestInvocationContext(req);
  const logger = Logger.from(invocationContext);

  req.logger = logger;

  next();
};
