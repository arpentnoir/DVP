import { ErrorRequestHandler } from 'express';

export const logger: ErrorRequestHandler = (err, req, res, next) => {
  //  TODO: Implement logger
  next(err);
};
