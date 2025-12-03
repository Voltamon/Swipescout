import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
/* eslint-disable react-refresh/only-export-components -- TODO: split non-component helpers into their own module */
import { useSocket } from './SocketContext';
import { useToast } from '@/hooks/use-toast';
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      setLoading(true);
      const [listRes, countRes] = await Promise.all([
        getNotifications(1, 50, false),
        getUnreadNotificationCount()
      ]);
      const notifs = listRes?.data?.notifications || listRes?.notifications || [];
      const count = countRes?.data?.count ?? countRes?.count ?? 0;
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
  };

  const markRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const markUnread = async (id) => {
    try {
      await markNotificationAsUnread(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false, read_at: null } : n));
      setUnreadCount(c => c + 1);
    } catch (err) {
      console.error('Failed to mark notification as unread', err);
    }
  };

  const markAllUnread = async () => {
    try {
      await markAllNotificationsAsUnread();
      setNotifications(prev => prev.map(n => ({ ...n, read: false, read_at: null })));
      // set unread count to total notifications
      setUnreadCount(prev => notifications.length);
    } catch (err) {
      console.error('Failed to mark all notifications as unread', err);
    }
  };

  const remove = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  useEffect(() => {
    // Only fetch notifications if user is logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      refresh();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNotification = (notif) => {
      // Prepend to list and increment unread if not read
      setNotifications(prev => [notif, ...prev]);
      if (!notif.read && !notif.read_at) setUnreadCount(c => c + 1);
      toast({ description: notif.title || notif.body || 'New notification' });
      // If desktop notifications are available and permitted, show native notification
      try {
        if (Notification && Notification.permission === 'granted') {
          const n = new Notification(notif.title || notif.body || 'New notification', {
            body: notif.body,
            icon: notif.sender?.photo_url || notif.sender?.profile_image || undefined,
            data: { link: notif.link }
          });
          n.onclick = function (e) {
            if (n.data && n.data.link) {
              if (n.data.link.startsWith('/')) {
                window.location.href = n.data.link; // client side navigation
              } else {
                window.open(n.data.link, '_blank');
              }
            }
            window.focus && window.focus();
          };
        }
      } catch (err) {
        // ignore
      }
    };
    socket.on('notification', onNotification);
    return () => {
      socket.off('notification', onNotification);
    };
  }, [socket, toast]);

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
            await import('@/services/api').then(m => m.registerNotificationDevice({ pushSubscription: subscription }));
          } catch (err) {
            // If push manager not supported or fails, fallback to fcmToken flow (not implemented here) or store flag
            await import('@/services/api').then(m => m.registerNotificationDevice({ fcmToken: null }));
          }
        } else {
          await import('@/services/api').then(m => m.registerNotificationDevice({ fcmToken: null }));
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('enableNativeNotifications error', err);
      return false;
    }
  };

  const value = useMemo(() => ({ notifications, unreadCount, loading, refresh, markRead, markAllRead, markUnread, markAllUnread, remove, enableNativeNotifications }), [notifications, unreadCount, loading]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
