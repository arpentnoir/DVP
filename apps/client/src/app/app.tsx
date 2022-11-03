import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Message } from '@dvp/api-interfaces';
import { NavBar } from '../components';
import { theme } from '../theme';

const Home = ({ message }: { message: Message }) => (
  <div tabIndex={0}>{message.message}</div>
);

export const App = () => {
  const [message, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home message={message} />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
