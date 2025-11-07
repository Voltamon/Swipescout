import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  CalendarToday,
  Notifications,
  Settings as SettingsIcon,
  Bookmark,
  Favorite,
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import Header from '../components/Headers/admin/Header';
import Footer from '../components/Headers/admin/Footer';
import FloatingNavigationPanel from '../components/FloatingNavigationPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { jobseekerTabCategories } from '../config/jobseekerTabsConfig';
import { getJobseekerStats } from '@/services/api';

// Import Job Seeker specific pages
import JobSearchPage from './JobSearchPage';
import ResumeBuilderPage from './ResumeBuilderPage';
import InterviewPage from './InterviewPage';
import NotificationSettingsPage from './NotificationSettingsPage';
import AllVideosPage from './AllVideosPage';
import SavedVideosPage from './SavedVideosPage';
import LikedVideosPage from './LikedVideosPage';
import JobSeekerProfile from './JobSeekerProfile';
import Settings from './Settings';
import VideoUpload from './VideoUpload'; // Ensure this import exists

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`jobseeker-tabpanel-${index}`}
      aria-labelledby={`jobseeker-tab-${index}`}
      {...other}
    >
      {value === index && (
        // allow content to expand naturally so page scrollbar appears
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `jobseeker-tab-${index}`,
    'aria-controls': `jobseeker-tabpanel-${index}`,
  };
};

const JobseekerTabs = () => {
  // const { t } = useTranslation(); // Removed: unused variable
  const [darkMode, setDarkMode] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [stats, setStats] = useState({
    activeApplications: 0,
    upcomingInterviews: 0,
    myVideos: 0,
    savedJobs: 0
  });

 
  // Read tab group and tab from URL
  const tabCategoryKey = searchParams.get("group") || "dashboard";
  const tabParam = searchParams.get("tab") || "overview";

  // Get translated tab categories — call directly to avoid unstable memo dependency shapes
  const jobseekerTabCategoriesData = jobseekerTabCategories();

  // Find the category to display (plain derivation keeps hooks order stable)
  const tabCategory =
    jobseekerTabCategoriesData.find((cat) => cat.key === tabCategoryKey) ||
    jobseekerTabCategoriesData[0];

  const filteredTabs = tabCategory.tabs;

  // Find tab index by tab path
  useEffect(() => {
    if (tabParam) {
      const index = filteredTabs.findIndex((tab) => tab.path === tabParam);
      setCurrentTab(index !== -1 ? index : 0); // Default to the first tab if not found
    } else {
      setCurrentTab(0); // Default to the first tab if no tabParam is provided
    }
  }, [tabParam, filteredTabs]);

  // When tab is changed, update both tab and group in URL
  // Use a stable function (no useCallback) to avoid changing dependency arrays
  function handleTabChange(event, newValue) {
    setCurrentTab(newValue);
    try {
      setSearchParams({ group: tabCategory.key, tab: filteredTabs[newValue].path });
    } catch (e) {
      // guard: fallback to first tab
      setSearchParams({ group: tabCategory.key, tab: filteredTabs[0]?.path || "overview" });
    }
  }

  const customTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#a78bfa" : "#4f46e5",
            contrastText: darkMode ? "#ffffff" : "#ffffff",
          },
          secondary: {
            main: darkMode ? "#4ade80" : "#059669",
          },
          background: {
            default: darkMode ? "#0f0f23" : "#f8fafc",
            paper: darkMode ? "#1a1b3a" : "#ffffff",
            paper2: darkMode ? "#2d2e5f" : "#f1f5f9",
            hover: darkMode ? "#232b52ff" : "#e2e8f0",
            selected: darkMode ? "#afbcfaff" : "#3f4b81ff",
          },
          divider: darkMode ? "#374151" : "#e5e7eb",
          text: {
            primary: darkMode ? "#f1f5f9" : "#0f172a",
            secondary: darkMode ? "#cbd5e1" : "#475569",
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 700,
            fontSize: "2rem",
          },
          h6: {
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
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 600,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: darkMode
                  ? "0 4px 6px rgba(0, 0, 0, 0.3)"
                  : "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: darkMode
                    ? "0 8px 25px rgba(0, 0, 0, 0.4)"
                    : "0 8px 25px rgba(0, 0, 0, 0.15)",
                },
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              root: {
                minHeight: 48,
              },
              indicator: {
                backgroundColor: darkMode ? "#a78bfa" : "#4f46e5",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.875rem",
                minHeight: 48,
                "&.Mui-selected": {
                  fontWeight: 600,
                },
              },
            },
          },
        },
      }),
    [darkMode]
  );

  
  useEffect(() => {
    if (user) {
      const primary = Array.isArray(role) ? role[0] : role;
      if (primary && primary !== "job_seeker" && primary !== "employee") {
        if (primary === "employer" || primary === "recruiter") navigate("/employer-tabs");
        else if (primary === "admin") navigate("/admin-dashboard");
        else navigate("/");
      }
    }
  }, [user, role, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await getJobseekerStats();
        if (statsResponse && statsResponse.data) {
          setStats(statsResponse.data);
        } else {
          console.error("Unexpected API response format:", statsResponse);
          setStats({
            activeApplications: 0,
            upcomingInterviews: 0,
            myVideos: 0,
            savedJobs: 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch jobseeker stats:", error);
        setStats({
          activeApplications: 0,
          upcomingInterviews: 0,
          myVideos: 0,
          savedJobs: 0
        });
      }
    };

    fetchStats();
  }, []);

  const handleVideoUpload = async (videoData) => {
    const payload = {
      // ...existing code...
      videoPosition: videoData.videoPosition || 'intro', // Replace 'intro' with a valid default value
      // ...existing code...
    };

    try {
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // ...existing code...
    } catch (error) {
      console.error('Video upload failed:', error);
    }
  };

  if (!user || !(Array.isArray(role) ? role.includes("job_seeker") || role.includes("employee") : role === "job_seeker" || role === "employee")) {
    return null;
  }

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box
        sx={{
          // let the document's scrollbar handle vertical scrolling
          bgcolor: "background.default",
          // remove forced full-height flex layout and overflow handling
        }}
      >
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Floating Navigation Panel */}
        <FloatingNavigationPanel 
          role={role} 
          onPageChange={(pagePath) => navigate(pagePath)} 
        />

        {/* restore Container to normal flow so it contributes to page height */}
        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: 2, md: 3 },
            mb: { xs: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 4 },
            // removed flexGrow/minHeight so container height grows with content
          }}
        >
          {/* Welcome Section */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: "1.5rem", md: "2rem" },
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Welcome back, {user?.firstName || "Job Seeker"}! 👋
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.9rem", md: "1rem" },
                textAlign: "center",
              }}
            >
              Manage your job search, profile, and career opportunities all in
              one place.
            </Typography>
          </Box>

          {/* Quick Stats Cards */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
              {/* Small stats: Profile Views, Matches, Applications, Unread Messages */}
              <Grid item xs={6} sm={4} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Badge
                      badgeContent={(stats?.profileViews ?? stats?.profile_views ?? 0) === 0 ? '0' : (stats?.profileViews ?? stats?.profile_views ?? 0)}
                      color="primary"
                    >
                      <VisibilityIcon
                        color="primary"
                        sx={{ fontSize: { xs: 40, md: 50 } }}
                      />
                    </Badge>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontSize: { xs: "0.8rem", md: "1rem" },
                      }}
                    >
                      Profile Views
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={4} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Badge
                      badgeContent={(stats?.matches ?? 0) === 0 ? '0' : (stats?.matches ?? 0)}
                      color="secondary"
                    >
                      <ThumbUpIcon
                        color="secondary"
                        sx={{ fontSize: { xs: 40, md: 50 } }}
                      />
                    </Badge>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontSize: { xs: "0.8rem", md: "1rem" },
                      }}
                    >
                      Matches
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={4} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Badge
                      badgeContent={(stats?.applications ?? stats?.applications_count ?? 0) === 0 ? '0' : (stats?.applications ?? stats?.applications_count ?? 0)}
                      color="warning"
                    >
                      <Work
                        color="warning"
                        sx={{ fontSize: { xs: 40, md: 50 } }}
                      />
                    </Badge>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontSize: { xs: "0.8rem", md: "1rem" },
                      }}
                    >
                      Applications
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={4} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Badge
                      badgeContent={(stats?.unreadMessages ?? stats?.unread_messages ?? 0) === 0 ? '0' : (stats?.unreadMessages ?? stats?.unread_messages ?? 0)}
                      color="info"
                    >
                      <MessageIcon
                        color="info"
                        sx={{ fontSize: { xs: 40, md: 50 } }}
                      />
                    </Badge>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontSize: { xs: "0.8rem", md: "1rem" },
                      }}
                    >
                      Unread Messages
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
          </Grid>

          {/* Main Navigation Tabs */}
          <Paper elevation={2} sx={{ mb: { xs: 2, md: 3 } }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                aria-label="Job Seeker Dashboard Tabs"
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  px: { xs: 1, md: 2 },
                  "& .MuiTab-root": {
                    fontSize: { xs: "0.8rem", md: "1rem" },
                  },
                }}
              >
                {filteredTabs.map((tab, index) => (
                  <Tab
                    key={tab.path}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {React.createElement(tab.icon, {
                          sx: { fontSize: { xs: 20, md: 24 } },
                        })}
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
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

export default JobseekerTabs;
