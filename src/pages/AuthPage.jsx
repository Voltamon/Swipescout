import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, Google as GoogleIcon, LinkedIn as LinkedInIcon, PersonOutline as PersonOutlineIcon, Business as BusinessIcon } from '@mui/icons-material';
import { AlertCircle as AlertCircleIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const AuthPage = ({ initialTab = 0, open = true, onClose, redirectPath: propRedirectPath }) => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginByEmailAndPassword, registerByEmailAndPassword, authenticateWithGoogle, authenticateWithLinkedIn, user } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab || 0);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState({ email: false, google: false, linkedin: false });
  const [error, setError] = useState('');
  const [googleAnchorEl, setGoogleAnchorEl] = useState(null);
  const [linkedinAnchorEl, setLinkedinAnchorEl] = useState(null);

  // prefer explicit prop redirectPath, otherwise use location.state
  const redirectPath = propRedirectPath || (location && location.state && location.state.redirectPath) || null;

  useEffect(() => {
    setActiveTab(initialTab || 0);
  }, [initialTab]);

  if (open === false) return null;

  const getDefaultRoute = (role) => {
    const effectiveRole = Array.isArray(role) ? role[0] : role;
    switch (effectiveRole) {
      case 'job_seeker':
      case 'employee': return '/jobseeker-tabs';
      case 'employer':
      case 'recruiter': return '/employer-tabs';
      case 'admin': return '/admin-tabs';
      default: return '/';
    }
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    setError('');
    setFormData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', role: '' });
  };

  const close = () => {
    if (onClose) return onClose();
    // when used as a route, go back
    navigate(-1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => setFormData({ ...formData, role });

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, email: true });
    setError('');
    try {
      const result = await loginByEmailAndPassword(formData.email, formData.password);
      if (result?.error) {
        setError(result.message);
      } else if (result?.user && result.user.role && result.user.role !== 'no role') {
        // close();
        navigate(redirectPath || getDefaultRoute(result.user.role));
      } else {
        setError('Sign-in successful but user role is not set. Please contact support.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, email: true });
    setError('');
    if (!formData.role) {
      setError(t('auth:errors.selectRole'));
      setLoading({ ...loading, email: false });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth:errors.passwordMismatch'));
      setLoading({ ...loading, email: false });
      return;
    }
    try {
            console.log("Registering with data: ", formData.email , formData.firstName, formData.lastName, formData.role);

      // Pass firstName and lastName as separate arguments (backend expects both)
      const result = await registerByEmailAndPassword(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.role
      );
      if (result?.error) {
        setError(result.message);
      } else {
        close();
        const userRole = result?.user?.role || result?.role;
        if (userRole) navigate(getDefaultRoute(userRole));
        else setError('Sign-up successful but unable to determine user role.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  const handleGoogleSignInWithRole = async (nextRole) => {
    setGoogleAnchorEl(null);
    setLoading({ ...loading, google: true });
    setError('');
    try {
      const result = await authenticateWithGoogle({ role: nextRole });
      if (result?.error && !result.redirect) setError(result.message);
      else if (!result?.redirect && result.user && result.user.role) navigate(getDefaultRoute(result.user.role));
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading({ ...loading, google: false });
    }
  };

  const handleLinkedInSignInWithRole = async (role) => {
    setLinkedinAnchorEl(null);
    setLoading({ ...loading, linkedin: true });
    setError('');
    try {
      const result = await authenticateWithLinkedIn(role);
      if (result?.error) setError(result.message);
      else if (result?.user && result.user.role) navigate(getDefaultRoute(result.user.role));
    } catch (err) {
      setError('LinkedIn sign-in failed. Please try again.');
    } finally {
      setLoading({ ...loading, linkedin: false });
    }
  };

  return (
    <div
      className="home-auth-dialog-overlay"
      onClick={close}
      style={{ background: 'transparent', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="home-auth-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'transparent', color: '#111827', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}
      >
        <div className="home-auth-dialog-content">
          <div className="home-auth-outer" style={{ background: '#000000ff', padding: 10, borderRadius: 12 }}>
            <div
              className="home-auth-card"
              style={{
                background: 'rgba(255,255,255,0.98)',
                padding: 18,
                borderRadius: 10,
                boxShadow: '0 6px 18px rgba(17,24,39,0.06)',
              }}
            >
              <div className="home-auth-card-content" style={{ background: 'transparent' }}>
              <div className="home-auth-tabs" style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <button
                  onClick={() => handleTabChange(0)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    background: activeTab === 0 ? '#667eea' : 'transparent',
                    color: activeTab === 0 ? '#fff' : '#374151',
                    boxShadow: activeTab === 0 ? '0 6px 18px rgba(102,126,234,0.18)' : 'none',
                  }}
                >
                  {t('auth:tabs.login')}
                </button>
                <button
                  onClick={() => handleTabChange(1)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    background: activeTab === 1 ? '#667eea' : 'transparent',
                    color: activeTab === 1 ? '#fff' : '#374151',
                    boxShadow: activeTab === 1 ? '0 6px 18px rgba(102,126,234,0.18)' : 'none',
                  }}
                >
                  {t('auth:tabs.signUp')}
                </button>
              </div>

              <Box className="home-auth-form-container">
                {activeTab === 0 ? (
                  <Box component="form" onSubmit={handleEmailSignIn} className="home-auth-form">
                    <TextField label={t('auth:fields.email')} type="email" name="email" value={formData.email} onChange={handleChange} required variant="outlined" fullWidth className="home-input-field" sx={{ mt: 2 }} />
                    <TextField label={t('auth:fields.password')} type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required variant="outlined" fullWidth className="home-input-field" sx={{ mt: 2 }} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
                    <Box sx={{ textAlign: 'right', mt: 1 }}>
                      <Typography component="span" sx={{ color: '#667eea', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }} onClick={() => navigate('/forgot-password')}>{t('auth:labels.forgotPassword')}</Typography>
                    </Box>
                    <Button type="submit" disabled={loading.email} variant="contained" fullWidth className="home-auth-button" sx={{ mt: 2 }}>{loading.email ? <CircularProgress size={24} color="inherit" /> : t('auth:buttons.logIn')}</Button>
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleEmailSignUp} className="home-auth-form">
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <TextField label={t('auth:fields.firstName')} name="firstName" value={formData.firstName} onChange={handleChange} required variant="outlined" className="home-input-field home-name-field" />
                      <TextField label={t('auth:fields.lastName')} name="lastName" value={formData.lastName} onChange={handleChange} required variant="outlined" className="home-input-field home-name-field" />
                    </Box>

                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#374151', fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>{t('auth:labels.signingUpAs')}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant={formData.role === 'employer' ? 'contained' : 'outlined'}
                          onClick={() => handleRoleSelect('employer')}
                          startIcon={<BusinessIcon />}
                          sx={{ flex: 1 }}
                        >
                          {t('auth:labels.employer')}
                        </Button>
                        <Button
                          variant={formData.role === 'job_seeker' ? 'contained' : 'outlined'}
                          onClick={() => handleRoleSelect('job_seeker')}
                          startIcon={<PersonOutlineIcon />}
                          sx={{ flex: 1 }}
                        >
                          {t('auth:labels.jobSeeker')}
                        </Button>
                      </Box>
                    </Box>

                    <TextField label={t('auth:fields.email')} type="email" name="email" value={formData.email} onChange={handleChange} required variant="outlined" fullWidth className="home-input-field" sx={{ mt: 2 }} />
                    <TextField label={t('auth:fields.password')} type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required variant="outlined" fullWidth className="home-input-field" sx={{ mt: 2 }} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
                    <TextField label={t('auth:fields.confirmPassword')} type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required variant="outlined" fullWidth className="home-input-field" sx={{ mt: 2 }} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
                    <Button type="submit" disabled={loading.email} variant="contained" fullWidth className="home-auth-button" sx={{ mt: 2 }}>{loading.email ? <CircularProgress size={24} color="inherit" /> : t('auth:buttons.signUp')}</Button>
                  </Box>
                )}

                <Box className="home-social-divider" sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center', fontWeight: 500 }}>{t('auth:labels.orContinueWith')}</Typography>
                </Box>

                <Box className="home-social-buttons" sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" onClick={(e) => setGoogleAnchorEl(e.currentTarget)} disabled={loading.google} startIcon={<GoogleIcon />} sx={{ flex: 1 }}>{loading.google ? <CircularProgress size={24} /> : t('auth:buttons.google')}</Button>
                  <Menu anchorEl={googleAnchorEl} open={Boolean(googleAnchorEl)} onClose={() => setGoogleAnchorEl(null)}>
                    <MenuItem onClick={() => handleGoogleSignInWithRole('job_seeker')}>{t('auth:menu.signUpAsJobSeeker')}</MenuItem>
                    <MenuItem onClick={() => handleGoogleSignInWithRole('employer')}>{t('auth:menu.signUpAsEmployer')}</MenuItem>
                  </Menu>
                  <Button variant="outlined" onClick={(e) => setLinkedinAnchorEl(e.currentTarget)} disabled={loading.linkedin} startIcon={<LinkedInIcon />} sx={{ flex: 1 }}>{loading.linkedin ? <CircularProgress size={24} /> : t('auth:buttons.linkedin')}</Button>
                  <Menu anchorEl={linkedinAnchorEl} open={Boolean(linkedinAnchorEl)} onClose={() => setLinkedinAnchorEl(null)}>
                    <MenuItem onClick={() => handleLinkedInSignInWithRole('job_seeker')}>{t('auth:menu.signUpAsJobSeeker')}</MenuItem>
                    <MenuItem onClick={() => handleLinkedInSignInWithRole('employer')}>{t('auth:menu.signUpAsEmployer')}</MenuItem>
                  </Menu>
                </Box>

                {error && (
                  <Alert severity="error" className="home-error-alert" sx={{ mt: 2 }}>
                    <AlertCircleIcon className="home-error-icon" />
                    {error}
                  </Alert>
                )}
              </Box>
            </div>
          </div>
        </div>

        <div className="home-auth-dialog-footer">
          <button className="home-auth-close-button" onClick={close}>{t('auth:buttons.close')}</button>
        </div>
      </div>
    </div>
    </div>
  );
};



export default AuthPage;
