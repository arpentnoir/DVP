import { AppBar, Box, Divider, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import useTheme from '@mui/material/styles/useTheme';
import Logo from '../../assets/header_logo.svg';
import { APP_NAME, LOGO_ALT_TEXT } from '../../constants';

export const NavBar = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        height: '90px',
        justifyContent: 'center',
        alignItems: 'center',
        '@media print': { display: 'none' },
      }}
    >
      <Stack
        direction="row"
        sx={{
          height: '100%',
          width: ' 100%',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          backgroundColor: grey[100],
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          tabIndex={0}
          sx={{
            maxHeight: { xs: 49, sm: 61 },
          }}
          alt={LOGO_ALT_TEXT}
          src={Logo as string}
        />

        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Divider
            sx={{
              height: '30px',
              margin: '0 25px',
              borderColor: theme.palette.primary.main,
            }}
            orientation="vertical"
          />

          {/* App Name */}
          <Typography
            tabIndex={0}
            variant="h6"
            component="div"
            fontSize={17}
            fontWeight="bold"
            color={theme.palette.primary.contrastText}
          >
            {APP_NAME}
          </Typography>
        </Box>
      </Stack>
    </AppBar>
  );
};
