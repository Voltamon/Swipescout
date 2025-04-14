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
  Button
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
  Pause
} from '@mui/icons-material';
import { styled } from '@mui/system';

// Mock data - in a real app, this would come from your backend/API
const mockJobVideos = [
  {
    id: '1',
    company: 'TechCorp',
    jobTitle: 'Frontend Developer',
    videoUrl: 'public/videos/vid1.mp4',
    logoUrl: 'src/public/logo.jpg',
    tags: ['React', 'JavaScript', 'Remote'],
    description: 'Join our team to build amazing user experiences with React and modern frontend technologies.',
    location: 'San Francisco, CA',
    salary: '$90,000 - $120,000',
    posted: '2 days ago',
    saved: false,
    liked: false
  },
  {
    id: '2',
    company: 'DataSystems',
    jobTitle: 'Data Scientist',
    videoUrl: 'public/videos/vid2.mp4',
    logoUrl: '',
    tags: ['Python', 'Machine Learning', 'AI'],
    description: 'Work with cutting-edge AI technologies and large datasets to solve real-world problems.',
    location: 'Remote',
    salary: '$110,000 - $150,000',
    posted: '1 week ago',
    saved: false,
    liked: false
  },
  // Add more mock data as needed
];

const VideoContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: '#000',
});

const VideoPlayer = styled('video')({
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

const JobDetailDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '600px',
    width: '90%',
  },
});

const VideoFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState(mockJobVideos);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const videoRef = useRef(null);

  const currentVideo = videos[currentVideoIndex];

  const handleSwipeUp = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsLoading(true);
    }
  };

  const handleSwipeDown = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setIsLoading(true);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleLike = () => {
    const updatedVideos = [...videos];
    updatedVideos[currentVideoIndex].liked = !updatedVideos[currentVideoIndex].liked;
    setVideos(updatedVideos);
  };

  const toggleSave = () => {
    const updatedVideos = [...videos];
    updatedVideos[currentVideoIndex].saved = !updatedVideos[currentVideoIndex].saved;
    setVideos(updatedVideos);
  };

  const handleVideoLoaded = () => {
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        handleSwipeUp();
      } else if (e.key === 'ArrowDown') {
        handleSwipeDown();
      } else if (e.key === ' ') {
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentVideoIndex]);

  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Video Feed */}
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
        
        <VideoPlayer
          ref={videoRef}
          src={currentVideo.videoUrl}
          loop
          playsInline
          onLoadedData={handleVideoLoaded}
          onEnded={() => setIsPlaying(false)}
        />
        
        {!isPlaying && (
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
        
        <OverlayContent>
          <Typography variant="h5" fontWeight="bold">
            {currentVideo.jobTitle}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {currentVideo.company}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {currentVideo.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                }}
              />
            ))}
          </Stack>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {currentVideo.description}
          </Typography>
        </OverlayContent>
        
        <RightActionBar>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          
          <ActionButton>
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
      
      {/* Navigation hints */}
      <Box
        sx={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 2,
        }}
      >
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
      </Box>
      
      {/* Job Details Dialog */}
      <JobDetailDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Job Details</Typography>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={currentVideo.logoUrl} sx={{ width: 64, height: 64, mr: 2 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {currentVideo.jobTitle}
              </Typography>
              <Typography variant="subtitle1">{currentVideo.company}</Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              {currentVideo.description}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {currentVideo.tags.map((tag, index) => (
              <Chip key={index} label={tag} color="primary" variant="outlined" />
            ))}
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Location
            </Typography>
            <Typography variant="body1">{currentVideo.location}</Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Salary Range
            </Typography>
            <Typography variant="body1">{currentVideo.salary}</Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Posted
            </Typography>
            <Typography variant="body1">{currentVideo.posted}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={handleCloseDialog}>
              Close
            </Button>
            <Button variant="contained" color="primary">
              Apply Now
            </Button>
          </Box>
        </DialogContent>
      </JobDetailDialog>
    </Box>
  );
};

export default VideoFeed;