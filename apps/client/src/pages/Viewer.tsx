import { Box } from '@mui/material';
import { IStatusCheck, VerifyViewer, VALID_CHECKS } from '@dvp/vc-ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ROUTES } from '../constants';
import { PdfViewer } from '@dvp/vc-ui';

export const Viewer = () => {
  const [checks, setChecks] = useState<IStatusCheck[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  useEffect(() => {
    // Redirect to home page if state is not available
    if (!state) {
      navigate(ROUTES.HOME);
    } else {
      if (!state.results.errors.length) {
        setChecks(VALID_CHECKS);
      }
    }
  }, []);

  return state ? (
    <Box
      paddingTop={6}
      position={'relative'}
      sx={{ '@media print': { paddingTop: 0 } }}
    >
      {state.viewer === 'PDF-VIEW' && state.document ? (
        <PdfViewer document={state.document} />
      ) : (
        <>
          <VerifyViewer
            document={state.document}
            results={{ ...state.results, checks }}
            hideVerifyResults={state.hideVerifyResults}
          />
        </>
      )}
    </Box>
  ) : null;
};
