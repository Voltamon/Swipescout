import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Chat,
  Person,
  ExitToApp,
  Notifications as NotificationsIcon, // Added Notifications icon
  VideoCall as VideoCallIcon, // Added VideoCall icon
} from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth"; // Assuming correct path

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function to determine profile navigation path based on role
function roleProfileNav(role) {
  if (!role) return "/";
  switch (role.toLowerCase()) {
    case "job_seeker":
      return "/job-seeker-profile";
    case "employer":
      return "/employer-profile";
    case "admin":
      return "/admin-profile";
    default:
      return "/";
  }
}

const Header = ({ onSidebarToggle, isSidebarVisible }) => {
  const navigate = useNavigate();
  const { user, logout, role } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleProfileClick = () => {
    const path = roleProfileNav(role);
    console.log('Navigating with role:', role, 'to:', path);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Only render header if isSidebarVisible is true (i.e., not on login/signup/video feed pages)
  if (!isSidebarVisible) return null;

  return (
    <AppBar
      position="static" // Changed to static to integrate better with Layout's sticky header wrapper
      color="transparent" // Make AppBar background transparent to allow HeaderWrapper to control it
      elevation={0} // Remove default shadow
      sx={{
        height: 56,
        justifyContent: "center",
        px: isMobile ? 1 : 2, // Responsive padding
        borderRadius: theme.shape.borderRadius, // Apply global border radius
        backgroundColor: theme.palette.background.paper, // Use paper background
        boxShadow: theme.shadows[1], // Subtle shadow
        mb: isMobile ? 0 : theme.spacing(2), // Margin bottom for spacing with main content
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Left section: Menu icon (on mobile) and App title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isMobile && ( // Show menu icon only on mobile
            <IconButton edge="start" color="inherit" onClick={onSidebarToggle} sx={{ color: theme.palette.text.primary }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: theme.palette.primary.main, // Use primary color for brand
              display: isMobile ? 'none' : 'block', // Hide title on small mobile screens
            }}
          >
            Swipscout
          </Typography>
        </Box>

        {/* Right section: Navigation icons and User Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0.5 : 2 }}>
          <IconButton color="inherit" onClick={() => navigate("/")} sx={{ color: theme.palette.text.secondary }}>
            <Home />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate("/chat")} sx={{ color: theme.palette.text.secondary }}>
            <Chat />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate("/notifications")} sx={{ color: theme.palette.text.secondary }}>
            <NotificationsIcon />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate("/video-upload")} sx={{ color: theme.palette.text.secondary }}>
            <VideoCallIcon />
          </IconButton>

          <IconButton onClick={handleProfileClick} sx={{ p: 0 }}> {/* No padding for avatar button */}
            <Avatar
              src={user?.photo_url ? VITE_API_BASE_URL + user.photo_url : user?.photoUrl || ''}
              alt={user?.displayName?.[0] || user?.name?.[0] || 'U'}
              sx={{
                width: 40,
                height: 40,
                border: `2px solid ${theme.palette.primary.main}`, // Border with primary color
                boxShadow: theme.shadows[2], // Subtle shadow
              }}
            >
              {user?.displayName?.[0] || user?.name?.[0] || 'U'}
            </Avatar>
          </IconButton>

          <IconButton color="inherit" onClick={handleLogout} sx={{ color: theme.palette.text.secondary }}>
            <ExitToApp />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
