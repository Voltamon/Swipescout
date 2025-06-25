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
  backgroundColor: theme.palette.background.default,
}));

const LoginFormContainer = styled(Paper)(({ theme }) => ({
  width: 400,
  padding: theme.spacing(3),
  boxShadow: '0 0 15px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  backgroundColor: '#f9f9f9',
  [theme.breakpoints.down('sm')]: {
    width: '90%',
  },
}));

const LoginFormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.25),
}));

const LoginFormSubtitle = styled(Typography)(({ theme }) => ({
  color: '#888',
  marginBottom: theme.spacing(2.5),
}));

const InputField = styled(TextField)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1, 0),
  borderRadius: '5px',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : theme.palette.grey[700],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& input': {
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.grey[900],
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  backgroundColor: '#5c6bc0',
  color: 'white',
  border: 'none',
  borderRadius: '25px',
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const SocialDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  '& .MuiDivider-wrapper': {
    color: '#888',
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  flexGrow: 1,
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1.25),
  border: 'none',
  borderRadius: '20px',
  cursor: 'pointer',
}));

const GoogleSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#DB4437',
  border: `1px solid #DB4437`,
  '&:hover': {
    backgroundColor: '#fbe3e1',
  },
  '&:active': {
    backgroundColor: 'rgb(235, 216, 164) !important',
  },
  '&.Mui-focusVisible': {
    outline: '2px solid #1976d2',
    backgroundColor: 'rgb(235, 216, 164) !important',
  },
}));

const LinkedInSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: 'rgb(255, 255, 255)',
  color: 'white',
  outline: '2px solid #1976d2',
  '&:hover': {
    backgroundColor: 'rgb(183, 215, 248)',
  },
}));

const SignupLink = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(2.5),
  color: '#888',
  cursor: 'pointer',
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
      navigate(from, { replace: true });
    }
  }, [user, role, authLoading, navigate, location.state]);

  const getDefaultRoute = (role) => {
    switch (role) {
      case 'job_seeker': return '/dashboard';
      case 'employer': return '/employer-dashboard';
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
          <Link to="/forgot-password">Forgot Password?</Link>
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