import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const goToVerify = () => {
    navigate('/verify');
  };
  const goToIssue = () => {
    navigate('/issue');
  };

  return (
    <Box>
      <Button variant="outlined" onClick={goToIssue}>
        Issue Documents
      </Button>
      <Button variant="outlined" onClick={goToVerify}>
        Verify Documents
      </Button>
    </Box>
  );
};
