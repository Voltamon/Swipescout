import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import { useStyles } from './Footer.styles';

const Footer = () => {
  const classes = useStyles();

  return (
    <Box className={classes.footer}>
      <Box className={classes.footerLinks}>
        <Link href="#" color="inherit" underline="hover">About Us</Link>
        <Link href="#" color="inherit" underline="hover">Contact Us</Link>
        <Link href="#" color="inherit" underline="hover">Privacy Policy</Link>
        <Link href="#" color="inherit" underline="hover">Terms and Conditions</Link>
      </Box>
      
      <Box className={classes.socialIcons}>
        <IconButton href="#"><Facebook /></IconButton>
        <IconButton href="#"><Twitter /></IconButton>
        <IconButton href="#"><LinkedIn /></IconButton>
        <IconButton href="#"><Instagram /></IconButton>
      </Box>
      
      <Typography variant="body2" color="textSecondary" align="center">
        © 2023 Swipscout. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;