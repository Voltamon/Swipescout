// components/MainContent.jsx
// This component renders the main content area, including tabs and content
// for each "page" of the application.

import React, { useMemo , useState , useEffect } from 'react';
import { Box, Container, Tabs, Tab, Typography } from "@mui/material";

// Import the TabPanel component
import TabPanel from '../components/TabPanel';
import VideoUpload from './VideoUpload';
import VideosPage from './VideosPage';
import Chat from './Chat';
import JobSeekerProfile from "./JobSeekerProfile";
import JobseekerExploreSidebar from "./JobseekerExploreSidebar";
import EmployerVideosPage from "./EmployerVideosPage";
import EditJobSeekerProfile from "./EditJobSeekerProfile";
import JobsListingPage from "./JobsListingPage";
import AllVideosPage from "./AllVideosPage";

const MainContent = ({ currentPage, dashboardTab, employerTab, videoTab, onDashboardTabChange, onEmployerTabChange, onVideoTabChange, setVideoTab }) => {
  // Define a configuration for the Dashboard tabs

    const [showVideos, setShowVideos] = useState(false);

  const handleOpenVideos = () => setShowVideos(true);
  const handleCloseVideos = () => setShowVideos(false);
  
    const dashboardTabsConfig = [
    { label: "Overview", content: 'Overview Here' },
    { label: "Analytics", content: <Typography variant="body1" sx={{ p: 3 }}>Analytics Here</Typography> },
    
  ];
   useEffect(() => {
        if (currentPage === 'employers' && employerTab === 0) {
            setShowVideos(true);
        } else {
            setShowVideos(false);
        }
    }, [currentPage, employerTab]);


  

  const employersTabsConfig = [
    { label: "Explore", content: <Typography variant="body1" sx={{ p: 3 }}>   Jobseekers Viedos Explore here... <button onClick={handleOpenVideos}>Show</button>
</Typography> },
    { label: "Detailed Search", content: <Typography variant="body1" sx={{ p: 3 }}>Use advanced filters to find the perfect job.</Typography> },
    { label: "Job Listings", content: <Typography variant="body1" sx={{ p: 3 }}><JobsListingPage/></Typography> },
  ];

  // Define a configuration for the Videos tabs
  const videosTabsConfig = [
    { label: "Upload Video", content: <Typography variant="body1" sx={{ p: 3 }}><VideoUpload setVideoTab={setVideoTab} /></Typography> },
    { label: "My Videos", content: <Typography variant="body1" sx={{ p: 3 }}><VideosPage setVideoTab={setVideoTab}/></Typography> },
    { label: "Example Videos", content: <Typography variant="body1" sx={{ p: 3 }}><JobseekerExploreSidebar/></Typography> },
  ];

  const pageContent = useMemo(() => {
    // Component to render the dashboard tabs and content
    const EmployersPageContent = () => (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={employerTab} onChange={onEmployerTabChange} variant="fullWidth">
            {employersTabsConfig.map((tab, index) => (
              // Use a unique key for each tab
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        {employersTabsConfig.map((tab, index) => (
          // Use a unique key for each TabPanel
          <TabPanel key={index} value={employerTab} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    );

      const DashboardPageContent = () => (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={dashboardTab} onChange={onDashboardTabChange} variant="fullWidth">
            {dashboardTabsConfig.map((tab, index) => (
              // Use a unique key for each tab
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        {dashboardTabsConfig.map((tab, index) => (
          // Use a unique key for each TabPanel
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
              // Use a unique key for each tab
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        {videosTabsConfig.map((tab, index) => (
          // Use a unique key for each TabPanel
          <TabPanel key={index} value={videoTab} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    );

    // Content for other static pages
    const MessegesPageContent = () => (
      <Chat/>
    );
    const JSProfilePageContent = () => (
      <Typography variant="h5" sx={{ p: 3 }}><JobSeekerProfile/></Typography>
    );

    const EditJSProfilePageContent = () => (
      <Typography variant="h5" sx={{ p: 3 }}><EditJobSeekerProfile/></Typography>
    );
    const SettingsPageContent = () => (
      <Typography variant="h5" sx={{ p: 3 }}>Settings</Typography>
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
    const DefaultContent = () => (
      <Typography variant="h5" sx={{ p: 3 }}>Welcome to your Account!</Typography>
    );


    // Render the correct component based on the current page
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPageContent />;
      case 'employers':
        return <EmployersPageContent />;
      case 'videos':
        return <VideosPageContent setVideoTab={setVideoTab} />; // Pass the prop down here
      case 'messeges':
        return <MessegesPageContent />;
      case 'jobseekerprofile':
        return <JSProfilePageContent />;
      case 'editjobseekerprofile':
        return <EditJSProfilePageContent />;
      case 'settings':
        return <SettingsPageContent />;
      case 'jobs':
        return <JobsPageContent />;
      case 'videosE':
        return <EmployerViewsContent />;
      case 'dashboardE': // Correcting the case for employer dashboard
        return <EmployerDashboardContent />;
      default:
        return <DefaultContent />;
    }
  }, [currentPage, employerTab, dashboardTab, videoTab, onEmployerTabChange, onDashboardTabChange, onVideoTabChange, setVideoTab]);

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {pageContent}
      </Container>
       {showVideos && (
        <Box
          sx={{
            // This Box acts as the container for your video player
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100vw', // Example width
            height: '100vh', // Example height
            border: '2px solid white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.7)',
            zIndex: 9999,
          }}
        >
          <AllVideosPage
            pagetype="employers"
            onClose={handleCloseVideos}
          />
        </Box>
      )}
    </Box>
  );
};

export default MainContent;
