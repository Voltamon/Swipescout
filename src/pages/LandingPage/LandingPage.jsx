
import React from "react";
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  useMediaQuery,
  Card,
  CardContent,
  styled
} from "@mui/material";
import Header3 from "../../components/Header3/Header3";
import HeroSection from "../../components/HeroSection/HeroSection";
import Feature from "../../components/Feature/Feature";
import phoneImage from "../../assets/phone.png";
import { LuArrowLeftRight } from "react-icons/lu";
import { Helmet } from "react-helmet";

import FAQAccordion from "../../components/FAQAccordion/FAQAccordion";
import Footer2 from "../../components/Footer2/Footer2";

const StyledFeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '300PX',
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: 'rgb(216, 230, 242)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(93, 155, 207, 0.15)',
  transition: 'all 0.3s ease-in-out',
  minHeight: '320px', // Ensures consistent height
  
  // Hover effects
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 28px rgba(93, 155, 207, 0.25)',
    backgroundColor: 'rgba(216, 230, 242, 0.95)'
  },

  // Card content styling
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
    flexGrow: 1, // Makes content fill available space
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  },

  // Icon styling with hover effect
  '& .feature-icon': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    width: 48,
    height: 48,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'rotate(15deg) scale(1.1)'
    }
  }
}));

const LandingPage = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const isLargeScreen = useMediaQuery('(min-width:1200px)');

  const faqs = [
    {
      question: "How long until we deliver your first blog post?",
      answer: "Really boy law country she unable her sister. Feet you off its like like sea..."
    },
    {
      question: "What are the benefits of using Swipe Scout?",
      answer: "Swipe Scout helps you find opportunities faster with AI-powered recommendations..."
    },
    {
      question: "Is Swipe Scout available on mobile?",
      answer: "Yes! Our app is available for both Android and iOS devices..."
    }
  ];

  return (<>
  <Helmet>  
        <title>SwipeScout | Modern Job Matching Platform with Video Resumes</title>
        <meta name="description" content="SwipeScout revolutionizes job searching with video resumes and swipe-based matching. Connect with employers or candidates in a modern, engaging way." />
        <meta name="keywords" content="job search, video resumes, recruitment, hiring platform, career matching" />
        <meta property="og:title" content="SwipeScout | Modern Job Matching Platform" />
        <meta property="og:description" content="Find your dream job or perfect candidate with SwipeScout's innovative video resume and swipe matching system." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.swipescout.xyz" />
        <link rel="canonical" href="https://www.swipescout.xyz" />
      </Helmet>
    <Box sx={{ 
      background: "linear-gradient(to right, #1a032a, #003366)",
      minHeight: "100vh",
      color: "#5D9BCF",
      overflowX: "hidden"
    }}> 
      <Header3 />
      <HeroSection />
      
      {/* Unique Features Section */}
      <Container maxWidth="xl" sx={{ 
        py: 8,
        px: { xs: 3, sm: 4, md: 6 } // Increased padding on mobile
      }}>
        <Typography variant="h3" component="h2" sx={{ 
          textAlign: "center", 
          mb: 4,
          fontWeight: 700,
          color: "#5D9BCF",
          px: { xs: 2, sm: 0 } // Added horizontal padding on mobile
        }}>
          What Makes Swipe Scout Unique?
        </Typography>
        
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {1 && (
            <Grid item md={5} lg={4}>
              <Box sx={{
                display: "flex",
                justifyContent: "center",
                px: { xs: 2, sm: 0 }, // Added padding
                "& img": {
                  width: "100%",
                  maxWidth: 350,
                  transform: "rotate(-10deg)",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "rotate(-5deg) scale(1.05)"
                  }
                }
              }}>
                <img 
                  src={phoneImage} 
                  alt="SwipeScout app interface" 
                  loading="lazy"
                />
              </Box>
            </Grid>
          )}
    <Grid item xs={12} md={7} lg={6}>
  <Box sx={{ 
    display: "flex", 
    flexDirection: "column", 
    gap: 4,
    maxWidth: 600,
    mx: "auto",
    px: { xs: 2, sm: 0 }
  }}>
    <Box sx={{
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        '& .feature-title': {
          color: '#4299E1' // Slightly brighter blue on hover
        },
        '& .feature-description': {
          opacity: 0.95
        }
      }
    }}>
      <Feature
        title="Video Resumes"
        description="🔔 Showcase Personality in Seconds
        SwipeScout lets job seekers express themselves with short 15–45 second video pitches—making it easier for companies to connect with confident, creative talent."
        titleColor="#5D9BCF"
        textColor="#E1E8F2"
        className="feature-item" // Added for targeting
      />
    </Box>
    
    <Box sx={{
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        '& .feature-title': {
          color: '#4299E1'
        },
        '& .feature-description': {
          opacity: 0.95
        }
      },
      ...(isLargeScreen ? { ml: 7.5 } : {})
    }}>
      <Feature
        title="Swipe Feature"
        description="🔔 Fast, Fun, and Intentional Matching
        Swipe through jobs or candidates just like you would on social apps. Tap in for full profiles, then connect if there's mutual interest—no ghosting, no clutter."
        titleColor="#5D9BCF"
        textColor="#E1E8F2"
        className="feature-item"
      />
    </Box>
  </Box>
</Grid>
        </Grid>
      </Container>
      
      {/* Key Features Section */}
      <Box sx={{ 
        background: "#ffffff", 
        py: 8,
        px: { xs: 3, sm: 4 } // Increased padding on mobile
      }}>
        <Container maxWidth="xl">
          <Typography variant="h4" component="h2" sx={{
            textAlign: "center",
            mb: 6,
            color: "#003366",
            fontWeight: 700,
            px: { xs: 2, sm: 0 } // Added padding
          }}>
            Key Features
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                title: "Video Resumes",
                subtitle: "🔔 Unlock Real Talent",
                description: "SwipeScout lets job seekers upload 15–45 second video resumes, giving employers a real glimpse of their personality, communication, and creativity—far beyond what paper resumes can offer."
              },
              {
                title: "Swipe to Discover",
                subtitle: "🔔 Smarter Matching",
                description: "Our intuitive swipe interface allows job seekers and employers to discover each other quickly, creating matches based on real impressions, not just text."
              },
              {
                title: "Real-Time Connections",
                subtitle: "🔔 Chat and Connect",
                description: "Once there's a match, messaging opens up—making it easy to schedule interviews, ask questions, and take the next step, all in-app."
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StyledFeatureCard>
                  <CardContent>
                    <Box className="feature-icon">
                      <LuArrowLeftRight size={24} />
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      color: "#2D3748" // Darker color for better contrast
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ 
                      color: "#5D9BCF",
                      mb: 2
                    }}>
                      {feature.subtitle}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: "#4A5568" // Slightly darker for readability
                    }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </StyledFeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      
      <Footer2 />
    </Box>
    </>);
};

export default LandingPage;