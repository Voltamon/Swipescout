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
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Bookmark,
  BookmarkBorder,
  Share,
  MoreVert,
  Search,
  FilterList,
  Delete,
  Visibility,
  Work,
  Business,
  Sort
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { 
  getUserSavedVideos, 
  unsaveVideo, 
  shareVideo,
  searchVideos 
} from '@/services/api';
import { toast } from 'react-toastify';
import AllVideosPage from './AllVideosPage';

const SavedVideosPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('saved_date');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  useEffect(() => {
    fetchSavedVideos();
  }, []);

  const fetchSavedVideos = async () => {
    try {
      setLoading(true);
      const response = await getUserSavedVideos();
      setSavedVideos(response.data.videos || []);
    } catch (error) {
      console.error('Failed to fetch saved videos:', error);
      setError('Failed to load saved videos');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveVideo = async (videoId) => {
    try {
      await unsaveVideo(videoId);
      setSavedVideos(prev => prev.filter(video => video.id !== videoId));
      setDeleteDialog(false);
      setVideoToDelete(null);
    } catch (error) {
      console.error('Failed to unsave video:', error);
      setError('Failed to remove video from saved');
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

  const filteredVideos = savedVideos.filter(video => {
    const matchesSearch = video.video_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'jobseeker' && video.video_type === 'Job Seeker') ||
                         (filterType === 'employer' && video.video_type === 'Employer');
    
    return matchesSearch && matchesFilter;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'saved_date':
        return new Date(b.saved_at || b.created_at) - new Date(a.saved_at || a.created_at);
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
        pagetype="saved"
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
          Saved Videos
        </Typography>
        <Chip 
          label={`${savedVideos.length} videos saved`} 
          color="primary" 
          variant="outlined" 
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
              placeholder="Search saved videos..."
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
                      Saved {new Date(video.saved_at || video.created_at).toLocaleDateString()}
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      <Chip
                        label={`${video.likes_count || 0}`}
                        size="small"
                        variant="outlined"
                      />
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
          <Bookmark sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            No saved videos yet
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Start saving videos you like to watch them later
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

      {/* Filter Menu */}
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
        <MenuItem onClick={() => { setSortBy('saved_date'); setAnchorEl(null); }}>
          Sort by Saved Date
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
        {selectedVideo && (
          <>
            <Divider />
            <MenuItem onClick={() => {
              setVideoToDelete(selectedVideo);
              setDeleteDialog(true);
              setAnchorEl(null);
            }}>
              <Delete sx={{ mr: 1 }} />
              Remove from Saved
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Remove from Saved Videos</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove "{videoToDelete?.video_title}" from your saved videos?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => handleUnsaveVideo(videoToDelete?.id)} 
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SavedVideosPage;

