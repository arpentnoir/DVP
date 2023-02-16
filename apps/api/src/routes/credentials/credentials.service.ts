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
        ...(q
          ? {
              where:
                '(contains(${consignmentReferenceNumber}, @{q})) or (contains(${freeTradeAgreement}, @{q})) or (contains(${documentNumber}, @{q})) or (contains(${importerName}, @{q})) or (contains(${importingJurisdiction}, @{q})) or (contains(${exporterOrManufacturerAbn}, @{q}))',
              substitutions: {
                q,
              },
            }
          : {}),
        limit: limit || 30,
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
      pagination: {
        limit,
        nextCursor: credentials?.next
          ? encode(JSON.stringify(credentials.next))
          : null,
        prevCursor: credentials?.prev
          ? encode(JSON.stringify(credentials.prev))
          : null,
      },
    };
  }
}
