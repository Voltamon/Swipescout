import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Home,
  Search,
  Group,
  Bookmark,
  Settings,
  VideoLibrary,
  Menu,
  PlayArrow,
  Padding
} from "@mui/icons-material";
import { useAuth } from '../hooks/useAuth';
import { useParams } from 'react-router-dom';
import SwipeScoutWatermark from "../components/SwipeScoutWatermark";
import NavigationPanel from "../components/NavigationPanel";
import Header from '../components/Headers/HeaderExplore';

// --- Mock Data for Video Resumes (using Cloudinary URLs from previous example) ---

 const mockVideoResumes = [
    {
    id: '1',
    title: "Corporate Solutions Inc. - Company Overview",
    experience: "Leading Consulting Firm since 2005",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935032/Employer/grfwutcixeecejrsqu7o.mp4'
  }
];


// --- Playable Video Preview Component ---
const PlayableVideoPreview = ({ title, experience, videoUrl, onClick }) => {
  const theme = useTheme();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // Initially paused

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error("Video autoplay on hover failed:", e));
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = 0; // Reset video to start
    }
  };

  return ( <Box>
    <Box
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        aspectRatio: "9/16", // Standard vertical video aspect ratio
        bgcolor: theme.palette.action.hover,
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
        }
      }}
    >
     
      <video
        ref={videoRef}
        src={videoUrl}
        loop // Loop the video preview
        // muted //Mute by default for autoplay on hover
        playsInline // Important for mobile browsers
        preload="metadata" // Load enough data to get duration/dimensions
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.9,
          display: 'block' // Remove extra space below video
        }}
      />

      {/* Play Icon - Visible when not playing on hover */}
      {!isPlaying && (
        <Box
          className="play-icon-overlay"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            bgcolor: "rgba(255, 64, 129, 0.7)", // Pinkish red
            borderRadius: "50%",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 1, // Always visible when paused
            transition: "opacity 0.3s",
          }}
        >
          <PlayArrow fontSize="large" />
        </Box>
      )}


      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
          color: '#fff' // Ensure text is white
        }}
      >
        <Typography variant="subtitle2" color="inherit" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.8)">
          {experience}
        </Typography>
      </Box>
    </Box>
    </Box>
  );
};

// --- EmployerExplorePublic Component ---
const EmployerExplorePublic = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();


  return ( <><Header sx={{ mb: '20px', }} />
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on xs, row on sm+
        minHeight: '100vh',
        
        
      }}
    >
     
      <SwipeScoutWatermark  />

      {/* Navigation Panel Wrapper Box */}
      <Box sx={{
        width: { xs: '100%', sm: '270px' }, // Full width on xs, fixed width on sm+
        p: { xs: 2, sm: 2 }, // Apply padding on both mobile and desktop for consistency
        flexShrink: 0, // Prevent shrinking of the sidebar on desktop
        // Remove mt/mb here, let the parent container's layout or internal padding handle it
      }}>
        <NavigationPanel navigate={navigate} user={user} />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Occupy remaining space on desktop
          p: 2,
          mt: 0, // Reset any default margin-top
          ml: { xs: 0, sm: 0 }, // REMOVE ml for desktop, flexbox handles spacing
          minHeight: { xs: 'auto', sm: '100vh' },
          overflowY: "auto",
          // width: { xs: '100%', sm: 'auto' } // flexGrow will handle width on desktop
        }}
      >
        <Box
          sx={{
            display: "grid",
            // Remove ml: 31 here as it's causing the desktop offset
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2,
            justifyContent: "center",
            maxWidth: "1200px",
            mx: "auto",
          }}
        >
          {mockVideoResumes.map(video =>
            <PlayableVideoPreview
              key={video.id}
              title={video.title}
              experience={video.experience}
              videoUrl={video.videoUrl} // Pass the video URL
              onClick={() => navigate(`/video-feed/${video.id}`)} // Navigate to feed on click
            />
          )}
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default EmployerExplorePublic;