import React, { useState, useEffect } from 'react';
import {
  Box,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home,
  Search,
  VideoLibrary,
  Work,
  Person,
  Chat,
  Notifications,
  Settings,
  Help,
  ExitToApp,
  Business,
  Analytics,
  PostAdd,
  CalendarToday,
  Bookmark,
  Favorite,
  Edit,
  Dashboard,
  Psychology,
  CloudUpload
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployerTabCategories } from '../config/employerTabsConfig';
import { jobseekerTabCategories } from '../config/jobseekerTabsConfig';

const FloatingNavigationPanel = ({ role, onPageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const [messages, setMessages] = useState(2); // Mock message count
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Normalize role to support both string and array shapes
  const _roleArray = Array.isArray(role) ? role : (role ? [role] : []);
  const isJobSeeker = _roleArray.includes('job_seeker') || _roleArray.includes('employee');
  const isEmployer = _roleArray.includes('employer') || _roleArray.includes('recruiter');
  const roleLabel = (_roleArray[0] || (typeof role === 'string' ? role : 'USER'))
    .toString()
    .replace('_', ' ')
    .toUpperCase();

  // Common items used by admin (and as a fallback)
  const commonItems = [
    {
      text: t('nav.help', 'Help'),
      icon: <Help />,
      path: '/help',
      color: 'secondary',
      description: 'Help and support'
    },
    {
      text: t('nav.about', 'About'),
      icon: <Help />,
      path: '/about',
      color: 'primary',
      description: 'About SwipeScout'
    },
    {
      text: t('nav.contact', 'Contact'),
      icon: <Help />,
      path: '/contact',
      color: 'default',
      description: 'Contact us'
    }
  ];
  
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Helper to find tab group for a tab path
  const findTabGroupForPath = (categories, tabPath) => {
    for (const cat of categories) {
      if (cat.tabs.some(t => t.path === tabPath)) {
        return cat.key;
      }
    }
    return null;
  };

  // Fix: For employer and job_seeker, set both tab group and tab in URL for tab navigation
  const handleNavigation = (path) => {
    if (role === 'employer' && path.startsWith('/employer-tabs') && path.includes('?tab=')) {
      const tabMatch = path.match(/[?&]tab=([^&]+)/);
      const tabValue = tabMatch ? tabMatch[1] : null;
      let group = null;
      if (tabValue) {
        group = findTabGroupForPath(getEmployerTabCategories(t), tabValue);
      }
      if (group && tabValue) {
        onPageChange(`/employer-tabs?group=${group}&tab=${tabValue}`);
      } else {
        onPageChange(path);
      }
    } else if (role === 'job_seeker' && path.startsWith('/jobseeker-tabs') && path.includes('?tab=')) {
      const tabMatch = path.match(/[?&]tab=([^&]+)/);
      const tabValue = tabMatch ? tabMatch[1] : null;
      let group = null;
      if (tabValue) {
        group = findTabGroupForPath(jobseekerTabCategories(), tabValue);
      }
      if (group && tabValue) {
        onPageChange(`/jobseeker-tabs?group=${group}&tab=${tabValue}`);
      } else {
        onPageChange(path);
      }
    } else {
      onPageChange(path);
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (isJobSeeker) {
      return [
        {
          text: t('nav.home', 'Home'),
          icon: <Home />,
          path: '/',
          color: 'primary',
          description: 'Go to homepage'
        },
        {
          text: t('nav.dashboard', 'Dashboard'),
          icon: <Dashboard />,
          path: `/jobseeker-tabs?group=dashboard&tab=overview`,
          color: 'primary',
          description: 'Your job seeker dashboard'
        },
        {
          text: t('nav.analytics', 'Analytics'),
          icon: <Analytics />,
          path: `/jobseeker-tabs?group=dashboard&tab=analytics`,
          color: 'warning',
          description: 'View analytics and insights'
        },
        {
          text: t('nav.uploadvideo', 'Upload Video'),
          icon: <CloudUpload />, // Corrected to use the CloudUpload icon
          path: `/jobseeker-tabs?group=profileContent&tab=video-upload`,
          color: 'success',
          description: 'Upload new video'
        },
        {
          text: t('nav.findJobs', 'Find Jobs'),
          icon: <Search />,
          path: `/jobseeker-tabs?group=jobSearch&tab=find-jobs`,
          color: 'success',
          description: 'Search for job opportunities'
        },
        {
          text: t('nav.videoFeed', 'Video Feed'),
          icon: <VideoLibrary />,
          path: `/jobseeker-tabs?group=jobSearch&tab=video-feed`,
          color: 'info',
          description: 'Browse job-related videos'
        },
        {
          text: t('nav.myProfile', 'My Profile'),
          icon: <Person />,
          path: `/jobseeker-tabs?group=profileContent&tab=my-profile`,
          color: 'default',
          description: 'Manage your profile'
        },
        {
          text: t('nav.resumeBuilder', 'Resume Builder'),
          icon: <Work />,
          path: `/jobseeker-tabs?group=profileContent&tab=resume-builder`,
          color: 'primary',
          description: 'Build your resume'
        },
        {
          text: t('nav.myVideos', 'My Videos'),
          icon: <VideoLibrary />,
          path: `/jobseeker-tabs?group=profileContent&tab=my-videos`,
          color: 'info',
          description: 'Your uploaded videos'
        },
        {
          text: t('nav.aiAnalysis', 'AI Analysis'),
          icon: <Psychology />,
          path: '/ai-analysis',
          color: 'primary',
          description: 'AI-powered profile analysis'
        },
        {
          text: t('nav.aiInterview', 'AI Interview'),
          icon: <Psychology />,
          path: '/ai-interview',
          color: 'secondary',
          description: 'AI interview practice'
        },
        {
          text: t('nav.templateInterview', 'Template Interview'),
          icon: <Psychology />,
          path: '/template-interview',
          color: 'info',
          description: 'Answer template-based interview questions'
        },
        {
          text: t('nav.aiMatching', 'AI Matching'),
          icon: <Psychology />,
          path: '/ai-matching',
          color: 'success',
          description: 'AI-powered job matching'
        },
        {
          text: t('nav.savedVideos', 'Saved Videos'),
          icon: <Bookmark />,
          path: `/jobseeker-tabs?group=savedLiked&tab=saved-videos`,
          color: 'warning',
          description: 'Your saved videos'
        },
        {
          text: t('nav.likedVideos', 'Liked Videos'),
          icon: <Favorite />,
          path: `/jobseeker-tabs?group=savedLiked&tab=liked-videos`,
          color: 'secondary',
          description: 'Videos you liked'
        },
        {
          text: t('nav.settings', 'Settings'),
          icon: <Settings />,
          path: `/jobseeker-tabs?group=activities&tab=settings`,
          color: 'default',
          description: 'Account settings'
        },
        {
          text: t('nav.notificationSettings', 'Notification Settings'),
          icon: <Notifications />,
          path: `/jobseeker-tabs?group=activities&tab=notification-settings`,
          color: 'warning',
          description: 'Manage notification settings'
        },
        {
          text: t('nav.interviews', 'Interviews'),
          icon: <CalendarToday />,
          path: `/jobseeker-tabs?group=communication&tab=interviews`,
          color: 'secondary',
          description: 'Manage interviews'
        },
        {
          text: t('nav.notifications', 'Notifications'),
          icon: <Notifications />,
          path: `/jobseeker-tabs?group=communication&tab=notifications`,
          color: 'warning',
          description: 'Check notifications'
        },
        {
          text: t('nav.chat', 'Chat'),
          icon: <Chat />,
          path: `/jobseeker-tabs?group=communication&tab=chat`,
          color: 'info',
          description: 'Chat with employers and support'
        }
      ];
    } else if (isEmployer) {
      return [
        {
          text: t('nav.home', 'Home'),
          icon: <Home />,
          path: '/',
          color: 'primary',
          description: 'Go to homepage'
        },
        {
          text: t('nav.dashboard', 'Dashboard'),
          icon: <Dashboard />,
          path: `/employer-tabs?group=dashboard&tab=overview`,
          color: 'primary',
          description: 'Your employer dashboard'
        },
        {
          text: t('nav.analytics', 'Analytics'),
          icon: <Analytics />,
          path: `/employer-tabs?group=dashboard&tab=analytics`,
          color: 'warning',
          description: 'View analytics and reports'
        },
        {
          text: t('nav.findCandidates', 'Find Candidates'),
          icon: <Search />,
          path: `/employer-tabs?group=talentAcquisition&tab=find-candidates`,
          color: 'success',
          description: 'Search for talented candidates'
        },
        {
          text: t('nav.candidateVideos', 'Candidate Videos'),
          icon: <VideoLibrary />,
          path: `/employer-tabs?group=talentAcquisition&tab=candidate-videos`,
          color: 'info',
          description: 'Browse candidate video profiles'
        },
        {
          text: t('nav.postJob', 'Post Job'),
          icon: <PostAdd />,
          path: `/employer-tabs?group=jobManagement&tab=post-job`,
          color: 'info',
          description: 'Create new job posting'
        },
        {
          text: t('nav.myJobs', 'My Jobs'),
          icon: <Work />,
          path: `/employer-tabs?group=jobManagement&tab=my-jobs`,
          color: 'default',
          description: 'Manage job listings'
        },
        {
          text: t('nav.companyProfile', 'Company Profile'),
          icon: <Business />,
          path: `/employer-tabs?group=companyContent&tab=company-profile`,
          color: 'default',
          description: 'Edit and view your company profile'
        },
        {
          text: t('nav.companyVideos', 'Company Videos'),
          icon: <VideoLibrary />,
          path: `/employer-tabs?group=companyContent&tab=company-videos`,
          color: 'primary',
          description: 'Manage company videos'
        },
        {
          text: t('nav.aiAnalysis', 'AI Analysis'),
          icon: <Psychology />,
          path: '/ai-analysis',
          color: 'primary',
          description: 'AI-powered candidate analysis'
        },
        {
          text: t('nav.templateManagement', 'Template Management'),
          icon: <Psychology />,
          path: '/template-management',
          color: 'warning',
          description: 'Create and manage interview templates'
        },
        {
          text: t('nav.templateAnalysis', 'Template Analysis'),
          icon: <Psychology />,
          path: '/template-analysis',
          color: 'error',
          description: 'Analyze template-based interview responses'
        },
        {
          text: t('nav.aiMatching', 'AI Matching'),
          icon: <Psychology />,
          path: '/ai-matching',
          color: 'success',
          description: 'AI-powered candidate matching'
        },
        {
          text: t('nav.videoUpload', 'Video Upload'),
          icon: <VideoLibrary />,
          path: role === 'employer' 
            ? `/employer-tabs?group=videoManagement&tab=video-upload`
            : `/jobseeker-tabs?group=videoManagement&tab=video-upload`,
          color: 'info',
          description: 'Upload new videos',
        },
        {
          text: t('nav.videoEditor', 'Video Editor'),
          icon: <Edit />,
          path: role === 'employer' 
            ? `/employer-tabs?group=videoManagement&tab=video-editor`
            : `/jobseeker-tabs?group=videoManagement&tab=video-editor`,
          color: 'secondary',
          description: 'Edit your videos',
        },
        {
          text: t('nav.messages', 'Messages'),
          icon: <Badge badgeContent={messages} color="error"><Chat /></Badge>,
          path: `/employer-tabs?group=communication&tab=chat`,
          color: 'info',
          description: 'View your messages'
        },
        {
          text: t('nav.notifications', 'Notifications'),
          icon: <Badge badgeContent={notifications} color="error"><Notifications /></Badge>,
          path: `/employer-tabs?group=managementSettings&tab=notifications`,
          color: 'warning',
          description: 'Check notifications'
        },
        {
          text: t('nav.settings', 'Settings'),
          icon: <Settings />,
          path: `/employer-tabs?group=managementSettings&tab=settings`,
          color: 'default',
          description: 'Account settings'
        },
        {
          text: t('nav.helpAndSupport', 'Help & Support'),
          icon: <Help />,
          path: `/employer-tabs?group=communication&tab=help`,
          color: 'secondary',
          description: 'Get help and support'
        }
      ];
    } else {
      return [
        { 
          text: t('nav.adminDashboard', 'Admin Dashboard'), 
          icon: <Dashboard />, 
          path: '/admin-dashboard', 
          color: 'primary',
          description: 'Admin control panel'
        },
        { 
          text: 'User Management', 
          icon: <Person />, 
          path: '/admin-dashboard?tab=users', 
          color: 'info',
          description: 'Manage users'
        },
        { 
          text: 'Video Management', 
          icon: <VideoLibrary />, 
          path: '/admin-dashboard?tab=videos', 
          color: 'warning',
          description: 'Manage videos'
        },
        { 
          text: 'Job Management', 
          icon: <Work />, 
          path: '/admin-dashboard?tab=jobs', 
          color: 'success',
          description: 'Manage job postings'
        },
        { 
          text: 'Reports & Moderation', 
          icon: <Analytics />, 
          path: '/admin-dashboard?tab=reports', 
          color: 'error',
          description: 'Handle reports and moderation'
        },
        { 
          text: t('nav.aiAnalysis', 'AI Analysis'),
          icon: <Psychology />, 
          path: '/admin-dashboard?tab=analytics', 
          color: 'secondary',
          description: 'AI system analytics'
        },
        { 
          text: 'System Settings', 
          icon: <Settings />, 
          path: '/admin-dashboard?tab=settings', 
          color: 'default',
          description: 'System configuration'
        },
        ...commonItems
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="navigation menu"
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          zIndex: theme.zIndex.speedDial,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease-in-out',
          boxShadow: theme.shadows[8],
        }}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </Fab>

      {/* Navigation Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: isMobile ? '85vw' : 320,
            maxWidth: 400,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            backdropFilter: 'blur(10px)',
            borderLeft: `1px solid ${theme.palette.divider}`,
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                src={user?.profilePicture}
                sx={{ 
                  width: 48, 
                  height: 48,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                }}
              >
                {user?.firstName?.[0] || user?.companyName?.[0] || 'U'}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap>
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.companyName || 'User'}
                </Typography>
                <Chip 
                  label={roleLabel || 'USER'} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <IconButton onClick={toggleDrawer} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Quick access to all your tools and features
            </Typography>
          </Box>

          {/* Navigation Items */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <List sx={{ p: 1 }}>
              {navigationItems.map((item, index) => (
                <Tooltip key={index} title={item.description} placement="left">
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        borderRadius: 2,
                        mx: 1,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          transform: 'translateX(-4px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <ListItemIcon sx={{ color: `${item.color}.main` }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: '0.9rem'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              ))}
            </List>
          </Box>

          {/* Footer */}
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                background: `linear-gradient(45deg, ${theme.palette.error.main}20, ${theme.palette.error.main}10)`,
                border: `1px solid ${theme.palette.error.main}30`
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ready to sign out?
              </Typography>
              <IconButton
                onClick={handleLogout}
                color="error"
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ExitToApp />
              </IconButton>
            </Paper>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};



export default FloatingNavigationPanel;



