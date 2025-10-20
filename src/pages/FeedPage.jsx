import React, { useContext, useState, useRef, useEffect  } from 'react';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  Bookmark,
  Share,
  MoreVert,
  Search,
  AccountCircle
} from '@mui/icons-material';

const FeedPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock job videos data
  const jobVideos = [
    {
      id: 1,
      company: 'TechCorp',
      title: 'Senior UX Designer',
      tags: ['Remote', '$120k', 'Flexible hours'],
      videoUrl: 'public/videos/vid1.mp4',
      companyLogo: 'src/public/logo.jpg',
      views: '1.2k',
      posted: '2 days ago'
    },
    {
      id: 2,
      company: 'DesignHub',
      title: 'Product Designer',
      tags: ['Hybrid', '$95k', 'Stock options'],
      videoUrl: 'public/videos/vid2.mkv',
      companyLogo: 'src/public/logo.jpg',
      views: '856',
      posted: '1 week ago'
    },
    {
      id: 3,
      company: 'DataSystems',
      title: 'UX Researcher',
      tags: ['On-site', '$110k', 'Signing bonus'],
      videoUrl: 'public/videos/vid1.mp4',
      companyLogo: 'src/public/logo.jpg',
      views: '1.5k',
      posted: '3 days ago'
    }
  ];

  // Handle video play/pause
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

  // Handle swipe up (next video)
  const nextVideo = () => {
    if (currentVideoIndex < jobVideos.length - 1) {
      setLoading(true);
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsPlaying(false);
    }
  };

  // Handle swipe down (previous video)
  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      setLoading(true);
      setCurrentVideoIndex(currentVideoIndex - 1);
      setIsPlaying(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') nextVideo();
      if (e.key === 'ArrowDown') prevVideo();
      if (e.key === ' ') togglePlay();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, isPlaying]);

  // Video loaded handler
  const handleVideoLoaded = () => {
    setLoading(false);
  };

  // Current video data
  const currentVideo = jobVideos[currentVideoIndex];

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top Navigation */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          zIndex: 100,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'common.white',
            ml: 1
          }}
        >
          SwipeScout
        </Typography>
        <Box>
          <IconButton color="inherit">
            <Search sx={{ color: 'common.white' }} />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircle sx={{ color: 'common.white' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Video Container */}
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {loading && (
          <CircularProgress
            size={60}
            sx={{
              position: 'absolute',
              zIndex: 10,
              color: 'primary.main'
            }}
          />
        )}

        <video
          ref={videoRef}
          src={currentVideo.videoUrl}
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          onClick={togglePlay}
          onLoadedData={handleVideoLoaded}
        />

        {/* Video Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            p: 3,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 20,
            color: 'common.white'
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={700}>
              {currentVideo.company}
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {currentVideo.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {currentVideo.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'common.white',
                    backdropFilter: 'blur(5px)'
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}
          >
            <Box>
              <Typography variant="caption">
                {currentVideo.views} views • {currentVideo.posted}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'common.white',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <Bookmark />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'common.white',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <Share />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'common.white',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Right Action Buttons */}
        <Box
          sx={{
            position: 'absolute',
            right: 16,
            bottom: 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            zIndex: 20
          }}
        >
          <Avatar
            src={currentVideo.companyLogo}
            sx={{
              width: 48,
              height: 48,
              border: '2px solid white'
            }}
          />
          <IconButton
            sx={{
              bgcolor: 'primary.main',
              color: 'common.white',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            <Typography variant="body2" fontWeight={700}>
              Apply
            </Typography>
          </IconButton>
        </Box>

        {/* Swipe Indicators */}
        {!isMobile && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'rgba(255,255,255,0.7)',
                zIndex: 20
              }}
            >
              <ArrowUpward fontSize="large" />
              <Typography variant="caption">Next job</Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'rgba(255,255,255,0.7)',
                zIndex: 20
              }}
            >
              <ArrowDownward fontSize="large" />
              <Typography variant="caption">Previous job</Typography>
            </Box>
          </>
        )}
      </Box>

      {/* Bottom Navigation */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          bgcolor: 'background.paper',
          py: 1.5,
          zIndex: 100,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <IconButton color="primary">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>🎥</span>
            <Typography variant="caption" color="primary">
              Feed
            </Typography>
          </Box>
        </IconButton>
        <IconButton color="inherit">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>💬</span>
            <Typography variant="caption">Inbox</Typography>
          </Box>
        </IconButton>
        <IconButton color="inherit">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>👤</span>
            <Typography variant="caption">Profile</Typography>
          </Box>
        </IconButton>
      </Box>

      {/* Create Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 110
        }}
      >
        <IconButton
          sx={{
            bgcolor: 'primary.main',
            color: 'common.white',
            width: 56,
            height: 56,
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'scale(1.1)'
            }
          }}
        >
          <Typography variant="h5">+</Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default FeedPage;