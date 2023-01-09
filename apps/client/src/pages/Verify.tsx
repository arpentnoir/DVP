import {
  VerifiableCredential,
  WrappedVerifiableCredential,
} from '@dvp/api-interfaces';
import { CertificateUpload, isVerifiableCredential, Text } from '@dvp/vc-ui';
import { Alert, Box, CircularProgress, Stack } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { BaseLayout } from '../layouts';
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
  const verifyRef = React.createRef<HTMLParagraphElement>();

  const setErrorMessage = (message: string) => {
    setUploadErrorMessage(message);
    /**
     * Accesibility: the upload error message needs to be read out
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
    return (
      <>
        {error && <ErrorMessage />}
        <CertificateUpload
          handleFiles={handleFiles}
          errorMessage={uploadErrorMessage}
          key={errorKeyId.toString()}
          acceptMessage={ACCEPT_MESSAGE}
        />
      </>
    );
  }, [error, uploadErrorMessage, errorKeyId]);

  return (
    <BaseLayout title="Verify a document">
      <Stack
        sx={{ display: 'flex', height: '100%' }}
        spacing={{ xs: '16px', md: 0 }}
      >
        <Box>
          <Text variant="h4" fontWeight="bold" paddingBottom="24px">
            Verify a document
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus
            nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum
            tellus elit sed risus. Maecenas eget condimentum velit, sit amet
            feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
            conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus
            enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
            Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
            lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
            elementum tellus.
          </Text>
        </Box>
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Stack
            height="100%"
            maxWidth="800px"
            justifyContent="center"
            margin="auto"
          >
            {loading ? (
              <Stack
                sx={{
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
                <Text
                  variant="h5"
                  paddingTop={3}
                  ref={verifyRef}
                  aria-label="Please wait while your document is being verified"
                >
                  Verifying Document <span aria-hidden>...</span>
                </Text>
              </Stack>
            ) : (
              displayResult
            )}
          </Stack>
        </Box>
      </Stack>
    </BaseLayout>
  );
};

const ErrorMessage = () => (
  <Stack alignItems="center" paddingY="16px">
    <Alert severity="error" tabIndex={0}>
      <Stack alignItems="center">
        <Text>There was an error verifying your document</Text>
        <Text variant="body1" fontWeight="bold" paddingTop="12px">
          Please rescan the QR and try again
        </Text>
      </Stack>
    </Alert>
  </Stack>
);
