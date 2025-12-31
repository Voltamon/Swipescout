import i18n from 'i18next';
import React, { useState, useCallback, useMemo, useEffect, startTransition } from 'react';
import {
  Box,
  CssBaseline,
  Tabs,
  Tab,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  Badge
} from "@mui/material";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Search,
  Work,
  VideoLibrary,
  Person,
  PostAdd,
  Analytics,
  Notifications,
  Settings as SettingsIcon,
  Business,
  Edit
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import Header from '../components/Headers/admin/Header';
import Footer from '../components/Headers/admin/Footer';
import FloatingNavigationPanel from '../components/FloatingNavigationPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { getEmployerTabCategories } from '../config/employerTabsConfig';
import { getEmployerStats } from '@/services/api';

// Import Employer specific pages
import CandidateSearchPage from './CandidateSearchPage';
import JobPostingForm from './JobPostingForm';
import CompanyVideos from './CompanyVideos';
import NotificationSettingsPage from './NotificationSettingsPage';
import AllVideosPage from './AllVideosPage';
import VideoEditPage from './VideoEditPage';
import JobsListingPage from './JobsListingPage';
import EmployerProfilePage from './EmployerProfilePage';
import Settings from './Settings';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employer-tabpanel-${index}`}
      aria-labelledby={`employer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `employer-tab-${index}`,
    'aria-controls': `employer-tabpanel-${index}`,
  };
};

const EmployerTabs = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [stats, setStats] = useState({
    activeJobs: 0,
    newApplications: 0,
    companyVideos: 0,
    profileViews: 0
  });

  // Read tab group and tab from URL
  const tabCategoryKey = searchParams.get('group') || 'dashboard';
  const tabParam = searchParams.get('tab') || 'overview';

  // Get translated tab categories
  const employerTabCategories = useMemo(() => getEmployerTabCategories(t), [t]);

  // Find the category to display
  const tabCategory = useMemo(() =>
    employerTabCategories.find(cat => cat.key === tabCategoryKey) || employerTabCategories[0],
    [tabCategoryKey, employerTabCategories]
  );
  const filteredTabs = tabCategory.tabs;

  // Find tab index by tab path
  useEffect(() => {
    if (tabParam) {
      const index = filteredTabs.findIndex(tab => tab.path === tabParam);
      if (index !== -1) {
        setCurrentTab(index);
      } else {
        setCurrentTab(0);
      }
    } else {
      setCurrentTab(0);
    }
  }, [tabParam, filteredTabs]);

  // When tab is changed, update both tab and group in URL
  const handleTabChange = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    // Use React.startTransition to align with v7_startTransition behavior
    startTransition(() => {
      setSearchParams({ group: tabCategory.key, tab: filteredTabs[newValue].path });
    });
  }, [filteredTabs, tabCategory, setSearchParams]);

  const customTheme = useMemo(() =>
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
          default: darkMode ? '#0f0f23' : '#f8fafc',
          paper: darkMode ? '#1a1b3a' : '#ffffff',
          paper2: darkMode ? '#2d2e5f' : '#f1f5f9',
          hover: darkMode ? '#232b52ff' : '#e2e8f0',
          selected: darkMode ? '#afbcfaff' : '#3f4b81ff',
        },
        divider: darkMode ? '#374151' : '#e5e7eb',
        text: {
          primary: darkMode ? '#f1f5f9' : '#0f172a',
          secondary: darkMode ? '#cbd5e1' : '#475569',
        }
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
          fontWeight: 700,
          fontSize: '2rem',
        },
        h6: {
          fontWeight: 600,
        }
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 600,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: darkMode 
                ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
                : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: darkMode 
                  ? '0 8px 25px rgba(0, 0, 0, 0.4)' 
                  : '0 8px 25px rgba(0, 0, 0, 0.15)',
              }
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            root: {
              minHeight: 48,
            },
            indicator: {
              backgroundColor: darkMode ? '#a78bfa' : '#4f46e5',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              minHeight: 48,
              '&.Mui-selected': {
                fontWeight: 600,
              }
            },
          },
        },
      },
    }),
    [darkMode],
  );

  // Redirect if not employer
  // useEffect(() => {
  //   if (user && role !== 'employer') {
  //     if (role === 'job_seeker') navigate('/jobseeker-tabs');
  //     else if (role === 'admin') navigate('/admin-dashboard');
  //     else navigate('/');
  //   }
  // }, [user, role, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await getEmployerStats();
        if (statsResponse && statsResponse.data) {
          setStats(statsResponse.data);
        } else {
          console.error("Unexpected API response format:", statsResponse);
          setStats({
            activeJobs: 0,
            newApplications: 0,
            companyVideos: 0,
            profileViews: 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch employer stats:", error);
        setStats({
          activeJobs: 0,
          newApplications: 0,
          companyVideos: 0,
          profileViews: 0
        });
      }
    };

    fetchStats();
  }, []);

  // Replace the simple equality check with a robust inclusion check that supports both
  // string roles and array roles (AuthContext may store roles as an array).
  const isEmployer = Array.isArray(role) ? role.includes('employer') : role === 'employer';

  if (!user || !isEmployer) {
    return null;
  }

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box sx={{
        flexGrow: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Floating Navigation Panel */}
        <FloatingNavigationPanel 
          role={role} 
          onPageChange={(pagePath) => navigate(pagePath)} 
        />

        <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 3, md: 4 }, flexGrow: 1 }}>
          {/* Welcome Section */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: "1.5rem", md: "2rem" }, // Adjust font size for mobile
                fontWeight: "bold",
              }}
            >
              Welcome back, {user?.companyName || 'Employer'}! 🏢
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.9rem", md: "1rem" }, // Adjust font size for mobile
              }}
            >
              Manage your hiring process, company profile, and find the best talent for your team.
            </Typography>
          </Box>

          {/* Quick Stats Cards */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
            <Grid item xs={6} sm={4} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Badge badgeContent={(stats.activeJobs ?? 0) == 0 ? '0' : stats.activeJobs} color="primary">
                    <Work color="primary" sx={{ fontSize: { xs: 30, md: 40 } }} />
                  </Badge>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      fontSize: { xs: "0.8rem", md: "1rem" }, // Adjust font size for mobile
                    }}
                  >{i18n.t('auto_active_jobs')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Badge badgeContent={(stats.newApplications ?? 0) == 0 ? '0' : stats.newApplications} color="secondary">
                    <Person color="secondary" sx={{ fontSize: 40 }} />
                  </Badge>
                  <Typography variant="h6" sx={{ mt: 1 }}>{i18n.t('auto_new_applications')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Badge badgeContent={(stats.companyVideos ?? 0) == 0 ? '0' : stats.companyVideos} color="info">
                    <VideoLibrary color="info" sx={{ fontSize: 40 }} />
                  </Badge>
                  <Typography variant="h6" sx={{ mt: 1 }}>{i18n.t('auto_company_videos')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Badge badgeContent={(stats.profileViews ?? 0) == 0 ? '0' : stats.profileViews} color="warning">
                    <Analytics color="warning" sx={{ fontSize: 40 }} />
                  </Badge>
                  <Typography variant="h6" sx={{ mt: 1 }}>{i18n.t('auto_profile_views')}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Navigation Tabs */}
          <Paper elevation={2} sx={{ mb: { xs: 2, md: 3 } }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                aria-label={i18n.t('auto_employer_dashboard_tabs')} 
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  px: { xs: 1, md: 2 },
                  '& .MuiTab-root': {
                    fontSize: { xs: "0.8rem", md: "1rem" }, // Adjust font size for mobile
                  },
                }}
              >
                {filteredTabs.map((tab, index) => (
                  <Tab 
                    key={tab.path} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {React.createElement(tab.icon, { sx: { fontSize: { xs: 20, md: 24 } } })}
                        <span>{tab.label}</span>
                      </Box>
                    }
                    {...a11yProps(index)}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Tab Content */}
            {filteredTabs.map((tab, index) => (
              <TabPanel key={tab.path} value={currentTab} index={index}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tab.description}
                  </Typography>
                  {tab.context
                    ? React.createElement(tab.component, { context: tab.context })
                    : React.createElement(tab.component)}
                </Box>
              </TabPanel>
            ))}
          </Paper>
        </Container>

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default EmployerTabs;

