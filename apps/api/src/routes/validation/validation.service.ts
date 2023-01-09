import {
  CredentialSubject,
  CredentialSchemaType,
  VerifiableCredential,
} from '@dvp/api-interfaces';
import {
  AjvSchemaValidationError,
  Logger,
  RequestInvocationContext,
  ValidationError,
} from '@dvp/server-common';
import Ajv, { Schema } from 'ajv';
import { AANZ_FTA_COO_SCHEMA, GENERIC_SCHEMA } from './schmas';
import addFormats from 'ajv-formats';

export class ValidationService {
  logger: Logger;
  invocationContext: RequestInvocationContext;
  ajv: Ajv;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
    this.ajv = new Ajv({ allErrors: true, strictRequired: true });
    addFormats(this.ajv);
  }

  validateCredential(
    credential: VerifiableCredential,
    schemaType: CredentialSchemaType
  ) {
    switch (schemaType) {
      case CredentialSchemaType.AANZFTA_COO:
        return this.validate(AANZ_FTA_COO_SCHEMA, credential);
      case CredentialSchemaType.GENERIC:
        return this.validate(GENERIC_SCHEMA, credential);
      default:
        this.logger.debug(
          '[ValidationService.validateVC] Unknown schemaType, %o',
          schemaType
        );
        throw new ValidationError(`schemaType`, schemaType as string);
    }
  }

  validate(schema: Schema, data: CredentialSubject) {
    const validate = this.ajv.compile(schema);
    if (!validate(data)) {
      throw new AjvSchemaValidationError(validate.errors);
    }
    return {};
  }
}
