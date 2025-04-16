import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Menu, MenuItem } from '@mui/material';
import { useStyles } from './Header.styles';

const Header = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.logo}>
          Swip<span>scout</span>
        </Typography>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Jobs</Button>
          <Button color="inherit">Candidates</Button>
          <Button color="inherit">Profile</Button>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Button color="inherit" sx={{ mr: 1 }}>Logout</Button>
        <Avatar 
          sx={{ bgcolor: 'primary.main', cursor: 'pointer' }}
          onClick={handleMenuOpen}
        >
          JD
        </Avatar>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMenuClose}>Profile Settings</MenuItem>
          <MenuItem onClick={handleMenuClose}>Account</MenuItem>
          <MenuItem onClick={handleMenuClose}>Help Center</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;