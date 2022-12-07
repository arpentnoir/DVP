import axios, { AxiosError } from "axios";
import { API_ENDPOINTS, FAIL_CREATE_VC, GENERIC_COO_META_DATA } from "../constants";


export const CreateVC = async (credentialSubject: any) =>{
  try {
    const response = await axios.post(API_ENDPOINTS.ISSUE, {
      credential: {
        credentialSubject: credentialSubject,
        ...GENERIC_COO_META_DATA,
        issuanceDate: new Date().toISOString(),
      },
    });

    return response;
} catch (err: unknown | AxiosError) {
  throw new Error(FAIL_CREATE_VC);
}
};
