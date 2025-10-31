import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Building2, AlertCircle, Chrome, Linkedin, X, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { homeThemeColors } from '@/config/theme-colors-home';
import './AuthPage.css';

const AuthPage = ({ initialTab = 0, open = true, onClose, redirectPath: propRedirectPath }) => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginByEmailAndPassword, registerByEmailAndPassword, authenticateWithGoogle, authenticateWithLinkedIn } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab || 0);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState({ email: false, google: false, linkedin: false });
  const [error, setError] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState({ google: false, linkedin: false });

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
    setShowRoleMenu({ ...showRoleMenu, google: false });
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
    setShowRoleMenu({ ...showRoleMenu, linkedin: false });
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto overflow-x-hidden"
      onClick={close}
    >
      {/* Dialog Container */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in border border-gray-100 my-auto max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg group"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Logo/Brand */}
          <div className="flex flex-col items-center mb-6">
            <div 
              className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-xl animate-float overflow-hidden"
              style={{ background: homeThemeColors.gradients.button }}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent animate-shimmer"></div>
              
              {/* Logo */}
              <img 
                src="/swipescout.svg" 
                alt="SwipeScout" 
                className="w-12 h-12 object-contain drop-shadow-lg"
              />
            </div>
            <h2 
              className="text-3xl font-bold bg-clip-text text-transparent mb-1"
              style={{ backgroundImage: homeThemeColors.gradients.button }}
            >
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500">Sign in to continue to SwipeScout</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => handleTabChange(0)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === 0
                  ? 'bg-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={activeTab === 0 ? { color: homeThemeColors.brand.primary } : {}}
            >
              {t('auth:tabs.login')}
            </button>
            <button
              onClick={() => handleTabChange(1)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === 1
                  ? 'bg-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={activeTab === 1 ? { color: homeThemeColors.brand.primary } : {}}
            >
              {t('auth:tabs.signUp')}
            </button>
          </div>

          {/* Forms */}
          {activeTab === 0 ? (
            // Login Form
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth:fields.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth:fields.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm font-medium"
                  style={{ color: homeThemeColors.brand.primary }}
                >
                  {t('auth:labels.forgotPassword')}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading.email}
                className="w-full py-3 px-4 text-white font-semibold rounded-lg focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/50"
              >
                {loading.email ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('auth:messages.signingIn', { defaultValue: 'Signing in...' })}</span>
                  </>
                ) : (
                  t('auth:buttons.logIn', { defaultValue: 'Log in' })
                )}
              </button>
            </form>
          ) : (
            // Sign Up Form
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth:fields.firstName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth:fields.lastName')}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth:labels.signingUpAs')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('employer')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 border-2 rounded-lg font-medium transition-all duration-200 ${
                      formData.role === 'employer'
                        ? 'bg-indigo-50'
                        : 'border-gray-300 text-gray-600'
                    }`}
                    style={formData.role === 'employer' ? { 
                      borderColor: homeThemeColors.brand.primary,
                      color: homeThemeColors.brand.primary 
                    } : {}}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>{t('auth:labels.employer')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('job_seeker')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 border-2 rounded-lg font-medium transition-all duration-200 ${
                      formData.role === 'job_seeker'
                        ? 'bg-indigo-50'
                        : 'border-gray-300 text-gray-600'
                    }`}
                    style={formData.role === 'job_seeker' ? { 
                      borderColor: homeThemeColors.brand.primary,
                      color: homeThemeColors.brand.primary 
                    } : {}}
                  >
                    <User className="w-5 h-5" />
                    <span>{t('auth:labels.jobSeeker')}</span>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth:fields.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth:fields.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth:fields.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading.email}
                className="w-full py-3 px-4 text-white font-semibold rounded-lg focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/50"
              >
                {loading.email ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('auth:messages.creatingAccount', { defaultValue: 'Creating account...' })}</span>
                  </>
                ) : (
                  t('auth:buttons.signUp', { defaultValue: 'Sign up' })
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 py-1 bg-white text-gray-500 font-medium rounded-full">{t('auth:labels.orContinueWith')}</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleMenu({ ...showRoleMenu, google: !showRoleMenu.google })}
                disabled={loading.google}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md transition-all duration-300 disabled:opacity-50 group"
              >
                {loading.google ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Chrome className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-semibold">{t('auth:buttons.google', { defaultValue: 'Google' })}</span>
                  </>
                )}
              </button>
              {showRoleMenu.google && (
                <div className="absolute z-10 top-full mt-2 w-full bg-white border-2 border-indigo-200 rounded-lg shadow-xl py-1 animate-scale-in">
                  <button
                    onClick={() => handleGoogleSignInWithRole('job_seeker')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {t('auth:menu.signUpAsJobSeeker')}
                  </button>
                  <button
                    onClick={() => handleGoogleSignInWithRole('employer')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    {t('auth:menu.signUpAsEmployer')}
                  </button>
                </div>
              )}
            </div>

            {/* LinkedIn */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleMenu({ ...showRoleMenu, linkedin: !showRoleMenu.linkedin })}
                disabled={loading.linkedin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md transition-all duration-300 disabled:opacity-50 group"
              >
                {loading.linkedin ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Linkedin className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-semibold">{t('auth:buttons.linkedin', { defaultValue: 'LinkedIn' })}</span>
                  </>
                )}
              </button>
              {showRoleMenu.linkedin && (
                <div className="absolute z-10 top-full mt-2 w-full bg-white border-2 border-blue-200 rounded-lg shadow-xl py-1 animate-scale-in">
                  <button
                    onClick={() => handleLinkedInSignInWithRole('job_seeker')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {t('auth:menu.signUpAsJobSeeker')}
                  </button>
                  <button
                    onClick={() => handleLinkedInSignInWithRole('employer')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    {t('auth:menu.signUpAsEmployer')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl flex items-start gap-3 animate-shake shadow-lg">
              <div className="p-1 bg-red-100 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              </div>
              <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
