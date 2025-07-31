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
  ManageSearch as ManageSearchIcon,
  VideoLibrary as VideoLibraryIcon,
  Videocam as VideocamIcon,
  VideoCameraFront as VideoCameraFrontIcon,
  AccountBox as AccountBoxIcon,
  AddCard as AddCardIcon,
  ListAlt as ListAltIcon,
  VideoCall as VideoCallIcon,
  Plagiarism as PlagiarismIcon,
  VideoFile as VideoFileIcon,
} from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";

const expandedWidth = 240; // Slightly wider for better readability
const collapsedWidth = 72;

const Sidebar = ({ open = true, onClose, variant, isMobile }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const employer_menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/employer-dashboard' },
    { text: 'My Videos', icon: <VideocamIcon />, path: '/videos' },
    { text: 'Profile', icon: <AccountBoxIcon />, path: '/employer-profile' },
    // { text: 'Demo Videos', icon: <VideoLibraryIcon />, path: '/jobseeker-explore-sidebar' },
    { text: 'Upload Video', icon: <VideoCallIcon />, path: '/video-upload' },
    { text: 'Post Job', icon: <AddCardIcon />, path: '/Post-job-page' },
    { text: 'Jobs List', icon: <ListAltIcon />, path: '/jobs-listing-page' },
    { text: 'Search', icon: <PlagiarismIcon />, path: '/candidate-search' },
    { text: 'Messages', icon: <MessagesIcon />, path: '/chat' },
    // { text: 'Analytics', icon: <AnalyticsIcon />, path: '/employer/dashboard' },
  ];

  const secondaryItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help Center', icon: <HelpIcon />, path: '/help' },
    { text: 'Logout', icon: <LogoutIcon />, path: '#' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  // Dynamic background based on role for a more modern look
  const roleBackground = {
    employer: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
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
          background: roleBackground.employer, // Apply gradient background
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
        borderBottom: `1px solid ${theme.palette.primary.dark}`, // Subtle border
      }}>
        {open ? (
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.contrastText }}>
            Employer Panel
          </Typography>
        ) : (
          <Business sx={{ color: theme.palette.primary.contrastText }} /> // Icon for collapsed state
        )}
      </Toolbar>

      <Box sx={{ overflow: 'auto', flexGrow: 1, py: 2 }}>
        {/* User Profile Section */}
        <Box sx={{ p: open ? 2 : 1, display: 'flex', flexDirection: open ? 'row' : 'column', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => navigate("/employer-profile")}
            aria-label="view employer profile"
            sx={{ p: 0 }}
          >
            <Avatar
              src={user?.photo_url ? VITE_API_BASE_URL + user.photo_url : user?.photoUrl || ''}
              alt={user?.name?.charAt(0) || user?.display_name?.charAt(0) || 'U'}
              sx={{
                width: open ? 60 : 40,
                height: open ? 60 : 40,
                mr: open ? 2 : 0,
                border: `3px solid ${theme.palette.secondary.main}`, // Accent border color
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
                {user?.name || user?.displayName || user?.display_name}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText + 'B3' }}> {/* Slightly transparent white */}
                {user?.role?.replace('_', ' ') || 'Employer'}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 1, borderColor: theme.palette.primary.dark }} />

        {/* Main Menu Items */}
        <List>
          {employer_menuItems.map((item) => (
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
                  borderRadius: theme.shape.borderRadius, // Apply global border radius
                  bgcolor: isActive(item.path)
                    ? 'rgba(255, 255, 255, 0.2)' // Light background for active
                    : 'transparent',
                  color: isActive(item.path)
                    ? theme.palette.primary.contrastText // White text for active
                    : theme.palette.primary.contrastText + 'CC', // Slightly transparent white for inactive
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)', // Lighter hover background
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
                      fontWeight: isActive(item.path) ? 700 : 500, // Bold active text
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

        <Divider sx={{ my: 1, borderColor: theme.palette.primary.dark }} />

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

export default React.memo(Sidebar);
