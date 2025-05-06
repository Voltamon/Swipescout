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
import LandingPage from "./pages/LandingPage/LandingPage.jsx";

import DashboardJobSeeker from './pages/DashboardJobSeeker.jsx'
import JobSearchPage from "./pages/JobSearchPage";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateSearchPage from "./pages/CandidateSearchPage";
import CandidateProfilePage from "./pages/CandidateProfilePage.jsx";
import JobPostingForm from "./pages/JobPostingForm.jsx";
import VideoResumeUpload from './pages/VideoResumeUpload.jsx';
import Profile from "./pages/Profile";
import Inbox from './pages/Inbox.jsx';
import LandingPage_ from "./pages/LandingPage_/LandingPage_.jsx";
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/view-login" element={<TempLoginPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQs" element={<FAQs />} />

        {/* Private Routes */}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <Routes>
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
                <Route path="/PagesNavigation" element={<LandingPage_ />} />
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
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
