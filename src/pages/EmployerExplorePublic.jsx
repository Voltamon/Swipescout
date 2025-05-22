import React, { useState } from "react";
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
  ];

  const drawerContent = <Box sx={{ background: `linear-gradient(115deg,rgba(156, 187, 253, 0.73) 10%,rgba(178, 209, 224, 0.73) 60%), url('/backgrounds/bkg2.png')`, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", pt: 2, "& .MuiListItem-root": { color: "rgb(39, 56, 83)", "&.Mui-selected": { color: "#ffffff" } } }}>
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
                if (isMobile) setMobileOpen(false); // close drawer on mobile
                // You can replace navigate("#") with actual routes
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
      {isMobile &&
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
        </IconButton>}

      {/* Responsive Drawer */}
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
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 0,
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
    </Box>
  );
};

const VideoThumbnail = ({ title, experience, thumbnail, onClick }) => {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        aspectRatio: "9/16",
        bgcolor: theme.palette.action.hover,
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
          bgcolor: "rgba(255, 64, 129, 0.7)",
          borderRadius: "50%",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <PlayArrow fontSize="large" />
      </Box>

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

export default EmployerExplorePublic;


