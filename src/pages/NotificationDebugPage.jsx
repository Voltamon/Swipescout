import React, { useState } from 'react';
import { Button } from '@/components/UI/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Badge } from '@/components/UI/badge.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Alert, AlertDescription } from '@/components/UI/alert.jsx';
import { CheckCircle2, XCircle, Radio } from 'lucide-react';
import i18n from 'i18next';

const NotificationDebugPage = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const { notifications, unreadCount, refresh } = useNotifications();
  const [testMessage, setTestMessage] = useState('Test notification message');
  const [testRole, setTestRole] = useState('employer');
  const [lastResponse, setLastResponse] = useState(null);

  const sendTestNotification = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user?.id,
          message: testMessage,
          role: testRole === 'none' ? null : testRole
        })
      });
      
      const data = await response.json();
      setLastResponse({ success: response.ok, data });
      
      if (response.ok) {
        await refresh(); // Refresh to see if it appears in the list
      }
    } catch (error) {
      setLastResponse({ success: false, error: error.message });
    }
  };

  const getCurrentRole = () => {
    const path = window.location.pathname;
    if (path.startsWith('/employer')) return 'employer';
    if (path.startsWith('/jobseeker') || path.startsWith('/job-seeker')) return 'job_seeker';
    return null;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">{i18n.t('auto_notification_system_debug')}</h1>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{i18n.t('auto_socket_connection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">{i18n.t('auto_connected')}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm">{i18n.t('auto_disconnected')}</span>
                </>
              )}
            </div>
            {socket && (
              <p className="text-xs text-gray-500 mt-1">Socket ID: {socket.id}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{i18n.t('auto_current_role')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-semibold">{getCurrentRole() || 'None (Public)'}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Path: {window.location.pathname}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{i18n.t('auto_notifications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge>{notifications.length}</Badge>
                <span className="text-sm">{i18n.t('auto_total')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">{unreadCount}</Badge>
                <span className="text-sm">{i18n.t('auto_unread')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{i18n.t('auto_user_information')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>User ID:</strong> {user?.id}</div>
            <div><strong>Email:</strong> {user?.email}</div>
            <div><strong>Role:</strong> {Array.isArray(user?.role) ? user?.role.join(', ') : user?.role}</div>
            <div><strong>Name:</strong> {user?.firstName} {user?.lastName} {user?.companyName}</div>
          </div>
        </CardContent>
      </Card>

      {/* Test Notification Sender */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{i18n.t('auto_send_test_notification')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">{i18n.t('auto_message')}</Label>
              <Input
                id="message"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder={i18n.t('auto_enter_test_message')} 
              />
            </div>

            <div>
              <Label htmlFor="role">{i18n.t('auto_role_filter')}</Label>
              <select
                id="role"
                value={testRole}
                onChange={(e) => setTestRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="employer">{i18n.t('auto_employer_only')}</option>
                <option value="job_seeker">{i18n.t('auto_job_seeker_only')}</option>
                <option value="none">{i18n.t('auto_global_all_roles')}</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Current page role: <strong>{getCurrentRole() || 'None'}</strong>
                {testRole !== 'none' && testRole !== getCurrentRole() && (
                  <span className="text-orange-600 ml-2">
                    ⚠️ Role mismatch - notification will be filtered out!
                  </span>
                )}
              </p>
            </div>

            <Button onClick={sendTestNotification} className="w-full">{i18n.t('auto_send_test_notification')}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Last Response */}
      {lastResponse && (
        <Alert className={lastResponse.success ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-semibold">
                {lastResponse.success ? '✓ Success' : '✗ Error'}
              </div>
              <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                {JSON.stringify(lastResponse, null, 2)}
              </pre>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Notifications ({notifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">{i18n.t('auto_no_notifications')}</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 border rounded-lg ${
                    !notif.read ? 'bg-purple-50 border-purple-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{notif.title || notif.body}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Role: <Badge variant="outline">{notif.role || 'Global'}</Badge>
                        {' | '}
                        Type: {notif.type}
                        {' | '}
                        {new Date(notif.created_at).toLocaleString()}
                      </div>
                    </div>
                    {!notif.read && (
                      <Badge className="bg-purple-600">{i18n.t('auto_new')}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Console Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{i18n.t('auto_console_debugging')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p className="font-semibold">Open browser console (F12) and look for:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>[SocketContext] Socket connected</li>
              <li>[SocketContext] Emitting register event with user ID</li>
              <li>[NotificationContext] Setting up notification listener</li>
              <li>[NotificationContext] Received notification (when test is sent)</li>
              <li>[NotificationContext] Current role vs Notification role</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationDebugPage;
