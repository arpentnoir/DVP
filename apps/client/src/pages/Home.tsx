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
      sx={{
        paddingX: 0,
        paddingY: 0,
        backgroundColor: theme.palette.common.backgroundBlue,
        display: 'flex',
        justifyContent: 'center',
        maxWidth: '100%',
      }}
    >
      <Grid container height={'100%'} maxWidth={'1140px'}>
        <Stack>
          <Stack
            direction={'row'}
            sx={{
              height: 'calc(50vw * 0.62)',
              minHeight: { xs: '370px', md: '410px' },
              maxHeight: '450px',
              width: '100%',
            }}
          >
            <Grid item xs={12} sm={6}>
              <Stack
                padding={{
                  xs: '60px 20px 0px 20px',
                  sm: '40px 30px',
                  md: '60px 0px 0px 30px',
                }}
              >
                <Box>
                  <Text variant="h1" fontWeight="bold" color="white">
                    DIGITAL VERIFICATION
                  </Text>
                  <Text variant="h1" fontWeight="bold" color="white">
                    PLATFORM
                  </Text>
                </Box>
                <Text color="white" paddingTop="12px">
                  Lorem ipsum dolar sit amet consectetur
                </Text>
                <Stack padding="8px 10px 0 0">
                  <ButtonBase onClick={() => navigate(ROUTES.VERIFY)}>
                    <Stack
                      width="100%"
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        borderBottom: '1px solid white',
                        padding: '16px 20px',
                      }}
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
                      sx={{
                        borderBottom: '1px solid white',
                        padding: '16px 20px',
                      }}
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
                position: 'absolute',
                width: '100%',
                right: 0,
                height: 'calc(50vw * 0.62)',
                minHeight: { xs: '370px', md: '410px' },
                maxHeight: '450px',
              }}
            >
              <Box
                sx={{
                  background: theme.palette.common.backgroundBlue,
                  position: 'relative',
                  top: '-100px',
                  left: '-120px',
                  width: '200px',
                  height: 'calc(100% + 300px)',
                  transform: 'rotate(-15deg)',
                }}
              />
            </Grid>
          </Stack>
          <Grid
            container
            spacing="30px"
            padding={{
              xs: '0px 40px 100px 40px',
              sm: '60px 40px',
            }}
          >
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
        </Stack>
      </Grid>
    </BaseLayout>
  );
};
