import request from 'supertest';
import { app } from '../../app';

export const thatIsRetrievedDocument = {
  document: expect.objectContaining({
    cipherText: expect.any(String),
    iv: expect.any(String),
    tag: expect.any(String),
  }),
};

const storagePath = '/api/storage/documents';

const handleResponse = async (res: request.Response) => {
  return JSON.parse(res.text);
};

const get = async (uri: string) => {
  return request(app).get(uri).then(handleResponse);
};

describe('GET storage/documents/:id - get specific document', () => {
  it("should return error when you try to get a document that doesn't exist", async () => {
    const getResponse = await get(`${storagePath}/badUUID`);

    expect(getResponse).toStrictEqual({
      errors: [
        {
          id: getResponse.errors[0].id,
          code: 'DVPAPI-002',
          detail: `Cannot find resource \`${storagePath}/badUUID\``,
          source: {
            location: 'ID',
            parameter: 'badUUID',
          },
        },
      ],
    });
  });

  it.skip('should return a document if it exists', async () => {
    // Need to implement store functionality
    const getResponse = await get(
      `${storagePath}/2f89937d-fe20-44a3-aad1-0c287a7ea970`
    );

    expect(getResponse).toMatchObject(thatIsRetrievedDocument);
  });
});
