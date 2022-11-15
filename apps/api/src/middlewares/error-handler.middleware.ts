/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplicationError, SystemError } from '@dvp/server-common';
import type { ErrorRequestHandler } from 'express';

// TODO: Refactor error handler
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (req.logger) {
    // this won't be set during tests
    req.logger.debug('[errorHandler] %o', err);
  }
  if (err instanceof ApplicationError) {
    const error = err.toApiError();
    return res.status(err.httpStatusCode).send(error);
  }
  return res.status(500).send(new SystemError(err).toApiError());
};
