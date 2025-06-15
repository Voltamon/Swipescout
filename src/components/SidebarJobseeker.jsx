import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  useTheme,
  Box,
  Avatar,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Home as HomeIcon,
  PersonSearch as SearchIcon,
  Business as JobsIcon,
  Message as MessagesIcon,
  People as CandidatesIcon,
  Assessment as AnalyticsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';


const expandedWidth = 200;
const collapsedWidth = 72;

const SidebarJobseeker = ({ open = true, onClose, variant ,isMobile}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const employer_menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/employer-dashboard' },
    { text: 'Video Feed', icon: <HomeIcon />, path: '/video-feed' },
    { text: 'Explore', icon: <VideoLibraryIcon />, path: '/Employer-explore-sidebar' },
    { text: 'Find Candidates', icon: <SearchIcon />, path: '/Employer-explore' },
    { text: 'Detailed Search', icon: <SearchIcon />, path: '/candidate-search' },
    { text: 'Job Postings', icon: <JobsIcon />, path: '/job-posting' },
    { text: 'Candidate Profile', icon: <SearchIcon />, path: '/candidate-profile' },
    { text: 'Upload Video', icon: <SearchIcon />, path: '/video-resume-upload' },
    // { text: 'Applicants', icon: <CandidatesIcon />, path: '/applicants' },
    { text: 'Messages', icon: <MessagesIcon />, path: '/inbox' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/employer/dashboard' },
  ];


    const jobseeker_menuItems = [
          // { text: 'Home Page', icon: <HomeIcon />, path: '/' },

    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    // { text: 'Video Feed', icon: <HomeIcon />, path: '/jobseeker-video-feed' },
        // { text: 'About Swipescoute', icon: <VideoCameraFrontIcon  />, path: '/MarketingVideos-page' },
    { text: 'My Videos', icon: <VideocamIcon  />, path: '/videos' },
    { text: 'Employers Jobs Videos', icon: <VideoLibraryIcon />, path: '/Employer-explore-sidebar' },
    { text: 'Company Videos', icon: <SearchIcon />, path: '/company-videos' },
    { text: 'Find Jobs', icon: <SearchIcon />, path: '/Job-seeker-explore' },
    { text: 'Detailed Search', icon: <ManageSearchIcon />, path: '/job-search' },
    { text: 'Job Videos', icon: <JobsIcon />, path: '/job-videos' },
    { text: 'Job Details', icon: <SearchIcon />, path: '/job/1' },
    { text: 'Upload Video', icon: <SearchIcon />, path: '/video-resume-upload' },
    { text: 'My Applications', icon: <CandidatesIcon />, path: '/MyApplications-page' },
    { text: 'Messages', icon: <MessagesIcon />, path: '/chat' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/job-seeker/dashboard' },
  ];

const admin_menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/admin-dashboard' },
    { text: 'Video Feed', icon: <HomeIcon />, path: '/video-feed' },
    { text: 'Explore', icon: <HomeIcon />, path: '/Employer-explore-sidebar' },
    { text: 'Messages', icon: <MessagesIcon />, path: '/inbox' },

  ];



const menuItems = jobseeker_menuItems;
// React.useMemo(() => {
//   if (user?.role === 'employer') return employer_menuItems;
//   if (user?.role === 'job_seeker') return jobseeker_menuItems;
//   if (user?.role === 'admin') return admin_menuItems;
//   return [];
// }, [user?.role]);

// const roleGradients = {
//   employer: 'linear-gradient(135deg, #4a6bff 0%, #6a8bff 100%)',
//   'job_seeker': 'linear-gradient(90deg,rgba(200, 221, 247, 0.86) 50%,rgb(255, 255, 255) 100%)',
//   admin: 'linear-gradient(135deg, #dd4f6b 0%, #b73a56 100%)',
//   default: 'linear-gradient(135deg, #6b4fdd 0%, #563ab7 100%)'
// };
const roleStyles = {
  employer: {
    background: `linear-gradient(115deg,rgba(156, 253, 237, 0.73) 10%,rgba(107, 218, 181, 0.73) 60%), url('/backgrounds/bkg2.png')`,
    '& .MuiListItem-root': {
      color: 'rgb(39, 56, 83)', // Base text color
      '&.Mui-selected': {
        color: '#ffffff', // Brighter when selected
      },
    },
    // ... other employer styles
  },
  job_seeker: {
   background: `linear-gradient(115deg,rgba(156, 187, 253, 0.73) 10%,rgba(178, 209, 224, 0.73) 60%), url('/backgrounds/bkg2.png')`,
    '& .MuiListItem-root': {
      color: 'rgb(39, 56, 83)', // Base text color
      '&.Mui-selected': {
        color: '#ffffff', // Brighter when selected
      },
    // ... other job seeker styles
    }
  },
  admin: {
   background: `linear-gradient(115deg,rgba(156, 187, 253, 0.73) 10%,rgba(178, 209, 224, 0.73) 60%), url('/backgrounds/bkg2_a.png')`,
    '& .MuiListItem-root': {
      color: 'rgb(39, 56, 83)', // Base text color
      '&.Mui-selected': {
        color: '#ffffff', // Brighter when selected
      },
    // ... other admin styles
    }
  }
}
  const secondaryItems = [
      { text: 'Logout', icon: <LogoutIcon />, path: '#' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    // { text: 'Help Center', icon: <HelpIcon />, path: '/help' },
  ];

  const isActive = (path) => location.pathname.startsWith(path) ;

  return (<>  {(open || !isMobile) && (
    <Drawer
      variant="permanent" // or "persistent"
      open={open}
       sx={{
    width: open ? expandedWidth : collapsedWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: open ? expandedWidth : collapsedWidth,
      transition: 'width 0.3s ease-in-out',
      overflowX: 'hidden',              
      overflowY: 'auto',               
      boxSizing: 'border-box',
      scrollbarWidth: 'none',           // Firefox
      '&::-webkit-scrollbar': {
        width: 0,                       // Chrome, Safari
        height: 0,                      // Prevents horizontal scrollbar too
      },
      ...(roleStyles['job_seeker'] || {}),
    },
  }}
    >
  
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
<Box sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2 }}>
  <Avatar src={user?.photoUrl ||user?.photo_url } sx={{ 
    width: 50, 
    height: 50, 
    mr: open ? 2 : 0,
    border: '2px solid',
    borderColor: 'primary.main'
  }}>
    {user?.name?.charAt(0)}
  </Avatar>
  {open && (
    <Box>
      <Typography variant="subtitle1" sx={{ color: 'textw.primary !important' }}>
        {user?.display_name ||user?.name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'textw.secondary' }}>
        {user?.role || user?.role?.replace('_', ' ') || 'Jobseeker'}
      </Typography>
    </Box>
  )}
</Box>
        <Divider />

<Divider />

<List>
  {menuItems.map((item) => (
    <Tooltip key={item.text} title={!open ? item.text : ''} placement="right">
      <ListItem
        button
        key={item.text}
        onClick={() => {
          navigate(item.path);
          if (variant === 'temporary') onClose();
        }}
        sx={{
          // Layout
          justifyContent: open ? 'initial' : 'center',
          px: open ? 2 : 1,
          my: 0.5,
          borderRadius: '8px',
          
          // Background Colors
          bgcolor: isActive(item.path) 
            ? 'rgba(0, 0, 0, 0.1)'  // Slightly darker when active
            : 'transparent',
          
          // Text Colors
          color: isActive(item.path) 
            ? 'black'  // Darker text for active items
            : 'rgba(0, 0, 0, 0.7)',  // Semi-transparent black for inactive
          
          // Hover Effects
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            color: 'black',
          },
          
          // Animation
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {(open || !isMobile) && (
          <ListItemIcon
            sx={{
              // Icon Colors
              color: isActive(item.path) 
                ? 'black' 
                : 'rgba(0, 0, 0, 0.7)',
              minWidth: open ? 40 : 'auto',
              justifyContent: 'center',
            }}
          >
            {item.icon}
          </ListItemIcon>
        )}

        {open && (
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontWeight: isActive(item.path) ? 600 : 500,
            }}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          />
        )}
      </ListItem>
    </Tooltip>
  ))}
</List>

<Divider />

<List>
  {secondaryItems.map((item) => (
    <ListItem
      button
      key={item.text}
      onClick={() => {if(item.text==="Logout")
        logout(); else
        navigate(item.path);
        if (variant === 'temporary') onClose();
      }}
      sx={{
        // Same styling as main menu items
        justifyContent: open ? 'initial' : 'center',
        px: open ? 2 : 1,
        my: 0.5,
        borderRadius: '8px',
        bgcolor: isActive(item.path) 
          ? 'rgba(0, 0, 0, 0.1)'
          : 'transparent',
        color: isActive(item.path) 
          ? 'black'
          : 'rgba(0, 0, 0, 0.7)',
        '&:hover': {
          bgcolor: 'rgba(0, 0, 0, 0.05)',
          color: 'black',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {(open || !isMobile) && (
        <ListItemIcon
          sx={{
            color: isActive(item.path) 
              ? 'black'
              : 'rgba(0, 0, 0, 0.7)',
            minWidth: open ? 40 : 'auto',
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </ListItemIcon>
      )}
      
      { (open )&&(
        <ListItemText
          primary={item.text}
          primaryTypographyProps={{
            fontWeight: isActive(item.path) ? 600 : 500,
          }}
        />
      )}
    </ListItem>
  ))}
</List>
      </Box>
    </Drawer> )} </>
  );
};

export default React.memo(SidebarJobseeker);
