import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NavBar } from '../components';
import { Main } from '../pages';
import { theme } from '../theme';

export const App = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Router>
          <NavBar />
          <Main />
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
