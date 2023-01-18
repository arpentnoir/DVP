import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { CssBaseline, Stack, ThemeProvider } from '@mui/material';
import { Amplify } from 'aws-amplify';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppError, Footer, NavBar, NotFoundError } from '../../components';
import { getAwsCognitoConfig, getEnvConfig } from '../../config';
import {
  CreateFormPage,
  Documents,
  Home,
  Identities,
  Issue,
  Issuers,
  IssuerSchemas,
  Schema,
  Schemas,
  Verify,
  Viewer,
} from '../../pages';
import { theme } from '../../theme';

const envConfig = getEnvConfig();

Amplify.configure(getAwsCognitoConfig());

interface IBaseApp {
  children?: React.ReactNode;
}

export const BaseAppWithoutAuth: React.FC<IBaseApp> = ({ children }) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Router>
          <Stack sx={{ height: '100%' }}>
            <NavBar />
            <ErrorBoundary FallbackComponent={AppError}>
              <Routes>
                <Route
                  path="/form"
                  element={
                    <CreateFormPage
                      title={'ASEAN–Australia–New Zealand Free Trade Agreement'}
                      subTitle={'Certificate of Origin'}
                    />
                  }
                />
                <Route path="/" element={<Home />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/identities" element={<Identities />} />
                <Route path="/issuers" element={<Issuers />} />
                <Route
                  path="/issuers/:issuerName"
                  element={<IssuerSchemas />}
                />
                <Route path="/schemas" element={<Schemas />} />
                <Route path="/schemas/:schemaName" element={<Schema />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/viewer" element={<Viewer />} />
                <Route path="/issue" element={<Issue />} />
                <Route path="*" element={<NotFoundError />} />

                {/* Additional routes for Internet and Internal Apps */}
                {children}
              </Routes>
            </ErrorBoundary>
            <Footer />
          </Stack>
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
};

export const BaseApp = withAuthenticator(BaseAppWithoutAuth, {
  hideSignUp: envConfig.DISABLE_SIGNUP,
});
