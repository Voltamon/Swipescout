import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  Divider,
  Paper,
  styled,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getVideoResume, updateUserVideo } from '../services/api.js';

// Styled components to match JobSeekerProfile style
const EditVideoContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
}));

const VideoPreviewContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 400,
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#000',
  marginBottom: theme.spacing(3)
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  color: '#fff',
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const FormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3]
}));

const EditVideoPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State
  const [video, setVideo] = useState({
    video_url: '',
    video_position: '',
    video_title: '',
    video_duration: 0,
    views: 0,
    video_type: '',
    hashtags: [],
    status: ''
  });
  const [newHashtag, setNewHashtag] = useState('');
  const [videoState, setVideoState] = useState({
    isPlaying: false,
    isMuted: false
  });
  const [loading, setLoading] = useState(true);
  
  // Refs
  const videoRef = useRef(null);
  
  // Fetch video data
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const response = await getVideoResume(videoId);
        setVideo({
          ...response.data,
          hashtags: response.data.hashtags || []
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching video data:', error);
        setLoading(false);
      }
    };
    
    fetchVideoData();
  }, [videoId]);
  
  // Toggle video playback
  const togglePlayback = () => {
    if (videoRef.current) {
      if (videoState.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoState(prev => ({
        ...prev,
        isPlaying: !prev.isPlaying
      }));
    }
  };
  
  // Toggle video mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setVideoState(prev => ({
        ...prev,
        isMuted: !prev.isMuted
      }));
    }
  };
  
  // Handle video ended
  const handleVideoEnded = () => {
    setVideoState(prev => ({
      ...prev,
      isPlaying: false
    }));
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add new hashtag
  const handleAddHashtag = () => {
    if (newHashtag.trim() && !video.hashtags.includes(newHashtag.trim())) {
      setVideo(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, newHashtag.trim()]
      }));
      setNewHashtag('');
    }
  };
  
  // Remove hashtag
  const handleRemoveHashtag = (tagToRemove) => {
    setVideo(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserVideo(videoId, video);
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error('Error updating video:', error);
      setLoading(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };
  
  // Handle delete video
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        setLoading(true);
        // await deleteUserVideo(videoId); // Uncomment when you have delete API
        navigate('/job-seeker-profile'); // Redirect to profile
      } catch (error) {
        console.error('Error deleting video:', error);
        setLoading(false);
      }
    }
  };

  return (
    <EditVideoContainer>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Edit Video
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={loading}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <FormCard>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Video Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Video Title"
                    name="video_title"
                    value={video.video_title}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Video Position</InputLabel>
                    <Select
                      name="video_position"
                      value={video.video_position}
                      onChange={handleInputChange}
                      label="Video Position"
                    >
                      <MenuItem value="main">Main Video</MenuItem>
                      <MenuItem value="intro">Introduction</MenuItem>
                      <MenuItem value="outro">Outro</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Video Type</InputLabel>
                    <Select
                      name="video_type"
                      value={video.video_type}
                      onChange={handleInputChange}
                      label="Video Type"
                    >
                      <MenuItem value="interview">Interview</MenuItem>
                      <MenuItem value="presentation">Presentation</MenuItem>
                      <MenuItem value="demo">Demo</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Video Duration (seconds)"
                    name="video_duration"
                    type="number"
                    value={video.video_duration}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Views"
                    name="views"
                    type="number"
                    value={video.views}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Video URL"
                    name="video_url"
                    value={video.video_url}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={video.status}
                      onChange={handleInputChange}
                      label="Status"
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="old">Old</MenuItem>
                      <MenuItem value="archived">Archived</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormCard>
            
            <FormCard>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Hashtags
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Hashtag"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  variant="outlined"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHashtag()}
                />
                <IconButton
                  color="primary"
                  onClick={handleAddHashtag}
                  disabled={!newHashtag.trim()}
                  sx={{ ml: 1 }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {video.hashtags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveHashtag(tag)}
                    deleteIcon={<CloseIcon />}
                    variant="outlined"
                  />
                ))}
              </Box>
            </FormCard>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormCard>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Video Preview
              </Typography>
              
              <VideoPreviewContainer>
                <video
                  ref={videoRef}
                  src={video.video_url}
                  width="100%"
                  height="100%"
                  onEnded={handleVideoEnded}
                  onClick={togglePlayback}
                  style={{ objectFit: 'cover' }}
                  muted={videoState.isMuted}
                />
                
                <VideoControls>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size="small" color="inherit" onClick={togglePlayback}>
                      {videoState.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton size="small" color="inherit" onClick={toggleMute}>
                      {videoState.isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </IconButton>
                  </Box>
                  <Typography variant="caption" color="inherit">
                    {video.video_title || 'Preview'}
                  </Typography>
                </VideoControls>
              </VideoPreviewContainer>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Video Details
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Duration: {video.video_duration} seconds
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Views: {video.views}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Position: {video.video_position || 'Not specified'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Type: {video.video_type || 'Not specified'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {video.status || 'Not specified'}
                </Typography>
              </Box>
            </FormCard>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              fullWidth
              sx={{ mt: 2 }}
            >
              Delete Video
            </Button>
          </Grid>
        </Grid>
      </Container>
    </EditVideoContainer>
  );
};

export default EditVideoPage;