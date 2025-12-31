/* eslint-disable react-refresh/only-export-components -- TODO: move non-component exports/constants to helpers */
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
  MonetizationOn as MonetizationOnIcon,
} from "@mui/icons-material";


import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Headers/Header"; // Updated Header path
import Footer from "../components/Headers/Footer"; 
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
      "SwipeScout helped us cut screening time in half while actually getting to know the person behind the resume. Itâ€™s now a core part of our hiring process.",
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
  // const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Use theme breakpoint // Removed: unused variable
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
         <Header />
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
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Gradient background
            color: 'white',
            pt: 8, // Padding top for header
            pb: 4,
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              Revolutionize Your Hiring with Video
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                mb: 4,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                opacity: 0.9,
              }}
            >
              SwipeScout connects top talent with leading companies through engaging video profiles and dynamic job postings.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: '#e0e0e0' },
                  py: 1.5,
                  px: 4,
                  borderRadius: '30px',
                  fontWeight: 'bold',
                }}
                component={Link}
                to="/signup"
              >
                Join as Job Seeker
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  py: 1.5,
                  px: 4,
                  borderRadius: '30px',
                  fontWeight: 'bold',
                }}
                component={Link}
                to="/employer-signup"
              >
                Hire Talent
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* Stats Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatsCard elevation={6}>
                  <Box sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </StatsCard>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Features Section */}
        <Box sx={{ background: theme.palette.background.paper, py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              align="center"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 6, color: theme.palette.text.primary }}
            >
              Why Choose SwipeScout?
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <StyledFeatureCard elevation={3}>
                  <CardMedia
                    component="img"
                    height="200"
                    image="https://via.placeholder.com/400x200?text=Video+Resumes"
                    alt="Video Resumes"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      Engaging Video Resumes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Go beyond paper. Showcase personality, communication skills, and passion with dynamic video profiles that truly stand out.
                    </Typography>
                  </CardContent>
                </StyledFeatureCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledFeatureCard elevation={3}>
                  <CardMedia
                    component="img"
                    height="200"
                    image="https://via.placeholder.com/400x200?text=Smart+Matching"
                    alt="Smart Matching"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      Smart Matching Algorithm
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Our AI-powered system intelligently connects job seekers with relevant opportunities and employers with ideal candidates.
                    </Typography>
                  </CardContent>
                </StyledFeatureCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledFeatureCard elevation={3}>
                  <CardMedia
                    component="img"
                    height="200"
                    image="https://via.placeholder.com/400x200?text=Efficient+Hiring"
                    alt="Efficient Hiring"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      Streamlined Hiring Process
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reduce time-to-hire and improve candidate quality with our intuitive platform designed for modern recruitment needs.
                    </Typography>
                  </CardContent>
                </StyledFeatureCard>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* How It Works Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 6, color: theme.palette.text.primary }}
          >
            How SwipeScout Works
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                For Job Seekers
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create a compelling video resume, explore personalized job recommendations, and apply with confidence.
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="primary" />
                  <Typography variant="body1">Record your unique video profile.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="primary" />
                  <Typography variant="body1">Get matched with top companies.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="primary" />
                  <Typography variant="body1">Apply directly with your video.</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <VideoShowcase>
                <video
                  ref={(el) => (videoRefs.current['js-demo'] = el)}
                  src="https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935204/Jobseeker/wvepwzroiy6s942idqal.mp4"
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  onMouseEnter={() => handleVideoHover('js-demo', true)}
                  onMouseLeave={() => handleVideoHover('js-demo', false)}
                  onClick={() => handleVideoClick('js-demo')}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                  onClick={(e) => toggleMute(e, 'js-demo')}
                >
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                  onClick={() => handleFullscreen('js-demo')}
                >
                  <Fullscreen />
                </IconButton>
              </VideoShowcase>
            </Grid>
          </Grid>

          <Grid container spacing={4} alignItems="center" sx={{ mt: 8 }}>
            <Grid item xs={12} md={6}>
              <VideoShowcase>
                <video
                  ref={(el) => (videoRefs.current['emp-demo'] = el)}
                  src="https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935032/Employer/grfwutcixeecejrsqu7o.mp4"
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  onMouseEnter={() => handleVideoHover('emp-demo', true)}
                  onMouseLeave={() => handleVideoHover('emp-demo', false)}
                  onClick={() => handleVideoClick('emp-demo')}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                  onClick={(e) => toggleMute(e, 'emp-demo')}
                >
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                  onClick={() => handleFullscreen('emp-demo')}
                >
                  <Fullscreen />
                </IconButton>
              </VideoShowcase>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                For Employers
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Discover top talent through authentic video introductions, streamline your hiring, and build your dream team.
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="primary" />
                  <Typography variant="body1">Post engaging video job descriptions.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="primary" />
                  <Typography variant="body1">Efficiently screen candidates with video profiles.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="primary" />
                  <Typography variant="body1">Make faster, better hiring decisions.</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>

        {/* Testimonials Section */}
        <Box sx={{ background: theme.palette.background.default, py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              align="center"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 6, color: theme.palette.text.primary }}
            >
              What Our Users Say
            </Typography>
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <FloatingCard elevation={3}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={testimonial.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{testimonial.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{testimonial.role}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                        "{testimonial.quote}"
                      </Typography>
                      <Box>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                        ))}
                      </Box>
                    </CardContent>
                  </FloatingCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Premium Features Section */}
        <Box sx={{ background: theme.palette.background.paper, py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              align="center"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 6, color: theme.palette.text.primary }}
            >
              Unlock More with Premium Features
            </Typography>
            <Grid container spacing={4} alignItems="stretch">
              <Grid item xs={12} md={4}>
                <StyledFeatureCard elevation={3}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <MonetizationOnIcon sx={{ fontSize: 60, color: theme.palette.success.main, mb: 2 }} />
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      Advanced Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gain deeper insights into your profile views, video performance, and application success rates.
                    </Typography>
                  </CardContent>
                </StyledFeatureCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledFeatureCard elevation={3}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <VideoCall sx={{ fontSize: 60, color: theme.palette.info.main, mb: 2 }} />
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      Enhanced Video Tools
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Access professional video editing features, longer video uploads, and premium templates.
                    </Typography>
                  </CardContent>
                </StyledFeatureCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledFeatureCard elevation={3}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <TrendingUp sx={{ fontSize: 60, color: theme.palette.warning.main, mb: 2 }} />
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      Priority Matching
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get prioritized in our matching algorithm and connect with exclusive job opportunities or top candidates faster.
                    </Typography>
                  </CardContent>
                </StyledFeatureCard>
              </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: theme.palette.success.main,
                  color: 'white',
                  '&:hover': { bgcolor: theme.palette.success.dark },
                  py: 1.5,
                  px: 5,
                  borderRadius: '30px',
                  fontWeight: 'bold',
                }}
                component={Link}
                to="/pricing"
              >
                View Pricing Plans
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Call to Action Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', // Reverse gradient
            color: 'white',
            py: 8,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              Ready to Transform Your Career or Hiring?
            </Typography>
            <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
              Join SwipeScout today and experience the future of recruitment.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: '#e0e0e0' },
                  py: 1.5,
                  px: 4,
                  borderRadius: '30px',
                  fontWeight: 'bold',
                }}
                component={Link}
                to="/signup"
              >
                Get Started Now
              </Button>
            </Stack>
          </Container>
        </Box>

        <Footer />
      </Box>
    </>
  );
};

export default HomePage;


