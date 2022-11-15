import { logger } from '@dvp/server-common';
import * as OpenApiValidator from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

export type OpenAPIV3Document = OpenAPIV3.Document;

export const openApiValidatorMiddleware = (
  apiSpec: OpenAPIV3Document | string
) => {
  return OpenApiValidator.middleware({
    apiSpec,
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
