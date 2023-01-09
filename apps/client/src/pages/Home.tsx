import { Card, Text } from '@dvp/vc-ui';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, ButtonBase, Grid, Stack, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { BaseLayout } from '../layouts';

// TODO: Replace with real data
const actions = [
  {
    name: 'Lorem',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  {
    name: 'Ipsum',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  {
    name: 'Dolor',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  {
    name: 'Amet',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
];

export const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <BaseLayout
      title="Digital Verification Platform"
      maxWidth={false}
      sx={{
        paddingX: 0,
        paddingY: 0,
        backgroundColor: theme.palette.common.backgroundBlue,
      }}
    >
      <Grid container height="100%" width="100%">
        <Grid item xs={12} sm={6}>
          <Stack padding={{ xs: '60px 30px', md: '60px' }}>
            <Box>
              <Text variant="h4" fontWeight="bold" color="white">
                DIGITAL VERIFICATION
              </Text>
              <Text variant="h5" fontWeight="bold" color="white">
                PLATFORM
              </Text>
            </Box>
            <Text color="white" paddingTop="12px">
              Lorem ipsum dolar sit amet consectetur
            </Text>
            <Stack paddingTop="8px">
              <ButtonBase onClick={() => navigate(ROUTES.VERIFY)}>
                <Stack
                  width="100%"
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ borderBottom: '1px solid white', padding: '16px 20px' }}
                >
                  <Text color="white" fontWeight="bold" variant="body1">
                    Verify a document
                  </Text>
                  <NavigateNextIcon
                    sx={{ color: theme.palette.common.featureGold }}
                  />
                </Stack>
              </ButtonBase>
              <ButtonBase>
                <Stack
                  width="100%"
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ borderBottom: '1px solid white', padding: '16px 20px' }}
                >
                  <Text color="white" fontWeight="bold" variant="body1">
                    Help and support
                  </Text>
                  <NavigateNextIcon
                    sx={{ color: theme.palette.common.featureGold }}
                  />
                </Stack>
              </ButtonBase>
            </Stack>
          </Stack>
        </Grid>
        <Grid
          item
          sm={6}
          sx={{
            display: {
              xs: 'none',
              sm: 'block',
              background: 'url("assets/home-background.jpg")',
              backgroundPosition: 'bottom right',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              overflow: 'hidden',
            },
          }}
        >
          <Box
            sx={{
              background: theme.palette.common.backgroundBlue,
              position: 'relative',
              top: '-100px',
              left: '-140px',
              width: '200px',
              height: 'calc(100% + 300px)',
              transform: 'rotate(-15deg)',
            }}
          />
        </Grid>
        <Grid container spacing="30px" padding="40px">
          {actions.map((action) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={action.name}>
              <Card
                sx={{ flex: 1, padding: '16px' }}
                name={action.name}
                text={action.text}
                handleAction={() => null}
                actionLabel="Action"
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </BaseLayout>
  );
};
