import {
  VerifiableCredential,
  WrappedVerifiableCredential,
} from '@dvp/api-interfaces';
import { CertificateUpload, isVerifiableCredential } from '@dvp/vc-ui';
import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { fetchAndDecryptVC } from '../services/storage';
import { verify } from '../services/vc';

const ACCEPT_MESSAGE = 'Only JSON files with max size of 3 MB';
const MAX_FILE_SIZE = 3 * 1000 * 1000; // 3 Megabytes

export const Verify = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');
  const [errorKeyId, setErrorKeyId] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const setErrorMessage = (message: string) => {
    setUploadErrorMessage(message);
    /**
     * For accessible users, the upload error message needs to be read out
     * every time. As such, to force a re-render of the upload component
     * a random number is generated and assigned as the key.
     **/

    setErrorKeyId(Math.random().toString());
  };

  const handleFiles = (files: FileList) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setLoading(true);

        // Check that file is of JSON type
        const document = JSON.parse(
          reader.result as string
        ) as VerifiableCredential;

        // Check that file is a verifiable credential
        if (!isVerifiableCredential(document as WrappedVerifiableCredential)) {
          setErrorMessage('Must be a Verifiable Credential');
          setLoading(false);
          return;
        }

        const result = await verify(document);
        navigate(ROUTES.VIEWER, {
          state: result,
        });

        setLoading(false);
      } catch (err) {
        if (err instanceof SyntaxError) {
          setErrorMessage('Must be a JSON file');
        } else {
          setError(true);
        }

        setLoading(false);
      }
    };

    if (files[0].size > MAX_FILE_SIZE) {
      setErrorMessage('Max file size exceeded');
      return;
    }

    reader.readAsText(files[0] as Blob);
  };

  useEffect(() => {
    if (location.search !== '') {
      setLoading(true);
      fetchAndDecryptVC(location.search)
        .then(verify)
        .then((result) => {
          navigate(ROUTES.VIEWER, {
            state: result,
          });
        })
        .catch(() => {
          setLoading(false);
          setError(true);
        });
    }
  }, []);

  const displayResult = useMemo(() => {
    return error ? (
      <ErrorMessage />
    ) : (
      <CertificateUpload
        handleFiles={handleFiles}
        errorMessage={uploadErrorMessage}
        key={errorKeyId.toString()}
        acceptMessage={ACCEPT_MESSAGE}
      />
    );
  }, [error, uploadErrorMessage, errorKeyId]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        paddingTop: '100px',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {loading ? (
        <React.Fragment>
          <CircularProgress />
          <Typography fontSize={24} paddingTop={3} tabIndex={0}>
            Verifying Document <span aria-hidden="true">...</span>
          </Typography>
        </React.Fragment>
      ) : (
        displayResult
      )}
    </Box>
  );
};

const ErrorMessage = () => (
  <p tabIndex={0}>
    There was an error verifying your document. Please rescan the QR and try
    again
  </p>
);
