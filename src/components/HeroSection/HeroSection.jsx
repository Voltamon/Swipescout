import React from "react";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import phoneImage from "../../assets/phone.png";


const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: { xs: 'column', md: 'row' },
        pt: { xs: 8, md: 10 },
        px: { xs: 4, md: 6 },
        pb: { xs: 4, md: 0 },
        background: 'linear-gradient(to right, #1a032a, #003366)',
        color: '#5D9BCF',
        minHeight: { xs: 'auto', md: '50vh' },
        textAlign: { xs: 'center', md: 'left' }
      }}
    >
      {/* Text Content */}
      <Box
        sx={{
          maxWidth: { xs: '100%', md: '50%' },
          mb: { xs: 4, md: 0 },
          pr: { xs: 0, md: 4 }
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h3"}
          align="center"
          component="h2"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: 'inherit'
          }}
        >
          Swipe Scout
        </Typography>
        
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h2"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            color: '#5D9BCF'
          }}
        >
          Introducing Smart Video Recruitment
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            mb: 4,
            lineHeight: 1.6
          }}
        >
          SwipeScout replaces boring resumes with 15–45 second video pitches
          that let job seekers show off their personality, skills, and
          confidence. Employers swipe through talent fast, make smarter
          decisions, and connect instantly—all in a format today's generation
          actually enjoys.
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: 2,
            mt: 3
          }}
        >
          {/* <Button
            variant="contained"
            sx={{
              bgcolor: '#5D9BCF',
              color: 'white',
              px: 3,
              py: 1.5,
              borderRadius: '6px',
              '&:hover': {
                bgcolor: '#4a8abf'
              }
            }}
          >
            Primary Action
          </Button>
          
          <Button
            variant="outlined"
            sx={{
              border: '2px solid #5D9BCF',
              color: '#5D9BCF',
              px: 2.5,
              py: 1.25,
              borderRadius: '6px',
              '&:hover': {
                bgcolor: 'rgba(93, 155, 207, 0.1)',
                border: '2px solid #5D9BCF'
              }
            }}
          >
            Secondary Action
          </Button> */}
        </Box>
      </Box>
      
      {/* Image */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: { xs: '100%', md: 'auto' },
          mt: { xs: 4, md: 0 }
        }}
      >
        <Box
          component="img"
          src={phoneImage}
          alt="App Preview"
          sx={{
            maxWidth: { xs: '250px', md: '300px' },
            height: 'auto'
          }}
        />
      </Box>
    </Box>
  );
};

export default HeroSection;