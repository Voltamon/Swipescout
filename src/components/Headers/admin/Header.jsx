import React, { useContext, useState  } from 'react';
import {
  AppBar,
  Box,
  Container,
  Typography,
  IconButton,
  Toolbar,
  Avatar,
  useTheme,
  useMediaQuery,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Home,
  Chat,
  ExitToApp,
  Notifications as NotificationsIcon,
  VideoCall as VideoCallIcon,
  Language as LanguageIcon,
  CloudUpload
} from "@mui/icons-material";
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = ({ darkMode, setDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const handleLanguageMenuOpen = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    handleLanguageMenuClose();
  };

  // Safe access to theme properties with fallbacks
  const borderColor = theme.palette.border?.primary || theme.palette.divider || '#e5e7eb';
  const iconColor = theme.palette.icon?.primary ||
                   (theme.palette.mode === 'light' ? '#4f46e5' : '#a78bfa');
  const headerBg = theme.palette.background?.header ||
                  (theme.palette.mode === 'light' ? '#ffffff' : '#1d202e');
  const textColor = theme.palette.text?.primary ||
                   (theme.palette.mode === 'light' ? '#2a3e50' : '#e9e9f4');
  const hoverBg = theme.palette.action?.hover ||
                 (theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.04)' : 'rgba(167, 139, 250, 0.04)');

  const handleProfileClick = () => {
    const path = role === 'job_seeker' ? '/jobseeker-tabs?page=jobseekerprofile' :
                 role === 'employer' ? '/employer-tabs?page=employerprofile' :
                 role === 'admin' ? '/admin-tabs?page=adminprofile' : '/';
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        color: textColor,
        py: 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: '64px !important'
          }}
        >
          {/* Left section: App title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
            onClick={() => navigate('/')}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: textColor,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Swipe<span style={{
                color: iconColor,
                marginLeft: '2px'
              }}>scout</span>
            </Typography>
          </Box>

          {/* Right section: Navigation icons and User Avatar */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 0.5 : 2
          }}>
            {/* Dark/Light Mode Toggle Icon */}
            <IconButton
              color="inherit"
              onClick={() => setDarkMode(!darkMode) }
              sx={{
                color: iconColor,
                '&:hover': {
                  backgroundColor: hoverBg
                }
              }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Language Toggle Icon */}
            <IconButton
              color="inherit"
              onClick={handleLanguageMenuOpen}
              sx={{
                color: iconColor,
                '&:hover': {
                  backgroundColor: hoverBg
                }
              }}
            >
              <LanguageIcon />
            </IconButton>

            <IconButton
              color="inherit"
              onClick={() => navigate("/")}
              sx={{
                color: iconColor,
                '&:hover': {
                  backgroundColor: hoverBg
                }
              }}
            >
              <Home />
            </IconButton>

            <IconButton
              color="inherit"
              onClick={() => {
                //navigate('/jobseeker-tabs?page=messeges')
                    const path = role === 'job_seeker' ? '/jobseeker-tabs?page=messeges' :
                 role === 'employer' ? '/employer-tabs?page=messeges' :
                 role === 'admin' ? '/admin-tabs?page=messeges' : '/';
    navigate(path);
              }}
              sx={{
                color: iconColor,
                '&:hover': {
                  backgroundColor: hoverBg
                }
              }}
            >
              <Badge badgeContent={4} color="secondary">
                <Chat />
              </Badge>
            </IconButton>

            {/* <IconButton
              color="inherit"
              onClick={() => navigate("/notifications")}
              sx={{
                color: iconColor,
                '&:hover': {
                  backgroundColor: hoverBg
                }
              }}
            >
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
     
            <IconButton
              color="inherit"
              onClick={() =>
                {
                 //navigate('/jobseeker-tabs?page=videos&tab=upload-video')}
                 const path = role === 'job_seeker' ? '/jobseeker-tabs?group=profileContent&tab=video-upload' :
                 role === 'employer' ? '/employer-tabs?group=profileContent&tab=upload-video' :
                 role === 'admin' ? '/admin-tabs?group=profileContent&tab=upload-video' : '/';
                 navigate(path);
                }
              }
              sx={{
                color: iconColor,
                '&:hover': {
                  backgroundColor: hoverBg
                }
              }}
            >
              <VideoCallIcon />
            </IconButton>

            {/* New Video Upload Button */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/video-upload')}
              sx={{ ml: 1 }}
            >
              <CloudUpload />
            </IconButton>

            <IconButton
              onClick={handleProfileClick}
              sx={{
                p: 0,
                ml: 1,
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              <Avatar
                src={user?.photoUrl ? `${import.meta.env.VITE_API_BASE_URL}${user.photoUrl}` : user?.photoUrl || ''}
                alt={user?.displayName?.[0] || user?.name?.[0] || 'U'}
                sx={{
                  width: 40,
                  height: 40,
                  border: `2px solid ${iconColor}`,
                }}
              >
                {user?.displayName?.[0] || user?.name?.[0] || 'U'}
              </Avatar>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{
                color: iconColor,
                '&:hover': {
                  backgroundColor: hoverBg
                }
              }}
            >
              <ExitToApp />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Language Selection Menu */}
      <Menu
        anchorEl={languageAnchorEl}
        open={Boolean(languageAnchorEl)}
        onClose={handleLanguageMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n.language === language.code}
          >
            <ListItemIcon>
              <span style={{ fontSize: '1.2em' }}>{language.flag}</span>
            </ListItemIcon>
            <ListItemText primary={language.name} />
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Header;