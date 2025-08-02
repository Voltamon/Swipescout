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
    video_url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935032/Employer/grfwutcixeecejrsqu7o.mp4",
    status: "completed",
  },
  {
    id: "js-1",
    video_title: "Full Stack Developer - Portfolio Showcase",
    video_type: "Job Seeker",
    video_duration: 120,
    video_url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935204/Jobseeker/wvepwzroiy6s942idqal.mp4",
    status: "completed",
  },
  {
    id: "emp-2",
    video_title: "Designer and developer - Resume Showcase",
    video_type: "Company Profile",
    video_duration: 60,
    video_url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935196/Jobseeker/h5qg3cfiszmjefiquvrm.mp4",
    status: "completed",
  },
];
const HomePage = () => {
    // State to manage dark mode
    const [darkMode, setDarkMode] = useState(false);
    // Create a theme with light and dark mode palettes
    const lightTheme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#1976d2',
            },
        },
    });
    // Adjust dark mode colors to be less dark
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#90caf9',
            },
            background: {
                default: '#2c2c2c', // Less dark than #121212
                paper: '#3c3c3c', // Less dark than #1d1d1d
            },
        },
    });

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
    const { loginByEmailAndPassword, authenticateWithGoogle, authenticateWithLinkedIn, user, role, loading: authLoading, } = useAuth();
    const [loading, setLoading] = useState({ email: false, google: false, linkedin: false, });
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ email: "", password: "", });
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
            case "job_seeker": return "/dashboard";
            case "employer": return "/employer-dashboard";
            case "admin": return "/admin-dashboard";
            default: return "/";
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value, }));
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
            setError(err.message || "Login failed...
