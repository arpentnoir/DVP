import * as OpenApiValidator from 'express-openapi-validator';
import { OpenAPIV3 as OpenAPIV3Validator } from 'express-openapi-validator/dist/framework/types';
import { OpenAPIV3 } from 'openapi-types';
import { logger } from '../utils';

export type OpenAPIV3Document = OpenAPIV3.Document;

/**
 * Creates an Express middleware to validate requests against the OpenAPI spec.
 * 
 * @param req The request to be validated.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 */
export const openApiValidatorMiddleware = (apiSpec: OpenAPIV3Document) => {
  return OpenApiValidator.middleware({
    apiSpec: apiSpec as OpenAPIV3Validator.Document,
    validateRequests: {
      allowUnknownQueryParameters: false,
      removeAdditional: 'failing',
    },
    validateResponses: {
      removeAdditional: true,
      onError: (err) => {
        logger.error(
          '[openApiValidatorMiddleware] Response validation failed, %o',
          err
        );
      },
    },
  });
};
