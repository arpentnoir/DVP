import request from 'supertest';
import { app } from '../../app';
import oa_doc_base from '../../fixtures/oav3/did.json';

let oa_doc;

describe('issue api', () => {
  const endpoint = '/api/issue';

  describe('POST /api/issue', () => {
    beforeEach(() => {
      oa_doc = JSON.parse(JSON.stringify(oa_doc_base));
    });

    it('should issue an OA verifiable credential', async () => {
      await request(app)
        .post(endpoint)
        .send({
          credential: oa_doc,
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('proof');
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
            ".body.credential: should have required property 'credential'"
          );
        });
    });

    it('should return error for non-OA document', async () => {
      oa_doc['type'] = ['VerifiableCredential'];

      await request(app)
        .post(endpoint)
        .send({
          credential: oa_doc,
        })
        .expect('Content-Type', /json/)
        .expect(500)
        .expect((res) => {
          expect(res.body.errors[0].detail).toStrictEqual(
            'An internal system error has occurred.'
          );
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
          expect(res.body.errors[0].detail).toStrictEqual(
            'An internal system error has occurred.'
          );
        });
    });
  });
});
