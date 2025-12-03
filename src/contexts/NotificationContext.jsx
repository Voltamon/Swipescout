import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
/* eslint-disable react-refresh/only-export-components -- TODO: split non-component helpers into their own module */
import { useSocket } from './SocketContext';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  markAllNotificationsAsUnread,
  deleteNotification
} from '@/services/api';

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  loading: false,
  refresh: async () => {},
  markRead: async (_id) => {},
  markAllRead: async () => {},
  remove: async (_id) => {}
});

export const NotificationProvider = ({ children }) => {
  const { socket } = useSocket();
  const { toast } = useToast();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Detect current role from URL path
  const getCurrentRole = () => {
    const path = location.pathname;
    if (path.startsWith('/employer')) return 'employer';
    if (path.startsWith('/jobseeker') || path.startsWith('/job-seeker')) return 'job_seeker';
    return null; // No role context (public pages)
  };

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      // Detect current role from URL path inline to avoid dependency issues
      const path = location.pathname;
      const currentRole = path.startsWith('/employer') ? 'employer' 
        : (path.startsWith('/jobseeker') || path.startsWith('/job-seeker')) ? 'job_seeker' 
        : null;
      
      console.log('[NotificationContext] Refreshing notifications with role:', currentRole);
      
      const [listRes, countRes] = await Promise.all([
        getNotifications(1, 50, false, currentRole),
        getUnreadNotificationCount(currentRole)
      ]);
      const notifs = listRes?.data?.notifications || listRes?.notifications || [];
      const count = countRes?.data?.count ?? countRes?.count ?? 0;
      console.log('[NotificationContext] Fetched notifications:', notifs.length, 'Unread count:', count);
      setNotifications(notifs);
      setUnreadCount(count);
      return notifs;
    } catch (err) {
      console.error('Failed to refresh notifications', err);
      // Set empty state on error to avoid blocking the UI
      setNotifications([]);
      setUnreadCount(0);
      // Only show error toast if it's not a network error (backend not running)
      if (err.code !== 'ERR_NETWORK') {
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive",
        });
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [location.pathname, toast]);

  const markRead = useCallback(async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  }, []);

  const markUnread = useCallback(async (id) => {
    try {
      await markNotificationAsUnread(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false, read_at: null } : n));
      setUnreadCount(c => c + 1);
    } catch (err) {
      console.error('Failed to mark notification as unread', err);
    }
  }, []);

  const markAllUnread = useCallback(async () => {
    try {
      await markAllNotificationsAsUnread();
      setNotifications(prev => prev.map(n => ({ ...n, read: false, read_at: null })));
      // set unread count to total notifications
      setUnreadCount(prev => notifications.length);
    } catch (err) {
      console.error('Failed to mark all notifications as unread', err);
    }
  }, [notifications.length]);

  const remove = useCallback(async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  }, []);

  useEffect(() => {
    // Only fetch notifications if user is logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      refresh();
    }
  }, [location.pathname]); // Refresh when route changes

  useEffect(() => {
    if (!socket) {
      console.log('[NotificationContext] No socket available');
      return;
    }
    
    console.log('[NotificationContext] Setting up notification listener');
    
    const onNotification = (notif) => {
      console.log('[NotificationContext] Received notification:', notif);
      
      // Filter notification by current role context
      const currentRole = getCurrentRole();
      console.log('[NotificationContext] Current role:', currentRole);
      console.log('[NotificationContext] Notification role:', notif.role);
      
      // Only add notification if it matches current role or has no role (global notifications)
      if (!currentRole || !notif.role || notif.role === currentRole) {
        console.log('[NotificationContext] Adding notification to list');
        console.log('[NotificationContext] Notification read status:', notif.read, 'read_at:', notif.read_at, 'readAt:', notif.readAt);
        
        // Prepend to list and increment unread if not read
        setNotifications(prev => {
          const updated = [notif, ...prev];
          console.log('[NotificationContext] Updated notifications list length:', updated.length);
          return updated;
        });
        
        // Check both read_at (snake_case) and readAt (camelCase) for compatibility
        const isRead = notif.read || notif.read_at || notif.readAt;
        
        if (!isRead) {
          setUnreadCount(c => {
            const newCount = c + 1;
            console.log('[NotificationContext] Incrementing unread count from', c, 'to', newCount);
            return newCount;
          });
        } else {
          console.log('[NotificationContext] Notification already read, not incrementing count');
        }
        
        toast({ description: notif.title || notif.body || 'New notification' });
      } else {
        console.log('[NotificationContext] Notification filtered out due to role mismatch');
      }
    };
    socket.on('notification', onNotification);
    return () => {
      socket.off('notification', onNotification);
    };
  }, [socket, toast, location.pathname]);

  const value = useMemo(() => ({ 
    notifications, 
    unreadCount, 
    loading, 
    refresh, 
    markRead, 
    markAllRead, 
    markUnread, 
    markAllUnread, 
    remove 
  }), [notifications, unreadCount, loading, refresh, markRead, markAllRead, markUnread, markAllUnread, remove]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
