import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  Avatar, 
  Menu, 
  MenuItem, 
  useTheme, 
  useMediaQuery,
  IconButton,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Link, 
  useNavigate 
} from 'react-router-dom';
import { 
  Person,
  Settings,
  HelpCenter,
  Logout,
  AccountBox,
  Dashboard,
  Work,
  People,
  VideoLibrary
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';

import { useAuth } from "../../contexts/AuthContext";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.paper,
  backdropFilter: 'blur(8px)',
  boxShadow: theme.shadows[2],
  padding: theme.spacing(1, 0),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: theme.spacing(0, 3),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 4),
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: theme.palette.primary.main,
  '& span': {
    color: theme.palette.secondary.main,
  },
  '& .tagline': {
    fontSize: '0.7rem',
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: '600',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Get authentication context
  const { user, isAuthenticated, logout } = useAuth() || {};

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleMenuClose();
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email;
    }
    return t('header.welcome');
  };

  const getDashboardPath = () => {
    if (!user?.role) return '/dashboard';
    
    switch (user.role) {
      case 'job_seeker': 
        return '/jobseeker-tabs';
      case 'employer': 
        return '/employer-tabs';
      case 'admin': 
        return '/admin-dashboard';
      default: 
        return '/dashboard';
    }
  };

  const getQuickActions = () => {
    if (!user?.role) return [];
    
    switch (user.role) {
      case 'job_seeker':
        return [
          { icon: <Work />, label: t('jobSeeker.findJobs'), path: '/jobseeker-tabs?tab=jobs' },
          { icon: <VideoLibrary />, label: t('jobSeeker.myVideos'), path: '/jobseeker-tabs?tab=videos' },
        ];
      case 'employer':
        return [
          { icon: <People />, label: t('employer.findCandidates'), path: '/employer-tabs?tab=candidates' },
          { icon: <Work />, label: t('employer.myJobs'), path: '/employer-tabs?tab=jobs' },
        ];
      default:
        return [];
    }
  };

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={`${VITE_BASE_URL}/public/logoT.png`}
            alt="SwipeScout Logo"
            sx={{ height: 40, mr: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
          <Logo variant="h6" component={Link} to="/" sx={{ textDecoration: 'none' }}>
            Swipe<span>scout</span>
            {!isMobile && (
              <Typography component="span" className='tagline'>
                {t('homepage.subtitle')}
              </Typography>
            )}
          </Logo>
        </Box>

        {/* Navigation Links (Hidden on small screens) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 'auto' }}>
          <NavButton component={Link} to="/">{t('navigation.home')}</NavButton>
          <NavButton onClick={() => navigate('/videos/all')}>{t('header.exploreVideos')}</NavButton>
          <NavButton component={Link} to="/pricing">{t('navigation.pricing')}</NavButton>
          <NavButton component={Link} to="/about">{t('navigation.about')}</NavButton>
          <NavButton component={Link} to="/contact">{t('navigation.contact')}</NavButton>
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { xs: 'auto', md: 2 } }}>
          {/* Language Selector */}
          <LanguageSelector variant="menu" showLabel={!isMobile} />

          {/* Authentication Section */}
          {isAuthenticated && user ? (
            <>
              {/* Welcome Text (Desktop only) */}
              {!isMobile && (
                <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                  {t('header.welcome')}, {user.firstName || user.email?.split('@')[0]}
                </Typography>
              )}
              
              {/* User Avatar */}
              <Avatar
                sx={{
                  bgcolor: theme.palette.secondary.light,
                  cursor: 'pointer',
                  color: theme.palette.secondary.contrastText,
                  width: 36,
                  height: 36,
                  boxShadow: theme.shadows[1],
                }}
                onClick={handleMenuOpen}
              >
                {getUserInitials()}
              </Avatar>
            </>
          ) : (
            <>
              {/* Login/Register Buttons for non-authenticated users */}
              <Button
                variant="outlined"
                size="small"
                component={Link}
                to="/login"
                sx={{
                  mr: 1,
                  display: { xs: 'none', sm: 'flex' },
                }}
              >
                {t('header.login')}
              </Button>
              <Button
                variant="contained"
                size="small"
                component={Link}
                to="/register"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                  px: 2,
                  borderRadius: '20px',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                {t('header.register')}
              </Button>
            </>
          )}

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[3],
                minWidth: 220,
                mt: 1,
              }
            }}
          >
            {isAuthenticated && user && (
              <>
                {/* User Info Header */}
                <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {getUserInitials()}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={getUserDisplayName()}
                    secondary={user.email}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </MenuItem>
                <Divider />

                {/* Dashboard */}
                <MenuItem onClick={() => handleNavigation(getDashboardPath())}>
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary={t('common.dashboard')} />
                </MenuItem>

                {/* Quick Actions based on user role */}
                {getQuickActions().map((action, index) => (
                  <MenuItem key={index} onClick={() => handleNavigation(action.path)}>
                    <ListItemIcon>
                      {action.icon}
                    </ListItemIcon>
                    <ListItemText primary={action.label} />
                  </MenuItem>
                ))}

                <Divider />

                {/* Profile Settings */}
                <MenuItem onClick={() => handleNavigation('/profile/settings')}>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary={t('header.profileSettings')} />
                </MenuItem>

                {/* Account */}
                <MenuItem onClick={() => handleNavigation('/account')}>
                  <ListItemIcon>
                    <AccountBox />
                  </ListItemIcon>
                  <ListItemText primary={t('header.account')} />
                </MenuItem>

                {/* Help Center */}
                <MenuItem onClick={() => handleNavigation('/help')}>
                  <ListItemIcon>
                    <HelpCenter />
                  </ListItemIcon>
                  <ListItemText primary={t('header.helpCenter')} />
                </MenuItem>

                <Divider />

                {/* Logout */}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary={t('header.logout')} />
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;
// No code changes required in this frontend file for CORS fix.

