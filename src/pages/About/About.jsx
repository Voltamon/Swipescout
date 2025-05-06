import React from "react";
import Header3 from "../../components/Header3/Header3";
import HeroSection from "../../components/HeroSection/HeroSection";
import { Helmet } from "react-helmet";
import Footer2 from "../../components/Footer2/Footer2";
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
      name: "Alex Chen",
      role: "CEO & Founder",
      bio:
        "10+ years in HR tech. Passionate about connecting talent with opportunity.",
      avatar: "/images/team/alex.jpg"
    },
    {
      name: "Samira Khan",
      role: "CTO",
      bio: "Tech visionary with expertise in AI-driven recruitment solutions.",
      avatar: "/images/team/samira.jpg"
    },
    {
      name: "Jamie Wilson",
      role: "Head of Design",
      bio:
        "Creates intuitive user experiences that make job hunting enjoyable.",
      avatar: "/images/team/jamie.jpg"
    },
    {
      name: "Miguel Rodriguez",
      role: "Growth Manager",
      bio: "Builds partnerships that help SwipeScout reach more candidates.",
      avatar: "/images/team/miguel.jpg"
    }
  ];

  const stats = [
    { value: "10K+", label: "Jobs Posted", icon: <Groups fontSize="large" /> },
    {
      value: "50K+",
      label: "Candidates Hired",
      icon: <Diversity3 fontSize="large" />
    },
    {
      value: "500+",
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


  <Box sx={{ background: "linear-gradient(to right, #1a032a, #003366)", color: "#ffffff", pt: 0, pb: 8 }}>
      <Header3 />
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: "#5D9BCF" }}>
            About SwipeScout
          </Typography>
          <Typography variant="h5" component="h2" sx={{ color: "#5D9BCF" }} gutterBottom>
            Revolutionizing the way people find jobs and companies find talent
          </Typography>
          <Typography variant="body1" maxWidth="md" mx="auto" sx={{ color: "#B0C4DE" }}>
            Founded in 2025, SwipeScout combines the efficiency of modern technology with the human touch needed in recruitment. Our platform bridges the gap between talented professionals and innovative companies through intuitive video profiles and smart matching algorithms.
          </Typography>
        </Box>

        <Divider sx={{ my: 6, bgcolor: "#5D9BCF" }} />

        {/* Mission Section */}
        <Grid container spacing={6} alignItems="center" mb={8}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ color: "#5D9BCF" }}>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "#B0C4DE" }}>
              To make job searching as engaging and effective as social networking, while giving employers better tools to discover authentic talent.
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "#B0C4DE" }}>
              We believe the traditional resume is outdated. Video profiles allow candidates to showcase their personality, communication skills, and passion in ways paper never could.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box component="img" src="/images/about-mission.jpg" alt="Team working together image" sx={{ width: "100%", borderRadius: 2, boxShadow: 3, color: "#B0C4DE" }} />
          </Grid>
        </Grid>

        {/* Stats Section */}
        <Box sx={{ bgcolor: "rgb(75, 117, 151)", p: 4, borderRadius: 2, mb: 8 }}>
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => <Grid item xs={6} sm={3} key={index}>
                <Card sx={{ height: "100%", textAlign: "center", boxShadow: "none", bgcolor: "#92c3eb", color: "#000" }}>
                  <CardContent>
                    <Box sx={{ color: "white", mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" component="div" gutterBottom>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>)}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box mb={8}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: "#5D9BCF" }}>
            Meet Our Team
          </Typography>
          <Typography variant="body1" align="center" maxWidth="md" mx="auto" mb={4} sx={{ color: "#B0C4DE" }}>
            Passionate professionals dedicated to transforming the recruitment experience
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) =>
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "rgb(154, 196, 230)",
                    color: "#000"
                  }}
                >
                  <Box
                    sx={{ pt: 4, display: "flex", justifyContent: "center" }}
                  >
                    <Avatar
                      alt={member.name}
                      src={member.avatar}
                      sx={{ width: 120, height: 120 }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Typography variant="h6" component="div">
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="#003366" mb={2}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Contact Section */}
        <Box sx={{ bgcolor: "#003366", p: 4, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: "#5D9BCF" }}>
            Get In Touch
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn sx={{ color: "#5D9BCF", mr: 2 }} />
                <Typography sx={{ color: "#5D9BCF" }}>Location</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <Email sx={{ color: "#5D9BCF", mr: 2 }} />
                <Typography sx={{ color: "#5D9BCF" }}>
                  info@swipescout.xyz
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer2 />
    </Box>;
    </>
  );
};

export default AboutUs;
