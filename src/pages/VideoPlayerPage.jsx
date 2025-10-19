import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Drawer,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Paper,
  Divider,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  Bookmark,
  BookmarkBorder,
  Comment,
  Send,
  MoreVert,
  VolumeUp,
  VolumeOff,
  PlayArrow,
  Pause,
  ArrowBack,
  ArrowUpward,
  ArrowDownward,
  Close,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { useAuth } from '../contexts/AuthContext';
import { useContext } from 'react';
import { 
  likeVideo, 
  unlikeVideo, 
  saveVideo, 
  unsaveVideo, 
  getVideoComments, 
  addVideoComment,
  shareVideo 
} from '../services/api';

// Styled Components
const PlayerContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  position: 'relative',
  backgroundColor: '#000',
  overflow: 'hidden',
  display: 'flex',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const VideoSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000',
  [theme.breakpoints.up('md')]: {
    maxWidth: 'calc(100vw - 400px)', // Leave space for comments on desktop
  },
}));

const VideoElement = styled('video')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  maxHeight: '100vh',
  [theme.breakpoints.down('md')]: {
    objectFit: 'cover',
  },
}));

const VideoOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.5) 100%)',
  pointerEvents: 'none',
  zIndex: 1,
}));

const TopControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  zIndex: 2,
  color: 'white',
}));

const SideActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  bottom: theme.spacing(12),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  zIndex: 2,
  [theme.breakpoints.up('md')]: {
    right: theme.spacing(4),
    bottom: theme.spacing(8),
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s ease',
  width: 56,
  height: 56,
}));

const VideoInfo = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(3),
  color: 'white',
  zIndex: 2,
  [theme.breakpoints.up('md')]: {
    right: 120, // Leave space for side actions
  },
}));

const CommentsSection = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    width: 400,
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  [theme.breakpoints.down('md')]: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60vh',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    transform: 'translateY(100%)',
    transition: 'transform 0.3s ease',
    '&.open': {
      transform: 'translateY(0)',
    },
  },
}));

const CommentInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
}));

const SwipeIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  opacity: 0.7,
  zIndex: 3,
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const VideoPlayerPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get video data from navigation state
  const { videoId, videos = [], context = {} } = location.state || {};
  
  // Refs
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  // State
  const [currentVideoIndex, setCurrentVideoIndex] = useState(
    videos.findIndex(v => v.id === videoId) || 0
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);
  
  const currentVideo = videos[currentVideoIndex];
  
  // Auto-hide controls
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [showControls]);
  
  // Load comments
  useEffect(() => {
    if (currentVideo?.id) {
      loadComments();
    }
  }, [currentVideo?.id]);
  
  // Auto-play video
  useEffect(() => {
    if (videoRef.current && currentVideo) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  }, [currentVideo, isPlaying]);
  
  const loadComments = async () => {
    try {
      const response = await getVideoComments(currentVideo.id);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]);
    }
  };
  
  const handleVideoClick = () => {
    setShowControls(true);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleLike = async () => {
    if (!currentVideo) return;
    
    try {
      if (currentVideo.isLiked) {
        await unlikeVideo(currentVideo.id);
      } else {
        await likeVideo(currentVideo.id);
      }
      
      // Update video state
      const updatedVideos = [...videos];
      updatedVideos[currentVideoIndex] = {
        ...currentVideo,
        isLiked: !currentVideo.isLiked,
        likesCount: currentVideo.likesCount + (currentVideo.isLiked ? -1 : 1),
      };
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };
  
  const handleSave = async () => {
    if (!currentVideo) return;
    
    try {
      if (currentVideo.isSaved) {
        await unsaveVideo(currentVideo.id);
      } else {
        await saveVideo(currentVideo.id);
      }
      
      // Update video state
      const updatedVideos = [...videos];
      updatedVideos[currentVideoIndex] = {
        ...currentVideo,
        isSaved: !currentVideo.isSaved,
      };
    } catch (error) {
      console.error('Failed to toggle save:', error);
    }
  };
  
  const handleShare = async () => {
    if (!currentVideo) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: currentVideo.title,
          text: `Check out this video: ${currentVideo.title}`,
          url: `${window.location.origin}/videos/${currentVideo.id}`,
        });
      } else {
        await navigator.clipboard.writeText(
          `${window.location.origin}/videos/${currentVideo.id}`
        );
        // Show toast notification
      }
      
      await shareVideo(currentVideo.id);
    } catch (error) {
      console.error('Failed to share video:', error);
    }
  };
  
  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !currentVideo) return;
    
    try {
      const response = await addVideoComment(currentVideo.id, newComment);
      setComments(prev => [response.data.comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };
  
  const navigateToVideo = useCallback((direction) => {
    const newIndex = direction === 'next' 
      ? Math.min(currentVideoIndex + 1, videos.length - 1)
      : Math.max(currentVideoIndex - 1, 0);
    
    if (newIndex !== currentVideoIndex) {
      setCurrentVideoIndex(newIndex);
      setIsPlaying(true);
      setSwipeDirection(direction);
      setTimeout(() => setSwipeDirection(null), 300);
    }
  }, [currentVideoIndex, videos.length]);
  
  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => isMobile && navigateToVideo('next'),
    onSwipedDown: () => isMobile && navigateToVideo('prev'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          navigateToVideo('prev');
          break;
        case 'ArrowDown':
          e.preventDefault();
          navigateToVideo('next');
          break;
        case ' ':
          e.preventDefault();
          handleVideoClick();
          break;
        case 'm':
          e.preventDefault();
          handleMuteToggle();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigateToVideo]);
  
  if (!currentVideo) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Typography>Video not found</Typography>
      </Box>
    );
  }
  
  return (
    <PlayerContainer ref={containerRef} {...swipeHandlers}>
      {/* Video Section */}
      <VideoSection>
        <VideoElement
          ref={videoRef}
          src={currentVideo.videoUrl}
          muted={isMuted}
          loop
          playsInline
          onClick={handleVideoClick}
        />
        
        <VideoOverlay />
        
        {/* Top Controls */}
        <Fade in={showControls}>
          <TopControls>
            <IconButton 
              onClick={() => navigate(-1)}
              sx={{ color: 'white' }}
            >
              <ArrowBack />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                onClick={handleMuteToggle}
                sx={{ color: 'white' }}
              >
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
              
              <IconButton 
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{ color: 'white' }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </TopControls>
        </Fade>
        
        {/* Side Actions */}
        <SideActions>
          <Box sx={{ textAlign: 'center' }}>
            <ActionButton onClick={handleLike}>
              {currentVideo.isLiked ? <Favorite /> : <FavoriteBorder />}
            </ActionButton>
            <Typography variant="caption" sx={{ color: 'white', mt: 0.5 }}>
              {currentVideo.likesCount || 0}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <ActionButton onClick={() => setCommentsOpen(true)}>
              <Comment />
            </ActionButton>
            <Typography variant="caption" sx={{ color: 'white', mt: 0.5 }}>
              {comments.length}
            </Typography>
          </Box>
          
          <ActionButton onClick={handleSave}>
            {currentVideo.isSaved ? <Bookmark /> : <BookmarkBorder />}
          </ActionButton>
          
          <ActionButton onClick={handleShare}>
            <Share />
          </ActionButton>
        </SideActions>
        
        {/* Video Info */}
        <VideoInfo>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={currentVideo.user?.profilePicture} 
              sx={{ mr: 2 }}
            >
              {currentVideo.user?.name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {currentVideo.user?.name || 'Anonymous'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {currentVideo.user?.title || 'User'}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            {currentVideo.title}
          </Typography>
          
          {currentVideo.description && (
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              {currentVideo.description}
            </Typography>
          )}
          
          {currentVideo.tags && currentVideo.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {currentVideo.tags.map((tag, index) => (
                <Chip 
                  key={index}
                  label={`#${tag}`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Box>
          )}
        </VideoInfo>
        
        {/* Swipe Indicators (Mobile) */}
        {isMobile && (
          <>
            <SwipeIndicator sx={{ top: 100 }}>
              <ArrowUpward />
              <Typography variant="caption">Previous</Typography>
            </SwipeIndicator>
            
            <SwipeIndicator sx={{ bottom: 100 }}>
              <ArrowDownward />
              <Typography variant="caption">Next</Typography>
            </SwipeIndicator>
          </>
        )}
        
        {/* Swipe Animation */}
        {swipeDirection && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <Typography variant="h4" sx={{ color: 'white' }}>
              {swipeDirection === 'next' ? '↓' : '↑'}
            </Typography>
          </Box>
        )}
      </VideoSection>
      
      {/* Comments Section */}
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          PaperProps={{
            sx: {
              height: '70vh',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          }}
        >
          <CommentsContent 
            comments={comments}
            newComment={newComment}
            setNewComment={setNewComment}
            onSubmit={handleCommentSubmit}
            onClose={() => setCommentsOpen(false)}
          />
        </Drawer>
      ) : (
        <CommentsSection>
          <CommentsContent 
            comments={comments}
            newComment={newComment}
            setNewComment={setNewComment}
            onSubmit={handleCommentSubmit}
          />
        </CommentsSection>
      )}
      
      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => {/* Report video */}}>
          Report Video
        </MenuItem>
        <MenuItem onClick={() => {/* Not interested */}}>
          Not Interested
        </MenuItem>
      </Menu>
    </PlayerContainer>
  );
};

// Comments Content Component
const CommentsContent = ({ comments, newComment, setNewComment, onSubmit, onClose }) => {
  return (
    <>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Typography variant="h6" fontWeight="bold">
          Comments ({comments.length})
        </Typography>
        {onClose && (
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        )}
      </Box>
      
      {/* Comments List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List>
          {comments.map((comment, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={comment.user?.profilePicture}>
                  {comment.user?.name?.[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.user?.name || 'Anonymous'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
                secondary={comment.content}
              />
            </ListItem>
          ))}
          
          {comments.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No comments yet. Be the first to comment!
              </Typography>
            </Box>
          )}
        </List>
      </Box>
      
      {/* Comment Input */}
      <CommentInput>
        <TextField
          fullWidth
          size="small"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
          multiline
          maxRows={3}
        />
        <IconButton 
          onClick={onSubmit}
          disabled={!newComment.trim()}
          color="primary"
        >
          <Send />
        </IconButton>
      </CommentInput>
    </>
  );
};

export default VideoPlayerPage;

