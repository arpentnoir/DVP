import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { fetchAndDecryptVC } from '../services/storage';
import { verify } from '../services/vc';

export const Verify = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.search !== '') {
      setLoading(true);
      fetchAndDecryptVC(location.search)
        .then(verify)
        .then((result: any) => {
          navigate(ROUTES.VIEWER, {
            state: result,
          });
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    }
  }, []);

  const displayResult = useMemo(() => {
    return error ? <ErrorMessage /> : null;
  }, [error]);

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
