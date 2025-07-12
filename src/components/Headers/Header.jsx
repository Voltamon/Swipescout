import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PlayCircle, Work, People, VideoCall, TrendingUp, CheckCircle, Visibility, VisibilityOff, Google as GoogleIcon, LinkedIn as LinkedInIcon } from "@mui/icons-material";

// Define VITE_BASE_URL
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  // Updated background to a brighter gradient with a slight difference
  background: 'linear-gradient(to right, rgba(96, 165, 250, 0.9), rgba(66, 133, 244, 0.9))', // Brighter blue gradient
  backdropFilter: 'blur(8px)',
  boxShadow: 'none',
  padding: theme.spacing(1, 0),
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 4),
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: theme.palette.common.white,
  '& span': {
    color: '#dbeafe',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: '600',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        {/* Logo in the left corner */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={`${VITE_BASE_URL}/public/logoT.png`} // Updated logo path to logoT.png
            alt="SwipeScout Logo"
            sx={{
              height: 40, // Adjust height as needed
              mr: 1, // Margin right for spacing
            }}
          />
          <Logo variant="h6" component={Link} to="/" sx={{ textDecoration: 'none' }}>
            Swipe<span>scout</span>
          </Logo>
        </Box>

        {/* Navigation buttons aligned to the right */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 'auto' }}>
          <NavButton component={Link} to="/">Home</NavButton>
          <NavButton component={Link} to="/about">About Us</NavButton>
          <NavButton component={Link} to="#">Contact</NavButton>
          <NavButton component={Link} to="/how-it-works">How SwipeScout Works</NavButton>
          <NavButton component={Link} to="/FAQs">FAQ</NavButton>
          <NavButton component={Link} to="#">Credits</NavButton>
          <NavButton component={Link} to="#">Customer Support</NavButton>
        </Box>

        <Button
          variant="contained"
          size="small"
          component={Link}
          to="/login"
          sx={{
            bgcolor: '#ffffff',
            color: '#3b82f6',
            fontWeight: 600,
            px: 2,
            borderRadius: '20px',
            display: { xs: 'none', md: 'flex' },
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
            },
            ml: 2, // Add margin to separate from nav buttons
          }}
        >
          Login
        </Button>
        
        <Avatar
          sx={{ bgcolor: '#dbeafe', cursor: 'pointer', color: '#3b82f6', ml: 2 }}
          onClick={handleMenuOpen}
        >
          u
        </Avatar>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleMenuClose}>Profile Settings</MenuItem>
          <MenuItem onClick={handleMenuClose}>Account</MenuItem>
          <MenuItem onClick={handleMenuClose}>Help Center</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;
