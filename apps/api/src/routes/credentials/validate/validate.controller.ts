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
