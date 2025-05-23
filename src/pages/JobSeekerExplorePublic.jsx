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
    title: "Full Stack Developer",
    experience: "5 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935204/Jobseeker/wvepwzroiy6s942idqal.mp4'
  },
  {
    id: '2',
    title: "Mobile App Developer",
    experience: "3 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935204/Jobseeker/mrghiax1ijujzwzg5uwg.mp4'
  },
  {
    id: '3',
    title: "Data Analyst",
    experience: "4 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935199/Jobseeker/yioadeex8ubryf1uy8su.mp4'
  },
  {
    id: '4',
    title: "Cloud Architect",
    experience: "7 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935200/Jobseeker/mn3dew4rgwaaji9z23xd.mp4'
  },
  {
    id: '5',
    title: "Technical Writer",
    experience: "2 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935200/Jobseeker/fgb77awqtyrh5praep5u.mp4'
  },
  {
    id: '6',
    title: "Network Engineer",
    experience: "6 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935198/Jobseeker/ghqvk7qvqipsocpet1gp.mp4'
  },
  {
    id: '7',
    title: "DevOps Specialist",
    experience: "5 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935195/Jobseeker/oqzzdjldzfgd0qpratac.mp4'
  },
  {
    id: '8',
    title: "Cybersecurity Analyst",
    experience: "3 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935197/Jobseeker/vsae57raurfootdj5pvi.mp4'
  },
  {
    id: '9',
    title: "Game Developer",
    experience: "4 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935196/Jobseeker/h5qg3cfiszmjefiquvrm.mp4'
  },
  {
    id: '10',
    title: "Product Manager",
    experience: "8 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935194/Jobseeker/zedgzvmwlurqi4zhhluw.mp4'
  },
  {
    id: '11',
    title: "AI Engineer",
    experience: "6 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935193/Jobseeker/wjlhdsvjbg6pwwe8heoy.mp4'
  },
  {
    id: '12',
    title: "UI/UX Designer",
    experience: "3 years",
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935193/Jobseeker/ds9oofsbwgtntxt3zgxx.mp4'
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
        loop // Loop the video preview
        //muted // Mute by default for autoplay on hover
        playsInline // Important for mobile browsers
        preload="metadata" // Load enough data to get duration/dimensions
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.9,
          display: 'block' // Remove extra space below video
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        {/* Fallback text for browsers that don't support the video tag */}
        Your browser does not support the video tag.
      </video>

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
          {experience} experience
        </Typography>
      </Box>
    </Box>
  );
};

// --- JobseekerExplorePage Component ---
const JobseekerExplorePage = () => {
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

  const drawerContent = (
    <Box
      sx={{
        background: `linear-gradient(115deg,rgba(156, 187, 253, 0.73) 10%,rgba(178, 209, 224, 0.73) 60%), url('/backgrounds/bkg2.png')`,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 2,
        "& .MuiListItem-root": { color: "rgb(39, 56, 83)", "&.Mui-selected": { color: "#ffffff" } }
      }}
    >
      <Avatar src="/employer-logo.png" sx={{ width: isMobile ? 36 : 48, height: isMobile ? 36 : 48, mb: 3, border: `2px solid ${theme.palette.text.primary}` }} />

      <List sx={{ width: "100%" }}>
        {[
          { icon: <Home fontSize={isMobile ? "small" : "medium"} />, value: "home" },
          { icon: <Search fontSize={isMobile ? "small" : "medium"} />, value: "search" },
          { icon: <Group fontSize={isMobile ? "small" : "medium"} />, value: "candidates" },
          { icon: <Bookmark fontSize={isMobile ? "small" : "medium"} />, value: "saved" },
          { icon: <VideoLibrary fontSize={isMobile ? "small" : "medium"} />, value: "video-resumes" }
        ].map(item => (
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
              py: 2,
              cursor: "pointer",
              "&.Mui-selected": {
                borderLeft: `3px solid ${theme.palette.primary.main}`
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "auto",
                color: activeTab === item.value ? theme.palette.primary.main : theme.palette.text.primary
              }}
            >
              {item.icon}
            </ListItemIcon>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: "auto", pb: 2, display: "flex", justifyContent: "center" }}>
        <IconButton sx={{ color: theme.palette.text.white, p: isMobile ? 0.5 : 1 }}>
          <Settings fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile Menu Icon */}
      {/*{isMobile && (
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
      </Drawer>*/}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 0,
          pl:5,
          height: "100vh",
          background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%), url('/backgrounds/bkg1.png')`,
          backgroundSize: "auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
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
              onClick={() => navigate(`/jobseeker-video-feed/${video.id}`)} // Navigate to feed on click
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default JobseekerExplorePage;
