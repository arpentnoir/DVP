import { Text } from '@dvp/vc-ui';
import { Stack } from '@mui/material';

export const AppError = () => {
  return (
    <Stack
      sx={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <Stack spacing={2}>
        <Text variant="h6" fontWeight="bold">
          500
        </Text>
        <Text variant="h4">Something went wrong</Text>
        <Text>Please contact us for further information.</Text>
      </Stack>
    </Stack>
  );
};
