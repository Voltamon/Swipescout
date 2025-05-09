// import React from "react";
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import { Navigate } from 'react-router-dom';
// import { Box, CircularProgress } from '@mui/material';
// import { useAuth } from './hooks/useAuth';

import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './hooks/useAuth';

// Pages
import ExploreJobs from "./pages/ExploreJobs";
import MyApplications from "./pages/MyApplications";
import SignupPage from "./pages/SignupPage";
import TempLoginPage from "./pages/TempLoginPage";
import RegisterForm from "./pages/RegisterForm/RegisterForm";
import LoginForm from "./pages/LoginForm/LoginForm";
import LandingPageNoura from "./pages/LandingPageNoura/LandingPageNoura";
import DashboardJobSeeker from './pages/DashboardJobSeeker';
import JobSearchPage from "./pages/JobSearchPage";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateSearchPage from "./pages/CandidateSearchPage";
import CandidateProfilePage from "./pages/CandidateProfilePage";
import JobPostingForm from "./pages/JobPostingForm";
import VideoResumeUpload from './pages/VideoResumeUpload';
import Profile from "./pages/Profile";
import Inbox from './pages/Inbox';
import LandingPage from "./pages/LandingPage/LandingPage";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import JobDetailsPage from "./pages/JobDetailsPage";
import PostJobPage from "./pages/PostJobPage";
import AuthPage from "./pages/authPage";
import AdminDashboard from './pages/adminDashboard';
import FeedPage from "./pages/FeedPage";
import VideoFeed from "./pages/VideoFeed";
import EmployerExplore from "./pages/EmployerExplore";
import JobSeekerExplore from "./pages/JobSeekerExplore";
import SettingsPage from "./pages/SettingsPage";
import EmployerExploreSidebar from "./pages/EmployerExploreSidebar";
import About from "./pages/About/About";
import FAQs from "./pages/FAQ/FAQs";
import VideoFeed_ from './pages/VideoFeed_';
import Chat from './pages/Chat';
import Profile_ from './pages/Profile_';
import JobVideos from './pages/JobVideos';
import CompanyVideos from './pages/CompanyVideos';
import Settings from './pages/Settings';
import JobSeekerDashboard_ from './pages/JobSeekerDashboard_';
import EmployerDashboard_ from './pages/EmployerDashboard_';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPageNoura />} />
      <Route path="/view-login" element={<TempLoginPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/FAQs" element={<FAQs />} />

      {/* Private Routes */}     
      <Route element={<ProtectedRoute user={user} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to={user?.role === 'employer' ? '/employer/dashboard' : '/feed'} />} />
          
          {/* Common Routes */}
          <Route path="/feed" element={<VideoFeed_ />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:conversationId" element={<Chat />} />
          <Route path="/profile" element={<Profile_ />} />
          <Route path="/profile/:userId" element={<Profile_ />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Job Seeker Routes */}
          <Route path="/job-seeker/dashboard" element={<JobSeekerDashboard_ />} />
          <Route path="/job-videos" element={<JobVideos />} />
          
          {/* Employer Routes */}
          <Route path="/employer/dashboard" element={<EmployerDashboard_ />} />
          <Route path="/company-videos" element={<CompanyVideos />} />
          <Route path="/register-form" element={<RegisterForm />} />
          <Route path="/login-form" element={<LoginForm />} />
          <Route path="/dashboard-jobseeker" element={<DashboardJobSeeker />} />
          <Route path="/job-search" element={<JobSearchPage />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/candidate-search" element={<CandidateSearchPage />} />
          <Route path="/candidate-profile" element={<CandidateProfilePage />} />
          <Route path="/job-posting" element={<JobPostingForm />} />
          <Route path="/video-resume-upload" element={<VideoResumeUpload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/PagesNavigation" element={<LandingPage />} />
          <Route path="/dashboard" element={<JobSeekerDashboard />} />
          <Route path="/search" element={<JobSearchPage />} />
          <Route path="/job/:id" element={<JobDetailsPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="/auth-page" element={<AuthPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/feed-page" element={<FeedPage />} />
          <Route path="/video-feed" element={<VideoFeed />} />
          <Route path="/Employer-explore" element={<EmployerExplore />} />
          <Route path="/Job-seeker-explore" element={<JobSeekerExplore />} />
          <Route path="/Employer-explore-sidebar" element={<EmployerExploreSidebar />} />
          <Route path="/Settings-page" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;