import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/UI/button';
import { Card, CardContent, CardHeader } from '../../components/UI/card';
import { Input } from '../../components/UI/input';
import { Label } from '../../components/UI/label';
import { AlertCircle as AlertCircleIcon } from 'lucide-react';
import AuthPage from '../AuthPage';
import ContactUs from './contact us/contactus';
import './home.css';
import TermsOfService from './terms of service/terms';
import PrivacyPolicy from './privacy policy/privacy';
import CookiePolicy from './cookie policy/cookie';

const Home = () => {
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
    // Navigate to route-based auth pages so shared AuthPage component is used
    navigate(tabIndex === 1 ? '/register' : '/login');
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
  const handleVideoFeatureClick = () => {
    // If not logged in, store the intended destination and prompt login
    if (!user) {
      setRedirectPath('/jobseeker-tabs?group=profileContent&tab=video-upload'); // Set destination
      handleOpenAuthDialog(0); // Open login dialog
      return;
    }

    // If logged in, route based on the user's role. Reuse getDefaultRoute to
    // determine the appropriate base route for their role, then append the
    // video-upload tab for job seekers / employees.
    const effectiveRole = Array.isArray(user.role) ? user.role[0] : user.role;

    if (effectiveRole === 'job_seeker' || effectiveRole === 'employee') {
      navigate('/jobseeker-tabs?group=profileContent&tab=video-upload');
    } else {
      // For employers/recruiters/admins, send them to the employer area
      // (use getDefaultRoute to support additional role mappings)
      const base = getDefaultRoute(effectiveRole) || '/employer-tabs';
      // If the base already contains a path for employer tabs, navigate there.
      navigate(base);
    }
  };
 
  

   return (
    <div className="home-wrapper">
    
      {/* SwipeScout Header */}
      <div className="home-header">
        <div className="home-logo-container">
          <img src="/swipescout.svg" alt="SwipeScout Logo" className="home-logo" />
          <span className="home-brand-text">SwipeScout</span>
        </div>
      </div>
      
      <div className="home-container">
        <div className="home-content">
          {/* Centered brand in the hero area (visually aligned like the action buttons were) */}
          <div className="home-hero-brand" aria-hidden="true">
            <img src="/swipescout.svg" alt="" className="home-hero-logo" />
            <span className="home-hero-brand-text">SwipeScout</span>
          </div>
          <div className="home-hero-section">
            <h1 className="home-title">
              Jobs Meet the <span className="home-title-highlight">Feed</span>
            </h1>
            <h3 className="home-subtitle">
              Welcome to the The First Video Hiring App.
Swipe through video resumes just like TikTok.
The fastest, most interactive  <span className="home-subtitle-highlight">way to hire — and be hired.</span> 
            </h3>
            <h5 className="home-description">
              Join us and find your dream job 
            </h5>
          </div>
        </div>
      </div>
     
      {/* Feature Statements */}
      <div className="home-feature-statements">
        <div
          className="home-feature-item"
          
  
        >
           <svg className="home-feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
             onClick={handleVideoFeatureClick}
             role="button"
             onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleVideoFeatureClick(); } }}
                   tabIndex={0}
                    style={{ cursor: 'pointer' }} // indicate clickable
           >
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
        <Button
          onClick={() => handleOpenAuthDialog(0)}
          className="home-login-button"
        >
          Login
        </Button>
        <Button
          onClick={() => handleOpenAuthDialog(1)}
          variant="outline"
          className="home-signup-button"
        >
          Sign Up
        </Button>
      </div>

            {/* New Section for Video Feeds */}
            <div
              className="home-video-feeds-section"
              role="button"
              tabIndex={0}
              onClick={() => navigate('/videos/')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { navigate('/videos/'); } }}
            >
              <svg
                className="home-video-icon"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ marginBottom: '.1rem' }}
              >
                <path d="M10 16.5l6-4.5-6-4.5v9zm12-4.5c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-2 0c0-4.418-3.582-8-8-8s-8 3.582-8 8 3.582 8 8 8 8-3.582 8-8z" />
              </svg>
              <h5 className="text-lg font-semibold text-muted-foreground mb-2">
                Watch Video Feeds
              </h5>
              <p className="text-sm text-muted-foreground/80 font-medium">
                Explore and enjoy video resumes from job seekers.
              </p>
            </div>
            {/* End of New Section */}

      {/* Authentication Route / Modal - AuthPage handles login/register UI */}
      { (location.pathname === '/login' || location.pathname === '/register' || showAuthDialog) && (
        <AuthPage
          open={true}
          onClose={() => { setShowAuthDialog(false); navigate('/'); }}
          initialTab={location.pathname === '/register' ? 1 : activeTab}
          redirectPath={redirectPath}
        />
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
    </div>
  );
};

export default Home;