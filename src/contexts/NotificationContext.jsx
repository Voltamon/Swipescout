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
import normalizeRole from '@/utils/normalizeRole';

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
      try {
  const currentRole = normalizeRole(getCurrentRole());
  const notifRoleNorm = normalizeRole(notif.role);
        // If notification has a role, only show when current role matches; if no role set, treat as global
  if (!currentRole || !notif.role || notifRoleNorm === currentRole) {
          // Prepend to list
          setNotifications(prev => [notif, ...prev]);

          // Check both read booleans/fields for compatibility
          const isRead = !!(notif.read || notif.read_at || notif.readAt);
          if (!isRead) setUnreadCount(c => c + 1);

          toast({ description: notif.title || notif.body || 'New notification' });

          // If desktop notifications are available and permitted, show native notification
          try {
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              const n = new Notification(notif.title || notif.body || 'New notification', {
                body: notif.body,
                icon: notif.sender?.photo_url || notif.sender?.profile_image || undefined,
                data: { link: notif.link }
              });
              n.onclick = function () {
                try {
                  if (n.data && n.data.link) {
                    if (n.data.link.startsWith('/')) {
                      window.location.href = n.data.link; // client side navigation
                    } else {
                      window.open(n.data.link, '_blank');
                    }
                  }
                } catch (err) {
                  // ignore
                }
                window.focus && window.focus();
              };
            }
          } catch (err) {
            // ignore Notification API errors silently
          }
        } else {
          // Notification was for a different role; ignore
          console.log('[NotificationContext] Notification filtered out due to role mismatch', { currentRole, notificationRole: notif.role });
        }
      } catch (err) {
        console.error('[NotificationContext] onNotification error', err, notif);
      }
  };
    socket.on('notification', onNotification);
    return () => {
      socket.off('notification', onNotification);
    };
  }, [socket, toast, location.pathname]);

  const enableNativeNotifications = async (payload = {}) => {
    try {
      if (!('Notification' in window)) return false;
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        // Optionally register push subscription if push manager available
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          try {
            const reg = await navigator.serviceWorker.register('/service-worker.js');
            const subscription = await reg.pushManager.getSubscription() || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: payload?.vapidKey || null });
            // Send push subscription or fcmToken to server to register
            const regRes = await import('@/services/api').then(m => m.registerNotificationDevice({ pushSubscription: subscription }));
            const device = regRes?.data?.device || regRes?.device;
            try {
              if (device) localStorage.setItem('pushDevice', JSON.stringify(device));
            } catch(e) { /* ignore storage failures */ }
          } catch (err) {
            // If push manager not supported or fails, explicitly call deregister endpoint
            const deregRes = await import('@/services/api').then(m => m.deregisterNotificationDevice());
            try {
              localStorage.removeItem('pushDevice');
            } catch(e) { /* ignore */ }
          }
          } else {
            const deregRes = await import('@/services/api').then(m => m.deregisterNotificationDevice());
            try { localStorage.removeItem('pushDevice'); } catch(e) {}
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('enableNativeNotifications error', err);
      return false;
    }
  };

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    refresh,
    markRead,
    markAllRead,
    markUnread,
    markAllUnread,
    remove,
    enableNativeNotifications
  }), [notifications, unreadCount, loading, refresh, markRead, markAllRead, markUnread, markAllUnread, remove, enableNativeNotifications]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
