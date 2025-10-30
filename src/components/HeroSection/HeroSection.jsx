import React, { useContext } from "react";
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
            color: '#5D9BCF',
            textAlign: "center",
          }}
        >
          Introducing Smart Video Recruitment
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.1rem' },
            mb: 4,
            lineHeight: 1.6,
            color: '#5D9BCF'
          }}
        >
          SwipeScout replaces boring resumes with 15â€“45 second video pitches
          that let job seekers show off their personality, skills, and
          confidence. Employers swipe through talent fast, make smarter
          decisions, and connect instantlyâ€”all in a format today's generation
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

          
    
        </Box>
      </Box>
      
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