import request from 'supertest';
import { app } from '../../app';
import validNonOAVC from '../../fixtures/genericvc/degree_signed.json';
import broken_doc from '../../fixtures/oav3/broken.json';
import invalidOAV3 from '../../fixtures/oav3/did-invalid.json';
import validOAV3 from '../../fixtures/oav3/did-signed.json';

describe('verify api', () => {
  jest.setTimeout(20000);
  const endpoint = '/api/credentials/verify';

  describe('POST /api/credentials/verify', () => {
    it('should verify a valid OA document', async () => {
      await request(app)
        .post(endpoint)
        .send({
          verifiableCredential: validOAV3,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('checks');
          expect(res.body.checks).toContain('proof');
        });
    });

    it('should verify a valid non OA document', async () => {
      await request(app)
        .post(endpoint)
        .send({
          verifiableCredential: validNonOAVC,
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty('checks');
          expect(res.body.checks).toContain('proof');
        });
    });

    it('should give BadRequest if given a non-valid VC', async () => {
      await request(app)
        .post(endpoint)
        .send({
          verifiableCredential: invalidOAV3,
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
            "/body/verifiableCredential/credentialSubject: must have required property 'credentialSubject'"
          );
        });
    });
    it('should fail to validate a tampered vc', async () => {
      const invalidOAV3 = { ...validOAV3 };
      invalidOAV3.credentialSubject['thisFieldWasAltered'] = 'Yes';
      await request(app)
        .post(endpoint)
        .send({
          verifiableCredential: invalidOAV3,
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
