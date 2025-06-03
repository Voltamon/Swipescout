import React, { useContext } from 'react';
import { useVideoContext } from '../context/VideoContext';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const VideosPage = () => {
  const { videos } = useVideoContext();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
        My Video Resumes
      </Typography>

      {videos.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            No videos uploaded yet
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/upload-video')}
            sx={{ mt: 2 }}
          >
            Upload Your First Video
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card>
                <CardMedia
                  component={video.isLocal ? 'div' : 'video'}
                  src={video.video_url}
                  controls={!video.isLocal}
                  sx={{
                    height: 0,
                    paddingTop: '56.25%', // 16:9
                    backgroundColor: '#000',
                    position: 'relative'
                  }}
                >
                  {video.isLocal && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      color: '#fff'
                    }}>
                      <CircularProgress color="inherit" />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        {video.status === 'uploading' 
                          ? `Uploading... ${video.progress}%` 
                          : 'Processing...'}
                      </Typography>
                    </Box>
                  )}
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {video.video_title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {video.video_type} • {Math.round(video.video_duration)}s
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default VideosPage;