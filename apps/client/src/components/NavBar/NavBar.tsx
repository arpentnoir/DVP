import { Authenticator } from '@aws-amplify/ui-react';
import { Button } from '@dvp/vc-ui';
import { AppBar, Box, Stack } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { Auth, Hub } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnvConfig } from '../../config';
import { LOGO_ALT_TEXT, ROUTES } from '../../constants';
import { MenuBar } from '../Menu/Menu';
const LOGO_PATH = 'assets/logo.svg';

const envConfig = getEnvConfig();

export const NavBar = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const menuBarRef = React.createRef<HTMLButtonElement>();

  useEffect(() => {
    //Listen for changes to auth
    const authChangeListener = Hub.listen(
      'auth',
      (data: { payload: { event: any } }) => {
        switch (data.payload.event) {
          case 'signIn':
            setIsAuthed(true);
            setShowLoginScreen(false);
            break;
          case 'signOut':
            setIsAuthed(false);
            break;
        }
      }
    );

    //check auth status on load
    Auth.currentAuthenticatedUser()
      .then((user) => {
        if (user) setIsAuthed(true);
      })
      .catch(() => setIsAuthed(false));

    return () => {
      authChangeListener();
    };
  }, []);

  const signOut = (event: React.MouseEvent) => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      await Auth.signOut();
    });
  };

  const login = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowLoginScreen(true);
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
      {showLoginScreen && (
        <Authenticator
          variation="modal"
          hideSignUp={envConfig.DISABLE_SIGNUP}
        />
      )}
      <Stack
        direction="row"
        sx={{
          height: '100%',
          width: ' 100%',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ position: 'absolute', height: { xs: '60px', sm: '80px' } }}>
          {isAuthed && <MenuBar ref={menuBarRef} />}
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
            position: 'absolute',
            right: 0,
            height: { xs: '60px', sm: '80px' },
            backgroundColor: theme.palette.common.backgroundDark,
            display: 'flex',
          }}
        >
          <Button
            variant="text"
            label={isAuthed ? 'logout' : 'login'}
            onClick={isAuthed ? signOut : login}
            sx={{
              color: 'white',
              boxShadow: 'none',
              backgroundColor: theme.palette.common.backgroundDark,
              ':hover': {
                boxShadow: 'none',
                backgroundColor: theme.palette.common.tabBlueDark,
              },
            }}
            textProps={{
              color: 'white',
              textTransform: 'uppercase',
              fontSize: { xs: '12px', sm: theme.typography.button.fontSize },
              fontFamily: theme.typography.button.fontFamily,
            }}
          />
        </Box>
      </Stack>
    </AppBar>
  );
};
