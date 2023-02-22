import * as OpenApiValidator from 'express-openapi-validator';
import { OpenAPIV3 as OpenAPIV3Validator } from 'express-openapi-validator/dist/framework/types';
import { OpenAPIV3 } from 'openapi-types';
import { logger } from '../utils';

export type OpenAPIV3Document = OpenAPIV3.Document;

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
