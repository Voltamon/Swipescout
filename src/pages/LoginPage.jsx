import { useState, useEffect } from "react";
import { useNavigate, useLocation ,Link} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Stack,
  styled,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { AlertCircle as AlertCircleIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

// Styled components
const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: 'float 20s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
  },
}));

const LoginFormContainer = styled(Paper)(({ theme }) => ({
  width: 420,
  padding: theme.spacing(4),
  boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05)',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  zIndex: 1,
  animation: 'slideUp 0.6s ease-out',
  '@keyframes slideUp': {
    '0%': { 
      opacity: 0, 
      transform: 'translateY(30px) scale(0.95)' 
    },
    '100%': { 
      opacity: 1, 
      transform: 'translateY(0) scale(1)' 
    },
  },
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    padding: theme.spacing(3),
  },
}));

const LoginFormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 700,
  fontSize: '2rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
}));

const LoginFormSubtitle = styled(Typography)(({ theme }) => ({
  color: '#6b7280',
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  fontSize: '1rem',
  fontWeight: 400,
}));

const InputField = styled(TextField)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1.5, 0),
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontWeight: 500,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#667eea',
  },
  '& input': {
    padding: theme.spacing(1.5),
    fontSize: '1rem',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.75),
  marginTop: theme.spacing(2),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: '#e5e7eb',
    color: '#9ca3af',
    boxShadow: 'none',
    transform: 'none',
  },
}));

const SocialDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  '&::before, &::after': {
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  '& .MuiDivider-wrapper': {
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: theme.spacing(0, 2),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  flexGrow: 1,
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1.5),
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
  },
}));

const GoogleSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#db4437',
  border: '2px solid #db4437',
  '&:hover': {
    backgroundColor: '#fef2f2',
    borderColor: '#dc2626',
    boxShadow: '0 4px 12px rgba(219, 68, 55, 0.2)',
  },
}));

const LinkedInSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#0077b5',
  color: 'white',
  border: '2px solid #0077b5',
  '&:hover': {
    backgroundColor: '#005885',
    borderColor: '#005885',
    boxShadow: '0 4px 12px rgba(0, 119, 181, 0.3)',
  },
}));

const SignupLink = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(3),
  color: '#6b7280',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#667eea',
  },
}));

const LoginPage = () => {
  const {
    user,
    role,
    loading: authLoading,
    loginByEmailAndPassword,
    authenticateWithGoogle,
    authenticateWithLinkedIn,
  } = useAuth();
   const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState({
    email: false,
    google: false,
    linkedin: false,
  });
   const [formData, setFormData] = useState({
    email: "",
    password: ""
  }); 
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  if(authLoading){
    return (<CircularProgress/>)
  }

  // Handle navigation after successful authentication
  useEffect(() => {
    console.log("logggg:",user);
    if (!authLoading && user && role) {
      const from = location.state?.from?.pathname || getDefaultRoute(role);
      navigate(from);
    }
  }, [user, role, authLoading, navigate, location.state]);

  const getDefaultRoute = (role) => {
    switch (role) {
      case 'job_seeker': return '/jobseeker-tabs'; //dashboard
      case 'employer': return '/employer-tabs'; //employer-dashboard
      case 'admin': return '/admin-dashboard';
      default: return '/login';
    }
  }; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, email: true }));
    setError("");

    try {
      const result = await loginByEmailAndPassword(formData.email, formData.password);
      if (result.error) {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, email: false }));
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(prev => ({ ...prev, google: true }));
    setError("");

    try {
      const result = await authenticateWithGoogle();
      if (result.error) {
        setError(result.message || "Google sign-in failed");
      }
    } catch (err) {
      setError("Google sign-in failed");
    } finally {
      setLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleLinkedInLogin = async () => {
    setLoading(prev => ({ ...prev, linkedin: true }));
    setError("");

    try {
      const result = await authenticateWithLinkedIn();
      if (result.error) {
        setError(result.message || "LinkedIn login failed");
      }
    } catch (err) {
      setError("LinkedIn login failed");
    } finally {
      setLoading(prev => ({ ...prev, linkedin: false }));
    }
  };

  const navigateToRegister = () => {
    navigate("/register-form");
  };

  if (authLoading) {
    return (
      <LoginContainer>
        <CircularProgress size={60} />
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginFormContainer>
        <LoginFormTitle variant="h5">Welcome Back</LoginFormTitle>
        <LoginFormSubtitle>Log in to your account</LoginFormSubtitle>
        
        <Box component="form" onSubmit={handleEmailSignIn}>
          <InputField
            label="Enter your email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
          />
          <InputField
            label="Enter your password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            variant="outlined"
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
              ),
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Link 
              to="/forgot-password" 
              style={{
                color: '#667eea',
                fontSize: '0.875rem',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#5a67d8',
                }
              }}
            >
              Forgot Password?
            </Link>
          </Box>
          <LoginButton type="submit" disabled={loading.email}>
            {loading.email ? <CircularProgress size={24} color="inherit" /> : "Log In"}
          </LoginButton>
        </Box>

        <SocialDivider>
          <Typography variant="body2">Or log in with</Typography>
        </SocialDivider>

        <Stack direction="row" spacing={1}>
          <GoogleSignInButton
            variant="contained"
            onClick={handleGoogleSignIn}
            disabled={loading.google}
            startIcon={<GoogleIcon />}
          >
            {loading.google ? <CircularProgress size={24} color="inherit" /> : "Google"}
          </GoogleSignInButton>
          <LinkedInSignInButton
            variant="outlined"
            onClick={handleLinkedInLogin}
            disabled={loading.linkedin}
            startIcon={<LinkedInIcon />}
            sx={{
              flex: 1,
              py: 1.5,
              borderColor: "#0077B5",
              color: "#0077B5",
              "&:hover": { borderColor: "#006097" },
            }}
          >
            {loading.linkedin ? <CircularProgress size={24} /> : "LinkedIn"}
          </LinkedInSignInButton>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertCircleIcon className="mr-2 h-4 w-4" />
            {error}
          </Alert>
        )}

        <SignupLink onClick={navigateToRegister}>
          Don't have an account? Sign Up
        </SignupLink>
      </LoginFormContainer>
    </LoginContainer>
  );
};

export default LoginPage;