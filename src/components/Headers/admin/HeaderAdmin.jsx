import React ,{useEffect} from "react";
import {
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Typography,
  Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Chat,
  Person,
  ExitToApp
} from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function roleProfileNav(role) {
  if (!role) return "/"; // Handle undefined/null role
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
  
  // Add loading state if needed
  // const { loading } = useAuth();
  
  const handleProfileClick = () => {
    const path = roleProfileNav(role);
    console.log('Navigating with role:', role, 'to:', path); // Debug log
    navigate(path);
  };
  useEffect(() => {
    console.log('Role updated:', role);
  }, [role]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isSidebarVisible) return null;

  return (
    <AppBar 
      position="static" 
      color="default"
      elevation={1}
      sx={{
        background: 'rgba(182, 202, 233, 0.34)',
        height: 56,
        justifyContent: "center",
        px: 2,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton edge="start" color="inherit" onClick={onSidebarToggle}>
            <MenuIcon />
          </IconButton>
        </Box>
        
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Swipscout
        </Typography>
        
        <IconButton color="inherit" onClick={() => navigate("/")}>
          <Home />
        </IconButton>
        
        <IconButton color="inherit" onClick={() => navigate("/chat")}>
          <Chat />
        </IconButton>
        
        <IconButton color="inherit" onClick={handleProfileClick}>
          <Person />
        </IconButton>
        
        <IconButton color="inherit" onClick={handleLogout}>
          <ExitToApp />
        </IconButton>
        
        <IconButton onClick={handleProfileClick}>
          <Avatar sx={{ marginLeft: 2 }} src={VITE_API_BASE_URL+user.photo_url}>
          
            {user?.displayName?.[0] || 'A'}
          </Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;