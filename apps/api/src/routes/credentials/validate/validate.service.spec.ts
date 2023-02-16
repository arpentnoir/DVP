import {
  CredentialSchemaType,
  VerifiableCredential,
} from '@dvp/api-interfaces';
import {
  AjvSchemaValidationError,
  RequestInvocationContext,
  ValidationError,
} from '@dvp/server-common';
import { getMockReq } from '@jest-mock/express';
import badDateTimeFormatAANZFTA_COO from '../../../fixtures/validateabledata/AANZFTA-COO-bad-date-time.json';
import emptyStringAANZFTA_COO from '../../../fixtures/validateabledata/AANZFTA_COO-empty-strings.json';
import missingRequiredAANZFTA_COO from '../../../fixtures/validateabledata/AANZFTA_COO-missing-required-fields.json';
import emptyStringGeneric from '../../../fixtures/validateabledata/Generic-empty-string.json';
import missingRequiredGeneric from '../../../fixtures/validateabledata/generic-missing-required-fields.json';
import validAANZFTA_COO from '../../../fixtures/validateabledata/validAANZFTA_COO.json';
import validGenericData from '../../../fixtures/validateabledata/validGeneric.json';
import { ValidationService } from './validate.service';

const wrongSchemaType = {
  schemaType: 'abbbaa',
};
const emptyAANZFTA_COO = {
  schemaType: 'AANZFTA_COO',
  credentialSubject: {},
};
const emptyGeneric = {
  schemaType: 'GENERIC',
  credentialSubject: {},
};

describe('validation.service', () => {
  const mockRequest = getMockReq({
    method: 'POST',
    headers: {
      'Correlation-ID': 'NUMPTYHEAD1',
    },
  });

  mockRequest.route = { path: '/validate' };
  const invocationContext = new RequestInvocationContext(mockRequest);

  it('should return valid for a valid AANZFTA_COO VC', () => {
    const validationService = new ValidationService(invocationContext);
    const validationResponse = validationService.validateCredential(
      validAANZFTA_COO.verifiableCredential as VerifiableCredential,
      validAANZFTA_COO.schemaType as CredentialSchemaType
    );

    expect(validationResponse).toEqual({});
  });
  it('should return valid for a valid Generic VC', () => {
    const validationService = new ValidationService(invocationContext);
    const validationResponse = validationService.validateCredential(
      validGenericData.verifiableCredential as VerifiableCredential,
      validGenericData.schemaType as CredentialSchemaType
    );

    expect(validationResponse).toEqual({});
  });
  it('should throw AjvSchemaValidationError when an empty vc is givin for AANZFTA_COO', () => {
    const validationService = new ValidationService(invocationContext);
    try {
      validationService.validateCredential(
        emptyAANZFTA_COO as unknown as VerifiableCredential,
        emptyAANZFTA_COO.schemaType as CredentialSchemaType
      );
    } catch (e) {
      expect(e).toBeInstanceOf(AjvSchemaValidationError);
    }
  });
  it('should throw AjvSchemaValidationError when an empty vc is givin for Generic', () => {
    const validationService = new ValidationService(invocationContext);
    try {
      validationService.validateCredential(
        emptyGeneric as unknown as VerifiableCredential,
        emptyGeneric.schemaType as CredentialSchemaType
      );
    } catch (e) {
      expect(e).toBeInstanceOf(AjvSchemaValidationError);
    }
  });
  it('should throw AjvSchemaValidationError for a vc with missing required fields for a Generic vc', () => {
    const validationService = new ValidationService(invocationContext);
    try {
      validationService.validateCredential(
        missingRequiredGeneric.verifiableCredential as VerifiableCredential,
        missingRequiredGeneric.schemaType as CredentialSchemaType
      );
    } catch (e) {
      expect(e).toBeInstanceOf(AjvSchemaValidationError);
      expect(e.errors).toBeDefined();
      expect(e.errors.length).toEqual(1);
      expect(e.errors[0].detail).toEqual(
        "/credentialSubject/importingJurisdiction: must have required property 'importingJurisdiction'"
      );
    }
  });
  it('should throw AjvSchemaValidationError for a vc with missing required fields for a AANZFTA_COO vc', () => {
    const validationService = new ValidationService(invocationContext);
    try {
      validationService.validateCredential(
        missingRequiredAANZFTA_COO.verifiableCredential as VerifiableCredential,
        missingRequiredAANZFTA_COO.schemaType as CredentialSchemaType
      );
    } catch (e) {
      expect(e).toBeInstanceOf(AjvSchemaValidationError);
      expect(e.errors).toBeDefined();
      expect(e.errors.length).toEqual(3);

      expect(e.errors[0].detail).toEqual(
        "/credentialSubject/supplyChainConsignment/exportCountry/name: must have required property 'name'"
      );
      expect(e.errors[1].detail).toEqual(
        "/credentialSubject/supplyChainConsignment/consignee/postalAddress/line1: must have required property 'line1'"
      );
      expect(e.errors[2].detail).toEqual(
        "/credentialSubject/supplyChainConsignment/includedConsignmentItems/0/tradeLineItems/0/transportPackages/0/grossVolume: must have required property 'grossVolume'"
      );
    }
  });
  it('should return invalid with errors for a vc with empty string fields for a Generic vc', () => {
    const validationService = new ValidationService(invocationContext);
    try {
      validationService.validateCredential(
        emptyStringGeneric.verifiableCredential as VerifiableCredential,
        emptyStringGeneric.schemaType as CredentialSchemaType
      );
    } catch (e) {
      expect(e).toBeInstanceOf(AjvSchemaValidationError);
      expect(e.errors).toBeDefined();
      expect(e.errors.length).toEqual(2);

      expect(e.errors[0].detail).toEqual(
        '/credentialSubject/exporterOrManufacturerAbn: must NOT have fewer than 1 characters'
      );

      expect(e.errors[1].detail).toEqual(
        '/credentialSubject/importerName: must NOT have fewer than 1 characters'
      );
    }
  });
  it('should return invalid with errors for a vc with empty string fields for a AANZFTA_COO vc', () => {
    const validationService = new ValidationService(invocationContext);
    try {
      validationService.validateCredential(
        emptyStringAANZFTA_COO.verifiableCredential as VerifiableCredential,
        emptyStringAANZFTA_COO.schemaType as CredentialSchemaType
      );
    } catch (e) {
      expect(e.errors).toBeDefined();
      expect(e.errors.length).toEqual(3);

      expect(e.errors[0].detail).toEqual(
        '/credentialSubject/supplyChainConsignment/information: must NOT have fewer than 1 characters'
      );

      expect(e.errors[1].detail).toEqual(
        '/credentialSubject/supplyChainConsignment/includedConsignmentItems/0/tradeLineItems/0/transportPackages/0/grossVolume: must NOT have fewer than 1 characters'
      );

      expect(e.errors[2].detail).toEqual(
        '/credentialSubject/supplyChainConsignment/mainCarriageTransportMovement/unloadingBaseportLocation/iD: must NOT have fewer than 1 characters'
      );
    }
  });
  it('should send error if schema type dosnt match known types', () => {
    const validationService = new ValidationService(invocationContext);
    const func = () => {
      validationService.validateCredential(
        wrongSchemaType as unknown as VerifiableCredential,
        wrongSchemaType.schemaType as CredentialSchemaType
      );
    };

    expect(func).toThrow(ValidationError);
  });
  it('should send error if date time field has incorrect format', () => {
    const validationService = new ValidationService(invocationContext);
    try {
      validationService.validateCredential(
        badDateTimeFormatAANZFTA_COO.verifiableCredential as VerifiableCredential,
        badDateTimeFormatAANZFTA_COO.schemaType as CredentialSchemaType
      );
    } catch (e) {
      expect(e.errors).toBeDefined();
      expect(e.errors.length).toEqual(1);

      expect(e.errors[0].detail).toEqual(
        '/credentialSubject/issueDateTime: must match format "date-time"'
      );
    }
  });
});
