const MockDbCreateRecord = jest.fn();
jest.mock('../../db', () => {
  return {
    models: {
      Document: {
        create: MockDbCreateRecord,
      },
    },
  };
});

import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import { VerifiableCredential } from '@dvp/api-interfaces';
import { RequestInvocationContext } from '@dvp/server-common';
import { getMockReq } from '@jest-mock/express';
import unsignedSvip from '../../../fixtures/genericvc/degree_unsigned.json';
import unsignedOAV3 from '../../../fixtures/oav3/did.json';
import {
  default as validAANZFTA_COO,
  default as validGeneric,
} from '../../../fixtures/validateabledata/validAANZFTA_COO.json';

import { storageClient } from '../../storage/storage.service';
import { IssueService } from './issue.service';

const deleteDocumentMock = jest.spyOn(storageClient, 'deleteDocument');
const uploadDocumentMock = jest.spyOn(storageClient, 'uploadDocument');

let unsigned_OA_V3_base: VerifiableCredential;

const userId = 'user1234';
const userAbn = 'abn1234';
const storageId = 'id1234';
const decryptKey = 'key1234';
const docStorePath = 'path/to/doc/store/';

describe('issue.service', () => {
  const mockRequest = getMockReq({
    method: 'POST',
    headers: {
      'Correlation-ID': 'NUMPTYHEAD1',
    },
  });

  mockRequest.route = { path: '/issue' };
  const invocationContext = new RequestInvocationContext(mockRequest);

  beforeEach(() => {
    unsigned_OA_V3_base = JSON.parse(JSON.stringify(unsignedOAV3));
    MockDbCreateRecord.mockClear();
    deleteDocumentMock.mockClear();
    uploadDocumentMock.mockClear();
  });

  it('should issue a valid OA credential', async () => {
    uploadDocumentMock.mockResolvedValueOnce('');
    MockDbCreateRecord.mockResolvedValueOnce({});

    const issueService = new IssueService(invocationContext);
    const { verifiableCredential } = await issueService.issue(
      IssueCredentialRequestSigningMethodEnum.Oa,
      unsignedOAV3 as never
    );

    expect(verifiableCredential.proof).toEqual(
      expect.objectContaining({
        type: 'OpenAttestationMerkleProofSignature2018',
        proofPurpose: 'assertionMethod',
        proofs: [],
        privacy: { obfuscated: [] },
      })
    );

    expect(verifiableCredential.credentialSubject).toEqual(
      expect.objectContaining(unsignedOAV3.credentialSubject)
    );
    expect(verifiableCredential.proof).toHaveProperty('targetHash');
    expect(verifiableCredential.proof).toHaveProperty('merkleRoot');
    expect(verifiableCredential.proof).toHaveProperty('salts');
    expect(verifiableCredential.proof).toHaveProperty('key');
    expect(verifiableCredential.proof).toHaveProperty('signature');
  });

  it('should fail if property was not defined in the context', async () => {
    const unsigned_no_context_OA_V3 = unsigned_OA_V3_base;
    unsigned_no_context_OA_V3['@context'] = [
      'https://www.w3.org/2018/credentials/v1',
    ];

    const issueService = new IssueService(invocationContext);
    await expect(() =>
      issueService.issue(
        IssueCredentialRequestSigningMethodEnum.Oa,
        unsigned_no_context_OA_V3
      )
    ).rejects.toThrow('Failed to issue verifiable credential');
  });

  it('should store the correct metadata for a partial coo', async () => {
    const partialCoo = {
      ...validGeneric.verifiableCredential,
      credentialSubject: {
        iD: '0003625',
        freeTradeAgreement: 'AANZFTA',
        importingJurisdiction: 'Indonesia',
        exporterOrManufacturerAbn: '55004094599',
        importerName: 'ABC Imports',
        consignmentReferenceNumber: '15688545563',
        documentDeclaration: true,
        originalDocument: 'doc',
      },
    };

    const issueService = new IssueService({
      ...invocationContext,
      userId,
      userAbn,
    } as RequestInvocationContext);

    await issueService.storeMetadata(
      partialCoo as VerifiableCredential,
      storageId,
      decryptKey,
      docStorePath
    );

    expect(MockDbCreateRecord).toBeCalledWith({
      id: storageId,
      abn: userAbn,
      createdBy: userId,
      decryptionKey: decryptKey,
      s3Path: docStorePath + storageId,
      documentNumber: '0003625',
      freeTradeAgreement: 'AANZFTA',
      importingJurisdiction: 'Indonesia',
      exporterOrManufacturerAbn: '55004094599',
      importerName: 'ABC Imports',
      consignmentReferenceNumber: '15688545563',
      documentDeclaration: true,
      issueDate: validGeneric.verifiableCredential.issuanceDate,
    });
  });

  it('should store the correct metadata for a full coo', async () => {
    const fullCoo = {
      ...validAANZFTA_COO.verifiableCredential,
      credentialSubject: {
        iD: '000253',
        supplyChainConsignment: {
          iD: 'dbschenker.com:hawb:DBS626578',
          importCountry: { name: 'Singapore' },
          consignor: { iD: '95307094535' },
          consignee: { name: 'East meets west fine wines' },
        },
      },
    };

    const issueService = new IssueService({
      ...invocationContext,
      userId,
      userAbn,
    } as RequestInvocationContext);

    await issueService.storeMetadata(
      fullCoo as VerifiableCredential,
      storageId,
      decryptKey,
      docStorePath
    );

    expect(MockDbCreateRecord).toBeCalledWith({
      id: storageId,
      abn: userAbn,
      createdBy: userId,
      decryptionKey: decryptKey,
      s3Path: docStorePath + storageId,
      documentNumber: '000253',
      importingJurisdiction: 'Singapore',
      exporterOrManufacturerAbn: '95307094535',
      importerName: 'East meets west fine wines',
      consignmentReferenceNumber: 'dbschenker.com:hawb:DBS626578',
      issueDate: validAANZFTA_COO.verifiableCredential.issuanceDate,
    });
  });

  it('should remove undefined values and store the correct metadata for a non CoO VC', async () => {
    const issueService = new IssueService({
      ...invocationContext,
      userId,
      userAbn,
    } as RequestInvocationContext);

    await issueService.storeMetadata(
      {
        ...validGeneric.verifiableCredential,
        credentialSubject: {},
      } as VerifiableCredential,
      storageId,
      decryptKey,
      docStorePath
    );

    expect(MockDbCreateRecord.mock.lastCall[0]).toStrictEqual({
      id: storageId,
      abn: userAbn,
      createdBy: userId,
      decryptionKey: decryptKey,
      s3Path: docStorePath + storageId,
      issueDate: validGeneric.verifiableCredential.issuanceDate,
    });
  });

  it('should throw an error if an unexpected error occurs when storing the metadata', async () => {
    MockDbCreateRecord.mockRejectedValueOnce({});
    deleteDocumentMock.mockResolvedValueOnce();

    const issueService = new IssueService({
      ...invocationContext,
      userId,
      userAbn,
    } as RequestInvocationContext);

    await expect(
      issueService.storeMetadata(
        validGeneric.verifiableCredential as VerifiableCredential,
        storageId,
        decryptKey,
        docStorePath
      )
    ).rejects.toThrowError(
      'Failed to store the verifiable credentials metadata'
    );
  });

  it('should delete the document if an error occurs when storing the metadata', async () => {
    MockDbCreateRecord.mockRejectedValueOnce(new Error());
    deleteDocumentMock.mockResolvedValueOnce();

    const issueService = new IssueService({
      ...invocationContext,
      userId,
      userAbn,
    } as RequestInvocationContext);

    await expect(
      issueService.storeMetadata(
        validGeneric.verifiableCredential as VerifiableCredential,
        storageId,
        decryptKey,
        docStorePath
      )
    ).rejects.toThrowError(
      'Failed to store the verifiable credentials metadata'
    );

    expect(deleteDocumentMock).toBeCalledTimes(1);
    expect(deleteDocumentMock).toBeCalledWith(storageId);
  });

  describe('OpenAttestation', () => {
    it('should fail if openAttestationMetadata is missing', async () => {
      const unsigned_no_openAttestationMetadata_OA_V3 = unsigned_OA_V3_base;
      delete unsigned_no_openAttestationMetadata_OA_V3[
        'openAttestationMetadata'
      ];

      const issueService = new IssueService(invocationContext);
      await expect(() =>
        issueService.issue(
          IssueCredentialRequestSigningMethodEnum.Oa,
          unsigned_no_openAttestationMetadata_OA_V3
        )
      ).rejects.toThrow('Failed to issue verifiable credential');
    });
  });

  describe('SVIP', () => {
    jest.setTimeout(20000);
    it('should fail if credential fails to validate', async () => {
      const unsigned_non_OA_V3 = unsigned_OA_V3_base;
      unsigned_non_OA_V3['type'] = ['VerifiableCredential'];

      const issueService = new IssueService(invocationContext);
      await expect(() =>
        issueService.issue(
          IssueCredentialRequestSigningMethodEnum.Svip,
          unsigned_non_OA_V3
        )
      ).rejects.toThrow('credential is not valid JSON-LD');
    });

    it('should issue a valid OA credential', async () => {
      uploadDocumentMock.mockResolvedValueOnce('');
      MockDbCreateRecord.mockResolvedValueOnce({});

      const issueService = new IssueService(invocationContext);
      const { verifiableCredential } = await issueService.issue(
        IssueCredentialRequestSigningMethodEnum.Svip,
        unsignedSvip as VerifiableCredential
      );

      expect(verifiableCredential.proof).toEqual(
        expect.objectContaining({
          type: 'Ed25519Signature2018',
          proofPurpose: 'assertionMethod',
        })
      );

      expect(verifiableCredential.credentialSubject).toEqual(
        expect.objectContaining(unsignedSvip.credentialSubject)
      );
      expect(verifiableCredential.proof).toHaveProperty('verificationMethod');
      expect(verifiableCredential.proof).toHaveProperty('created');
      expect(verifiableCredential.proof).toHaveProperty('jws');
    });
  });
});
