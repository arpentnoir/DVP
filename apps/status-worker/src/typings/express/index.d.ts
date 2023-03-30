declare namespace Express {
  export interface Request {
    logger: import('@dvp/server-common').Logger;
    invocationContext: import('@dvp/server-common').RequestInvocationContext;
    openapi: import('express-openapi-validator/dist/framework/types').OpenApiRequestMetadata;
  }
}
