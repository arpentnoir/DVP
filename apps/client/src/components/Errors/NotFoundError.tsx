import { Text } from '@dvp/vc-ui';
import { Stack } from '@mui/material';

export const NotFoundError = () => {
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
          404
        </Text>
        <Text variant="h4">PAGE NOT FOUND</Text>
        <Text>If you entered a web address please check it was correct.</Text>
      </Stack>
    </Stack>
  );
};
