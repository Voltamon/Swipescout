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
  PlayArrow
} from "@mui/icons-material";


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

  return (
    <Box
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
         pt:2,
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
  );
};

// --- EmployerExplorePublic Component ---
const EmployerExplorePublic = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerWidthDesktop = 80;
  const drawerWidthMobile = 60;

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = <Box sx={{
  //backgroundclr
        height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", pt: 2, "& .MuiListItem-root": { color: "rgb(39, 56, 83)", "&.Mui-selected": { color: "#ffffff" } } }}>
      <Avatar src="/employer-logo.png" sx={{ width: isMobile ? 36 : 48, height: isMobile ? 36 : 48, mb: 3, border: `2px solid ${theme.palette.text.primary}` }} />

      <List sx={{ width: "100%" }}>
        {[{ icon: <Home fontSize={isMobile ? "small" : "medium"} />, value: "home" }, { icon: <Search fontSize={isMobile ? "small" : "medium"} />, value: "search" }, { icon: <Group fontSize={isMobile ? "small" : "medium"} />, value: "candidates" }, { icon: <Bookmark fontSize={isMobile ? "small" : "medium"} />, value: "saved" }, { icon: <VideoLibrary fontSize={isMobile ? "small" : "medium"} />, value: "video-resumes" }].map(
          item =>
            <ListItem
              key={item.value}
              component="div"
              selected={activeTab === item.value}
              onClick={() => {
                setActiveTab(item.value);
                if (isMobile) setMobileOpen(false);
                if (item.value === "home") navigate("/");
              }}
              sx={{
                justifyContent: "center",
                py: 0,
                cursor: "pointer",
                "&.Mui-selected": {
                  borderLeft: `3px solid ${theme.palette.primary.main}`
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  color:
                    activeTab === item.value
                      ? theme.palette.primary.main
                      : theme.palette.text.primary
                }}
              >
                {item.icon}
              </ListItemIcon>
            </ListItem>
        )}
      </List>

      <Box sx={{ mt: "auto", pb: 2, display: "flex", justifyContent: "center" }}>
        <IconButton sx={{ color: theme.palette.text.white, p: isMobile ? 0.5 : 1 }}>
          <Settings fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>
    </Box>;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile Menu Icon */}
      {/* {isMobile && (
        <IconButton
          color="#ffffff"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            color: "#ffffff",
          }}
        >
          <Menu />
        </IconButton>
      )}

       Responsive Drawer 
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isMobile ? drawerWidthMobile : drawerWidthDesktop,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? drawerWidthMobile : drawerWidthDesktop,
            boxSizing: "border-box",
            borderRight: "none",
            bgcolor: theme.palette.background.paper,
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
        {drawerContent}
      </Drawer> */}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 0,
          pl:5,
          height: "100vh",
           bgcolor: 'background.jobseeker',
          overflowY: "auto"
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2
          }}
        >
          {mockVideoResumes.map(video => (
            <PlayableVideoPreview
              key={video.id}
              title={video.title}
              experience={video.experience}
              videoUrl={video.videoUrl} // Pass the video URL
              onClick={() => navigate(`/video-feed/${video.id}`)} // Navigate to feed on click
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerExplorePublic;

 