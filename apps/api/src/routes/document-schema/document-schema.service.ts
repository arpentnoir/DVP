import {
  DocumentSchemasResponse,
  DocumentSchemasResponseItemTypeEnum,
} from '@dvp/api-client';
import {
  ApplicationError,
  decode,
  encode,
  Logger,
  QueryParameterError,
  RequestInvocationContext,
} from '@dvp/server-common';
import { models } from '../../db';

export interface DocumentSchemasQueryParams {
  prevCursor?: string;
  nextCursor?: string;
  limit?: number;
  q?: string;
  type?: DocumentSchemasResponseItemTypeEnum;
  name?: string;
  sort?: 'asc' | 'desc';
}

/**
 * A service class responsible for handling document schema operations.
 */
export class DocumentSchemaService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  /**
   * Queries DynamoDB to fetch paginated document schemas. 
   * 
   * @param param0 Query, Document Schema name, results limit and cursors to support pagination.
   * @returns A promise to return a @see {DocumentSchemasResponse}.
   */
  async getDocumentSchemas({
    q,
    name,
    limit,
    prevCursor,
    nextCursor,
    sort,
  }: DocumentSchemasQueryParams): Promise<DocumentSchemasResponse> {
    let pagination = {};
    if (nextCursor) {
      try {
        const marker = decode(nextCursor);
        pagination = {
          next: JSON.parse(marker),
        };
      } catch (err) {
        throw new QueryParameterError('nextCursor', nextCursor);
      }
    } else if (prevCursor) {
      try {
        const marker = decode(prevCursor);
        pagination = {
          prev: JSON.parse(marker),
        };
      } catch (err) {
        throw new QueryParameterError('prevCursor', prevCursor);
      }
    }

    try {
      const schemas = await models.DocumentSchema.find(
        {
          pk: 'DocumentSchema',
          sk: { begins: name ? `DocumentSchema#${name}#` : 'DocumentSchema#' },
        },
        {
          ...(q
            ? {
                where: '(contains(${name}, @{q})) or (contains(${type}, @{q}))',
                substitutions: {
                  q,
                },
              }
            : {}),
          limit: limit || 30,
          ...pagination,
          reverse: sort === 'desc',
          fields: ['name', 'type'],
        }
      );

      const results: DocumentSchemasResponse['results'] = schemas?.map(
        ({ name, type }) => ({
          name,
          type,
        })
      );
      return {
        results,
        pagination: {
          limit,
          nextCursor: schemas?.next
            ? encode(JSON.stringify(schemas.next))
            : null,
          prevCursor: schemas?.prev
            ? encode(JSON.stringify(schemas.prev))
            : null,
        },
      };
    } catch (err) {
      this.logger.error(
        '[DocumentSchemaService.getDocumentSchemas] Error fetching the document schemas, %s',
        err
      );
      throw new ApplicationError('Error fetching the document schemas');
    }
  }
}
