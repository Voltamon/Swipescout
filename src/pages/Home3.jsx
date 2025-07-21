import React, { useState, useRef, useEffect } from 'react';
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
    Stack,
        
    Paper,
    Fade,
    Zoom,
    Slide
} from '@mui/material';
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
    LinkedIn as LinkedInIcon,
    PlayArrow,
    VolumeUp,
    VolumeOff,
    Star,
    Business,
    School,
    LocationOn,
    Timeline,
    Security,
    Speed,
    Support
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Headers/Header';
import Footer from '../components/Headers/Footer';
import { Helmet } from 'react-helmet';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle as AlertCircleIcon } from 'lucide-react';

// Enhanced styled components
const HeroSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url(/patterns/geometric.svg) center/cover',
        opacity: 0.1,
        zIndex: 1
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

const FeatureCard = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: '20px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-12px) scale(1.02)',
        boxShadow: '0 25px 50px rgba(102, 126, 234, 0.15)',
        border: '1px solid rgba(102, 126, 234, 0.3)'
    }
}));

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

const TestimonialCard = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: '20px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
    }
}));

const mockVideoResumes = [
    {
        id: "emp-1",
        video_title: "Corporate Solutions Inc. - Company Overview",
        video_type: "Company Profile",
        video_duration: 90,
        video_url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935032/Employer/grfwutcixeecejrsqu7o.mp4",
        status: "completed"
    },
    {
        id: "js-1",
        video_title: "Full Stack Developer - Portfolio Showcase",
        video_type: "Job Seeker",
        video_duration: 120,
        video_url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935204/Jobseeker/wvepwzroiy6s942idqal.mp4",
        status: "completed"
    },
    {
        id: "emp-2",
        video_title: "Designer and developer - Resume Showcase",
        video_type: "Company Profile",
        video_duration: 60,
        video_url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935196/Jobseeker/h5qg3cfiszmjefiquvrm.mp4",
        status: "completed"
    }
];

const features = [
    {
        icon: <VideoCall sx={{ fontSize: 48, color: '#667eea' }} />,
        title: "AI-Powered Video Matching",
        description: "Our advanced AI analyzes video content, skills, and preferences to create perfect matches between candidates and employers.",
        bgColor: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)"
    },
    {
        icon: <Security sx={{ fontSize: 48, color: '#764ba2' }} />,
        title: "Enterprise Security",
        description: "Bank-level encryption and privacy controls ensure your data and videos are always secure and compliant.",
        bgColor: "linear-gradient(135deg, #764ba220 0%, #667eea20 100%)"
    },
    {
        icon: <Timeline sx={{ fontSize: 48, color: '#667eea' }} />,
        title: "Real-time Analytics",
        description: "Track video performance, engagement metrics, and hiring success rates with comprehensive analytics dashboard.",
        bgColor: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)"
    },
    {
        icon: <Speed sx={{ fontSize: 48, color: '#764ba2' }} />,
        title: "Lightning Fast Hiring",
        description: "Reduce time-to-hire by 60% with instant video screening and automated candidate ranking.",
        bgColor: "linear-gradient(135deg, #764ba220 0%, #667eea20 100%)"
    },
    {
        icon: <Support sx={{ fontSize: 48, color: '#667eea' }} />,
        title: "24/7 Expert Support",
        description: "Get dedicated support from our recruitment experts to optimize your hiring process and video strategy.",
        bgColor: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)"
    },
    {
        icon: <Business sx={{ fontSize: 48, color: '#764ba2' }} />,
        title: "Enterprise Integration",
        description: "Seamlessly integrate with your existing ATS, HRIS, and workflow tools for a unified hiring experience.",
        bgColor: "linear-gradient(135deg, #764ba220 0%, #667eea20 100%)"
    }
];

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "VP of Talent Acquisition",
        company: "TechCorp Inc.",
        quote: "SwipeScout revolutionized our hiring process. We've reduced time-to-hire by 65% and improved candidate quality significantly.",
        avatar: "/images/testimonials/sarah.jpg",
        rating: 5,
        metrics: "65% faster hiring"
    },
    {
        name: "Michael Chen",
        role: "Senior Software Engineer",
        company: "StartupXYZ",
        quote: "Landing my dream job was effortless with SwipeScout. The video format let me showcase my personality and technical skills perfectly.",
        avatar: "/images/testimonials/michael.jpg",
        rating: 5,
        metrics: "Dream job in 2 weeks"
    },
    {
        name: "Emily Rodriguez",
        role: "HR Director",
        company: "Global Enterprises",
        quote: "The AI matching is incredibly accurate. We're seeing 40% better retention rates from hires made through SwipeScout.",
        avatar: "/images/testimonials/emily.jpg",
        rating: 5,
        metrics: "40% better retention"
    }
];

const stats = [
    { number: "50K+", label: "Active Users", icon: <People /> },
    { number: "15K+", label: "Successful Hires", icon: <Work /> },
    { number: "2.5M+", label: "Video Views", icon: <PlayCircle /> },
    { number: "95%", label: "Satisfaction Rate", icon: <Star /> }
];

const HomePage_v2 = () => {
    const isMobile = useMediaQuery("(max-width:900px)");
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
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
            const result = await loginByEmailAndPassword(formData.email, formData.password);
            
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
                videoElement.play().catch((error) => console.error("Error playing video:", error));
                setPlayingVideoId(videoId);
            }
        }
    };

    const toggleMute = (e, videoId) => {
        e.stopPropagation();
        setIsMuted((prev) => !prev);
    };

    return (
        <>
            <Helmet>
                <title>SwipeScout | Next-Generation Video Recruitment Platform</title>
                <meta
                    name="description"
                    content="Transform your hiring with AI-powered video recruitment. Connect talent with opportunities through authentic video profiles and smart matching."
                />
            </Helmet>

            <Box sx={{ overflowX: 'hidden' }}>
                <Header />

                {/* Hero Section */}
                <HeroSection>
                    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
                        <Grid container spacing={6} alignItems="center" sx={{ minHeight: '100vh' }}>
                            <Grid item xs={12} lg={7}>
                                <Fade in timeout={1000}>
                                    <Box>
                                        <Chip
                                            label="🚀 AI-Powered Recruitment Platform"
                                            sx={{
                                                mb: 3,
                                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                color: 'white',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255, 255, 255, 0.3)'
                                            }}
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
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
                                            <Button
                                                component={Link}
                                                to="/register-form"
                                                variant="contained"
                                                size="large"
                                                sx={{
                                                    bgcolor: 'white',
                                                    color: '#667eea',
                                                    fontWeight: 700,
                                                    px: 4,
                                                    py: 2,
                                                    borderRadius: '50px',
                                                    fontSize: '1.1rem',
                                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255,255,255,0.95)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
                                                    }
                                                }}
                                            >
                                                Start Free Trial
                                            </Button>
                                            <Button
                                                component={Link}
                                                to="/videos/all"
                                                variant="outlined"
                                                size="large"
                                                sx={{
                                                    borderColor: 'white',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    px: 4,
                                                    py: 2,
                                                    borderRadius: '50px',
                                                    fontSize: '1.1rem',
                                                    backdropFilter: 'blur(10px)',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255,255,255,0.1)',
                                                        transform: 'translateY(-2px)'
                                                    }
                                                }}
                                            >
                                                Watch Demo
                                            </Button>
                                        </Stack>
                                        
                                        {/* Stats Row */}
                                        <Grid container spacing={3} sx={{ mt: 2 }}>
                                            {stats.slice(0, 3).map((stat, index) => (
                                                <Grid item xs={4} key={index}>
                                                    <Zoom in timeout={1000 + index * 200}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography
                                                                variant="h4"
                                                                sx={{
                                                                    fontWeight: 800,
                                                                    color: 'white',
                                                                    mb: 0.5
                                                                }}
                                                            >
                                                                {stat.number}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                {stat.label}
                                                            </Typography>
                                                        </Box>
                                                    </Zoom>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Fade>
                            </Grid>

                            <Grid item xs={12} lg={5}>
                                <Slide direction="left" in timeout={1200}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {/* Video Showcase */}
                                        <VideoShowcase>
                                            <video
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                style={{
                                                    width: '100%',
                                                    height: '300px',
                                                    objectFit: 'cover'
                                                }}
                                            >
                                                <source src="/videos/hero-demo.mp4" type="video/mp4" />
                                            </video>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    p: 3,
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                                    color: 'white'
                                                }}
                                            >
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    See SwipeScout in Action
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Watch how video recruitment transforms hiring
                                                </Typography>
                                            </Box>
                                        </VideoShowcase>

                                        {/* Login Form */}
                                        <FloatingCard sx={{ p: 4 }}>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    mb: 3,
                                                    fontWeight: 700,
                                                    textAlign: 'center',
                                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}
                                            >
                                                Welcome Back
                                            </Typography>

                                            <Box component="form" onSubmit={handleEmailSignIn}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    sx={{ mb: 2 }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Password"
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    sx={{ mb: 2 }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    edge="end"
                                                                >
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                                
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    size="large"
                                                    disabled={loading.email}
                                                    sx={{
                                                        mb: 2,
                                                        py: 1.5,
                                                        borderRadius: '12px',
                                                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {loading.email ? <CircularProgress size={24} /> : "Sign In"}
                                                </Button>
                                            </Box>

                                            <Divider sx={{ my: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Or continue with
                                                </Typography>
                                            </Divider>

                                            <Stack direction="row" spacing={2}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    onClick={handleGoogleSignIn}
                                                    disabled={loading.google}
                                                    startIcon={<GoogleIcon />}
                                                    sx={{ py: 1.5, borderRadius: '12px' }}
                                                >
                                                    {loading.google ? <CircularProgress size={20} /> : "Google"}
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    onClick={handleLinkedInLogin}
                                                    disabled={loading.linkedin}
                                                    startIcon={<LinkedInIcon />}
                                                    sx={{ py: 1.5, borderRadius: '12px' }}
                                                >
                                                    {loading.linkedin ? <CircularProgress size={20} /> : "LinkedIn"}
                                                </Button>
                                            </Stack>

                                            {error && (
                                                <Alert severity="error" sx={{ mt: 2 }}>
                                                    {error}
                                                </Alert>
                                            )}

                                            <Typography
                                                variant="body2"
                                                sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}
                                            >
                                                Don't have an account?{" "}
                                                <Link
                                                    to="/register-form"
                                                    style={{
                                                        color: '#667eea',
                                                        fontWeight: 600,
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    Sign Up Free
                                                </Link>
                                            </Typography>
                                        </FloatingCard>
                                    </Box>
                                </Slide>
                            </Grid>
                        </Grid>
                    </Container>
                </HeroSection>

                {/* Features Section */}
                <Box sx={{ py: 12, bgcolor: '#f8faff' }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    mb: 3,
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Why Choose SwipeScout?
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}
                            >
                                Experience the next generation of recruitment technology with features designed for modern hiring needs.
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {features.map((feature, index) => (
                                <Grid item xs={12} md={6} lg={4} key={index}>
                                    <Zoom in timeout={800 + index * 100}>
                                        <FeatureCard>
                                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                                <Box
                                                    sx={{
                                                        width: 80,
                                                        height: 80,
                                                        borderRadius: '20px',
                                                        background: feature.bgColor,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        mb: 3
                                                    }}
                                                >
                                                    {feature.icon}
                                                </Box>
                                                <Typography
                                                    variant="h5"
                                                    sx={{ fontWeight: 700, mb: 2, color: '#333' }}
                                                >
                                                    {feature.title}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{ color: 'text.secondary', lineHeight: 1.6 }}
                                                >
                                                    {feature.description}
                                                </Typography>
                                            </CardContent>
                                        </FeatureCard>
                                    </Zoom>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* Video Showcase Section */}
                <Box sx={{ py: 12 }}>
                    <Container maxWidth="lg">
                        <Typography
                            variant="h2"
                            sx={{
                                textAlign: 'center',
                                mb: 8,
                                fontWeight: 800,
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            See SwipeScout in Action
                        </Typography>

                        <Grid container spacing={4} justifyContent="center">
                            {mockVideoResumes.map((video, index) => (
                                <Grid item xs={12} sm={6} md={4} key={video.id}>
                                    <Zoom in timeout={1000 + index * 200}>
                                        <Card
                                            sx={{
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                transition: 'all 0.4s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-8px) scale(1.02)',
                                                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                                                }
                                            }}
                                            onClick={() => handleVideoClick(video.id)}
                                        >
                                            <Box sx={{ position: 'relative', aspectRatio: '9/16' }}>
                                                <video
                                                    ref={(el) => (videoRefs.current[video.id] = el)}
                                                    src={video.video_url}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                    muted={isMuted}
                                                    loop
                                                    playsInline
                                                />
                                                
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        opacity: playingVideoId === video.id ? 0 : 1,
                                                        transition: 'opacity 0.3s'
                                                    }}
                                                >
                                                    <IconButton
                                                        sx={{
                                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                            color: '#667eea',
                                                            width: 64,
                                                            height: 64,
                                                            '&:hover': {
                                                                bgcolor: 'white',
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }}
                                                    >
                                                        <PlayArrow sx={{ fontSize: 32 }} />
                                                    </IconButton>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        p: 2,
                                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                                        color: 'white'
                                                    }}
                                                >
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        {video.video_title}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                        {video.video_type} • {Math.round(video.video_duration)}s
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </Zoom>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Button
                                component={Link}
                                to="/videos/all"
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 6,
                                    py: 2,
                                    borderRadius: '50px',
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    fontWeight: 600,
                                    fontSize: '1.1rem'
                                }}
                            >
                                Explore All Videos
                            </Button>
                        </Box>
                    </Container>
                </Box>

                {/* Testimonials Section */}
                <Box sx={{ py: 12, bgcolor: '#f8faff' }}>
                    <Container maxWidth="lg">
                        <Typography
                            variant="h2"
                            sx={{
                                textAlign: 'center',
                                mb: 8,
                                fontWeight: 800,
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Success Stories
                        </Typography>

                        <Grid container spacing={4}>
                            {testimonials.map((testimonial, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Fade in timeout={1000 + index * 200}>
                                        <TestimonialCard sx={{ p: 4, height: '100%' }}>
                                            <Box sx={{ display: 'flex', mb: 3 }}>
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                                                ))}
                                            </Box>
                                            
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontStyle: 'italic',
                                                    mb: 3,
                                                    lineHeight: 1.6,
                                                    color: '#333'
                                                }}
                                            >
                                                "{testimonial.quote}"
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar
                                                    src={testimonial.avatar}
                                                    sx={{ width: 50, height: 50, mr: 2 }}
                                                />
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {testimonial.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {testimonial.role}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {testimonial.company}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            
                                            <Chip
                                                label={testimonial.metrics}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                                                    color: '#667eea',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </TestimonialCard>
                                    </Fade>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* CTA Section */}
                <Box
                    sx={{
                        py: 12,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        textAlign: 'center'
                    }}
                >
                    <Container maxWidth="md">
                        <Typography
                            variant="h2"
                            sx={{ fontWeight: 800, mb: 3 }}
                        >
                            Ready to Transform Your Hiring?
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ mb: 4, opacity: 0.9 }}
                        >
                            Join thousands of companies and professionals who've revolutionized their recruitment process with SwipeScout.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                            <Button
                                component={Link}
                                to="/register-form"
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: 'white',
                                    color: '#667eea',
                                    fontWeight: 700,
                                    px: 6,
                                    py: 2,
                                    borderRadius: '50px',
                                    fontSize: '1.1rem',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.95)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                component={Link}
                                to="/contact"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    fontWeight: 600,
                                    px: 6,
                                    py: 2,
                                    borderRadius: '50px',
                                    fontSize: '1.1rem',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Contact Sales
                            </Button>
                        </Stack>
                    </Container>
                </Box>

                <Footer />
            </Box>
        </>
    );
};

export default HomePage_v2;

