import axios from 'axios';
import { getAuthHeader } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL +'/api/'|| 'http://localhost:5000/api';

// User Settings Functions
export const getUserSettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/settings`, {
      headers: getAuthHeader()
    });
    return response.data;
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
  try {
    const response = await axios.put(
      `${API_BASE_URL}/user/settings`,
      settings,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

// Profile Picture Functions
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/user/upload-avatar`,
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
      `${API_BASE_URL}/user/change-password`,
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
      `${API_BASE_URL}/user/account`,
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