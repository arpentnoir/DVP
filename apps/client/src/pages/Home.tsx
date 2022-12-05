import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const goToVerify = () => {
    navigate('/verify');
  };

  return (
    <div>
      <Button variant="outlined" onClick={goToVerify}>
        Verify Documents
      </Button>
    </div>
  );
};
