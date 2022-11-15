import { RequestInvocationContext } from '@dvp/server-common';
import { RequestHandler } from 'express';

export const contextMiddleware: RequestHandler = (req, _res, next) => {
  const invocationContext = new RequestInvocationContext(req);
  req.invocationContext = invocationContext;
  next();
};
