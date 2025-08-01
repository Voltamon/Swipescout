import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Tabs, 
  Tab, 
  Paper, 
  CssBaseline, 
  IconButton,
  useMediaQuery,
  styled,
  Typography 
} from "@mui/material";
import {
  Work as WorkIcon,
  VideoLibrary as VideoLibraryIcon,
  ScreenSearchDesktop as ScreenSearchDesktopIcon,
  ListAlt as ListAltIcon,
  PersonSearch as PersonSearchIcon,
  Business as BusinessIcon,
  Assessment as AnalyticsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import VideocamIcon from '@mui/icons-material/Videocam';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from '../components/Headers/admin/Header';
import Footer from '../components/Headers/admin/Footer';
import { useAuth } from '../hooks/useAuth';

// Styled components
// Updated FloatingPanel component with text
const FloatingPanel = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: `calc(${theme.spacing(2)} + 65px)`,
  left: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(29, 32, 46, 0.7)' : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('sm')]: {
    top: 'auto',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    right: 'auto',
    flexDirection: 'row',
  },
}));

const FloatingButton = styled(IconButton)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  '& .MuiTypography-caption': {
    fontSize: '0.7rem',
    color: theme.palette.text.primary,
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'row',
    gap: theme.spacing(1),
    '& .MuiTypography-caption': {
      fontSize: '0.8rem',
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const JobSeekerDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [dashboardTab, setDashboardTab] = useState(0);
  const [videoTab, setVideoTab] = useState(0);
  const { user, role } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');

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
        },
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDashboardTabChange = (event, newValue) => {
    setDashboardTab(newValue);
  };

  const handleVideoTabChange = (event, newValue) => {
    setVideoTab(newValue);
  };

  // Content for different tabs
  const DashboardTabContent = () => (
    <Typography variant="body1" sx={{ p: 3 }}>
      {dashboardTab === 0 && "Explore new opportunities and company profiles."}
      {dashboardTab === 1 && "Use advanced filters to find the perfect job."}
      {dashboardTab === 2 && "View a list of all available job listings."}
    </Typography>
  );

  const VideoTabContent = () => (
    <Typography variant="body1" sx={{ p: 3 }}>
      {videoTab === 0 && "Upload your video resume here."}
      {videoTab === 1 && "Manage your uploaded videos."}
      {videoTab === 2 && "Watch example video resumes for inspiration."}
    </Typography>
  );

  const ApplicationsContent = () => (
    <Typography variant="h5" sx={{ p: 3 }}>
      My Applications
    </Typography>
  );

  const AnalyticsContent = () => (
    <Typography variant="h5" sx={{ p: 3 }}>
      Analytics Dashboard
    </Typography>
  );

  const SettingsContent = () => (
    <Typography variant="h5" sx={{ p: 3 }}>
      Settings
    </Typography>
  );

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={dashboardTab} onChange={handleDashboardTabChange} variant="fullWidth">
                <Tab label="Explore" />
                <Tab label="Detailed Search" />
                <Tab label="Job Listings" />
              </Tabs>
            </Box>
            <TabPanel value={dashboardTab} index={0}>
              <DashboardTabContent />
            </TabPanel>
            <TabPanel value={dashboardTab} index={1}>
              <DashboardTabContent />
            </TabPanel>
            <TabPanel value={dashboardTab} index={2}>
              <DashboardTabContent />
            </TabPanel>
          </Box>
        );
      case 'videos':
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={videoTab} onChange={handleVideoTabChange} variant="fullWidth">
                <Tab label="Upload Video" />
                <Tab label="My Videos" />
                <Tab label="Example Videos" />
              </Tabs>
            </Box>
            <TabPanel value={videoTab} index={0}>
              <VideoTabContent />
            </TabPanel>
            <TabPanel value={videoTab} index={1}>
              <VideoTabContent />
            </TabPanel>
            <TabPanel value={videoTab} index={2}>
              <VideoTabContent />
            </TabPanel>
          </Box>
        );
      case 'applications':
        return <ApplicationsContent />;
      case 'analytics':
        return <AnalyticsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return (
          <Typography variant="h5" sx={{ p: 3 }}>
            Welcome to your Dashboard!
          </Typography>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Floating Navigation Panel - Different for job seeker and employer */}
        {role === 'job_seeker' && ( <>
            <FloatingPanel>
  <FloatingButton 
    color="primary" 
    onClick={() => handlePageChange('dashboard')} 
    aria-label="Dashboard"
  >
    <WorkIcon />
    <Typography variant="caption">Jobs</Typography>
  </FloatingButton>
  <FloatingButton 
    color="primary" 
    onClick={() => handlePageChange('videos')} 
    aria-label="Videos"
  >
    <VideoLibraryIcon />
    <Typography variant="caption">Videos</Typography>
  </FloatingButton>
  <FloatingButton 
    color="primary" 
    onClick={() => handlePageChange('applications')} 
    aria-label="Applications"
  >
    <ListAltIcon />
    <Typography variant="caption">Applications</Typography>
  </FloatingButton>
  <FloatingButton 
    color="primary" 
    onClick={() => handlePageChange('analytics')} 
    aria-label="Analytics"
  >
    <AnalyticsIcon />
    <Typography variant="caption">Analytics</Typography>
  </FloatingButton>
</FloatingPanel>



       </> )}

        {role === 'employer' && ( <>



<FloatingPanel>
  <FloatingButton 
    color="primary" 
    onClick={() => handlePageChange('dashboard')} 
    aria-label="Dashboard"
  >
    <DashboardIcon />
    <Typography variant="caption">Dashboard</Typography>
  </FloatingButton>
  <FloatingButton 
    color="primary" 
    onClick={() => handlePageChange('jobs')} 
    aria-label="Jobs"
  >
    <ListAltIcon />
    <Typography variant="caption">Jobs</Typography>
  </FloatingButton>
  <FloatingButton 
    color="primary" 
    onClick={() => handlePageChange('videos')} 
    aria-label="Videos"
  >
    <VideocamIcon />
    <Typography variant="caption">Videos</Typography>
  </FloatingButton>
  <FloatingButton 
    color="primary" 
    onClick={() => handlePageChange('settings')} 
    aria-label="Settings"
  >
    <SettingsIcon />
    <Typography variant="caption">Settings</Typography>
  </FloatingButton>
</FloatingPanel>
       </> )}

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
          <Container maxWidth="lg">
            {renderPageContent()}
          </Container>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default JobSeekerDashboard;