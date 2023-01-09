import { CssBaseline, Stack, ThemeProvider } from '@mui/material';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppError, Footer, NavBar, NotFoundError } from '../../components';
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

interface IBaseApp {
  children?: React.ReactNode;
}

export const BaseApp: React.FC<IBaseApp> = ({ children }) => {
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
