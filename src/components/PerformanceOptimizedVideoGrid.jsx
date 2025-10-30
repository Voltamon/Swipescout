import React, { useContext, useState, useCallback, useMemo  } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  PlayArrow,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Share,
  MoreVert,
} from '@mui/icons-material';
import { useGridVirtualization } from '../hooks/useVirtualization';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import LazyImage from './LazyImage';
import LazyVideo from './LazyVideo';

const VideoCard = React.memo(({ video, onPlay, onLike, onSave, onShare, style }) => {
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [isSaved, setIsSaved] = useState(video.isSaved || false);
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    onLike?.(video.id, !isLiked);
  }, [video.id, isLiked, onLike]);

  const handleSave = useCallback(() => {
    setIsSaved(prev => !prev);
    onSave?.(video.id, !isSaved);
  }, [video.id, isSaved, onSave]);

  const handlePlay = useCallback(() => {
    onPlay?.(video);
  }, [video, onPlay]);

  const handleShare = useCallback(() => {
    onShare?.(video);
  }, [video, onShare]);

  return (
    <Card
      ref={ref}
      sx={{
        position: 'absolute',
        width: 280,
        height: 360,
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
        ...style,
      }}
      onClick={handlePlay}
    >
      {/* Video Thumbnail */}
      <Box sx={{ position: 'relative', height: 200 }}>
        {isVisible ? (
          <LazyImage
            src={video.thumbnail || video.poster}
            alt={video.title}
            width="100%"
            height="100%"
            sx={{ bgcolor: 'grey.900' }}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        )}
        
        {/* Play Button Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          <IconButton
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                bgcolor: 'white',
              },
            }}
          >
            <PlayArrow sx={{ fontSize: 32 }} />
          </IconButton>
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
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontSize: '0.75rem',
            }}
          />
        )}

        {/* Video Type Badge */}
        {video.type && (
          <Chip
            label={video.type}
            size="small"
            color={video.type === 'Job Seeker' ? 'primary' : 'secondary'}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontSize: '0.75rem',
            }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2, height: 160 }}>
        {/* User Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            src={video.user?.avatar}
            sx={{ width: 32, height: 32, mr: 1 }}
          >
            {video.user?.name?.[0] || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight="bold" noWrap>
              {video.user?.name || 'Anonymous'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {video.user?.title || video.user?.company || 'User'}
            </Typography>
          </Box>
        </Box>

        {/* Video Title */}
        <Typography
          variant="body2"
          fontWeight="medium"
          sx={{
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
          }}
        >
          {video.title}
        </Typography>

        {/* Stats and Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {video.views || 0} views
            </Typography>
            <Typography variant="caption" color="text.secondary">
              â€¢
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTimeAgo(video.createdAt)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              sx={{ color: isLiked ? 'error.main' : 'text.secondary' }}
            >
              {isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </IconButton>
            
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              sx={{ color: isSaved ? 'primary.main' : 'text.secondary' }}
            >
              {isSaved ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
            </IconButton>
            
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              sx={{ color: 'text.secondary' }}
            >
              <Share fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

const PerformanceOptimizedVideoGrid = ({
  videos = [],
  onVideoPlay,
  onVideoLike,
  onVideoSave,
  onVideoShare,
  containerWidth = 1200,
  containerHeight = 600,
  loading = false,
}) => {
  const itemWidth = 280;
  const itemHeight = 360;
  const gap = 16;

  const {
    visibleItems,
    totalHeight,
    containerProps,
    innerProps,
  } = useGridVirtualization({
    items: videos,
    itemWidth,
    itemHeight,
    containerWidth,
    containerHeight,
    gap,
  });

  const handleVideoPlay = useCallback((video) => {
    onVideoPlay?.(video);
  }, [onVideoPlay]);

  const handleVideoLike = useCallback((videoId, isLiked) => {
    onVideoLike?.(videoId, isLiked);
  }, [onVideoLike]);

  const handleVideoSave = useCallback((videoId, isSaved) => {
    onVideoSave?.(videoId, isSaved);
  }, [onVideoSave]);

  const handleVideoShare = useCallback((video) => {
    onVideoShare?.(video);
  }, [onVideoShare]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
            gap: `${gap}px`,
          }}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <Card key={index} sx={{ height: itemHeight }}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="50%" />
                  </Box>
                </Box>
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="60%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box {...containerProps}>
      <Box {...innerProps}>
        {visibleItems.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onPlay={handleVideoPlay}
            onLike={handleVideoLike}
            onSave={handleVideoSave}
            onShare={handleVideoShare}
            style={{
              left: video.left,
              top: video.top,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

// Utility functions
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatTimeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const diff = now - new Date(date);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

export default PerformanceOptimizedVideoGrid;

