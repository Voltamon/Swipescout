import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { VideoCall, People, TrendingUp } from '@mui/icons-material';
import Header from '../components/Headers/Header'; // Updated import path
import Footer from '../components/Headers/Footer'; // Updated import path
import { Helmet } from 'react-helmet'; // For SEO purposes

const HowItWorksPage = () => {
  return (
    <>
      <Helmet>
        <title>How SwipeScout Works</title>
        <meta name="description" content="Learn how SwipeScout revolutionizes recruitment with video profiles." />
      </Helmet>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Container maxWidth="lg" sx={{ flexGrow: 1, py: 8 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              color: '#1f2937',
            }}
          >
            How SwipeScout Works
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                icon: <VideoCall sx={{ fontSize: 40, color: "#3b82f6" }} />,
                title: "1. Create Your Video Profile",
                description:
                  "Job seekers record a short video resume. Employers create video job postings or company profiles.",
                bgColor: "rgba(59, 130, 246, 0.1)",
              },
              {
                icon: <People sx={{ fontSize: 40, color: "#06b6d4" }} />,
                title: "2. Discover & Connect",
                description:
                  "Swipe through video profiles or use our smart matching to find perfect candidates or opportunities.",
                bgColor: "rgba(6, 182, 212, 0.1)",
              },
              {
                icon: <TrendingUp sx={{ fontSize: 40, color: "#67e8f9" }} />,
                title: "3. Grow Your Career",
                description:
                  "Build meaningful connections that lead to interviews, hires, and career growth.",
                bgColor: "rgba(103, 232, 249, 0.1)",
              },
            ].map((step, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4} // This ensures 3 equal columns on medium and larger screens
                key={index}
                sx={{ display: 'flex' }} // Added flex display to ensure cards within the grid item take full height
              >
                <Card sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 'none',
                  width: '100%', // Ensure the card takes the full width of its grid item
                  flex: 1 // Added flex: 1 to ensure the card grows to fill available space within its flex parent
                }}>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      p: 3,
                      minWidth: '100%', // Ensure the content area itself takes full width
                      boxSizing: 'border-box', // Include padding in width calculation
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 80,
                        height: 80,
                        bgcolor: step.bgColor,
                        borderRadius: "50%",
                        mb: 3,
                        mx: "auto",
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        textAlign: "center",
                        color: "#1f2937",
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#4b5563",
                          textAlign: "center",
                          width: {xs:'300px' ,md:'800px'},
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Footer />
      </Box>
    </>
  );
};

export default HowItWorksPage;
