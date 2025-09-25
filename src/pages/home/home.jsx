import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { AlertCircle as AlertCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ContactUs from './contact us/contactus';
import './home.css';
import TermsOfService from './terms of service/terms';
import PrivacyPolicy from './privacy policy/privacy';
import CookiePolicy from './cookie policy/cookie';

const Home = () => {
  const { loginByEmailAndPassword, registerByEmailAndPassword, authenticateWithGoogle, authenticateWithLinkedIn } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showCookie, setShowCookie] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "" // "employee" or "recruiter"
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState({
    email: false,
    google: false,
    linkedin: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    let buffer = '';
    const termsPhrase = 'terms of service';
    const privacyPhrase = 'privacy policy';

    const onKeyDown = (e) => {
      const key = e.key;
      if (key.length === 1) {
        buffer += key.toLowerCase();
        const maxLen = Math.max(termsPhrase.length, privacyPhrase.length);
        if (buffer.length > maxLen) {
          buffer = buffer.slice(buffer.length - maxLen);
        }
        if (buffer.includes(termsPhrase)) {
          setShowTerms(true);
          buffer = '';
        } else if (buffer.includes(privacyPhrase)) {
          setShowPrivacy(true);
          buffer = '';
        }
      } else if (key === 'Escape') {
        setShowTerms(false);
        setShowPrivacy(false);
        buffer = '';
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: ""
    });
  };

  const handleOpenAuthDialog = (tabIndex = 0) => {
    setActiveTab(tabIndex);
    setShowAuthDialog(true);
    setError("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: ""
    });
  };

  const handleCloseAuthDialog = () => {
    setShowAuthDialog(false);
    setError("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: ""
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role: role,
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
        console.log("Login successful");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, email: true });
    setError("");

    if (!formData.role) {
      setError("Please select your role (Employee or Recruiter)");
      setLoading({ ...loading, email: false });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading({ ...loading, email: false });
      return;
    }

    try {
      const result = await registerByEmailAndPassword(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName,
        formData.role
      );
      
      if (result.error) {
        setError(result.message);
      } else {
        console.log("Registration successful");
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
    <Box className="home-wrapper">
      {/* SwipeScout Header */}
      <div className="home-header">
        <div className="home-logo-container">
          <img src="/swipescout.svg" alt="SwipeScout Logo" className="home-logo" />
          <span className="home-brand-text">SwipeScout</span>
        </div>
      </div>
      
      <Box className="home-container">
        <Container maxWidth="lg" className="home-content">
          <Box className="home-hero-section">
            <h1 className="home-title">
              Where <span className="home-title-highlight">TikTok</span> Meets <span className="home-title-highlight">LinkedIn</span>
            </h1>
            <h3 className="home-subtitle">
              Welcome to the <span className="home-subtitle-highlight">Future</span> Recruiting Agency
            </h3>
            <h5 className="home-description">
              Join us and find your dream job
            </h5>
          </Box>
        </Container>
      </Box>
      
      {/* Feature Statements */}
      <div className="home-feature-statements">
        <div className="home-feature-item">
          <svg className="home-feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
          </svg>
          <h3 className="home-feature-statement home-feature-statement-primary">
          Video resumes made fast, hiring made smarter.
          </h3>
        </div>
        <div className="home-feature-item">
          <svg className="home-feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h3 className="home-feature-statement home-feature-statement-secondary">
            Show your skills in 15 seconds
          </h3>
        </div>
        <div className="home-feature-item">
          <svg className="home-feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h3 className="home-feature-statement home-feature-statement-highlight">
            Employers are already swiping
          </h3>
        </div>
      </div>
      
      {/* Action Buttons - Outside the home container */}
      <div className="home-action-buttons">
        <button
          onClick={() => handleOpenAuthDialog(0)}
          className="home-login-button"
        >
          Login
        </button>
        <button
          onClick={() => handleOpenAuthDialog(1)}
          className="home-signup-button"
        >
          Sign Up
        </button>
      </div>

      {/* Authentication Dialog */}
      {showAuthDialog && (
        <div className="home-auth-dialog-overlay" onClick={handleCloseAuthDialog}>
          <div className="home-auth-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="home-auth-dialog-content">
          <div className="home-auth-card">
            <div className="home-auth-card-content">
              <div className="home-auth-tabs">
                <button 
                  className={`home-tab ${activeTab === 0 ? 'active' : ''}`}
                  onClick={() => handleTabChange(null, 0)}
                >
                  Login
                </button>
                <button 
                  className={`home-tab ${activeTab === 1 ? 'active' : ''}`}
                  onClick={() => handleTabChange(null, 1)}
                >
                  Sign Up
                </button>
              </div>
              
              <Box className="home-auth-form-container">
                {activeTab === 0 ? (
                  // Login Form
                  <Box component="form" onSubmit={handleEmailSignIn} className="home-auth-form">
                    <TextField
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      fullWidth
                      className="home-input-field"
                      sx={{
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                    <TextField
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      fullWidth
                      className="home-input-field"
                      sx={{
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
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
                    <Box sx={{ textAlign: 'right', mt: 1 }}>
                      <Link 
                        to="/forgot-password" 
                        style={{
                          color: '#667eea',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </Box>
                    <Button 
                      type="submit" 
                      disabled={loading.email}
                      variant="contained"
                      fullWidth
                      className="home-auth-button"
                      sx={{
                        mt: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading.email ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Log In"
                      )}
                    </Button>
                  </Box>
                ) : (
                  // Sign Up Form
                  <Box component="form" onSubmit={handleEmailSignUp} className="home-auth-form">
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        className="home-input-field home-name-field"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#667eea',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#667eea',
                            },
                          },
                        }}
                      />
                      <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        className="home-input-field home-name-field"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#667eea',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#667eea',
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Role Selection */}
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#374151',
                          fontWeight: 600,
                          mb: 1.5,
                          fontSize: '0.9rem'
                        }}
                      >
                        I am signing up as:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant={formData.role === 'employee' ? 'contained' : 'outlined'}
                          onClick={() => handleRoleSelect('employee')}
                          className="home-role-button"
                          sx={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            borderColor: formData.role === 'employee' ? '#667eea' : '#d1d5db',
                            backgroundColor: formData.role === 'employee' ? '#667eea' : 'transparent',
                            color: formData.role === 'employee' ? 'white' : '#6b7280',
                            '&:hover': {
                              backgroundColor: formData.role === 'employee' ? '#5a67d8' : '#f3f4f6',
                              borderColor: formData.role === 'employee' ? '#5a67d8' : '#9ca3af',
                              transform: 'translateY(-1px)',
                              boxShadow: formData.role === 'employee' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          👤 Employee
                        </Button>
                        <Button
                          variant={formData.role === 'recruiter' ? 'contained' : 'outlined'}
                          onClick={() => handleRoleSelect('recruiter')}
                          className="home-role-button"
                          sx={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            borderColor: formData.role === 'recruiter' ? '#667eea' : '#d1d5db',
                            backgroundColor: formData.role === 'recruiter' ? '#667eea' : 'transparent',
                            color: formData.role === 'recruiter' ? 'white' : '#6b7280',
                            '&:hover': {
                              backgroundColor: formData.role === 'recruiter' ? '#5a67d8' : '#f3f4f6',
                              borderColor: formData.role === 'recruiter' ? '#5a67d8' : '#9ca3af',
                              transform: 'translateY(-1px)',
                              boxShadow: formData.role === 'recruiter' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          🏢 Recruiter
                        </Button>
                      </Box>
                    </Box>
                    
                    <TextField
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      fullWidth
                      className="home-input-field"
                      sx={{
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                    <TextField
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      fullWidth
                      className="home-input-field"
                      sx={{
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
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
                    <TextField
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      fullWidth
                      className="home-input-field"
                      sx={{
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button 
                      type="submit" 
                      disabled={loading.email}
                      variant="contained"
                      fullWidth
                      className="home-auth-button"
                      sx={{
                        mt: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading.email ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </Box>
                )}
                
                <Box className="home-social-divider" sx={{ mt: 3, mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6b7280',
                      textAlign: 'center',
                      fontWeight: 500,
                    }}
                  >
                    Or continue with
                  </Typography>
                </Box>
                
                <Box className="home-social-buttons" sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleGoogleSignIn}
                    disabled={loading.google}
                    startIcon={<GoogleIcon />}
                    className="home-social-button"
                    sx={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      borderColor: '#db4437',
                      color: '#db4437',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#fef2f2',
                        borderColor: '#dc2626',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(219, 68, 55, 0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading.google ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Google"
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleLinkedInLogin}
                    disabled={loading.linkedin}
                    startIcon={<LinkedInIcon />}
                    className="home-social-button"
                    sx={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      borderColor: '#0077b5',
                      color: '#0077b5',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 119, 181, 0.05)',
                        borderColor: '#005885',
                        color: '#005885',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 119, 181, 0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading.linkedin ? (
                      <CircularProgress size={24} />
                    ) : (
                      "LinkedIn"
                    )}
                  </Button>
                </Box>
                
                {error && (
                  <Alert 
                    severity="error" 
                    className="home-error-alert"
                    sx={{ 
                      mt: 2,
                      borderRadius: '12px',
                      '& .MuiAlert-icon': {
                        color: '#dc2626',
                      },
                    }}
                  >
                    <AlertCircleIcon className="home-error-icon" />
                    {error}
                  </Alert>
                )}
              </Box>
            </div>
          </div>
            </div>
            
            <div className="home-auth-dialog-footer">
              <button 
                className="home-auth-close-button"
                onClick={handleCloseAuthDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-content">
          <div className="home-footer-links">
            <button onClick={() => setShowPrivacy(true)} className="home-footer-link home-footer-button">Privacy Policy</button>
            <button onClick={() => setShowTerms(true)} className="home-footer-link home-footer-button">Terms of Service</button>
            <button onClick={() => setShowCookie(true)} className="home-footer-link home-footer-button">Cookie Policy</button>
            <button 
              onClick={() => setShowContactUs(true)} 
              className="home-footer-link home-footer-button"
            >
              Contact Us
            </button>
          </div>
          
          <div className="home-footer-social">
            <a href="https://instagram.com/swipescout" target="_blank" rel="noopener noreferrer" className="home-social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
            
            <a href="https://tiktok.com/@swipescout" target="_blank" rel="noopener noreferrer" className="home-social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              TikTok
            </a>
            
            <a href="https://linkedin.com/company/swipescout" target="_blank" rel="noopener noreferrer" className="home-social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
      
      {/* Contact Us Popup */}
      <ContactUs 
        isOpen={showContactUs} 
        onClose={() => setShowContactUs(false)} 
      />

      {/* Terms of Service Popup */}
      <TermsOfService 
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />

      {/* Privacy Policy Popup */}
      <PrivacyPolicy 
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />

      {/* Cookie Policy Popup */}
      <CookiePolicy 
        isOpen={showCookie}
        onClose={() => setShowCookie(false)}
      />
    </Box>
  );
};

export default Home;