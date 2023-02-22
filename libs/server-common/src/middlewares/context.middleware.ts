import { RequestHandler } from 'express';
import { RequestInvocationContext } from '../context';

export const contextMiddleware: RequestHandler = (req, _res, next) => {
  const invocationContext = new RequestInvocationContext(req);
  req.invocationContext = invocationContext;
  next();
};
