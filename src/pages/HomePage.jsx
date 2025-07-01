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
import { useState, useRef, useEffect } from "react"; // Re-added useEffect for clarity, though its specific usage for navigation is now removed.

import PlayArrow from "@mui/icons-material/PlayArrow";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";

import { useAuth } from "../hooks/useAuth";
import { AlertCircle as AlertCircleIcon } from "lucide-react";
import { bold } from "@cloudinary/url-gen/qualifiers/fontWeight";

// Styled components (copied from LoginPage for consistency, adjust if LoginForm handles styling)
const LoginFormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.25)
}));

const LoginFormSubtitle = styled(Typography)(({ theme }) => ({
  color: "#888",
  marginBottom: theme.spacing(2.5)
}));

const InputField = styled(TextField)(({ theme }) => ({
  width: "100%",
  margin: theme.spacing(1, 0),
  borderRadius: "5px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor:
        theme.palette.mode === "light" ? "#e0e0e0" : theme.palette.grey[700]
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main
    }
  },
  "& input": {
    padding: theme.spacing(1.5),
    backgroundColor:
      theme.palette.mode === "light" ? "#fff" : theme.palette.grey[900]
  }
}));

const LoginButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  backgroundColor: "#5c6bc0",
  color: "white",
  border: "none",
  borderRadius: "25px",
  fontWeight: "bold",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark
  }
}));

const SocialDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  "& .MuiDivider-wrapper": {
    color: "#888"
  }
}));

const SocialButton = styled(Button)(({ theme }) => ({
  flexGrow: 1,
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1.25),
  border: "none",
  borderRadius: "20px",
  cursor: "pointer"
}));

const GoogleSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#DB4437",
  border: `1px solid #DB4437`,
  "&:hover": {
    backgroundColor: "#fbe3e1"
  },
  "&:active": {
    backgroundColor: "rgb(235, 216, 164) !important"
  },
  "&.Mui-focusVisible": {
    outline: "2px solid #1976d2",
    backgroundColor: "rgb(235, 216, 164) !important"
  }
}));

const LinkedInSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: "rgb(255, 255, 255)",
  color: "#0077B5", // LinkedIn brand color
  border: `1px solid #0077B5`, // LinkedIn brand color
  "&:hover": {
    backgroundColor: "rgb(183, 215, 248)"
  }
}));

const StyledFeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "16px",
  boxShadow: theme.shadows[4],
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
    background: "rgba(0,0,0,0.3)",
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
      height: 5, // Thickness of the border
      backgroundColor:
        status === "uploading"
          ? "orange"
          : status === "processing"
          ? "blue"
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
    video_duration: 90, // in seconds
    video_url:
      "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935032/Employer/grfwutcixeecejrsqu7o.mp4",
    status: "completed" // Can be 'uploading', 'processing', 'completed', 'failed'
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
      "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935196/Jobseeker/h5qg3cfiszmjefiquvrm.mp4", // Example URL
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
  // Destructure `user` and `role` from useAuth
  const {
    loginByEmailAndPassword,
    authenticateWithGoogle,
    authenticateWithLinkedIn,
    user, // Access user state from context
    role, // Access role state from context
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
    // Only navigate if user explicitly logged in (clicked the button)
    if (explicitLogin && user && role && !authLoading) {
      const from = location.state?.from?.pathname || getDefaultRoute(role);
      navigate(from, { replace: true });
      setExplicitLogin(false); // Reset after navigation
    }
  }, [user, role, authLoading, explicitLogin, navigate, location.state]);



  // The useEffect for automatic navigation has been intentionally removed as per previous request.
  // If you need to re-implement automatic navigation on component load for already logged-in users,
  // you would add a useEffect here that checks `user` and `role` and navigates.

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
    setExplicitLogin(true); // Mark that user explicitly clicked login
    setLoading((prev) => ({ ...prev, email: true }));
    setError("");
    
    try {
      const result = await loginByEmailAndPassword(formData.email, formData.password);
      
      if (result && result.error) {
        setError(result.message || "Login failed. Please try again.");
        setExplicitLogin(false); // Reset if login fails
        return;
      }
      
      // The useEffect will handle the navigation now
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setExplicitLogin(false); // Reset on error
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  };
  const handleGoogleSignIn = async () => {
    setLoading((prev) => ({ ...prev, google: true }));
    setError("");
    try {
      const result = await authenticateWithGoogle();
      if (result && result.error) {
        setError(result.message || "Google sign-in failed");
      } else {
        if (user && role) {
          const from = location.state?.from?.pathname || getDefaultRoute(role);
          navigate(from, { replace: true });
        } else {
          setError(
            "Google sign-in successful, but could not determine user role for redirection."
          );
        }
      }
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleLinkedInLogin = async () => {
    setLoading((prev) => ({ ...prev, linkedin: true }));
    setError("");
    try {
      const result = await authenticateWithLinkedIn();
      if (result && result.error) {
        setError(result.message || "LinkedIn login failed");
      } else {
        if (user && role) {
          const from = location.state?.from?.pathname || getDefaultRoute(role);
          navigate(from, { replace: true });
        } else {
          setError(
            "LinkedIn login successful, but could not determine user role for redirection."
          );
        }
      }
    } catch (err) {
      setError(err.message || "LinkedIn login failed");
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
          background: "linear-gradient(to bottom, #ffffff 0%, #f5f9ff 100%)",
          color: "#333",
          overflowX: "hidden"
        }}
      >
        <Header />

        <Box
          sx={{
            background:
              "linear-gradient(135deg,rgb(185, 229, 255) 0%,rgb(162, 194, 241) 100%)",
            color: "white",
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
                    fontFeatureSettings: '"liga", "kern"'
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
                    opacity: 0.9
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
                      bgcolor: "white",
                      color: "#6e8efb",
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
                      borderColor: "white",
                      color: "rgb(23, 92, 182)",
                      fontWeight: 600,
                      px: 4,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)"
                      }
                    }}
                  >
                    Explore Videos
                  </Button>
                </Box>
              </Grid>

              { (
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      justifyContent: "space-between",
                                          alignItems: { xs: "flex-start", md: "flex-end" },
                      gap: 4,
                      height: "100%",
                      minHeight: "500px", // 👈 Ensure there's some height to align within (adjust as needed)
                      "@media (min-width: 900px)": {
                        flexDirection: "row",
                        alignItems: "flex-end", // 👈 Aligns vertically on large screens
                        justifyContent: "space-between" // 👈 Keeps spacing between video and login
                      }
                    }}
                                  >
                                      
                                      
                    <Box //------------------------------
                      sx={{
                        flex: 1, // ← makes it grow and fill available space
                        position: "relative",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                        transform: "perspective(1000px) rotateY(-10deg)",
                        "&:hover": {
                          transform: "perspective(1000px) rotateY(-5deg)"
                        },
                        transition: "transform 0.5s ease",
                        paddingTop: "28.125%",
                        width: "600px",
                        "@media (min-width: 900px)": {
                          width: "600px" // ← allow flex sizing
                        },
                        "& video": {
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }
                      }}
                    >
                      <video autoPlay loop muted playsInline>
                        <source src="/videos/hero-demo.mp4" type="video/mp4" />
                      </video>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 3,
width: '400px',
                          background:
                            "linear-gradient(to top, rgba(185, 229, 255, 0.8), transparent)"
                        }}
                      >
                        <a
                          href="#Howitworks"
                          style={{ textDecoration: "none" }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: "rgb(22, 73, 114)",
                              cursor: "pointer",
                              "&:hover": {
                                textDecoration: "none"
                              }
                            }}
                          >
                            See how it works →
                          </Typography>
                        </a>
                      </Box>
                                      </Box>
                                      
                                     
                                      {!isMobile &&(<Box  //----------------------------------------- separator
                      sx={{
                        width: { xs: "0", md: "200px"}, // fixed width on desktop
pl:'auto' ,
                      }}
                                      ></Box>)}
                                      
  
                    <Box // ---------------------- login form
                      sx={{
                                              width: { xs: "340px", md:"380px"},
                          alignSelf:"end",
                        "@media (min-width: 900px)": {
                            width: "380px",
                            alignSelf:"end",
                        },
                        bgcolor: "#f9f9f9",
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
                          color: "rgb(23, 92, 182)",
                          textAlign: "center"
                        }}
                      >
                                              Log in
                                              to your account
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
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                        <Link
                          to="/forgot-password"
                          style={{ fontSize: "0.875rem" }}
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
                        <Typography variant="body2">Or log in with</Typography>
                      </SocialDivider>

                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
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
                            borderColor: "#0077B5",
                            color: "#0077B5",
                            "&:hover": { borderColor: "#006097" }
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
                          color: "rgba(0, 0, 0, 0.6)"
                        }}
                      >
                        Don't have an account?{" "}
                        <Link
                          to="/register-form"
                          style={{
                            color: "rgb(23, 92, 182)",
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
              )}
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
                color: "#333"
              }}
              id="Howitworks"
            >
              How SwipeScout Works
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  icon: <VideoCall color="primary" sx={{ fontSize: 40 }} />,
                  title: "1. Create Your Video Profile",
                  description:
                    "Job seekers record a short video resume. Employers create video job postings or company profiles.",
                  bgColor: "rgba(110, 142, 251, 0.1)"
                },
                {
                  icon: <People color="secondary" sx={{ fontSize: 40 }} />,
                  title: "2. Discover & Connect",
                  description:
                    "Swipe through video profiles or use our smart matching to find perfect candidates or opportunities.",
                  bgColor: "rgba(167, 119, 227, 0.1)"
                },
                {
                  icon: (
                    <TrendingUp sx={{ fontSize: 40, color: "success.main" }} />
                  ),
                  title: "3. Grow Your Career",
                  description:
                    "Build meaningful connections that lead to interviews, hires, and career growth.",
                  bgColor: "rgba(103, 214, 168, 0.1)"
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
                          textAlign: "center"
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#666",
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

        <Box sx={{ py: 8, bgcolor: "#f8faff" }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: 700,
                color: "#333"
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
                        backgroundColor: "#000",
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
                          color: "#fff",
                          bgcolor: "rgba(255, 64, 129, 0.7)",
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
                          sx={{ color: "white" }}
                        >
                          {video.video_title || "Untitled Video"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "white" }}>
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
                  bgcolor: "#6e8efb",
                  color: "white",
                  fontWeight: 600,
                  px: 6,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "#5a7ae0"
                  }
                }}
              >
                Browse All Videos
              </Button>
            </Box>
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
                color: "#333"
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
                        <Typography variant="body2" color="text.secondary">
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
                          color="primary"
                          sx={{ fontSize: 16, mr: 0.5 }}
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
            backgroundImage: `linear-gradient(
    to bottom,
        rgba(53, 187, 221, 0.78) 0%,
      rgba(116, 215, 245, 0.8) 40%,
    rgba(26, 58, 110, 0.9)
  )`,
            backgroundBlendMode: "overlay",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            color: "white",
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
                color: "rgb(57, 54, 122)"
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
                color: "rgb(47, 51, 65)"
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
                bgcolor: "white",
                color: "rgb(39, 128, 201)",
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

        <Footer
          sx={{
            py: 10,

            backgroundBlendMode: "overlay",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            color: "white",
            textAlign: "center"
          }}
        />
      </Box>
    </>
  );
};

export default HomePage;
