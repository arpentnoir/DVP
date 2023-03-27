import {
  DocumentSchemaUpdateRequest,
  DocumentSchemaUpdateResponse,
} from '@dvp/admin-api-client';
import {
  ApplicationError,
  BadRequestError,
  isValidABN,
  Logger,
  NotFoundError,
  RequestInvocationContext,
} from '@dvp/server-common';
import { isEmpty } from 'lodash';
import { models } from '../../db';

export class DocumentSchemaService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  /**
   * Returns the document schema for a given schemaId, throws NotFound error if the schema is not found
   *
   * @param schemaId {string} document schema id
   * @returns {DocumentSchemaType} Document schema object
   */
  async _getDocumentSchema(schemaId: string) {
    this.logger.info(
      '[DocumentSchemaService._getDocumentSchema] retrieve document schema by id'
    );
    const schemas = await models.DocumentSchema.find(
      {
        gs1pk: 'DocumentSchema',
        gs1sk: {
          begins: `DocumentSchema#${schemaId}`,
        },
      },
      {
        index: 'gs1',
        limit: 1,
      }
    );

    if (!schemas?.length) {
      throw new NotFoundError(schemaId);
    }
    return schemas[0];
  }

  /**
   * Updates the document schema enabled/disable flags
   * The list of abns in enableForABNs and disableForABNs are validated for the format, returns invalid abns in the error message
   *
   * @param schemaId {string} Document schema id
   * @param payload {DocumentSchemaUpdateRequest} the payload with the enable/disable flags
   *
   * @returns {DocumentSchemaUpdateResponse} document schema object
   */

  async updateDocumentSchema(
    schemaId: string,
    payload: DocumentSchemaUpdateRequest
  ): Promise<DocumentSchemaUpdateResponse> {
    this.logger.info(
      '[DocumentSchemaService.updateDocumentSchema] updating document schema for %s, payload: %o',
      schemaId,
      payload
    );

    if (isEmpty(payload)) {
      throw new BadRequestError(new Error('payload is empty'));
    }

    if (payload?.enableForAll && payload?.enableForABNs?.length) {
      throw new BadRequestError(
        new Error('enableForABNs and enableForAll are mutually exclusive')
      );
    }

    if (payload?.enableForAll) {
      payload.enableForABNs = [];
    }

    ['enableForABNs', 'disableForABNs'].forEach((key) => {
      if (payload?.[key]) {
        const invalidABNs = payload?.[key].filter(
          (abn: string) => !isValidABN(abn)
        );
        if (invalidABNs?.length) {
          throw new BadRequestError(
            new Error(
              `Invalid ABNs found in ${key} list: ${JSON.stringify(
                invalidABNs
              )}`
            )
          );
        }
      }
    });

    const schema = await this._getDocumentSchema(schemaId);

    try {
      const updatedSchema = await models.DocumentSchema.update(
        {
          schemaId,
          name: schema.name,
          type: schema.type,
        },
        {
          set: {
            updatedBy: this.invocationContext.userId,
            ...payload,
          },
        }
      );

      return {
        schemaId,
        name: updatedSchema.name,
        type: updatedSchema.type,
        disableForABNs: updatedSchema.disableForABNs,
        enableForABNs: updatedSchema.enableForABNs,
        enableForAll: updatedSchema.enableForAll,
        disabled: updatedSchema.disabled,
      };
    } catch (err) {
      this.logger.error(
        '[DocumentSchemaService.updateDocumentSchema] Error updating the document schema,%s, %s',
        schemaId,
        err
      );
      throw new ApplicationError('Error updating the document schema');
    }
  }
}
