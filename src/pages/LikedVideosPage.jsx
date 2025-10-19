import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
  Tooltip
} from '@mui/material';
import {
  PlayArrow,
  Favorite,
  FavoriteBorder,
  Share,
  MoreVert,
  Search,
  FilterList,
  Visibility,
  Work,
  Business,
  Sort,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useContext } from 'react';
import { 
  getUserLikedVideos, 
  unlikeVideo, 
  saveVideo,
  unsaveVideo,
  shareVideo 
} from '../services/api';
import { toast } from 'react-toastify';
import AllVideosPage from './AllVideosPage';

const LikedVideosPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('liked_date');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [savedVideos, setSavedVideos] = useState(new Set());

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      setLoading(true);
      const response = await getUserLikedVideos();
      setLikedVideos(response.data.videos || []);
      
      // Track which videos are saved
      const saved = new Set();
      response.data.videos?.forEach(video => {
        if (video.is_saved) {
          saved.add(video.id);
        }
      });
      setSavedVideos(saved);
    } catch (error) {
      console.error('Failed to fetch liked videos:', error);
      setError('Failed to load liked videos');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlikeVideo = async (videoId) => {
    try {
      await unlikeVideo(videoId);
      setLikedVideos(prev => prev.filter(video => video.id !== videoId));
    } catch (error) {
      console.error('Failed to unlike video:', error);
      setError('Failed to unlike video');
    }
  };

  const handleToggleSave = async (videoId) => {
    try {
      if (savedVideos.has(videoId)) {
        await unsaveVideo(videoId);
        setSavedVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
      } else {
        await saveVideo(videoId);
        setSavedVideos(prev => new Set([...prev, videoId]));
      }
    } catch (error) {
      console.error('Failed to toggle save video:', error);
      setError('Failed to save/unsave video');
    }
  };

  const handleShareVideo = async (video) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: video.video_title,
          text: `Check out this video: ${video.video_title}`,
          url: `${window.location.origin}/video-player/${video.id}`,
        });
      } else {
  await navigator.clipboard.writeText(`${window.location.origin}/video-player/${video.id}`);
  toast.success('Link copied to clipboard!');
      }
      
      await shareVideo(video.id, 'link');
    } catch (error) {
      console.error('Failed to share video:', error);
    }
  };

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    setShowVideoPlayer(true);
  };

  const filteredVideos = likedVideos.filter(video => {
    const matchesSearch = video.video_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'jobseeker' && video.video_type === 'Job Seeker') ||
                         (filterType === 'employer' && video.video_type === 'Employer');
    
    return matchesSearch && matchesFilter;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'liked_date':
        return new Date(b.liked_at || b.created_at) - new Date(a.liked_at || a.created_at);
      case 'title':
        return a.video_title?.localeCompare(b.video_title);
      case 'views':
        return (b.views_count || 0) - (a.views_count || 0);
      case 'likes':
        return (b.likes_count || 0) - (a.likes_count || 0);
      default:
        return 0;
    }
  });

  if (showVideoPlayer && selectedVideo) {
    return (
      <AllVideosPage 
        pagetype="liked"
        onClose={() => {
          setShowVideoPlayer(false);
          setSelectedVideo(null);
        }}
      />
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Liked Videos
        </Typography>
        <Chip 
          label={`${likedVideos.length} videos liked`} 
          color="error" 
          variant="outlined"
          icon={<Favorite />}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filter Controls */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search liked videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              Filter: {filterType === 'all' ? 'All' : filterType === 'jobseeker' ? 'Job Seekers' : 'Employers'}
            </Button>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Sort />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              Sort: {sortBy.replace('_', ' ')}
            </Button>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/videos/all')}
            >
              Browse Videos
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Videos Grid */}
      {sortedVideos.length > 0 ? (
        <Grid container spacing={3}>
          {sortedVideos.map((video) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      backgroundImage: `url(${video.thumbnail_url || '/api/placeholder/300/200'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover .play-button': {
                        opacity: 1,
                        transform: 'scale(1.1)'
                      }
                    }}
                    onClick={() => handlePlayVideo(video)}
                  >
                    <IconButton
                      className="play-button"
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        opacity: 0.8,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        }
                      }}
                    >
                      <PlayArrow sx={{ fontSize: 40 }} />
                    </IconButton>
                  </CardMedia>
                  
                  <Chip
                    label={video.video_type === 'Job Seeker' ? 'Job Seeker' : 'Employer'}
                    size="small"
                    color={video.video_type === 'Job Seeker' ? 'primary' : 'secondary'}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                  />
                  
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSave(video.id);
                      }}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        }
                      }}
                    >
                      {savedVideos.has(video.id) ? <Bookmark color="primary" /> : <BookmarkBorder />}
                    </IconButton>
                  </Box>
                  
                  <Box sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    display: 'flex',
                    gap: 0.5
                  }}>
                    <Chip
                      label={`${video.views_count || 0} views`}
                      size="small"
                      sx={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}
                    />
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {video.video_title}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {video.user?.displayName?.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {video.user?.displayName}
                    </Typography>
                  </Box>

                  {video.hashtags && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {video.hashtags}
                    </Typography>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Typography variant="caption" color="text.secondary">
                      Liked {new Date(video.liked_at || video.created_at).toLocaleDateString()}
                    </Typography>
                    <Box display="flex" gap={0.5} alignItems="center">
                      <Favorite sx={{ fontSize: 16, color: 'error.main' }} />
                      <Typography variant="caption">
                        {video.likes_count || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<PlayArrow />}
                    onClick={() => handlePlayVideo(video)}
                  >
                    Watch
                  </Button>
                  
                  <Tooltip title="Unlike">
                    <IconButton
                      size="small"
                      onClick={() => handleUnlikeVideo(video.id)}
                      color="error"
                    >
                      <Favorite />
                    </IconButton>
                  </Tooltip>
                  
                  <Button
                    size="small"
                    startIcon={<Share />}
                    onClick={() => handleShareVideo(video)}
                  >
                    Share
                  </Button>
                  
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setSelectedVideo(video);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={8}>
          <Favorite sx={{ fontSize: 80, color: 'error.light', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            No liked videos yet
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Start liking videos to see them here
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/videos/all')}
          >
            Browse Videos
          </Button>
        </Box>
      )}

      {/* Filter/Sort Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setFilterType('all'); setAnchorEl(null); }}>
          All Videos
        </MenuItem>
        <MenuItem onClick={() => { setFilterType('jobseeker'); setAnchorEl(null); }}>
          Job Seekers
        </MenuItem>
        <MenuItem onClick={() => { setFilterType('employer'); setAnchorEl(null); }}>
          Employers
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setSortBy('liked_date'); setAnchorEl(null); }}>
          Sort by Liked Date
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('title'); setAnchorEl(null); }}>
          Sort by Title
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('views'); setAnchorEl(null); }}>
          Sort by Views
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('likes'); setAnchorEl(null); }}>
          Sort by Likes
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default LikedVideosPage;

