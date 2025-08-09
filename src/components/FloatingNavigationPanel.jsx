// components/FloatingNavigationPanel.jsx
// This component renders the floating navigation panel with role-specific buttons.

import React, { useMemo } from 'react';
import { Paper, IconButton, styled, Typography } from "@mui/material";
import {
  Work as WorkIcon,
  VideoLibrary as VideoLibraryIcon,
  ListAlt as ListAltIcon,
  Assessment as AnalyticsIcon,
  Settings as SettingsIcon,
  Message as MessagesIcon,
  People as CandidatesIcon,
 
  Help as HelpIcon,
  Logout as LogoutIcon,
  

  AccountBox as AccountBoxIcon,
} from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import VideocamIcon from '@mui/icons-material/Videocam';

// Styled components
const FloatingPanel = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: `calc(${theme.spacing(2)} + 136px)`,
  left: theme.spacing(8),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(29, 32, 46, 0.7)' : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('sm')]: {
    top: 'auto',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    right: 'auto',
    flexDirection: 'row',
    width: 'auto',
  },
}));

const FloatingButton = styled(IconButton)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  '& .MuiTypography-caption': {
    fontSize: '0.7rem',
    color: theme.palette.text.primary,
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'row',
    gap: theme.spacing(1),
    '& .MuiTypography-caption': {
      fontSize: '0.8rem',
    },
  },
}));

const FloatingNavigationPanel = ({ role, onPageChange }) => {
  const jobSeekerButtons = useMemo(() => [
    { label: 'Dashboard', icon: <DashboardIcon />, page: 'dashboard' },
    { label: 'Videos', icon: <VideoLibraryIcon />, page: 'videos' },
    { label: 'Employers', icon: <WorkIcon />, page: 'dashboard' },
    { label: 'Profile', icon: <AccountBoxIcon />, page: 'jobseekerprofile' },
    { label: 'Messeges', icon: <MessagesIcon />, page: 'messeges' },
  ], []);

  const employerButtons = useMemo(() => [
    { label: 'Dashboard', icon: <DashboardIcon />, page: 'dashboard' },
    { label: 'Candidates', icon: <ListAltIcon />, page: 'candidates' },
    { label: 'Videos', icon: <VideocamIcon />, page: 'videos' },
    { label: 'Profile', icon: <AccountBoxIcon />, page: 'employerprofile' },
    { label: 'Messeges', icon: <MessagesIcon />, page: 'messeges' },
  ], []);

  const buttons = role === 'job_seeker' ? jobSeekerButtons : employerButtons;

  return (
    <FloatingPanel>
      {buttons.map((button) => (
        <FloatingButton
          key={button.page}
          color="primary"
          onClick={() => onPageChange(button.page)}
          aria-label={button.label}
        >
          {button.icon}
          <Typography variant="caption">{button.label}</Typography>
        </FloatingButton>
      ))}
    </FloatingPanel>
  );
};

export default FloatingNavigationPanel;
