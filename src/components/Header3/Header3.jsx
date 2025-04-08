import React, { useState } from "react";
import { Box, Typography, IconButton, Drawer, Stack } from "@mui/material";
import { FaInstagram, FaYoutube, FaTwitter, FaDribbble, FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/logo.png";

const Header3 = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        background: "linear-gradient(to right, #1a032a, #003366)",
        color: "#5D9BCF",
        position: "relative",
      }}
    >
      {/* Logo Section */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box component="img" src={logo} alt="Logo" sx={{ width: 36, height: 36 }} />
        <Typography variant="subtitle1">SwipeScout</Typography>
      </Stack>

      {/* Desktop Navigation */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          gap: 2,
        }}
      >
        <Typography component="a" href="#" sx={{ textDecoration: "none", color: "#5D9BCF", "&:hover": { textDecoration: "underline" } }}>
          News
        </Typography>
        <Typography component="a" href="#" sx={{ textDecoration: "none", color: "#5D9BCF", "&:hover": { textDecoration: "underline" } }}>
          FAQs
        </Typography>
        <Typography component="a" href="#" sx={{ textDecoration: "none", color: "#5D9BCF", "&:hover": { textDecoration: "underline" } }}>
          About
        </Typography>
      </Box>

      {/* Social Icons (Desktop only) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          gap: 1,
        }}
      >
        <IconButton color="inherit"><FaInstagram /></IconButton>
        <IconButton color="inherit"><FaDribbble /></IconButton>
        <IconButton color="inherit"><FaTwitter /></IconButton>
        <IconButton color="inherit"><FaYoutube /></IconButton>
      </Box>

      {/* Menu Toggle Button (Mobile Only) */}
      <IconButton
        onClick={() => setMenuOpen(true)}
        sx={{ display: { xs: "block", md: "none" }, color: "#5D9BCF" }}
      >
        <FaBars />
      </IconButton>

      {/* Drawer Menu (Mobile) */}
      <Drawer
        anchor="top"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{ sx: { background: "#003366", padding: 2 } }}
      >
        <Box textAlign="center">
          <IconButton onClick={() => setMenuOpen(false)} sx={{ color: "#5D9BCF" }}>
            <FaTimes />
          </IconButton>
          <Stack spacing={2} mt={2}>
            <Typography component="a" href="#" sx={{ textDecoration: "none", color: "#5D9BCF" }}>
              News
            </Typography>
            <Typography component="a" href="#" sx={{ textDecoration: "none", color: "#5D9BCF" }}>
              FAQs
            </Typography>
            <Typography component="a" href="#" sx={{ textDecoration: "none", color: "#5D9BCF" }}>
              About
            </Typography>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header3;
