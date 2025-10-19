// VideosPage.jsx
import React, { useContext, useState, useEffect, useRef  } from 'react';
import { useVideoContext } from '../contexts/VideoContext'; // Correct import
import { styled } from "@mui/material/styles";
import {
  Container, Grid, Card, CardMedia, CardContent,
  Typography, Button, CircularProgress, Box,
  LinearProgress, Chip, Stack, Alert, IconButton,
  Pagination, Dialog, DialogTitle, DialogContent,
  DialogActions, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Error, CloudUpload, Replay, Delete } from '@mui/icons-material';
import api, { deleteVideo } from '../services/api'; // Ensure deleteVideo is imported from your API service
import { toast } from 'react-toastify';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { VolumeUp, VolumeOff } from '@mui/icons-material';

const VideosPage = ({setVideoTab}) => {
  // Destructure removeVideo from useVideoContext
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' }); // Added for retry messages

  const videoRefs = useRef({});
  const navigate = useNavigate();

  const VIDEOS_PER_PAGE = 9;

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

  // Handle video deletion
  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;
    
    try {
      if (videoToDelete.isLocal) {
        // If it's a local video (e.g., failed upload, or still uploading)
        // We directly remove it from the local contexts/AuthContextlocalStorage
        removeVideo(videoToDelete.id);
        setSnackbar({
          open: true,
          message: 'Video removed successfully.',
          severity: 'success'
        });
      } else {
        // If it's a server video, call the API to delete it
        await deleteVideo(videoToDelete.id);
        removeVideo(videoToDelete.id);
        setSnackbar({
          open: true,
          message: 'Video deleted from server successfully.',
          severity: 'success'
        });
        // After successful server deletion, refetch server videos
        await fetchServerVideos(page);
      }
    } catch (err) {
      console.error('Failed to delete video:', err);
      setError('Failed to delete video. Please try again.');
      setSnackbar({
        open: true,
        message: 'Failed to delete video: ' + (err.response?.data?.message || err.message),
        severity: 'error'
      });
    } finally {
      setDeleteConfirmOpen(false);
      setVideoToDelete(null);
    }
  };

  // Handle retry for stuck processing videos
  const handleRetry = async (video) => {
    try {
      if (video.status === 'failed' || video.isLocal) { // Use retryUpload for local failed or stuck uploads
        await retryUpload(video.id);
      } else if (video.status === 'processing') { // For server-side stuck processing
        await api.post(`/videos/${video.id}/retry-processing`);
      }
      
      // Refresh the list
      await fetchServerVideos(page);
      setSnackbar({
        open: true,
        message: 'Retry started successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Retry failed:', error);
      setSnackbar({
        open: true,
        message: 'Retry failed: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchServerVideos(page);
    checkUploadLimit();
  }, [page]);

  const handleUploadClick = async () => {
    const limitReached = await checkUploadLimit();
    if (limitReached) {
      toast.info('You have reached your daily upload limit. Please try again tomorrow.');
      return;
    }
     navigate('/jobseeker-tabs?group=profileContent&tab=video-upload');
        // setVideoTab(1); 

  //navigate('/video-upload');
  };



  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleVideoHover = (videoId, isHovering) => {
    if (isHovering) {
      setHoveredVideo(videoId);
      const videoEl = videoRefs.current[videoId];
      if (videoEl) {
        videoEl.currentTime = 0;
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

  // Combine local and server videos, with local videos first
  const allVideos = [
    ...localVideos.map(v => ({ ...v, isLocal: true })),
    ...serverVideos.map(v => ({ ...v, isLocal: false, status: v.status || 'completed' }))
  ];

  // Filter out local videos that have been successfully uploaded AND are now present on the server
  // This prevents duplicates of successfully uploaded videos.
  const filteredVideos = allVideos.filter(video => {
    if (video.isLocal && video.status === 'completed') {
      return !serverVideos.some(sv => sv.id === video.id);
    }
    return true;
  });

  // Styled component for processing/uploading borders
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
    <Container maxWidth={false} sx={{
      bgcolor: 'background.jobseeker',
      padding: 0,
      minHeight: 'calc(100vh - 24px)', // Adjust for header
      mt: 0,
      pt: 2,
      pb: 4,
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', fontFamily: 'arial' }}>
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
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {filteredVideos.map((video) => (
          <Grid item key={video.id} xs={12} sm={6} md={4} lg={4}> {/* Changed lg from 3 to 4 */}
            <Card
              sx={{
                width: '300px',
                maxWidth: 400, // Increased from 350
                height: '400px', // Ensure card takes full height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
                position: 'relative',
                overflow: 'visible',
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
                
                    width: '300px',
                    height: '400px',
            paddingTop: '56.25%', // 16:9 aspect ratio
            backgroundColor: '#000',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer'
          }}
        >
                    { (video.video_url || video.videoUrl || video.video_url) && (
                      <video
                        ref={el => videoRefs.current[video.id] = el}
                        src={video.video_url || video.videoUrl || video.videoUrl}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          
                            width: '300px',
                            
                            height: '400px',
                          
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
                        e.stopPropagation();
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

                    {/* Delete button */}
                    <Tooltip title="Delete video">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoToDelete(video); // This is correct, 'video' contains 'isLocal'
                          setDeleteConfirmOpen(true);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          zIndex: 2,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white'
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* Overlay Content */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 1,
                        color: 'white',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                        zIndex: 1,
                      }}
                    >
                      <Typography variant="subtitle1" noWrap  sx={{   color:'white',}}>
                        {video.video_title || video.videoTitle || video.title || 'Untitled Video'}
                      </Typography>

                      <Typography variant="body2" sx={{   color:'white',}}>
                        {(video.category || video.video_category || video.catagory || video.video_type || 'Uncategorized')} •{' '}
                        {Math.round((video.video_duration || video.videoDuration || 0))}s
                      </Typography>

                      {video.hashtags && (
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
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
                                  sx={{ 
                                    color: 'white', 
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    height: '24px'
                                  }}
                                />
                              ));
                            } catch (error) {
                              console.error('Error parsing hashtags:', error);
                              return null;
                            }
                          })()}
                        </Stack>
                      )}
                    </Box>
                  </CardMedia>

                  {/* CardContent - Status information */}
                  <CardContent sx={{ pt: 1, pb: 1 }}>
                    {video.isLocal && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {video.status === 'completed' ? (
                          <CheckCircle color="success" />
                        ) : (
                          <CloudSyncIcon />
                        )}
                        {video.status === 'uploading' && (
                          <>
                            <Typography variant="caption" color="text.secondary">
                              Uploading... {video.progress}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={video.progress}
                              color="error"
                              sx={{ width: '60%' }}
                            />
                          </>
                        )}

                      {/* Show retry button for failed or local failed uploads */}
                      {video.isLocal && video.status === 'failed' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Replay />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetry(video);
                          }}
                          sx={{ mt: 1 }}
                        >
                          Retry Upload
                        </Button>
                      )}

                      {/* If not local and completed, show check mark */}
                      {!video.isLocal && video.status === 'completed' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle color="success" />
                          <Typography variant="caption" color="text.secondary">Ready</Typography>
                        </Box>
                      )}
                    </Box>

                  {/*  {!video.isLocal && video.status === 'completed' && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="caption" color="text.secondary">
                          Ready
                        </Typography>
                      </Box>
                    )} */}
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

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Video</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this video? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteVideo} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VideosPage;