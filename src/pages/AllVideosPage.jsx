// AllVideosPage.jsx
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
import { CheckCircle, Error, CloudUpload, Replay, Delete, PlayArrow ,Home} from '@mui/icons-material';
import api, { deleteVideo, getAllVideos, getEmployerPublicVideos, getJobSeekersVideos } from '../services/api';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { VolumeUp, VolumeOff } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { bold } from '@cloudinary/url-gen/qualifiers/fontWeight';
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet"></link>
import SwipeScoutWatermark from "../components/SwipeScoutWatermark";
import NavigationPanel from "../components/NavigationPanel";
import Header from '../components/Tmp/HeaderExplore';

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

  return (<Box sx={{
        background: `linear-gradient(115deg,rgba(156, 187, 253, 0.73) 10%,rgba(178, 209, 224, 0.73) 60%), url('/backgrounds/bkg1.png')`,
        minHeight: "100vh",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: "top right",}} > <Header />
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on xs, row on sm+
        alignItems: { xs: 'center', sm: 'flex-start' }, // Center on xs, align to start on sm+
        width: "100%",
        "& .MuiListItem-root": { color: "rgb(39, 56, 83)", "&.Mui-selected": { color: "#ffffff" } }
      }}
    >
      

      <SwipeScoutWatermark />

      {/* NavigationPanel Wrapper - acts as sidebar on sm+ */}
      <Box sx={{
        width: { xs: '100%', sm: '270px' }, // Full width on mobile, fixed width on desktop
        p: { xs: 2, sm: 2 }, // Consistent padding
        flexShrink: 0, // Prevent shrinking of the sidebar
        mt: { xs: 0, sm: 3 } // Adjust top margin as needed
      }}>
        <NavigationPanel navigate={navigate} user={user} />
      </Box>

      {/* Main Content Area (Video Grid and Alerts) */}
      <Box sx={{
        flexGrow: 1, // Occupy remaining space on desktop
        width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto-width for flexGrow on desktop
        maxWidth: { xs: '100%', sm: '1200px' }, // Max width for content within flexGrow
        px: 2,
        mt: { xs: 0, sm: 3 }, // Adjust top margin as needed
        ml: { xs: 0, sm: 0 }, // No left margin needed for flex layout
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {uploadLimitReached && (
          <Alert severity="warning" sx={{ mb: 3, width: '100%' }}>
            You have reached your daily upload limit. Please try again tomorrow.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
            {error}
          </Alert>
        )}

        {loading && page === 1 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredVideos.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              No resume videos uploaded yet, login and submit yours
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
              {filteredVideos.map((video) => (
                <Grid item key={video.id} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card
                    sx={{
                      width: '300px',
                      maxWidth: '100%',
                      borderRadius: 2,
                      boxShadow: 2,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                      position: 'relative',
                      overflow: 'hidden',
                      aspectRatio: "9/16",
                    }}
                    onMouseEnter={() => handleVideoHover(video.id, true)}
                    onMouseLeave={() => handleVideoHover(video.id, false)}
                    onClick={() => handleVideoClick(video)}
                  >
                    {(video.status === 'uploading' || video.status === 'processing') && (
                      <StatusBorder status={video.status} />
                    )}

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
                          ref={el => videoRefs.current[video.id] = el}
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

                      <Box
                        className="play-icon-overlay"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "#fff",
                          bgcolor: "rgba(255, 64, 129, 0.7)",
                          borderRadius: "50%",
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: hoveredVideo === video.id ? 0 : 1,
                          transition: "opacity 0.3s",
                        }}
                      >
                        <PlayArrow fontSize="large" />
                      </Box>

                      <IconButton
                        onClick={(e) => toggleMute(e, video.id)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 2,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white'
                        }}
                      >
                        {isMuted ? <VolumeOff /> : <VolumeUp />}
                      </IconButton>

                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 2,
                          color: 'white',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                          zIndex: 1,
                        }}
                      >
                        <Typography variant="subtitle1" noWrap sx={{ color: 'white' }}>
                          {video.video_title || 'Untitled Video'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {video.video_type || 'Uncategorized'} • {Math.round(video.video_duration || 0)}s
                        </Typography>
                      </Box>
                    </CardMedia>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                    '& .Mui-selected': {
                      backgroundColor: 'rgba(255,255,255,0.4)',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box></Box>
  );
};

export default AllVideosPage;