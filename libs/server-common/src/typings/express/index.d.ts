declare namespace Express {
  export interface Request {
    logger: import('../../utils/logger').Logger;
    invocationContext: import('../../context').RequestInvocationContext;
    openapi: import('express-openapi-validator/dist/framework/types').OpenApiRequestMetadata;
  }
}
