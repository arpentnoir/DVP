import { CredentialsResponse } from '@dvp/api-client';
import {
  decode,
  encode,
  Logger,
  QueryParameterError,
  RequestInvocationContext,
} from '@dvp/server-common';
import { models } from '../../db';

export class CredentialService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  async getCredentials({
    q,
    limit,
    prevCursor,
    nextCursor,
    sort,
  }: {
    prevCursor?: string;
    nextCursor?: string;
    limit?: number;
    q?: string;
    sort?: 'asc' | 'desc';
  }): Promise<CredentialsResponse> {
    const abn = this.invocationContext.userAbn;
    let pagination = {};
    let query = q;
    if (q) {
      try {
        query = decodeURIComponent(q);
      } catch {
        throw new QueryParameterError('q', q);
      }
    }
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

    const credentials = await models.Document.find(
      {
        pk: `Abn#${abn}`,
        sk: { begins: 'Document#' },
      },
      {
        ...(query
          ? {
              where:
                '(contains(${consignmentReferenceNumber}, @{query})) or (contains(${freeTradeAgreement}, @{query})) or (contains(${documentNumber}, @{query})) or (contains(${importerName}, @{query})) or (contains(${importingJurisdiction}, @{query})) or (contains(${exporterOrManufacturerAbn}, @{query}))',
              substitutions: {
                query,
              },
            }
          : {}),
        // DynamoDb applies limit before filtering entries by query - https://advancedweb.hu/the-surprising-properties-of-dynamodb-pagination/
        // Removing limit/pagination if query exists and adding as a bug in the backlog - https://dev.azure.com/bcz-prod/digital-verification-platform/_boards/board/t/digital-verification-platform%20Team/Stories/?workitem=14398
        ...(query ? {} : { limit: limit || 30 }),
        ...pagination,
        reverse: sort === 'desc',
      }
    );

    const results: CredentialsResponse['results'] = credentials?.map(
      (credential) => ({
        id: credential.id,
        consignmentReferenceNumber: credential.consignmentReferenceNumber,
        documentDeclaration: credential.documentDeclaration,
        documentNumber: credential.documentNumber,
        expiryDate: credential.expiryDate,
        issueDate: credential.issueDate,
        exporterOrManufacturerAbn: credential.exporterOrManufacturerAbn,
        freeTradeAgreement: credential.freeTradeAgreement,
        importerName: credential.importerName,
        importingJurisdiction: credential.importingJurisdiction,
      })
    );
    return {
      results,
      ...(query
        ? {}
        : {
            pagination: {
              limit,
              nextCursor: credentials?.next
                ? encode(JSON.stringify(credentials.next))
                : null,
              prevCursor: credentials?.prev
                ? encode(JSON.stringify(credentials.prev))
                : null,
            },
          }),
    };
  }
}
