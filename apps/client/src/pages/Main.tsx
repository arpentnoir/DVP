import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { CreateFormPage } from './CreateForm/CreateFormPage';
import { Home } from './Home';
import { Verify } from './Verify';
import { Viewer } from './Viewer';

export const Main = () => {
  return (
    <Container>
      <Routes>
        <Route path="/form" element={<CreateFormPage formTitle={'Create AANZFTA Certificate of Origin'}  />} />
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </Container>
  );
};
