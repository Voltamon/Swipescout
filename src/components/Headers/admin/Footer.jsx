import React from 'react';
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
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const bottomLinks = [
    { text: "Privacy Policy", href: "/privacy-policy" },
    { text: "Terms of Service", href: "/terms" },
    { text: "Help", href: "/help" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        py: 3,
        px: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: theme.spacing(2),
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            mx: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            px: { xs: 1, sm: 3 },
          }}
        >
          {/* Brand and Social Icons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Swip<span style={{ color: theme.palette.primary.main }}>scout</span>
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: { xs: 'center', sm: 'left' } }}>
              Revolutionizing recruitment through video connections.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {[Facebook, Twitter, LinkedIn, Instagram].map((Icon, index) => (
                <IconButton key={index} sx={{ color: theme.palette.text.primary }}>
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Copyright and Bottom Links */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              © {new Date().getFullYear()} Swipscout. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 3 } }}>
              {bottomLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  sx={{
                    color: theme.palette.text.secondary,
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      textDecoration: 'underline',
                    },
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