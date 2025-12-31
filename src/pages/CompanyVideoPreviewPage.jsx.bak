import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper
} from "@mui/material";
import { 
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Close,
  Business,
  LocationOn,
  People,
  Language,
  Work,
  Star,
  Favorite,
  FavoriteBorder,
  Share,
  Bookmark,
  BookmarkBorder,
  Comment,
  Send
} from "@mui/icons-material";
import { useParams } from 'react-router-dom';
import { getCompanyVideo, likeVideo, unlikeVideo, saveVideo, unsaveVideo } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';

export default function CompanyVideoPreviewPage() {
  // const theme = useTheme(); // Removed: unused variable
  const { videoId } = useParams();
  // const { user } = useAuth(); // Removed: unused variable
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState([]);

  useEffect(() => {
    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  const fetchVideoData = async () => {
    setLoading(true);
    try {
      const response = await getCompanyVideo(videoId);
      setVideo(response.data);
      setIsLiked(response.data.isLiked || false);
      setIsSaved(response.data.isSaved || false);
      
      // Fetch related jobs from the same company
      if (response.data.companyId) {
        // This would be a separate API call
        // const jobsResponse = await getCompanyJobs(response.data.companyId);
        // setRelatedJobs(jobsResponse.data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      setError('Failed to load video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeVideo(videoId);
        setIsLiked(false);
        setVideo(prev => ({ ...prev, likes: (prev.likes || 0) - 1 }));
      } else {
        await likeVideo(videoId);
        setIsLiked(true);
        setVideo(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      }
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await unsaveVideo(videoId);
        setIsSaved(false);
      } else {
        await saveVideo(videoId);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: video.title,
        text: `Check out this company video from ${video.company}`,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !video) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Video not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Video Player Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <Box position="relative" sx={{ paddingTop: '56.25%', bgcolor: 'black' }}>
              {video.videoUrl ? (
                <video
                  src={video.videoUrl}
                  poster={video.thumbnail}
                  controls
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ bgcolor: 'grey.900' }}
                >
                  <Typography color="white">Video not available</Typography>
                </Box>
              )}
            </Box>
          </Card>

          {/* Video Info */}
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {video.title}
              </Typography>

              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={video.companyLogo}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  >
                    {video.company?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{video.company}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" gap={1}>
                  <Button
                    variant={isLiked ? "contained" : "outlined"}
                    startIcon={isLiked ? <Favorite /> : <FavoriteBorder />}
                    onClick={handleLike}
                    size="small"
                  >
                    {video.likes || 0}
                  </Button>
                  <IconButton onClick={handleSave} color={isSaved ? "primary" : "default"}>
                    {isSaved ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                  <IconButton onClick={handleShare}>
                    <Share />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Company Info */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  About {video.company}
                </Typography>
                
                <Grid container spacing={2} mb={2}>
                  {video.location && (
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center">
                        <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{video.location}</Typography>
                      </Box>
                    </Grid>
                  )}
                  {video.companySize && (
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center">
                        <People sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{video.companySize} employees</Typography>
                      </Box>
                    </Grid>
                  )}
                  {video.industry && (
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center">
                        <Business sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{video.industry}</Typography>
                      </Box>
                    </Grid>
                  )}
                  {video.website && (
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center">
                        <Language sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={video.website}
                          target="_blank"
                          sx={{ textDecoration: 'none', color: 'primary.main' }}
                        >
                          Company Website
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                {video.description && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {showFullDescription 
                        ? video.description 
                        : `${video.description.substring(0, 200)}${video.description.length > 200 ? '...' : ''}`
                      }
                    </Typography>
                    {video.description.length > 200 && (
                      <Button
                        size="small"
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        sx={{ mt: 1 }}
                      >
                        {showFullDescription ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </Box>
                )}
              </Box>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Tags:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {video.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        clickable
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Company Stats */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Company Highlights
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Company Rating
                </Typography>
                <Box display="flex" alignItems="center">
                  <Star sx={{ color: '#ffc107', mr: 0.5 }} />
                  <Typography variant="h6">
                    {video.companyRating || 'N/A'}
                  </Typography>
                  {video.reviewCount && (
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({video.reviewCount} reviews)
                    </Typography>
                  )}
                </Box>
              </Box>

              {video.benefits && video.benefits.length > 0 && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Benefits
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {video.benefits.slice(0, 3).map((benefit, index) => (
                      <Chip
                        key={index}
                        label={benefit}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {video.benefits.length > 3 && (
                      <Chip
                        label={`+${video.benefits.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                startIcon={<Work />}
                onClick={() => window.open(`/company/${video.companyId}/jobs`, '_blank')}
              >
                View Open Positions
              </Button>
            </CardContent>
          </Card>

          {/* Related Jobs */}
          {relatedJobs.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Open Positions at {video.company}
                </Typography>
                
                <List dense>
                  {relatedJobs.slice(0, 5).map((job) => (
                    <ListItem
                      key={job.id}
                      button
                      onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                      sx={{ px: 0 }}
                    >
                      <ListItemText
                        primary={job.title}
                        secondary={`${job.location} • ${job.type}`}
                      />
                    </ListItem>
                  ))}
                </List>

                {relatedJobs.length > 5 && (
                  <Button
                    size="small"
                    onClick={() => window.open(`/company/${video.companyId}/jobs`, '_blank')}
                  >
                    View All {relatedJobs.length} Positions
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Similar Companies */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Similar Companies
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Discover more companies in {video.industry || 'this industry'}
              </Typography>
              
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => window.open('/company-videos', '_blank')}
              >
                Explore Companies
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

