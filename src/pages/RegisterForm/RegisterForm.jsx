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
import { CookieSharp, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth.jsx";


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



// Styled components (keep the same as original)

const RegisterForm = () => {
  const {
    signupWithEmail,
    authenticateWithGoogle,
    authenticateWithLinkedIn,
    loading: authLoading,
    error: authError,
    user,
    logout,
  } = useAuth();

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

  const navigateAsRole = (role) => {
    if (!role) {
      console.error("No role provided for navigation");
      setError("Unable to determine user role");
      return;
    }

    switch (role.toLowerCase()) {
      case "job_seeker":
        navigate("/dashboard");
        break;
      case "employer":
        navigate("/employer-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      default:
        console.error("Unknown role:", role);
        navigate("/");
    }
  };

  const handleNormalSignup = async (e) => {
    e.preventDefault();
    setLoading({ normal: true, google: false, linkedin: false });
    setError("");

    // Validation
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
      const result = await signupWithEmail(
        formData.email,
        formData.password, 
        formData.fullName,
        formData.role
      );

      if (result?.error) {
        setError(result.message || "Registration failed");
      } else {
        const userRole = result?.user?.role || result?.role;
        if (userRole) {
          navigateAsRole(userRole);
        } else {
          setError("Registration successful but unable to determine user role");
        }
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading({ normal: false, google: false, linkedin: false });
    }
  };

  const handleGoogleSignUp = async (role) => {
    if (!role) {
      setError("Please select a role");
      return;
    }
    
    setLoading({ normal: false, google: true, linkedin: false });
    setError("");

    try {
      const result = await authenticateWithGoogle(role);
      
      if (result.error) {
        setError(result.message || "Google signup failed");
      } else {
        const userRole = result?.user?.role || result?.role;
        if (userRole) {
          navigateAsRole(userRole);
        } else {
          setError("Google signup successful but unable to determine user role");
        }
      }
    } catch (err) {
      setError(err.message || "Google signup failed");
    } finally {
      setLoading({ normal: false, google: false, linkedin: false });
    }
  };

  const handleLinkedInSignUp = async (role) => {
    if (!role) {
      setError("Please select a role");
      return;
    }
    
    setLoading({ normal: false, google: false, linkedin: true });
    setError("");
    
    try {
      const result = await authenticateWithLinkedIn(role);
      
      if (result.error) {
        setError(result.message || "LinkedIn signup failed");
      } else {
        const userRole = result?.user?.role || result?.role;
        if (userRole) {
          navigateAsRole(userRole);
        } else {
          setError("LinkedIn signup successful but unable to determine user role");
        }
      }
    } catch (err) {
      setError(err.message || "LinkedIn signup failed");
    } finally {
      setLoading({ normal: false, google: false, linkedin: false });
    }
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <RegisterContainer>
      <RegisterFormContainer>
        <RegisterFormTitle variant="h5">Create Your Account</RegisterFormTitle>
        <RegisterFormSubtitle>Join our platform to find your perfect job match</RegisterFormSubtitle>

        <Box component="form" onSubmit={handleNormalSignup}>
          {/* Form fields remain the same */}
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

          <RegisterButton type="submit" disabled={loading.normal || authLoading}>
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
              disabled={loading.google || authLoading}
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
              disabled={loading.linkedin || authLoading}
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
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2,
              display: 'flex',
              alignItems: 'center' 
            }}
            onClose={() => setError("")}
          >
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