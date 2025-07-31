import React from "react";
import Header from "../../components/Headers/Header";
import HeroSection from "../../components/HeroSection/HeroSection";
import { Helmet } from "react-helmet";
import Footer from "../../components/Headers/Footer";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Groups,
  Diversity3,
  EmojiObjects,
  Handshake,
  LocationOn,
  Email,
  Phone
} from "@mui/icons-material";

const AboutUs = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const teamMembers = [
    {
      name: "Raj Singah",
      role: "Business Managment Insights",
      bio: "+ Python experience ",
      avatar: "/images/raj_sin.jpg"
    },
    {
      name: "Varshal Dubey",
      role: "Operations & Strategy",
      bio: "Markiting & generalist ",
      avatar: "/images/varsha_dub.jpg"
    },
    {
      name: "Tareq Alsharif",
      role: "Founder & CEO",
      bio: "Vision Product & Growth",
      avatar: "/images/tareq.jpg"
    },
    {
      name: "Obaid Nieroukh",
      role: "Co-founder & CTO",
      bio: "20+ yrs dev & Systems Architect",
      avatar: "/images/obaid.jpg"
    },
    {
      name: "Bahri Ayzabar",
      role: "UI/UX Designer",
      bio: "Full Stack Dev. & interface lead",
      avatar: "/images/bahr_ayzaba.jpg"
    }
  ];

  const stats = [
    { value: "+", label: "Jobs Posted", icon: <Groups fontSize="large" /> },
    {
      value: "+",
      label: "Candidates Hired",
      icon: <Diversity3 fontSize="large" />
    },
    {
      value: "+",
      label: "Partner Companies",
      icon: <Handshake fontSize="large" />
    },
    {
      value: "95%",
      label: "Satisfaction Rate",
      icon: <EmojiObjects fontSize="large" />
    }
  ];

  return (
 <>
  <Helmet>
    <title>About SwipeScout | Our Mission and Team</title>
    <meta name="description" content="Learn about SwipeScout's mission to revolutionize recruitment with video resumes and our dedicated team of professionals." />
    <meta name="keywords" content="about SwipeScout, company mission, recruitment technology, hiring platform team" />
    <meta property="og:title" content="About SwipeScout | Our Mission and Team" />
    <meta property="og:description" content="Discover how SwipeScout is changing the way people find jobs and companies find talent through innovative technology." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.swipescout.xyz/about" />
    <link rel="canonical" href="https://www.swipescout.xyz/about" />
  </Helmet>


  <Box
    sx={{
      background: "linear-gradient(135deg, rgb(185, 229, 255) 0%, rgb(162, 194, 241) 100%)", // New bright background
      color: "#212121", // Very dark gray for general text for strong contrast
      pt: 0,
      pb: 8
    }}
  >
      <Header />
      <Container maxWidth="lg" sx={{ mt:3}}>
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: "#0D47A1" }}> {/* Darker, strong blue */}
            About SwipeScout
          </Typography>
          <Typography variant="h5" component="h2" sx={{ color: "#1565C0" }} gutterBottom> {/* Slightly lighter dark blue */}
            Revolutionizing the way people find jobs and companies find talent
          </Typography>
          <Typography variant="body1" maxWidth="md" mx="auto" sx={{ color: "#424242" }}> {/* Dark gray for body text */}
            Founded in 2025, SwipeScout combines the efficiency of modern technology with the human touch needed in recruitment. Our platform bridges the gap between talented professionals and innovative companies through intuitive video profiles and smart matching algorithms.
          </Typography>
        </Box>

        <Divider sx={{ my: 6, bgcolor: "#0D47A1" }} /> {/* Darker, strong blue for divider */}

        {/* Mission Section */}
        <Grid container spacing={6} alignItems="center" mb={8}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ color: "#0D47A1" }}> {/* Darker, strong blue */}
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "#424242" }}> {/* Dark gray for body text */}
              To make job searching as engaging and effective as social networking, while giving employers better tools to discover authentic talent.
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "#424242" }}> {/* Dark gray for body text */}
              We believe the traditional resume is outdated. Video profiles allow candidates to showcase their personality, communication skills, and passion in ways paper never could.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box   sx={{ width: "100%", borderRadius: 1, boxShadow: 3 }} />
          </Grid>
        </Grid>

     {/* Stats Section */}
<Box sx={{
  bgcolor: "#BBDEFB", // Lighter blue for stats section background
  p: 4,
  borderRadius: 2,
  mb: 8,
  width: '100%' // Ensure container takes full width
}}>
  <Grid container spacing={4} justifyContent="space-between">
    {stats.map((stat, index) => (
      <Grid item xs={12} sm={6} md={3} key={index} sx={{
        display: 'flex',
        flex: 1, // Make items grow equally
        minWidth: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(25% - 32px)' } // Account for spacing
      }}>
        <Card sx={{
          flex: 1, // Take all available space
          display: 'flex',
          flexDirection: 'column',
          textAlign: "center",
          boxShadow: "none",
          bgcolor: "#E3F2FD", // Very light blue for card background
          color: "#212121", // Very dark gray for card text
          height: '100%' // Ensure full height
        }}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ color: "#0D47A1", mb: 2 }}> {/* Darker, strong blue for icons */}
              {stat.icon}
            </Box>
            <Typography variant="h4" component="div" gutterBottom>
              {stat.value}
            </Typography>
            <Typography variant="body2" sx={{ mt: 'auto' }}>
              {stat.label}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>

        {/* Team Section */}
 <Box mb={8} sx={{ width: '100%', px: { xs: 2, sm: 3 } }}>
  <Typography variant="h4" align="center" gutterBottom sx={{ color: "#0D47A1", mb: 3 }}> {/* Darker, strong blue */}
    Meet Our Team
  </Typography>
  <Typography variant="body1" align="center" maxWidth="md" mx="auto" mb={6} sx={{ color: "#424242" }}> {/* Dark gray for body text */}
    Passionate professionals dedicated to transforming the recruitment experience
  </Typography>

  <Grid container spacing={4} justifyContent="center" sx={{ margin: '0 auto', maxWidth: '1200px' }}>
    {teamMembers.map((member, index) => (
      <Grid
        item
        xs={12}
        sm={6}
        md={3}
        key={index}
        sx={{
          display: 'flex',
          width: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(25% - 32px)' }, // Fixed width calculation
          minWidth: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(25% - 32px)' } // Ensures no growing beyond allocated space
        }}
      >
        <Card
          sx={{
            width: '100%', // Takes full width of Grid item
            display: "flex",
            flexDirection: "column",
            bgcolor: "rgb(178, 225, 245)", // Light blue-gray for card background
            color: "#212121", // Very dark gray for card text
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }
          }}
        >
          <Box
            sx={{
              pt: 4,
              display: "flex",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Avatar
              alt={member.name}
              src={member.avatar}
              sx={{
                width: 120,
                height: 120,
                border: '3px solid white',
                boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
              }}
            />
          </Box>
          <CardContent
            sx={{
              flex: '1 0 auto', // Allows content to grow but not shrink
              display: 'flex',
              flexDirection: 'column',
              textAlign: "center",
              px: 3,
              pb: 3
            }}
          >
            <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
              {member.name}
            </Typography>
            <Typography variant="subtitle2" color="#1976D2" sx={{ fontWeight: 500, mb: 2 }}> {/* Medium dark blue for role */}
              {member.role}
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {member.bio}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>
        {/* Contact Section */}
        <Box sx={{ bgcolor: "#90CAF9", p: 4, borderRadius: 2 }}> {/* Medium light blue for contact section background */}
          <Typography variant="h4" align="center" gutterBottom sx={{ color: "#0D47A1" }}> {/* Darker, strong blue */}
            Get In Touch
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn sx={{ color: "#0D47A1", mr: 2 }} /> {/* Darker, strong blue */}
                <Typography sx={{ color: "#424242" }}>Doha Qatar</Typography> {/* Dark gray */}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <Email sx={{ color: "#0D47A1", mr: 2 }} /> {/* Darker, strong blue */}
                <Typography sx={{ color: "#424242" }}> {/* Dark gray */}
                  info@swipescout.xyz
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </Box>;
    </>
  );
};

export default AboutUs;