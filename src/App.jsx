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
import LoginForm from "./pages/LoginForm/LoginForm.jsx";
import LandingPageNoura from "./pages/LandingPageNoura/LandingPageNoura";
import DashboardJobSeeker from "./pages/DashboardJobSeeker.jsx";
import JobSearchPage from "./pages/JobSearchPage.jsx";
import EmployerDashboard from "./pages/EmployerDashboard.jsx";
import CandidateSearchPage from "./pages/CandidateSearchPage.jsx";
import CandidateProfilePage from "./pages/CandidateProfilePage.jsx";
import About from "./pages/About/About.jsx";
import FAQs from "./pages/FAQ/FAQs.jsx";

function App() {
  console.log("App component loaded");
  return <Router >
      <Routes>
        <Route path="/" element={<LandingPageNoura />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/registerform" element={<RegisterForm />} />
        <Route path="/dashboardjobseeker" element={<DashboardJobSeeker />} />
        <Route path="/jobsearch" element={<JobSearchPage />} />
        <Route path="/employerdashboard" element={<EmployerDashboard />} />
        <Route path="/candidatesearch" element={<CandidateSearchPage />} />
        <Route path="/candidateprofile" element={<CandidateProfilePage />} />

        <Route path="/loginform" element={<LoginForm />} />
        <Route path="/Home2" element={<Home />} />
        <Route path="/explore-jobs" element={<ExploreJobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQs" element={<FAQs />} />
      </Routes>
    </Router>;
}

export default App;
