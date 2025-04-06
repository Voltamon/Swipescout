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
function App() {
  console.log("App component loaded");
  return (
  
      <Router>
        <Routes>
          <Route path="/" element={<LandingPageNoura />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/registerform" element={<RegisterForm />} />
          <Route path="/loginform" element={<LoginForm />} />
          <Route path="/Home2" element={<Home />} />
          <Route path="/explore-jobs" element={<ExploreJobs />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    
  );
}

export default App;
