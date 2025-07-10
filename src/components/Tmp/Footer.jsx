import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledFooter = styled(Box)({
  background: 'linear-gradient(to bottom, #dbeafe 0%, #3b82f6 100%)',
  color: '#4b5563',
  padding: '64px 24px',
  textAlign: 'center',
});

const FooterLink = styled(Link)({
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  transition: 'color 0.2s ease-in-out',
  '&:hover': {
    color: '#0056b3',
  },
});

const SocialButton = styled(IconButton)({
  color: '#ffffff',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
    color: '#dbeafe',
  },
});

const Footer = () => {
  return (
    <StyledFooter>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3 }}>
        <FooterLink href="#" underline="hover">About Us</FooterLink>
        <FooterLink href="#" underline="hover">Contact Us</FooterLink>
        <FooterLink href="#" underline="hover">Privacy Policy</FooterLink>
        <FooterLink href="#" underline="hover">Terms and Conditions</FooterLink>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <SocialButton href="#"><Facebook /></SocialButton>
        <SocialButton href="#"><Twitter /></SocialButton>
        <SocialButton href="#"><LinkedIn /></SocialButton>
        <SocialButton href="#"><Instagram /></SocialButton>
      </Box>

      <Typography variant="body2" sx={{ color: '#dbeafe' }}>
        © 2023 SwipeScout. All rights reserved.
      </Typography>
    </StyledFooter>
  );
};

export default Footer;