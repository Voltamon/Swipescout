// AllVideosPage.jsx - TikTok Style Vertical Video Feed
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVideoContext } from '../context/VideoContext';
import { styled } from "@mui/material/styles";
import {
  Box, Typography, IconButton, Fab, Snackbar, Alert,
  CircularProgress, Avatar, Chip, Tooltip, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  PlayArrow, Pause, VolumeOff, VolumeUp, Share, Favorite, 
  FavoriteBorder, Bookmark, BookmarkBorder, PersonAdd,
  ArrowUpward, ArrowDownward, Home, Close, MoreVert,
  Send, Comment, Repeat
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllVideos, getEmployerPublicVideos, getJobSeekersVideos } from '../services/api';

// Sample videos data for when there are few real videos
const SAMPLE_VIDEOS = [
  {
    id: 'sample-1',
    video_title: 'Software Engineer Resume',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    video_type: 'Job Seeker',
    video_duration: 30,
    user: {
      display_name: 'Ahmed Hassan',
      profile_image: null,
      role: 'jobseeker'
    },
    hashtags: '#SoftwareEngineer #React #JavaScript',
    isSample: true,
    likes_count: 245,
    views_count: 1200
  },
  {
    id: 'sample-2', 
    video_title: 'Marketing Manager Position',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    video_type: 'Job Seeker',
    video_duration: 25,
    user: {
      display_name: 'Sara Ahmed',
      profile_image: null,
      role: 'jobseeker'
    },
    hashtags: '#Marketing #Manager #Creative',
    isSample: true,
    likes_count: 189,
    views_count: 890
  },
  {
    id: 'sample-3',
    video_title: 'Tech Company Hiring',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    video_type: 'Employer',
    video_duration: 35,
    user: {
      display_name: 'TechCorp Solutions',
      profile_image: null,
      role: 'employer'
    },
    hashtags: '#Hiring #TechJobs #Innovation',
    isSample: true,
    likes_count: 312,
    views_count: 1500
  },
  {
    id: 'sample-4',
    video_title: 'Data Scientist Resume',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    video_type: 'Job Seeker',
    video_duration: 28,
    user: {
      display_name: 'Omar Khaled',
      profile_image: null,
      role: 'jobseeker'
    },
    hashtags: '#DataScience #Python #AI',
    isSample: true,
    likes_count: 156,
    views_count: 720
  }
];

// Styled components for TikTok-like interface
const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  scrollSnapAlign: 'start',
}));

const VideoElement = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  outline: 'none',
});

const VideoOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)',
  pointerEvents: 'none',
});

const VideoInfo = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 80,
  padding: theme.spacing(3),
  color: 'white',
  zIndex: 2,
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  bottom: theme.spacing(15),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  zIndex: 2,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  width: 56,
  height: 56,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const NavigationButtons = styled(Box)(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(2),
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  zIndex: 10,
}));

const TopBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
  zIndex: 10,
  color: 'white',
}));

const AllVideosPage = ({ pagetype: propPagetype , onClose }) => {
  const { videos: localVideos } = useVideoContext();
  const [serverVideos, setServerVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [savedVideos, setSavedVideos] = useState(new Set());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const navigate = useNavigate();
  // const { pagetype } = useParams();
  const { pagetype: urlPagetype } = useParams();
  const pagetype = propPagetype || urlPagetype;
  const { user } = useAuth();
  const theme = useTheme();

  // Fetch videos from server
  const fetchServerVideos = async () => {
    try {
      setLoading(true);
      let response;
      if (pagetype === 'all') {
        response = await getAllVideos(1, 50); // Get more videos for better experience
      } else if (pagetype === 'jobseekers') {
        response = await getJobSeekersVideos(1, 50);
      } else if (pagetype === 'employers') {
        response = await getEmployerPublicVideos(1, 50);
      }
      
      const fetchedVideos = response.data.videos || [];
      setServerVideos(fetchedVideos);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerVideos();
  }, [pagetype]);

  // Combine real videos with sample videos based on count
  const allVideos = React.useMemo(() => {
    const realVideos = [
      ...serverVideos.map(v => ({ ...v, isLocal: false, status: v.status || 'completed' }))
    ];

    // Show sample videos if we have fewer than 5 real videos
    if (realVideos.length < 5) {
      // Filter sample videos based on page type
      let filteredSamples = SAMPLE_VIDEOS;
      if (pagetype === 'jobseekers') {
        filteredSamples = SAMPLE_VIDEOS.filter(v => v.user.role === 'jobseeker');
      } else if (pagetype === 'employers') {
        filteredSamples = SAMPLE_VIDEOS.filter(v => v.user.role === 'employer');
      }
      
      // Mix real videos with samples
      return [...realVideos, ...filteredSamples];
    }
    
    return realVideos;
  }, [serverVideos, pagetype]);

  // Handle video navigation
  const goToVideo = useCallback((index) => {
    if (index >= 0 && index < allVideos.length) {
      setCurrentVideoIndex(index);
      
      // Pause current video
      const currentVideo = videoRefs.current[allVideos[currentVideoIndex]?.id];
      if (currentVideo) {
        currentVideo.pause();
      }
      
      // Play new video after a short delay
      setTimeout(() => {
        const newVideo = videoRefs.current[allVideos[index]?.id];
        if (newVideo) {
          newVideo.currentTime = 0;
          newVideo.muted = isMuted;
          if (isPlaying) {
            newVideo.play().catch(e => console.log('Autoplay prevented:', e));
          }
        }
      }, 100);
    }
  }, [allVideos, currentVideoIndex, isMuted, isPlaying]);

  // Handle scroll navigation
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        // Scroll down - next video
        goToVideo(currentVideoIndex + 1);
      } else {
        // Scroll up - previous video
        goToVideo(currentVideoIndex - 1);
      }
    };

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          goToVideo(currentVideoIndex - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          goToVideo(currentVideoIndex + 1);
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentVideoIndex, goToVideo]);

  // Auto-play current video
  useEffect(() => {
    const currentVideo = videoRefs.current[allVideos[currentVideoIndex]?.id];
    if (currentVideo && isPlaying) {
      currentVideo.muted = isMuted;
      currentVideo.play().catch(e => console.log('Autoplay prevented:', e));
    }
  }, [currentVideoIndex, allVideos, isPlaying, isMuted]);

  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[allVideos[currentVideoIndex]?.id];
    if (currentVideo) {
      if (currentVideo.paused) {
        currentVideo.play();
        setIsPlaying(true);
      } else {
        currentVideo.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    const currentVideo = videoRefs.current[allVideos[currentVideoIndex]?.id];
    if (currentVideo) {
      currentVideo.muted = !currentVideo.muted;
      setIsMuted(currentVideo.muted);
    }
  };

  const handleLike = (videoId) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
        setSnackbar({ open: true, message: 'Removed from likes', severity: 'info' });
      } else {
        newSet.add(videoId);
        setSnackbar({ open: true, message: 'Added to likes', severity: 'success' });
      }
      return newSet;
    });
  };

  const handleSave = (videoId) => {
    setSavedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
        setSnackbar({ open: true, message: 'Removed from saved', severity: 'info' });
      } else {
        newSet.add(videoId);
        setSnackbar({ open: true, message: 'Saved to collection', severity: 'success' });
      }
      return newSet;
    });
  };

  const handleShare = (video) => {
    if (navigator.share) {
      navigator.share({
        title: video.video_title,
        text: `Check out this video: ${video.video_title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbar({ open: true, message: 'Link copied to clipboard', severity: 'success' });
    }
  };

  const handleConnect = (video) => {
    if (video.isSample) {
      setSnackbar({ open: true, message: 'This is a sample video', severity: 'info' });
      return;
    }
    // Navigate to user profile or send connection request
    setSnackbar({ open: true, message: 'Connection request sent', severity: 'success' });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#000',
        color: 'white'
      }}>
        <CircularProgress color="primary" size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading videos...</Typography>
      </Box>
    );
  }

  if (error || allVideos.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#000',
        color: 'white',
        textAlign: 'center',
        p: 3
      }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          {error ? 'Oops!' : 'No Videos Yet'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
          {error || 'Be the first to share your story'}
        </Typography>
        <Fab 
          color="primary" 
          variant="extended"
          onClick={() => navigate('/video-upload')}
          sx={{ 
            borderRadius: '25px',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          <PlayArrow sx={{ mr: 1 }} />
          Upload Video
        </Fab>
      </Box>
    );
  }

  const currentVideo = allVideos[currentVideoIndex];

  return (
    <Box sx={{ 
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#000'
    }}>
      {/* Top Bar */}
      <TopBar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onClose ? (
            // Render Close icon when the onClose prop is provided
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon  />
            </IconButton>
          ) : (
            // Render Home icon and navigate when onClose is not provided
            <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
              <Home />
            </IconButton>
          )}
          
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {pagetype === 'all' ? 'All Videos' : 
             pagetype === 'jobseekers' ? 'Job Seekers' : 'Employers'}
          </Typography>
          {currentVideo?.isSample && (
            <Chip 
              label="Sample" 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(255, 193, 7, 0.8)',
                color: 'black',
                fontWeight: 'bold'
              }} 
            />
          )}
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {currentVideoIndex + 1} / {allVideos.length}
        </Typography>
      </TopBar>

      {/* Video Container */}
      <VideoContainer ref={containerRef}>
        {currentVideo && (
          <>
            <VideoElement
              ref={el => videoRefs.current[currentVideo.id] = el}
              src={currentVideo.video_url}
              loop
              playsInline
              muted={isMuted}
              onClick={togglePlayPause}
            />
            <VideoOverlay />
            
            {/* Video Info */}
            <VideoInfo>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  src={currentVideo.user?.profile_image}
                  sx={{ width: 48, height: 48, mr: 2 }}
                >
                  {currentVideo.user?.display_name?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    @{currentVideo.user?.display_name || 'Unknown User'}
                  </Typography>
                  <Chip 
                    label={currentVideo.user?.role || currentVideo.video_type}
                    size="small"
                    sx={{ 
                      backgroundColor: currentVideo.user?.role === 'employer' ? 
                        'rgba(76, 175, 80, 0.8)' : 'rgba(33, 150, 243, 0.8)',
                      color: 'white'
                    }}
                  />
                </Box>
              </Box>
              
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                {currentVideo.video_title}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                {currentVideo.hashtags}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, opacity: 0.8 }}>
                <Typography variant="body2">
                  👁 {currentVideo.views_count || 0} views
                </Typography>
                <Typography variant="body2">
                  ❤️ {currentVideo.likes_count || 0} likes
                </Typography>
                <Typography variant="body2">
                  ⏱ {Math.round(currentVideo.video_duration || 0)}s
                </Typography>
              </Box>
            </VideoInfo>

            {/* Action Buttons */}
            <ActionButtons>
              <Tooltip title={likedVideos.has(currentVideo.id) ? "Unlike" : "Like"} placement="left">
                <ActionButton onClick={() => handleLike(currentVideo.id)}>
                  {likedVideos.has(currentVideo.id) ? 
                    <Favorite sx={{ color: '#ff4458' }} /> : 
                    <FavoriteBorder />
                  }
                </ActionButton>
              </Tooltip>
              
              <Tooltip title="Comment" placement="left">
                <ActionButton>
                  <Comment />
                </ActionButton>
              </Tooltip>
              
              <Tooltip title={savedVideos.has(currentVideo.id) ? "Unsave" : "Save"} placement="left">
                <ActionButton onClick={() => handleSave(currentVideo.id)}>
                  {savedVideos.has(currentVideo.id) ? 
                    <Bookmark sx={{ color: '#ffc107' }} /> : 
                    <BookmarkBorder />
                  }
                </ActionButton>
              </Tooltip>
              
              <Tooltip title="Share" placement="left">
                <ActionButton onClick={() => handleShare(currentVideo)}>
                  <Share />
                </ActionButton>
              </Tooltip>
              
              <Tooltip title="Connect" placement="left">
                <ActionButton onClick={() => handleConnect(currentVideo)}>
                  <PersonAdd />
                </ActionButton>
              </Tooltip>
            </ActionButtons>
          </>
        )}
      </VideoContainer>

      {/* Navigation Buttons */}
      <NavigationButtons>
        <Tooltip title="Previous video (↑)" placement="left">
          <IconButton 
            onClick={() => goToVideo(currentVideoIndex - 1)}
            disabled={currentVideoIndex === 0}
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              '&:disabled': { opacity: 0.3 }
            }}
          >
            <ArrowUpward />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isPlaying ? "Pause (Space)" : "Play (Space)"} placement="left">
          <IconButton 
            onClick={togglePlayPause}
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)'
            }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isMuted ? "Unmute (M)" : "Mute (M)"} placement="left">
          <IconButton 
            onClick={toggleMute}
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)'
            }}
          >
            {isMuted ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Next video (↓)" placement="left">
          <IconButton 
            onClick={() => goToVideo(currentVideoIndex + 1)}
            disabled={currentVideoIndex === allVideos.length - 1}
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              '&:disabled': { opacity: 0.3 }
            }}
          >
            <ArrowDownward />
          </IconButton>
        </Tooltip>
      </NavigationButtons>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AllVideosPage;

