
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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


function App() {
  

  return <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/Home2" element={<Home2 />} />
        <Route path="/explore-jobs" element={<ExploreJobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<JobSeekerDashboard />} />
        <Route path="/search" element={<JobSearchPage />} />
        <Route path="/job/:id" element={<JobDetailsPage />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/candidate-search" element={<CandidateSearchPage />} />
      </Routes>
    </Router>;
}

export default App
