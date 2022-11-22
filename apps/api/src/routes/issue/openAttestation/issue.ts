import {
  IssuerFunction,
  IssueResult,
  VerifiableCredential,
  WrappedVerifiableCredential,
} from '@dvp/api-interfaces';
import {
  signDocument,
  SUPPORTED_SIGNING_ALGORITHM,
  __unsafe__use__it__at__your__own__risks__wrapDocument as wrapDocumentV3,
} from '@govtechsg/open-attestation';

const oASign = async (
  wrappedDocument: WrappedVerifiableCredential,
  issuerKeyId: string,
  signingKey: string
): Promise<IssueResult> => {
  const signedDocument = await signDocument(
    wrappedDocument,
    SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
    {
      public: issuerKeyId, // this will become the verificationMethod in the signed document.
      private: signingKey,
    }
  );

  return signedDocument as IssueResult;
};

export const issue: IssuerFunction = async (
  credential: VerifiableCredential,
  verificationMethod: string,
  signingKey: string
): Promise<IssueResult> => {
  const wrappedDocument = await wrapDocumentV3(credential);
  return oASign(wrappedDocument, verificationMethod, signingKey);
};
