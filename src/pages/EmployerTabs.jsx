// JobseekerTabs.jsx

import React, { useState, useCallback, useMemo ,useEffect } from 'react';
import { Box, CssBaseline } from "@mui/material";
// import { ThemeProvider } from "@mui/material/styles";

// Import components from their new, separate files
import Header from '../components/Headers/admin/Header';
import Footer from '../components/Headers/admin/Footer';
import { useAuth } from '../hooks/useAuth';
import FloatingNavigationPanel from '../components/FloatingNavigationPanel';
import MainContent from './TabsMainContentEmployer';
import { createTheme, ThemeProvider } from "@mui/material/styles";
// Import the mock auth hook and theme config
// import { createCustomTheme } from '../theme';
import { BrowserRouter, useSearchParams } from 'react-router-dom';


const EmployersTabs = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('uploadViedos');
  const [dashboardTab, setDashboardTab] = useState(0);
  const [videoTab, setVideoTab] = useState(0);
  const { role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Create the theme based on dark mode state
//   const theme = useMemo(() => createCustomTheme(darkMode), [darkMode]);

  // Memoized handlers to prevent unnecessary re-renders of child components
   useEffect(() => {
    const page = searchParams.get('page');
    const tab = searchParams.get('tab');

    if (page) {
      setCurrentPage(page);
    }
    
    // Logic to set the correct sub-tab based on the 'tab' parameter
    if (page === 'dashboard' && tab) {
      const tabIndex = ['explore', 'detailed-search', 'job-listings'].indexOf(tab);
      if (tabIndex !== -1) {
        setDashboardTab(tabIndex);
      }
    } else if (page === 'videos' && tab) {
      const tabIndex = ['upload-video', 'my-videos', 'example-videos'].indexOf(tab);
      if (tabIndex !== -1) {
        setVideoTab(tabIndex);
      }
    }
  }, [searchParams]);

  // Create the theme based on dark mode state
  // const theme = useMemo(() => createCustomTheme(darkMode), [darkMode]);

  // Memoized handlers to prevent unnecessary re-renders of child components
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setSearchParams({ page }); // Update the URL parameter
  }, [setSearchParams]);

  const handleDashboardTabChange = useCallback((event, newValue) => {
    setDashboardTab(newValue);
    const newTabName = ['explore', 'detailed-search', 'job-listings'][newValue];
    setSearchParams({ page: currentPage, tab: newTabName });
  }, [setSearchParams, currentPage]);

  const handleVideoTabChange = useCallback((event, newValue) => {
    setVideoTab(newValue);
    const newTabName = ['upload-video', 'my-videos', 'example-videos'][newValue];
    setSearchParams({ page: currentPage, tab: newTabName });
  }, [setSearchParams, currentPage]);


    const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: darkMode ? '#a78bfa' : '#4f46e5',
          contrastText: darkMode ? '#ffffff' : '#ffffff',
        },
        secondary: {
          main: darkMode ? '#4ade80' : '#059669',
        },
        background: {
          default: darkMode ? '#12121e' : '#f9fafb',
          paper: darkMode ? '#1d202e' : '#ffffff',
          paper2: darkMode ? '#5a67a0ff' : '#ffffff',
          hover: darkMode ? '#232b52ff' : '#d6dcf8ff',
          selected: darkMode ? '#afbcfaff' : '#3f4b81ff',
        },
         divider: darkMode ? '#1d202e ' : '#f9fafb',
        text: {
          primary: darkMode ? '#e9e9f4' : '#111827',
          secondary: darkMode ? '#b5b6cf' : '#374151',
        }
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              backgroundColor: darkMode ? '#2d3142' : '#f3f4f6',
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            indicator: {
              backgroundColor: darkMode ? '#a78bfa' : '#4f46e5',
            },
          },
        },
      },
    }),
    [darkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        flexGrow: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <FloatingNavigationPanel role={role} onPageChange={handlePageChange} />

        <MainContent
          currentPage={currentPage}
          dashboardTab={dashboardTab}
          videoTab={videoTab}
          onDashboardTabChange={handleDashboardTabChange}
          onVideoTabChange={handleVideoTabChange}
          setVideoTab={setVideoTab} 
        />

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default EmployersTabs;
