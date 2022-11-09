/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ErrorRequestHandler } from 'express';
import { v4 as uuid } from 'uuid';
import { CustomError } from '../utils';

// TODO: Refactor error handler
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: [{ id: uuid(), ...err.errorObject }],
    });
  }
  return res.status(500).send({
    errors: err.errorObject
      ? [{ id: uuid(), ...err.errorObject }]
      : [
          {
            id: uuid(),
            code: 'DVPAPI-001',
            detail: 'System Unavailable.  Try again later.',
          },
        ],
  });
};
