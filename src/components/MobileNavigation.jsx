import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, useTheme } from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

import { useAuth } from '../hooks/useAuth';

const MobileNavigation = () => {
    const { user, role } = useAuth();
    
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    // Set the active tab based on current route
    const path = location.pathname;
    if (path.startsWith('/home')) setValue(0);
    else if (path.startsWith('/search')) setValue(1);
    else if (path.startsWith('/chat')) setValue(2);
    else if (path.startsWith('/notifications')) setValue(3);
    else if (path.startsWith('/jobseeker-tabs') && new URLSearchParams(location.search).get('tab') === 'notifications') setValue(3);
    else if (path.startsWith('/employer-tabs') && new URLSearchParams(location.search).get('tab') === 'notifications') setValue(3);
    else if (path.startsWith('/profile')) setValue(4);
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate(role === 'employer' ? '/employer-dashboard' : '/dashboard');
        break;
      case 1:
        navigate('/search');
        break;
      case 2:
        navigate('/chat');
        break;
      case 3:
        // Navigate into the tabbed route for notifications depending on role
        if (role === 'employer') {
          navigate('/employer-tabs?group=managementSettings&tab=notifications');
        } else {
          navigate('/jobseeker-tabs?group=activities&tab=notification-settings');
        }
        break;
        break;
      case 4:
        navigate(role=='employer'?'/employer-profile':'Job-seeker-profile');
        break;
      default:
        navigate('#');
    }
  };
 
//   const MobileNavigation = ({ items = defaultItems }) => {
//     // ...render items dynamically
//   }

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: theme.zIndex.appBar,
        display: { xs: 'block', md: 'none' }
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: theme.palette.background.paper,
          '& .Mui-selected': {
            color: theme.palette.primary.main,
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        <BottomNavigationAction label="Chat" icon={<ChatIcon />} />
        <BottomNavigationAction label="Notifications" icon={<NotificationsIcon />} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
        {/* <BottomNavigationAction 
  label="Chat" 
  icon={
    <Badge badgeContent={unreadCount} color="error">
      <ChatIcon />
    </Badge>
  } 
/> */}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileNavigation;