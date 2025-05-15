import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Switch,
    TextField,
    Button,
    Grid,
    Avatar,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import { useAuth } from '../hooks/useAuth';
import { getUserSettings, updateUserSettings } from '../services/userService';

const SettingsContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: 'calc(100vh - 56px)',
}));

const SettingsPaper = styled(Paper)(({ theme }) => ({
    padding: 0,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
}));

const SettingsSidebar = styled(Box)(({ theme }) => ({
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('md')]: {
        width: 240,
        borderRight: `1px solid ${theme.palette.divider}`,
        height: '100%',
    },
}));

const SettingsContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    flex: 1,
}));

const SettingsHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const AvatarUpload = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
    width: 100,
    height: 100,
    marginBottom: theme.spacing(2),
}));

const Settings = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        bio: '',
        location: '',
        language: 'ar',
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        profileVisibility: 'public',
        twoFactorAuth: false,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const response = await getUserSettings();
                setSettings(response.data.settings);
                setFormData({
                    name: response.data.settings.name || '',
                    email: response.data.settings.email || '',
                    mobile: response.data.settings.mobile || '',
                    bio: response.data.settings.bio || '',
                    location: response.data.settings.location || '',
                    language: response.data.settings.language || 'ar',
                    emailNotifications: response.data.settings.notifications?.email || true,
                    pushNotifications: response.data.settings.notifications?.push || true,
                    smsNotifications: response.data.settings.notifications?.sms || false,
                    profileVisibility: response.data.settings.privacy?.profile_visibility || 'public',
                    twoFactorAuth: response.data.settings.security?.two_factor_auth || false,
                });
            } catch (error) {
                console.error('Error fetching settings:', error);
                setSnackbar({
                    open: true,
                    message: 'An error occurred while loading settings',
                    severity: 'error',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked,
        });
    };

    const handleSaveSettings = async () => {
        try {
            setSaving(true);

            // Convert data to the required API format
            const updatedSettings = {
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                bio: formData.bio,
                location: formData.location,
                language: formData.language,
                notifications: {
                    email: formData.emailNotifications,
                    push: formData.pushNotifications,
                    sms: formData.smsNotifications,
                },
                privacy: {
                    profile_visibility: formData.profileVisibility,
                },
                security: {
                    two_factor_auth: formData.twoFactorAuth,
                },
            };

            await updateUserSettings(updatedSettings);

            setSnackbar({
                open: true,
                message: 'Settings saved successfully',
                severity: 'success',
            });
        } catch (error) {
            console.error('Error saving settings:', error);
            setSnackbar({
                open: true,
                message: 'An error occurred while saving settings',
                severity: 'error',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenConfirmDialog = (title, message) => {
        setConfirmDialog({
            open: true,
            title,
            message,
        });
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialog({ ...confirmDialog, open: false });
    };

    const handleDeleteAccount = () => {
        handleOpenConfirmDialog(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone and will result in the loss of all your data.'
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <SettingsContainer maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={3}>
                    <SettingsPaper elevation={2}>
                        <SettingsSidebar>
                            <List>
                                <ListItemButton
                                    selected={activeSection === 'profile'}
                                    onClick={() => handleSectionChange('profile')}
                                >
                                    <ListItemIcon>
                                        <AccountCircleIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Profile" />
                                </ListItemButton>

                                <ListItemButton
                                    selected={activeSection === 'notifications'}
                                    onClick={() => handleSectionChange('notifications')}
                                >
                                    <ListItemIcon>
                                        <NotificationsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Notifications" />
                                </ListItemButton>

                                <ListItemButton
                                    selected={activeSection === 'privacy'}
                                    onClick={() => handleSectionChange('privacy')}
                                >
                                    <ListItemIcon>
                                        <VisibilityIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Privacy" />
                                </ListItemButton>

                                <ListItemButton
                                    selected={activeSection === 'security'}
                                    onClick={() => handleSectionChange('security')}
                                >
                                    <ListItemIcon>
                                        <SecurityIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Security" />
                                </ListItemButton>

                                <ListItemButton
                                    selected={activeSection === 'language'}
                                    onClick={() => handleSectionChange('language')}
                                >
                                    <ListItemIcon>
                                        <LanguageIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Language" />
                                </ListItemButton>

                                <ListItemButton
                                    selected={activeSection === 'help'}
                                    onClick={() => handleSectionChange('help')}
                                >
                                    <ListItemIcon>
                                        <HelpIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Help" />
                                </ListItemButton>

                                <Divider />

                                <ListItemButton
                                    onClick={handleDeleteAccount}
                                    sx={{ color: 'error.main' }}
                                >
                                    <ListItemIcon sx={{ color: 'error.main' }}>
                                        <DeleteIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Delete Account" />
                                </ListItemButton>
                            </List>
                        </SettingsSidebar>
                    </SettingsPaper>
                </Grid>

                <Grid item xs={12} md={9}>
                    <SettingsPaper elevation={2}>
                        {activeSection === 'profile' && (
                            <Box>
                                <SettingsHeader>
                                    <Typography variant="h6">Profile Settings</Typography>
                                </SettingsHeader>

                                <SettingsContent>
                                    <AvatarUpload>
                                        <LargeAvatar src={user?.photo_url}>
                                            {!user?.photo_url && user?.name?.charAt(0)}
                                        </LargeAvatar>
                                        <Button variant="outlined" component="label">
                                            Change Photo
                                            <input type="file" hidden accept="image/*" />
                                        </Button>
                                    </AvatarUpload>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Mobile Number"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                margin="normal"
                                                multiline
                                                rows={4}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSaveSettings}
                                            disabled={saving}
                                        >
                                            {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                                        </Button>
                                    </Box>
                                </SettingsContent>
                            </Box>
                        )}

                        {activeSection === 'notifications' && (
                            <Box>
                                <SettingsHeader>
                                    <Typography variant="h6">Notification Settings</Typography>
                                </SettingsHeader>

                                <SettingsContent>
                                    <List>
                                        <ListItem>
                                            <ListItemText
                                                primary="Email Notifications"
                                                secondary="Receive notifications via email"
                                            />
                                            <Switch
                                                edge="end"
                                                name="emailNotifications"
                                                checked={formData.emailNotifications}
                                                onChange={handleSwitchChange}
                                            />
                                        </ListItem>

                                        <Divider />

                                        <ListItem>
                                            <ListItemText
                                                primary="Push Notifications"
                                                secondary="Receive notifications on your browser and mobile"
                                            />
                                            <Switch
                                                edge="end"
                                                name="pushNotifications"
                                                checked={formData.pushNotifications}
                                                onChange={handleSwitchChange}
                                            />
                                        </ListItem>

                                        <Divider />

                                        <ListItem>
                                            <ListItemText
                                                primary="SMS Notifications"
                                                secondary="Receive notifications via SMS"
                                            />
                                            <Switch
                                                edge="end"
                                                name="smsNotifications"
                                                checked={formData.smsNotifications}
                                                onChange={handleSwitchChange}
                                            />
                                        </ListItem>
                                    </List>

                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSaveSettings}
                                            disabled={saving}
                                        >
                                            {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                                        </Button>
                                    </Box>
                                </SettingsContent>
                            </Box>
                        )}

                        {activeSection === 'privacy' && (
                            <Box>
                                <SettingsHeader>
                                    <Typography variant="h6">Privacy Settings</Typography>
                                </SettingsHeader>

                                <SettingsContent>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Profile Visibility</InputLabel>
                                        <Select
                                            name="profileVisibility"
                                            value={formData.profileVisibility}
                                            onChange={handleInputChange}
                                            label="Profile Visibility"
                                        >
                                            <MenuItem value="public">Public</MenuItem>
                                            <MenuItem value="connections">Only Connections</MenuItem>
                                            <MenuItem value="private">Private</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSaveSettings}
                                            disabled={saving}
                                        >
                                            {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                                        </Button>
                                    </Box>
                                </SettingsContent>
                            </Box>
                        )}

                        {activeSection === 'security' && (
                            <Box>
                                <SettingsHeader>
                                    <Typography variant="h6">Security Settings</Typography>
                                </SettingsHeader>

                                <SettingsContent>
                                    <List>
                                        <ListItem>
                                            <ListItemText
                                                primary="Two-Factor Authentication"
                                                secondary="Enable two-factor authentication to increase your account security"
                                            />
                                            <Switch
                                                edge="end"
                                                name="twoFactorAuth"
                                                checked={formData.twoFactorAuth}
                                                onChange={handleSwitchChange}
                                            />
                                        </ListItem>

                                        <Divider />
                                    </List>

                                    <Box sx={{ mt: 3 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            sx={{ mb: 2 }}
                                        >
                                            Change Password
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                        >
                                            Active Login Sessions
                                        </Button>
                                    </Box>

                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSaveSettings}
                                            disabled={saving}
                                        >
                                            {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                                        </Button>
                                    </Box>
                                </SettingsContent>
                            </Box>)}

                            {activeSection === 'language' && (
                                <Box>
                                    <SettingsHeader>
                                        <Typography variant="h6">Language Settings</Typography>
                                    </SettingsHeader>
    
                                    <SettingsContent>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>Language</InputLabel>
                                            <Select
                                                name="language"
                                                value={formData.language}
                                                onChange={handleInputChange}
                                                label="Language"
                                            >
                                                <MenuItem value="ar">Arabic</MenuItem>
                                                <MenuItem value="en">English</MenuItem>
                                            </Select>
                                        </FormControl>
    
                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSaveSettings}
                                                disabled={saving}
                                            >
                                                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                                            </Button>
                                        </Box>
                                    </SettingsContent>
                                </Box>
                            )}
    
                            {activeSection === 'help' && (
                                <Box>
                                    <SettingsHeader>
                                        <Typography variant="h6">Help & Support</Typography>
                                    </SettingsHeader>
    
                                    <SettingsContent>
                                        <Typography variant="body1" paragraph>
                                            If you need help or have any questions, you can contact our support team.
                                        </Typography>
    
                                        <List>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Help Center"
                                                    secondary="Browse frequently asked questions and tutorial articles"
                                                />
                                                <Button variant="outlined" size="small">
                                                    Open
                                                </Button>
                                            </ListItem>
    
                                            <Divider />
    
                                            <ListItem>
                                                <ListItemText
                                                    primary="Technical Support"
                                                    secondary="Contact our technical support team"
                                                />
                                                <Button variant="outlined" size="small">
                                                    Contact
                                                </Button>
                                            </ListItem>
    
                                            <Divider />
    
                                            <ListItem>
                                                <ListItemText
                                                    primary="Report a Problem"
                                                    secondary="Report an issue or bug in the application"
                                                />
                                                <Button variant="outlined" size="small">
                                                    Report
                                                </Button>
                                            </ListItem>
                                        </List>
                                    </SettingsContent>
                                </Box>
                            )}
                        </SettingsPaper>
                    </Grid>
                </Grid>
    
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
    
                <Dialog
                    open={confirmDialog.open}
                    onClose={handleCloseConfirmDialog}
                >
                    <DialogTitle>{confirmDialog.title}</DialogTitle>
                    <DialogContent>
                        <Typography>{confirmDialog.message}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
                        <Button color="error" onClick={handleCloseConfirmDialog}>
                            Delete Account
                        </Button>
                    </DialogActions>
                </Dialog>
            </SettingsContainer>
        );
    };
    
    export default Settings;