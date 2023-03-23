import {
  CredentialSchemaType,
  VerifiableCredential,
} from '@dvp/api-interfaces';
import { NextFunction, Request, Response } from 'express';
import { ValidationService } from './validate.service';

export interface ExpectedBody {
  verifiableCredential: VerifiableCredential;
  schemaType: string;
}

/**
 * Validates a Verifiable Credential by invoking the  @see {ValidationService}.
 * 
 * @param req The request from which to extract the verifiable credential and schema type.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 * @returns A HTTP 200 containing the response returned by invoking @see {ValidationService.validateCredential}
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { verifiableCredential, schemaType }: ExpectedBody = req.body;

    const validationService = new ValidationService(req.invocationContext);
    const validationResponse = validationService.validateCredential(
      verifiableCredential,
      schemaType as CredentialSchemaType
    );

    return res.status(200).json(validationResponse);
  } catch (e) {
    next(e);
  }
};
