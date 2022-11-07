import { Box } from '@mui/material';
import { Message } from '@dvp/api-interfaces';

export const FooBar = ({ message }: Message) => {
  return (
    <Box>
      <h1>{message}</h1>
    </Box>
  );
};
