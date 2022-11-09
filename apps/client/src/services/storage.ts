import axios from 'axios';
import { decryptString } from '@govtechsg/oa-encryption';
import { FAIL_VC_FETCH_DECRYPT_ERR_MSG } from '../constants';

export const getVC = async (storageUrl: string) => {
  return axios.get(storageUrl);
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

    const anchorStr: any = searchParams.get('q');

    const anchor = anchorStr ? JSON.parse(anchorStr) : {};

    const storageUrl = anchor.payload.uri;

    const key = anchor.payload.key;

    const res = await getVC(storageUrl);

    const document = decryptString({ ...res.data.document, key });

    return JSON.parse(document);
  } catch (err) {
    throw new Error(FAIL_VC_FETCH_DECRYPT_ERR_MSG);
  }
};
