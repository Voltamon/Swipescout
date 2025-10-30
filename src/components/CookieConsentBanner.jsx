import React, { useContext, useState, useEffect  } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

const CookieConsentBanner = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setOpen(false);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={Slide}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      sx={{
        width: '100%',
        maxWidth: isMobile ? '95%' : '80%',
        bottom: isMobile ? 16 : 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: theme.zIndex.snackbar + 100, // Ensure it's above other elements
      }}
    >
      <Alert
        onClose={handleClose}
        severity="info"
        sx={{
          width: '100%',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[6],
          borderRadius: theme.shape.borderRadius,
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(1.5, 2),
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              color="primary"
              size="small"
              onClick={handleAccept}
              variant="contained"
              sx={{ textTransform: 'none' }}
            >
              Accept
            </Button>
            <Button
              color="primary"
              size="small"
              component={Link}
              to="/cookie-policy"
              onClick={handleClose}
              sx={{ textTransform: 'none' }}
            >
              Learn More
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        <Typography variant="body2">
          SwipeScout uses cookies to improve your experience and analyze traffic. By continuing, you agree to our <Link to="/cookie-policy" style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>Cookie Policy</Link>.
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default CookieConsentBanner;

