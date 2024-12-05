import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2A9D8F',
      light: '#4DB6AC',
      dark: '#1F7A6E',
    },
    secondary: {
      main: '#264653',
      light: '#37647A',
      dark: '#1A2F38',
    },
    background: {
      default: '#F7FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#4A5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 600,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '2.2rem',
      fontWeight: 600,
      letterSpacing: '0em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.00938em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
}); 