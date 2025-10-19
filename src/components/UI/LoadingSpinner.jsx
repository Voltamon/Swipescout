import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

const LoadingSpinner = ({ 
  size = 40, 
  message = 'جاري التحميل...', 
  fullScreen = false,
  color = 'primary',
  variant = 'indeterminate'
}) => {
  const containerStyles = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 9999,
    backdropFilter: 'blur(4px)'
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3
  };

  return (
    <Fade in timeout={300}>
      <Box sx={containerStyles}>
        <CircularProgress 
          size={size} 
          color={color}
          variant={variant}
          sx={{ mb: 2 }}
        />
        {message && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ textAlign: 'center', maxWidth: 300 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

export default LoadingSpinner;
