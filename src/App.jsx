import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { Help } from "@mui/icons-material";

// Pages
import ExploreJobs from "./pages/ExploreJobs";
import MyApplications from "./pages/MyApplications";
import SignupPage from "./pages/SignupPage";

import RegisterForm from "./pages/RegisterForm/RegisterForm.jsx";

import DashboardJobSeeker from "./pages/DashboardJobSeeker.jsx";
import JobSearchPage from "./pages/JobSearchPage";
import CandidateSearchPage from "./pages/CandidateSearchPage";

import JobPostingForm from "./pages/JobPostingForm";
import VideoUpload from "./pages/VideoUpload";


import JobDetailsPage from "./pages/JobDetailsPage";

import AdminDashboard from "./pages/adminDashboard";
import FeedPage from "./pages/FeedPage";
import TalentExplore from "./pages/TalentExplore";

import EmployerViedoExamples from "./pages/EmployerViedoExamples";
import JobseekerExploreSidebar from "./pages/JobseekerExploreSidebar";
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
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/Unauthorized";
import Linkedincallback from "./pages/Linkedincallback";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { LinearProgress } from "@mui/material";
import { Suspense } from "react";

import EmployerProfile from "./pages/EmployerProfile";
import NotificationsPage from "./pages/NotificationsPage";
import { useAuth } from "./hooks/useAuth";
import { Cloudinary } from "@cloudinary/url-gen";


// import {SocketProvider} from './hooks/useAuth';

import JobSeekerProfile from "./pages/JobSeekerProfile";
import EditJobSeekerProfile from "./pages/EditJobSeekerProfile";
import EmployerProfilePage from "./pages/EmployerProfilePage";
import JobsListingPage from "./pages/JobsListingPage";
import PostJobPage from "./pages/PostJobPage"; //ok
import { VideoProvider } from "./context/VideoContext";
import VideosPage from "./pages/VideosPage";
import VideoFeedViewer from "./pages/VideoFeedViewer";
import EditEmployerProfilePage from "./pages/EditEmployerProfilePage";
import EditVideoPage from "./pages/EditeVideoPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import JobseekerProfileView from "./pages/JobseekerProfileView";
import EmployerProfileView from "./pages/EmployerProfileView";
import AllVideosPage from "./pages/AllVideosPage";
import HomePage from "./pages/HomePage";
import HomePage_A from "./pages/HomePage_act";
import HowItWorksPage from "./pages/HowItWorks";

import Pricing from "./pages/PricingPage";
import HelpPageLinks from "./pages/HelpPageLinks";
import CustomerSupportPage from "./pages/CustomerSupportPage";
import ContactPage from "./pages/ContactPage";
import EmployerTabs from "./pages/EmployerTabs";
import JobseekerTabs from "./pages/JobseekerTabs";

// Initialize once (put this in a separate config file)
const cld = new Cloudinary({
  cloud: {
    cloudName: "djfvfxrsh" // Replace with yours
  }
});

function App() {
  const { user, role, loading } = useAuth();
  const location = useLocation();

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

  return <AnimatePresence mode="wait">
      <Suspense fallback={<LinearProgress />}>
        <VideoProvider>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/FAQs" element={<FAQs />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/customer-support" element={<CustomerSupportPage />} />
            <Route path="/page-near-future" element={<HomePage_A />} />
            
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/register-form" element={<RegisterForm />} />
            <Route path="/auth/linkedin/callback" element={<Linkedincallback />} />
     
            <Route path="pricing" element={<Pricing />} />
            {/* <Route path="tmp2" element={<Home2 />} /> */}
            {/* <Route path="/explore-layout" element={<ExploreLayout />}>
            </Route> */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:oobCode" element={<ResetPasswordPage />} />
            <Route path="/jobseeker-profile/:userId" element={<JobseekerProfileView />} />
            <Route path="/employer-profile/:userId" element={<EmployerProfileView />} />
            <Route path="/video-feed/:vid?" element={<VideoFeed />} />
            <Route path="/jobseeker-video-feed/:vid?" element={<JobseekerVideoFeed />} />
            <Route path="/videos/:pagetype" element={<AllVideosPage />} />
            <Route path="/video-player/:id" element={<VideoFeedViewer />} />
            {/* <Route path="/video-tabs" element={<VideoTabs />} /> */}
            <Route path="/employer-tabs" element={<EmployerTabs />} />
            <Route path="/jobseeker-tabs" element={<JobseekerTabs />} />

            {/* Private Routes */}

            <Route element={<ProtectedRoute />}>
        
              
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:conversationId" element={<Chat />} />
              <Route path="/settings" element={<Settings />} />

              {/* Job Seeker Routes */}
              <Route path="/jobseeker-dashboard" element={<JobSeekerDashboard />} /> {/*  this analytics page */}
              <Route path="/job-videos" element={<JobVideos />} />
              {/* Employer Routes */}
              <Route path="/employer-dashboard" element={<EmployerDashboard />} /> {/* -- Employer /> */}
              <Route path="/company-videos" element={<CompanyVideos />} />
              {/* <Route path="/login-form" element={<LoginForm />} /> */}
              {/* <Route path="/dashboard-jobseeker" element={<DashboardJobSeeker />} /> */}
              
              <Route path="/candidate-search" element={<CandidateSearchPage />} />
              <Route path="/Telent-explore" element={<TalentExplore />} />
              <Route path="/job-search" element={<JobSearchPage />} />
              <Route path="/CompanyVideos-page" element={<CompanyVideos />} />
              
              <Route path="/job-posting" element={<JobPostingForm />} />
              <Route path="/video-upload" element={<VideoUpload />} />  {/* -- Employer and jobseeker /> */}
            
              
              <Route path="/job/:id" element={<JobDetailsPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/feed-page" element={<FeedPage />} />
              <Route path="/Employer-explore-sidebar" element={<EmployerViedoExamples />} /> {/* Example Videos  */}
              <Route path="/Explore-jobs" element={<ExploreJobs />} />
              <Route path="/jobseeker-explore-sidebar" element={<JobseekerExploreSidebar />} />   {/* Example Videos  */}
          
              <Route path="/MyApplications-page" element={<MyApplications />} />
              <Route path="/notifications" element={<NotificationsPage />} />

              
              <Route path="/Job-seeker-profile" element={<JobSeekerProfile />} />
              <Route path="/employer-profile" element={<EmployerProfilePage />} />
              <Route path="/edit-JobSeeker-Profile" element={<EditJobSeekerProfile />} />
              <Route path="/Jobs-Listing-Page" element={<JobsListingPage />} />
              <Route path="/Post-job-page" element={<PostJobPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/help" element={<HelpPageLinks />} />
  

              <Route path="/edit-employer-profile" element={<EditEmployerProfilePage />} />
              <Route path="/edit-video/:id" element={<EditVideoPage />} />
            </Route>
          </Routes>
        </VideoProvider>
      </Suspense>
    </AnimatePresence>;
}

export default App;
