import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { VerifyResult } from '../VerifyViewer';

export interface IVerificationResults {
  issuer: string;
  result: IStatusCheck[];
}

export interface IStatusCheck {
  type: string;
  text: string;
  valid: boolean;
}

export const StatusCheck = ({ text, valid }: IStatusCheck) => {
  return (
    <Box alignItems="center" display="flex">
      valid <InfoOutlinedIcon color={valid ? 'success' : 'error'} />
      <Typography
        fontWeight={400}
        fontStyle="italic"
        fontSize="16px"
        lineHeight="24px"
        display="inline"
        paddingLeft="4px"
      >
        {text}
      </Typography>
    </Box>
  );
};

export interface IValid {
  issuer?: string;
  checks: IStatusCheck[];
}

export const Valid = ({ issuer, checks }: IValid) => {
  return (
    <React.Fragment>
      <Box
        bgcolor="#28a745"
        borderRadius="3px"
        display="inline-flex"
        data-testid="valid-box"
      >
        <Typography
          tabIndex={0}
          color="white"
          fontWeight="bold"
          fontSize="24px"
          lineHeight="24px"
          padding="6px 10px"
        >
          Valid
        </Typography>
      </Box>
      {issuer && (
        <Typography
          tabIndex={0}
          fontWeight={500}
          fontSize="24px"
          lineHeight="24px"
          marginBottom="8px"
          marginTop="8px"
          style={{ wordWrap: 'break-word' }}
        >
          Issued by: {issuer}
        </Typography>
      )}
      <Stack spacing="4px">
        {checks.map((check) => (
          <Box
            alignItems="center"
            display="flex"
            key={check.text}
            data-testid={check.type}
          >
            <InfoOutlinedIcon color={check.valid ? 'success' : 'error'} />

            <Typography
              tabIndex={0}
              fontWeight={400}
              fontStyle="italic"
              fontSize="16px"
              lineHeight="24px"
              display="inline"
              paddingLeft="4px"
            >
              {check.text}
            </Typography>
          </Box>
        ))}
      </Stack>
    </React.Fragment>
  );
};

// Currently we display a generic error if verification fails
export const Invalid = () => {
  return (
    <React.Fragment>
      <Box bgcolor="#dc3545" borderRadius="3px" display="inline-flex">
        <Typography
          color="white"
          fontWeight="bold"
          fontSize="24px"
          lineHeight="24px"
          padding="6px 10px"
        >
          Invalid
        </Typography>
      </Box>
      <Typography
        fontWeight={500}
        fontSize="24px"
        lineHeight="24px"
        marginBottom="8px"
        marginTop="8px"
      >
        The document hasn't been verified yet, or some verification aspects are
        invalid or document has been tampered with
      </Typography>
    </React.Fragment>
  );
};

export const VerifyResults = ({ issuer, checks, errors }: VerifyResult) => {
  return errors.length ? (
    <Invalid />
  ) : (
    <Valid issuer={issuer} checks={checks} />
  );
};
