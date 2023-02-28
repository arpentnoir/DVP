import { capitaliseFirstLetter, constructPath } from '@dvp/vc-ui';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Breadcrumbs as MuiBreadcrumbs, Link } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { FunctionComponent } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export const Breadcrumbs: FunctionComponent = () => {
  const { pathname } = useLocation();
  const theme = useTheme();

  const routes = pathname.split('/').filter(Boolean);
  return (
    <>
      {routes.length > 0 && (
        <div role="presentation">
          <MuiBreadcrumbs
            aria-label="breadcrumb"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              height: '42px',
              background: theme.palette.common.neutralGrey,
              fontSize: '15px',
              'li:nth-last-child(2)': { transform: 'rotate(45deg)' },
              '@media print': { display: 'none' },
            }}
            separator={
              <Box
                data-testid="breadcrumbs-separator"
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '1px',
                }}
              >
                <ArrowForwardIcon
                  sx={{ fontSize: '14px', color: theme.palette.error.main }}
                />
              </Box>
            }
          >
            <Link
              component={RouterLink}
              underline="hover"
              color={theme.palette.common.textDark}
              to={'/'}
            >
              Home
            </Link>
            {[...routes, ''].map((route, index) => {
              if (index !== routes.length - 1) {
                return (
                  <Link
                    component={RouterLink}
                    key={route}
                    underline="hover"
                    color={theme.palette.common.textDark}
                    to={constructPath(routes.slice(0, index + 1))}
                    tabIndex={0}
                  >
                    {capitaliseFirstLetter(route).replace(/-/g, ' ')}
                  </Link>
                );
              }
              return;
            })}
          </MuiBreadcrumbs>
        </div>
      )}
    </>
  );
};
