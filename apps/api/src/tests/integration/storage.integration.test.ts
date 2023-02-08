import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { VerificationResult } from '@dvp/api-interfaces';
import { getUuId, NotFoundError } from '@dvp/server-common';
import { generateEncryptionKey } from '@govtechsg/oa-encryption';
import { mockClient } from 'aws-sdk-client-mock';
import request from 'supertest';

import { app } from '../../app';

const s3Mock = mockClient(S3Client);

export const thatIsRetrievedDocument = {
  document: expect.objectContaining({
    cipherText: expect.any(String),
    iv: expect.any(String),
    tag: expect.any(String),
  }),
};

const storagePath = '/api/storage/documents';

const authTokenWithSubAndAbn =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYWJuIjoiMDAwMDAwMDAwMDAifQ.mYt_zdD9hjCC0267io5tyeTx0r6Xrh4B6JRVLqHkY5A';

const handleResponse = async (res: request.Response) =>
  Promise.resolve(JSON.parse(res.text) as VerificationResult);

const get = async (uri: string) => {
  return request(app).get(uri).then(handleResponse);
};

const testEncryptedDocument = {
  cipherText: 'testCipherText',
  iv: 'testIv',
  tag: 'testTag',
  type: 'testType',
};

describe('storage api', () => {
  beforeEach(() => {
    s3Mock.reset();
  });
  describe('GET /api/storage/documents/:id', () => {
    it("should return error when you try to get a document that doesn't exist", async () => {
      s3Mock
        .on(GetObjectCommand)
        .rejectsOnce(new Error('The specified key does not exist.'));

      const documentId = getUuId();
      const response = await get(`${storagePath}/${documentId}`);

      const err = new NotFoundError(`${storagePath}/${documentId}`);
      expect(response).toEqual(err.toApiError());
    });

    it('should return a document if it exists', async () => {
      // Need to implement store functionality

      s3Mock.on(GetObjectCommand).resolves({
        Body: {
          transformToString: async () =>
            Promise.resolve(
              JSON.stringify({ document: testEncryptedDocument })
            ),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      });
      const getResponse = await get(
        `${storagePath}/2f89937d-fe20-44a3-aad1-0c287a7ea970`
      );

      expect(getResponse).toMatchObject({ document: testEncryptedDocument });
    });
  });
  describe('POST storage/documents', () => {
    it('should encrypt and upload the documents', async () => {
      s3Mock.on(PutObjectCommand).resolvesOnce({});
      s3Mock.on(HeadObjectCommand).rejectsOnce({});

      await request(app)
        .post(storagePath)
        .set({ Authorization: authTokenWithSubAndAbn })
        .send({
          document: 'document contents',
          encryptionKey: generateEncryptionKey(),
          documentId: getUuId(),
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('documentId');
          expect(res.body).toHaveProperty('encryptionKey');
        });
    });

    it('should return error if document already exists', async () => {
      s3Mock.on(PutObjectCommand).resolvesOnce({});
      s3Mock.on(HeadObjectCommand).resolvesOnce({});

      const encryptionKey = generateEncryptionKey();
      await request(app)
        .post(storagePath)
        .set({ Authorization: authTokenWithSubAndAbn })
        .send({
          document: 'document contents',
          encryptionKey,
          documentId: getUuId(),
        })
        .expect(422);
    });

    it('should return system error if document is failed to upload', async () => {
      s3Mock.on(HeadObjectCommand).rejectsOnce({});
      s3Mock.on(PutObjectCommand).rejectsOnce('upload failed');

      const encryptionKey = generateEncryptionKey();

      await request(app)
        .post(storagePath)
        .set({ Authorization: authTokenWithSubAndAbn })
        .send({
          document: 'document contents',
          encryptionKey,
          documentId: getUuId(),
        })
        .expect(500);
    });

    it('should return auth error if missing auth header', async () => {
      await request(app)
        .post(storagePath)
        .send({
          document: 'document contents',
        })
        .expect('Content-Type', /json/)
        .expect(500)
        .expect((res) => {
          expect(res.body.errors[0].id).toContain('DVPAPI-003');
        });
    });
  });
});
