import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
  useTheme
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { AlertCircle as AlertCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./hero.css";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';


const Hero = () => {
  const theme = useTheme();
  const { loginByEmailAndPassword, authenticateWithGoogle, authenticateWithLinkedIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState({
    email: false,
    google: false,
    linkedin: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, email: true });
    setError("");

    try {
      const result = await loginByEmailAndPassword(formData.email, formData.password);
      
      if (result.error) {
        setError(result.message);
      } else {
        // Success - user will be redirected by the auth system
        console.log("Login successful");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading({ ...loading, google: true });
    setError("");

    try {
      const result = await authenticateWithGoogle();
      
      if (result.error) {
        setError(result.message);
      }
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading({ ...loading, google: false });
    }
  };

  const handleLinkedInLogin = async () => {
    setLoading({ ...loading, linkedin: true });
    setError("");

    try {
      const result = await authenticateWithLinkedIn();
      
      if (result.error) {
        setError(result.message);
      }
    } catch (err) {
      setError("LinkedIn sign-in failed. Please try again.");
    } finally {
      setLoading({ ...loading, linkedin: false });
    }
  };

  return (
    <Box className="hero-section">
      <Container maxWidth="lg" className="hero-container">
        <Grid container spacing={0} className="hero-grid">
          <Grid item xs={12} md={6} className="hero-content-left">
            <Chip 
              className="hero-chip"
              label="ًںڑ€ AI-Powered Recruitment Platform"
            />
            <Typography
              variant="h1"
              className="hero-title"
            >
              The Future of
              <Box component="span" className="hero-title-gradient">
                Video Recruitment
              </Box>
            </Typography>
            <Typography
              variant="h5"
              className="hero-subtitle"
            >
              Connect talent with opportunities through AI-powered video matching. 
              Experience recruitment that's personal, efficient, and revolutionary.
            </Typography>
            <Box className="hero-buttons-container">
              <Link
                to="/register-form"
                className="hero-button-primary"
              >
                Get Started
              </Link>
              <Link
                to="/videos/all"
                className="hero-button-secondary"
              >
                Explore
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} className="hero-content-right">
            {/* Login Form */}
            <Box className="hero-login-form">
              <Typography
                variant="h5"
                component="h4"
                className="hero-login-title"
              >
                Log in to your account
              </Typography>
              <Box component="form" onSubmit={handleEmailSignIn} className="hero-login-form-container">
                <TextField
                  label="Enter your email address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  className="hero-input-field"
                />
                <TextField
                  label="Enter your password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  className="hero-input-field"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? (
                            <VisibilityOff className="hero-visibility-icon" />
                          ) : (
                            <Visibility className="hero-visibility-icon" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Link
                  to="/forgot-password"
                  className="hero-forgot-password"
                >
                  Forgot Password?
                </Link>
                <Button 
                  type="submit" 
                  disabled={loading.email}
                  className="hero-login-button"
                >
                  {loading.email ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Log In"
                  )}
                </Button>
              </Box>
              <Box className="hero-social-divider">
                <Typography variant="body2" className="hero-social-divider-text">
                  Or log in with
                </Typography>
              </Box>
              <Box className="hero-social-buttons">
                <Button
                  variant="contained"
                  onClick={handleGoogleSignIn}
                  disabled={loading.google}
                  startIcon={<GoogleIcon />}
                  className="hero-google-button"
                >
                  {loading.google ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Google"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleLinkedInLogin}
                  disabled={loading.linkedin}
                  startIcon={<LinkedInIcon />}
                  className="hero-linkedin-button"
                >
                  {loading.linkedin ? (
                    <CircularProgress size={24} />
                  ) : (
                    "LinkedIn"
                  )}
                </Button>
              </Box>
              {error && (
                <Box className="hero-error-alert">
                  <AlertCircleIcon className="hero-error-icon" />
                  {error}
                </Box>
              )}
              <Typography
                variant="body2"
                className="hero-signup-text"
              >
                Don't have an account?{" "}
                <Link
                  to="/register-form"
                  className="hero-signup-link"
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
