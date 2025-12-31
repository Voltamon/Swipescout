import i18n from 'i18next';
import React, { useState, useEffect } from "react";
import { Bell, Briefcase, MessageSquare, Heart, UserPlus, Calendar, Check, Trash2, Loader2, RotateCw } from "lucide-react";
import { Card, CardContent } from "@/components/UI/card.jsx";
import { Button } from "@/components/UI/button.jsx";
import { Badge } from "@/components/UI/badge.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar.jsx";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import OpenChatModal from '@/components/Chat/OpenChatModal.jsx';

const NotificationsPage = () => {
  const { toast } = useToast();
    const { notifications, loading, refresh, markRead, remove, markAllRead, markUnread, markAllUnread } = useNotifications();
    const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [openChat, setOpenChat] = useState(false);
  const [openConversation, setOpenConversation] = useState(null);

  useEffect(() => {
    // Just refresh notifications, don't auto-mark as read
    refresh();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markRead(id);
      toast({ description: "Notification marked as read" });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({ description: "Failed to mark as read", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(id);
      toast({ description: "Notification deleted" });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({ description: "Failed to delete notification", variant: "destructive" });
    }
  };

  const handleAccept = async (notification) => {
    try {
      // Accept connection using connectionId in notification.data
      const connectionId = notification.data?.connectionId || notification.data?.connection_id || notification.data?.connection;
      if (!connectionId) throw new Error('Connection ID not found');
      const { data } = await import('@/services/connectionService.js').then(m => m.acceptConnection(connectionId));
      toast({ description: 'Connection accepted' });
      // Optionally mark read
      await markRead(notification.id);
      // Refresh notifications and chat state
      await refresh();
      if (data?.conversation) {
        setOpenConversation(data.conversation);
        setOpenChat(true);
      }
    } catch (err) {
      console.error('Failed to accept connection', err);
      toast({ description: 'Failed to accept connection', variant: 'destructive' });
    }
  };

  const handleRejectNotification = async (notification) => {
    try {
      const connectionId = notification.data?.connectionId || notification.data?.connection_id || notification.data?.connection;
      if (!connectionId) throw new Error('Connection ID not found');
      await import('@/services/connectionService.js').then(m => m.rejectConnection(connectionId));
      toast({ description: 'Connection request declined' });
      await markRead(notification.id);
      await refresh();
    } catch (err) {
      console.error('Failed to decline connection', err);
      toast({ description: 'Failed to decline connection', variant: 'destructive' });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllRead();
      toast({ description: "All notifications marked as read" });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({ description: "Failed to mark all as read", variant: "destructive" });
    }
  };

  const handleMarkAllAsUnread = async () => {
    try {
      await markAllUnread();
      toast({ description: "All notifications marked as unread" });
    } catch (error) {
      console.error('Error marking all as unread:', error);
      toast({ description: "Failed to mark all as unread", variant: "destructive" });
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await markUnread(id);
      toast({ description: "Notification marked as unread" });
    } catch (error) {
      console.error('Error marking notification as unread:', error);
      toast({ description: "Failed to mark as unread", variant: "destructive" });
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'job_application':
      case 'application':
        return <Briefcase className="h-5 w-5 text-purple-600" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'like':
      case 'video_like':
        return <Heart className="h-5 w-5 text-pink-600" />;
      case 'connection':
      case 'connection_request':
        return <UserPlus className="h-5 w-5 text-cyan-600" />;
      case 'interview':
      case 'interview_scheduled':
        return <Calendar className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      
      if (seconds < 60) return 'just now';
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">{i18n.t('auto_notifications')}</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        
        {unreadCount > 0 ? (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <Check className="h-4 w-4 mr-2" />{i18n.t('auto_mark_all_as_read')}
          </Button>
        ) : (
          notifications.length > 0 && (
            <Button
              onClick={handleMarkAllAsUnread}
              variant="outline"
              className="border-gray-600 text-gray-600 hover:bg-gray-50"
            >
              <RotateCw className="h-4 w-4 mr-2" />{i18n.t('auto_mark_all_as_unread')}</Button>
          )
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-gradient-to-r from-purple-600 to-cyan-600' : ''}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? 'bg-gradient-to-r from-purple-600 to-cyan-600' : ''}
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          onClick={() => setFilter('read')}
          className={filter === 'read' ? 'bg-gradient-to-r from-purple-600 to-cyan-600' : ''}
        >
          Read ({notifications.length - unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">{i18n.t('auto_no_notifications')}</h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications." 
                : filter === 'read'
                ? "No read notifications yet."
                : "You don't have any notifications yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all duration-200 hover:shadow-md ${
                !notification.read ? 'border-l-4 border-l-purple-600 bg-purple-50/30' : 'hover:bg-gray-50'
              }`}
            >
                <CardContent
                  className="p-4 cursor-pointer"
                  onClick={() => (async () => {
                    // mark item read on click if not read
                    if (!notification.read) {
                      await markRead(notification.id);
                    }
                    if (notification.link) {
                      if (notification.link.startsWith('/')) {
                        navigate(notification.link);
                      } else {
                        window.open(notification.link, '_blank');
                      }
                    }
                  })()}
                >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {notification.sender && (
                    <Avatar className="border-2 border-white">
                      <AvatarImage src={notification.sender.photo_url || notification.sender.profile_image} />
                      <AvatarFallback>{notification.sender.display_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                      {notification.title || notification.body}
                    </p>
                    {notification.description && (
                      <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">{formatTime(notification.created_at || notification.timestamp)}</p>
                  </div>

                    <div className="flex items-center gap-2">
                    {!notification.read ? (
                      <>
                        <Badge className="bg-purple-600">{i18n.t('auto_new')}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                          className="hover:bg-purple-100"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); handleMarkAsUnread(notification.id); }}
                        className="hover:bg-gray-100"
                        title={i18n.t('auto_mark_as_unread')} 
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    )}

                    {notification.type === 'connection_request' && (
                      <div className="flex items-center gap-2">
                        <Button variant="default" size="sm" onClick={(e) => { e.stopPropagation(); handleAccept(notification); }}>{i18n.t('auto_accept')}</Button>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRejectNotification(notification); }}>{i18n.t('auto_decline')}</Button>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                      className="hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <OpenChatModal open={openChat} onOpenChange={setOpenChat} conversation={openConversation} />
    </div>
  );
};

export default NotificationsPage;
