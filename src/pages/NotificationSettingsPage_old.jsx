import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Notifications,
  Email,
  Sms,
  Work,
  VideoCall,
  Message,
  Favorite,
  PersonAdd,
  Schedule,
  Settings,
  Save,
  RestoreFromTrash
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { 
  getUserNotificationSettings, 
  updateNotificationSettings,
  testNotification 
} from '@/services/api';

const NotificationSettingsPage = () => {
  // const { user } = useAuth(); // Removed: unused variable
  
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
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
      setError('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateNotificationSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await testNotification(testType);
      setTestDialog(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to send test notification:', error);
      setError('Failed to send test notification');
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
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 2, md: 4 }, // Adjust padding for mobile
        px: { xs: 2, md: 4 }, // Adjust padding for mobile
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            mb: { xs: 2, md: 4 },
            fontSize: { xs: "1.5rem", md: "2rem" }, // Adjust font size for mobile
          }}
        >
          Notification Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Customize how and when you receive notifications
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Delivery Methods */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Delivery Methods
                </Typography>
                
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.email_notifications}
                        onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center">
                        <Email sx={{ mr: 1 }} />
                        Email Notifications
                      </Box>
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.push_notifications}
                        onChange={(e) => handleSettingChange('push_notifications', e.target.checked)}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center">
                        <Notifications sx={{ mr: 1 }} />
                        Push Notifications
                      </Box>
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.sms_notifications}
                        onChange={(e) => handleSettingChange('sms_notifications', e.target.checked)}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center">
                        <Sms sx={{ mr: 1 }} />
                        SMS Notifications
                        <Chip label="Premium" size="small" color="primary" sx={{ ml: 1 }} />
                      </Box>
                    }
                  />
                </FormGroup>
              </CardContent>
            </Card>
          </Grid>

          {/* Notification Types */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Types
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Work sx={{ mr: 1 }} />
                          Job Alerts
                        </Box>
                      }
                      secondary="New job postings matching your preferences"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.job_alerts}
                        onChange={(e) => handleSettingChange('job_alerts', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <VideoCall sx={{ mr: 1 }} />
                          Interview Reminders
                        </Box>
                      }
                      secondary="Reminders for upcoming interviews"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.interview_reminders}
                        onChange={(e) => handleSettingChange('interview_reminders', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Message sx={{ mr: 1 }} />
                          Messages
                        </Box>
                      }
                      secondary="New messages and chat notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.message_notifications}
                        onChange={(e) => handleSettingChange('message_notifications', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Favorite sx={{ mr: 1 }} />
                          Video Interactions
                        </Box>
                      }
                      secondary="Likes, comments, and shares on your videos"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.video_interactions}
                        onChange={(e) => handleSettingChange('video_interactions', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <PersonAdd sx={{ mr: 1 }} />
                          Connection Requests
                        </Box>
                      }
                      secondary="New connection requests and acceptances"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.connection_requests}
                        onChange={(e) => handleSettingChange('connection_requests', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Frequency and Timing */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Frequency & Timing
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Notification Frequency</InputLabel>
                      <Select
                        value={settings.notification_frequency}
                        onChange={(e) => handleSettingChange('notification_frequency', e.target.value)}
                        label="Notification Frequency"
                      >
                        <MenuItem value="immediate">Immediate</MenuItem>
                        <MenuItem value="hourly">Hourly Digest</MenuItem>
                        <MenuItem value="daily">Daily Digest</MenuItem>
                        <MenuItem value="weekly">Weekly Digest</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.weekly_digest}
                          onChange={(e) => handleSettingChange('weekly_digest', e.target.checked)}
                        />
                      }
                      label="Weekly Activity Digest"
                    />
                  </Grid>
                </Grid>
                
                <Box mt={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.quiet_hours_enabled}
                        onChange={(e) => handleSettingChange('quiet_hours_enabled', e.target.checked)}
                      />
                    }
                    label="Enable Quiet Hours"
                  />
                  
                  {settings.quiet_hours_enabled && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <TextField
                          type="time"
                          label="Start Time"
                          value={settings.quiet_hours_start}
                          onChange={(e) => handleSettingChange('quiet_hours_start', e.target.value)}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          type="time"
                          label="End Time"
                          value={settings.quiet_hours_end}
                          onChange={(e) => handleSettingChange('quiet_hours_end', e.target.value)}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Marketing & Promotional */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Marketing & Promotional
                </Typography>
                
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.marketing_emails}
                        onChange={(e) => handleSettingChange('marketing_emails', e.target.checked)}
                      />
                    }
                    label="Marketing Emails"
                  />
                </FormGroup>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Receive updates about new features, tips, and promotional offers
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<RestoreFromTrash />}
                    onClick={resetToDefaults}
                    sx={{ mr: 2 }}
                  >
                    Reset to Defaults
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => setTestDialog(true)}
                  >
                    Test Notification
                  </Button>
                </Box>
                
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveSettings}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={20} /> : 'Save Settings'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Test Notification Dialog */}
        <Dialog open={testDialog} onClose={() => setTestDialog(false)}>
          <DialogTitle>Test Notification</DialogTitle>
          <DialogContent>
            <Typography paragraph>
              Send a test notification to verify your settings are working correctly.
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel>Notification Type</InputLabel>
              <Select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                label="Notification Type"
              >
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="push">Push Notification</MenuItem>
                {settings.sms_notifications && (
                  <MenuItem value="sms">SMS</MenuItem>
                )}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTestDialog(false)}>Cancel</Button>
            <Button onClick={handleTestNotification} variant="contained">
              Send Test
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default NotificationSettingsPage;

