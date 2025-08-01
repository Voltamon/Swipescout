import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Typography,
  IconButton,
  Toolbar,
  Avatar,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Home,
  Chat,
  ExitToApp,
  Notifications as NotificationsIcon,
  VideoCall as VideoCallIcon,
} from "@mui/icons-material";
import { useAuth } from '../../../hooks/useAuth';

const Header = ({ darkMode, setDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout, role } = useAuth();

  const handleProfileClick = () => {
    const path = roleProfileNav(role);
    console.log('Navigating with role:', role, 'to:', path);
    // navigate(path);
  };

  const handleLogout = () => {
    logout();
    // navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ boxShadow: 'none', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Left section: App title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Swip<span style={{ color: theme.palette.primary.main }}>scout</span>
            </Typography>
          </Box>

          {/* Right section: Navigation icons and User Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0.5 : 2 }}>
            {/* Dark/Light Mode Toggle Icon */}
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)} sx={{ color: theme.palette.text.primary }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <IconButton color="inherit" onClick={() => navigate("/")} sx={{ color: theme.palette.text.primary }}>
              <Home />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate("/chat")} sx={{ color: theme.palette.text.primary }}>
              <Chat />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate("/notifications")} sx={{ color: theme.palette.text.primary }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate("/video-upload")} sx={{ color: theme.palette.text.primary }}>
              <VideoCallIcon />
            </IconButton>

            <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
              <Avatar
                src={user?.photo_url ? VITE_API_BASE_URL + user.photo_url : user?.photoUrl || ''}
                alt={user?.displayName?.[0] || user?.name?.[0] || 'U'}
                sx={{
                  width: 40,
                  height: 40,
                  border: `2px solid ${theme.palette.text.primary}`,
                  boxShadow: theme.shadows[2],
                }}
              >
                {user?.displayName?.[0] || user?.name?.[0] || 'U'}
              </Avatar>
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout} sx={{ color: theme.palette.text.primary }}>
              <ExitToApp />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;