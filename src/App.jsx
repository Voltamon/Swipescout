import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { Help } from "@mui/icons-material";

// Pages
import ExploreJobs from "./pages/ExploreJobs";
import MyApplications from "./pages/MyApplications";


import DashboardJobSeeker from "./pages/DashboardJobSeeker.jsx";
import JobSearchPage from "./pages/JobSearchPage";
import CandidateSearchPage from "./pages/CandidateSearchPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import VideoEditPage from "./pages/VideoEditPage";
import VideoGridPage from "./pages/VideoGridPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";

// AI Pages
import AIAnalysisPage from "./pages/AIAnalysisPage";
import AIInterviewPage from "./pages/AIInterviewPage";
import AIMatchingPage from "./pages/AIMatchingPage";

// Template Pages
import TemplateManagementPage from "./pages/TemplateManagementPage";
import TemplateInterviewPage from "./pages/TemplateInterviewPage";
import TemplateAnalysisPage from "./pages/TemplateAnalysisPage";

import JobPostingForm from "./pages/JobPostingForm";
import VideoUpload from "./pages/VideoUpload";

import JobDetailsPage from "./pages/JobDetailsPage";

import AdminDashboard from "./pages/adminDashboard";
import FeedPage from "./pages/FeedPage";
import TalentExplore from "./pages/TalentExplore";

import EmployerViedoExamples from "./pages/EmployerViedoExamples";
import JobseekerVideoExamples from "./pages/JobseekerVideoExamples";
import About from "./pages/About/About";
import FAQs from "./pages/FAQ/FAQs";
import VideoFeed from "./pages/VideoFeed";
import JobseekerVideoFeed from "./pages/JobseekerVideoFeed";
import Chat from "./pages/Chat";

import JobVideos from "./pages/JobVideos";
import CompanyVideos from "./pages/CompanyVideos";
import Settings from "./pages/Settings";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import TranslationTest from "./pages/TranslationTest";
import UnauthorizedPage from "./pages/Unauthorized";
import Linkedincallback from "./pages/Linkedincallback";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { LinearProgress } from "@mui/material";
import { Suspense } from "react";

// Legal pages
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import CookiePolicy from "./pages/legal/CookiePolicy";
import CommunityGuidelines from "./pages/legal/CommunityGuidelines";
import CopyrightAndIPTerms from "./pages/legal/CopyrightAndIPTerms";
import EULA from "./pages/legal/EULA";

// Components
import CookieConsentBanner from "./components/CookieConsentBanner";

import NotificationsPage from "./pages/NotificationsPage";
import { useAuth } from "./contexts/AuthContext";
import { Cloudinary } from "@cloudinary/url-gen";

import JobSeekerProfile from "./pages/JobSeekerProfile";
import EditJobSeekerProfile from "./pages/EditJobSeekerProfile";
import EmployerProfilePage from "./pages/EmployerProfilePage";
import JobsListingPage from "./pages/JobsListingPage";
import PostJobPage from "./pages/PostJobPage";
import { VideoProvider } from "./contexts/VideoContext";
import VideosPage from "./pages/VideosPage";
import VideoFeedViewer from "./pages/VideoFeedViewer";
import EditEmployerProfilePage from "./pages/EditEmployerProfilePage";
import EditVideoPage from "./pages/EditeVideoPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import JobseekerProfileView from "./pages/JobseekerProfileView";
import EmployerProfileView from "./pages/EmployerProfileView";
import AllVideosPage from "./pages/AllVideosPage";
import Home from "./pages/home/home.jsx";
import Videos from "./pages/Videos";
import HowItWorksPage from "./pages/HowItWorks";
import AuthPage from "./pages/AuthPage";

import Pricing from "./pages/PricingPage";
import HelpPageLinks from "./pages/HelpPageLinks";
import CustomerSupportPage from "./pages/CustomerSupportPage";
import ContactPage from "./pages/ContactPage";
import CreditsPage from "./pages/CreditsPage";
import EmployerTabs from "./pages/EmployerTabs";
import JobseekerTabs from "./pages/JobseekerTabs";
import AdminTabs from "./pages/AdminTabs";

// New enhanced pages
import InterviewPage from "./pages/InterviewPage";
import SavedVideosPage from "./pages/SavedVideosPage";
import LikedVideosPage from "./pages/LikedVideosPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import AnalyticsJobseeker from "./pages/AnalyticsJobseeker";
import AnalyticsEmployer from "./pages/AnalyticsEmployer";
import AnalyticsAdmin from "./pages/AnalyticsAdmin";
import "./i18n/index.js"; // Import i18n configuration
import SharePage from "./pages/SharePage"; // Import the new SharePage component
import VideosFeed from "./pages/VideosFeed"; // Import the new SharePage component

// Blog Pages
import PublicBlogPage from "./pages/PublicBlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";



// Initialize once (put this in a separate config file)
const cld = new Cloudinary({
  cloud: {
    cloudName: "djfvfxrsh" // Replace with yours
  }
});

function App() {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // Handle RTL direction and language attributes
  React.useEffect(() => {
    const currentLang = localStorage.getItem('i18nextLng') || 'en';
    const html = document.documentElement;
    
    // Set language attribute
    html.setAttribute('lang', currentLang);
    
    // Set direction for Arabic with proper font shaping
    if (currentLang === 'ar') {
      html.setAttribute('dir', 'rtl');
      document.body.classList.add('font-arabic', 'text-arabic', 'arabic-shaped');
      // Force browser to apply Arabic shaping
      document.body.style.fontFeatureSettings = '"ccmp", "locl", "calt", "liga", "clig"';
      document.body.style.fontFamily = "'Cairo', 'Almarai', 'Tajawal', 'Tahoma', sans-serif";
    } else {
      html.setAttribute('dir', 'ltr');
      document.body.classList.remove('font-arabic', 'text-arabic', 'arabic-shaped');
      document.body.style.fontFeatureSettings = '';
      document.body.style.fontFamily = '';
    }
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LinearProgress />}>
        <VideoProvider>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
         
            <Route path="/" element={<Home />} />
            <Route path="/share" element={<SharePage />} /> {/* Add route for SharePage */}
            <Route path="/login" element={<AuthPage initialTab={0} />} />
            <Route path="/register" element={<AuthPage initialTab={1} />} />
            <Route path="/translation-test" element={<TranslationTest />} />

            <Route path="/about" element={<About />} />
            <Route path="/FAQs" element={<FAQs />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/customer-support" element={<CustomerSupportPage />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<PublicBlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            
            
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/auth/linkedin/callback" element={<Linkedincallback />} />
     
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/resume-builder" element={<ResumeBuilderPage />} />
            <Route path="/video-edit/:id?" element={<VideoEditPage />} />
            <Route path="/videos-Feed" element={<VideosFeed />} />
            
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:oobCode" element={<ResetPasswordPage />} />
            <Route path="/jobseeker-profile/:userId" element={<JobseekerProfileView />} />
            <Route path="/employer-profile/:userId" element={<EmployerProfileView />} />
            <Route path="/video-feed/:vid?" element={<VideoFeed />} />
            <Route path="/jobseeker-video-feed/:vid?" element={<JobseekerVideoFeed />} />
            <Route path="/videos/:pagetype" element={<AllVideosPage />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:id" element={<Videos />} />
            <Route path="/video-player/:id" element={<VideoFeedViewer />} />
            <Route path="/video-player" element={<VideoPlayerPage />} />

            {/* Legal Routes */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            <Route path="/copyright-ip-terms" element={<CopyrightAndIPTerms />} />
            <Route path="/eula" element={<EULA />} />

            {/* Enhanced Tab Routes - Main entry points after login */}
            <Route path="/employer-tabs" element={<EmployerTabs />} />
            <Route path="/jobseeker-tabs" element={<JobseekerTabs />} />
            <Route path="/admin-tabs" element={<AdminTabs />} />

            {/* Private Routes */}
            <Route element={<ProtectedRoute />}>
              
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:conversationId" element={<Chat />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/notification-settings" element={<NotificationSettingsPage />} />
              
              {/* Interview and Video Call Routes */}
              <Route path="/interviews" element={<InterviewPage />} />
              <Route path="/interviews/:id" element={<InterviewPage />} />
              
              {/* Video Management Routes */}
              <Route path="/saved-videos" element={<SavedVideosPage />} />
              <Route path="/liked-videos" element={<LikedVideosPage />} />

              {/* AI Features Routes */}
              <Route path="/ai-analysis" element={<AIAnalysisPage />} />
              <Route path="/ai-interview" element={<AIInterviewPage />} />
              <Route path="/ai-matching" element={<AIMatchingPage />} />

              {/* Template Management Routes */}
              <Route path="/template-management" element={<TemplateManagementPage />} />
              <Route path="/template-interview" element={<TemplateInterviewPage />} />
              <Route path="/template-analysis" element={<TemplateAnalysisPage />} />
              <Route path="/templates" element={<TemplateManagementPage />} />
              <Route path="/templates/:templateId/interview" element={<TemplateInterviewPage />} />
              <Route path="/template-responses/:responseId/analysis" element={<TemplateAnalysisPage />} />

              {/* Job Seeker Routes */}
              <Route path="/jobseeker-dashboard" element={<JobSeekerDashboard />} />
              <Route path="/analytics/jobseeker" element={<AnalyticsJobseeker />} />
              <Route path="/dashboard" element={
                role === 'job_seeker' ? <Navigate to="/jobseeker-tabs?tab=job-search" replace /> :
                role === 'employer' ? <Navigate to="/employer-tabs?tab=candidate-search" replace /> :
                role === 'admin' ? <Navigate to="/admin-dashboard" replace /> :
                <Navigate to="/" replace />
              } />
              <Route path="/job-videos" element={<JobVideos />} />
              
              {/* Employer Routes */}
              <Route path="/employer-dashboard" element={<EmployerDashboard />} />
              <Route path="/analytics/employer" element={<AnalyticsEmployer />} />
              <Route path="/company-videos" element={<CompanyVideos />} />
              
              <Route path="/candidate-search" element={<CandidateSearchPage />} />
              <Route path="/Telent-explore" element={<TalentExplore />} />
              <Route path="/job-search" element={<JobSearchPage />} />
              <Route path="/CompanyVideos-page" element={<CompanyVideos />} />
              
              <Route path="/job-posting" element={<JobPostingForm />} />
              <Route path="/video-upload" element={<VideoUpload />} />
              
              <Route path="/job/:id" element={<JobDetailsPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/analytics/admin" element={<AnalyticsAdmin />} />
              <Route path="/feed-page" element={<FeedPage />} />
              <Route path="/employer-video-examples" element={<EmployerViedoExamples />} />
              <Route path="/Explore-jobs" element={<ExploreJobs />} />
              <Route path="/jobseeker-video-examples" element={<JobseekerVideoExamples />} />
          
              <Route path="/MyApplications-page" element={<MyApplications />} />

              <Route path="/Job-seeker-profile" element={<JobSeekerProfile />} />
              <Route path="/edit-jobseeker-profile" element={<EditJobSeekerProfile />} />
              <Route path="/employer-profile" element={<EmployerProfilePage />} />
              <Route path="/edit-employer-profile" element={<EditEmployerProfilePage />} />
              <Route path="/jobs-listing" element={<JobsListingPage />} />
              <Route path="/post-job" element={<PostJobPage />} />
              <Route path="/my-videos" element={<VideosPage />} />
              <Route path="/edit-video/:id" element={<EditVideoPage />} />
              <Route path="/help" element={<HelpPageLinks />} />

            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <CookieConsentBanner />
        </VideoProvider>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
// No code changes required in this frontend file for CORS fix.


