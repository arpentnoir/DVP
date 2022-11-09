import supertest from 'supertest';
import degree_vc from '../../fixtures/genericvc/degree_signed.json'; //Used in failing test
import broken_doc from '../../fixtures/oav3/broken.json';
import valid_OA_V3_doc from '../../fixtures/oav3/did-signed.json';

const API_ENDPOINT = 'http://localhost:3333/api'; //process.env.API_ENDPOINT;
const request = supertest(API_ENDPOINT);

describe('verify', () => {
  jest.setTimeout(20000);
  const endpoint = '/verify';
  it('should verify a valid OA document', async () => {
    await request
      .post(endpoint)
      .send({
        verifiableCredential: valid_OA_V3_doc,
      })
      .expect('Content-Type', /json/)
      .expect(200) //OK
      .expect((res) => {
        expect(res.body.data).toHaveProperty('checks');
        expect(res.body.data.checks).toContain('proof');
      });
  });
  //TODO: Implement non-OA backend
  it.skip('should verify valid non-OA document', async () => {
    await request
      .post(endpoint)
      .send({
        verifiableCredential: degree_vc,
      })
      .expect('Content-Type', /json/)
      .expect(200) //OK
      .expect((res) => {
        expect(res.body.data).toHaveProperty('checks');
        expect(res.body.data.checks).toContain('proof');
      });
  });
  it('should give BadRequest if given a non-valid VC', async () => {
    await request
      .post(endpoint)
      .send({
        verifiableCredential: broken_doc,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('errors');
        expect(res.body.data.errors).toContain('proof');
      });
  });
  it('should fail to validate a tampered vc', async () => {
    const invalid_OA_V3_doc = { ...valid_OA_V3_doc };
    invalid_OA_V3_doc.credentialSubject['thisFieldWasAltered'] = 'Yes';
    await request
      .post(endpoint)
      .send({
        verifiableCredential: invalid_OA_V3_doc,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('errors');
        expect(res.body.data.errors).toContain('proof');
      });
  });
});
