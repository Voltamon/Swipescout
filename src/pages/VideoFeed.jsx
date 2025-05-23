import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Chip,
  Stack,
  Avatar,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  BookmarkBorder,
  Bookmark,
  Share,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  Close,
  PlayArrow,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';

// --- Mock Data for Company Videos ---
const mockCompanyVideos = [
  {
    id: '1',
    companyName: 'Corporate Solutions Inc.',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935032/Employer/grfwutcixeecejrsqu7o.mp4',
    logoUrl: 'https://via.placeholder.com/48/5DADE2/FFFFFF?text=CSI',
    description: 'Discover the vibrant culture and innovative projects at Corporate Solutions Inc. We are always looking for passionate individuals to join our growing team.',
    industry: 'Consulting',
    foundedYear: 2005,
    employeeCount: '500-1000',
    benefits: ['Health Insurance', '401k', 'Paid Time Off', 'Flexible Hours'],
    tagline: 'Innovate. Grow. Succeed.',
    liked: false,
    saved: false // Added saved property to match component logic
  }
];

// Styled components (unchanged - keep these as they are)
const VideoContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: '#000',
});

const StyledVideo = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const OverlayContent = styled('div')({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '16px',
  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
  color: '#fff',
  zIndex: 1,
});

const RightActionBar = styled('div')({
  position: 'absolute',
  right: '16px',
  bottom: '120px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  zIndex: 2,
});

const ActionButton = styled(IconButton)({
  color: '#fff',
  backgroundColor: 'rgba(0,0,0,0.3)',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

const ConnectButton = styled(Button)({
  position: 'absolute',
  right: '16px',
  bottom: '16px',
  zIndex: 2,
  backgroundColor: '#1976d2',
  color: '#fff',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
});

const CompanyDetailDialog = styled(Dialog)({ // Renamed from JobDetailDialog
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '600px',
    width: '90%',
  },
});


const VideoFeed = () => {
  const { vid } = useParams();
  const navigate = useNavigate();

  const [videos, setVideos] = useState(mockCompanyVideos);

  const initialIndex = vid ? videos.findIndex(video => video.id === vid) : 0;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const videoRef = useRef(null);

  const currentVideo = videos[currentVideoIndex];

  const tryPlayVideo = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.warn('Autoplay prevented:', error);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleSwipeUp = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsLoading(true);
      setIsPlaying(false);
    }
  };

  const handleSwipeDown = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setIsLoading(true);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        tryPlayVideo();
      }
    }
  };

  const toggleLike = () => {
    const updatedVideos = [...videos];
    // Ensure 'liked' property exists on the current video object
    if (updatedVideos[currentVideoIndex]) {
      updatedVideos[currentVideoIndex].liked = !updatedVideos[currentVideoIndex].liked;
      setVideos(updatedVideos);
    }
  };

  const toggleSave = () => {
    const updatedVideos = [...videos];
    // Ensure 'saved' property exists on the current video object
    if (updatedVideos[currentVideoIndex]) {
        // Add 'saved' property if it doesn't exist, default to false
        updatedVideos[currentVideoIndex].saved = !updatedVideos[currentVideoIndex].saved;
        setVideos(updatedVideos);
    }
  };


  const handleVideoLoaded = () => {
    setIsLoading(false);
    tryPlayVideo();
  };

  const handleVideoError = (e) => {
    console.error('Video loading failed:', e);
    setIsLoading(false);
    setIsPlaying(false);
  };

  const handleOpenDialog = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (videoRef.current) {
      tryPlayVideo();
    }
    setOpenDialog(false);
  };

  const handleCloseFeed = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        handleSwipeUp();
      } else if (e.key === 'ArrowDown') {
        handleSwipeDown();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentVideoIndex, isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      setIsLoading(true);
      videoRef.current.muted = false;
      videoRef.current.load();
    }
  }, [currentVideoIndex, currentVideo.videoUrl]);

  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <VideoContainer
        onClick={togglePlay}
        onTouchStart={(e) => {
          const startY = e.touches[0].clientY;
          const handleTouchEnd = (e) => {
            const endY = e.changedTouches[0].clientY;
            if (endY < startY - 50) {
              handleSwipeUp();
            } else if (endY > startY + 50) {
              handleSwipeDown();
            }
            document.removeEventListener('touchend', handleTouchEnd);
          };
          document.addEventListener('touchend', handleTouchEnd);
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}

        <StyledVideo
          ref={videoRef}
          src={currentVideo.videoUrl}
          loop
          playsInline
          muted={false}
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          crossOrigin="anonymous"
        />

        {!isPlaying && !isLoading && (
          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 2,
              width: '64px',
              height: '64px',
            }}
            onClick={togglePlay}
          >
            <PlayArrow fontSize="large" />
          </IconButton>
        )}

        <IconButton
          sx={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            zIndex: 3,
          }}
          onClick={handleCloseFeed}
        >
          <Close />
        </IconButton>

        {/* Overlay Content (Bottom Left) - Corrected for Company Data */}
        <OverlayContent>
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff", }}>
            {currentVideo.companyName}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1, color: "rgba(216, 220, 223, 0.5)", }}>
            {currentVideo.tagline}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {currentVideo.industry && (
              <Chip
                label={currentVideo.industry}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                }}
              />
            )}
            {currentVideo.foundedYear && (
              <Chip
                label={`Founded: ${currentVideo.foundedYear}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                }}
              />
            )}
          </Stack>
          <Typography variant="body2" sx={{ mb: 2, color: "rgba(238, 238, 238, 0.5)", }}>
            {currentVideo.description}
          </Typography>
        </OverlayContent>

        <RightActionBar>
          <IconButton
            sx={{
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
              },
            }}
            onClick={handleSwipeUp}
            disabled={currentVideoIndex >= videos.length - 1}
          >
            <ArrowUpward />
          </IconButton>

          <IconButton
            sx={{
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
              },
            }}
            onClick={handleSwipeDown}
            disabled={currentVideoIndex <= 0}
          >
            <ArrowDownward />
          </IconButton>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <Avatar src={currentVideo.logoUrl} sx={{ width: 48, height: 48, mb: 1 }} />
            <ActionButton onClick={toggleLike}>
              {currentVideo.liked ? (
                <Favorite sx={{ color: '#ff4081' }} />
              ) : (
                <FavoriteBorder />
              )}
            </ActionButton>
          </Box>

          <ActionButton onClick={toggleSave}>
            {currentVideo.saved ? (
              <Bookmark sx={{ color: '#ffc107' }} />
            ) : (
              <BookmarkBorder />
            )}
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
      </VideoContainer>

      {/* Company Details Dialog - Corrected for Company Data */}
      <CompanyDetailDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Company Details</Typography>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={currentVideo.logoUrl} sx={{ width: 64, height: 64, mr: 2 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {currentVideo.companyName}
              </Typography>
              <Typography variant="subtitle1">{currentVideo.tagline}</Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              **About Us:** {currentVideo.description}
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Industry
            </Typography>
            <Typography variant="body1">{currentVideo.industry}</Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Founded
            </Typography>
            <Typography variant="body1">{currentVideo.foundedYear}</Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Employees
            </Typography>
            <Typography variant="body1">{currentVideo.employeeCount}</Typography>

            {currentVideo.benefits && currentVideo.benefits.length > 0 && (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Benefits
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {currentVideo.benefits.map((benefit, index) => (
                    <Chip key={index} label={benefit} color="primary" variant="outlined" />
                  ))}
                </Box>
              </>
            )}
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={handleCloseDialog}>
              Close
            </Button>
            <Button variant="contained" color="primary">
              Visit Website
            </Button>
          </Box>
        </DialogContent>
      </CompanyDetailDialog>
    </Box>
  );
};

export default VideoFeed;
