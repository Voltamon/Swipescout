// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB',
    },
    secondary: {
      main: '#F59E0B',
    },
    background: {
      light: '#F9FAFB',
      default: '#FFFFFF',
    },
    text: {
      dark: '#1F2937',
      light: '#6B7280',
    },
    status: {
      open: {
        background: '#D1FAE5',
        text: '#065F46',
      },
      closed: {
        background: '#FEE2E2',
        text: '#991B1B',
      },
      filled: {
        background: '#DBEAFE',
        text: '#1E40AF',
      },
      interview: {
        background: '#FEF3C7',
        text: '#92400E',
      },
      hired: {
        background: '#D1FAE5',
        text: '#065F46',
      },
    },
  },
  shadows: {
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});


const theme2 = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});



export default theme2;