import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/button.jsx';
import { Card, CardContent, CardHeader } from '@/components/UI/card.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { AlertCircle as AlertCircleIcon } from 'lucide-react';
import AuthPage from '../AuthPage';
import ContactUs from './contact us/contactus';
import './home.css';
import TermsOfService from './terms of service/terms';
import PrivacyPolicy from './privacy policy/privacy';
import CookiePolicy from './cookie policy/cookie';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const Home = () => {
  const { t } = useTranslation(['home', 'homepage', 'common', 'videos', 'legal', 'contact', 'about', 'admin']);
  const { loginByEmailAndPassword, registerByEmailAndPassword, authenticateWithGoogle, authenticateWithLinkedIn, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
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
  const [googleAnchorEl, setGoogleAnchorEl] = useState(null);
  const [linkedinAnchorEl, setLinkedinAnchorEl] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [redirectPath, setRedirectPath] = useState(null); // Store intended destination

  const getDefaultRoute = (role) => {
    const effectiveRole = Array.isArray(role) ? role[0] : role;
    
    switch (effectiveRole) {
      case 'job_seeker':
      case 'employee': return '/jobseeker-tabs';
      case 'employer':
      case 'recruiter': return '/employer-tabs';
      case 'admin': return '/admin-dashboard';
      default: return '/';
    }
  };

  useEffect(() => {
    let buffer = '';
    const termsPhrase = 'terms of service';
    const privacyPhrase = 'privacy policy';

    const onKeyDown = (e) => {
      const key = e.key;
      if (typeof key === 'string' && key.length === 1) {
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

  useEffect(() => {
    const currentLang = i18n.language || (Array.isArray(i18n.options.fallbackLng) ? i18n.options.fallbackLng[0] : i18n.options.fallbackLng) || 'en';
    const monitoredNamespaces = ['home', 'homepage', 'common'];

    console.log('[Home] Active language:', currentLang);
    monitoredNamespaces.forEach((ns) => {
      const hasBundle = i18n.hasResourceBundle(currentLang, ns);
      console.log(`[Home] Namespace "${ns}" loaded:`, hasBundle);
      if (hasBundle) {
        const bundleKeys = Object.keys(i18n.getResourceBundle(currentLang, ns) || {});
        console.log(`[Home] Sample keys for "${ns}":`, bundleKeys.slice(0, 5));
      }
    });
    console.log('[Home] hero.title preview:', t('home:hero.title'));
    
    // Handle RTL direction for Arabic
    const html = document.documentElement;
    html.setAttribute('lang', currentLang);
    
    if (currentLang === 'ar') {
      html.setAttribute('dir', 'rtl');
      document.body.classList.add('font-arabic', 'text-arabic', 'arabic-shaped');
      // Force re-render to apply Arabic shaping
      document.body.style.fontFeatureSettings = '"ccmp", "locl", "calt", "liga", "clig"';
    } else {
      html.setAttribute('dir', 'ltr');
      document.body.classList.remove('font-arabic', 'text-arabic', 'arabic-shaped');
      document.body.style.fontFeatureSettings = '';
    }
  }, [i18n.language, t]);

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
      } else if (result.user && result.user.role && result.user.role !== "no role") {
        setShowAuthDialog(false);
        navigate(redirectPath || getDefaultRoute(result.user.role)); // Navigate to stored destination or default route
        setRedirectPath(null); // Clear redirect path
      } else {
        setError("Sign-in successful but user role is not set. Please contact support.");
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
      setError("Please select your role (Job Seeker or Employer)");
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
         formData.firstName,formData.lastName,
        formData.role
      );
      
      if (result.error) {
        setError(result.message);
      } else {
        setShowAuthDialog(false); // Close dialog before navigating
        const userRole = result?.user?.role || result?.role;
        if (userRole) {
          navigate(getDefaultRoute(userRole));
        } else {
          setError("Sign-up successful but unable to determine user role.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setShowAuthDialog(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLoading((prev) => ({ ...prev, google: true }));
      const result = await authenticateWithGoogle();
      if (result?.error && !result.redirect) {
        setError(result.message);
      }
    } catch (error) {
      setError(error?.message || "Google Sign-In failed");
    } finally {
      setLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setShowAuthDialog(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLoading((prev) => ({ ...prev, google: true }));
      const result = await authenticateWithGoogle();
      if (result?.error && !result.redirect) {
        setError(result.message);
      }
    } catch (error) {
      setError(error?.message || "Google Sign-Up failed");
    } finally {
      setLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleGoogleSignInWithRole = async (nextRole) => {
    setGoogleAnchorEl(null);
    setLoading({ ...loading, google: true });
    setError("");
    try {
      const result = await authenticateWithGoogle({ role: nextRole });
      if (result?.error && !result.redirect) {
        setError(result.message);
      } else if (!result?.redirect && result.user && result.user.role) {
        console.log("Navigating to default route for role:", result.user.role); // Debugging
        navigate(getDefaultRoute(result.user.role));
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
      } else {
        const userRole = result?.user?.role || result?.role;
        if (userRole) {
          navigate(getDefaultRoute(userRole));
        } else {
          setError("LinkedIn sign-in successful but unable to determine user role.");
        }
      }
    } catch (err) {
      setError("LinkedIn sign-in failed. Please try again.");
    } finally {
      setLoading({ ...loading, linkedin: false });
    }
  };

  const handleLinkedInMenuOpen = (event) => {
    setLinkedinAnchorEl(event.currentTarget);
  };

  const handleLinkedInMenuClose = () => {
    setLinkedinAnchorEl(null);
  };

  const handleLinkedInSignInWithRole = async (role) => {
    setLinkedinAnchorEl(null);
    setLoading({ ...loading, linkedin: true });
    setError("");

    try {
      const result = await authenticateWithLinkedIn(role);
      if (result.error) {
        setError(result.message);
      } else if (result.user && result.user.role) {
        console.log("Navigating to default route for role:", result.user.role); // Debugging
        navigate(getDefaultRoute(result.user.role));
      }
    } catch (err) {
      setError("LinkedIn sign-in failed. Please try again.");
    } finally {
      setLoading({ ...loading, linkedin: false });
    }
  };

  const handleGoogleMenuOpen = (event) => {
    setGoogleAnchorEl(event.currentTarget);
  };

  const handleGoogleMenuClose = () => {
    // Move focus away from the menu before closing it
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setGoogleAnchorEl(null);
  };

  // add handler to go to video-upload tab, require login first
  const handleVideoFeatureClick = async () => {
    // Defensive: wrap navigation in a short async delay and try/catch so
    // any timing-related message/extension races don't prevent navigation
    // and we get a clearer error trace if something goes wrong.
    try {
      console.log("Video feature clicked==================", { user, role });
      const effectiveRole = user ? (Array.isArray(user.role) ? user.role[0] : user.role) : null;

      if (role === null || !effectiveRole) {
        handleOpenAuthDialog(0);
        setRedirectPath('/jobseeker-tabs?group=profileContent&tab=video-upload');
        return;
      }

      // Small micro-delay to avoid potential message-channel races with browser
      // extensions or other listeners (50ms is usually sufficient and low impact).
      await new Promise((resolve) => setTimeout(resolve, 50));

      if (effectiveRole === 'job_seeker') {
        navigate('/jobseeker-tabs?group=profileContent&tab=video-upload');
      } else if (effectiveRole === 'employee') {
        navigate('/employer-tabs?group=profileContent&tab=video-upload');
      } else {
        navigate(getDefaultRoute(effectiveRole));
      }
    } catch (err) {
      // Log and attempt a safe fallback; avoid throwing unhandled exceptions
      // that could break UI handlers.
      // eslint-disable-next-line no-console
      console.error('handleVideoFeatureClick error:', err);
      try {
        const fallbackRole = user ? (Array.isArray(user.role) ? user.role[0] : user.role) : null;
        navigate(getDefaultRoute(fallbackRole) || '/');
      } catch (e) {
        // swallow secondary navigation errors
        // eslint-disable-next-line no-console
        console.error('fallback navigation failed:', e);
      }
    }
  };

  const handleEmployersClick = () => {
    // If not logged in, prompt login and store redirect
    if (!user) {
      setRedirectPath('/employer-tabs');
      handleOpenAuthDialog(0);
      return;
    }
    const effectiveRole = Array.isArray(user.role) ? user.role[0] : user.role;
    // navigate to employer area
    navigate(getDefaultRoute(effectiveRole) || '/employer-tabs');
  };

  const handleSkillsClick = () => {
    if (!user) {
      setRedirectPath('/jobseeker-tabs');
      handleOpenAuthDialog(0);
      return;
    }
    const effectiveRole = Array.isArray(user.role) ? user.role[0] : user.role;
    if (effectiveRole === 'job_seeker' || effectiveRole === 'employee') {
      navigate('/jobseeker-tabs');
    } else {
      navigate(getDefaultRoute(effectiveRole));
    }
  };
 
  

   return (
    <div className="home-wrapper" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* SwipeScout Header */}
      <div className="home-header">
        <div className="home-logo-container">
          <img src="/swipescout.svg" alt="SwipeScout Logo" className="home-logo" />
          <span className="home-brand-text">SwipeScout</span>
        </div>
        
        {/* Language Switcher with SVG Flags */}
        <div className="flex gap-2 items-center ml-auto mr-5">
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 ${
              i18n.language === 'en' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg border-2 border-cyan-400' 
                : 'bg-white text-gray-700 border border-gray-300 hover:border-cyan-400'
            }`}
            title="English"
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="16" fill="white"/>
              <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                <rect width="32" height="32" rx="16" fill="white"/>
              </mask>
              <g mask="url(#mask0)">
                <rect width="32" height="32" fill="#0A17A7"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M0 0L32 21.3333V32L0 10.6667V0Z" fill="white"/>
                <path d="M2.66667 0L32 19.5556V24.8889L0 3.55556V0H2.66667Z" fill="#C8102E"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M32 0L0 21.3333V32L32 10.6667V0Z" fill="white"/>
                <path d="M29.3333 0L0 19.5556V24.8889L32 3.55556V0H29.3333Z" fill="#C8102E"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M13.3333 0H18.6667V32H13.3333V0ZM0 10.6667V21.3333H32V10.6667H0Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M0 12.8V19.2H32V12.8H0ZM14.4 0V32H17.6V0H14.4Z" fill="#C8102E"/>
              </g>
            </svg>
            <span>EN</span>
          </button>
          
          <button
            onClick={() => i18n.changeLanguage('ar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 ${
              i18n.language === 'ar' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg border-2 border-cyan-400' 
                : 'bg-white text-gray-700 border border-gray-300 hover:border-cyan-400'
            }`}
            title="العربية"
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="16" fill="white"/>
              <mask id="mask-sa" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                <rect width="32" height="32" rx="16" fill="white"/>
              </mask>
              <g mask="url(#mask-sa)">
                <rect width="32" height="32" fill="#165e3c"/>
                <path d="M8 11h16v3H8zm0 4h16v3H8zm3 4h10v2h2v-2h2v2h-2v2h-12v-2h-2v-2h2z" fill="white"/>
              </g>
            </svg>
            <span className="font-arabic">AR</span>
          </button>
          
          <button
            onClick={() => i18n.changeLanguage('zh')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 ${
              i18n.language === 'zh' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg border-2 border-cyan-400' 
                : 'bg-white text-gray-700 border border-gray-300 hover:border-cyan-400'
            }`}
            title="中文"
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="16" fill="white"/>
              <mask id="mask-cn" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                <rect width="32" height="32" rx="16" fill="white"/>
              </mask>
              <g mask="url(#mask-cn)">
                <rect width="32" height="32" fill="#DE2910"/>
                <path d="M8 8l1.5 4.5h4.7l-3.8 2.8 1.5 4.5L8 17l-3.9 2.8 1.5-4.5L1.8 12.5h4.7L8 8z" fill="#FFDE00"/>
                <path d="M14 6l0.5 1.5h1.5l-1.2 0.9 0.5 1.5-1.3-0.9-1.2 0.9 0.5-1.5-1.2-0.9h1.5L14 6zm2 4l0.5 1.5h1.5l-1.2 0.9 0.5 1.5-1.3-0.9-1.2 0.9 0.5-1.5-1.2-0.9h1.5L16 10zm-1 4l0.5 1.5h1.5l-1.2 0.9 0.5 1.5-1.3-0.9-1.2 0.9 0.5-1.5-1.2-0.9h1.5L15 14zm-2 2l0.5 1.5h1.5l-1.2 0.9 0.5 1.5-1.3-0.9-1.2 0.9 0.5-1.5-1.2-0.9h1.5L13 16z" fill="#FFDE00"/>
              </g>
            </svg>
            <span>ZH</span>
          </button>
        </div>
      </div>

      {/* HERO + FEATURES WRAPPER (keeps features below the hero and responsive) */}
      <div className="hero-features-wrap hero-features-wrap--left">
        <div className="home-container">
          {/* Background video element (plays behind content) */}
          <video className="home-bg-video" autoPlay muted loop playsInline poster="/backgrounds/meeting_room2.jpg">
            <source src="/videos/vidBkg_out_s.mp4" type="video/mp4" />
            {/* Fallback content shown when video isn't supported */}
            Your browser does not support the background video.
          </video>
          <div className="home-content">
            {/* Centered brand in the hero area (visually aligned like the action buttons were) */}
            <div className="home-hero-brand" aria-hidden="true">
              <img src="/swipescout.svg" alt="" className="home-hero-logo" />
              <span className="home-hero-brand-text">SwipeScout</span>
            </div>

            <div className="home-hero-section">
              <h1 className="home-title">
                {t('home:hero.title')}
              </h1>
      
            <h3 className="home-subtitle">
              {t('home:hero.subtitle')}
            </h3>
            <p className="home-hero-tagline">
              {t('home:heroTagline')}
            </p>
            <h5 className="home-description">
              {t('home:description')}
            </h5>
          </div>
       
      </div>
  </div>
<div >
  {/* Feature Statements: kept below the hero in source order (no inline widths/heights) */}
  <div className="home-feature-statements" >
          <div className="home-feature-item">
          <button
            type="button"
            className="home-feature-icon-button home-feature-clickable"
            onClick={(e) => { console.log('video-feature button DOM clicked', e); handleVideoFeatureClick(); }}
            aria-label="Create a video resume"
          >
            <svg className="home-feature-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
            </svg>
          </button>
          <h3 className="home-feature-statement home-feature-statement-primary">
            {t('home:features.videoProfile')}
          </h3>
             </div>
             

        <div className="home-feature-item">
          <button
            
            className="home-feature-icon-button home-feature-icon-button--secondary"
            onClick={handleSkillsClick}
            aria-label="Show your skills"
          >
            <svg className="home-feature-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"             style={{ cursor: 'normal !important' }}
>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <h3 className="home-feature-statement home-feature-statement-secondary">
            {t('home:features.showSkills')}
          </h3>
        </div>

        <div className="home-feature-item">
          <button
            type="button"
            className="home-feature-icon-button home-feature-icon-button--highlight"
            onClick={handleEmployersClick}
            aria-label="Employers area"
          >
            <svg className="home-feature-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
          <h3 className="home-feature-statement home-feature-statement-highlight">
            {t('home:features.employersSwiping')}
          </h3>
        </div>

        <div className="home-feature-item home-video-feeds-card">
          <button
            type="button"
            className="home-feature-icon-button home-feature-icon-button--video home-feature-clickable"
            onClick={() => navigate('/videos')}
            aria-label="Watch video feeds"
          >
            <svg className="home-feature-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 16.5l6-4.5-6-4.5v9zm12-4.5c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-2 0c0-4.418-3.582-8-8-8s-8 3.582-8 8 3.582 8 8 8 8-3.582 8-8z" />
            </svg>
          </button>
          <h3 className="home-feature-statement home-feature-statement-secondary">
            {t('home:features.watchVideoFeeds')}
          </h3>
          
         </div>
        </div>
         </div>
         </div>
    
      {/* Action Buttons - Outside the hero-features wrap */}
      <div className="home-action-buttons">
        <Button
          onClick={() => handleOpenAuthDialog(0)}
          className="home-login-button"
        >
          {t('home:buttons.login')}
        </Button>
        <Button
          onClick={() => handleOpenAuthDialog(1)}
          variant="outline"
          className="home-signup-button"
        >
          {t('home:buttons.signup')}
        </Button>
      </div>

            {/* End of New Section */}

      {/* Auth Dialog */}
      {showAuthDialog && (
        <AuthPage
          open={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          initialTab={activeTab}
          redirectPath={redirectPath}
        />
      )}
      
      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-content">
          <div className="home-footer-links">
         
            <button onClick={() => setShowPrivacy(true)} className="home-footer-link home-footer-button">{t('home:footer.privacyPolicy')}</button>
            <button onClick={() => setShowTerms(true)} className="home-footer-link home-footer-button">{t('home:footer.termsOfService')}</button>
            <button onClick={() => setShowCookie(true)} className="home-footer-link home-footer-button">{t('home:footer.cookiePolicy')}</button>
            <button 
              onClick={() => setShowContactUs(true)} 
              className="home-footer-link home-footer-button"
            >
              {t('home:footer.contactUs')}
             </button>
                <Link to="/about" className="home-footer-link">{t('home:footer.more')}</Link>
            <Link to="/blog" className="home-footer-link">{t('home:footer.blog')}</Link>
          </div>
          
          <div className="home-footer-social">
            <a href="https://x.com/swipescout" target="_blank" rel="noopener noreferrer" className="home-social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              {t('home:footer.social.twitter')}
            </a>
            
            <a href="https://tiktok.com/@swipescout" target="_blank" rel="noopener noreferrer" className="home-social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              {t('home:footer.social.tiktok')}
            </a>
            
            <a href="https://linkedin.com/company/swipescout" target="_blank" rel="noopener noreferrer" className="home-social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              {t('home:footer.social.linkedin')}
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
    </div>
  );
};

export default Home;