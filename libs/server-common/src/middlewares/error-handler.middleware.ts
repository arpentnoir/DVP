import type { NextFunction, Request, Response } from 'express';
import { HttpError } from 'express-openapi-validator/dist/framework/types';
import {
  AjvSchemaValidationError,
  ApiError,
  ApiErrors,
  ApplicationError,
  SystemError,
} from '../error';
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const apiErrors = new ApiErrors();

  if (req.logger) {
    // this won't be set during tests
    req.logger.debug('[errorHandler] %o', err);
  }

  // handle application specific api errors
  if (err instanceof ApplicationError) {
    const error = err.toApiError();
    return res.status(err.httpStatusCode).send(error);
  }

  if (err instanceof AjvSchemaValidationError) {
    return res.status(err.httpStatusCode).send({ errors: err.errors });
  }

  // handle openapi validation errors
  if (err instanceof HttpError && err.errors) {
    err.errors?.forEach((error) => {
      const isAuthError = err.status === 401;
      apiErrors.addErrorDetail(
        isAuthError ? ApiError.SECURITY_ERROR_ID : ApiError.VALIDATION_ERROR_ID,
        isAuthError ? 'SecurityError' : 'ValidationError',
        `${error.path}: ${error.message}`
      );
    });
    return res.status(err.status).send(apiErrors);
  }
  return res.status(500).send(new SystemError(err).toApiError());
};
