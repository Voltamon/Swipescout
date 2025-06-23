// VideosPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useVideoContext } from '../context/VideoContext'; // Correct import
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
import api, { deleteVideo ,getAllVideos ,getEmployerPublicVideos,getJobSeekersVideos } from '../services/api'; // Ensure deleteVideo is imported from your API service
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { VolumeUp, VolumeOff } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const AllVideosPage = () => {
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
   const { pagetype } = useParams();

  const VIDEOS_PER_PAGE = 9;

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // Fetch server videos with pagination
  const fetchServerVideos = async (pageNum) => {
    try {
      setLoading(true);
      let response;
      if(pagetype=='all'){
       response = await getAllVideos(pageNum, VIDEOS_PER_PAGE);
      }
    else if(pagetype=='jobseekers'){
         response = await getJobSeekersVideos(pageNum, VIDEOS_PER_PAGE);
    }
        else if(pagetype=='employers'){
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
    <Container maxWidth={false}  sx={{
        background: `linear-gradient(115deg,rgba(156, 187, 253, 0.73) 10%,rgba(178, 209, 224, 0.73) 60%), url('/backgrounds/bkg2.png')`,
        height: "100vh",
        backgroundRepeat: 'no-repeat',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 5,
        "& .MuiListItem-root": { color: "rgb(39, 56, 83)", "&.Mui-selected": { color: "#ffffff" } }
      }}>

        {/* Site Name Watermark */}
        <Box sx={{
          position: 'absolute',
          top: 20,
          right: 40,
          zIndex: 0, // Behind other content
          opacity: 0.3, // Very subtle
          pointerEvents: 'none' // Makes it non-interactive
        }}>
             
      <Typography 
        variant="subtitle2" 
        sx={{ 
          color:"black",
          cursor: 'pointer',
          py: '4px',
          px: 1,
          flexGrow: 1
        }}
        onClick={() => navigate('/login')}
      >
        Login
      </Typography>

          <Typography variant="h1" sx={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'rgb(45, 114, 192)',
            lineHeight: 1,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontFamily: 'Arial, sans-serif',
             WebkitTextStroke: '1px rgba(86, 122, 189, 0.3)', // Border effect
      paintOrder: 'stroke fill' 
          }}>
            SwipeScout
          </Typography>
        </Box>


     {/* Navigation Links Panel - Floating Version */}
<Box sx={{
  position: 'absolute', // This makes it float
  top: 16,             // Distance from top
  left: 16,            // Distance from left
  zIndex: 1000,        // Ensures it stays above other content
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '8px',
  padding: '12px 16px',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  maxWidth: '250px',
  mb: 3
}}>
  {/* Rest of your panel content remains the same */}
  <Typography  sx={{ 
    fontWeight: 'bold', 
    color: 'rgb(46, 111, 155)',
    mb: 1,
    fontFamily: 'Arial, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }}>
    Sample Videos
  </Typography>

  {/* Links Container */}
  <Box sx={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  }}>
    {/* All Videos Link */}
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      '&:hover': { 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px'
      }
    }}>
      <Box sx={{
        width: '4px',
        height: '24px',
        backgroundColor: 'primary.main',
        mr: 1,
        borderRadius: '2px'
      }} />
      <Typography 
        variant="subtitle2" 
        sx={{ 
          
          cursor: 'pointer',
          py: '4px',
          px: 1,
          flexGrow: 1
        }}
        onClick={() => navigate('/job-seeker-explore-public')}
      >
        Jobseekers
      </Typography>
</Box>
 <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      '&:hover': { 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px'
      }
    }}>
        <Box sx={{
        width: '4px',
        height: '24px',
        backgroundColor: 'primary.main',
        mr: 1,
        borderRadius: '2px'
      }} />
      <Typography 
        variant="subtitle2" 
        sx={{ 
          
          cursor: 'pointer',
          py: '4px',
          px: 1,
          flexGrow: 1
        }}
        onClick={() => navigate('/employer-explore-public')}
      >
        Employers
      </Typography>
    
</Box>
    
    </Box>
  <Typography  sx={{ 
    fontWeight: 'bold', 
    color: 'rgb(39, 111, 121)',
    mt: 1,
    fontFamily: 'Arial, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }}>
    Real Videos submited
  </Typography>

  {/* Links Container */}
  <Box sx={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  }}>
    {/* All Videos Link */}
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      '&:hover': { 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px'
      }
    }}>
      <Box sx={{
        width: '4px',
        height: '24px',
        backgroundColor: 'primary.main',
        mr: 1,
        borderRadius: '2px'
      }} />
      <Typography 
        variant="subtitle2" 
        sx={{ 
          
          cursor: 'pointer',
          py: '4px',
          px: 1,
          flexGrow: 1
        }}
        onClick={() => navigate('/videos/all')}
      >
        All Videos
      </Typography>
    </Box>

    {/* Jobseekers Link */}
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      '&:hover': { 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px'
      }
    }}>
      <Box sx={{
        width: '4px',
        height: '24px',
        backgroundColor: 'primary.main',
        mr: 1,
        borderRadius: '2px'
      }} />
      <Typography 
        variant="subtitle2" 
        sx={{ 
          
          cursor: 'pointer',
          py: '4px',
          px: 1,
          flexGrow: 1
        }}
        onClick={() => navigate('/videos/jobseekers')}
      >
        Jobseekers
      </Typography>
    </Box>

    {/* Employers Link */}
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      '&:hover': { 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px'
      }
    }}>
      <Box sx={{
        width: '4px',
        height: '24px',
        backgroundColor: 'primary.main',
        mr: 1,
        borderRadius: '2px'
      }} />
      <Typography 
        variant="subtitle2" 
        sx={{ 
          
          cursor: 'pointer',
          py: '4px',
          px: 1,
          flexGrow: 1
        }}
        onClick={() => navigate('/videos/employers')}
      >
        Employers
      </Typography>
    </Box>
  </Box>

  {/* Tagline */}
  <Typography variant="caption" sx={{ 
    color: 'rgba(49, 36, 36, 0.8)',
    fontStyle: 'italic',
    mt: 1,
    display: 'block'
  }}>
  </Typography>
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
            No resume uploaded yet, login and submit yours
          </Typography>
          
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
                    {video.video_url && (
                      <video
                        ref={el => videoRefs.current[video.id] = el}
                        src={video.video_url}
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
                        {video.video_title || 'Untitled Video'}
                      </Typography>

                      <Typography variant="body2" sx={{   color:'white',}}>
                        {video.video_type || 'Uncategorized'} •{' '}
                        {Math.round(video.video_duration || 0)}s
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

     
    </Container>
  );
};

export default AllVideosPage;