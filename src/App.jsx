import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";

// Pages
// Pages
const LandingPage = React.lazy(() => import("./pages/LandingPage/LandingPage"));
const GalleryPage = React.lazy(() => import("./pages/GalleryPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const TeamsPage = React.lazy(() => import("./pages/Teams/TeamsPage"));
const TeamMemberBioPage = React.lazy(() => import("./pages/Teams/TeamMemberBioPage"));
const WaitlistPage = React.lazy(() => import("./pages/WaitlistPage"));

// Layouts & Components
import PublicLayout from "./layouts/PublicLayout";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsentBanner from "./components/CookieConsentBanner";
import { Toaster } from './components/UI/toaster';

// Styles
import "./index.css";
import "./i18n/index.js";

function App() {


  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LinearProgress />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:id" element={<TeamMemberBioPage />} />
          </Route>

          <Route path="/waitlist" element={<WaitlistPage />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <CookieConsentBanner />
        <Toaster />
      </Suspense>
    </>
  );
}

export default App;
// No code changes required in this frontend file for CORS fix.
