import { EncryptCommand, KMSClient } from '@aws-sdk/client-kms';
import { ListKeyPairResponse } from '@dvp/api-client';
import { getEpochTimeStamp } from '@dvp/server-common';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import request from 'supertest';
import { app } from '../../app';
import { models } from '../../db';
import { authTokenWithSubAndAbn } from '../utils';
import keypairsList from './../../fixtures/keypairs/keypairs.json';

jest.mock('../../db', () => {
  return {
    models: {
      KeyPair: {
        find: jest.fn(),
        create: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
      },
    },
  };
});
const kmsMock = mockClient(KMSClient);

const keypairs: ListKeyPairResponse = {
  results: keypairsList,
};

describe('keypairs api', () => {
  const endpoint = '/v1/keypairs';

  beforeEach(() => {
    jest.resetAllMocks();
    kmsMock.reset();
  });

  describe('[POST] /v1/keypairs', () => {
    it('should create a keypair', async () => {
      const debRes = keypairs.results;
      (models.KeyPair.find as jest.Mock).mockResolvedValueOnce(debRes);
      kmsMock.on(EncryptCommand).resolvesOnce({
        CiphertextBlob: new Uint8Array([1, 2, 3, 4]),
      });

      await request(app)
        .post(endpoint)
        .set({ Authorization: authTokenWithSubAndAbn })
        .send({
          name: 'test',
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            name: 'test',
          });
          expect(models.KeyPair.create).toBeCalledWith(
            expect.objectContaining({
              abn: '00000000000',
              createdBy: '1234567890',
              encryptedPrivateKey: new Uint8Array([1, 2, 3, 4]),
              keyId: res.body.keyId,
              kmsId: 'fake kms id',
              name: 'test',
              publicKey: expect.stringContaining('crv'),
            })
          );
        });
    });
  });
  describe('[GET] /v1/keypairs', () => {
    it('should list keypairs', async () => {
      const debRes = keypairs.results;
      (models.KeyPair.find as jest.Mock).mockResolvedValueOnce(
        debRes?.map((res) => ({ ...res, created: res.issueDate }))
      );
      await request(app)
        .get(endpoint)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.results).toEqual(
            expect.arrayContaining(keypairs.results)
          );
          expect(models.KeyPair.find).toBeCalledWith(
            {
              pk: 'Abn#00000000000',
              sk: { begins: 'KeyPair#' },
            },
            {
              fields: ['keyId', 'name', 'created'],
              where: '(${deleted} = {false}) and (${disabled} = {false})',
            }
          );
        });
    });

    it('should include disabled keypairs', async () => {
      const debRes = keypairs.results;
      (models.KeyPair.find as jest.Mock).mockResolvedValueOnce(
        debRes?.map((res) => ({ ...res, created: res.issueDate }))
      );
      await request(app)
        .get(endpoint)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .query({
          includeDisabled: true,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.results).toEqual(
            expect.arrayContaining(keypairs.results)
          );
          expect(models.KeyPair.find).toBeCalledWith(
            {
              pk: 'Abn#00000000000',
              sk: { begins: 'KeyPair#' },
            },
            {
              fields: ['keyId', 'name', 'created'],
              where: '${deleted} = {false}',
            }
          );
        });
    });
  });

  describe('[GET] /v1/keypairs/:keyId', () => {
    it('should get keypair', async () => {
      const debRes = keypairs.results[0];
      (models.KeyPair.get as jest.Mock).mockResolvedValueOnce({
        ...debRes,
        created: debRes.issueDate,
      });
      const keyId = keypairs.results[0].keyId;
      await request(app)
        .get(`${endpoint}/${keyId}`)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(keypairs.results[0]);
          expect(models.KeyPair.get).toBeCalledWith(
            {
              abn: '00000000000',
              keyId,
            },
            {
              fields: ['keyId', 'name', 'publicKey', 'disabled', 'created'],
              where: '${deleted} = {false}',
            }
          );
        });
    });

    it(`should return 404 if keypair doesn't exist`, async () => {
      (models.KeyPair.get as jest.Mock).mockResolvedValueOnce(null);
      const keyId = keypairs.results[0].keyId;
      await request(app)
        .get(`${endpoint}/${keyId}`)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(404)
        .expect((res) => {
          expect(res.body).toMatchObject({
            errors: [
              {
                code: 'NotFound',
                detail: `Could not find [${keyId}].`,
                helpText:
                  'The specified resource could not be found.  Please check that your security credentials are correct, and that you are attempting to access the correct resource.',
                helpUrl: 'https://www.abf.gov.au/help-and-support/contact-us',
                id: 'DVPAPI-004',
              },
            ],
          });
          expect(models.KeyPair.get).toBeCalledWith(
            {
              abn: '00000000000',
              keyId,
            },
            {
              fields: ['keyId', 'name', 'publicKey', 'disabled', 'created'],
              where: '${deleted} = {false}',
            }
          );
        });
    });
  });

  describe('[PUT] /v1/keypairs/:keyId/disable', () => {
    it('should disable a keypair', async () => {
      const debRes = keypairs.results[0];
      (models.KeyPair.get as jest.Mock).mockResolvedValueOnce(debRes);
      const keyId = debRes.keyId;

      await request(app)
        .put(`${endpoint}/${keyId}/disable`)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect(200)
        .expect(() => {
          expect(models.KeyPair.update).toBeCalledWith(
            expect.objectContaining({
              abn: '00000000000',
              keyId: keyId,
              updatedBy: '1234567890',
              disabled: true,
            })
          );
        });
    });

    it(`should return 404 if keypair doesn't exist`, (done) => {
      (models.KeyPair.get as jest.Mock).mockResolvedValueOnce(null);

      void request(app)
        .put(`${endpoint}/test_key/disable`)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect(404)
        .expect((res) => {
          expect(models.KeyPair.update).not.toHaveBeenCalled();
          expect(res.body.errors?.[0]?.code).toEqual('NotFound');
        })
        .end(done);
    });
  });

  describe('[DELETE] /v1/keypairs/:keyId', () => {
    it('should delete a keypair', async () => {
      const debRes = keypairs.results[0];
      (models.KeyPair.get as jest.Mock).mockResolvedValueOnce({
        ...debRes,
        disabled: true,
      });
      const keyId = debRes.keyId;

      await request(app)
        .delete(`${endpoint}/${keyId}`)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect(200)
        .expect(() => {
          expect(models.KeyPair.update).toBeCalledWith(
            expect.objectContaining({
              abn: '00000000000',
              keyId: keyId,
              deleted: true,
              ttl: getEpochTimeStamp(),
            })
          );
        });
    });

    it(`should return 404 if keypair doesn't exist`, async () => {
      (models.KeyPair.get as jest.Mock).mockResolvedValueOnce(null);
      const keyId = keypairs.results[0].keyId;

      await request(app)
        .delete(`${endpoint}/${keyId}`)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect(404)
        .expect((res) => {
          expect(models.KeyPair.remove).not.toHaveBeenCalled();
          expect(res.body.errors?.[0]?.code).toEqual('NotFound');
        });
    });
  });
});
