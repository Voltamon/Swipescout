import React, { useState, useEffect, useRef } from 'react';
import { useVideoContext } from '../context/VideoContext';
import {
  Container, Grid, Card, CardMedia, CardContent,
  Typography, Button, CircularProgress, Box,
  LinearProgress, Chip, Stack, Alert, IconButton,
  Pagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Error, CloudUpload, Replay } from '@mui/icons-material';
import api from '../services/api';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { VolumeUp, VolumeOff } from '@mui/icons-material';


const VideosPage = () => {
  const { videos: localVideos, retryUpload } = useVideoContext();
  const [serverVideos, setServerVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadLimitReached, setUploadLimitReached] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const videoRefs = useRef({});
  const navigate = useNavigate();

  const VIDEOS_PER_PAGE = 9;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // localStorage.removeItem('videoResumes'); // Clear previous data

    const toggleMute = () => {
  setIsMuted(prev => !prev);
};

  // Fetch server videos with pagination
  const fetchServerVideos = async (pageNum) => {
    try {
      setLoading(true);
      const response = await api.get(`/videos/?page=${pageNum}&limit=${VIDEOS_PER_PAGE}`);
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

  // Check upload limit from server
  const checkUploadLimit = async () => {
    try {
      const response = await api.get(`/videos/upload-limit`);
      setUploadLimitReached(response.data.limitReached);
      return response.data.limitReached;
    } catch (err) {
      console.error('Failed to check upload limit:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchServerVideos(page);
    checkUploadLimit();
  }, [page]);

  const handleUploadClick = async () => {
    const limitReached = await checkUploadLimit();
    if (limitReached) {
      alert('You have reached your daily upload limit. Please try again tomorrow.');
      return;
    }
    navigate('/video-resume-upload');
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

const handleVideoHover = (videoId, isHovering) => {
  const allRefs = videoRefs.current;

  // Stop all videos first
  Object.entries(allRefs).forEach(([id, videoEl]) => {
    if (videoEl && !videoEl.paused) {
      videoEl.pause();
      videoEl.currentTime = 0;
    }
  });

  if (isHovering) {
    setHoveredVideo(videoId);
    const videoEl = videoRefs.current[videoId];
    if (videoEl) {
      videoEl.play().catch(e => console.log('Autoplay prevented:', e));
    }
  } else {
    const videoEl = videoRefs.current[videoId];
    if (videoEl) {
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

  // Combine local and server videos, with local videos first
  const allVideos = [
    ...localVideos.map(v => ({ ...v, isLocal: true })),
    ...serverVideos.map(v => ({ ...v, isLocal: false, status: v.status || 'completed' }))
  ];

  // Filter out local videos that have been successfully uploaded
  const filteredVideos = allVideos.filter(video => {
    if (video.isLocal && video.status === 'completed') {
      return !serverVideos.some(sv => sv.id === video.id);
    }
    return true;
  });

  return (
    <Container maxWidth={false}  sx={{
    background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%), url('/backgrounds/bkg1.png')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top right',
    padding: 0,
    minHeight: '100vh',
    height: '100%', 
    mt: 0,
    pt: 2,
    mb: 0,
    paddingBottom: 4,
  }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' ,color: 'rgba(29, 99, 139, 0.6)' ,fontFamily: 'arial'}}>
          My Videos
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleUploadClick}
          startIcon={<CloudUpload />}
          disabled={uploadLimitReached}
        >
          Upload New Video
        </Button>
      </Box>

      {uploadLimitReached && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have reached your daily upload limit. Please try again tomorrow.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
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
            No videos uploaded yet
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleUploadClick}
            sx={{ mt: 2 }}
            startIcon={<CloudUpload />}
            disabled={uploadLimitReached}
          >
            Upload Your First Video
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ alignItems:'center', justifyContent:'center'}}>
            {filteredVideos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
                <Card
                  sx={{
                    width: '350px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: 2,
                    boxShadow: 2,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                  onMouseEnter={() => handleVideoHover(video.id, true)}
                  onMouseLeave={() => handleVideoHover(video.id, false)}
                  onClick={() => handleVideoClick(video)}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      paddingTop: '56.25%', // 16:9 aspect ratio
                      backgroundColor: '#000',
                      position: 'relative',
                      overflow: 'hidden',
                      height: '600px',
                      borderRadius: '8px 8px 0 0',
                      cursor: 'pointer'
                    }}
                  >
                    {video.video_url && (
                      <video
                        ref={el => videoRefs.current[video.id] = el}
                        src={video.video_url}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '600px',
                          objectFit: 'cover',
                          backgroundColor: '#000',
                        }}
                        muted={isMuted}
                        loop
                        playsInline
                        disablePictureInPicture
                        controlsList="nodownload"
                      />
                    )}
                  <IconButton
  onClick={(e) => {
    e.stopPropagation(); // don't trigger card click
    toggleMute();
  }}
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
                    {/* Overlay Content */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 25,
                        left: 0,
                        right: 0,
                        p: 0,
                        color: 'white',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
                        zIndex: 1,
                      }}
                    >
    
                      <Typography gutterBottom noWrap sx={{color: 'white', pl: 1 ,pb: 0 ,mp: 0}}>
                        {video.video_title || 'Untitled Video'}
                      </Typography>

                      <Typography variant="body2" sx={{color: 'white', pl: 1 ,pb: 0 ,mp: 0}}>
                        {video.video_type || 'Uncategorized'} •{' '}
                        {Math.round(video.video_duration || 0)}s
                      </Typography>

                      {video.hashtags && (
                        <Stack direction="row" spacing={1} sx={{ mt: 0, flexWrap: 'wrap', gap: 0 ,pb: 0 ,mp: 0}}>
                          {(() => {
                            try {
                              let tags = [];
                              if (Array.isArray(video.hashtags)) {
                                tags = video.hashtags;
                              } else {
                                try {
                                  const parsed = JSON.parse(video.hashtags);
                                  tags = Array.isArray(parsed) ? parsed : [parsed];
                                } catch (e) {
                                  tags = video.hashtags.split(',').map(t => t.trim()).filter(Boolean);
                                }
                              }
                              return tags.map((tag, i) => (
                                <Chip
                                  key={`${video.id}-${i}`}
                                  label={`#${tag}`}
                                  size="small"
                                  sx={{ color: 'white', borderColor: 'white' }}
                                />
                              ));
                            } catch (error) {
                              console.error('Error parsing hashtags:', error);
                              return null;
                            }
                          })()}
                        </Stack>
                      )}
                      {video.isLocal && (<>{video.status === 'uploading' && (
                    <>
                      <Typography variant="caption" display="block">
                        Uploading... {video.progress}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={video.progress}
                      />
                    </>
                  )}
                  {video.status === 'processing' && (<>
                    <Typography variant="caption" display="block">
                      Processing...
                    </Typography><CloudSyncIcon/></>
                  )}</>)}
                    </Box>
                  </CardMedia>

                  {/* CardContent - Additional info below the video */}
                  <CardContent sx={{ flexGrow: 1, pt: 2, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {video.status === 'completed' && !video.isLocal && (
                        <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                      )}
                    </Box>

                    {video.isLocal && (
                      <Box sx={{ mt: 0 }}>
                        
                        {video.status === 'failed' && (
                          <>
                            <Typography variant="caption" color="error" display="block">
                              Upload Failed: {video.error}
                            </Typography>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Replay />}
                              onClick={(e) => {
                                e.stopPropagation();
                                retryUpload(video.id);
                              }}
                              sx={{ mt: 1 }}
                            >
                              Retry
                            </Button>
                          </>
                        )}
                      </Box>
                    )}
                  </CardContent>
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
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default VideosPage;