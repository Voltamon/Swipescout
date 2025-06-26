import React from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    Avatar,
    Divider,
    useMediaQuery,
    styled
} from "@mui/material";
import {
    PlayCircle,
    Work,
    People,
    VideoCall,
    TrendingUp,
    CheckCircle
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Header from "../components/Tmp/Header";
import Footer from "../components/Tmp/Footer";
import { Helmet } from "react-helmet";

// Sample video thumbnails (replace with your actual images)
// import videoResumeThumb from "../assets/video-resume-thumb.jpg";
// import jobPostingThumb from "../assets/job-posting-thumb.jpg";
// import companyProfileThumb from "../assets/company-profile-thumb.jpg";

const StyledFeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[10],
  },
}));

const StyledVideoCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: theme.shadows[3],
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: theme.shadows[6],
    },
    '& .play-overlay': {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.3)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        '&:hover': {
            opacity: 1,
        }
    }
}));

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Marketing Director",
        quote: "Found our perfect candidate in just 3 days using video resumes!",
        avatar: "/images/testimonials/sarah.jpg"
    },
    {
        name: "Michael Chen",
        role: "Software Engineer",
        quote: "Landed my dream job by showcasing my skills through video.",
        avatar: "/images/testimonials/michael.jpg"
    },
    {
        name: "TechStart Inc.",
        role: "HR Manager",
        quote: "Our hiring process is now 40% faster with SwipeScout.",
        avatar: "/images/testimonials/techstart.jpg"
    }
];

const HomePage = () => {
    const isMobile = useMediaQuery('(max-width:900px)');

    return (
        <>
            <Helmet>
                <title>SwipeScout | Modern Video Recruitment Platform</title>
                <meta name="description" content="Connect with opportunities through video. SwipeScout revolutionizes recruitment with video resumes, job postings, and company profiles." />
                <meta name="keywords" content="video resumes, video recruitment, job search, hiring platform, career matching" />
                <meta property="og:title" content="SwipeScout | Modern Video Recruitment Platform" />
                <meta property="og:description" content="Find your dream job or perfect candidate through engaging video profiles on SwipeScout." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.swipescout.xyz" />
                <link rel="canonical" href="https://www.swipescout.xyz" />
            </Helmet>

            <Box sx={{
                background: "linear-gradient(to bottom, #ffffff 0%, #f5f9ff 100%)",
                color: "#333",
                overflowX: "hidden"
            }}>
                <Header />

                {/* Hero Section */}
                <Box sx={{
                    background: "linear-gradient(135deg,rgb(185, 229, 255) 0%,rgb(162, 194, 241) 100%)",
                    color: "white",
                    py: 10,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url(/backgrounds/hero-pattern.svg) center/cover no-repeat',
                        opacity: 0.1
                    }
                }}>
                    <Container maxWidth="lg" >
                        <Grid container spacing={6} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Typography variant="h2" component="h1" sx={{
                                    fontWeight: 800,
                                    mb: 3,
                                    lineHeight: 1.2
                                }}>
                                    Revolutionizing Recruitment with Video
                                </Typography>
                                <Typography variant="h5" component="h2" sx={{
                                    mb: 4,
                                    fontWeight: 400,
                                    opacity: 0.9
                                }}>
                                    Connect with opportunities through authentic video profiles. Whether you're hiring or looking for your next role, SwipeScout makes it personal.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        component={Link}
                                        to="/register-form"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            bgcolor: 'white',
                                            color: '#6e8efb',
                                            fontWeight: 600,
                                            px: 4,
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.9)'
                                            }
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/videos/all"
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderColor: 'white',
                                            color: 'rgb(23, 92, 182)',
                                            fontWeight: 600,
                                            px: 4,
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.1)'
                                            }
                                        }}
                                    >
                                        Explore Videos
                                    </Button>
                                </Box>
                            </Grid>
                            {!isMobile && (
                                <Grid item xs={12} md={6}>
                                    <Box sx={{
                                        position: 'relative',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                        transform: 'perspective(1000px) rotateY(-10deg)',
                                        '&:hover': {
                                            transform: 'perspective(1000px) rotateY(-5deg)'
                                        },
                                        transition: 'transform 0.5s ease'
                                    }}>
                                        <video
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            style={{ width: '100%', display: 'block' }}
                                        >
                                            <source src="/videos/hero-demo.mp4" type="video/mp4" />
                                        </video>
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            p: 3,
                                            background: 'linear-gradient(to top, rgba(185, 229, 255, 0.8), transparent)',
                                            color: 'white'
                                        }}><a href="#Howitworks">
                                            <Typography variant="h6" sx={{ color: "rgb(22, 73, 114)", cursor: "pointer" }}>See how it works →</Typography>
                                        </a>
                                        </Box>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Container>
                </Box>

                {/* How It Works Section */}
             <Box sx={{ py: 8 }}>
  <Container maxWidth="lg">
    <Typography variant="h3" component="h2" sx={{
      textAlign: "center",
      mb: 6,
      fontWeight: 700,
      color: "#333"
    }} id="Howitworks">
      How SwipeScout Works
    </Typography>

    <Grid container spacing={4} justifyContent="center">
      {[
        {
          icon: <VideoCall color="primary" sx={{ fontSize: 40 }} />,
          title: "1. Create Your Video Profile",
          description: "Job seekers record a short video resume. Employers create video job postings or company profiles.",
          bgColor: 'rgba(110, 142, 251, 0.1)'
        },
        {
          icon: <People color="secondary" sx={{ fontSize: 40 }} />,
          title: "2. Discover & Connect",
          description: "Swipe through video profiles or use our smart matching to find perfect candidates or opportunities.",
          bgColor: 'rgba(167, 119, 227, 0.1)'
        },
        {
          icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
          title: "3. Grow Your Career",
          description: "Build meaningful connections that lead to interviews, hires, and career growth.",
          bgColor: 'rgba(103, 214, 168, 0.1)'
        }
      ].map((step, index) => (
        <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
          <StyledFeatureCard sx={{ 
            width: '100%', // Ensure card takes full width of grid item
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              p: 3 // Consistent padding
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                bgcolor: step.bgColor,
                borderRadius: '50%',
                mb: 3,
                mx: 'auto' // Center the icon box
              }}>
                {step.icon}
              </Box>
              <Typography variant="h5" component="h3" sx={{ 
                mb: 2, 
                fontWeight: 600,
                textAlign: 'center' // Center align title
              }}>
                {step.title}
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" sx={{ 
                  color: '#666',
                  textAlign: 'center' // Center align description
                }}>
                  {step.description}
                </Typography>
              </Box>
            </CardContent>
          </StyledFeatureCard>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>

                {/* Video Showcase Section */}
                <Box sx={{ py: 8, bgcolor: '#f8faff' }}>
                    <Container maxWidth="lg">
                        <Typography variant="h3" component="h2" sx={{
                            textAlign: "center",
                            mb: 6,
                            fontWeight: 700,
                            color: "#333"
                        }}>
                            See SwipeScout in Action
                        </Typography>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <StyledVideoCard>
                                    <CardMedia
                                        component="img"
                                        height="240"

                                        alt="Video Resume Example"
                                    />
                                    <Box className="play-overlay">
                                        <PlayCircle sx={{ fontSize: 60, color: 'white' }} />
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                                            Video Resumes
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Showcase your personality and skills beyond paper resumes
                                        </Typography>
                                    </CardContent>
                                </StyledVideoCard>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <StyledVideoCard>
                                    <CardMedia
                                        component="img"
                                        height="240"

                                        alt="Video Job Posting Example"
                                    />
                                    <Box className="play-overlay">
                                        <PlayCircle sx={{ fontSize: 60, color: 'white' }} />
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                                            Video Job Postings
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Employers showcase roles and company culture effectively
                                        </Typography>
                                    </CardContent>
                                </StyledVideoCard>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <StyledVideoCard>
                                    <CardMedia
                                        component="img"
                                        height="240"

                                        alt="Company Profile Example"
                                    />
                                    <Box className="play-overlay">
                                        <PlayCircle sx={{ fontSize: 60, color: 'white' }} />
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                                            Company Profiles
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Get to know companies through authentic video stories
                                        </Typography>
                                    </CardContent>
                                </StyledVideoCard>
                            </Grid>
                        </Grid>

                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Button
                                component={Link}
                                to="/videos/all"
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: '#6e8efb',
                                    color: 'white',
                                    fontWeight: 600,
                                    px: 6,
                                    py: 1.5,
                                    '&:hover': {
                                        bgcolor: '#5a7ae0'
                                    }
                                }}
                            >
                                Browse All Videos
                            </Button>
                        </Box>
                    </Container>
                </Box>

                {/* Testimonials Section */}
                <Box sx={{ py: 8 }}>
                    <Container maxWidth="lg">
                        <Typography variant="h3" component="h2" sx={{
                            textAlign: "center",
                            mb: 6,
                            fontWeight: 700,
                            color: "#333"
                        }}>
                            What Our Users Say
                        </Typography>

                        <Grid container spacing={4}>
                            {testimonials.map((testimonial, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Card sx={{ height: '100%', p: 3, boxShadow: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Avatar
                                                src={testimonial.avatar}
                                                sx={{ width: 60, height: 60, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography variant="h6" component="h3">
                                                    {testimonial.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {testimonial.role}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                            "{testimonial.quote}"
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <CheckCircle key={star} color="primary" sx={{ fontSize: 16, mr: 0.5 }} />
                                            ))}
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* CTA Section */}
                <Box sx={{
                    py: 10,
                      backgroundImage: `linear-gradient(
    to bottom,
        rgba(53, 187, 221, 0.78) 0%,
      rgba(116, 215, 245, 0.8) 40%,
    rgba(26, 58, 110, 0.9)
  )`,
                    backgroundBlendMode: 'overlay',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    color: 'white',
                    textAlign: 'center',
                }}
                >
                    <Container maxWidth="md">
                        <Typography variant="h3" component="h2" sx={{
                            mb: 0,
                            fontWeight: 700 ,color:"rgb(57, 54, 122)"
                        }}>
                            Ready to Transform Your Recruitment?
                        </Typography>
                        <Typography variant="h5" component="p" sx={{
                            mb: 1,
                            fontWeight: 400,
                            opacity: 0.9 ,color:"rgb(47, 51, 65)"
                        }}>
                            Join thousands of professionals and companies finding better matches through video.
                        </Typography>
                        <Button
                            component={Link}
                            to="/register-form"
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: 'white',
                                color: 'rgb(39, 128, 201)',
                                fontWeight: 600,
                                px: 6,
                                py: 1.5,
                                fontSize: '1.1rem',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.9)'
                                }
                            }}
                        >
                            Get Started Free
                        </Button>
                    </Container>
                </Box>

                <Footer sx={{
                    py: 10,
                     
                    backgroundBlendMode: 'overlay',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    color: 'white',
                    textAlign: 'center',
                }} />
            </Box>
        </>
    );
};

export default HomePage