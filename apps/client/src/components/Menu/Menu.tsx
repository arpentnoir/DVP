import { Button, Text } from '@dvp/vc-ui';
import { Menu as MenuIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {
  Box,
  ButtonBase,
  Divider,
  Drawer,
  Stack,
  useTheme,
} from '@mui/material';
import { Container } from '@mui/system';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const MenuBar = React.forwardRef<HTMLButtonElement>((_props, ref) => {
  const [open, setOpen] = useState(false);

  const theme = useTheme();

  return (
    <React.Fragment>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.palette.common.backgroundBlue,
          height: '100%',
        }}
      >
        <Button
          data-testid="menu-button"
          ref={ref}
          sx={{
            height: '100%',
            padding: 2,
            color: 'white',
            boxShadow: 'none',
            backgroundColor: theme.palette.common.backgroundBlue,
            ':hover': {
              boxShadow: 'none',
              backgroundColor: theme.palette.common.tabBlueDark,
            },
          }}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-label="Menu"
          label="MENU"
          leftIcon={
            <MenuIcon
              sx={{
                fontSize: { xs: 30, sm: 40 },
              }}
            />
          }
          textProps={{
            sx: {
              display: { xs: 'none', sm: 'block' },
              fontSize: theme.typography.button.fontSize,
              fontFamily: theme.typography.button.fontFamily,
            },

            style: {
              marginLeft: '8px',
            },
          }}
        ></Button>
      </Stack>
      <MenuSide open={open} handleClose={() => setOpen(false)} />
    </React.Fragment>
  );
});

export const MenuSide = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const navigateTo = (path: string) => () => {
    handleClose();
    navigate(path);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          height: 'fit-content',
        },
      }}
    >
      <Container
        sx={{ width: { xs: '100vw', sm: '400px' } }}
        disableGutters
        aria-label="Side Menu"
      >
        <Stack direction="row">
          <ButtonBase
            sx={{
              color: theme.palette.common.backgroundDark,
              backgroundColor: theme.palette.common.featureGold,
              padding: '20px 24px',
              ':hover': {
                backgroundColor: theme.palette.common.featureGoldDark,
              },
            }}
            onClick={handleClose}
            tabIndex={1}
            aria-label="Close Menu"
          >
            <CloseIcon fontSize="large" />
            <Text
              paddingLeft="6px"
              fontSize={theme.typography.button.fontSize}
              fontFamily={theme.typography.button.fontFamily}
            >
              MENU
            </Text>
          </ButtonBase>
          <ButtonBase
            sx={{
              color: theme.palette.common.backgroundDark,
              backgroundColor: theme.palette.common.neutralGrey,
              padding: '20px 24px',
              flex: 1,
              ':hover': {
                backgroundColor: 'white',
              },
            }}
            onClick={() => window.open('https://homeaffairs.gov.au', '_blank')}
            tabIndex={1}
            aria-label="Close Menu"
          >
            <NavigateBeforeIcon fontSize="large" />
            <Text
              lineHeight="22px"
              paddingLeft="6px"
              textAlign="left"
              fontSize={theme.typography.button.fontSize}
              fontFamily={theme.typography.button.fontFamily}
            >
              HOME AFFAIRS PORTFOLIO
            </Text>
          </ButtonBase>
        </Stack>
        <Stack alignItems="flex-start">
          <MenuBarItem label={'Home'} handleClick={navigateTo('/')} />
          <MenuBarItem label={'Help'} handleClick={navigateTo('/')} />
          <MenuBarItem label={'Verify'} handleClick={navigateTo('/verify')} />
          <MenuBarItem
            label={'Documents'}
            handleClick={navigateTo('/documents')}
          />
          <MenuBarItem
            label={'Identities'}
            handleClick={navigateTo('/identities')}
          />
          <MenuBarItem label={'Issuers'} handleClick={navigateTo('/issuers')} />
          <MenuBarItem
            label={'Document schemas'}
            handleClick={navigateTo('/schemas')}
            showDivider={false}
          />
        </Stack>
      </Container>
    </Drawer>
  );
};

export const MenuBarItem = ({
  label,
  handleClick,
  showDivider = true,
}: {
  label: string;
  handleClick: () => void;
  showDivider?: boolean;
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      <ButtonBase
        data-testid={`menu-item:${label}`}
        sx={{
          color: theme.palette.common.backgroundBlue,
          '&:hover': {
            background: theme.palette.common.backgroundBlue,
            color: 'white',
            fontWeight: '600',
          },
          fontWeight: '500',
          fontSize: '20px',
          lineHeight: '30px',
          padding: '10px 26px',
          justifyContent: 'space-between',
          width: '100%',
          paddingX: '20px',
          height: '54px',
        }}
        onClick={handleClick}
        tabIndex={1}
      >
        <Text fontWeight="inherit" variant="body1">
          {label}
        </Text>
      </ButtonBase>
      {showDivider && <Divider />}
    </Box>
  );
};
