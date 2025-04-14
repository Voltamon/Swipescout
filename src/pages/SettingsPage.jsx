import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import {
  Notifications,
  Language,
  Lock,
  Visibility,
  VisibilityOff,
  Delete,
  ArrowBack,
  Edit,
  AccountCircle,
  Email,
  Phone,
  LocationOn,
  Work,
  School,
  Logout,
  Help,
  Info
} from '@mui/icons-material';
import { styled } from '@mui/system';

const SettingsContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  borderRadius: '16px',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
}));

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showPassword, setShowPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    // Account deletion logic here
    setDeleteDialogOpen(false);
  };

  const handleEditProfile = () => {
    setEditProfileDialogOpen(true);
  };

  const handleCloseEditProfileDialog = () => {
    setEditProfileDialogOpen(false);
  };

  const handleSaveProfile = () => {
    // Profile save logic here
    setEditProfileDialogOpen(false);
  };

  return (
    <SettingsContainer maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton href="/" sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          Settings
        </Typography>
      </Box>

      {/* Profile Section */}
      <ProfileCard elevation={3}>
        <Avatar
          src="https://example.com/profile.jpg"
          sx={{ width: 80, height: 80, mr: 3 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            Alex Johnson
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Frontend Developer
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            San Francisco, CA
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={handleEditProfile}
        >
          Edit Profile
        </Button>
      </ProfileCard>

      {/* Account Settings */}
      <SectionTitle variant="subtitle1">ACCOUNT SETTINGS</SectionTitle>
      <Paper elevation={2} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Personal Information" secondary="Name, email, phone number" />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemIcon>
              <Lock />
            </ListItemIcon>
            <ListItemText 
              primary="Password" 
              secondary={showPassword ? "password123" : "••••••••"} 
            />
            <IconButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            <ListItemText primary="Language" />
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <Select
                value={language}
                onChange={handleLanguageChange}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        </List>
      </Paper>

      {/* Preferences */}
      <SectionTitle variant="subtitle1">PREFERENCES</SectionTitle>
      <Paper elevation={2} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText primary="Notifications" secondary="Receive app notifications" />
            <Switch
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            <ListItemText primary="Dark Mode" secondary="Switch between light and dark theme" />
            <Switch
              checked={darkMode}
              onChange={handleToggleDarkMode}
            />
          </ListItem>
        </List>
      </Paper>

      {/* Privacy */}
      <SectionTitle variant="subtitle1">PRIVACY</SectionTitle>
      <Paper elevation={2} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <Visibility />
            </ListItemIcon>
            <ListItemText 
              primary="Profile Visibility" 
              secondary="Control who can see your profile" 
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemIcon>
              <Work />
            </ListItemIcon>
            <ListItemText 
              primary="Hide from Current Employer" 
              secondary="Prevent your current employer from seeing your profile" 
            />
            <Switch />
          </ListItem>
        </List>
      </Paper>

      {/* Support & About */}
      <SectionTitle variant="subtitle1">SUPPORT & ABOUT</SectionTitle>
      <Paper elevation={2} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <List>
          <ListItem button>
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help Center" />
          </ListItem>
          <Divider component="li" />
          <ListItem button>
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary="About SwipeScout" />
          </ListItem>
        </List>
      </Paper>

      {/* Danger Zone */}
      <SectionTitle variant="subtitle1">DANGER ZONE</SectionTitle>
      <Paper elevation={2} sx={{ borderRadius: '16px', overflow: 'hidden', mb: 4 }}>
        <List>
          <ListItem button onClick={() => handleDeleteAccount()}>
            <ListItemIcon sx={{ color: 'error.main' }}>
              <Delete />
            </ListItemIcon>
            <ListItemText 
              primary="Delete Account" 
              primaryTypographyProps={{ color: 'error' }}
              secondary="Permanently delete your account and all data" 
            />
          </ListItem>
          <Divider component="li" />
          <ListItem button>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItem>
        </List>
      </Paper>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Your Account?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
            All your data, including your profile, video resume, and matches will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            variant="contained"
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={editProfileDialogOpen} 
        onClose={handleCloseEditProfileDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar
              src="https://example.com/profile.jpg"
              sx={{ width: 120, height: 120 }}
            />
          </Box>
          <Button fullWidth variant="outlined" sx={{ mb: 3 }}>
            Change Profile Photo
          </Button>
          
          <TextField
            fullWidth
            label="Full Name"
            defaultValue="Alex Johnson"
            margin="normal"
            InputProps={{
              startAdornment: (
                <AccountCircle sx={{ mr: 1, color: 'action.active' }} />
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Email"
            defaultValue="alex.johnson@example.com"
            margin="normal"
            InputProps={{
              startAdornment: (
                <Email sx={{ mr: 1, color: 'action.active' }} />
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Phone"
            defaultValue="+1 (555) 123-4567"
            margin="normal"
            InputProps={{
              startAdornment: (
                <Phone sx={{ mr: 1, color: 'action.active' }} />
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Location"
            defaultValue="San Francisco, CA"
            margin="normal"
            InputProps={{
              startAdornment: (
                <LocationOn sx={{ mr: 1, color: 'action.active' }} />
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Job Title"
            defaultValue="Frontend Developer"
            margin="normal"
            InputProps={{
              startAdornment: (
                <Work sx={{ mr: 1, color: 'action.active' }} />
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Education"
            defaultValue="Stanford University"
            margin="normal"
            InputProps={{
              startAdornment: (
                <School sx={{ mr: 1, color: 'action.active' }} />
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditProfileDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveProfile} 
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </SettingsContainer>
  );
};

export default SettingsPage;