import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Slide,
  Grow
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

const GrowTransition = (props) => {
  return <Grow {...props} />;
};

const NotificationSnackbar = ({
  open,
  onClose,
  message,
  title,
  severity = 'info',
  duration = 6000,
  position = { vertical: 'bottom', horizontal: 'right' },
  transition = 'slide',
  action,
  variant = 'filled'
}) => {
  const TransitionComponent = transition === 'grow' ? GrowTransition : SlideTransition;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={position}
      TransitionComponent={TransitionComponent}
      sx={{
        '& .MuiSnackbarContent-root': {
          minWidth: 300,
          maxWidth: 500
        }
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant={variant}
        sx={{
          width: '100%',
          boxShadow: 3,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        action={
          action || (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
