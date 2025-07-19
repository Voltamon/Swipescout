// NavigationPanel.jsx
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import {
  Home,
  Videocam,
  VideoCameraFront,
  Dashboard,
  Person,
  Work,
  PlayCircleOutline,
  Business
} from "@mui/icons-material";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const NavigationPanel = ({ navigate }) => {
  const { role, user } = useAuth();

  return (
    <Box
      sx={{
        width: '260px', // Increased from 220px
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        p: 2, // Increased from 1.5
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', // Slightly stronger shadow
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 'auto',
        marginRight: '16px'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 1 }}> {/* Increased mb */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: '#1976d2',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '1.2rem' // Slightly larger
          }}
        >
          SwipeScout
        </Typography>
      </Box>

      {/* User Info */}
      {user && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, // Increased gap
          mb: 2, // Increased mb
          px: 1,
          py: 1, // Increased py
          backgroundColor: 'rgba(25, 118, 210, 0.05)',
          borderRadius: '8px'
        }}>
          <Box sx={{
            width: 36, // Increased from 32
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#1976d2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.95rem' // Slightly larger
          }}>
            {user.display_name?.charAt(0) || 'U'}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem' }}> {/* Slightly larger */}
            {user.display_name || 'User'}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 1.5 }} /> {/* Increased my */}

      {/* Sample Videos Section */}
      <Typography variant="caption" sx={{ 
        fontWeight: 600,
        color: '#555',
        px: 1,
        mb: 1, // Increased mb
        display: 'block',
        fontSize: '0.75rem' // Slightly larger
      }}>
        SAMPLE VIDEOS
      </Typography>

      <List dense sx={{ py: 0.5 }}> {/* Increased py */}
        <ListItem 
          button 
          dense
          onClick={() => navigate('/job-seeker-explore-public')}
          sx={{
            borderRadius: '6px',
            px: 1.5, // Increased px
            py: 0.75, // Increased py
            mb: 0.75, // Increased mb
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#555' }}> {/* Increased minWidth */}
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Jobseekers" 
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} // Slightly larger
          />
        </ListItem>

        <ListItem 
          button 
          dense
          onClick={() => navigate('/employer-explore-public')}
          sx={{
            borderRadius: '6px',
            px: 1.5,
            py: 0.75,
            mb: 0.75,
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#555' }}>
            <Business fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Employers" 
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 1.5 }} />

      {/* Real Videos Section */}
      <Typography variant="caption" sx={{ 
        fontWeight: 600,
        color: '#555',
        px: 1,
        mb: 1,
        display: 'block',
        fontSize: '0.75rem'
      }}>
        RESUMES
      </Typography>

      <List dense sx={{ py: 0.5 }}>
        <ListItem 
          button 
          dense
          onClick={() => navigate('/videos/all')}
          sx={{
            borderRadius: '6px',
            px: 1.5,
            py: 0.75,
            mb: 0.75,
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#555' }}>
            <PlayCircleOutline fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="All" 
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
          />
        </ListItem>

        <ListItem 
          button 
          dense
          onClick={() => navigate('/videos/jobseekers')}
          sx={{
            borderRadius: '6px',
            px: 1.5,
            py: 0.75,
            
            mb: 0.75,
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#555' }}>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Jobseekers" 
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
          />
        </ListItem>

        <ListItem 
          button 
          dense
          onClick={() => navigate('/videos/employers')}
          sx={{
            borderRadius: '6px',
            px: 1.5,
            py: 0.75,
            mb: 0.75,
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#555' }}>
            <Business fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Employers" 
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 1.5 }} />

      {/* User Actions */}
      <List dense sx={{ py: 0.5 }}>
        {!role && (
          <ListItem 
            button 
            dense
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: '6px',
              px: 1.5,
              py: 0.75,
              mb: 0.75,
              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
            }}
          >
            <ListItemText 
              primary="Login" 
              primaryTypographyProps={{ 
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#1976d2'
              }}
            />
          </ListItem>
        )}

        {role && (
          <ListItem 
            button 
            dense
            onClick={() => role === 'employer' ? navigate('/employer-dashboard') : navigate('/dashboard-jobseeker')}
            sx={{
              borderRadius: '6px',
              px: 1.5,
              py: 0.75,
              mb: 0.75,
              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#555' }}>
              <Dashboard fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Dashboard" 
              primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
            />
          </ListItem>
        )}

        <ListItem 
          button 
          dense
          onClick={() => navigate('/video-upload')}
          sx={{
            borderRadius: '6px',
            px: 1.5,
            py: 0.75,
            mb: 0.75,
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#555' }}>
            <VideoCameraFront fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Upload Video" 
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
          />
        </ListItem>

        <ListItem 
          button 
          dense
          onClick={() => navigate('/')}
          sx={{
            borderRadius: '6px',
            px: 1.5,
            py: 0.75,
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#555' }}>
            <Home fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Home" 
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default NavigationPanel;