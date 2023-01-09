import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Stack } from '@mui/material';
import React from 'react';
import { Text } from '../Text';
import { Issuer, VerifyResult } from '../VerifyViewer';

export interface IVerificationResults {
  issuer: Issuer;
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
      <Text
        fontWeight={400}
        fontStyle="italic"
        fontSize="16px"
        lineHeight="24px"
        display="inline"
        paddingLeft="4px"
      >
        {text}
      </Text>
    </Box>
  );
};

export interface IValid {
  issuer?: Issuer;
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
        <Text
          color="white"
          fontWeight="bold"
          variant="h5"
          padding="8px 16px"
          aria-label="Document is valid"
        >
          Valid
        </Text>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing="16px">
        {issuer?.name && (
          <Box
            paddingTop={2}
            paddingBottom={2}
            sx={{
              maxWidth: { md: '360px' },
              marginRight: { md: '16px', lg: '88px' },
            }}
          >
            <Text
              fontWeight="bold"
              fontSize="24px"
              lineHeight="24px"
              marginBottom="8px"
              marginTop="8px"
              style={{ wordWrap: 'break-word' }}
            >
              Issued by: {issuer.name}
            </Text>
            {issuer?.id && (
              <Text
                fontWeight={500}
                fontSize="18px"
                lineHeight="18px"
                marginBottom="8px"
                marginTop="8px"
                style={{ wordWrap: 'break-word' }}
              >
                ({issuer.id})
              </Text>
            )}
          </Box>
        )}
        {checks.map((check) => (
          <Box
            alignItems="center"
            display="flex"
            key={check.text}
            data-testid={check.type}
          >
            <InfoOutlinedIcon color={check.valid ? 'success' : 'error'} />

            <Text
              fontWeight={400}
              fontStyle="italic"
              fontSize="16px"
              lineHeight="24px"
              display="inline"
              paddingLeft="4px"
            >
              {check.text}
            </Text>
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
        <Text
          color="white"
          fontWeight="bold"
          fontSize="24px"
          lineHeight="24px"
          padding="8px 16px"
        >
          Invalid
        </Text>
      </Box>
      <Box paddingTop={2} paddingBottom={2}>
        <Text
          fontWeight={500}
          fontSize="24px"
          lineHeight="24px"
          marginBottom="8px"
          marginTop="8px"
        >
          The document hasn't been verified yet, or some verification aspects
          are invalid or document has been tampered with
        </Text>
      </Box>
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
