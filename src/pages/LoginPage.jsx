import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
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
import { LinkedIn } from "react-linkedin-login-oauth2";
import {
  AlertCircle as AlertCircleIcon,
} from "lucide-react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase-config.js";

import { useAuth } from "../hooks/useAuth.jsx";


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
  color: '#DB4437', // Google red
  border: `1px solid #DB4437`,
  '&:hover': {
    backgroundColor: '#fbe3e1',
  },
  '&:active': { // Style for the active (pressed) state
    backgroundColor: 'rgb(235, 216, 164) !important', // Keep the hover color or use another light red
  },
  '&.Mui-focusVisible': {
    outline: '2px solid #1976d2',
    backgroundColor: 'rgb(235, 216, 164) !important',
  },
  '&:visited': {
    color: 'rgb(235, 230, 164) !important', /* Visited color for this specific link */
  },
}));

const LinkedInSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: 'rgb(255, 255, 255)', // LinkedIn blue
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
  cursor: 'pointer', // Added cursor for better UX with navigate
}));



// LinkedIn configuration
const LINKEDIN_CLIENT_ID = '{import.meta.env.VITE_LINKEDIN_CLIENT_ID}';
const LINKEDIN_REDIRECT_URI = encodeURIComponent('{import.meta.env.VITE_LINKEDIN_REDIRECT_URI}');
const LINKEDIN_SCOPE = encodeURIComponent('openid profile email');
const LINKEDIN_STATE = 'random_state_string';

const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${LINKEDIN_REDIRECT_URI}&scope=${LINKEDIN_SCOPE}&state=${LINKEDIN_STATE}`;

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${apiUrl}`;



const LoginPage = () => {

  const { loginByEmailAndPassword,
    authenticateWithGoogle,
    authenticateWithLinkedIn, user, role} = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState({
    email: false,
    google: false,
    linkedin: false,
  });
  const [error, setError] = useState("");
  const isMounted = useRef(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

const location = useLocation();

//  const navigateAsRole = (role, fallbackPath, replace = true) => {
//     // Validate role exists
//     if (!role) {
//       console.warn('No role provided, redirecting to fallback/default');
//       return navigate(fallbackPath || '/', { replace });
//     }

//     const targetPath = fallbackPath || getDefaultRoute(role);

//     // Validate the path exists (optional)
//     if (!targetPath) {
//       console.error('Invalid navigation target:', { role, fallbackPath });
//       return navigate('/', { replace });
//     }

//     navigate(targetPath, { replace });
//   };

    const getDefaultRoute = (role) => {
    switch (role) {
      case 'job_seeker': return '/dashboard';
      case 'employer': return '/employer-dashboard';
      case 'admin': return '/admin-dashboard';
      default: return '/';
    }
  };
const from = location.state?.from?.pathname || getDefaultRoute(role);
useEffect(() => {
  if (user && role) {
    const shouldReplace = location.state?.from?.pathname === '/login';
    navigateAsRole(role, from, shouldReplace);
  }
}, [user, role, navigate, from, location.state]);



   // Handle post-login navigation
  // useEffect(() => {
  //   if (user && role) {
  //     // Only replace history if coming from auth redirect
  //     const shouldReplace = location.state?.from?.pathname === '/login';
  //     navigateAsRole(role, from, shouldReplace);
  //   }
  // }, [user, role, navigate, from, location.state]);



  const auth = getAuth(app);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navigateAsRole = (role) => {
    if (role === "job_seeker") {
      navigate("/dashboard", { replace: true });
    }
    else if (role === "employer") {
      navigate("/employer-dashboard", { replace: true });
    }
    else if (role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    }
  };


  const handleGoogleSignIn = async () => {
    const result = await authenticateWithGoogle();

    if (result.error) {
      setError(result.message || "Google sign-in failed");
    } else {
      console.log("Google sign-in successful:", result.role);
      navigateAsRole(result.role, getDefaultRoute(result.role),true);
    }
  };



  const handleEmailSignIn = async e => {
    e.preventDefault();
    setLoading({ ...loading, email: true });
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading({ ...loading, email: false });
      return;
    }
    console.log("Form data:", formData);
    const result = await loginByEmailAndPassword(formData.email, formData.password);

    if (result.error) {
      setError(result.message || "Login failed. Please try again.");
    } else {
      console.log("routttte:",getDefaultRoute(result.role));
      navigateAsRole(result.role);//, getDefaultRoute(result.role),true
    }

    setLoading({ ...loading, email: false });
  };



  // In your login page component


  // Handle LinkedIn redirect login
  const handleLinkedInLogin = async () => {

    setLoading({ ...loading, linkedin: true });


    const result = await authenticateWithLinkedIn();


    if (result.error) {
      setError(result.message);
      if (isMounted.current) {
        console.log("Setting error state to:", result.message);
        setError(result.message || "error");
      }

      console.error("LinkedIn login errorrrrrfdgdsfr:", result.message);
      setLoading({ ...loading, linkedin: false });
    } else {
      console.log("LinkedIn login successful:", result);
      navigateAsRole(result.role, getDefaultRoute(result.role),true);
      console.log("LinkedIn login successful:", result);
    }
    setLoading({ ...loading, linkedin: false });

  };
  // Handle LinkedIn callback



  // useEffect(() => {
  //   const handleAuthSuccess = event => {
  //     if (event.origin !== window.location.origin) return;
  //     if (event.data.type === "LINKEDIN_AUTH_SUCCESS") {
  //       navigate("/dashboard");
  //     }
  //   };
  //   window.addEventListener("message", handleAuthSuccess);
  //   return () => window.removeEventListener("message", handleAuthSuccess);
  // }, []);

  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get('code');
  //   const state = urlParams.get('state');
  //   const error = urlParams.get('error');

  //   if (error) {
  //     setError(`LinkedIn authentication failed: ${error}`);
  //     return;
  //   }

  //   if (code && state === LINKEDIN_STATE) {
  //     setLoading({ ...loading, linkedin: true });

  //     fetch(`${API_BASE_URL}/api/auth/signin/linkedin`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         code,
  //         redirectUri: 'http://localhost:5173/dashboard',
  //       }),
  //     })
  //     .then(response => {
  //       if (!response.ok) {
  //         return response.json().then(err => { throw new Error(err.message); });
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       const redirectPath = sessionStorage.getItem('linkedin_login_redirect') || '/dashboard';
  //       sessionStorage.removeItem('linkedin_login_redirect');
  //       navigate(redirectPath);
  //     })
  //     .catch(err => {
  //       setError(err.message);
  //     })
  //     .finally(() => {
  //       setLoading({ ...loading, linkedin: false });
  //     });
  //   }
  // }, [navigate]);

  const navigateToRegister = () => {
    navigate("/register-form");
  };

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
