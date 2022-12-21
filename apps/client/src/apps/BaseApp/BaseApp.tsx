import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Container } from '@mui/material';
import { NavBar } from '../../components';
import { CreateFormPage, Home, Verify, Viewer, Issue } from '../../pages';
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
          <Container>
            <NavBar />
            <Routes>
              <Route
                path="/form"
                element={
                  <CreateFormPage
                    formTitle={'Create AANZFTA Certificate of Origin'}
                  />
                }
              />
              <Route path="/" element={<Home />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/viewer" element={<Viewer />} />
              <Route path="/issue" element={<Issue />} />

              {/* Additional routes for Internet and Internal Apps */}
              {children}
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
};
