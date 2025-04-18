import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./pages/PrivateRoute";


import ExploreJobs from "./pages/ExploreJobs";
import MyApplications from "./pages/MyApplications";
import "./App.css";

import SignupPage from "./pages/SignupPage";


import TempLoginPage from "./pages/TempLoginPage";
import RegisterForm from "./pages/RegisterForm/RegisterForm.jsx";
import LoginForm from "./pages/LoginForm/LoginForm.jsx";
import LandingPageNoura from "./pages/LandingPageNoura/LandingPageNoura.jsx";

import DashboardJobSeeker from './pages/DashboardJobSeeker.jsx'
import JobSearchPage from "./pages/JobSearchPage";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateSearchPage from "./pages/CandidateSearchPage";
import CandidateProfilePage from "./pages/CandidateProfilePage.jsx";
import JobPostingForm from "./pages/JobPostingForm.jsx";
import VideoResumeUpload from './pages/VideoResumeUpload.jsx';
import Profile from "./pages/Profile";
import Inbox from './pages/Inbox.jsx';
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
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
import About from "./pages/About/About.jsx";
import FAQs from "./pages/FAQ/FAQs.jsx";

import {  Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './hooks/useAuth';

// استيراد الصفحات
// import Login from './pages/Login';
// import Register from './pages/Register';
import VideoFeed_ from './pages/VideoFeed_';
import Chat from './pages/Chat';
import Profile_ from './pages/Profile_';
import JobVideos from './pages/JobVideos';
import CompanyVideos from './pages/CompanyVideos';
import Settings from './pages/Settings';
import JobSeekerDashboard_ from './pages/JobSeekerDashboard_';
import EmployerDashboard_ from './pages/EmployerDashboard_';
// import NotFound from './pages/NotFound';

// استيراد المكونات
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
      {/* المسارات العامة */}
      {/* <Route path="/login" element={!user ? <Login /> : <Navigate to="/feed" />} /> */}
      {/* <Route path="/register" element={!user ? <Register /> : <Navigate to="/feed" />} /> */}
         {/* Public Routes */}
         <Route path="/" element={<LandingPageNoura />} />
        <Route path="/view-login" element={<TempLoginPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQs" element={<FAQs />} />

        {/* Private Routes */}     
      {/* المسارات المحمية */}
      <Route element={<ProtectedRoute user={user} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to={user?.role === 'employer' ? '/employer/dashboard' : '/feed'} />} />
          
          {/* مسارات مشتركة */}
          <Route path="/feed" element={<VideoFeed_ />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:conversationId" element={<Chat />} />
          <Route path="/profile" element={<Profile_ />} />
          <Route path="/profile/:userId" element={<Profile_ />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* مسارات الباحث عن عمل */}
          <Route path="/job-seeker/dashboard" element={<JobSeekerDashboard_ />} />
          <Route path="/job-videos" element={<JobVideos />} />
          
          {/* مسارات صاحب العمل */}
          <Route path="/employer/dashboard" element={<EmployerDashboard_ />} />
          <Route path="/company-videos" element={<CompanyVideos />} />
          <Route path="/register-form" element={<RegisterForm />} />
              <Route path="/login-form" element={<LoginForm />} />
                <Route path="/dashboard-jobseeker" element={<DashboardJobSeeker_ />} />
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
      
      {/* مسار غير موجود */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;

