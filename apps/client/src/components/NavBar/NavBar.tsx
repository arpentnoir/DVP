import { Button } from '@dvp/vc-ui';
import { AppBar, Box, Stack } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { Auth } from 'aws-amplify';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_ALT_TEXT, ROUTES } from '../../constants';
import { MenuBar } from '../Menu/Menu';

const LOGO_PATH = 'assets/logo.svg';

export const NavBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const menuBarRef = React.createRef<HTMLButtonElement>();

  const signOut = (event: React.MouseEvent) => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      await Auth.signOut();
    });
  };
  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{
        backgroundColor: 'white',
        height: { xs: '60px', sm: '80px' },
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
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ position: 'absolute', height: { xs: '60px', sm: '80px' } }}>
          <MenuBar ref={menuBarRef} />
        </Box>

        <Stack
          direction="row"
          sx={{
            height: '100%',
            width: ' 100%',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            backgroundColor: theme.palette.common.backgroundDark,
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            tabIndex={0}
            sx={{
              height: { xs: '44px', sm: '70px' },
              '&:hover': { cursor: 'pointer' },
            }}
            alt={LOGO_ALT_TEXT}
            src={LOGO_PATH}
            onClick={() => navigate(ROUTES.HOME)}
          />
        </Stack>
        <Box
          sx={{
            backgroundColor: theme.palette.common.backgroundDark,
            height: '100%',
            display: 'flex',
          }}
        >
          <Button
            sx={{ color: 'white' }}
            variant="text"
            label={'Logout'}
            onClick={signOut}
          />
        </Box>
      </Stack>
    </AppBar>
  );
};
