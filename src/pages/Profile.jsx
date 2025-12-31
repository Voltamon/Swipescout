import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { getCurrentUser, updateCurrentUser } from '@/services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await updateCurrentUser(profileData);
      updateUser(response.data);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>{i18n.t('auto_please_log_in_to_view_your_profile')}</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>{i18n.t('auto_my_profile')}</h1>
        
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="firstName">{i18n.t('auto_first_name')}</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">{i18n.t('auto_last_name')}</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{i18n.t('auto_email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">{i18n.t('auto_bio')}</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              rows="4"
              placeholder={i18n.t('auto_tell_us_about_yourself')} 
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

