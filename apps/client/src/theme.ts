import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#014c7e',
      dark: '#061b36',
      contrastText: '#003a63',
    },
    success: {
      main: '#28a745',
    },
  },
});

//fixes issue with some header spacing and form section spacing
export const jsonFormTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          marginTop: '1.5em',
        },
      },
    },
  },
});
jsonFormTheme.typography.h6 = {
  margin: '0.5rem',
  marginTop: '1em',
  //defaults
  fontSize: '1.25rem',
  fontFamily: 'Roboto,Helvetica, Arial,sans-serif',
  fontWeight: 500,
  lineHeight: 1.6,
  letterSpacing: '0.0075em',
};
