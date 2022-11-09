/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomError, ServerError } from './custom-errors';

const errorObject = { test: 'errorObject' } as any;
const errorMessage = 'test error message';
const statusCode = 400;

describe('ErrorProvider', () => {
  it('should have a errorObject and statusCode for a CustomeError', () => {
    const customeError = new CustomError(errorObject, statusCode);

    expect(customeError.errorObject).toBe(errorObject);
    expect(customeError.statusCode).toBe(statusCode);
  });

  it('should have a errorObject, statusCode and message for a ServerError', () => {
    const customeError = new ServerError(errorObject, errorMessage);

    expect(customeError.errorObject).toBe(errorObject);
    expect(customeError.statusCode).toBe(500);
    expect(customeError.message).toBe(errorMessage);
  });
});
