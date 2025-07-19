// AllVideosPage.jsx (updated imports and styles)
import React, { useState, useEffect, useRef } from 'react';
import { useVideoContext } from '../context/VideoContext';
import { styled } from "@mui/material/styles";
import {
  Container, Grid, Card, CardMedia, CardContent,
  Typography, Button, CircularProgress, Box,
  LinearProgress, Chip, Stack, Alert, IconButton,
  Pagination, Dialog, DialogTitle, DialogContent,
  DialogActions, Tooltip, useMediaQuery, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Error, CloudUpload, Replay, Delete, PlayArrow, Home } from '@mui/icons-material';
import api, { deleteVideo, getAllVideos, getEmployerPublicVideos, getJobSeekersVideos } from '../services/api';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { VolumeUp, VolumeOff, Favorite, Share, Comment, MoreVert } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavigationPanel from "../components/NavigationPanel";
import Header from '../components/Headers/HeaderExplore';

const VideoCard = ({ video, isHovered, onClick, onHover, toggleMute, isMuted }) => {
  const videoRef = useRef(null);
  const { role } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered]);

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Video Player */}
      <CardMedia
        component="div"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          cursor: 'pointer'
        }}
      >
        {video.video_url && (
          <video
            ref={videoRef}
            src={video.video_url}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
            muted={isMuted}
            loop
            playsInline
            disablePictureInPicture
            controlsList="nodownload"
          />
        )}

        {/* Video Overlay */}
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          zIndex: 1,
        }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            {video.video_title || 'Untitled Video'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {video.video_type || 'Uncategorized'} • {Math.round(video.video_duration || 0)}s
          </Typography>
        </Box>

        {/* Video Actions */}
        <Box sx={{
          position: 'absolute',
          right: 8,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          zIndex: 2
        }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            sx={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            {isMuted ? <VolumeOff /> : <VolumeUp />}
          </IconButton>

          <IconButton
            sx={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <Favorite />
          </IconButton>

          <IconButton
            sx={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <Comment />
          </IconButton>

          <IconButton
            sx={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <Share />
          </IconButton>
        </Box>

        {/* Apply Button */}
        {role === 'jobseeker' && video.video_type === 'job' && (
          <Button
            variant="contained"
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              zIndex: 2,
              borderRadius: '20px',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #FF5252 30%, #FF8A80 90%)',
              boxShadow: '0 3px 5px 2px rgba(255, 138, 128, .3)'
            }}
          >
            Apply Now
          </Button>
        )}

        {role === 'employer' && video.video_type === 'resume' && (
          <Button
            variant="contained"
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              zIndex: 2,
              borderRadius: '20px',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
              boxShadow: '0 3px 5px 2px rgba(129, 199, 132, .3)'
            }}
          >
            Contact Candidate
          </Button>
        )}
      </CardMedia>
    </Card>
  );
};

const AllVideosPage = () => {
  const { videos: localVideos, retryUpload, removeVideo } = useVideoContext();
  const [serverVideos, setServerVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadLimitReached, setUploadLimitReached] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const videoRefs = useRef({});
  const navigate = useNavigate();
  const { pagetype } = useParams();
  const { user } = useAuth();

  const VIDEOS_PER_PAGE = 9;

  const toggleMute = (e, videoId) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
    const videoEl = videoRefs.current[videoId];
    if (videoEl) {
      videoEl.muted = !isMuted;
    }
  };

  const fetchServerVideos = async (pageNum) => {
    try {
      setLoading(true);
      let response;
      if (pagetype == 'all') {
        response = await getAllVideos(pageNum, VIDEOS_PER_PAGE);
      }
      else if (pagetype == 'jobseekers') {
        response = await getJobSeekersVideos(pageNum, VIDEOS_PER_PAGE);
      }
      else if (pagetype == 'employers') {
        response = await getEmployerPublicVideos(pageNum, VIDEOS_PER_PAGE);
      }
      setServerVideos(response.data.videos);
      setTotalPages(response.data.totalPages || 1);
      setUploadLimitReached(response.data.uploadLimitReached || false);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerVideos(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleVideoHover = (videoId, isHovering) => {
    if (isHovering) {
      setHoveredVideo(videoId);
      const videoEl = videoRefs.current[videoId];
      if (videoEl) {
        videoEl.currentTime = 0;
        videoEl.muted = isMuted;
        videoEl.play().catch(e => console.log('Autoplay prevented:', e));
      }
    } else {
      const videoEl = videoRefs.current[videoId];
      if (videoEl && !videoEl.paused) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
      setHoveredVideo(null);
    }
  };

  const handleVideoClick = (video) => {
    navigate(`/video-player/${video.id}`, {
      state: {
        currentVideo: video,
        allVideos: filteredVideos,
        initialPage: page,
      }
    });
  };

  const allVideos = [
    ...serverVideos.map(v => ({ ...v, isLocal: false, status: v.status || 'completed' }))
  ];

  const filteredVideos = allVideos.filter(video => {
    if (video.isLocal && video.status === 'completed') {
      return !serverVideos.some(sv => sv.id === video.id);
    }
    return true;
  });

  const StatusBorder = styled('div')(({ status, theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '8px',
    border: `8px solid ${status === 'processing' ? "rgb(22, 85, 167)" : theme.palette.error.main}`,
    background: 'transparent',
    zIndex: 2,
    pointerEvents: 'none',
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': { opacity: 0.9 },
      '50%': { opacity: 0.5 },
      '100%': { opacity: 0.9 },
    },
  }));

  return (
    <Box sx={{
      background: theme => theme.palette.background.default,
      minHeight: "100vh",
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      
      <Box sx={{
        display: "flex",
        flexDirection: { xs: 'column', sm: 'row' },
        flex: 1,
        pt: { xs: 0, sm: 2 }
      }}>
        {/* Navigation Panel */}
        <Box sx={{
          width: { xs: '100%', sm: '280px' },
          p: { xs: 1, sm: 2 },
          display: { xs: 'none', sm: 'block' }
        }}>
          <NavigationPanel navigate={navigate} />
        </Box>

        {/* Main Content */}
        <Box sx={{
          flex: 1,
          p: { xs: 1, sm: 2 },
          maxWidth: { sm: 'calc(100% - 280px)' }
        }}>
          {loading && page === 1 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
              <CircularProgress size={60} />
            </Box>
          ) : filteredVideos.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              mt: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                No videos found
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Be the first to upload your {pagetype === 'jobseekers' ? 'resume video' : 'company profile'}
              </Typography>
              <Button 
                variant="contained"
                onClick={() => navigate('/video-upload')}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5
                }}
              >
                Upload Video
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                {filteredVideos.map((video) => (
                  <Grid item key={video.id} xs={12} sm={6} md={4} lg={4}>
                    <VideoCard
                      video={video}
                      isHovered={hoveredVideo === video.id}
                      onClick={() => handleVideoClick(video)}
                      onHover={(isHovering) => handleVideoHover(video.id, isHovering)}
                      toggleMute={() => toggleMute(video.id)}
                      isMuted={isMuted}
                    />
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: 'text.primary',
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white'
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AllVideosPage;