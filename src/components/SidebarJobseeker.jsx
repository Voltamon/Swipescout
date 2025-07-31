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
  Tooltip,
  IconButton
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
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  VideoLibrary as VideoLibraryIcon,
  Videocam as VideocamIcon,
  AccountBox as AccountBoxIcon,
  ListAlt as ListAltIcon,
  VideoCall as VideoCallIcon,
  Plagiarism as PlagiarismIcon,
  ScreenSearchDesktop as ScreenSearchDesktopIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";

const expandedWidth = 240; // Slightly wider for better readability
const collapsedWidth = 72;

const SidebarJobseeker = ({ open = true, onClose, variant, isMobile }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const jobseeker_menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <AccountBoxIcon />, path: '/Job-seeker-profile' },
    { text: 'My Videos', icon: <VideocamIcon />, path: '/videos' },
    // { text: 'Demo Videos', icon: <VideoLibraryIcon />, path: '/Employer-explore-sidebar' },
    // { text: 'Jobs List', icon: <ListAltIcon />, path: '/jobs-listing-page' },
    { text: 'Upload Video', icon: <VideoCallIcon />, path: '/video-upload' },
    // { text: 'Company Videos', icon: <ScreenSearchDesktopIcon />, path: '/company-videos' },
    // { text: 'Jobs Search', icon: <PlagiarismIcon />, path: '/job-search' },
    // { text: 'My Applications', icon: <CandidatesIcon />, path: '/MyApplications-page' },
    { text: 'Messages', icon: <MessagesIcon />, path: '/chat' },
    // { text: 'Analytics', icon: <AnalyticsIcon />, path: '/job-seeker/dashboard' },
  ];

  const secondaryItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help Center', icon: <HelpIcon />, path: '/help' },
    { text: 'Logout', icon: <LogoutIcon />, path: '#' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  // Dynamic background based on role for a more modern look
  const roleBackground = {
    job_seeker: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
    // Add other roles if this sidebar were to be used for them
  };

  return (
    <Drawer
      variant={variant} // "permanent" or "temporary"
      open={open}
      onClose={onClose} // For temporary drawer on mobile
      sx={{
        width: open ? expandedWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? expandedWidth : collapsedWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
          overflowY: 'auto', // Enable scrolling for sidebar content
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': {
            width: 0, // Chrome, Safari
            height: 0,
          },
          borderRadius: '0 16px 16px 0', // Rounded corners on the right side
          boxShadow: theme.shadows[4], // More prominent shadow
          background: roleBackground.job_seeker, // Apply gradient background
          color: theme.palette.primary.contrastText, // White text for contrast
        },
      }}
    >
      <Toolbar sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center',
        px: open ? 2 : 1,
        minHeight: '64px !important', // Ensure consistent height
        borderBottom: `1px solid ${theme.palette.secondary.dark}`, // Subtle border
      }}>
        {open ? (
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.contrastText }}>
            Job Seeker Panel
          </Typography>
        ) : (
          <PersonSearchIcon sx={{ color: theme.palette.primary.contrastText }} /> // Icon for collapsed state
        )}
      </Toolbar>

      <Box sx={{ overflow: 'auto', flexGrow: 1, py: 2 }}>
        {/* User Profile Section */}
        <Box sx={{ p: open ? 2 : 1, display: 'flex', flexDirection: open ? 'row' : 'column', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => navigate("/Job-seeker-profile")}
            aria-label="view job seeker profile"
            sx={{ p: 0 }}
          >
            <Avatar
              src={user?.photo_url ? VITE_API_BASE_URL + user.photo_url : user?.photoUrl || ''}
              alt={user?.name?.charAt(0) || user?.display_name?.charAt(0) || 'U'}
              sx={{
                width: open ? 60 : 40,
                height: open ? 60 : 40,
                mr: open ? 2 : 0,
                border: `3px solid ${theme.palette.primary.main}`, // Accent border color
                boxShadow: theme.shadows[3],
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {user?.name?.charAt(0) || user?.display_name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          {open && (
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.primary.contrastText }}>
                {user?.display_name || user?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText + 'B3' }}>
                {user?.role?.replace('_', ' ') || 'Job Seeker'}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 1, borderColor: theme.palette.secondary.dark }} />

        {/* Main Menu Items */}
        <List>
          {jobseeker_menuItems.map((item) => (
            <Tooltip key={item.text} title={!open ? item.text : ''} placement="right">
              <ListItem
                button
                onClick={() => {
                  navigate(item.path);
                  if (variant === 'temporary') onClose();
                }}
                sx={{
                  justifyContent: open ? 'initial' : 'center',
                  px: open ? 2 : 1,
                  my: 0.5,
                  borderRadius: theme.shape.borderRadius,
                  bgcolor: isActive(item.path)
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'transparent',
                  color: isActive(item.path)
                    ? theme.palette.primary.contrastText
                    : theme.palette.primary.contrastText + 'CC',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: theme.palette.primary.contrastText,
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path)
                      ? theme.palette.primary.contrastText
                      : theme.palette.primary.contrastText + 'CC',
                    minWidth: open ? 40 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 700 : 500,
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

        <Divider sx={{ my: 1, borderColor: theme.palette.secondary.dark }} />

        {/* Secondary Menu Items */}
        <List>
          {secondaryItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                if (item.text === "Logout")
                  logout();
                else
                  navigate(item.path);
                if (variant === 'temporary') onClose();
              }}
              sx={{
                justifyContent: open ? 'initial' : 'center',
                px: open ? 2 : 1,
                my: 0.5,
                borderRadius: theme.shape.borderRadius,
                bgcolor: isActive(item.path)
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'transparent',
                color: isActive(item.path)
                  ? theme.palette.primary.contrastText
                  : theme.palette.primary.contrastText + 'CC',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: theme.palette.primary.contrastText,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path)
                    ? theme.palette.primary.contrastText
                    : theme.palette.primary.contrastText + 'CC',
                  minWidth: open ? 40 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 700 : 500,
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default React.memo(SidebarJobseeker);
