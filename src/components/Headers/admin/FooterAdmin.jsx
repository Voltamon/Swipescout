import React from "react";
import {
  Box,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  GitHub
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();

  // Minimal bottom links data
  const bottomLinks = [
    { text: "Privacy Policy", href: "/privacy-policy" },
    { text: "Terms of Service", href: "/terms" },
    { text: "Help", href: "/help" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: theme.palette.primary.dark, // Darker primary color for footer background
        color: theme.palette.primary.contrastText, // White text
        py: 3, // Reduced padding
        px: 2, // Keep horizontal padding for the footer itself
        borderTop: `1px solid ${theme.palette.primary.light}33`, // Subtle border
        borderRadius: theme.shape.borderRadius, // Apply global border radius
        boxShadow: theme.shadows[3], // Subtle shadow
        mt: theme.spacing(2), // Margin top for spacing with main content
        width: '100%', // Ensure it takes 100% of its parent (FooterWrapper)
      }}
    >
      <Box
        sx={{
          // Removed maxWidth: 1200 here to allow it to fill the available width
          mx: 'auto', // Still center content within the available width
          width: '100%', // Take 100% of the parent (which is already sized by FooterWrapper)
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          px: { xs: 1, sm: 3 }, // Add internal padding to constrain content and align with main content
        }}
      >
        {/* Brand and Social Icons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.secondary.light, // Use light secondary color for "Swipscout"
            }}
          >
            Swip<span style={{ color: theme.palette.secondary.main }}>scout</span>
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText + 'B3', textAlign: { xs: 'center', sm: 'left' } }}>
            Revolutionizing recruitment through video connections.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {[Facebook, Twitter, LinkedIn, Instagram].map((Icon, index) => (
              <IconButton
                key={index}
                sx={{
                  color: theme.palette.primary.contrastText,
                  bgcolor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent white background
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[2],
                  },
                  transition: 'all 0.2s ease',
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* Copyright and Bottom Links */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
          <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText + 'B3' }}>
            © {new Date().getFullYear()} Swipscout. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 3 } }}>
            {bottomLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                sx={{
                  color: theme.palette.primary.contrastText + 'B3',
                  textDecoration: 'none',
                  '&:hover': {
                    color: theme.palette.secondary.light,
                    textDecoration: 'underline',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {link.text}
              </Link>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
