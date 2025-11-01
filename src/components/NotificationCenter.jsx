import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Notifications,
  NotificationsNone,
  MarkEmailRead,
  Delete,
  Settings,
  MoreVert,
  Work,
  Message,
  Person,
  Star,
  Info,
  ThumbUp,
  ChatBubbleOutline,
  Bookmark,
  Share as ShareIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import { 
  getNotifications, 
  getUnreadNotificationCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

export default function NotificationCenter() {
  const { user } = useAuth();
  const { notifications, unreadCount, loading, refresh, markRead, markAllRead, remove } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (user) {
      // Best-effort refresh on mount
      refresh();
      // Optional periodic refresh as a fallback to sockets
      const interval = setInterval(refresh, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open]);

  const loadNotifications = async (pageNum = 1) => {
    // Context refresh pulls first page; simple hasMore heuristic
    await refresh();
    setHasMore(false);
    setPage(pageNum);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuAnchor(null);
    setSelectedNotification(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read_at) {
      try {
        await markRead(notification.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate to notification link if available (link or data.link)
    const navLink = notification.link || notification?.data?.link;
    if (navLink) {
      window.open(navLink, '_blank');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await remove(notificationId);
      setMenuAnchor(null);
      setSelectedNotification(null);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadNotifications(page + 1);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'video_like':
        return <ThumbUp />;
      case 'video_comment':
        return <ChatBubbleOutline />;
      case 'video_save':
        return <Bookmark />;
      case 'video_share':
        return <ShareIcon />;
      case 'job_match':
      case 'job_application':
        return <Work />;
      case 'application_update':
        return <UpdateIcon />;
      case 'message':
        return <Message />;
      case 'profile_view':
        return <Person />;
      case 'interview':
        return <Star />;
      default:
        return <Info />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'video_like':
        return '#1976d2';
      case 'video_comment':
        return '#00796b';
      case 'video_save':
        return '#5d4037';
      case 'video_share':
        return '#6a1b9a';
      case 'job_match':
        return '#4caf50';
      case 'job_application':
        return '#2196f3';
      case 'application_update':
        return '#009688';
      case 'message':
        return '#ff9800';
      case 'profile_view':
        return '#9c27b0';
      case 'interview':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        sx={{ mr: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <Notifications /> : <NotificationsNone />}
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 600 }
        }}
      >
        <Box p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Notifications
            </Typography>
            <Box>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  startIcon={<MarkEmailRead />}
                  onClick={handleMarkAllAsRead}
                  sx={{ mr: 1 }}
                >
                  Mark all read
                </Button>
              )}
              <IconButton size="small">
                <Settings />
              </IconButton>
            </Box>
          </Box>

      {notifications.length === 0 && !loading ? (
            <Box textAlign="center" py={4}>
              <NotificationsNone sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    button
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      bgcolor: notification.read_at ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 0.5,
                      position: 'relative'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: getNotificationColor(notification.type),
                          width: 40,
                          height: 40
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Typography
                            variant="body2"
                            fontWeight={notification.read_at ? 'normal' : 'bold'}
                            sx={{ flex: 1, mr: 1 }}
                          >
                            {notification.title || notification.body}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuAnchor(e.currentTarget);
                              setSelectedNotification(notification);
                            }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Box>
                      }
                      secondary={
                        <Box>
                          {notification.body && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {notification.body}
                            </Typography>
                          )}
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(notification.created_at)}
                            </Typography>
                            {!notification.read_at && (
                              <Chip
                                label="New"
                                size="small"
                                color="primary"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}

          {loading && (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          )}

          {hasMore && !loading && notifications.length > 0 && (
            <Box textAlign="center" mt={2}>
              <Button onClick={handleLoadMore} size="small">
                Load More
              </Button>
            </Box>
          )}
        </Box>
      </Popover>

      {/* Notification Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedNotification(null);
        }}
      >
        {selectedNotification && !selectedNotification.read_at && (
          <MenuItem onClick={() => handleNotificationClick(selectedNotification)}>
            <MarkEmailRead sx={{ mr: 1 }} />
            Mark as read
          </MenuItem>
        )}
        <MenuItem 
          onClick={() => handleDeleteNotification(selectedNotification?.id)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

