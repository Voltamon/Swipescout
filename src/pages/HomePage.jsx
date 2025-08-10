import React, { useState, useRef, useEffect } from "react"; // Corrected import statement for hooks
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
  styled,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Stack,Paper,
  Fade,
  Zoom,
  Slide,Chip,
  useTheme
} from "@mui/material";
import {
  PlayCircle,
  Work,
  People,
  VideoCall,
  TrendingUp,
  Star,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  LinkedIn as LinkedInIcon,
  CheckCircle,
  Fullscreen,
} from "@mui/icons-material";


import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Headers/Header"; // Updated Header path
import Footer from "../components/Headers/Footer"; // Updated Footer path
import { Helmet } from "react-helmet";
import PlayArrow from "@mui/icons-material/PlayArrow";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
import { useAuth } from "../hooks/useAuth";
import { AlertCircle as AlertCircleIcon } from "lucide-react";
import { bold } from "@cloudinary/url-gen/qualifiers/fontWeight";


const stats = [
    { number: "50K+", label: "Active Users", icon: <People /> },
    { number: "15K+", label: "Successful Hires", icon: <Work /> },
    { number: "2.5M+", label: "Video Views", icon: <PlayCircle /> },
    { number: "95%", label: "Satisfaction Rate", icon: <Star /> }
];

const VideoShowcase = styled(Box)(({ theme }) => ({
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)',
    transform: 'perspective(1000px) rotateY(-8deg) rotateX(5deg)',
    transition: 'all 0.6s ease',
    '&:hover': {
        transform: 'perspective(1000px) rotateY(-4deg) rotateX(2deg) scale(1.05)'
    }
}));

const FloatingCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    zIndex: 2,
    backdropFilter: 'blur(20px)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.15)'
    }
}));


const StatsCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: '16px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%)',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 15px 30px rgba(102, 126, 234, 0.1)'
    }
}));

const LoginFormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.25),
  color: theme.palette.text.primary, // Use theme color
}));
const LoginFormSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary, // Use theme color
  marginBottom: theme.spacing(2.5),
}));
const InputField = styled(TextField)(({ theme }) => ({
  width: "100%",
  margin: theme.spacing(1, 0),
  borderRadius: theme.shape.borderRadius, // Use theme border radius
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.divider, // Use theme color
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main, // Use theme color
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main, // Use theme color
    },
    "&.Mui-error fieldset": {
      borderColor: theme.palette.error.main, // Use theme color
    },
  },
  "& input": {
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper, // Use theme color
    color: theme.palette.text.primary, // Use theme color
  },
}));
const LoginButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main, // Use theme color
  color: theme.palette.primary.contrastText, // Use theme color
  border: "none",
  borderRadius: "25px",
  fontWeight: "bold",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark, // Use theme color
  },
}));
const SocialDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  "& .MuiDivider-wrapper": {
    color: theme.palette.text.secondary, // Use theme color
  },
}));
const SocialButton = styled(Button)(({ theme }) => ({
  flexGrow: 1,
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1.25),
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));
const GoogleSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper, // Use theme color
  color: theme.palette.text.secondary, // Use theme color
  border: `1px solid ${theme.palette.divider}`, // Use theme color
  "&:hover": {
    backgroundColor: theme.palette.action.hover, // Use theme color
    borderColor: theme.palette.grey[400], // Use theme color
  },
}));
const LinkedInSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper, // Use theme color
  color: theme.palette.text.secondary, // Use theme color
  border: `1px solid ${theme.palette.divider}`, // Use theme color
  "&:hover": {
    backgroundColor: theme.palette.action.hover, // Use theme color
    borderColor: theme.palette.grey[400], // Use theme color
  },
}));
const StyledFeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius * 2, // More rounded
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper, // Use theme color
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[10],
  },
}));
const StyledVideoCard = styled(Card)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 1.5, // More rounded
  overflow: "hidden",
  boxShadow: theme.shadows[3],
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: theme.shadows[6],
  },
  "& .play-overlay": {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.7)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    "&:hover": {
      opacity: 1,
    },
  },
}));
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    quote:
      "SwipeScout completely transformed our hiring process. We used to spend weeks sifting through resumes, but with video profiles, we found our perfect candidate in just three days! The authenticity and insight you get from a video are unparalleled. Highly recommend!",
    avatar: "https://placehold.co/60x60/dbeafe/3b82f6?text=SJ", // Placeholder image
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    quote:
      "As a job seeker, SwipeScout gave me the unique opportunity to truly showcase my personality and skills beyond a traditional resume. I landed my dream job by demonstrating my passion and technical abilities through video. It's a game-changer for anyone looking to stand out.",
    avatar: "https://placehold.co/60x60/dbeafe/3b82f6?text=MC", // Placeholder image
    rating: 5,
  },
  {
    name: "TechStart Inc.",
    role: "HR Manager",
    quote:
      "Implementing SwipeScout has made our recruitment incredibly efficient. Our hiring process is now 40% faster, and we're making much better cultural fits. The platform is intuitive, and the support has been fantastic. It's an essential tool for modern HR.",
    avatar: "https://placehold.co/60x60/dbeafe/3b82f6?text=TI", // Placeholder image
    rating: 4,
  },
  {
    name: "Alex Rivera",
    role: "Talent Acquisition Lead",
    quote:
      "SwipeScout helped us cut screening time in half while actually getting to know the person behind the resume. It’s now a core part of our hiring process.",
    avatar: "https://placehold.co/60x60/dbeafe/3b82f6?text=AR", // Placeholder image
    rating: 5, // Assuming a 5-star rating for this new testimonial
  },
];
const StatusBorder = ({ status }) => (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 5,
      backgroundColor:
        status === "uploading"
          ? "#f97316"
          : status === "processing"
          ? "#3b82f6"
          : "transparent",
      zIndex: 3,
    }}
  />
);
export const mockVideoResumes = [
  {
    id: "emp-1",
    video_title: "Corporate Solutions Inc. - Company Overview",
    video_type: "Company Profile",
    video_duration: 90,
    video_url:
      "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935032/Employer/grfwutcixeecejrsqu7o.mp4",
    status: "completed",
  },
  {
    id: "js-1",
    video_title: "Full Stack Developer - Portfolio Showcase",
    video_type: "Job Seeker",
    video_duration: 120,
    video_url:
      "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935204/Jobseeker/wvepwzroiy6s942idqal.mp4",
    status: "completed",
  },
  {
    id: "emp-2",
    video_title: "Designer and developer - Resume Showcase",
    video_type: "Company Profile",
    video_duration: 60,
    video_url:
      "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935196/Jobseeker/h5qg3cfiszmjefiquvrm.mp4",
    status: "completed",
  },
];
const HomePage = () => {
  const theme = useTheme(); // Access theme
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Use theme breakpoint
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isPlayVideo, setIsPlayVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const videoRefs = useRef({});
  const [explicitLogin, setExplicitLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';
  const {
    loginByEmailAndPassword,
    authenticateWithGoogle,
    authenticateWithLinkedIn,
    user,
    role,
    loading: authLoading,
  } = useAuth();
  const [loading, setLoading] = useState({
    email: false,
    google: false,
    linkedin: false,
  });
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (explicitLogin && user && role && !authLoading) {
      const from = location.state?.from?.pathname || getDefaultRoute(role);
      navigate(from);
      setExplicitLogin(false);
    }
  }, [user, role, authLoading, explicitLogin, navigate, location.state]);

  const getDefaultRoute = (userRole) => {
    switch (userRole) {
      case "job_seeker":
        return "/dashboard";
      case "employer":
        return "/employer-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setExplicitLogin(true);
    setLoading((prev) => ({ ...prev, email: true }));
    setError("");
    try {
      const result = await loginByEmailAndPassword(
        formData.email,
        formData.password
      );
      if (result && result.error) {
        setError(result.message || "Login failed. Please try again.");
        setExplicitLogin(false);
        return;
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setExplicitLogin(false);
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading((prev) => ({ ...prev, google: true }));
    setError("");
    setExplicitLogin(true);
    try {
      const result = await authenticateWithGoogle();
      if (result && result.error) {
        setError(result.message || "Google sign-in failed");
        setExplicitLogin(false);
      }
    } catch (err) {
      setError(err.message || "Google sign-in failed");
      setExplicitLogin(false);
    } finally {
      setLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleLinkedInLogin = async () => {
    setLoading((prev) => ({ ...prev, linkedin: true }));
    setError("");
    setExplicitLogin(true);
    try {
      const result = await authenticateWithLinkedIn();
      if (result && result.error) {
        setError(result.message || "LinkedIn login failed");
        setExplicitLogin(false);
      }
    } catch (err) {
      setError(err.message || "LinkedIn login failed");
      setExplicitLogin(false);
    } finally {
      setLoading((prev) => ({ ...prev, linkedin: false }));
    }
  };

  const handleVideoHover = (videoId, isHovering) => {
    setHoveredVideo(isHovering ? videoId : null);
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      if (isHovering) {
        videoElement
          .play()
          .catch((error) => console.error("Error playing video:", error));
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    }
  };

  const toggleMute = (e, videoId) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const handleVideoClick = (videoId) => {
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      if (playingVideoId === videoId) {
        videoElement.pause();
        videoElement.currentTime = 0;
        setPlayingVideoId(null);
      } else {
        if (playingVideoId && videoRefs.current[playingVideoId]) {
          videoRefs.current[playingVideoId].pause();
          videoRefs.current[playingVideoId].currentTime = 0;
        }
        videoElement
          .play()
          .catch((error) => console.error("Error playing video:", error));
        setPlayingVideoId(videoId);
      }
    }
    console.log("Video clicked:", videoId);
  };

  const handleFullscreen = (videoId) => {
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        /* Firefox */
        videoElement.mozRequestFullScreen();
      } else if (videoElement.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        /* IE/Edge */
        videoElement.msRequestFullscreen();
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>SwipeScout | Modern Video Recruitment Platform</title>
        <meta
          name="description"
          content="Connect with opportunities through video. SwipeScout revolutionizes recruitment with video resumes, job postings, and company profiles."
        />
        <meta
          name="keywords"
          content="video resumes, video recruitment, job search, hiring platform, career matching"
        />
        <meta
          property="og:title"
          content="SwipeScout | Modern Video Recruitment Platform"
        />
        <meta
          property="og:description"
          content="Find your dream job or perfect candidate through engaging video profiles on SwipeScout."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.swipescout.xyz" />
        <link rel="canonical" href="https://www.swipescout.xyz" />
      </Helmet>
      <Box
        sx={{
          background: theme.palette.background.default, // Use theme background
          color: theme.palette.text.primary, // Use theme text color
          overflowX: "hidden",
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // Ensure page takes full viewport height
        }}
      >
        <Header />

        {/* Hero Section */}
        <Box
          sx={{
            background: theme.palette.primary.main, // Use primary color for hero background
            color: theme.palette.primary.contrastText, // White text
            py: { xs: 8, md: 12 },
            position: "relative",
            overflow: "hidden",
            // Blurred background image
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${VITE_BASE_URL}/public/backgrounds/meeting_room2.jpg)`, // Placeholder for meeting room image
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(5px)", // Apply blur effect
              opacity: 0.8, // Adjust opacity as needed
              zIndex: 0,
            },
            flexGrow: 1, // Allow hero section to grow and push footer down
            display: 'flex',
            alignItems: 'center', // Center content vertically
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                  <Chip sx={{ backgroundColor: 'rgba(66, 81, 107, 0.2)', color: 'white' , mt:-6,
                                                             backdropFilter: 'blur(10px)',
                                                             border: '1px solid rgba(255, 255, 255, 0.3) '}}
                                                         label="🚀 AI-Powered Recruitment Platform"
                                                        
                                                     />
                                                     <Typography
                                                         variant="h1"
                                                         sx={{
                                                             fontWeight: 800,
                                                             mb: 3,
                                                             fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                                                             lineHeight: 1.1,
                                                             color: 'white',
                                                             textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                                         }}
                                                     >
                                                         The Future of
                                                         <Box component="span" sx={{ 
                                                             background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                                             WebkitBackgroundClip: 'text',
                                                             WebkitTextFillColor: 'transparent',
                                                             display: 'block'
                                                         }}>
                                                             Video Recruitment
                                                         </Box>
                                                     </Typography>
                                                     <Typography
                                                         variant="h5"
                                                         sx={{
                                                             mb: 4,
                                                             color: 'rgba(255, 255, 255, 0.9)',
                                                             fontWeight: 400,
                                                             maxWidth: '600px'
                                                         }}
                                                     >
                                                         Connect talent with opportunities through AI-powered video matching. 
                                                         Experience recruitment that's personal, efficient, and revolutionary.
                                                     </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Button
                    component={Link}
                    to="/register-form"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: theme.palette.secondary.main, // Use secondary color
                      color: theme.palette.secondary.contrastText, // Dark text
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: theme.shape.borderRadius,
                      boxShadow: theme.shadows[3],
                      '&:hover': {
                        bgcolor: theme.palette.secondary.dark, // Darker secondary on hover
                        boxShadow: theme.shadows[5],
                      },
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
                      borderColor: theme.palette.primary.contrastText, // White border
                      color: theme.palette.primary.contrastText, // White text
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: theme.shape.borderRadius,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)', // Subtle white hover
                        borderColor: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    Explore
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ position: "relative" }}>
                {/* Login Form */}
                <Box
                  sx={{
                    width: { xs: "90%", sm: "380px", md: "420px" }, // Responsive width
                    alignSelf: "center",
                    mx: "auto",
                    bgcolor: theme.palette.background.paper, // Use theme color
                    p: { xs: 2, sm: 3 },
                    borderRadius: theme.shape.borderRadius * 2, // More rounded
                    boxShadow: theme.shadows[6], // Stronger shadow for form
                  }}
                >
                  <LoginFormTitle
                    variant="h5"
                    component="h4"
                    sx={{
                      mb: 2,
                      fontWeight: bold,
                      color: theme.palette.text.primary,
                      textAlign: "center",
                    }}
                  >
                    Log in to your account
                  </LoginFormTitle>
                  <Box component="form" onSubmit={handleEmailSignIn}>
                    <InputField
                      label="Enter your email address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="small"
                    />
                    <InputField
                      label="Enter your password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOff sx={{ color: theme.palette.text.secondary }} />
                              ) : (
                                <Visibility sx={{ color: theme.palette.text.secondary }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Link
                      to="/forgot-password"
                      style={{ fontSize: "0.875rem", color: theme.palette.primary.main }}
                    >
                      Forgot Password?
                    </Link>
                    <LoginButton type="submit" disabled={loading.email}>
                      {loading.email ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Log In"
                      )}
                    </LoginButton>
                  </Box>
                  <SocialDivider>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Or log in with
                    </Typography>
                  </SocialDivider>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <GoogleSignInButton
                      variant="contained"
                      onClick={handleGoogleSignIn}
                      disabled={loading.google}
                      startIcon={<GoogleIcon />}
                    >
                      {loading.google ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Google"
                      )}
                    </GoogleSignInButton>
                    <LinkedInSignInButton
                      variant="outlined"
                      onClick={handleLinkedInLogin}
                      disabled={loading.linkedin}
                      startIcon={<LinkedInIcon />}
                      sx={{
                        flex: 1,
                        py: 1.25,
                      }}
                    >
                      {loading.linkedin ? (
                        <CircularProgress size={24} />
                      ) : (
                        "LinkedIn"
                      )}
                    </LinkedInSignInButton>
                  </Stack>
                  {error && (
                    <Alert
                      severity="error"
                      sx={{ mt: 2, display: "flex", alignItems: "center" }}
                    >
                      <AlertCircleIcon
                        style={{
                          marginRight: "8px",
                          height: "20px",
                          width: "20px",
                        }}
                      />
                      {error}
                    </Alert>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Don't have an account?{" "}
                    <Link
                      to="/register-form"
                      style={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Founder Section */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: theme.palette.background.paper }}>
          <Container maxWidth="md">
            <Grid container spacing={4} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                <Avatar
                  src={`/images/tareq.jpg`} // Corrected image path
                  sx={{ width: 150, height: 150, mx: "auto", mb: 2, boxShadow: theme.shadows[3] }}
                />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: theme.palette.text.primary, textAlign: "center" }}>
                  Tareq Al-Sharif
                </Typography>
                <Typography variant="body2" color={theme.palette.text.secondary} sx={{ textAlign: "center" }}>
                  Founder & CEO
                </Typography>
              </Grid>
              <Grid item xs={12} md={8} sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    textAlign: "center",
                  }}
                >
                  A Message from Our Founder
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, textAlign: "center" }}>
                  Welcome to SwipeScout! I founded this platform with a vision to
                  revolutionize how people connect in the professional world. I
                  believe that true potential and personality are best conveyed
                  through authentic human interaction, and video is the most
                  powerful tool for that. Our mission is to make recruitment more
                  personal, efficient, and enjoyable for everyone. Join us and
                  experience the future of hiring.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* See SwipeScout in Action Section */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: theme.palette.grey[100] }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              See SwipeScout in Action
            </Typography>
            <Grid container spacing={3} sx={{ p: 2 }}>
              {mockVideoResumes.map((video) => (
                <Grid
                  item
                  key={video.id}
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{
                      width: "300px",
                      maxWidth: "100%",
                      borderRadius: theme.shape.borderRadius * 1.5, // More rounded
                      boxShadow: theme.shadows[3],
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                      position: "relative",
                      overflow: "hidden",
                      aspectRatio: "9/16",
                    }}
                    onClick={() => handleVideoClick(video.id)}
                  >
                    {(video.status === "uploading" ||
                      video.status === "processing") && (
                      <StatusBorder status={video.status} />
                    )}
                    <CardMedia
                      component="div"
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        backgroundColor: theme.palette.grey[900], // Dark background for video area
                        cursor: "pointer",
                      }}
                    >
                      {video.video_url && (
                        <video
                          ref={(el) => (videoRefs.current[video.id] = el)}
                          src={video.video_url}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                          muted={isMuted}
                          loop
                          playsInline
                          disablePictureInPicture
                          controlsList="nodownload"
                        />
                      )}
                      <Box
                        className="play-icon-overlay"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: theme.palette.primary.contrastText,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          borderRadius: "50%",
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity:
                            playingVideoId === video.id ||
                            video.status === "uploading" ||
                            video.status === "processing"
                              ? 0
                              : 1,
                          transition: "opacity 0.3s",
                        }}
                      >
                        <PlayArrow fontSize="large" />
                      </Box>
                      <IconButton
                        onClick={(e) => toggleMute(e, video.id)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 2,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: theme.palette.primary.contrastText,
                          opacity: playingVideoId === video.id ? 1 : 0,
                          transition: "opacity 0.3s",
                        }}
                      >
                        {isMuted ? <VolumeOff /> : <VolumeUp />}
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFullscreen(video.id);
                        }}
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          zIndex: 2,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: theme.palette.primary.contrastText,
                          opacity: playingVideoId === video.id ? 1 : 0,
                          transition: "opacity 0.3s",
                        }}
                      >
                        <Fullscreen />
                      </IconButton>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 2,
                          color: theme.palette.primary.contrastText,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                          zIndex: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          noWrap
                          sx={{ color: theme.palette.primary.contrastText }}
                        >
                          {video.video_title || "Untitled Video"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.grey[300] }}>
                          {video.video_type || "Uncategorized"} •{" "}
                          {Math.round(video.video_duration || 0)}s
                        </Typography>
                      </Box>
                    </CardMedia>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Button
                component={Link}
                to="/videos/all"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                  px: 6,
                  py: 1.5,
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[3],
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Browse All Videos
              </Button>
            </Box>
          </Container>
        </Box>
        {/* Testimonials Section */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: theme.palette.background.default }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              What Our Users Say
            </Typography>
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{
                    height: "100%",
                    p: 3,
                    boxShadow: theme.shadows[3],
                    borderRadius: theme.shape.borderRadius * 1.5,
                    backgroundColor: theme.palette.background.paper,
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar
                        src={testimonial.avatar}
                        sx={{ width: 60, height: 60, mr: 2, boxShadow: theme.shadows[1] }}
                      />
                      <Box>
                        <Typography variant="h6" component="h3" sx={{ color: theme.palette.text.primary }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color={theme.palette.text.secondary}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontStyle: "italic", color: theme.palette.text.primary }}>
                      "{testimonial.quote}"
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {[1, 2, 3, 4, 5].map((starIndex) => (
                        <Star
                          key={starIndex}
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            color:
                              starIndex <= testimonial.rating
                                ? theme.palette.warning.main // Use warning color for stars
                                : theme.palette.grey[300], // Light grey for empty
                          }}
                        />
                      ))}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
        {/* Call to Action Section */}
        <Box
          sx={{
            pt: { xs: 6, md: 8 },
            pb: { xs: 6, md: 8 },
            background: `linear-gradient(170deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`, // Gradient background
            color: theme.palette.primary.contrastText,
            textAlign: "center",
            position: 'relative',
            overflow: 'hidden',
            borderRadius: theme.shape.borderRadius, // Apply global border radius
            boxShadow: theme.shadows[4], // Subtle shadow
            // Adjusted for full width with internal spacing
            width: '98%',
            mx: 'auto', // Center the section
            px: { xs: 2, md: 4 }, // Add horizontal padding
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                mb: 2,
                fontWeight: 800,
                color: theme.palette.primary.contrastText,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '25%',
                  width: '50%',
                  height: '3px',
                  background: theme.palette.secondary.main, // Secondary color for underline
                  borderRadius: '3px'
                }
              }}
            >
              Ready to Transform Your Recruitment?
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                mb: 4,
                fontWeight: 500,
                color: theme.palette.primary.contrastText + 'CC',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Join thousands of professionals and companies finding better matches through video.
            </Typography>
            <Button
              component={Link}
              to="/register-form"
              variant="contained"
              size="large"
              sx={{
                background: theme.palette.secondary.main, // Secondary color for button
                color: theme.palette.secondary.contrastText, // Dark text
                fontWeight: 700,
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[4],
                textTransform: 'uppercase',
                letterSpacing: '1px',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  background: theme.palette.secondary.dark,
                  boxShadow: theme.shadows[6],
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              Get Started Free
              <Box
                component="span"
                sx={{
                  ml: 1,
                  animation: 'pulse 2s infinite',
                  display: 'inline-block'
                }}
              >
                →
              </Box>
            </Button>

            <Box
              sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                flexWrap: 'wrap'
              }}
            >
              <Typography variant="caption" sx={{ color: theme.palette.primary.contrastText + 'CC', display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ color: theme.palette.success.light, mr: 1, fontSize: '1rem' }} />
                No credit card required to start
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.primary.contrastText + 'CC', display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ color: theme.palette.info.light, mr: 1, fontSize: '1rem' }} />
                30-second signup
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.primary.contrastText + 'CC', display: 'flex', alignItems: 'center' }}>
                <People sx={{ color: theme.palette.warning.light, mr: 1, fontSize: '1rem' }} />
                Free forever plan
              </Typography>
            </Box>
          </Container>
        </Box>
        <Box sx={{ mt: 1, bgcolor: theme.palette.background.default, py: 2 }}></  Box>
        <Footer />
      </Box>
    </>
  );
};
export default HomePage;
