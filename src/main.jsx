import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.jsx"; // explicitly import .jsx to avoid Vite resolving App.js
import "./index.css";

// Get root element
const container = document.getElementById("root");

// Create root
const root = createRoot(container); // Modern React 18+ syntax

// Render app
root.render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </BrowserRouter>
);