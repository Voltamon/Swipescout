// NavigationPanel.jsx
import { Box, Typography } from "@mui/material";
import { Home} from '@mui/icons-material';


const NavigationPanel = ({ navigate, user }) => {


  return (
  <Box
  sx={{
    zIndex: 1, 
    width: { xs: '100%', sm: '250px' }, // Full width on mobile, fixed width on larger
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: { xs: '8px 12px', sm: '12px 16px' },
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: { xs: 'center', sm: 'flex-start' },
    textAlign: { xs: 'center', sm: 'left' },
  }}
>

    <Typography
    sx={{
      fontSize: "1.25rem",
      fontWeight: 700,
      color: "rgb(9, 67, 143)",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      fontFamily: "'Montserrat', sans-serif",
      position: "relative",
      display: "inline-block",
      pb: 1,
      textRendering: "optimizeLegibility",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      fontSmooth: "always", // Non-standard but can help
      '&:after': {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "2px",
        background: "linear-gradient(90deg, rgba(9,67,143,0.8) 0%, rgba(255,255,255,0) 80%)",
        borderRadius: "2px"
      }
    }}
  >
    SwipeScout
  </Typography>
  
      <Typography sx={{
        fontWeight: 'bold',pt:1,
        color: 'rgb(46, 111, 155)',
        mb: 1,
        fontFamily: 'Arial, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Sample Videos
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' } }}>
          <Box sx={{ width: '4px', height: '24px', backgroundColor: 'primary.main', mr: 1, borderRadius: '2px' }} />
          <Typography variant="subtitle2" sx={{ cursor: 'pointer', py: '4px', px: 1, flexGrow: 1 }}
            onClick={() => navigate('/job-seeker-explore-public')}>
            Jobseekers
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' } }}>
          <Box sx={{ width: '4px', height: '24px', backgroundColor: 'primary.main', mr: 1, borderRadius: '2px' }} />
          <Typography variant="subtitle2" sx={{ cursor: 'pointer', py: '4px', px: 1, flexGrow: 1 }}
            onClick={() => navigate('/employer-explore-public')}>
            Employers
          </Typography>
        </Box>
      </Box>

      <Typography sx={{
        fontWeight: 'bold',
        color: 'rgb(39, 111, 121)',
        mt: 1,
        fontFamily: 'Arial, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Real Videos submitted
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' } }}>
          <Box sx={{ width: '4px', height: '24px', backgroundColor: 'primary.main', mr: 1, borderRadius: '2px' }} />
          <Typography variant="subtitle2" sx={{ cursor: 'pointer', py: '4px', px: 1, flexGrow: 1 }}
            onClick={() => navigate('/videos/all')}>
            All Videos
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' } }}>
          <Box sx={{ width: '4px', height: '24px', backgroundColor: 'primary.main', mr: 1, borderRadius: '2px' }} />
          <Typography variant="subtitle2" sx={{ cursor: 'pointer', py: '4px', px: 1, flexGrow: 1 }}
            onClick={() => navigate('/videos/jobseekers')}>
            Jobseekers
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' } }}>
          <Box sx={{ width: '4px', height: '24px', backgroundColor: 'primary.main', mr: 1, borderRadius: '2px' }} />
          <Typography variant="subtitle2" sx={{ cursor: 'pointer', py: '4px', px: 1, flexGrow: 1 }}
            onClick={() => navigate('/videos/employers')}>
            Employers
          </Typography>
        </Box>
        {!user && (
          <Typography variant="subtitle2" sx={{ color: "black", cursor: 'pointer', py: '4px', px: 1, flexGrow: 1 }}
            onClick={() => navigate('/login')}>
            Login
          </Typography>
        )}
        {user && (
          <Typography variant="subtitle2" sx={{ fontWeight:"bold",fontSize: "1rem" ,color: " rgb(53, 95, 134)", ml:-.5 , py: '4px', px: 1, flexGrow: 1 }}>
            Hi {user.display_name}
          </Typography>
        )}

        <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 'bold',
          color: 'rgb(46, 111, 155)',
          fontFamily: 'Arial, sans-serif',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <Home />
        <Typography variant="body1" sx={{ fontWeight: 'inherit', color: 'inherit' }}>
          Home
        </Typography>
      </Box>
      </Box>
    </Box>
  );
};

export default NavigationPanel;