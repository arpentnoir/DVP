import { ErrorObject } from '@dvp/api-interfaces';

export class CustomError {
  errorObject: ErrorObject;
  statusCode: number;

  constructor(errorObject: ErrorObject, statusCode: number) {
    this.errorObject = errorObject;
    this.statusCode = statusCode;
  }
}

// Using to throw server errors and
// catch all unknown errors.
// ServerError is instanceof Error
export class ServerError extends Error {
  errorObject: ErrorObject;
  statusCode: number;

  constructor(errorObject: ErrorObject, message?: string) {
    super(message);
    this.errorObject = errorObject;
    this.statusCode = 500;
    this.message = message;
  }
}
