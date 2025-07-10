import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PlayCircle, Work, People, VideoCall, TrendingUp, CheckCircle, Visibility, VisibilityOff, Google as GoogleIcon, LinkedIn as LinkedInIcon } from "@mui/icons-material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(59, 130, 246, 0.5)',
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
        <Logo variant="h6" component={Link} to="/" sx={{ textDecoration: 'none' }}>
          Swipe<span>scout</span>
        </Logo>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <NavButton component={Link} to="/">Home</NavButton>
          <NavButton component={Link} to="/about">About</NavButton>
          <NavButton component={Link} to="/FAQs">FAQ</NavButton>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

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
          }}
        >
          Login
        </Button>
        
        <Avatar
          sx={{ bgcolor: '#dbeafe', cursor: 'pointer', color: '#3b82f6', ml: 2 }}
          onClick={handleMenuOpen}
        >
          JD
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