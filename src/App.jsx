import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LinearProgress } from "@mui/material";

// Pages
import LandingPage from "./pages/LandingPage/LandingPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import TeamsPage from "./pages/Teams/TeamsPage";
import TeamMemberBioPage from "./pages/Teams/TeamMemberBioPage";

// Layouts & Components
import PublicLayout from "./layouts/PublicLayout";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsentBanner from "./components/CookieConsentBanner";
import { Toaster } from './components/UI/toaster';

// Styles
import "./index.css";
import "./i18n/index.js";

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Suspense fallback={<LinearProgress />}>
          <Routes location={location} key={location.pathname}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/teams/:id" element={<TeamMemberBioPage />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <CookieConsentBanner />
          <Toaster />
        </Suspense>
      </AnimatePresence>
    </>
  );
}

export default App;
// No code changes required in this frontend file for CORS fix.
