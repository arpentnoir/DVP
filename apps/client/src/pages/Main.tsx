import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import { Verify } from './Verify';
import { Viewer } from './Viewer';

export const Main = () => {
  return (
    <Container>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </Container>
  );
};
