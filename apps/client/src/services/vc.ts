import axios from 'axios';
import { Document } from '@dvp/api-interfaces';

const VERIFY_ENDPOINT = '/api/verify';

export const _getIssuer = (document: Document) => document?.issuer?.id ?? '';

// TODO: Refactor and write tests once verify endpoint response format is confirmed
export const verify = async (document: Document) => {
  const res = await axios.post(VERIFY_ENDPOINT, {
    verifiableCredential: document,
  });
  return { document, results: { ...res.data, issuer: _getIssuer(document) } };
};
