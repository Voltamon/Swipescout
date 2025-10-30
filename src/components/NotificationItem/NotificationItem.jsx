import React, { useContext } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useStyles } from './NotificationItem.styles';

const NotificationItem = ({ notification, lastItem }) => {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.notificationItem}>
        <Typography variant="body2">{notification.message}</Typography>
        <Typography variant="caption" color="textSecondary" className={classes.notificationTime}>
          {notification.time}
        </Typography>
      </Box>
      {!lastItem && <Divider />}
    </>
  );
};

export default NotificationItem;