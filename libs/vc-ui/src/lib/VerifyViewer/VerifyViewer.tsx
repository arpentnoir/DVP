import {
  OAVerifiableCredential,
  VerifiableCredential,
} from '@dvp/api-interfaces';
import { Paper } from '@mui/material';
import { IStatusCheck, RendererViewer, VerifyResults } from '../';

export interface Issuer {
  id?: string;
  name?: string;
}

export interface VerifyResult {
  checks: IStatusCheck[];
  warnings: string[];
  errors: string[];
  issuer?: Issuer;
}

export interface IVerifyViewer {
  document: VerifiableCredential | OAVerifiableCredential;
  results: VerifyResult;
  hideVerifyResults?: boolean;
}

// TODO: Since we don't yet know how verify API will return valid checks,
// we'll hardcode the checks if verification is successful.
// i.e. if there are no errors then following three checks are valid. (OA model)
export const VALID_CHECKS: IStatusCheck[] = [
  {
    type: 'INTEGRITY',
    text: 'Document has not been tampered with',
    valid: true,
  },
  {
    type: 'STATUS',
    text: 'Document has not been revoked',
    valid: true,
  },
  {
    type: 'ISSUER',
    text: 'Document issuer has been identified',
    valid: true,
  },
];

export const VerifyViewer = ({
  document,
  results,
  hideVerifyResults,
}: IVerifyViewer) => {
  return (
    <Paper
      sx={{
        padding: { xs: '8px', md: '22px' },
      }}
    >
      {!hideVerifyResults && <VerifyResults {...results} />}
      {!results?.errors?.length && <RendererViewer document={document} />}
    </Paper>
  );
};
