import {
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

let oa_doc;

const s3Mock = mockClient(S3Client);

describe('issue api', () => {
  jest.setTimeout(20000);
  const endpoint = '/api/issue';

  beforeEach(() => {
    s3Mock.reset();
  });

  describe('POST /api/issue', () => {
    beforeEach(() => {
      oa_doc = JSON.parse(JSON.stringify(oa_doc_base));
    });

    it('should issue an OA verifiable credential', async () => {
      s3Mock.on(PutObjectCommand).resolvesOnce({});
      s3Mock.on(HeadObjectCommand).rejectsOnce({});

      await request(app)
        .post(endpoint)
        .send({
          credential: oa_doc,
        })
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
      await request(app)
        .post(endpoint)
        .send({
          credential: unsignedSvip,
          signingMethod: IssueCredentialRequestSigningMethodEnum.Svip,
        })
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

        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
          })
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

        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
          })
          .expect('Content-Type', /json/)
          .expect(422)
          .expect((res) => {
            expect(res.body.errors[0].id).toContain('DVPAPI-002');
          });
      });
    });
  });
});
