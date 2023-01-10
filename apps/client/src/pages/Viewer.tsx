import { PdfViewer, VerifyViewer } from '@dvp/vc-ui';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { BaseLayout } from '../layouts';

export const Viewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  useEffect(() => {
    // Redirect to home page if state is not available
    if (!state) {
      navigate(ROUTES.HOME);
    }
  }, []);

  return state ? (
    <BaseLayout title="VC Viewer">
      <Box position={'relative'} sx={{ '@media print': { paddingTop: 0 } }}>
        {state.viewer === 'PDF-VIEW' && state.document ? (
          <PdfViewer document={state.document} />
        ) : (
          <>
            <VerifyViewer
              document={state.document}
              results={{ ...state.results }}
              hideVerifyResults={state.hideVerifyResults}
            />
          </>
        )}
      </Box>
    </BaseLayout>
  ) : null;
};
