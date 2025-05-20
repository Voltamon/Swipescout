
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
  Menu,
  MenuItem,
} from "@mui/material";
import {
  User as UserIcon,
  Briefcase as BriefcaseIcon,
  Mail as MailIcon,
  Linkedin as LinkedinIcon,
  Loader2 as LoaderIcon,
  AlertCircle as AlertCircleIcon,
} from "lucide-react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase-config.js";
import { useAuth } from "../../hooks/useAuth.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
;



// Styled components
const RegisterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

const RegisterFormContainer = styled(Paper)(({ theme }) => ({
  width: 400,
  padding: theme.spacing(3),
  boxShadow: '0 0 15px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  backgroundColor: '#f9f9f9',
  [theme.breakpoints.down('sm')]: {
    width: '90%',
  },
}));

const RegisterFormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.25),
}));

const RegisterFormSubtitle = styled(Typography)(({ theme }) => ({
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

// LinkedIn configuration
const LINKEDIN_CLIENT_ID = '{import.meta.env.VITE_LINKEDIN_CLIENT_ID}';
const LINKEDIN_REDIRECT_URI = encodeURIComponent(`${API_BASE_URL}/dashboard`);
const LINKEDIN_SCOPE = encodeURIComponent('openid profile email');
const LINKEDIN_STATE = 'random_state_string'; // Should be random and validated on callback

const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${LINKEDIN_REDIRECT_URI}&scope=${LINKEDIN_SCOPE}&state=${LINKEDIN_STATE}`;

const RegisterButton = styled(Button)(({ theme }) => ({
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

const GoogleSignUpButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#DB4437',
  border: `1px solid #DB4437`,
  '&:hover': {
    backgroundColor: '#fbe3e1',
  },
}));

const LinkedInSignUpButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#0077b5',
  color: 'white',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
}));

const LoginLink = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(2.5),
  color: '#888',
  cursor: 'pointer',
}));

const RegisterForm = () => {

  const { loginByEmailAndPassword } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState({
    normal: false,
    google: false,
    linkedin: false,
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentProvider, setCurrentProvider] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth(app);

  // Menu handlers
  const handleMenuOpen = (event, provider) => {
    setAnchorEl(event.currentTarget);
    setCurrentProvider(provider);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentProvider(null);
  };

  const handleRoleSelect = (role) => {
    handleMenuClose();
    if (currentProvider === 'google') {
      handleGoogleSignUp(role);
    } else if (currentProvider === 'linkedin') {
      handleLinkedInSignUp(role);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role === role ? "" : role,
    }));
  };

  const handleNormalSignup = async (e) => {
    e.preventDefault();
    setLoading({ normal: true, google: false, linkedin: false });
    setError("");

    if (!formData.role) {
      setError("Please select a role (Job Seeker or Employer)");
      setLoading({ normal: false, google: false, linkedin: false });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading({ normal: false, google: false, linkedin: false });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          displayName: formData.fullName,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up");
      }

      navigate("/LoginForm");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ normal: false, google: false, linkedin: false });
    }
  };

  const handleGoogleSignUp = async (role) => {
    if (!role) return;
    
    setLoading({ normal: false, google: true, linkedin: false });
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${API_BASE_URL}/api/auth/signup/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: role,
          idToken: idToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Google sign-up failed");
      }
      navigate("/LoginForm");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ normal: false, google: false, linkedin: false });
    }
  };

  const handleLinkedInSignUp = (role) => {
    if (!role) return;
    
    // Store the selected role in session storage to use after LinkedIn redirect
    sessionStorage.setItem('linkedin_signup_role', role);
    
    // Redirect to LinkedIn auth page in the same window (not popup)
    window.location.href = linkedInAuthUrl;
  };

  useEffect(() => {
    // Handle LinkedIn callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      setError(`LinkedIn authentication failed: ${error}`);
      return;
    }

    if (code && state === LINKEDIN_STATE) {
      const role = sessionStorage.getItem('linkedin_signup_role');
      sessionStorage.removeItem('linkedin_signup_role');
      
      setLoading({ normal: false, google: false, linkedin: true });
      
      // Send the code to your backend to exchange for access token
      fetch(`${API_BASE_URL}/api/auth/signup/linkedin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          redirectUri: `${API_BASE_URL}/api/linkedin-callback',
          role,
        }),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
      })
      .then(data => {
        navigate("/LoginForm");
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading({ normal: false, google: false, linkedin: false });
      });
    }
  }, [navigate]);

  return (
    <RegisterContainer>
      <RegisterFormContainer>
        <RegisterFormTitle variant="h5">Create Your Account</RegisterFormTitle>
        <RegisterFormSubtitle>Join our platform to find your perfect job match</RegisterFormSubtitle>

        <Box component="form" onSubmit={handleNormalSignup}>
          <InputField
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <InputField
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create a password"
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

          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Select your role</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant={formData.role === "job_seeker" ? "contained" : "outlined"}
              fullWidth
              onClick={() => handleRoleChange("job_seeker")}
              startIcon={<UserIcon />}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
              }}
            >
              Job Seeker
            </Button>
            <Button
              variant={formData.role === "employer" ? "contained" : "outlined"}
              fullWidth
              onClick={() => handleRoleChange("employer")}
              startIcon={<BriefcaseIcon />}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
              }}
            >
              Employer
            </Button>
          </Stack>

          <RegisterButton type="submit" disabled={loading.normal}>
            {loading.normal ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </RegisterButton>
        </Box>

        <SocialDivider>
          <Typography variant="body2">Or sign up with</Typography>
        </SocialDivider>

        <Stack direction="row" spacing={2} justifyContent="center">
          {/* Google Sign Up Button with Menu */}
          <Box>
            <GoogleSignUpButton
              onClick={(e) => handleMenuOpen(e, 'google')}
              disabled={loading.google}
              startIcon={<MailIcon />}
            >
              {loading.google ? (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Google"
              )}
            </GoogleSignUpButton>
          </Box>

          {/* LinkedIn Sign Up Button with Menu */}
          <Box>
            <LinkedInSignUpButton
              onClick={(e) => handleMenuOpen(e, 'linkedin')}
              disabled={loading.linkedin}
              startIcon={<LinkedinIcon />}
            >
              {loading.linkedin ? (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "LinkedIn"
              )}
            </LinkedInSignUpButton>
          </Box>
        </Stack>

        {/* Role Selection Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleRoleSelect('job_seeker')}>
            <UserIcon className="mr-2 h-4 w-4" />
            Sign up as Job Seeker
          </MenuItem>
          <MenuItem onClick={() => handleRoleSelect('employer')}>
            <BriefcaseIcon className="mr-2 h-4 w-4" />
            Sign up as Employer
          </MenuItem>
        </Menu>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertCircleIcon className="mr-2 h-4 w-4" />
            {error}
          </Alert>
        )}

        <LoginLink onClick={() => navigate("/login")}>
          Already have an account? Log in
        </LoginLink>
      </RegisterFormContainer>
    </RegisterContainer>
  );
};

export default RegisterForm;