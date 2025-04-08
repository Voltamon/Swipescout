import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ExploreJobs from "./pages/ExploreJobs";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RegisterForm from "./pages/RegisterForm/RegisterForm.jsx";
import LoginForm from "./pages/LoginForm/LoginForm.jsx"
import LandingPageNoura from "./pages/LandingPageNoura/LandingPageNoura";
import DashboardJobSeeker from './pages/DashboardJobSeeker.jsx'
import JobSearchPage from "./pages/JobSearchPage.jsx";
import EmployerDashboard from './pages/EmployerDashboard.jsx'
import CandidateSearchPage from "./pages/CandidateSearchPage.jsx";
import CandidateProfilePage from "./pages/CandidateProfilePage.jsx";
import JobPostingForm from "./pages/JobPostingForm.jsx";

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

        </Routes>
      </Router>
    
  );
}

export default App;
