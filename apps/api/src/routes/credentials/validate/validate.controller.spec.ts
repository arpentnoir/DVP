import { getMockReq, getMockRes } from '@jest-mock/express';
import validGenericData from '../../../fixtures/validateabledata/validGeneric.json';
import { validate } from './validate.controller';

const { res: responseMock, next: nextMock } = getMockRes({ send: jest.fn() });

describe('validation.controller', () => {
  const mockRequest = getMockReq({
    method: 'POST',
    headers: {
      'Correlation-ID': 'NUMPTYHEAD1',
    },
  });

  mockRequest.route = { path: '/validate' };

  it('should return valid for a valid Generic VC', () => {
    const requestMock = getMockReq({
      body: validGenericData,
      originalUrl: '/validate/',
    });

    validate(requestMock, responseMock, nextMock);
    expect(responseMock.json).toBeCalledWith({});
  });
});
