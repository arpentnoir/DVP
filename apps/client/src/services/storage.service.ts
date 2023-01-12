import { EncryptedDocument, VerifiableCredential } from '@dvp/api-interfaces';
import { decryptString } from '@govtechsg/oa-encryption';
import { axiosInstance } from './api.service';

import { FAIL_VC_FETCH_DECRYPT_ERR_MSG } from '../constants';

export const getVC = async (storageUrl: string) => {
  return axiosInstance.get<{ document: EncryptedDocument }>(storageUrl);
};

/**
 * 1. Extracts the VC storage endpoint and decryption key
 * 2. Fetches encrypted VC
 * 3. Decrypts VC
 * 4. Returns JSON parsed VC
 *
 * @param params the query string that contains payload for the vc storage endpoint and decryption key
 * @returns document
 */
export const fetchAndDecryptVC = async (params: string) => {
  try {
    const searchParams = new URLSearchParams(params);

    const anchorStr: string | null = searchParams.get('q');

    const anchor = anchorStr ? JSON.parse(anchorStr) : {};

    const storageUrl = anchor.payload.uri as string;

    const key = anchor.payload.key as string;

    const res = await getVC(storageUrl);

    const document = decryptString({ ...res.data.document, key });

    return JSON.parse(document) as VerifiableCredential;
  } catch (err) {
    throw new Error(FAIL_VC_FETCH_DECRYPT_ERR_MSG);
  }
};
