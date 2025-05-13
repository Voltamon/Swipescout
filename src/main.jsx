import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';
import theme2 from './theme.js'; // Assuming you have a theme.js file

// Create theme (keep your existing theme config)
const theme = createTheme(theme2);

// Get root element
const container = document.getElementById('root');

// Create root
const root = createRoot(container); // Modern React 18+ syntax

// Render app
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);