import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import { VerifiableCredential } from '@dvp/api-interfaces';
import { RequestInvocationContext } from '@dvp/server-common';
import { getMockReq } from '@jest-mock/express';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import unsignedSvip from '../../../fixtures/genericvc/degree_unsigned.json';
import unsignedOAV3 from '../../../fixtures/oav3/did.json';
import validAANZFTA_COO from '../../../fixtures/validateabledata/validAANZFTA_COO.json';

import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { authTokenWithSubAndAbn } from '../../../tests/utils';
import { storageClient } from '../../storage/storage.service';
import { IssueService } from './issue.service';

let unsigned_OA_V3_base: VerifiableCredential;
const dynamodbMock = mockClient(DynamoDBClient);
const s3Mock = mockClient(S3Client);

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
    header: jest.fn().mockImplementation(() => authTokenWithSubAndAbn),
  });

  mockRequest.route = { path: '/issue' };
  const invocationContext = new RequestInvocationContext(mockRequest);

  beforeEach(() => {
    unsigned_OA_V3_base = JSON.parse(JSON.stringify(unsignedOAV3));
    dynamodbMock.reset();
    s3Mock.reset();
  });

  it('should issue a valid OA credential', async () => {
    s3Mock.on(HeadObjectCommand).rejects({});
    s3Mock.on(PutObjectCommand).resolvesOnce({});
    dynamodbMock.on(PutItemCommand).resolvesOnce({});

    const issueService = new IssueService(invocationContext);
    const { verifiableCredential } = await issueService.baseIssue(
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
    dynamodbMock.on(PutItemCommand).resolves({});

    const partialCoo = {
      ...validAANZFTA_COO.verifiableCredential,
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

    await issueService.storeMetadata({
      credential: partialCoo as VerifiableCredential,
      documentId: storageId,
      decryptionKey: decryptKey,
      documentStorePath: docStorePath,
    });

    expect(dynamodbMock).toHaveReceivedNthCommandWith(1, PutItemCommand, {
      Item: expect.objectContaining({
        id: { S: storageId },
        createdBy: { S: userId },
        abn: { S: userAbn },
        s3Path: { S: docStorePath + storageId },
        decryptionKey: { S: decryptKey },
        isRevoked: { BOOL: false },
        documentNumber: { S: '0003625' },
        freeTradeAgreement: { S: 'AANZFTA' },
        importingJurisdiction: { S: 'Indonesia' },
        exporterOrManufacturerAbn: { S: '55004094599' },
        importerName: { S: 'ABC Imports' },
        consignmentReferenceNumber: { S: '15688545563' },
        documentDeclaration: { BOOL: true },
      }),
    });
  });

  it('should store the correct metadata for a full coo', async () => {
    dynamodbMock.on(PutItemCommand).resolves({});

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

    await issueService.storeMetadata({
      credential: fullCoo as VerifiableCredential,
      documentId: storageId,
      decryptionKey: decryptKey,
      documentStorePath: docStorePath,
    });

    expect(dynamodbMock).toHaveReceivedNthCommandWith(1, PutItemCommand, {
      Item: expect.objectContaining({
        id: { S: storageId },
        createdBy: { S: userId },
        abn: { S: userAbn },
        s3Path: { S: docStorePath + storageId },
        decryptionKey: { S: decryptKey },
        isRevoked: { BOOL: false },
        documentNumber: { S: '000253' },
        importingJurisdiction: { S: 'Singapore' },
        exporterOrManufacturerAbn: { S: '95307094535' },
        importerName: { S: 'East meets west fine wines' },
        consignmentReferenceNumber: { S: 'dbschenker.com:hawb:DBS626578' },
      }),
    });
  });

  it('should remove undefined values and store the correct metadata for a non CoO VC', async () => {
    dynamodbMock.on(PutItemCommand).resolves({});

    const issueService = new IssueService({
      ...invocationContext,
      userId,
      userAbn,
    } as RequestInvocationContext);

    await issueService.storeMetadata({
      credential: {
        ...validAANZFTA_COO.verifiableCredential,
        credentialSubject: {},
      } as VerifiableCredential,
      documentId: storageId,
      decryptionKey: decryptKey,
      documentStorePath: docStorePath,
    });

    expect(dynamodbMock).toHaveReceivedNthCommandWith(1, PutItemCommand, {
      Item: expect.objectContaining({
        id: { S: storageId },
        createdBy: { S: userId },
        abn: { S: userAbn },
        s3Path: { S: docStorePath + storageId },
        decryptionKey: { S: decryptKey },
        isRevoked: { BOOL: false },
      }),
    });
  });

  it('should throw an error if an unexpected error occurs when storing the metadata', async () => {
    dynamodbMock.on(PutItemCommand).rejectsOnce({});

    const issueService = new IssueService({
      ...invocationContext,
      userId,
      userAbn,
    } as RequestInvocationContext);

    await expect(
      issueService.storeMetadata({
        credential:
          validAANZFTA_COO.verifiableCredential as VerifiableCredential,
        documentId: storageId,
        decryptionKey: decryptKey,
        documentStorePath: docStorePath,
      })
    ).rejects.toThrowError(
      'Failed to store the verifiable credentials metadata'
    );
  });

  it('should delete the document if an error occurs when storing the metadata', async () => {
    dynamodbMock.on(PutItemCommand).rejectsOnce({});
    s3Mock.on(DeleteObjectCommand).resolvesOnce({});

    const issueService = new IssueService({
      ...invocationContext,
      userId,
      userAbn,
    } as RequestInvocationContext);

    await expect(
      issueService.storeMetadata({
        credential:
          validAANZFTA_COO.verifiableCredential as VerifiableCredential,
        documentId: storageId,
        decryptionKey: decryptKey,
        documentStorePath: docStorePath,
      })
    ).rejects.toThrowError(
      'Failed to store the verifiable credentials metadata'
    );

    expect(s3Mock).toHaveReceivedNthCommandWith(1, DeleteObjectCommand, {
      Bucket: process.env.DOCUMENT_STORAGE_BUCKET_NAME,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      Key: `${storageClient.getBasePath()}${storageId}`,
    });
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
      dynamodbMock.on(GetItemCommand).resolvesOnce({
        Item: {
          counter: { N: '1' },
          listCounter: { N: '1' },
          bitStringLength: { N: '8' },
        },
      });

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

    it('should issue a valid SVIP credential', async () => {
      s3Mock.on(HeadObjectCommand).rejects({});
      dynamodbMock.on(GetItemCommand).resolves({
        Item: {
          counter: { N: '1' },
          listCounter: { N: '1' },
          bitStringLength: { S: '8' },
        },
      });
      dynamodbMock.on(PutItemCommand).resolvesOnce({});
      dynamodbMock.on(UpdateItemCommand).resolves({
        Attributes: {
          counter: { N: '1' },
          listCounter: { N: '1' },
        },
      });

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
    }, 25000);
  });
});
