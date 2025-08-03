// components/MainContent.jsx
// This component renders the main content area, including tabs and content
// for each "page" of the application.

import React, { useMemo } from 'react';
import { Box, Container, Tabs, Tab, Typography } from "@mui/material";
// import EmployerExploreSidebar from "./EmployerExploreSidebar";
import JobseekerExploreSidebar from "./JobseekerExploreSidebar";
// Import the TabPanel component
import TabPanel from '../components/TabPanel';
import VideoUpload from './VideoUpload';
import VideosPage from './VideosPage';


const MainContent = ({ currentPage, dashboardTab, videoTab, onDashboardTabChange, onVideoTabChange }) => {
  const pageContent = useMemo(() => {
    // Content for the Dashboard page
    const DashboardPageContent = () => (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={dashboardTab} onChange={onDashboardTabChange} variant="fullWidth">
            <Tab label="Explore" />
            <Tab label="Detailed Search" />
            <Tab label="Job Listings" />
          </Tabs>
        </Box>
        <TabPanel value={dashboardTab} index={0}>
          <Typography variant="body1" sx={{ p: 3 }}>Explore new opportunities and company profiles.</Typography>
        </TabPanel>
        <TabPanel value={dashboardTab} index={1}>
          <Typography variant="body1" sx={{ p: 3 }}>Use advanced filters to find the perfect job.</Typography>
        </TabPanel>
        <TabPanel value={dashboardTab} index={2}>
          <Typography variant="body1" sx={{ p: 3 }}>View a list of all available job listings.</Typography>
        </TabPanel>
      </Box>
    );

    // Content for the Videos page
    const VideosPageContent = () => (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={videoTab} onChange={onVideoTabChange} variant="fullWidth">
            <Tab label="Upload Video" />
            <Tab label="My Videos" />
            <Tab label="Example Videos" />
          </Tabs>
        </Box>
        <TabPanel value={videoTab} index={0}>
          <Typography variant="body1" sx={{ p: 3 }}><VideoUpload /></Typography>
        </TabPanel>
        <TabPanel value={videoTab} index={1}>
          <Typography variant="body1" sx={{ p: 3 }}><VideosPage/></Typography>
        </TabPanel>
        <TabPanel value={videoTab} index={2}>
          <Typography variant="body1" sx={{ p: 3 }}><JobseekerExploreSidebar/></Typography>
        </TabPanel>
      </Box>
    );

    // Content for other static pages
    const ApplicationsPageContent = () => (
      <Typography variant="h5" sx={{ p: 3 }}>My Applications</Typography>
    );
    const AnalyticsPageContent = () => (
      <Typography variant="h5" sx={{ p: 3 }}>Analytics Dashboard</Typography>
    );
    const SettingsPageContent = () => (
      <Typography variant="h5" sx={{ p: 3 }}>Settings</Typography>
    );
    const DefaultContent = () => (
      <Typography variant="h5" sx={{ p: 3 }}>Welcome to your Dashboard!</Typography>
    );
    const JobsPageContent = () => (
      <Typography variant="h5" sx={{ p: 3 }}>Jobs for Employers</Typography>
    );
    const EmployerDashboardContent = () => (
      <Typography variant="h5" sx={{ p: 3 }}>Employer Dashboard</Typography>
    );
    const EmployerViewsContent = () => (
      <Typography variant="h5" sx={{ p: 3 }}>Videos for Employers</Typography>
    );

    // Render the correct component based on the current page
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPageContent />;
      case 'videos':
        return <VideosPageContent />;
      case 'applications':
        return <ApplicationsPageContent />;
      case 'analytics':
        return <AnalyticsPageContent />;
      case 'settings':
        return <SettingsPageContent />;
      case 'jobs':
        return <JobsPageContent />;
      case 'videos':
        return <EmployerViewsContent />;
      case 'dashboard':
        return <EmployerDashboardContent />;
      default:
        return <DefaultContent />;
    }
  }, [currentPage, dashboardTab, videoTab, onDashboardTabChange, onVideoTabChange]);

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {pageContent}
      </Container>
    </Box>
  );
};

export default MainContent;
