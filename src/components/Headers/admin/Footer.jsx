import React, { useContext } from 'react';
import {
  Box,
  Typography,
  Link,
  IconButton,
  Container,
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
  const bottomLinks = [
    { text: "Privacy Policy", href: "/privacy-policy" },
    { text: "Terms of Service", href: "/terms" },
    { text: "Help Center", href: "/help" },
  ];

  const socialIcons = [
    { icon: Facebook, url: "https://facebook.com" },
    { icon: Twitter, url: "https://twitter.com" },
    { icon: LinkedIn, url: "https://linkedin.com" },
    { icon: Instagram, url: "https://instagram.com" },
    { icon: GitHub, url: "https://github.com" },
  ];
  
  // Safely access theme properties with a fallback
  const borderColor = theme.palette.border?.primary || theme.palette.divider || '#e5e7eb';
  const iconColor = theme.palette.icon?.primary || 
                   (theme.palette.mode === 'light' ? '#4f46e5' : '#a78bfa');
  const footerBg = theme.palette.background?.footer || 
                  (theme.palette.mode === 'light' ? '#f9fafb' : '#1d202e');
  const primaryTextColor = theme.palette.text?.primary || 
                          (theme.palette.mode === 'light' ? '#2a3e50' : '#e9e9f4');
  const secondaryTextColor = theme.palette.text?.secondary || 
                            (theme.palette.mode === 'light' ? '#6b7280' : '#d1d5db');
  
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: footerBg,
        color: primaryTextColor,
        py: 4,
        borderTop: `1px solid ${borderColor}`,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* Brand and description */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 1
          }}>
            <Typography
              variant="h6"
              sx={{ 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Swip<span style={{ 
                color: iconColor,
                marginLeft: '2px'
              }}>scout</span>
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: secondaryTextColor,
                textAlign: { xs: 'center', md: 'left' },
                maxWidth: 300
              }}
            >
              Revolutionizing recruitment through video connections.
            </Typography>
          </Box>

          {/* Social icons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            order: { xs: 2, md: 1 }
          }}>
            {socialIcons.map(({ icon: Icon, url }, index) => (
              <IconButton
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: iconColor,
                  backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(0,0,0,0.05)' 
                    : 'rgba(255,255,255,0.05)',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? 'rgba(79, 70, 229, 0.1)'
                      : 'rgba(167, 139, 250, 0.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Box>

          {/* Copyright and links */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-end' },
            gap: 1,
            order: { xs: 1, md: 2 }
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: secondaryTextColor,
                textAlign: { xs: 'center', md: 'right' }
              }}
            >
              © {new Date().getFullYear()} Swipscout. All rights reserved.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {bottomLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  underline="none"
                  sx={{
                    color: secondaryTextColor,
                    '&:hover': {
                      color: iconColor,
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
