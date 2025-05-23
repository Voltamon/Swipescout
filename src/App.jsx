// import React from "react";
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import { Navigate } from 'react-router-dom';
// import { Box, CircularProgress } from '@mui/material';
// import { useAuth } from './hooks/useAuth';

import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress  } from '@mui/material';


// Pages
import ExploreJobs from "./pages/ExploreJobs";
import MyApplications from "./pages/MyApplications";
import SignupPage from "./pages/SignupPage";
import TempLoginPage from "./pages/TempLoginPage";
import RegisterForm from "./pages/RegisterForm/RegisterForm.jsx";
import LoginForm from "./pages/LoginForm/LoginForm.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";

import DashboardJobSeeker from './pages/DashboardJobSeeker.jsx'
import JobSearchPage from "./pages/JobSearchPage";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateSearchPage from "./pages/CandidateSearchPage";
import CandidateProfilePage from "./pages/CandidateProfilePage";
import JobPostingForm from "./pages/JobPostingForm";
import VideoResumeUpload from './pages/VideoResumeUpload';
import Profile from "./pages/Profile";
import Inbox from './pages/Inbox.jsx';
import LandingPage_ from "./pages/LandingPage_/LandingPage_.jsx";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import JobDetailsPage from "./pages/JobDetailsPage";
import PostJobPage from "./pages/PostJobPage";

import AdminDashboard from './pages/adminDashboard';
import FeedPage from "./pages/FeedPage";
import EmployerExplorePublic from "./pages/EmployerExplorePublic";
import JobSeekerExplorePublic from "./pages/JobSeekerExplorePublic";
import EmployerExplore from "./pages/EmployerExplore";
import JobSeekerExplore from "./pages/JobSeekerExplore";
import SettingsPage from "./pages/SettingsPage";
import EmployerExploreSidebar from "./pages/EmployerExploreSidebar";
import JobseekerExploreSidebar from "./pages/JobseekerExploreSidebar";
import About from "./pages/About/About";
import FAQs from "./pages/FAQ/FAQs";
import VideoFeed_ from './pages/VideoFeed_';
import VideoFeed from "./pages/VideoFeed";
import JobseekerVideoFeed from './pages/JobseekerVideoFeed';
import Chat from './pages/Chat';
import Profile_ from './pages/Profile_';
import JobVideos from './pages/JobVideos';
import CompanyVideos from './pages/CompanyVideos';
import Settings from './pages/Settings';
import JobSeekerDashboard_ from './pages/JobSeekerDashboard_';
import EmployerDashboard_ from './pages/EmployerDashboard_';
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/Unauthorized";
import Linkedincallback from "./pages/Linkedincallback";
import AuthPage from "./pages/auth_page";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { LinearProgress } from '@mui/material';
import { Suspense } from 'react';
import CheckExplorePage from "./pages/CheckExplorePage";
import ExploreLayout from "./components/ExploreLayout";
import EmployerProfile from "./pages/EmployerProfile";
import NotificationsPage from "./pages/NotificationsPage";
import { useAuthContext} from "./hooks/useAuth";
import { Cloudinary } from '@cloudinary/url-gen';

// Initialize once (put this in a separate config file)
const cld = new Cloudinary({
  cloud: {
    cloudName: 'djfvfxrsh' // Replace with yours
  }
});




function App() {
  const { user,role,loading  } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return <AnimatePresence mode="wait">
      <Suspense fallback={<LinearProgress />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/view-login2" element={<TempLoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/FAQs" element={<FAQs />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/register-form" element={<RegisterForm />} />
          <Route path="/authpage" element={<AuthPage />} />
          <Route path="/auth/linkedin/callback" element={<Linkedincallback />} />
          <Route path="/check-it" element={<CheckExplorePage />} />
          <Route path="/explore-layout" element={<ExploreLayout />}>
            <Route path="employer-explore-public" element={<EmployerExplorePublic />} />
            <Route path="job-seeker-explore-public" element={<JobSeekerExplorePublic />} />
          </Route>
          <Route path="/video-feed/:vid?" element={<VideoFeed />} /> 
          <Route path="/jobseeker-video-feed/:vid?" element={<JobseekerVideoFeed />} />

          {/* Private Routes */}

          <Route element={<ProtectedRoute  />}>
            {/*  <Route path="/" element={<Navigate to={user?.role === 'employer' ? '/employer/dashboard' : '/feed'} />} /> */}

            {/* Common Routes */}
            <Route path="/feed" element={<VideoFeed_ />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chat/:conversationId" element={<Chat />} />
            <Route path="/profile" element={<Profile_ />} />
            <Route path="/profile/:userId" element={<Profile_ />} />

            {/* Job Seeker Routes */}
            <Route path="/job-seeker/dashboard" element={<JobSeekerDashboard_ />} />
            <Route path="/job-videos" element={<JobVideos />} />

            {/* Employer Routes */}
            <Route path="/employer/dashboard" element={<EmployerDashboard_ />} />
            <Route path="/company-videos" element={<CompanyVideos />} />
            {/* <Route path="/login-form" element={<LoginForm />} /> */}
            <Route path="/dashboard-jobseeker" element={<DashboardJobSeeker />} />
            <Route path="/job-search" element={<JobSearchPage />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/candidate-search" element={<CandidateSearchPage />} />
            <Route path="/candidate-profile" element={<CandidateProfilePage />} />
            <Route path="/job-posting" element={<JobPostingForm />} />
            <Route path="/video-resume-upload" element={<VideoResumeUpload />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/PagesNavigation" element={<LandingPage_ />} />
            <Route path="/dashboard" element={<JobSeekerDashboard />} />
            <Route path="/search" element={<JobSearchPage />} />
            <Route path="/job/:id" element={<JobDetailsPage />} />
            <Route path="/post-job" element={<PostJobPage />} />

            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/feed-page" element={<FeedPage />} />

            <Route path="/Employer-explore" element={<EmployerExplore />} />
            <Route path="/Employer-explore-sidebar" element={<EmployerExploreSidebar />} />
            <Route path="/Job-seeker-explore" element={<JobSeekerExplore />} />
            <Route path="/jobseeker-explore-sidebar" element={<JobseekerExploreSidebar />} />
            <Route path="/Settings-page" element={<SettingsPage />} />
            <Route path="/MyApplications-page" element={<MyApplications />} />
            <Route path="/notifications" element={<NotificationsPage />} />

            <Route path="/employer-profile" element={<EmployerProfile />} />

            <Route path="/CompanyVideos-page" element={<CompanyVideos />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>;
}

export default App;