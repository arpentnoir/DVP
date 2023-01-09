import { Card, Text } from '@dvp/vc-ui';
import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

export const Schemas = () => {
  const navigate = useNavigate();

  const handleAction = (name: string) => () => {
    navigate(`/schemas/${name}`);
  };

  return (
    <BaseLayout title="Schemas">
      <Box paddingBottom="40px">
        <Text variant="h4" fontWeight="bold" paddingBottom="24px">
          Schemas
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
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
          paddingY="40px"
        >
          {schemas.map((schema) => (
            <Card
              key={schema.name}
              name={schema.name}
              text={schema.text}
              handleAction={handleAction(schema.name)}
              actionLabel="Settings"
            />
          ))}
        </Stack>
      </Box>
    </BaseLayout>
  );
};
