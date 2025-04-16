import React, { useEffect } from 'react';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import { Button, Box } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const LinkedInLoginButton = () => {
  const handleSuccess = (data) => {
    console.log('LinkedIn login success:', data);
    // exchange `data.code` with your backend for access token
  };

  const handleFailure = (error) => {
    console.error('LinkedIn login failed:', error);
  };

  useEffect(() => {
    // Ensure LinkedIn OAuth SDK is ready, and DOM is fully available
    console.log('LinkedIn button is ready');
  }, []); // Empty dependency array ensures this runs only once after component mounts

  return (
    <Box>
      <LinkedIn
        clientId={import.meta.env.VITE_LINKEDIN_CLIENT_ID}
        redirectUri={import.meta.env.VITE_LINKEDIN_REDIRECT_URI}
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        scope="r_liteprofile r_emailaddress"
      >
        {({ onClick, disabled }) => (
          <Button
            onClick={onClick}
            disabled={disabled}
            variant="contained"
            color="primary"
            startIcon={<LinkedInIcon />}
          >
            Login with LinkedIn
          </Button>
        )}
      </LinkedIn>
    </Box>
  );
};

export default LinkedInLoginButton;
