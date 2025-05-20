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

  // Bottom links data
  const bottomLinks = [
    { text: "Privacy Policy", href: "/privacy-policy" },
    { text: "Terms of Service", href: "/terms" },
    { text: "Cookie Policy", href: "/cookies" },
  ];

  // Main links data
  const linkSections = [
    {
      title: "Company",
      links: [
        { text: "About Us", href: "/about" },
        { text: "Careers", href: "/careers" },
        { text: "Blog", href: "/blog" },
        { text: "Press", href: "/press" },
      ]
    },
    {
      title: "Resources",
      links: [
        { text: "Help Center", href: "/help" },
        { text: "Tutorials", href: "/tutorials" },
        { text: "Webinars", href: "/webinars" },
        { text: "Community", href: "/community" },
      ]
    },
    {
      title: "Legal",
      links: [
        { text: "Privacy Policy", href: "/privacy" },
        { text: "Terms of Service", href: "/terms" },
        { text: "GDPR", href: "/gdpr" },
        { text: "Compliance", href: "/compliance" },
      ]
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1a365d 0%, #0d2340 100%)',
        color: '#e0e6f0',
        py: 4,
        px: 2,
        borderTop: `1px solid rgba(224, 230, 240, 0.1)`
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 4
        }}
      >
        {/* Brand Column */}
        <Box>
            <Typography variant="h6" sx={{ 
            fontWeight: 700,
            mb: 1,
            background: `linear-gradient(to right, #1a365d,rgb(250, 163, 105))`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Swip<span>scout</span>
          </Typography>
          <Typography variant="body2" sx={{ color: '#b8c2d8', mb: 2 }}>
            Revolutionizing recruitment through video connections
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[Facebook, Twitter, LinkedIn, GitHub].map((Icon, index) => (
              <IconButton
                key={index}
                sx={{
                  color: '#e0e6f0',
                  bgcolor: 'rgba(224, 230, 240, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(74, 107, 255, 0.3)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* Dynamic Link Columns */}
        {linkSections.map((section) => (
          <Box key={section.title}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#e0e6f0',
                fontWeight: 600,
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
            >
              {section.title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {section.links.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  sx={{
                    color: '#b8c2d8',
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#4a6bff',
                      textDecoration: 'underline'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 4, borderColor: 'rgba(224, 230, 240, 0.1)' }} />

      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Typography variant="body2" sx={{ color: '#b8c2d8' }}>
          © {new Date().getFullYear()} Swipscout. All rights reserved.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3 }}>
          {bottomLinks.map((link) => (
            <Link 
              key={link.text}
              href={link.href}
              sx={{ 
                color: '#b8c2d8', 
                '&:hover': { 
                  color: '#4a6bff',
                  textDecoration: 'underline'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {link.text}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;