import { Paper } from '@mui/material';
import { VerifyResults, RendererViewer, IStatusCheck } from '../';

export interface VerifyResult {
  checks: IStatusCheck[];
  warnings: string[];
  errors: string[];
  issuer?: string;
}

export interface IVerifyViewer {
  document: any;
  results: VerifyResult;
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

export const VerifyViewer = ({ document, results }: IVerifyViewer) => {
  return (
    <Paper
      sx={{
        padding: '22px',
        border: '1px solid #ebebeb',
        boxShadow: '0 2px 5px #00000012',
        borderRadius: '5px',
      }}
      elevation={0}
    >
      <VerifyResults {...results} />
      {!results.errors.length && <RendererViewer document={document} />}
    </Paper>
  );
};
