import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Typography,
  Avatar
} from "@mui/material";
import {
  Home,
  Search,
  Group,
  Bookmark,
  Settings,
  VideoLibrary,
  PlayArrow
} from "@mui/icons-material";

const EmployerExplorePage = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const navigate = useNavigate();

  // Mock video data - replace with your actual data
  const videoResumes = [
    {
      id: 1,
      title: "Frontend Developer",
      experience: "3 years",
      thumbnail: "/placeholder1.jpg"
    },
    {
      id: 2,
      title: "UX Designer",
      experience: "2 years",
      thumbnail: "/placeholder2.jpg"
    },
    {
      id: 3,
      title: "Backend Engineer",
      experience: "5 years",
      thumbnail: "/placeholder3.jpg"
    }
    // Add more videos as needed
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#000" }}>
      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 80,
            boxSizing: "border-box",
            borderRight: "none",
            backgroundColor: "#121212",
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 2
          }}
        >
          <Avatar
            src="/employer-logo.png"
            sx={{
              width: 48,
              height: 48,
              mb: 3,
              border: "2px solid #fff"
            }}
          />

          <List sx={{ width: "100%" }}>
            {[
              { icon: <Home />, value: "home" },
              { icon: <Search />, value: "search" },
              { icon: <Group />, value: "candidates" },
              { icon: <Bookmark />, value: "saved" },
              { icon: <VideoLibrary />, value: "video-resumes" }
            ].map(item =>
              <ListItem
                key={item.value}
                component="div"
                selected={activeTab === item.value}
                onClick={() => setActiveTab(item.value)}
                sx={{
                  justifyContent: "center",
                  py: 2,
                  cursor: "pointer",
                  "&.Mui-selected": {
                    borderLeft: "3px solid #ff4081"
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    color: activeTab === item.value ? "#ff4081" : "#fff"
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </ListItem>
            )}
          </List>
        </Box>

        <Box
          sx={{ mt: "auto", pb: 2, display: "flex", justifyContent: "center" }}
        >
          <IconButton sx={{ color: "#fff" }}>
            <Settings />
          </IconButton>
        </Box>
      </Drawer>

      {/* Main Content Area - Video Grid */}
      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 2,
          p: 2,
          overflowY: "auto",
          backgroundColor: "#000"
        }}
      >
        {videoResumes.map(video =>
          <VideoThumbnail
            key={video.id}
            title={video.title}
            experience={video.experience}
            thumbnail={video.thumbnail}
            onClick={() => navigate(`/feed/${video.id}`)}
          />
        )}
      </Box>
    </Box>
  );
};

const VideoThumbnail = ({ title, experience, thumbnail, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        aspectRatio: "9/16",
        backgroundColor: "#333",
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          "& .play-icon": {
            opacity: 1
          }
        }
      }}
    >
      {/* Video Thumbnail */}
      <Box
        component="img"
        src={thumbnail}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.9
        }}
      />

      {/* Play Button Overlay */}
      <Box
        className="play-icon"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          transition: "opacity 0.3s",
          color: "#fff",
          backgroundColor: "rgba(255, 64, 129, 0.7)",
          borderRadius: "50%",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <PlayArrow fontSize="large" />
      </Box>

      {/* Video Info Overlay */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background: "linear-gradient(transparent, rgba(0,0,0,0.8))"
        }}
      >
        <Typography variant="subtitle2" color="#fff" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.8)">
          {experience} experience
        </Typography>
      </Box>
    </Box>
  );
};

export default EmployerExplorePage;
