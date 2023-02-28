import { createTheme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    backgroundDark: string;
    backgroundBlue: string;
    featureGold: string;
    featureGoldDark: string;
    neutralGrey: string;
    tabBlueDark: string;
    textDark: string;
  }
}

export const theme = responsiveFontSizes(
  createTheme({
    typography: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: 15,

      button: {
        color: '#0C1B2E',
        fontFamily: 'Roboto Condensed, sans-serif',
        fontSize: 18.5,
      },
      h1: {
        color: '#0C1B2E',
        fontFamily: 'Roboto Condensed, sans-serif',
        fontSize: 40,
        fontWeight: 700,
      },
      h2: {
        color: '#0C1B2E',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 28,
        fontWeight: 700,
      },
      h3: {
        color: '#0C1B2E',
        fontFamily: 'Roboto Condensed, sans-serif',
        fontSize: 20,
        fontWeight: 700,
      },
      h4: {
        color: '#0C1B2E',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 16,
        fontWeight: 700,
      },
      h5: { color: '#0C1B2E', fontFamily: 'Roboto Condensed, sans-serif' },
      h6: { color: '#0C1B2E', fontFamily: 'Roboto Condensed, sans-serif' },
    },
    palette: {
      primary: {
        light: '#ff0000',
        main: '#014c7e',
        dark: '#061b36',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#014c7e',
      },
      success: {
        main: '#28a745',
      },
      error: {
        main: '#AD1A1F',
      },

      common: {
        backgroundDark: '#0C1B2E',
        backgroundBlue: '#072243',
        featureGold: '#FFC900',
        featureGoldDark: '#e6b500',
        neutralGrey: '#F2F2F2',
        tabBlueDark: '#092e5a',
        textDark: '#0c1b2e',
      },
    },
    components: {
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
      },
    },
  })
);
