// NavigationPanel.jsx
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  Home,
  Videocam,
  VideoCameraFront,
  Dashboard,
  Person,
  Work
} from "@mui/icons-material";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const NavigationPanel = ({ navigate }) => {
  const { role, user } = useAuth();
  const isEmployer = role === 'employer';

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '280px' },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        p: 2,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        marginLeft: { sm: 'auto' }, // Push panel to the right
        marginRight: { sm: '20px' } // Add right margin
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
          fontFamily: "'Poppins', sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          position: 'relative',
          pb: 1,
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(9,67,143,0.8) 0%, rgba(255,255,255,0) 80%)',
            borderRadius: '2px'
          }
        }}
      >
        SwipeScout
      </Typography>

      {user && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#2196f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {user.display_name?.charAt(0) || 'U'}
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user.display_name || 'User'}
          </Typography>
        </Box>
      )}

      {/* Demo Videos Section */}
      <Typography sx={{
        fontWeight: 'bold',
        color: 'rgb(46, 111, 155)',
        fontFamily: 'Arial, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        pt: 1
      }}>
        Sample Videos
      </Typography>

      <List sx={{ width: '100%' }}>
        <ListItem
          button
          onClick={() => navigate('/job-seeker-explore-public')}
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#2196f3' }}>
            <Person />
          </ListItemIcon>
          <ListItemText
            primary="Jobseekers Demo"
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>

        <ListItem
          button
          onClick={() => navigate('/employer-explore-public')}
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#2196f3' }}>
            <Work />
          </ListItemIcon>
          <ListItemText
            primary="Employers Demo"
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>
      </List>

      {/* Real Videos Section */}
      <Typography sx={{
        fontWeight: 'bold',
        color: 'rgb(39, 111, 121)',
        fontFamily: 'Arial, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        mt: 1
      }}>
        Real Videos
      </Typography>

      <List sx={{ width: '100%' }}>
        <ListItem
          button
          onClick={() => navigate('/videos/all')}
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#2196f3' }}>
            <Videocam />
          </ListItemIcon>
          <ListItemText
            primary="All Videos"
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>

        <ListItem
          button
          onClick={() => navigate('/videos/jobseekers')}
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#2196f3' }}>
            <Person />
          </ListItemIcon>
          <ListItemText
            primary="Jobseekers"
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>

        <ListItem
          button
          onClick={() => navigate('/videos/employers')}
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#2196f3' }}>
            <Work />
          </ListItemIcon>
          <ListItemText
            primary="Employers"
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>
      </List>

      {/* User Specific Links */}
      <List sx={{ width: '100%', mt: 'auto' }}>
        {!role && (
          <ListItem
            button
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: '12px',
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.1)'
              }
            }}
          >
            <ListItemText
              primary="Login"
              primaryTypographyProps={{ 
                fontWeight: 500,
                color: 'rgb(1, 81, 128)'
              }}
            />
          </ListItem>
        )}

        {role && (
          <ListItem
            button
            onClick={() => isEmployer ? navigate('/employer-dashboard') : navigate('/dashboard-jobseeker')}
            sx={{
              borderRadius: '12px',
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#2196f3' }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>
        )}

        <ListItem
          button
          onClick={() => navigate('/video-upload')}
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#2196f3' }}>
            <VideoCameraFront />
          </ListItemIcon>
          <ListItemText
            primary="Upload Video"
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>

        <ListItem
          button
          onClick={() => navigate('/')}
          sx={{
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#2196f3' }}>
            <Home />
          </ListItemIcon>
          <ListItemText
            primary="Home"
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default NavigationPanel;