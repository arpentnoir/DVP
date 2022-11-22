import request from 'supertest';
import { app } from '../../app';
import degree_vc from '../../fixtures/genericvc/degree_signed.json'; //Used in failing test
import broken_doc from '../../fixtures/oav3/broken.json';
import valid_OA_V3_doc from '../../fixtures/oav3/did-signed.json';
import invalid_OA_V3_doc from '../../fixtures/oav3/did-invalid.json';

describe('verify api', () => {
  jest.setTimeout(20000);
  const endpoint = '/api/verify';

  describe('POST /api/verify', () => {
    it('should verify a valid OA document', async () => {
      await request(app)
        .post(endpoint)
        .send({
          verifiableCredential: valid_OA_V3_doc,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('checks');
          expect(res.body.checks).toContain('proof');
        });
    });
    it('should return bad request for non-OA document', async () => {
      await request(app)
        .post(endpoint)
        .send({
          verifiableCredential: degree_vc,
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
        });
    });
    it('should give BadRequest if given a non-valid VC', async () => {
      await request(app)
        .post(endpoint)
        .send({
          verifiableCredential: invalid_OA_V3_doc,
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body.checks).toContain('proof');
          expect(res.body.errors).toContain('proof');
        });
    });

    it('should give BadRequest if given a non compliant VC', async () => {
      await request(app)
        .post(endpoint)
        .send({
          verifiableCredential: broken_doc,
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body.errors[0].detail).toStrictEqual(
            ".body.verifiableCredential.credentialSubject: should have required property 'credentialSubject'"
          );
        });
    });
    it('should fail to validate a tampered vc', async () => {
      const invalid_OA_V3_doc = { ...valid_OA_V3_doc };
      invalid_OA_V3_doc.credentialSubject['thisFieldWasAltered'] = 'Yes';
      await request(app)
        .post(endpoint)
        .send({
          verifiableCredential: invalid_OA_V3_doc,
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(res.body.checks).toContain('proof');
        });
    });
  });
});
