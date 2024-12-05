import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64FFDA',
      light: '#95FFF1',
      dark: '#00B686',
      contrastText: '#0A192F',
    },
    secondary: {
      main: '#7B89F4',
      light: '#A5B4FF',
      dark: '#5A6AD4',
      contrastText: '#0A192F',
    },
    background: {
      default: '#0A192F',
      paper: 'rgba(17, 34, 64, 0.95)',
    },
    text: {
      primary: '#E6F1FF',
      secondary: '#A8B2D1',
    },
    divider: 'rgba(100, 255, 218, 0.15)',
    error: {
      main: '#FF6B6B',
      light: '#FF8A8A',
      dark: '#FF4C4C',
    },
    warning: {
      main: '#FFB86C',
      light: '#FFD7A8',
      dark: '#FF9830',
    },
    success: {
      main: '#64FFDA',
      light: '#95FFF1',
      dark: '#00B686',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Inter", "Roboto", sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      color: '#E6F1FF',
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#E6F1FF',
    },
    h3: {
      fontSize: '2.2rem',
      fontWeight: 600,
      letterSpacing: '0em',
      color: '#E6F1FF',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.01em',
      color: '#A8B2D1',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#0A192F',
          backgroundImage: 'radial-gradient(at 50% 0%, rgba(100, 255, 218, 0.15) 0%, rgba(10, 25, 47, 0) 75%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '1rem',
          backdropFilter: 'blur(8px)',
        },
        contained: {
          background: 'linear-gradient(135deg, rgba(100, 255, 218, 0.9), rgba(123, 137, 244, 0.9))',
          color: '#0A192F',
          fontWeight: 600,
          border: '1px solid rgba(100, 255, 218, 0.3)',
          boxShadow: '0 4px 20px 0 rgba(100, 255, 218, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(100, 255, 218, 1), rgba(123, 137, 244, 1))',
            boxShadow: '0 4px 20px 0 rgba(100, 255, 218, 0.35)',
          },
        },
        outlined: {
          borderColor: 'rgba(100, 255, 218, 0.5)',
          color: '#64FFDA',
          '&:hover': {
            borderColor: '#64FFDA',
            background: 'rgba(100, 255, 218, 0.1)',
          },
        },
        text: {
          color: '#E6F1FF',
          '&:hover': {
            background: 'rgba(230, 241, 255, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(17, 34, 64, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(100, 255, 218, 0.15)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 25, 47, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(100, 255, 218, 0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            color: '#E6F1FF',
            '& fieldset': {
              borderColor: 'rgba(100, 255, 218, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(100, 255, 218, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#64FFDA',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#A8B2D1',
            '&.Mui-focused': {
              color: '#64FFDA',
            },
          },
          '& .MuiInputBase-input': {
            '&::placeholder': {
              color: '#8892B0',
              opacity: 1,
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17, 34, 64, 0.95)',
          border: '1px solid',
        },
        standardError: {
          borderColor: 'rgba(255, 107, 107, 0.3)',
          color: '#FF6B6B',
        },
        standardSuccess: {
          borderColor: 'rgba(100, 255, 218, 0.3)',
          color: '#64FFDA',
        },
        standardWarning: {
          borderColor: 'rgba(255, 184, 108, 0.3)',
          color: '#FFB86C',
        },
        standardInfo: {
          borderColor: 'rgba(123, 137, 244, 0.3)',
          color: '#7B89F4',
        },
      },
    },
  },
}); 