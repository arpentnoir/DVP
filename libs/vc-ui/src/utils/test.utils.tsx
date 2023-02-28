import { render as TLRender } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import mediaQuery from 'css-mediaquery';
import { useTheme } from '@mui/material';

export const render = (element: React.ReactNode) => {
  return TLRender(<Router>{element}</Router>);
};

export const setScreenSize =
  (breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => (query: string) => {
    const theme = useTheme();
    return {
      matches: mediaQuery.match(query, {
        width: theme.breakpoints.values[breakpoint],
      }),
      addListener: () => {
        return;
      },
      removeListener: () => {
        return;
      },
    };
  };
