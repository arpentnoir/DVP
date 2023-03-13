import request from 'supertest';
import { app } from '../../app';
import emptyStringGeneric from '../../fixtures/validateabledata/AANZFTA_COO-empty-strings.json';
import missingRequiredAANZFTA_COO from '../../fixtures/validateabledata/AANZFTA_COO-missing-required-fields.json';
import missingRequiredGeneric from '../../fixtures/validateabledata/generic-missing-required-fields.json';
import validAANZFTA_COO from '../../fixtures/validateabledata/validAANZFTA_COO.json';
import validGenericData from '../../fixtures/validateabledata/validGeneric.json';
import { ExpectedBody } from '../../routes/credentials/validate/validate.controller';
import { authTokenWithSubAndAbn } from '../utils';

describe('validate api', () => {
  const endpoint = '/v1/credentials/validate';

  describe('POST /v1/credentials/validate', () => {
    it('should pass validation if a valid generic vc is submited', async () => {
      await request(app)
        .post(endpoint)
        .set({ Authorization: authTokenWithSubAndAbn })
        .send(validGenericData as ExpectedBody)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({});
        });
    });
    it('should fail validation unknown schema type is passed', async () => {
      await request(app)
        .post(endpoint)
        .set({ Authorization: authTokenWithSubAndAbn })
        .send({
          verifiableCredential: validGenericData.verifiableCredential,
          schemaType: 'bobob',
        })
        .expect('Content-Type', /json/)
        .expect(422)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
        });
    });
    it('should pass validation if valid AANZFTA COO vc is submited', async () => {
      await request(app)
        .post(endpoint)
        .set({ Authorization: authTokenWithSubAndAbn })
        .send(validAANZFTA_COO as ExpectedBody)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({});
        });
    });
  });
  it('should fail validation if AANZFTA COO vc is missing required field', async () => {
    await request(app)
      .post(endpoint)
      .set({ Authorization: authTokenWithSubAndAbn })
      .send(missingRequiredAANZFTA_COO as ExpectedBody)
      .expect('Content-Type', /json/)
      .expect(422)
      .expect((res) => {
        expect(res.body).toHaveProperty('errors');
      });
  });
  it('should fail validation if Generic vc is missing required field', async () => {
    await request(app)
      .post(endpoint)
      .set({ Authorization: authTokenWithSubAndAbn })
      .send(missingRequiredGeneric as ExpectedBody)
      .expect('Content-Type', /json/)
      .expect(422)
      .expect((res) => {
        expect(res.body).toHaveProperty('errors');
      });
  });
  it('should fail validation if Generic vc has empty string as value', async () => {
    await request(app)
      .post(endpoint)
      .set({ Authorization: authTokenWithSubAndAbn })
      .send(emptyStringGeneric as ExpectedBody)
      .expect('Content-Type', /json/)
      .expect(422)
      .expect((res) => {
        expect(res.body).toHaveProperty('errors');
      });
  });
  it('should fail validation and return 400 if request body dose not containe a vc', async () => {
    await request(app)
      .post(endpoint)
      .set({ Authorization: authTokenWithSubAndAbn })
      .send({})
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('should return auth error if missing auth header', async () => {
    await request(app)
      .post(endpoint)
      .send(emptyStringGeneric as ExpectedBody)
      .expect('Content-Type', /json/)
      .expect(401)
      .expect((res) => {
        expect(res.body.errors[0].id).toContain('DVPAPI-003');
      });
  });
});
