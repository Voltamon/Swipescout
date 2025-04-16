import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home2 from "./pages/Home2";//to remove later
import ExploreJobs from "./pages/ExploreJobs"; //to remove later
import MyApplications from "./pages/MyApplications"; //to remove later
import Profile from "./pages/Profile"; //check if to remove later
import "./App.css";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import JobSearchPage from "./pages/JobSearchPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJobPage from "./pages/PostJobPage";
import CandidateSearchPage from "./pages/CandidateSearchPage";
import AuthPage from "./pages/authPage";
import LinkedInLoginButton from './pages/LinkedInLoginButton';
import AdminDashboard from './pages/adminDashboard';
import FeedPage from "./pages/FeedPage";
import VideoFeed from "./pages/VideoFeed";
import EmployerExplore from "./pages/EmployerExplore";
import JobSeekerExplore from "./pages/JobSeekerExplore";
import SettingsPage from "./pages/SettingsPage";
import EmployerExploreSidebar from "./pages/EmployerExploreSidebar";

import RegisterForm from "./pages/RegisterForm/RegisterForm.jsx";
import LoginForm from "./pages/LoginForm/LoginForm.jsx"
import LandingPageNoura from "./pages/LandingPageNoura/LandingPageNoura";
import DashboardJobSeeker from './pages/DashboardJobSeeker.jsx'
import CandidateProfilePage from "./pages/CandidateProfilePage.jsx";
import JobPostingForm from "./pages/JobPostingForm.jsx";
import VideoResumeUpload from './pages/VideoResumeUpload.jsx'
import Inbox from './pages/Inbox.jsx'

function App() {
  console.log("App component loaded");
  return (
  
      <Router>
        <Routes>
          <Route path="/" element={<LandingPageNoura />} />
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


        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/Home2" element={<Home2 />} />
        <Route path="/explore-jobs" element={<ExploreJobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/profile" element={<Profile />} /> */}
        <Route path="/dashboard" element={<JobSeekerDashboard />} />
        <Route path="/search" element={<JobSearchPage />} />
        <Route path="/job/:id" element={<JobDetailsPage />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/candidate-search" element={<CandidateSearchPage />} />
        <Route path="/auth-page" element={<AuthPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* <Route path="/auth-page2" element={<LinkedInLoginButton />} /> */}
        {/* <Route path="/linkedin" element={<LinkedInCallback />} /> */}
        <Route path="/feed-page" element={<FeedPage />} />
        <Route path="/video-feed" element={<VideoFeed />} />
        <Route path="/Employer-explore" element={<EmployerExplore />} />
        <Route path="/Job-seeker-explore" element={<JobSeekerExplore />} />
        <Route path="/Employer-explore-sidebar" element={<EmployerExploreSidebar />} />
        <Route path="/Settings-page" element={<SettingsPage />} />
      </Routes>
    </Router>
    
  );
}

export default App;
