import { Logger, RequestInvocationContext } from '@dvp/server-common';
import { RequestHandler } from 'express';

export const loggerMiddleware: RequestHandler = async (req, res, next) => {
  const invocationContext = new RequestInvocationContext(req);
  const logger = Logger.from(invocationContext);

  req.logger = logger;

  next();
};
