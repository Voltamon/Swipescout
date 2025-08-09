// components/MainContent.jsx
// This component renders the main content area, including tabs and content
// for each "page" of the application.

import React, { useMemo } from 'react';
import { Box, Container, Tabs, Tab, Typography } from "@mui/material";

// Import the TabPanel component and other page components
import TabPanel from '../components/TabPanel';
import VideoUpload from './VideoUpload';
import VideosPage from './VideosPage';
import Chat from './Chat';
import EmployerProfile from "./EmployerProfilePage";
import EmployerExploreSidebar from "./EmployerExploreSidebar";
import EditEmployerProfile from "./EditEmployerProfilePage";
import PostJob from "./PostJobPage";
import AllVideosPage from "./AllVideosPage";
import JobseekerVideosPage from "./JobSeekersPuplicVideosPage";


const MainContent = ({ 
  currentPage, 
  dashboardTab: candidateTab, 
  videoTab, 
  onDashboardTabChange: onCandidatesTabChange, 
  onVideoTabChange, 
  setVideoTab 
}) => {
  // Define a configuration for the Dashboard tabs
  const dashboardTabsConfig = [
    { label: "Overview", content: 'Overview here' },
    { label: "Analytics", content: <Typography variant="body1" sx={{ p: 3 }}>Analytics Here</Typography> },
    
  ];

  // Define a configuration for the Candidates tabs
  const candidatesTabsConfig = [
    { label: "Explore Talent", content: <JobseekerVideosPage /> },
    { label: "Filter Candidates", content: <Typography variant="body1" sx={{ p: 3 }}>Use advanced filters to find the perfect job.</Typography> },
    { label: "Saved Candidates", content: <Typography variant="body1" sx={{ p: 3 }}>Candidate list</Typography> },
  ];

  // Define a configuration for the Videos tabs
  const videosTabsConfig = [
    { label: "Upload Video", content: <VideoUpload setVideoTab={setVideoTab} /> },
    { label: "My Videos", content: <VideosPage setVideoTab={setVideoTab} /> },
    { label: "Example Videos", content: <EmployerExploreSidebar /> },
  ];

  const pageContent = useMemo(() => {
    // Component to render the dashboard tabs and content
    const DashboardPageContent = () => (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={candidateTab} onChange={onCandidatesTabChange} variant="fullWidth">
            {dashboardTabsConfig.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        {dashboardTabsConfig.map((tab, index) => (
          <TabPanel key={index} value={candidateTab} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    );
    
    // Component to render the candidates tabs and content
    const CandidatesPageContent = () => (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={candidateTab} onChange={onCandidatesTabChange} variant="fullWidth">
            {candidatesTabsConfig.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        {candidatesTabsConfig.map((tab, index) => (
          <TabPanel key={index} value={candidateTab} index={index}>
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

    // Content for other static pages
    const MessagesPageContent = () => (
      <Chat/>
    );
    const EmployerProfilePageContent = () => <EmployerProfile />;
    const EditEmployerProfilePageContent = () => <EditEmployerProfile />;
    const PostJobPageContent = () => <PostJob />;
    const SettingsPageContent = () => <Typography variant="h5" sx={{ p: 3 }}>Settings</Typography>;
    const OvervieDashboardPageContent = () => <Typography variant="h5" sx={{ p: 3 }}>Dashboard</Typography>;
    const DefaultContent = () => <Typography variant="h5" sx={{ p: 3 }}>Welcome to your Account!</Typography>;

    // Render the correct component based on the current page
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPageContent />;
      case 'videos':
        return <VideosPageContent />;
      case 'messeges': // Corrected 'messeges' to 'messages'
        return <MessagesPageContent />;
      case 'overview': // Corrected 'messeges' to 'messages'
        return <OvervieDashboardPageContent />;
      case 'employerprofile':
        return <EmployerProfilePageContent />;
      case 'editemployererprofile':
        return <EditEmployerProfilePageContent />;
      case 'postjob':
        return <PostJobPageContent />;
      case 'settings':
        return <SettingsPageContent />;
      case 'candidates':
        return <CandidatesPageContent />; // Correctly using the candidates-specific component
      case 'videosE':
        return <VideosPageContent />;
      case 'dashboardE':
        return <DashboardPageContent />;
      default:
        return <DefaultContent />;
    }
  }, [currentPage, candidateTab, videoTab, onCandidatesTabChange, onVideoTabChange, setVideoTab]);

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {pageContent}
      </Container>
    </Box>
  );
};

export default MainContent;
