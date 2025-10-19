// AllVideosPage.jsx - Enhanced TikTok Style Vertical Video Feed
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVideoContext } from '../contexts/VideoContext';
import { styled } from "@mui/material/styles";
import {
  Box, Typography, IconButton, Fab, Snackbar, Alert,
  CircularProgress, Avatar, Chip, Tooltip, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, List, ListItem, ListItemText,
  ListItemAvatar, Divider, Menu, MenuItem, Paper,
  Stack, Grid, Drawer, FormControl, InputLabel,
  Select, Slider, useMediaQuery, Fade, Backdrop
} from '@mui/material';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PlayArrow, Pause, VolumeOff, VolumeUp, Share, Favorite,
  FavoriteBorder, Bookmark, BookmarkBorder, PersonAdd,
  ArrowUpward, ArrowDownward, Home, Close, MoreVert,
  Send, Comment, Repeat, FilterList, Search,
  Work, Business, School, LocationOn, SkipNext,
  SkipPrevious, Fullscreen, FullscreenExit,
  WhatsApp, Twitter, LinkedIn, Facebook,
  Link as LinkIcon, Report, Block, Download,
  Visibility, AccessTime, Settings, Tune,
  PersonSearch, Explore
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useContext } from 'react';
import { 
  getAllVideos, 
  getEmployerPublicVideos, 
  getJobSeekersVideos,
  likeVideo,
  saveVideo,
  connectWithUser,
  addVideoComment,
  getVideoComments,
  searchVideos
} from '../services/api';

// Sample videos data generator function (will be called after t is available)
const getSampleVideos = (t) => [
  {
    id: '2b1f4b8e-9f3c-4d2a-9c6b-1a2d3e4f5a61',
    video_title: t('sampleVideos.softwareEngineerResume'),
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    video_type: t('sampleVideos.jobSeeker'),
    video_duration: 30,
    user: {
      displayName: t('sampleVideos.ahmedHassan'),
      profile_image: null,
      role: 'jobseeker'
    },
    hashtags: '#SoftwareEngineer #React #JavaScript',
    isSample: true,
    likes_count: 245,
    views_count: 1200
  },
  {
    id: '3c2e5a9d-6b4f-4e1a-8d7c-2b3a4f6e7d82',
    video_title: t('sampleVideos.marketingManagerPosition'),
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    video_type: t('sampleVideos.jobSeeker'),
    video_duration: 25,
    user: {
      displayName: t('sampleVideos.saraAhmed'),
      profile_image: null,
      role: 'jobseeker'
    },
    hashtags: '#Marketing #Manager #Creative',
    isSample: true,
    likes_count: 189,
    views_count: 890
  },
  {
    id: '4d3f6b0a-7c5e-4f2b-9e8a-3c4b5a6d8e93',
    video_title: t('sampleVideos.techCompanyHiring'),
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    video_type: t('sampleVideos.employer'),
    video_duration: 35,
    user: {
      displayName: t('sampleVideos.techCorpSolutions'),
      profile_image: null,
      role: 'employer'
    },
    hashtags: '#Hiring #TechJobs #Innovation',
    isSample: true,
    likes_count: 312,
    views_count: 1500
  },
  {
    id: '5e4a7c1b-8d6f-4a3c-0f9b-4d5c6b7a9f04',
    video_title: t('sampleVideos.dataScientistResume'),
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    video_type: t('sampleVideos.jobSeeker'),
    video_duration: 28,
    user: {
      displayName: t('sampleVideos.omarKhaled'),
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
  // Stronger text shadow for better legibility
  textShadow: '2px 2px 8px rgba(0,0,0,0.9), 1px 1px 2px rgba(255,255,255,0.3)',
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

// Updated ActionButton style for better visibility
const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  color: 'white',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  width: 56,
  height: 56,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    transform: 'scale(1.1)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const NavigationButtons = styled(Box)(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(2),
  top: '50%',
  transform: 'translate(-8px, -69%)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  zIndex: 10,
  [theme.breakpoints.down('sm')]: {
    transform: 'translate(-8px, -144%)',
  },
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
  // Stronger text shadow for better legibility
  textShadow: '2px 2px 8px rgba(0,0,0,0.9), 1px 1px 2px rgba(255,255,255,0.3)',
}));

// Updated StyledIconButton style for better visibility
const StyledIconButton = styled(IconButton)({
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  '&:disabled': { opacity: 0.3, color: 'rgba(255, 255, 255, 0.5)' },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
});

const AllVideosPage = ({ 
  pagetype: propPagetype, 
  onClose,
  context = 'general', // general, my-videos, saved-videos, liked-videos, candidate-videos, company-videos, jobseeker-feed, analytics
  filterType = null,
  showSidebar = true,
  showHeader = true,
  fullScreen = false 
}) => {
  const { t } = useTranslation();
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
  const location = useLocation();
  const { pagetype: urlPagetype } = useParams();
  const pagetype = propPagetype || urlPagetype;
  const { user } = useAuth();
  const theme = useTheme();

  // Get context from navigation state (from VideoGridPage)
  const navigationContext = location.state?.context;
  const contextVideos = location.state?.videos;
  const initialVideoId = location.state?.videoId;

  // Fetch videos from server based on context
  const fetchServerVideos = async () => {
    try {
      setLoading(true);
      let response;
      
      // If we have context from VideoGridPage, use those videos
      if (contextVideos && contextVideos.length > 0) {
        setServerVideos(contextVideos);
        
        // Set initial video index if specified
        if (initialVideoId) {
          const initialIndex = contextVideos.findIndex(video => video.id === initialVideoId);
          if (initialIndex !== -1) {
            setCurrentVideoIndex(initialIndex);
          }
        }
        
        setLoading(false);
        return;
      }

      // If we have navigation context, fetch videos with those filters
      if (navigationContext) {
        const params = {
          category: navigationContext.category,
          subcategory: navigationContext.subcategory,
          search: navigationContext.search,
          sort: navigationContext.sort,
          page: 1,
          limit: 50,
        };
        response = await searchVideos(params);
      } else {
        // Determine API call based on context
        switch (context) {
          case 'my-videos':
            // Fetch user's own videos
            response = await getAllVideos(1, 50, { userId: user?.id });
            break;
          case 'saved-videos':
            // Fetch saved videos (would need API endpoint)
            response = await getAllVideos(1, 50, { saved: true });
            break;
          case 'liked-videos':
            // Fetch liked videos (would need API endpoint)
            response = await getAllVideos(1, 50, { liked: true });
            break;
          case 'candidate-videos':
            response = await getJobSeekersVideos(1, 50);
            break;
          case 'company-videos':
            response = await getEmployerPublicVideos(1, 50);
            break;
          case 'jobseeker-feed':
            response = await getJobSeekersVideos(1, 50);
            break;
          case 'analytics':
            response = await getAllVideos(1, 50, { analytics: true });
            break;
          default:
            // Use pagetype for backward compatibility
            if (propPagetype === 'all' || urlPagetype === 'all') {
              response = await getAllVideos(1, 50);
            } else if (propPagetype === 'jobseekers' || urlPagetype === 'jobseekers') {
              response = await getJobSeekersVideos(1, 50);
            } else if (propPagetype === 'employers' || urlPagetype === 'employers') {
              response = await getEmployerPublicVideos(1, 50);
            } else {
              response = await getAllVideos(1, 50);
            }
        }
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
  }, [pagetype, context]);

  // Combine real videos with sample videos based on count
  const allVideos = React.useMemo(() => {
    const realVideos = [
      ...serverVideos.map(v => ({ ...v, isLocal: false, status: v.status || 'completed' }))
    ];

    // Show sample videos if we have fewer than 5 real videos
    if (realVideos.length < 5) {
      // Get sample videos with translations
      const sampleVideos = getSampleVideos(t);
      
      // Filter sample videos based on page type
      let filteredSamples = sampleVideos;
      if (pagetype === 'jobseekers') {
        filteredSamples = sampleVideos.filter(v => v.user.role === 'jobseeker');
      } else if (pagetype === 'employers') {
        filteredSamples = sampleVideos.filter(v => v.user.role === 'employer');
      }

      // Mix real videos with samples
      return [...realVideos, ...filteredSamples];
    }

    return realVideos;
  }, [serverVideos, pagetype, t]);

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
        setSnackbar({ open: true, message: t("videos.removedFromLikes"), severity: "info" });
      } else {
        newSet.add(videoId);
        setSnackbar({ open: true, message: t("videos.addedToLikes"), severity: "success" });
      }
      return newSet;
    });
  };

  const handleSave = (videoId) => {
    setSavedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
        setSnackbar({ open: true, message: t("videos.removedFromSaved"), severity: "info" });
      } else {
        newSet.add(videoId);
        setSnackbar({ open: true, message: t("videos.savedToCollection"), severity: "success" });
      }
      return newSet;
    });
  };

  const handleShare = (video) => {
    if (navigator.share) {
      navigator.share({
        title: video.video_title,
        text: t("videos.checkOutThisVideo", { videoTitle: video.video_title }),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbar({ open: true, message: t("videos.linkCopied"), severity: "success" });
    }
  };

  const handleConnect = (video) => {
    if (video.isSample) {
      setSnackbar({ open: true, message: t("videos.sampleVideoMessage"), severity: "info" });
      return;
    }
    // Navigate to user profile or send connection request
    setSnackbar({ open: true, message: t("videos.connectionRequestSent"), severity: "success" });
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
        <Typography variant="h6" sx={{ ml: 2, textShadow: '2px 2px 8px rgba(0,0,0,0.9)', fontWeight: 'bold' }}>{t('videos.loadingVideos')}</Typography>
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
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
          {error ? t('videos.oops') : t('videos.noVideosYet')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
          {error || t('videos.beTheFirstToShare')}
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
          {t('videos.uploadVideo')}
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
        <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 'bold' }}>
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
                  sx={{ width: 48, height: 48, mr: 2, border: '2px solid white' }}
                >
                  {currentVideo.user?.displayName?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    @{currentVideo.user?.display_name || 'Unknown User'}
                  </Typography>
                  <Chip
                    label={currentVideo.user?.role || currentVideo.video_type}
                    size="small"
                    sx={{
                      backgroundColor: currentVideo.user?.role === 'employer' ?
                        'rgba(76, 175, 80, 0.8)' : 'rgba(33, 150, 243, 0.8)',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {currentVideo.video_title}
              </Typography>

              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                {currentVideo.hashtags}
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, opacity: 0.8 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  👁 {currentVideo.views_count || 0} views
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  ❤️ {currentVideo.likes_count || 0} likes
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
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
          <StyledIconButton
            onClick={() => goToVideo(currentVideoIndex - 1)}
            disabled={currentVideoIndex === 0}

          >
            <ArrowUpward />
          </StyledIconButton>
        </Tooltip>

        <Tooltip title={isPlaying ? "Pause (Space)" : "Play (Space)"} placement="left">
          <StyledIconButton
            onClick={togglePlayPause}

          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </StyledIconButton>
        </Tooltip>

        <Tooltip title={isMuted ? "Unmute (M)" : "Mute (M)"} placement="left">
          <StyledIconButton
            onClick={toggleMute}

          >
            {isMuted ? <VolumeOff /> : <VolumeUp />}
          </StyledIconButton>
        </Tooltip>

        <Tooltip title="Next video (↓)" placement="left">
          <StyledIconButton
            onClick={() => goToVideo(currentVideoIndex + 1)}
            disabled={currentVideoIndex === allVideos.length - 1}

          >
            <ArrowDownward />
          </StyledIconButton>
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
