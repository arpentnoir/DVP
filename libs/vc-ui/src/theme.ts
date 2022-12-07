import {createTheme } from "@mui/material/styles";


//fixes issue with some header spacing and form section spacing
export const jsonFormTheme = createTheme({
  components:{
    MuiAccordionDetails: {
      styleOverrides:{
        root:{
          padding:"8px 10px 10px 10px"
        },
      },
    },
    MuiFormLabel:{
      styleOverrides:{
        root:{
          '@media (min-width:600px)': {
            paddingLeft:'0.5em',
          },
        },
      },
    },
    MuiFormControl:{
      styleOverrides:{
        root:{
          marginTop:'0.5em',
          width: '100% !important',
          '@media (min-width:600px)': {
            paddingRight:'0.5em',
            paddingLeft:'0.5em',
          },
        },
      },

    },
    MuiPaper:{
      styleOverrides:{
        root:{
          marginTop:'1.5em'
        },
      }
    }
  }
});
jsonFormTheme.typography.h6 = {
  marginBottom: '0.5rem',
  marginTop:'1em',
  //defaults
  fontSize: '1.25rem',
  fontFamily: "Roboto,Helvetica, Arial,sans-serif",
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: '0.0075em'
};
