// components/MainContent.jsx
// This component renders the main content area, including tabs and content
// for each "page" of the application.

import React, { useMemo ,useState ,useEffect  } from 'react';
import { Box, Container, Tabs, Tab, Typography, IconButton } from "@mui/material";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

// Import the TabPanel component and other page components
import TabPanel from '../components/TabPanel';
import VideoUpload from './VideoUpload';
import VideosPage from './VideosPage';
import Chat from './Chat';
import EmployerProfile from "./EmployerProfilePage";
import EmployerViedoExamples from "./EmployerViedoExamples";
import EditEmployerProfile from "./EditEmployerProfilePage";
import PostJob from "./PostJobPage";
import AllVideosPage from "./AllVideosPage";
import EmployerDashboard from "./EmployerDashboard";

const MainContent = ({ 
  currentPage, 
  dashboardTab, candidateTab, 
  videoTab, 
  onDashboardTabChange, onCandidateTabChange, 
  onVideoTabChange, 
  setVideoTab 
}) => {

      const [showVideos, setShowVideos] = useState(false);

  const handleOpenVideos = () => {setIsMaximized(false); setShowVideos(true); }
  const handleCloseVideos = () => setShowVideos(false);

  const [isMaximized, setIsMaximized] = useState(false);
  
  
    const handleToggleMaximize = () => {
      setIsMaximized(!isMaximized);
    };
  

  
     useEffect(() => {
        if (currentPage === 'candidates' && candidateTab === 0) {
            setShowVideos(true);
        } else {
            setShowVideos(false);
        }
    }, [currentPage, candidateTab]);

  // Define a configuration for the Dashboard tabs
  const dashboardTabsConfig = [
    { label: "Overview", content: 'Overview here' },
    { label: "Analytics", content: <Typography variant="body1" sx={{ p: 3 }}>Analytics Here</Typography> },
    
  ];

  // Define a configuration for the Candidates tabs
  const candidatesTabsConfig = [
        { label: "Explore", content: <Typography variant="body1" sx={{ p: 3 }}>   Employers Viedos Explore here... <button onClick={handleOpenVideos}>Show</button>
</Typography> },
    { label: "Filter Candidates", content: <Typography variant="body1" sx={{ p: 3 }}>Use advanced filters to find the perfect job.</Typography> },
    { label: "Saved Candidates", content: <Typography variant="body1" sx={{ p: 3 }}>Candidate list</Typography> },
  ];

  // Define a configuration for the Videos tabs
  const videosTabsConfig = [
    { label: "Upload Video", content: <VideoUpload setVideoTab={setVideoTab} /> },
    { label: "My Videos", content: <VideosPage setVideoTab={setVideoTab} /> },
    { label: "Example Videos", content: <EmployerViedoExamples /> },
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
          <Tabs value={candidateTab} onChange={onCandidateTabChange} variant="fullWidth">
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
    const DefaultContent = () => <Typography variant="h5" sx={{ p: 3 }}><EmployerDashboard /></Typography>;

    // Render the correct component based on the current page
    switch (currentPage) {
      case 'dashboard':
        return <EmployerDashboard />;
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
  }, [currentPage, candidateTab, videoTab, onCandidateTabChange, onVideoTabChange, setVideoTab]);

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {pageContent}
      </Container>
    


         {showVideos && (
              
              <Box
            sx={{
              // Conditional styles for the maximized state
              width: isMaximized ? '100vw' : '80vw',
              height: isMaximized ? '100vh' : '80vh',
              borderRadius: isMaximized ? '12' : '2',
              top: isMaximized ? '0' : '57%',
              left: isMaximized ? '0' : '50%',
              transform: isMaximized ? 'none' : 'translate(-50%, -50%)',
              
              // Base styles for the container
              position: 'fixed',
              border: '2px solid white',
              overflow: 'hidden',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.7)',
              zIndex: 9999,
              transition: 'all 0.3s ease-in-out', // Smooth transition for visual effect
            }}
          >
            {/* Maximize/Minimize Icon Button */}
            <IconButton
              onClick={handleToggleMaximize}
              sx={{
                position: 'absolute',
                top: 16,
                right: 48,
                color: 'white',
                zIndex: 10000,
              }}
            >
              {isMaximized ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            
            <AllVideosPage
              pagetype="jobseekers"
              onClose={handleCloseVideos}
            />
          </Box>
      )}
      
      </Box>
  );
};

export default MainContent;
