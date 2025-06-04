import React, { useState, useEffect } from 'react';
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

const VideosPage = () => {
  const { videos: localVideos, retryUpload } = useVideoContext();
  const [serverVideos, setServerVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadLimitReached, setUploadLimitReached] = useState(false);
  const navigate = useNavigate();

  const VIDEOS_PER_PAGE = 9;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // Fetch server videos with pagination
  const fetchServerVideos = async (pageNum) => {
    try {
      setLoading(true);
      const response = await api.get(`${API_BASE_URL}/api/job-seekers/videos?page=${pageNum}&limit=${VIDEOS_PER_PAGE}`);
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
      const response = await api.get(`${API_BASE_URL}/api/job-seekers/upload-limit`);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          My Video Resumes
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
          <Grid container spacing={3}>
            {filteredVideos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: "300px",
                      paddingTop: '56.25%',
                      backgroundColor: '#000',
                      position: 'relative'
                    }}
                  >
                    {video.video_url && (
                      <video
                        src={video.video_url}
                        controls
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                  </CardMedia>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography gutterBottom variant="h6" sx={{ flexGrow: 1 }}>
                        {video.video_title}
                      </Typography>
                      {video.status === 'completed' && !video.isLocal && (
                        <CheckCircle color="success" />
                      )}
                      {video.isLocal && (
                        <Chip label="Local" size="small" color="info" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {video.video_type} • {Math.round(video.video_duration || 0)}s
                    </Typography>
                    {video.hashtags && (
  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
    {(() => {
      try {
        // Handle different formats:
        // 1. Already an array
        // 2. JSON string that can be parsed
        // 3. Comma-separated string
        let tags = [];
        if (Array.isArray(video.hashtags)) {
          tags = video.hashtags;
        } else {
          try {
            // First try to parse as JSON
            const parsed = JSON.parse(video.hashtags);
            tags = Array.isArray(parsed) ? parsed : [parsed];
          } catch (e) {
            // If JSON parsing fails, try splitting by commas
            tags = video.hashtags.split(',').map(t => t.trim()).filter(t => t);
          }
        }
        return tags.map((tag, i) => (
          <Chip key={`${video.id}-${i}`} label={tag} size="small" />
        ));
      } catch (error) {
        console.error('Error parsing hashtags:', error);
        return null;
      }
    })()}
  </Stack>
)}
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(video.submitted_at).toLocaleString()}
                      </Typography>
                      {video.isLocal && (
                        <Box sx={{ mt: 1 }}>
                          {video.status === 'uploading' && (
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
                          {video.status === 'processing' && (
                            <Typography variant="caption" display="block">
                              Processing...
                            </Typography>
                          )}
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
                    </Box>
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