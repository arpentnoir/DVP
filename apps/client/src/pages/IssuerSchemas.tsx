import { Card, Text } from '@dvp/vc-ui';
import { Box, Stack, Switch } from '@mui/material';
import { useParams } from 'react-router-dom';
import { BaseLayout } from '../layouts';

// TODO: Replace with real data
const schemas = [
  {
    name: 'Schema 1',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  {
    name: 'Schema 2',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  {
    name: 'Schema 3',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
];

export const IssuerSchemas = () => {
  const { issuerName } = useParams();

  return (
    <BaseLayout title="Issuer Schemas">
      <Box paddingBottom="40px">
        <Text variant="h4" fontWeight="bold">
          {issuerName}
        </Text>
      </Box>

      <Box>
        <Text variant="body1" fontWeight="bold">
          Document schemas
        </Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing="8px"
          paddingTop="40px"
        >
          {schemas.map((schema) => (
            <Card
              key={schema.name}
              name={schema.name}
              text={schema.text}
              headerAction={<Switch />}
            />
          ))}
        </Stack>
      </Box>
    </BaseLayout>
  );
};
