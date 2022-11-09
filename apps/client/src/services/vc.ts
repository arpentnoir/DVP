import axios from 'axios';
import { Document } from '@dvp/api-interfaces';
import { API_ENDPOINTS } from '../constants';

export const _getIssuer = (document: Document) => document?.issuer?.id ?? '';

// TODO: Refactor and write tests once verify endpoint response format is confirmed
export const verify = async (document: Document) => {
  const res = await axios.post(API_ENDPOINTS.VERIFY, {
    verifiableCredential: document,
  });
  return { document, results: { ...res.data, issuer: _getIssuer(document) } };
};
