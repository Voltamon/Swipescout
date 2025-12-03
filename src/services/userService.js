import axios from 'axios';
import { getAuthHeader } from './authService';

// Base host (without trailing /api) and API base with /api suffix
const BASE_HOST = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_BASE_URL = BASE_HOST.endsWith('/') ? `${BASE_HOST}api` : `${BASE_HOST}/api`;

// User Settings Functions
export const getUserSettings = async () => {
  // Try to fetch a consolidated settings object. Backend exposes different endpoints
  // so we'll attempt the most specific one first, then fall back to composing from
  // profile and notification endpoints.
  try {
    // Try user settings endpoint (may or may not exist)
    try {
      const res = await axios.get(`${API_BASE_URL}/users/settings`, { headers: getAuthHeader() });
      // If backend returns { settings } or similar, normalize to a common shape
      const data = res.data?.settings || res.data || {};
      return { data };
    } catch {
      // Not available - fall back
    }

    // Fetch profile and notification settings in parallel
    const [meRes, notifRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/users/me`, { headers: getAuthHeader() }),
      axios.get(`${API_BASE_URL}/notifications/settings`, { headers: getAuthHeader() })
    ]);

    const user = meRes.data?.user || meRes.data;
    const notifications = notifRes.data?.settings || notifRes.data;

    // Build a normalized settings object expected by the Settings page
    const data = {
      name: user?.display_name || user?.displayName || '',
      email: user?.email || '',
      mobile: user?.mobile || user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      linkedin: user?.linkedin || '',
      github: user?.github || '',
      twitter: user?.twitter || '',
      notifications: notifications || {},
      // privacy/account defaults will be filled by Settings.jsx if missing
    };

    return { data };
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
};

export const getUserExperiences = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/experiences`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user experiences:', error);
    throw error;
  }
};
 
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const getUserSkills = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/job-seekers/skills`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user skills:', error);
    throw error;
  }
};

export const getUserVideos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user videos:', error);
    throw error;
  }
};

export const updateUserSettings = async (settings) => {
  // settings can contain { profile, notifications, privacy, account }
  try {
    const results = {};

    // 1) Profile updates -> PUT /users/me (limited: backend currently supports display_name)
    if (settings.profile) {
      const payload = {};
      if (settings.profile.name !== undefined) payload.display_name = settings.profile.name;
      // Only update fields backend supports here; other profile fields may require separate endpoints
      if (Object.keys(payload).length > 0) {
        const res = await axios.put(`${API_BASE_URL}/users/me`, payload, { headers: getAuthHeader() });
        results.profile = res.data;
      }
    }

    // 2) Notification settings -> PUT /notifications/settings (expects { settings })
    if (settings.notifications) {
      // Map simple boolean flags from UI into nested notification settings used by backend
      const ui = settings.notifications;
      const mapped = {
        email: {
          newMessages: !!ui.messageNotifications,
          jobMatches: !!ui.jobAlerts,
          applicationUpdates: !!ui.interviewReminders,
          profileViews: !!ui.profileViews || false,
          marketingEmails: !!ui.weeklyDigest || false
        },
        push: {
          newMessages: !!ui.messageNotifications,
          jobMatches: !!ui.jobAlerts,
          applicationUpdates: !!ui.interviewReminders,
          profileViews: !!ui.profileViews || false
        },
        inApp: {
          newMessages: !!ui.messageNotifications,
          jobMatches: !!ui.jobAlerts,
          applicationUpdates: !!ui.interviewReminders,
          profileViews: true,
          systemUpdates: true
        }
      };
      // Persist desktop notifications preference to server-side user.notificationSettings
      if (ui.desktop_notifications !== undefined) {
        mapped.desktop_notifications = !!ui.desktop_notifications;
      }
      const res = await axios.put(`${API_BASE_URL}/notifications/settings`, { settings: mapped }, { headers: getAuthHeader() });
      results.notifications = res.data;
    }

    // 3) Privacy/account -> attempt to call users/settings endpoint if present
    if (settings.privacy || settings.account) {
      try {
        const body = {};
        if (settings.privacy) body.privacy = settings.privacy;
        if (settings.account) body.account = settings.account;
        const res = await axios.put(`${API_BASE_URL}/users/settings`, body, { headers: getAuthHeader() });
        results.privacy = res.data;
      } catch {
        // If /users/settings doesn't exist, ignore for now (could be added server-side later)
      }
    }

    return results;
  } catch (error) {
    // Log detailed info for easier debugging in dev tools
    console.error('Error updating user settings:', error);
    if (error?.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

// Profile Picture Functions
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/users/me/avatar`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Account Security Functions
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/me/change-password`,
      { currentPassword, newPassword },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const enableTwoFactorAuth = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/enable-2fa`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error enabling two-factor authentication:', error);
    throw error;
  }
};

// Account Management Functions
export const deleteAccount = async () => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/users/me`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

// Notification Preferences
export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/user/notifications`,
      preferences,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

// Language Preferences
export const updateLanguagePreference = async (language) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/user/language`,
      { language },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating language preference:', error);
    throw error;
  }
};