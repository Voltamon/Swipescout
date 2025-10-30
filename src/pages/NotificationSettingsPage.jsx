import React, { useState, useEffect } from 'react';
import {
  Bell, Mail, Smartphone, Briefcase, Video, MessageSquare,
  Heart, UserPlus, Clock, Save, RotateCcw, Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserNotificationSettings, 
  updateNotificationSettings,
  testNotification 
} from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const NotificationSettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
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
    notification_frequency: 'immediate'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testDialog, setTestDialog] = useState(false);
  const [testType, setTestType] = useState('email');

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      setLoading(true);
      const response = await getUserNotificationSettings();
      setSettings({ ...settings, ...response.data.settings });
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      toast({ description: "Failed to load settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateNotificationSettings(settings);
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
      await testNotification(testType);
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
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
        Notification Settings
      </h1>
      <p className="text-gray-600 mb-6">Customize how and when you receive notifications</p>

      <div className="space-y-6">
        {/* Delivery Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Delivery Methods
            </CardTitle>
            <CardDescription>Choose how you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-cyan-600" />
                <div>
                  <Label className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                checked={settings.email_notifications}
                onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-purple-600" />
                <div>
                  <Label className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-gray-600">Receive push notifications</p>
                </div>
              </div>
              <Switch
                checked={settings.push_notifications}
                onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div className="flex items-center gap-2">
                  <Label className="font-medium">SMS Notifications</Label>
                  <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600">Premium</Badge>
                </div>
                <p className="text-sm text-gray-600">Receive notifications via SMS</p>
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
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>Select which types of notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-purple-600" />
                <div>
                  <Label className="font-medium">Job Alerts</Label>
                  <p className="text-sm text-gray-600">New job postings matching your preferences</p>
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
                  <Label className="font-medium">Interview Reminders</Label>
                  <p className="text-sm text-gray-600">Reminders for upcoming interviews</p>
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
                  <Label className="font-medium">Messages</Label>
                  <p className="text-sm text-gray-600">New messages and chat notifications</p>
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
                  <Label className="font-medium">Video Interactions</Label>
                  <p className="text-sm text-gray-600">Likes, comments, and shares on your videos</p>
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
                  <Label className="font-medium">Connection Requests</Label>
                  <p className="text-sm text-gray-600">New connection requests and acceptances</p>
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
            <CardDescription>Control when and how often you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select
                value={settings.notification_frequency}
                onValueChange={(value) => handleSettingChange('notification_frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Weekly Activity Digest</Label>
                <p className="text-sm text-gray-600">Receive a weekly summary of your activity</p>
              </div>
              <Switch
                checked={settings.weekly_digest}
                onCheckedChange={(checked) => handleSettingChange('weekly_digest', checked)}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Enable Quiet Hours</Label>
                  <p className="text-sm text-gray-600">Mute notifications during specific times</p>
                </div>
                <Switch
                  checked={settings.quiet_hours_enabled}
                  onCheckedChange={(checked) => handleSettingChange('quiet_hours_enabled', checked)}
                />
              </div>

              {settings.quiet_hours_enabled && (
                <div className="grid grid-cols-2 gap-4 pl-8">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={settings.quiet_hours_start}
                      onChange={(e) => handleSettingChange('quiet_hours_start', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
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
            <CardDescription>Manage marketing and promotional communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Marketing Emails</Label>
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
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setTestDialog(true)}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Test Notification
                </Button>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
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
            <DialogTitle>Test Notification</DialogTitle>
            <DialogDescription>
              Send a test notification to verify your settings are working correctly
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Notification Type</Label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                  {settings.sms_notifications && (
                    <SelectItem value="sms">SMS</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleTestNotification} className="bg-gradient-to-r from-purple-600 to-cyan-600">
              Send Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationSettingsPage;
