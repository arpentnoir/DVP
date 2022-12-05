import {
  VerifiableCredential,
  WrappedVerifiableCredential,
} from '@dvp/api-interfaces';
import { validateSchema, utils } from '@govtechsg/open-attestation';

export const isOpenAttestationType = (credential: VerifiableCredential) => {
  if (credential?.type?.includes('OpenAttestationCredential')) {
    return true;
  } else {
    return false;
  }
};

export const isVerifiableCredential = (
  document: WrappedVerifiableCredential
) => {
  if (isOpenAttestationType(document)) {
    return validateSchema(document) && utils.isWrappedV3Document(document);
  } else {
    // TODO: Implement check for non-OA credential
    return false;
  }
};
