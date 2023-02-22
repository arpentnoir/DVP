import { RequestHandler } from 'express';
import { RequestInvocationContext } from '../context';
import { Logger } from '../utils';

export const loggerMiddleware: RequestHandler = (req, res, next) => {
  const invocationContext = new RequestInvocationContext(req);
  const logger = Logger.from(invocationContext);

  req.logger = logger;

  next();
};
