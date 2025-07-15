import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Menu, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.paper, // Use paper background from theme
  backdropFilter: 'blur(8px)',
  boxShadow: theme.shadows[2], // Subtle shadow
  padding: theme.spacing(1, 0), // Vertical padding
  borderRadius: theme.shape.borderRadius, // Apply global border radius
  margin: theme.spacing(2), // Add margin for a floating effect
  width: `calc(100% - ${theme.spacing(4)})`, // Account for margin
  left: '50%',
  transform: 'translateX(-50%)', // Center the header
  top: theme.spacing(2), // Position from top
  zIndex: theme.zIndex.appBar, // Ensure it's above other content
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: theme.spacing(0, 3), // Increased horizontal padding
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 4),
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: theme.palette.primary.main, // Use primary color for main logo text
  '& span': {
    color: theme.palette.secondary.main, // Use secondary color for "scout"
  },
  '& .tagline': {
    fontSize: '0.7rem',
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary, // Subtle tagline color
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary, // Use primary text color
  fontWeight: '600',
  borderRadius: theme.shape.borderRadius, // Apply global border radius
  '&:hover': {
    backgroundColor: theme.palette.action.hover, // Subtle hover background
    color: theme.palette.primary.main, // Primary color on hover
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={`${VITE_BASE_URL}/public/logoT.png`} // Assuming this path is correct
            alt="SwipeScout Logo"
            sx={{ height: 40, mr: 1 }}
          />
          <Logo variant="h6" component={Link} to="/" sx={{ textDecoration: 'none' }}>
            Swipe<span>scout</span>
            {!isMobile && ( // Hide tagline on mobile
              <Typography component="span" className='tagline'>
                Your next career starts here
              </Typography>
            )}
          </Logo>
        </Box>

        {/* Navigation Links (Hidden on small screens) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 'auto' }}>
          <NavButton component={Link} to="/">Home</NavButton>
          <NavButton component={Link} to="/about">About Us</NavButton>
          <NavButton component={Link} to="#">Contact</NavButton>
          <NavButton component={Link} to="/how-it-works">How SwipeScout Works</NavButton>
          <NavButton component={Link} to="/FAQs">FAQ</NavButton>
          <NavButton component={Link} to="#">Credits</NavButton>
          <NavButton component={Link} to="#">Customer Support</NavButton>
        </Box>

        {/* Login Button and Avatar Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 'auto', md: 2 } }}>
          <Button
            variant="contained"
            size="small"
            component={Link}
            to="/login"
            sx={{
              bgcolor: theme.palette.primary.main, // Use primary color
              color: theme.palette.primary.contrastText, // White text
              fontWeight: 600,
              px: 2,
              borderRadius: '20px',
              display: { xs: 'none', md: 'flex' }, // Hide on small screens
              '&:hover': {
                bgcolor: theme.palette.primary.dark, // Darker primary on hover
              },
            }}
          >
            Login
          </Button>

          <Avatar
            sx={{
              bgcolor: theme.palette.secondary.light, // Use light secondary for avatar background
              cursor: 'pointer',
              color: theme.palette.secondary.contrastText, // Dark text on light secondary
              ml: { xs: 0, md: 2 }, // Adjust margin on mobile
              width: 36, // Smaller avatar for header
              height: 36,
              boxShadow: theme.shadows[1], // Subtle shadow
            }}
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
            PaperProps={{
              sx: {
                borderRadius: theme.shape.borderRadius, // Rounded menu
                boxShadow: theme.shadows[3], // Menu shadow
              }
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Help Center</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;
