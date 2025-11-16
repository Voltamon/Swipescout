import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageSelector from '../LanguageSelector';
import NotificationCenter from '@/components/NotificationCenter';

const drawerWidth = 280;

const DashboardLayout = ({ 
  children, 
  sidebarItems = [], 
  title = 'Dashboard',
  userInfo = {},
  onThemeToggle,
  isDarkMode = false
}) => {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Removed: unused variable
  const { t, isRTL } = useTranslation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          SwipeScout
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('common.dashboard')}
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Navigation Items */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 1, py: 2 }}>
          {sidebarItems}
        </List>
      </Box>
      
      {/* User Info at Bottom */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={userInfo.avatar} 
            alt={userInfo.name}
            sx={{ width: 40, height: 40 }}
          >
            {userInfo.name?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {userInfo.name || t('common.welcome')}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {userInfo.role || userInfo.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          mr: { md: isRTL ? `${drawerWidth}px` : 0 },
          ml: { md: isRTL ? 0 : `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {/* Theme Toggle */}
          <Tooltip title={isDarkMode ? t('common.lightMode') : t('common.darkMode')}>
            <IconButton color="inherit" onClick={onThemeToggle}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* Language Switcher */}
          <Box sx={{ mx: 1 }}>
            <LanguageSelector variant="menu" showLabel={true} />
          </Box>

          {/* Notifications */}
          <NotificationCenter />

          {/* Profile Menu */}
          <Tooltip title={t('common.profile')}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar 
                src={userInfo.avatar} 
                alt={userInfo.name}
                sx={{ width: 32, height: 32 }}
              >
                {userInfo.name?.charAt(0) || <AccountCircle />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              direction: isRTL ? 'rtl' : 'ltr'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              direction: isRTL ? 'rtl' : 'ltr'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: 'background.default'
        }}
      >
        {children}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <Avatar /> {t('common.profile')}
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <SettingsIcon sx={{ mr: 2 }} /> {t('common.settings')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileMenuClose}>
          <LogoutIcon sx={{ mr: 2 }} /> {t('common.logout')}
        </MenuItem>
      </Menu>

      {/* Notifications popover handled by NotificationCenter */}
    </Box>
  );
};

export default DashboardLayout;
