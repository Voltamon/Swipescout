// src/components/VideoFeedViewer.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IconButton,
  Typography,
  Box,
  Avatar,
  Button,
  Stack,
  Chip,
  styled
} from "@mui/material";
import {
  VolumeUp,
  VolumeOff,
  Bookmark,
  BookmarkBorder,
  Share,
  ArrowBack,
  ArrowUpward,
  ArrowDownward,
  Favorite,
  FavoriteBorder,
  MoreVert
} from "@mui/icons-material";
import api from "@/services/api";
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import JobseekerProfileView from "./JobseekerProfileView";
import EmployerProfileView from "./EmployerProfileView";
import { Dialog, DialogContent } from "@mui/material";
import { Close } from "@mui/icons-material";

// Styled components for consistent styling
const OverlayContent = styled("div")({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: "16px",
  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
  color: "#fff",
  zIndex: 1
});

const RightActionBar = styled("div")({
  position: "absolute",
  right: "16px",
  bottom: "120px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
  zIndex: 2
});

const ActionButton = styled(IconButton)({
  color: "#fff",
  backgroundColor: "rgba(0,0,0,0.3)",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.5)"
  }
});

const ConnectButton = styled(Button)({
  position: "absolute",
  right: "16px",
  bottom: "16px",
  zIndex: 2,
  backgroundColor: "#1976d2",
  color: "#fff",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#1565c0"
  }
});

// ProfileDialog component for displaying user profiles
const ProfileDialog = ({ open, onClose, role, userId }) => {
  const navigate = useNavigate();
  

  // Handles navigation to the full profile page
  const handleViewFullProfile = () => {
    onClose(); // Close the dialog
    if (role === "employer") {
      navigate(`/employer-profile/${userId}`);
    } else if (role === "job_seeker") {
      navigate(`/jobseeker-profile/${userId}`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          height: "90vh",
          borderRadius: "12px"
        }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 1
        }}
      >
        <Close />
      </IconButton>
      <DialogContent sx={{ p: 0 }}>
        {/* Conditionally render Jobseeker or Employer profile view based on role */}
        {role === "employer"
          ? <EmployerProfileView userId={userId} isDialog />
          : role === "job_seeker"
            ? <JobseekerProfileView userId={userId} isDialog />
            : null}
      </DialogContent>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={handleViewFullProfile}
          sx={{ mt: 2 ,p:1  ,width:180, height: 26, fontSize: 11, fontWeight: "bold" ,color: "rgb(182, 211, 245)", backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#1565c0" }}}
        >
          View Full Page
        </Button>
      </Box>
    </Dialog>
  );
};

// MoreOptionsDialog component for additional video options
const MoreOptionsDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h6">More Options</Typography>
        <Button onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
        {/* Add more options here like "Report", "Share" etc. */}
      </DialogContent>
    </Dialog>
  );
};

const VideoFeedViewer = () => {
  const { state } = useLocation();
  const { currentVideo, allVideos = [], initialPage = 1 } = state || {};
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const navigate = useNavigate();

  const [mutedStates, setMutedStates] = useState({}); // State to manage mute status of individual videos (currently not used for individual mute but can be extended)
  const [playingStates, setPlayingStates] = useState({}); // State to manage playing status of individual videos (currently not used for individual play/pause but can be extended)
  const [videos, setVideos] = useState(allVideos);
  const [page, setPage] = useState(initialPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Global mute state for all videos
  const { role, user } = useAuth();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false); // State for the ProfileDialog
  const [moreOptionsDialogOpen, setMoreOptionsDialogOpen] = useState(false); // State for the MoreOptionsDialog
  const [selectedProfile, setSelectedProfile] = useState({
    role: "",
    userId: ""
  });

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


  // Scroll to selected video on load
  useEffect(
    () => {
      const index = videos.findIndex(v => v.id === currentVideo.id);
      if (index !== -1 && containerRef.current) {
        setCurrentVideoIndex(index);
        setTimeout(() => {
          containerRef.current.scrollTo({
            top: index * window.innerHeight,
            behavior: "instant" // Use "instant" for immediate scroll on initial load
          });
        }, 50);
      }
    },
    [currentVideo, videos]
  );

  // Intersection Observer for video auto-play/pause
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {}); // Attempt to play, catch errors if playback is blocked
          } else {
            video.pause();
            video.currentTime = 0; // Reset video to beginning when out of view
          }
        });
      },
      {
        threshold: 0.6 // Video is considered "intersecting" when 60% of it is visible
      }
    );

    // Observe all video elements
    Object.values(videoRefs.current).forEach(video => {
      if (video) observer.observe(video);
    });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  // Infinite scroll logic
  useEffect(
    () => {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        // Check if user is near the bottom of the scrollable area
        if (
          scrollTop + clientHeight >= scrollHeight - 50 &&
          hasMore && // Only load more if there's more content available
          !loadingMore // Prevent multiple simultaneous load requests
        ) {
          loadNextPage();
        }
      };

      const el = containerRef.current;
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    },
    [loadingMore, hasMore] // Dependencies for the effect
  );

  // Fetches the next page of videos
  const loadNextPage = async () => {
    setLoadingMore(true); // Set loading state to true
    try {
      const res = await api.get(`/videos/all/?page=${page + 1}&limit=10`);
      
      const newVideos = res.data.videos;
      if (!newVideos || newVideos.length === 0) {
        setHasMore(false); // No more videos to load
      } else {
        setVideos(prev => [...prev, ...newVideos]); // Append new videos to existing ones
        setPage(prev => prev + 1); // Increment page number
      }
      console.log("Fetched more videos::::::::: ", videos);
    } catch (err) {
      console.error("Failed to fetch more videos", err);
    } finally {
      setLoadingMore(false); // Reset loading state
    }
  };

  // Toggles global mute state
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // Toggles play/pause for a specific video (currently not fully utilized with auto-play)
  const togglePlay = id => {
    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayingStates(prev => ({ ...prev, [id]: true }));
      } else {
        video.pause();
        setPlayingStates(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  // Scrolls to the next video
  const handleSwipeUp = () => {
    if (currentVideoIndex < videos.length - 1) {
      const newIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newIndex);
      containerRef.current.scrollTo({
        top: newIndex * window.innerHeight,
        behavior: "smooth"
      });
    }
  };

  // Opens the profile dialog
  const openProfileDialog = (role, userId) => {
   
    setSelectedProfile({ role, userId });
    setProfileDialogOpen(true);
  };

  // Closes the profile dialog
  const closeProfileDialog = () => {
    setProfileDialogOpen(false);
  };

  // Scrolls to the previous video
  const handleSwipeDown = () => {
    if (currentVideoIndex > 0) {
      const newIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(newIndex);
      containerRef.current.scrollTo({
        top: newIndex * window.innerHeight,
        behavior: "smooth"
      });
    }
  };

  // Opens the current user's profile if authenticated
  const openProfile = (video) => {
    if (video.user?.role === "employer" || video.user?.role === "job_seeker") {
     
      
      openProfileDialog(video.user?.role, video.user?.id);
    }
  };

  const toggleLike = () => {
    // Implement like functionality
  };

  const toggleSave = () => {
    // Implement save functionality
  };

  // Opens the more options dialog
  const handleOpenDialog = () => {
    setMoreOptionsDialogOpen(true);
  };

  // Closes the more options dialog
  const handleCloseDialog = () => {
    setMoreOptionsDialogOpen(false);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        mt: "0px",
        backgroundColor: "black"
      }}
    >
      {videos.map((video, index) =>
        <Box
          key={video.id}
          sx={{
            height: "100vh",
            scrollSnapAlign: "start",
            position: "relative",
            backgroundColor: "black"
          }}
        >
          <video
            ref={el => (videoRefs.current[video.id] = el)}
            src={video.videoUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              cursor: "pointer",
              backgroundColor: "black"
            }}
            muted={isMuted}
            loop
            playsInline
            autoPlay
            onClick={() => togglePlay(video.id)}
          />

          {/* Title and info */}
          <Box
            sx={{
              position: "absolute",
              bottom: "80px",
              left: "20px",
              color: "white",
              zIndex: 10
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff" }}>
              {video.video_title || "Untitled"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff" }}>
              {video.video_type}
            </Typography>
          </Box>

          {/* Mute/Unmute icon */}
          <IconButton
            onClick={toggleMute}
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              zIndex: 100
            }}
          >
            {isMuted ? <VolumeOff /> : <VolumeUp />}
          </IconButton>

          {/* Back button */}
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              top: "20px",
              left: "20px",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              zIndex: 100
            }}
          >
            <ArrowBack />
          </IconButton>

          {/* Overlay Content (Bottom Left) */}
          <OverlayContent>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {(video.tags || []).map((tag, index) =>
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    backdropFilter: "blur(10px)"
                  }}
                />
              )}
            </Stack>
          </OverlayContent>

          {/* Right Action Bar */}
          <RightActionBar>
            <IconButton
              sx={{
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.5)"
                }
              }}
              onClick={handleSwipeUp}
              disabled={currentVideoIndex >= videos.length - 1}
            >
              <ArrowUpward />
            </IconButton>

            <IconButton
              sx={{
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.5)"
                }
              }}
              onClick={handleSwipeDown}
              disabled={currentVideoIndex <= 0}
            >
              <ArrowDownward />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 2
              }}
            >
              <Avatar
                onClick={()=>openProfile(video)}
                src={VITE_API_BASE_URL+video.user?.photoUrl}
                sx={{ width: 48, cursor: "pointer", height: 48, mb: 1 }}
              />
              <ActionButton onClick={toggleLike}>
                {video.liked
                  ? <Favorite sx={{ color: "#ff4081" }} />
                  : <FavoriteBorder />}
              </ActionButton>
            </Box>

            <ActionButton onClick={toggleSave}>
              {video.saved
                ? <Bookmark sx={{ color: "#ffc107" }} />
                : <BookmarkBorder />}
            </ActionButton>

            <ActionButton>
              <Share />
            </ActionButton>

            <ActionButton onClick={handleOpenDialog}>
              <MoreVert />
            </ActionButton>
          </RightActionBar>

          <ConnectButton
            variant="contained"
            size="large"
            onClick={handleOpenDialog}
          >
            Connect
          </ConnectButton>
        </Box>
      )}

      {/* Profile Dialog */}
      <ProfileDialog
        open={profileDialogOpen}
        onClose={closeProfileDialog}
        role={selectedProfile.role}
        userId={selectedProfile.userId}
      />

      {/* More Options Dialog */}
      <MoreOptionsDialog
        open={moreOptionsDialogOpen}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default VideoFeedViewer;
