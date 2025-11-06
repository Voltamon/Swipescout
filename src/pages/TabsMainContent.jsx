// This component renders the main content area, including tabs and content
// for each "page" of the application.

import React, { useContext, useMemo, useState, useEffect  } from 'react';
import { Box, Container, Tabs, Tab, Typography, IconButton } from "@mui/material";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

// Import the TabPanel component
import TabPanel from '../components/TabPanel';
import VideoUpload from './VideoUpload';
import VideosPage from './VideosPage';
import Chat from './Chat';
import JobSeekerProfile from "./JobSeekerProfile";
import JobseekerExploreSidebar from "./JobseekerVideoExamples";
import EditJobSeekerProfile from "./EditJobSeekerProfile";
import JobsListingPage from "./JobsListingPage";
import AllVideosPage from "./AllVideosPage";
import JobSeekerDashboard_ from "./JobSeekerDashboard";

// Import new pages
import JobSearchPage from "./JobSearchPage";
import SavedVideosPage from "./SavedVideosPage";
import LikedVideosPage from "./LikedVideosPage";
import InterviewPage from "./InterviewPage";
import ResumeBuilderPage from "./ResumeBuilderPage";
import NotificationSettingsPage from "./NotificationSettingsPage";
import PricingPage from "./PricingPage";
import { jobseekerTabCategories } from '../config/jobseekerTabsConfig';
import localize from '../utils/localize';

const MainContent = ({ 
  currentPage, 
  dashboardTab, 
  employerTab, 
  videoTab, 
  onDashboardTabChange, 
  onEmployerTabChange, 
  onVideoTabChange, 
  setVideoTab,
  tabCategoryKey // <-- new prop to select tab category
}) => {
  const [showVideos, setShowVideos] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleToggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleOpenVideos = () => {
    setIsMaximized(false); 
    setShowVideos(true); 
  };
  
  const handleCloseVideos = () => setShowVideos(false);
  
  // Define a configuration for the Dashboard tabs
  const dashboardTabsConfig = [
    { 
      label: "Overview", 
      content: <JobSeekerDashboard_ />
    },
    { 
      label: "Analytics", 
      content: <Typography variant="body1" sx={{ p: 3 }}>
        Advanced analytics and insights about your profile performance, application success rate, and more.
      </Typography> 
    },
  ];

  useEffect(() => {
    if (currentPage === 'employers' && employerTab === 0) {
      setShowVideos(true);
    } else {
      setShowVideos(false);
    }
  }, [currentPage, employerTab]);

  const employersTabsConfig = [
    { 
      label: "Explore", 
      content: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Discover Employers and Companies
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Browse through company profiles and see what they're looking for.
          </Typography>
          <button onClick={handleOpenVideos}>Show Company Videos</button>
        </Box>
      )
    },
    { 
      label: "Detailed Search", 
      content: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Advanced Employer Search
          </Typography>
          <Typography variant="body1">
            Use advanced filters to find companies that match your career goals and values.
          </Typography>
        </Box>
      )
    },
    { 
      label: "Job Listings", 
      content: <JobsListingPage />
    },
  ];

  // Define a configuration for the Videos tabs
  const videosTabsConfig = [
    { 
      label: "Upload Video", 
      content: <VideoUpload setVideoTab={setVideoTab} />
    },
    { 
      label: "My Videos", 
      content: <VideosPage setVideoTab={setVideoTab} />
    },
    { 
      label: "Example Videos", 
      content: <JobseekerExploreSidebar />
    },
  ];

  // Get the tab category to display
  const tabCategory = useMemo(() =>
    jobseekerTabCategories.find(cat => cat.key === tabCategoryKey) || jobseekerTabCategories[0],
    [tabCategoryKey]
  );
  const filteredTabs = tabCategory.tabs;

  // Centralized tab rendering for selected category
  const CategoryTabsContent = () => (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={dashboardTab} onChange={onDashboardTabChange} variant="fullWidth">
          {filteredTabs.map((tab, index) => (
            <Tab key={index} label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {React.createElement(tab.icon)}
                <span>{localize(tab.label)}</span>
              </Box>
            } />
          ))}
        </Tabs>
      </Box>
      {filteredTabs.map((tab, index) => (
        <TabPanel key={index} value={dashboardTab} index={index}>
          {tab.context
            ? React.createElement(tab.component, { context: tab.context })
            : React.createElement(tab.component)}
        </TabPanel>
      ))}
    </Box>
  );

  const pageContent = useMemo(() => {
    // Component to render the employers tabs and content
    const EmployersPageContent = () => (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={employerTab} onChange={onEmployerTabChange} variant="fullWidth">
            {employersTabsConfig.map((tab, index) => (
              <Tab key={index} label={localize(tab.label)} />
            ))}
          </Tabs>
        </Box>
        {employersTabsConfig.map((tab, index) => (
          <TabPanel key={index} value={employerTab} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    );

    // Component to render the dashboard tabs and content
    const DashboardPageContent = () => (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={dashboardTab} onChange={onDashboardTabChange} variant="fullWidth">
            {dashboardTabsConfig.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        {dashboardTabsConfig.map((tab, index) => (
          <TabPanel key={index} value={dashboardTab} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    );

    // Component to render the videos tabs and content
    const VideosPageContent = () => (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={videoTab} onChange={onVideoTabChange} variant="fullWidth">
            {videosTabsConfig.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        {videosTabsConfig.map((tab, index) => (
          <TabPanel key={index} value={videoTab} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    );

    // Main page routing logic
    switch (currentPage) {
      case 'dashboard':
        return <CategoryTabsContent />;
      
      case 'videos':
        return <VideosPageContent />;
      
      case 'employers':
        return <EmployersPageContent />;
      
      case 'jobseekerprofile':
        return <JobSeekerProfile />;
      
      case 'messeges':
        return <Chat />;
      
      case 'job-search':
        return <JobSearchPage />;
      
      case 'saved-videos':
        return <SavedVideosPage />;
      
      case 'liked-videos':
        return <LikedVideosPage />;
      
      case 'interviews':
        return <InterviewPage />;
      
      case 'resume-builder':
        return <ResumeBuilderPage />;
      
      case 'notifications':
        return <NotificationSettingsPage />;
      
      case 'pricing':
        return <PricingPage />;
      
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Account Settings
            </Typography>
            <Typography variant="body1">
              Manage your account preferences, privacy settings, and more.
            </Typography>
            {/* Add settings components here */}
          </Box>
        );
      
      case 'analytics':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Analytics Dashboard
            </Typography>
            <Typography variant="body1">
              View detailed analytics about your profile performance, video views, and application success rates.
            </Typography>
            {/* Add analytics components here */}
          </Box>
        );
      
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Welcome to SwipeScout
            </Typography>
            <Typography variant="body1">
              Select a section from the navigation panel to get started.
            </Typography>
          </Box>
        );
    }
  }, [
    currentPage, 
    dashboardTab, 
    employerTab, 
    videoTab, 
    onDashboardTabChange, 
    onEmployerTabChange, 
    onVideoTabChange, 
    setVideoTab,
    tabCategoryKey
  ]);

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        flexGrow: 1, 
        py: 3,
        px: { xs: 2, sm: 3, md: 4 },
        ml: { xs: 0, sm: '120px' }, // Account for floating navigation panel
        transition: 'margin-left 0.3s ease',
      }}
    >
      {/* Fullscreen toggle for video content */}
      {(currentPage === 'videos' || showVideos) && (
        <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1001 }}>
          <IconButton
            onClick={handleToggleMaximize}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
              },
            }}
          >
            {isMaximized ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Box>
      )}

      {/* Video overlay for maximized view */}
      {showVideos && (
        <Box
          sx={{
            position: isMaximized ? 'fixed' : 'relative',
            top: isMaximized ? 0 : 'auto',
            left: isMaximized ? 0 : 'auto',
            width: isMaximized ? '100vw' : '100%',
            height: isMaximized ? '100vh' : 'auto',
            zIndex: isMaximized ? 1000 : 'auto',
            backgroundColor: isMaximized ? 'black' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AllVideosPage onClose={handleCloseVideos} isMaximized={isMaximized} />
        </Box>
      )}

      {/* Main content */}
      {!showVideos && (
        <Box sx={{ width: '100%', minHeight: 'calc(100vh - 200px)' }}>
          {pageContent}
        </Box>
      )}
    </Container>
  );
};

export default MainContent;

