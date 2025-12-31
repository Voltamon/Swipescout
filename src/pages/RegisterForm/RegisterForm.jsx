import i18n from 'i18next';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Grid, // Added Grid import
  Card, // Added Card import
  CardContent, // Added CardContent import
} from "@mui/material";
import {
  User as UserIcon,
  Briefcase as BriefcaseIcon,
  Mail as MailIcon,
  Linkedin as LinkedinIcon,
  Loader2 as LoaderIcon,
  AlertCircle as AlertCircleIcon,
} from "lucide-react";
import {
  CookieSharp,
  Visibility,
  VisibilityOff,
  VideoCall, // Added VideoCall icon import
  People, // Added People icon import
  TrendingUp, // Added TrendingUp icon import
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth.jsx";


// Styled components
const RegisterContainer = styled(Box)(({ theme }) => ({
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

const RegisterFormContainer = styled(Paper)(({ theme }) => ({
  width: 450,
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

const RegisterFormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 700,
  fontSize: '2rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
}));

const RegisterFormSubtitle = styled(Typography)(({ theme }) => ({
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

const RegisterButton = styled(Button)(({ theme }) => ({
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

const GoogleSignUpButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#db4437',
  border: '2px solid #db4437',
  '&:hover': {
    backgroundColor: '#fef2f2',
    borderColor: '#dc2626',
    boxShadow: '0 4px 12px rgba(219, 68, 55, 0.2)',
  },
}));

const LinkedInSignUpButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#0077b5',
  color: 'white',
  border: '2px solid #0077b5',
  '&:hover': {
    backgroundColor: '#005885',
    borderColor: '#005885',
    boxShadow: '0 4px 12px rgba(0, 119, 181, 0.3)',
  },
}));

const LoginLink = styled(Typography)(({ theme }) => ({
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
  const [providerForMenu, setProviderForMenu] = useState(null);
  const [openHowItWorks, setOpenHowItWorks] = useState(false); // State for How It Works dialog
  const [howItWorksAccepted, setHowItWorksAccepted] = useState(false); // State for checkbox
  const navigate = useNavigate();

  // Menu handlers
  const handleMenuOpen = (event, provider) => {
    setAnchorEl(event.currentTarget);
    setProviderForMenu(provider);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setProviderForMenu(null);
    setCurrentProvider(null);
  };

  // Accept provider as argument
  const handleRoleSelect = (role, provider) => {
    handleMenuClose();
    setFormData((prev) => ({ ...prev, role }));
    setCurrentProvider(provider); // Set provider here
    setOpenHowItWorks(true);
  };

  const handleHowItWorksClose = () => {
    setOpenHowItWorks(false);
    setHowItWorksAccepted(false); // Reset checkbox on close
    setFormData((prev) => ({ ...prev, role: "" })); // Clear role if not accepted
  };

  const handleHowItWorksConfirm = () => {
    setOpenHowItWorks(false);
    // Proceed with signup after confirmation
    if (currentProvider === 'google') {
      handleGoogleSignUp(formData.role);
    } else if (currentProvider === 'linkedin') {
      handleLinkedInSignUp(formData.role);
    } else {
      handleNormalSignup(); // For email/password signup
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
        navigate("/jobseeker-tabs");
        break;
      case "employer":
        navigate("/employer-tabs");
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
    // Only prevent default if event object exists
    if (e) e.preventDefault();

    setLoading({ normal: true, google: false, linkedin: false });
    setError("");

    // Validation
    if (!formData.role) {
      setError("Please select a role (Job Seeker or Employer)");
      setLoading({ normal: false, google: false, linkedin: false });
      return;
    }
    if (formData.password.length < 2) {
      setError("Password must be at least 6 characters long");
      setLoading({ normal: false, google: false, linkedin: false });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading({ normal: false, google: false, linkedin: false });
      return;
    }
    // No longer check howItWorksAccepted here, as the dialog handles it
    // if (!howItWorksAccepted) {
    //   setOpenHowItWorks(true); // Open dialog if not accepted
    //   setLoading({ normal: false, google: false, linkedin: false });
    //   return;
    // }

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
    // No longer check howItWorksAccepted here, as the dialog handles it
    // if (!howItWorksAccepted) {
    //   setOpenHowItWorks(true);
    //   return;
    // }

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
    // No longer check howItWorksAccepted here, as the dialog handles it
    // if (!howItWorksAccepted) {
    //   setOpenHowItWorks(true);
    //   return;
    // }

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
        <RegisterFormTitle variant="h5">{i18n.t('auto_create_your_account')}</RegisterFormTitle>
        <RegisterFormSubtitle>{i18n.t('auto_join_our_platform_to_find_your_perfect_j')}</RegisterFormSubtitle>

        <Box component="form" onSubmit={(e) => {
          e.preventDefault();
          setCurrentProvider('email'); // Set provider for email signup
          setOpenHowItWorks(true); // Always open dialog before normal signup attempt
        }}>
          {/* Form fields remain the same */}
          <InputField
            label={i18n.t('auto_full_name')} 
            type="text"
            name="fullName"
            placeholder={i18n.t('auto_enter_your_full_name')} 
            value={formData.fullName}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <InputField
            label={i18n.t('auto_email_address')} 
            type="email"
            name="email"
            placeholder={i18n.t('auto_enter_your_email_address')} 
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <InputField
            label={i18n.t('auto_password')} 
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={i18n.t('auto_create_a_password')} 
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
            label={i18n.t('auto_confirm_password')} 
            type="password"
            name="confirmPassword"
            placeholder={i18n.t('auto_confirm_your_password')} 
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <Typography variant="body2" sx={{ 
            mt: 2, 
            mb: 2, 
            fontWeight: 600, 
            color: '#374151',
            textAlign: 'center'
          }}>{i18n.t('auto_select_your_role')}</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant={formData.role === "job_seeker" ? "contained" : "outlined"}
              fullWidth
              onClick={() => handleRoleChange("job_seeker")}
              startIcon={<UserIcon />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                transition: 'all 0.3s ease',
                ...(formData.role === "job_seeker" ? {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                  }
                } : {
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#667eea',
                    color: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  }
                })
              }}
            >{i18n.t('auto_job_seeker')}</Button>
            <Button
              variant={formData.role === "employer" ? "contained" : "outlined"}
              fullWidth
              onClick={() => handleRoleChange("employer")}
              startIcon={<BriefcaseIcon />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                transition: 'all 0.3s ease',
                ...(formData.role === "employer" ? {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                  }
                } : {
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#667eea',
                    color: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  }
                })
              }}
            >{i18n.t('auto_employer')}</Button>
          </Stack>

          {/* The main RegisterButton is now only disabled by loading states */}
          <RegisterButton type="submit" disabled={loading.normal || authLoading}>
            {loading.normal ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />{i18n.t('auto_signing_up')}</>
            ) : (
              "Sign Up"
            )}
          </RegisterButton>
        </Box>

        <SocialDivider>
          <Typography variant="body2">{i18n.t('auto_or_sign_up_with')}</Typography>
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
          <MenuItem onClick={() => handleRoleSelect('job_seeker', providerForMenu)}>
            <UserIcon className="mr-2 h-4 w-4" />{i18n.t('auto_sign_up_as_job_seeker')}</MenuItem>
          <MenuItem onClick={() => handleRoleSelect('employer', providerForMenu)}>
            <BriefcaseIcon className="mr-2 h-4 w-4" />{i18n.t('auto_sign_up_as_employer')}</MenuItem>
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

        <LoginLink onClick={() => navigate("/login")}>{i18n.t('auto_already_have_an_account_log_in')}</LoginLink>
      </RegisterFormContainer>

      {/* How SwipeScout Works Dialog */}
      <Dialog
        open={openHowItWorks}
        onClose={handleHowItWorksClose}
        aria-labelledby="how-it-works-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="how-it-works-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold' }}>{i18n.t('auto_how_swipescout_works')}</DialogTitle>
        <DialogContent dividers>
         
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                icon: <VideoCall sx={{ fontSize: 40, color: "#3b82f6" }} />,
                title: "1. Create Your Video Profile",
                description:
                  "Job seekers record a short video resume. Employers create video job postings or company profiles.",
                bgColor: "rgba(59, 130, 246, 0.1)",
              },
              {
                icon: <People sx={{ fontSize: 40, color: "#06b6d4" }} />,
                title: "2. Discover & Connect",
                description:
                  "Swipe through video profiles or use our smart matching to find perfect candidates or opportunities.",
                bgColor: "rgba(6, 182, 212, 0.1)",
              },
              {
                icon: <TrendingUp sx={{ fontSize: 40, color: "#67e8f9" }} />,
                title: "3. Grow Your Career",
                description:
                  "Build meaningful connections that lead to interviews, hires, and career growth.",
                bgColor: "rgba(103, 232, 249, 0.1)",
              },
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: 'none' }}>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      p: 3,
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
                        mx: "auto",
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
                        color: "#1f2937",
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#4b5563",
                          textAlign: "center",
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={howItWorksAccepted}
                  onChange={(e) => setHowItWorksAccepted(e.target.checked)}
                  color="primary"
                />
              }
              label={i18n.t('auto_i_have_read_and_understood_how_swipescou')} 
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            {/* Only one checkbox, or if you want two, both controlled by same state */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={howItWorksAccepted}
                  onChange={(e) => setHowItWorksAccepted(e.target.checked)}
                  color="primary"
                />
              }
              label={i18n.t('auto_i_have_read_and_understood_how_swipescou')} 
            />
            {/* If you want a second checkbox, just duplicate this block, but use the same state */}
            {/* 
            <FormControlLabel
              control={
                <Checkbox
                  checked={howItWorksAccepted}
                  onChange={(e) => setHowItWorksAccepted(e.target.checked)}
                  color="primary"
                />
              }
              label={i18n.t('auto_i_have_read_and_understood_how_swipescou')} 
            />
            */}
          </Box>
          <Button
            onClick={handleHowItWorksConfirm}
            disabled={!howItWorksAccepted}
            variant="contained"
            sx={{
              bgcolor: "#3b82f6",
              color: "#ffffff",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              "&:hover": {
                bgcolor: "#2563eb",
              },
            }}
          >{i18n.t('auto_proceed_to_sign_up')}</Button>
        </DialogActions>
      </Dialog>
    </RegisterContainer>
  );
};RegisterForm;

export default RegisterForm;
