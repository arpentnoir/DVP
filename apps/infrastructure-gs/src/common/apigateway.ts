import fs from 'fs-extra';
import { OpenAPIV3 } from 'openapi-types';

export const getGatewayOpenApiSpec = ({
  name,
  openapiSpecPath,
  lambdaApiHandlerArn,
  cognitoUserPoolArns,
  apiDomain,
  apiInternalPath = 'v1',
}: {
  name: string;
  openapiSpecPath: string;
  lambdaApiHandlerArn: string;
  cognitoUserPoolArns: string[];
  apiDomain: string;
  apiInternalPath: string;
}) => {
  const gatewaySpec = fs.readJsonSync(openapiSpecPath) as OpenAPIV3.Document;
  gatewaySpec.info.title = name;
  gatewaySpec.servers = [
    {
      url: `https://${apiDomain}/{basePath}`,
      variables: {
        basePath: {
          default: apiInternalPath.replace(/\//g, ''),
        },
      },
    },
  ];
  addGateWayResponseTemplates(gatewaySpec);
  addCognitoAuthorizer(gatewaySpec, cognitoUserPoolArns);
  gatewaySpec['x-amazon-apigateway-request-validators'] = {
    all: {
      validateRequestParameters: true,
      validateRequestBody: true,
    },
  };
  for (const path in gatewaySpec.paths) {
    const pathObject = gatewaySpec?.paths?.[path];
    for (const method in pathObject) {
      const operationObject = pathObject?.[method] as OpenAPIV3.OperationObject;
      if (operationObject) {
        operationObject['x-amazon-apigateway-request-validator'] = 'all';
        operationObject['x-amazon-apigateway-integration'] = {
          uri: `arn:aws:apigateway:ap-southeast-2:lambda:path/2015-03-31/functions/${lambdaApiHandlerArn}/invocations`,
          passthroughBehavior: 'never',
          httpMethod: 'POST',
          contentHandling: 'CONVERT_TO_TEXT',
          type: 'aws_proxy',
        };
        if (!pathObject.options) {
          addCORSResponseToPathObject(pathObject, operationObject.parameters);
        }
      }
    }
  }
  return gatewaySpec;
};

const addCognitoAuthorizer = (
  spec: OpenAPIV3.Document,
  cognitoUserPoolArns: string[]
) => {
  const authorizer = {
    'x-amazon-apigateway-authtype': 'cognito_user_pools',
    'x-amazon-apigateway-authorizer': {
      providerARNs: cognitoUserPoolArns,
      type: 'cognito_user_pools',
    },
  };
  Object.assign(spec.components.securitySchemes['Authorizer'], authorizer);
};

const addCORSResponseToPathObject = (
  pathObject: OpenAPIV3.PathItemObject,
  parameters: OpenAPIV3.OperationObject['parameters']
) => {
  return Object.assign(pathObject, {
    options: {
      parameters,
      responses: {
        '200': {
          description: '200 response',
          headers: {
            'Access-Control-Allow-Origin': {
              schema: {
                type: 'string',
              },
            },
            'Access-Control-Allow-Methods': {
              schema: {
                type: 'string',
              },
            },
            'Access-Control-Allow-Headers': {
              schema: {
                type: 'string',
              },
            },
          },
          content: {},
        },
      },
      'x-amazon-apigateway-request-validator': 'all',
      'x-amazon-apigateway-integration': {
        responses: {
          default: {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Methods': "'*'",
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,Correlation-ID,If-Match'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
        },
        requestTemplates: {
          'application/json': '{"statusCode": 200}',
        },
        passthroughBehavior: 'when_no_match',
        contentHandling: 'CONVERT_TO_TEXT',
        type: 'mock',
      },
    },
  });
};

const addGateWayResponseTemplates = (spec: OpenAPIV3.Document) => {
  Object.assign(spec, {
    'x-amazon-apigateway-gateway-responses': {
      AUTHORIZER_FAILURE: {
        statusCode: 403,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY004","id": "$context.requestId","detail": "Title: Authorisation Failure, Action: Please contact the API provider","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      QUOTA_EXCEEDED: {
        statusCode: 429,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY013","id": "$context.requestId","detail": "Title: Quota exceeded, Action: Please contact the API provider","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      UNAUTHORIZED: {
        statusCode: 403,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY017","id": "$context.requestId","detail": "Title: Authorisation Failure, Action: Please contact the API provider","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      ACCESS_DENIED: {
        statusCode: 403,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY001","id": "$context.requestId","detail": "Title: Authorisation Failure, Action: Please contact the API provider","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      AUTHORIZER_CONFIGURATION_ERROR: {
        statusCode: 500,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY003","id": "$context.requestId","detail": "Title: Internal API failure, Action: Please contact the API provider","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      INVALID_SIGNATURE: {
        statusCode: 401,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY011","id": "$context.requestId","detail": "Title: Invalid signature, Action: Please check signature implementation","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      UNSUPPORTED_MEDIA_TYPE: {
        statusCode: 415,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY018","id": "$context.requestId","detail": "Title: Unsupported media type, Action: Please check the API documentation","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      BAD_REQUEST_PARAMETERS: {
        statusCode: 400,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY005","id": "$context.requestId","detail": "Title: Parameters not valid, Action: Please check the API documentation","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      API_CONFIGURATION_ERROR: {
        statusCode: 500,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY002","id": "$context.requestId","detail": "Title: Internal API failure, Action: Please contact the API provider","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      THROTTLED: {
        statusCode: 429,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY016","id": "$context.requestId","detail": "Title: Throttling employed, Action: Please contact the API provider","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      BAD_REQUEST_BODY: {
        statusCode: 400,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY006","id": "$context.requestId","detail": "Title: Request body not valid, Action: Please check the API documentation","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      REQUEST_TOO_LARGE: {
        statusCode: 413,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY014","id": "$context.requestId","detail": "Title: Request too large, Action: Please check the API documentation","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      RESOURCE_NOT_FOUND: {
        statusCode: 404,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY015","id": "$context.requestId","detail": "Title: Resource not found, Action: Please check the API documentation","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      INTEGRATION_TIMEOUT: {
        statusCode: 500,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY009","id": "$context.requestId","detail": "Title: Internal API failure, Action: Please contact the API provider","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      MISSING_AUTHENTICATION_TOKEN: {
        statusCode: 401,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY012","id": "$context.requestId","detail": "Title: Authentication Failure, Action: Please check the API specification to ensure verb/path are valid","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      INTEGRATION_FAILURE: {
        statusCode: 500,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY008","id": "$context.requestId","detail": "Title: Internal API failure, Action: Please contact the API provider","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      EXPIRED_TOKEN: {
        statusCode: 401,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY007","id": "$context.requestId","detail": "Title: Expired Token, Action: Please re-authenticate","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
      INVALID_API_KEY: {
        statusCode: 401,
        responseTemplates: {
          'application/json':
            '{"errors": [{"code": "GATEWAY010","id": "$context.requestId","detail": "Title: Invalid API Key, Action: Please contact the API provider","helpText": "Diagnostics: $context.error.message"}]}',
        },
      },
    },
  });
};
