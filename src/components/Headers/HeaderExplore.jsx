import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  Box,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Typography
} from "@mui/material";
import {
  LightMode,
  DarkMode,
  Upload,
  Search
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { role } = useAuth();

  return (
    <Box sx={{
      width: '100%',
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      py: 1,
      px: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            cursor: 'pointer' 
          }}
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
          <Typography variant="h6" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SwipeScout
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={() => navigate(role === 'employer' ? '/post-job' : '/video-upload')}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
            }}
          >
            {role === 'employer' ? 'Post a Job' : 'Upload Video'}
          </Button>
        )}
        
        <IconButton>
          {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;