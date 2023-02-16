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

import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import { mockClient } from 'aws-sdk-client-mock';
import request from 'supertest';
import { app } from '../../app';
import unsignedSvip from '../../fixtures/genericvc/degree_unsigned.json';
import oa_doc_base from '../../fixtures/oav3/did.json';
import validAANZFTA_COO from '../../fixtures/validateabledata/validAANZFTA_COO.json';
import {
  authTokenWithoutAbn,
  authTokenWithoutSub,
  authTokenWithSubAndAbn,
} from './utils';

let oa_doc;

const s3Mock = mockClient(S3Client);

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

describe('issue api', () => {
  jest.setTimeout(20000);
  const endpoint = '/api/credentials/issue';

  beforeEach(() => {
    s3Mock.reset();
    MockDbCreateRecord.mockReset();
  });

  describe('POST /api/credentials/issue', () => {
    beforeEach(() => {
      oa_doc = JSON.parse(JSON.stringify(oa_doc_base));
    });

    it('should issue an OA verifiable credential', async () => {
      s3Mock.on(PutObjectCommand).resolvesOnce({});
      s3Mock.on(HeadObjectCommand).rejectsOnce({});
      MockDbCreateRecord.mockResolvedValueOnce({});

      await request(app)
        .post(endpoint)
        .send({
          credential: oa_doc,
        })
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(201)
        .expect((res) => {
          expect(res.body.verifiableCredential).toHaveProperty('proof');
          expect(res);
        });
    });

    it('should return bad request for non VC compliant document', async () => {
      await request(app)
        .post(endpoint)
        .send({
          test: 'test',
        })
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body.errors[0].detail).toStrictEqual(
            "/body/credential: must have required property 'credential'"
          );
        });
    });

    it('should issue a non-OA verifiable credential', async () => {
      s3Mock.on(PutObjectCommand).resolvesOnce({});
      s3Mock.on(HeadObjectCommand).rejectsOnce({});
      MockDbCreateRecord.mockResolvedValueOnce({});
      await request(app)
        .post(endpoint)
        .send({
          credential: unsignedSvip,
          signingMethod: IssueCredentialRequestSigningMethodEnum.Svip,
        })
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(201)
        .expect((res) => {
          expect(res.body.verifiableCredential).toHaveProperty('proof');
          expect(res);
        });
    });

    it('should return error if a property of credentialSubject is not defined in context', async () => {
      await request(app)
        .post(endpoint)
        .send({
          credential: { ...oa_doc, credentialSubject: { test: 'test' } },
        })
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(500)
        .expect((res) => {
          expect(res.body.errors[0].detail).toContain(
            'An internal system error has occurred.'
          );
        });
    });

    // TODO: Currently every VC issued is also stored
    describe('issue and store', () => {
      it('should issue an OA verifiable credential with QRUrl and return documentId and key', async () => {
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        MockDbCreateRecord.mockResolvedValueOnce({});

        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
          })
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((res) => {
            expect(
              res.body.verifiableCredential.credentialSubject.links.self.href
            ).toBeDefined();
            expect(res.body.encryptionKey).toBeDefined();
            expect(res.body.documentId).toBeDefined();
          });
      });

      it('should return error if failed to store VC', async () => {
        s3Mock.on(HeadObjectCommand).resolvesOnce({});
        MockDbCreateRecord.mockResolvedValueOnce({});

        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
          })
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect('Content-Type', /json/)
          .expect(422)
          .expect((res) => {
            expect(res.body.errors[0].id).toContain('DVPAPI-002');
          });
      });

      it('should save the partial CoO metadata to the database', async () => {
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        MockDbCreateRecord.mockResolvedValueOnce({});

        await request(app)
          .post(endpoint)
          .set({ Authorization: authTokenWithSubAndAbn })
          .send({
            credential: partialCoo,
          })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((res) => {
            expect(MockDbCreateRecord).toBeCalledTimes(1);
            expect(MockDbCreateRecord).toBeCalledWith({
              id: res.body.documentId,
              createdBy: '1234567890',
              abn: '00000000000',
              s3Path: `documents/${res.body.documentId as string}`,
              decryptionKey: `${res.body.encryptionKey as string}`,
              documentNumber: '0003625',
              freeTradeAgreement: 'AANZFTA',
              importingJurisdiction: 'Indonesia',
              exporterOrManufacturerAbn: '55004094599',
              importerName: 'ABC Imports',
              consignmentReferenceNumber: '15688545563',
              documentDeclaration: true,
              issueDate: partialCoo.issuanceDate,
            });
            expect(
              res.body.verifiableCredential.credentialSubject.links.self.href
            ).toBeDefined();
            expect(res.body.encryptionKey).toBeDefined();
            expect(res.body.documentId).toBeDefined();
          });
      });

      it('should save the full CoO metadata to the database', async () => {
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        MockDbCreateRecord.mockResolvedValueOnce({});

        await request(app)
          .post(endpoint)
          .send({
            credential: fullCoo,
          })
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((res) => {
            expect(MockDbCreateRecord).toBeCalledTimes(1);
            expect(MockDbCreateRecord).toBeCalledWith({
              id: res.body.documentId,
              createdBy: '1234567890',
              abn: '00000000000',
              s3Path: `documents/${res.body.documentId as string}`,
              decryptionKey: `${res.body.encryptionKey as string}`,
              documentNumber: '000253',
              importingJurisdiction: 'Singapore',
              exporterOrManufacturerAbn: '95307094535',
              importerName: 'East meets west fine wines',
              consignmentReferenceNumber: 'dbschenker.com:hawb:DBS626578',
              issueDate: fullCoo.issuanceDate,
            });
            expect(
              res.body.verifiableCredential.credentialSubject.links.self.href
            ).toBeDefined();
            expect(res.body.encryptionKey).toBeDefined();
            expect(res.body.documentId).toBeDefined();
          });
      });

      it('should save the generic vc metadata to the database', async () => {
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        MockDbCreateRecord.mockResolvedValueOnce({});

        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
          })
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((res) => {
            expect(MockDbCreateRecord).toBeCalledTimes(1);
            expect(MockDbCreateRecord).toBeCalledWith({
              id: res.body.documentId,
              createdBy: '1234567890',
              abn: '00000000000',
              s3Path: `documents/${res.body.documentId as string}`,
              decryptionKey: `${res.body.encryptionKey as string}`,
              issueDate: oa_doc.issuanceDate,
            });
            expect(
              res.body.verifiableCredential.credentialSubject.links.self.href
            ).toBeDefined();
            expect(res.body.encryptionKey).toBeDefined();
            expect(res.body.documentId).toBeDefined();
          });
      });

      it('should use the default abn if an abn is not supplied in the access token payload', async () => {
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        MockDbCreateRecord.mockResolvedValueOnce({});

        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
          })
          .set({ Authorization: authTokenWithoutAbn })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((res) => {
            expect(MockDbCreateRecord).toBeCalledTimes(1);
            expect(MockDbCreateRecord).toBeCalledWith({
              id: res.body.documentId,
              createdBy: '1234567890',
              abn: '41161080146',
              s3Path: `documents/${res.body.documentId as string}`,
              decryptionKey: `${res.body.encryptionKey as string}`,
              issueDate: oa_doc.issuanceDate,
            });
            expect(
              res.body.verifiableCredential.credentialSubject.links.self.href
            ).toBeDefined();
            expect(res.body.encryptionKey).toBeDefined();
            expect(res.body.documentId).toBeDefined();
          });
      });

      it('should delete the stored vc and return an error if it fails to store the metadata to the database', async () => {
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(DeleteObjectCommand).resolvesOnce({});
        MockDbCreateRecord.mockRejectedValueOnce(new Error());

        await request(app)
          .post(endpoint)
          .set('Authorization', authTokenWithSubAndAbn)
          .send({
            credential: oa_doc,
          })
          .expect('Content-Type', /json/)
          .expect(500)
          .expect((res) => {
            expect(MockDbCreateRecord.mock.lastCall[0]).toHaveProperty('id');
            expect(MockDbCreateRecord.mock.lastCall[0]).toHaveProperty(
              'createdBy'
            );
            expect(MockDbCreateRecord.mock.lastCall[0]).toHaveProperty('abn');
            expect(MockDbCreateRecord.mock.lastCall[0]).toHaveProperty(
              's3Path'
            );
            expect(MockDbCreateRecord.mock.lastCall[0]).toHaveProperty(
              'decryptionKey'
            );
            expect(res.body.errors[0].detail).toContain(
              'An internal system error has occurred.'
            );
          });
      });

      it('should return an error if authorization header is missing', async () => {
        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
          })
          .expect('Content-Type', /json/)
          .expect(500)
          .expect((res) => {
            expect(res.body.errors[0].id).toContain('DVPAPI-003');
          });
      });

      it('should return an error if sub id is missing from the access token payload', async () => {
        await request(app)
          .post(endpoint)
          .set('Authorization', authTokenWithoutSub)
          .send({
            credential: oa_doc,
          })
          .expect('Content-Type', /json/)
          .expect(500)
          .expect((res) => {
            expect(res.body.errors[0].id).toContain('DVPAPI-003');
          });
      });
    });
  });
});
