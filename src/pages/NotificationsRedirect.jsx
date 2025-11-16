import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationsRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const roleStr = Array.isArray(user?.role) ? user?.role[0] : user?.role;
    if (roleStr === 'employer') {
      navigate('/employer-tabs?group=managementSettings&tab=notifications', { replace: true });
    } else if (roleStr === 'admin') {
      navigate('/admin-tabs?group=dashboard&tab=notifications', { replace: true });
    } else {
      navigate('/jobseeker-tabs?group=communication&tab=notifications', { replace: true });
    }
  }, [user, navigate]);

  return null;
};

export default NotificationsRedirect;
