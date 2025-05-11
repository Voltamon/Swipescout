import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({ onSidebarToggle }) => {
  return (
    <AppBar position="static" color="default" elevation={1} padding={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side: Menu Icon and Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton edge="start" color="inherit" onClick={onSidebarToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Swipscout
          </Typography>
        </Box>

        {/* Right side: Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button color="inherit" href="/">
            Home
          </Button>
          <Button color="inherit" href="/about">
            About
          </Button>
          <Button color="inherit" href="/contact">
            Contact
          </Button>
          <Button variant="contained" color="primary" href="/signin">
            Sign In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
