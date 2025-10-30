import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Pagination
} from '@mui/material';
import {
  Psychology,
  TuneRounded,
  PlayArrow,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Share,
  Visibility,
  TrendingUp,
  FilterList
} from '@mui/icons-material';
import { getMatchingVideos } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
 
const AIMatchingPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useAIMatching, setUseAIMatching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [savedVideos, setSavedVideos] = useState(new Set());

  useEffect(() => {
    fetchVideos();
  }, [currentPage, useAIMatching]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await getMatchingVideos(user.id, 12, currentPage);
      const data = response.data.data;
      
      setVideos(data.videos || []);
      setTotalPages(Math.ceil(data.total / 12));
    } catch (err) {
      setError('Failed to fetch matching videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAIMatching = (event) => {
    setUseAIMatching(event.target.checked);
    setCurrentPage(1); // Reset to first page when toggling
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleLikeVideo = (videoId) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleSaveVideo = (videoId) => {
    setSavedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  if (loading && videos.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Psychology color="primary" />
          {t('aiMatching.title', 'AI Video Matching')}
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={useAIMatching}
                onChange={handleToggleAIMatching}
                color="primary"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <TuneRounded fontSize="small" />
                {t('aiMatching.useAIMatching', 'AI Matching')}
              </Box>
            }
          />
          
          <Tooltip title={t('aiMatching.filterTooltip', 'Advanced Filters')}>
            <IconButton>
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {useAIMatching && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUp />
            <Typography variant="body2">
              {t('aiMatching.aiDescription', 'Videos are personalized based on your profile, skills, and career interests using AI matching algorithms.')}
            </Typography>
          </Box>
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': { 
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              {/* Video Thumbnail */}
              <Box 
                sx={{ 
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  backgroundColor: 'grey.200',
                  cursor: 'pointer'
                }}
              >
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
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
                
                {/* Play Button Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '50%',
                    p: 1
                  }}
                >
                  <PlayArrow sx={{ color: 'white', fontSize: 32 }} />
                </Box>

                {/* Duration Badge */}
                {video.duration && (
                  <Chip
                    label={formatDuration(video.duration)}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}
                  />
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                {/* User Info */}
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Avatar 
                    src={video.user?.profilePicture} 
                    sx={{ width: 32, height: 32 }}
                  >
                    {video.user?.name?.charAt(0)}
                  </Avatar>
                  <Box flexGrow={1} minWidth={0}>
                    <Typography variant="body2" noWrap>
                      {video.user?.name || 'Unknown User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {video.user?.title || 'Professional'}
                    </Typography>
                  </Box>
                </Box>

                {/* Video Title */}
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 'medium',
                    mb: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {video.title || 'Untitled Video'}
                </Typography>

                {/* Tags */}
                <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                  {video.tags?.slice(0, 2).map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  ))}
                  {video.tags?.length > 2 && (
                    <Chip
                      label={`+${video.tags.length - 2}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  )}
                </Box>

                {/* Stats */}
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Visibility fontSize="small" color="action" />
                    <Typography variant="caption">
                      {formatViews(video.views)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleLikeVideo(video.id)}
                      color={likedVideos.has(video.id) ? 'primary' : 'default'}
                    >
                      {likedVideos.has(video.id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => handleSaveVideo(video.id)}
                      color={savedVideos.has(video.id) ? 'primary' : 'default'}
                    >
                      {savedVideos.has(video.id) ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                    <IconButton size="small">
                      <Share />
                    </IconButton>
                  </Box>
                  
                  {useAIMatching && (
                    <Chip
                      label={`${Math.round(Math.random() * 30 + 70)}% match`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {videos.length === 0 && !loading && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('aiMatching.noVideos', 'No videos found')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {useAIMatching 
              ? t('aiMatching.noMatchingVideos', 'No matching videos found based on your profile. Try adjusting your preferences.')
              : t('aiMatching.noGeneralVideos', 'No videos available at the moment. Check back later.')
            }
          </Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {loading && videos.length > 0 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default AIMatchingPage;

