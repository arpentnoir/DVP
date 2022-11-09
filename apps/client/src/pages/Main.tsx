import { Message } from '@dvp/api-interfaces';
import { Container } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Verify } from './Verify';
import { Viewer } from './Viewer';

const Home = ({ message }: { message: Message }) => (
  <div tabIndex={0}>{message.message}</div>
);

export const Main = () => {
  const [message, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    axios
      .get('/api')
      .then((r) => r.data)
      .then(setMessage);
  }, []);

  return (
    <Container>
      <Routes>
        <Route path="/" element={<Home message={message} />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </Container>
  );
};
