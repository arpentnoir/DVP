import { Message } from '@dvp/api-interfaces';
import { Container } from '@mui/material';
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
    fetch('/api')
      .then((r) => r.json())
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
