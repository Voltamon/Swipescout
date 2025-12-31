import i18n from 'i18next';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell, Mail, Smartphone, Briefcase, Video, MessageSquare,
  Heart, UserPlus, Clock, Save, RotateCcw, Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { testNotification } from '@/services/api';
import { getUserSettings, updateUserSettings } from '@/services/userService';
import { registerNotificationDevice } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Switch } from '@/components/UI/switch.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/UI/dialog.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationSettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { enableNativeNotifications } = useNotifications();
  
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    job_alerts: true,
    interview_reminders: true,
    message_notifications: true,
    video_interactions: true,
    connection_requests: true,
    marketing_emails: false,
    weekly_digest: true,
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    notification_frequency: 'immediate',
    desktop_notifications: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testDialog, setTestDialog] = useState(false);
  const [testType, setTestType] = useState('email');

  const fetchNotificationSettings = useCallback(async () => {
    try {
      setLoading(true);
      // Use consolidated settings fetch and normalize nested notification structure into this page's flat state
      const response = await getUserSettings();
      const data = response?.data || {};
      const notif = data.notifications || {};

      // Check if we have the flat structure from new backend
      if (notif.emailNotifications !== undefined || notif.jobAlerts !== undefined) {
          setSettings(prev => ({
            ...prev,
            email_notifications: !!notif.emailNotifications,
            push_notifications: !!notif.pushNotifications,
            sms_notifications: !!notif.sms_notifications,
            job_alerts: !!notif.jobAlerts,
            interview_reminders: !!notif.interviewReminders,
            message_notifications: !!notif.messageNotifications,
            video_interactions: !!notif.video_interactions,
            connection_requests: !!notif.connection_requests,
            marketing_emails: !!notif.weeklyDigest,
            weekly_digest: !!notif.weeklyDigest,
            quiet_hours_enabled: !!notif.quiet_hours_enabled,
            quiet_hours_start: notif.quiet_hours_start || '22:00',
            quiet_hours_end: notif.quiet_hours_end || '08:00',
            notification_frequency: notif.notification_frequency || 'immediate',
            desktop_notifications: !!notif.desktop_notifications
          }));
          return;
      }

      const email = notif.email || {};
      const push = notif.push || {};
      const inApp = notif.inApp || {};

      const normalized = {
        email_notifications: Object.values(email).some(Boolean) || false,
        push_notifications: Object.values(push).some(Boolean) || false,
        sms_notifications: false, // not supported by backend yet
        job_alerts: !!(email.jobMatches || push.jobMatches || inApp.jobMatches),
        interview_reminders: !!(email.applicationUpdates || push.applicationUpdates || inApp.applicationUpdates),
        message_notifications: !!(email.newMessages || push.newMessages || inApp.newMessages),
        video_interactions: false, // no direct mapping in backend; keep UI-only for now
        connection_requests: false, // no direct mapping in backend
        marketing_emails: !!email.marketingEmails,
        weekly_digest: !!email.marketingEmails, // approximate via marketingEmails
        quiet_hours_enabled: false,
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00',
        notification_frequency: 'immediate'
      };

  const desktopEnabled = (notif.desktop_notifications !== undefined) ? !!notif.desktop_notifications : ((typeof Notification !== 'undefined' && Notification.permission === 'granted') || (localStorage.getItem('desktopNotificationsEnabled') === 'true'));
  setSettings(prev => ({ ...prev, ...normalized, desktop_notifications: desktopEnabled }));
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      toast({ description: "Failed to load settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotificationSettings();
  }, [fetchNotificationSettings]);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // Map this page's flat settings into the shape expected by userService.updateUserSettings
      const mapped = {
        emailNotifications: !!settings.email_notifications,
        pushNotifications: !!settings.push_notifications,
        messageNotifications: !!settings.message_notifications,
        jobAlerts: !!settings.job_alerts,
        interviewReminders: !!settings.interview_reminders,
        weeklyDigest: !!settings.weekly_digest,
        profileViews: false, // no direct control on this page yet
        desktop_notifications: !!settings.desktop_notifications,
        sms_notifications: !!settings.sms_notifications,
        video_interactions: !!settings.video_interactions,
        connection_requests: !!settings.connection_requests,
        quiet_hours_enabled: !!settings.quiet_hours_enabled,
        quiet_hours_start: settings.quiet_hours_start,
        quiet_hours_end: settings.quiet_hours_end,
        notification_frequency: settings.notification_frequency
      };

  await updateUserSettings({ notifications: mapped });
  // Save desktop notifications preference locally
  localStorage.setItem('desktopNotificationsEnabled', settings.desktop_notifications ? 'true' : 'false');
      toast({ description: "Settings saved successfully!" });
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      toast({ description: "Failed to save settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      // Build a payload expected by the backend test endpoint
      const currentUserId = user?.id || user?.userId || user?.uid;
      
      // Detect current role from URL path to match the notification context filtering
      const getCurrentRole = () => {
        const path = window.location.pathname;
        if (path.startsWith('/employer')) return 'employer';
        if (path.startsWith('/jobseeker') || path.startsWith('/job-seeker')) return 'job_seeker';
        return null; // Global notification if on public pages
      };
      
      const currentRole = getCurrentRole();
      console.log('[NotificationSettings] Sending test notification with role:', currentRole);
      
      const payload = {
        userId: currentUserId,
        message: `Test ${testType} notification from UI`,
        role: currentRole // Include role so it matches the current dashboard context
      };

      await testNotification(payload);
      setTestDialog(false);
      toast({ description: "Test notification sent!" });
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast({ description: "Failed to send test", variant: "destructive" });
    }
  };

  const resetToDefaults = () => {
    setSettings({
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      job_alerts: true,
      interview_reminders: true,
      message_notifications: true,
      video_interactions: true,
      connection_requests: true,
      marketing_emails: false,
      weekly_digest: true,
      quiet_hours_enabled: false,
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00',
      notification_frequency: 'immediate'
    });
    toast({ description: "Settings reset to defaults" });
  };

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
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">{i18n.t('auto_notification_settings')}</h1>
      <p className="text-gray-600 mb-6">{i18n.t('auto_customize_how_and_when_you_receive_notif')}</p>

      <div className="space-y-6">
        {/* Delivery Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />{i18n.t('auto_delivery_methods')}</CardTitle>
            <CardDescription>{i18n.t('auto_choose_how_you_want_to_receive_notificat')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-cyan-600" />
                <div>
                  <Label className="font-medium">{i18n.t('auto_email_notifications')}</Label>
                  <p className="text-sm text-gray-600">{i18n.t('auto_receive_notifications_via_email')}</p>
                </div>
              </div>
              <Switch
                checked={settings.email_notifications}
                onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
              />
            </div>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-purple-600" />
                <div>
                  <Label className="font-medium">{i18n.t('auto_push_notifications')}</Label>
                  <p className="text-sm text-gray-600">{i18n.t('auto_receive_push_notifications')}</p>
                </div>
              </div>
              <Switch
                checked={settings.push_notifications}
                onCheckedChange={async (checked) => {
                  handleSettingChange('push_notifications', checked);
                  // If user is enabling push and desktop notifications are available but permission is default,
                  // offer to enable native notifications automatically.
                  if (checked && !settings.desktop_notifications && typeof Notification !== 'undefined' && Notification.permission === 'default') {
                    const ok = await enableNativeNotifications();
                    if (ok) {
                      handleSettingChange('desktop_notifications', true);
                      localStorage.setItem('desktopNotificationsEnabled', 'true');
                      toast({ description: 'Desktop notifications enabled' });
                    }
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-purple-600" />
                <div>
                  <Label className="font-medium">{i18n.t('auto_desktop_notifications')}</Label>
                  <p className="text-sm text-gray-600">{i18n.t('auto_enable_desktop_native_notifications')}</p>
                </div>
              </div>
              <Switch
                checked={settings.desktop_notifications}
                onCheckedChange={async (checked) => {
                  // If enabling, request permission and register device via enableNativeNotifications
                  if (checked) {
                    const ok = await enableNativeNotifications();
                    if (ok) {
                      toast({ description: 'Desktop notifications enabled' });
                      localStorage.setItem('desktopNotificationsEnabled', 'true');
                      handleSettingChange('desktop_notifications', true);
                      // Try to show the server-registered endpoint if available
                      try {
                        const dev = JSON.parse(localStorage.getItem('pushDevice'));
                        if (dev && dev.pushSubscription && dev.pushSubscription.endpoint) {
                          toast({ description: 'Push subscription registered for endpoint: ' + dev.pushSubscription.endpoint });
                        }
                      } catch (e) { /* ignore parse errors */ }
                    } else {
                      toast({ description: 'Notification permission denied', variant: 'destructive' });
                      handleSettingChange('desktop_notifications', false);
                    }
                  } else {
                    // Disable: attempt to deregister the device server-side by posting fcmToken: null
                    try {
                      // Use explicit DELETE endpoint to unregister device
                      try {
                        const { deregisterNotificationDevice } = await import('@/services/api');
                        const resp = await deregisterNotificationDevice();
                        const device = resp?.data?.device || resp?.device;
                        if (device && device.pushSubscription && device.pushSubscription.endpoint) {
                          toast({ description: 'Device unregistered: ' + device.pushSubscription.endpoint });
                        }
                      } catch (err) {
                        // fallback to calling register with null if DELETE isn't available
                        await registerNotificationDevice({ fcmToken: null });
                      }
                    } catch (err) {
                      // ignore errors; we still toggle locally
                      console.warn('Failed to unregister notification device', err);
                    }
                    localStorage.setItem('desktopNotificationsEnabled', 'false');
                    handleSettingChange('desktop_notifications', false);
                    toast({ description: 'Desktop notifications disabled' });
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div className="flex items-center gap-2">
                  <Label className="font-medium">{i18n.t('auto_sms_notifications')}</Label>
                  <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600">{i18n.t('auto_premium')}</Badge>
                </div>
                <p className="text-sm text-gray-600">{i18n.t('auto_receive_notifications_via_sms')}</p>
              </div>
              <Switch
                checked={settings.sms_notifications}
                onCheckedChange={(checked) => handleSettingChange('sms_notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle>{i18n.t('auto_notification_types')}</CardTitle>
            <CardDescription>{i18n.t('auto_select_which_types_of_notifications_you_')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-purple-600" />
                <div>
                  <Label className="font-medium">{i18n.t('auto_job_alerts')}</Label>
                  <p className="text-sm text-gray-600">{i18n.t('auto_new_job_postings_matching_your_preferenc')}</p>
                </div>
              </div>
              <Switch
                checked={settings.job_alerts}
                onCheckedChange={(checked) => handleSettingChange('job_alerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-cyan-600" />
                <div>
                  <Label className="font-medium">{i18n.t('auto_interview_reminders')}</Label>
                  <p className="text-sm text-gray-600">{i18n.t('auto_reminders_for_upcoming_interviews')}</p>
                </div>
              </div>
              <Switch
                checked={settings.interview_reminders}
                onCheckedChange={(checked) => handleSettingChange('interview_reminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <div>
                  <Label className="font-medium">{i18n.t('messages')}</Label>
                  <p className="text-sm text-gray-600">{i18n.t('auto_new_messages_and_chat_notifications')}</p>
                </div>
              </div>
              <Switch
                checked={settings.message_notifications}
                onCheckedChange={(checked) => handleSettingChange('message_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-pink-600" />
                <div>
                  <Label className="font-medium">{i18n.t('auto_video_interactions')}</Label>
                  <p className="text-sm text-gray-600">{i18n.t('auto_likes_comments_and_shares_on_your_videos')}</p>
                </div>
              </div>
              <Switch
                checked={settings.video_interactions}
                onCheckedChange={(checked) => handleSettingChange('video_interactions', checked)}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-green-600" />
                <div>
                  <Label className="font-medium">{i18n.t('auto_connection_requests')}</Label>
                  <p className="text-sm text-gray-600">{i18n.t('auto_new_connection_requests_and_acceptances')}</p>
                </div>
              </div>
              <Switch
                checked={settings.connection_requests}
                onCheckedChange={(checked) => handleSettingChange('connection_requests', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Frequency & Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Frequency & Timing
            </CardTitle>
            <CardDescription>{i18n.t('auto_control_when_and_how_often_you_receive_n')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{i18n.t('auto_notification_frequency')}</Label>
              <Select
                value={settings.notification_frequency}
                onValueChange={(value) => handleSettingChange('notification_frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">{i18n.t('auto_immediate')}</SelectItem>
                  <SelectItem value="hourly">{i18n.t('auto_hourly_digest')}</SelectItem>
                  <SelectItem value="daily">{i18n.t('auto_daily_digest')}</SelectItem>
                  <SelectItem value="weekly">{i18n.t('auto_weekly_digest')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">{i18n.t('auto_weekly_activity_digest')}</Label>
                <p className="text-sm text-gray-600">{i18n.t('auto_receive_a_weekly_summary_of_your_activit')}</p>
              </div>
              <Switch
                checked={settings.weekly_digest}
                onCheckedChange={(checked) => handleSettingChange('weekly_digest', checked)}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">{i18n.t('auto_enable_quiet_hours')}</Label>
                  <p className="text-sm text-gray-600">{i18n.t('auto_mute_notifications_during_specific_times')}</p>
                </div>
                <Switch
                  checked={settings.quiet_hours_enabled}
                  onCheckedChange={(checked) => handleSettingChange('quiet_hours_enabled', checked)}
                />
              </div>

              {settings.quiet_hours_enabled && (
                <div className="grid grid-cols-2 gap-4 pl-8">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">{i18n.t('auto_start_time')}</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={settings.quiet_hours_start}
                      onChange={(e) => handleSettingChange('quiet_hours_start', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">{i18n.t('auto_end_time')}</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={settings.quiet_hours_end}
                      onChange={(e) => handleSettingChange('quiet_hours_end', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Marketing & Promotional */}
        <Card>
          <CardHeader>
            <CardTitle>Marketing & Promotional</CardTitle>
            <CardDescription>{i18n.t('auto_manage_marketing_and_promotional_communi')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">{i18n.t('auto_marketing_emails')}</Label>
                <p className="text-sm text-gray-600">Receive updates about new features, tips, and promotional offers</p>
              </div>
              <Switch
                checked={settings.marketing_emails}
                onCheckedChange={(checked) => handleSettingChange('marketing_emails', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={resetToDefaults}
                  className="border-gray-300"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />{i18n.t('auto_reset_to_defaults')}</Button>

                <Button
                  variant="outline"
                  onClick={() => setTestDialog(true)}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Bell className="h-4 w-4 mr-2" />{i18n.t('auto_test_notification')}</Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={async () => {
                    const ok = await enableNativeNotifications();
                    if (ok) toast({ description: 'Desktop notifications enabled' });
                    else toast({ description: 'Desktop notification permission not granted', variant: 'destructive' });
                  }}
                >{i18n.t('auto_enable_desktop_notifications')}</Button>
              </div>
              <Button
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />{i18n.t('auto_saving')}</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />{i18n.t('auto_save_settings')}</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Notification Dialog */}
      <Dialog open={testDialog} onOpenChange={setTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18n.t('auto_test_notification')}</DialogTitle>
            <DialogDescription>
              Send a test notification to verify your settings are working correctly
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{i18n.t('auto_notification_type')}</Label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">{i18n.t('auto_email')}</SelectItem>
                  <SelectItem value="push">{i18n.t('auto_push_notification')}</SelectItem>
                  {settings.sms_notifications && (
                    <SelectItem value="sms">{i18n.t('auto_sms')}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialog(false)}>{i18n.t('auto_cancel')}</Button>
            <Button onClick={handleTestNotification} className="bg-gradient-to-r from-purple-600 to-cyan-600">{i18n.t('auto_send_test')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationSettingsPage;
