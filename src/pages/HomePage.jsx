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
  styled,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Stack
} from "@mui/material";
import {
  PlayCircle,
  Work,
  People,
  VideoCall,
  TrendingUp,
  CheckCircle,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  LinkedIn as LinkedInIcon
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Tmp/Header";
import Footer from "../components/Tmp/Footer";
import { Helmet } from "react-helmet";
import { useState, useRef, useEffect } from "react";
import PlayArrow from "@mui/icons-material/PlayArrow";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
import { useAuth } from "../hooks/useAuth";
import { AlertCircle as AlertCircleIcon } from "lucide-react";
import { bold } from "@cloudinary/url-gen/qualifiers/fontWeight";
const LoginFormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.25),
  color: "#1f2937"
}));
const LoginFormSubtitle = styled(Typography)(({ theme }) => ({
  color: "#9ca3af",
  marginBottom: theme.spacing(2.5)
}));
const InputField = styled(TextField)(({ theme }) => ({
  width: "100%",
  margin: theme.spacing(1, 0),
  borderRadius: "5px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#d1d5db"
    },
    "&:hover fieldset": {
      borderColor: "#3b82f6"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6"
    },
    "&.Mui-error fieldset": {
      borderColor: "#dc2626"
    }
  },
  "& input": {
    padding: theme.spacing(1.5),
    backgroundColor: "#ffffff",
    color: "#1f2937"
  }
}));
const LoginButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "25px",
  fontWeight: "bold",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#2563eb"
  }
}));
const SocialDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  "& .MuiDivider-wrapper": {
    color: "#9ca3af"
  }
}));
const SocialButton = styled(Button)(({ theme }) => ({
  flexGrow: 1,
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1.25),
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.02)"
  }
}));
const GoogleSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: "#f9fafb",
  color: "#4b5563",
  border: `1px solid #d1d5db`,
  "&:hover": {
    backgroundColor: "#f3f4f6",
    borderColor: "#9ca3af"
  }
}));
const LinkedInSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: "#f9fafb",
  color: "#4b5563",
  border: `1px solid #d1d5db`,
  "&:hover": {
    backgroundColor: "#f3f4f6",
    borderColor: "#9ca3af"
  }
}));
const StyledFeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "16px",
  boxShadow: theme.shadows[4],
  backgroundColor: "#ffffff",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[10]
  }
}));
const StyledVideoCard = styled(Card)(({ theme }) => ({
  position: "relative",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: theme.shadows[3],
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: theme.shadows[6]
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
      opacity: 1
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
      zIndex: 3
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
    status: "completed"
  },
  {
    id: "js-1",
    video_title: "Full Stack Developer - Portfolio Showcase",
    video_type: "Job Seeker",
    video_duration: 120,
    video_url:
      "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935204/Jobseeker/wvepwzroiy6s942idqal.mp4",
    status: "completed"
  },
  {
    id: "emp-2",
    video_title: "Designer and developer - Resume Showcase",
    video_type: "Company Profile",
    video_duration: 60,
    video_url:
      "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935196/Jobseeker/h5qg3cfiszmjefiquvrm.mp4",
    status: "completed"
  }
];
const HomePage = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isPlayVideo, setIsPlayVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const videoRefs = useRef({});
  const [explicitLogin, setExplicitLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loginByEmailAndPassword,
    authenticateWithGoogle,
    authenticateWithLinkedIn,
    user,
    role,
    loading: authLoading
  } = useAuth();
  const [loading, setLoading] = useState({
    email: false,
    google: false,
    linkedin: false
  });
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
      [name]: value
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
          background: "#f9fafb",
          color: "#1f2937",
          overflowX: "hidden"
        }}
      >
        <Header />
        <Box
          sx={{
            background: "linear-gradient(to right, #3b82f6, #93c5fd)",
            color: "#ffffff",
            py: 10,
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "url(/backgrounds/hero-pattern.svg) center/cover no-repeat",
              opacity: 0.1
            }
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: { xs: 600, md: 800 },
                    mb: 3,
                    fontSize: { xs: 40, md: 60 },
                    lineHeight: 1.2,
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                    textRendering: "optimizeLegibility",
                    fontFeatureSettings: '"liga", "kern"',
                    color: "#ffffff"
                  }}
                >
                  Revolutionizing Recruitment with Video
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    mb: 4,
                    fontWeight: 400,
                    opacity: 0.9,
                    color: "#dbeafe"
                  }}
                >
                  Connect with opportunities through authentic video profiles.
                  Whether you're hiring or looking for your next role,
                  SwipeScout makes it personal.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    alignItems: "center"
                  }}
                >
                  <Button
                    component={Link}
                    to="/register-form"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: "#ffffff",
                      color: "#3b82f6",
                      fontWeight: 600,
                      px: 4,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.9)"
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
                      borderColor: "#ffffff",
                      color: "#ffffff",
                      fontWeight: 600,
                      px: 4,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.2)"
                      }
                    }}
                  >
                    Explore Videos
                  </Button>
                </Box>
              </Grid>
          
            </Grid>

                <Grid item xs={12} md={6} marginTop={"-60px"}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "flex-end" },
                    gap: 4,
                    height: "100%",
                    minHeight: "500px",
                    "@media (min-width: 900px)": {
                      flexDirection: "row",
                      alignItems: "flex-end",
                      justifyContent: "space-between"
                    }
                  }}
                >
                 
                
                               <Box textAlign="center" mt={4} mb={6}  sx={{
                pointer: "cursor"}}> <a href="#Howitworks" style={{ textDecoration: "none" , cursor: "pointer"}}>
            <Typography
              variant="h6"
             
              sx={{
               
                color: "#67e8f9",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                  color: "#06b6d4"
                }
              }}
            >
             
            </Typography> </a>
          </Box>
       
                  
                 
                  {!isMobile && (
                    <Box
                      sx={{
                        width: { xs: "0", md: "140px" },
                        pl: "auto"
                      }}
                    ></Box>
                  )}
                  <Box
                    sx={{
                      width: { xs: "340px", md: "420px" },
                      alignSelf: "end",
                      "@media (min-width: 900px)": {
                        width: "380px",
                        alignSelf: "end"
                      },
                      bgcolor: "#dbeafe",
                      p: 3,
                      borderRadius: "10px",
                      boxShadow: "0 0 15px rgba(0,0,0,0.1)"
                    }}
                  >
                    <LoginFormTitle
                      variant="h5"
                      component="h4"
                      sx={{
                        mb: 2,
                        fontWeight: bold,
                        color: "#1f2937",
                        textAlign: "center"
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
                                  <VisibilityOff sx={{ color: "#4b5563" }} />
                                ) : (
                                  <Visibility sx={{ color: "#4b5563" }} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <Link
                        to="/forgot-password"
                        style={{ fontSize: "0.875rem", color: "#3b82f6" }}
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
                      <Typography variant="body2" sx={{ color: "#9ca3af" }}>
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
                          py: 1.25
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
                            width: "20px"
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
                        color: "#4b5563"
                      }}
                    >
                      Don't have an account?{" "}
                      <Link
                        to="/register-form"
                        style={{
                          color: "#3b82f6",
                          fontWeight: 600,
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline"
                          }
                        }}
                      >
                        Sign Up
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
          </Container>
        </Box>
        <Box sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: 700,
                color: "#1f2937"
              }}
              id="Howitworks"
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
                  bgColor: "rgba(59, 130, 246, 0.1)"
                },
                {
                  icon: <People sx={{ fontSize: 40, color: "#06b6d4" }} />,
                  title: "2. Discover & Connect",
                  description:
                    "Swipe through video profiles or use our smart matching to find perfect candidates or opportunities.",
                  bgColor: "rgba(6, 182, 212, 0.1)"
                },
                {
                  icon: <TrendingUp sx={{ fontSize: 40, color: "#67e8f9" }} />,
                  title: "3. Grow Your Career",
                  description:
                    "Build meaningful connections that lead to interviews, hires, and career growth.",
                  bgColor: "rgba(103, 232, 249, 0.1)"
                }
              ].map((step, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                  sx={{ display: "flex", width: "80%" }}
                >
                  <StyledFeatureCard
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        p: 3
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
                          mx: "auto"
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
                          color: "#1f2937"
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#4b5563",
                            textAlign: "center"
                          }}
                        >
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
        <Box sx={{ py: 8, bgcolor: "#f3f4f6" }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: 700,
                color: "#1f2937"
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
                      borderRadius: 2,
                      boxShadow: 2,
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)"
                      },
                      position: "relative",
                      overflow: "hidden",
                      aspectRatio: "9/16"
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
                        backgroundColor: "#111827",
                        cursor: "pointer"
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
                            display: "block"
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
                          color: "#ffffff",
                          bgcolor: "rgba(0,0,0,0.7)",
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
                          transition: "opacity 0.3s"
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
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "white",
                          opacity: playingVideoId === video.id ? 1 : 0,
                          transition: "opacity 0.3s"
                        }}
                      >
                        {isMuted ? <VolumeOff /> : <VolumeUp />}
                      </IconButton>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 2,
                          color: "white",
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                          zIndex: 1
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          noWrap
                          sx={{ color: "#ffffff" }}
                        >
                          {video.video_title || "Untitled Video"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#d1d5db" }}>
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
                  bgcolor: "#3b82f6",
                  color: "#ffffff",
                  fontWeight: 600,
                  px: 6,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "#2563eb"
                  }
                }}
              >
                Browse All Videos
              </Button>
            </Box>
          </Container>
        </Box>
        <Box sx={{ py: 8, bgcolor: "#f9fafb" }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: 700,
                color: "#1f2937"
              }}
            >
              What Our Users Say
            </Typography>
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: "100%", p: 3, boxShadow: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar
                        src={testimonial.avatar}
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" component="h3">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="#4b5563">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                      "{testimonial.quote}"
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <CheckCircle
                          key={star}
                          sx={{ fontSize: 16, mr: 0.5, color: "#3b82f6" }}
                        />
                      ))}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
        <Box
          sx={{
            py: 10,
            background: "linear-gradient(to bottom,rgb(116, 168, 250) 0%, #dbeafe 100%)",
            color: "#ffffff",
            textAlign: "center"
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                mb: 0,
                fontWeight: 700,
                color: "#111827"
              }}
            >
              Ready to Transform Your Recruitment?
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                mb: 1,
                fontWeight: 400,
                opacity: 0.9,
                color: "#4b5563"
              }}
            >
              Join thousands of professionals and companies finding better
              matches through video.
            </Typography>
            <Button
              component={Link}
              to="/register-form"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#ffffff",
                color: "#3b82f6",
                fontWeight: 600,
                px: 6,
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.9)"
                }
              }}
            >
              Get Started Free
            </Button>
          </Container>
        </Box>
        <Footer />
      </Box>
    </>
  );
};
export default HomePage;
