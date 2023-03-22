import { useTheme } from '@mui/material';
import { render as TLRender } from '@testing-library/react';
import mediaQuery from 'css-mediaquery';
import { createMemoryHistory } from 'history';
import { Location, Navigator, Router } from 'react-router-dom';

export const render = (
  element: React.ReactNode,
  options?: {
    location?: Partial<Location> | string;
    navigator?: Navigator;
  }
) => {
  const defaultOptions = {
    location: '',
    navigator: createMemoryHistory(),
  };

  return TLRender(
    <Router {...defaultOptions} {...options}>
      {element}
    </Router>
  );
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
