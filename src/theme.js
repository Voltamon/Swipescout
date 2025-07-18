// theme.js
import { createTheme } from '@mui/material/styles';

const theme3 = createTheme({
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



import { blue, green, red, grey } from '@mui/material/colors';

const theme22 = createTheme({
  palette: {
    primary: {
      main: blue[500],
      light: blue[300],
      dark: blue[700],
    },
    secondary: {
      main: grey[600],
      light: grey[400],
      dark: grey[800],
    },
    success: {
      light: green[100],
      main: green[500],
      dark: green[700],
    },
    info: {
      light: blue[100],
      main: blue[300],
      dark: blue[500],
    },
    background: {
      default: grey[100],
      paper: '#fff',
    },
    text: {
      primary: grey[900],
      secondary: grey[500],
    },
  },
  // ... other theme configurations (typography, etc.)
});

const theme2 = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      contrastText: '#ffffff', // Text color when on primary background
    },
    secondary: {
      main: '#dc004e',
    },
    text: { // Correct property name (not 'textw')
      primary: '#2a3e50',    // Darker blue-gray
      secondary: '#4a6572',   // Medium blue-gray
      disabled: '#7a849a',   
    },
    background: {
      default: '#f5f7fa',     // Light gray background
      jobseeker: '#f5f7fa',     // Light gray background
      paper: '#ffffff',       // White for cards/paper
    },
    action: {
      selected: 'rgba(25, 118, 210, 0.08)', // Light blue selection
      hover: 'rgba(25, 118, 210, 0.04)',    // Very subtle hover
    }
  },
  typography: {
    allVariants: {
      color: '#2a3e50', // Darker text for better readability
      fontWeight: 'normal', // Inherit font weight
      textShadow: 'none', // Removed for cleaner text
      letterSpacing: '0.3px', // Slightly tighter
    },
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.MuiButtonBase-root': {
            borderRadius: '8px',
            margin: '4px 8px',
            color: 'inherit', // Inherits from parent
            '&.Mui-selected': {
              backgroundColor: 'rgba(25, 118, 210, 0.12)',
              color: '#1976d2',
              '& .MuiListItemIcon-root': {
                color: '#1976d2',
              }
            },
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '36px',
          color: 'inherit', // Will follow text color
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 'inherit',
          color: 'inherit',
        },
      },
    },
    // Other component overrides remain the same...
  },
});


export default theme2;