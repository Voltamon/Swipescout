import i18n from 'i18next';
import React, { useContext, useState, useEffect, useCallback, useMemo  } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Button,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Skeleton,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  PlayArrow,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Share,
  MoreVert,
  Work,
  People,
  Business,
  Star,
  TrendingUp,
  AccessTime,
  Visibility,
  Close,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import localize from '../utils/localize';
import { styled } from '@mui/material/styles';
import PerformanceOptimizedVideoGrid from '../components/PerformanceOptimizedVideoGrid';
import { useInfiniteScroll } from '../hooks/useIntersectionObserver';
import { createDebouncedFunction } from '../utils/performanceOptimizations';
import api from '@/services/api';

const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: '100% !important',
  padding: 0,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const CategoryTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: 64,
  '& .MuiTab-root': {
    minHeight: 64,
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
}));

const SidebarDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: theme.zIndex.drawer,
  },
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  overflow: 'hidden',
  marginLeft: 0,
  transition: 'margin-left 0.3s ease',
  '&.with-sidebar': {
    marginLeft: 280,
  },
}));

const VideoCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));



const VideoGridPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const categories = [
  { id: 'all', label: t('videos.categories.all'), icon: <Visibility /> },
  { id: 'jobseekers', label: t('videos.categories.jobSeekers'), icon: <People /> },
  { id: 'employers', label: t('videos.categories.employers'), icon: <Business /> },
  { id: 'trending', label: t('videos.categories.trending'), icon: <TrendingUp /> },
  { id: 'recent', label: t('videos.categories.recent'), icon: <AccessTime /> },
  { id: 'featured', label: t('videos.categories.featured'), icon: <Star /> },
];

const subcategories = {
  all: [
    { id: 'all', label: t('videos.subcategories.all') },
    { id: 'popular', label: t('videos.subcategories.mostPopular') },
    { id: 'newest', label: t('videos.subcategories.newest') },
    { id: 'most-liked', label: t('videos.subcategories.mostLiked') },
  ],
  jobseekers: [
    { id: 'all', label: t('videos.subcategories.allJobSeekers') },
    { id: 'tech', label: t('videos.subcategories.tech') },
    { id: 'marketing', label: t('videos.subcategories.marketing') },
    { id: 'design', label: t('videos.subcategories.design') },
    { id: 'sales', label: t('videos.subcategories.sales') },
    { id: 'finance', label: t('videos.subcategories.finance') },
    { id: 'healthcare', label: t('videos.subcategories.healthcare') },
    { id: 'education', label: t('videos.subcategories.education') },
  ],
  employers: [
    { id: 'all', label: t('videos.subcategories.allCompanies') },
    { id: 'startup', label: t('videos.subcategories.startups') },
    { id: 'corporate', label: t('videos.subcategories.corporations') },
    { id: 'remote', label: t('videos.subcategories.remoteFirst') },
    { id: 'local', label: t('videos.subcategories.localCompanies') },
  ],
  trending: [
    { id: 'today', label: t('videos.subcategories.today') },
    { id: 'week', label: t('videos.subcategories.thisWeek') },
    { id: 'month', label: t('videos.subcategories.thisMonth') },
  ],
  recent: [
    { id: 'today', label: t('videos.subcategories.today') },
    { id: 'yesterday', label: t('videos.subcategories.yesterday') },
    { id: 'week', label: t('videos.subcategories.thisWeek') },
  ],
  featured: [
    { id: 'editor-picks', label: t('videos.subcategories.editorPicks') },
    { id: 'success-stories', label: t('videos.subcategories.successStories') },
    { id: 'company-spotlights', label: t('videos.subcategories.companySpotlights') },
  ],
};

const sortOptions = [
  { id: 'newest', label: t('videos.sortOptions.newestFirst') },
  { id: 'oldest', label: t('videos.sortOptions.oldestFirst') },
  { id: 'most-viewed', label: t('videos.sortOptions.mostViewed') },
  { id: 'most-liked', label: t('videos.sortOptions.mostLiked') },
  { id: 'trending', label: t('videos.sortOptions.trending') },
];

  // State management
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => createDebouncedFunction((query) => {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        if (query) {
          newParams.set('search', query);
        } else {
          newParams.delete('search');
        }
        return newParams;
      });
      loadVideos(true);
    }, 500),
    [setSearchParams]
  );

  // Load videos function
  const loadVideos = useCallback(async (reset = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        subcategory: selectedSubcategory,
        search: searchQuery,
        sort: sortBy,
        page: reset ? 1 : page,
        limit: 20,
      };

      const response = await api.searchVideos(params);
      
      if (reset) {
        setVideos(response.data.videos);
        setPage(2);
      } else {
        setVideos(prev => [...prev, ...response.data.videos]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubcategory, searchQuery, sortBy, page, loading]);

  // Infinite scroll
  const [loadMoreRef] = useInfiniteScroll(
    () => loadVideos(false),
    hasMore,
    loading
  );

  // Effects
  useEffect(() => {
    loadVideos(true);
  }, [selectedCategory, selectedSubcategory, sortBy]);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Event handlers
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setSelectedSubcategory('all');
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('category', newValue);
      newParams.set('subcategory', 'all');
      return newParams;
    });
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('subcategory', subcategoryId);
      return newParams;
    });
  };

  const handleVideoPlay = (video) => {
    // Navigate to VideoPlayerPage with context
    navigate('/video-player', {
      state: {
        videoId: video.id,
        context: {
          category: selectedCategory,
          subcategory: selectedSubcategory,
          search: searchQuery,
          sort: sortBy,
        },
        videos: videos,
      },
    });
  };

  const handleVideoLike = async (videoId, isLiked) => {
    try {
      if (isLiked) {
        await api.likeVideo(videoId);
      } else {
        await api.unlikeVideo(videoId);
      }
      
      setVideos(prev => prev.map(video => 
        video.id === videoId 
          ? { ...video, isLiked, likesCount: video.likesCount + (isLiked ? 1 : -1) }
          : video
      ));
    } catch (error) {
      console.error('Failed to update like:', error);
    }
  };

  const handleVideoSave = async (videoId, isSaved) => {
    try {
      if (isSaved) {
        await api.saveVideo(videoId);
      } else {
        await api.unsaveVideo(videoId);
      }
      
      setVideos(prev => prev.map(video => 
        video.id === videoId 
          ? { ...video, isSaved }
          : video
      ));
    } catch (error) {
      console.error('Failed to update save:', error);
    }
  };

  const handleVideoShare = (video) => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Check out this video on SwipeScout: ${video.title}`,
        url: `${window.location.origin}/videos/${video.id}`,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/videos/${video.id}`);
      // Show toast notification
    }
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', sortOption);
      return newParams;
    });
    setSortMenuAnchor(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <StyledContainer>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            {t('videos.explore')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder={t('videos.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          {/* Sort */}
          <Button
            variant="outlined"
            startIcon={<Sort />}
            onClick={(e) => setSortMenuAnchor(e.currentTarget)}
          >
            {sortOptions.find(opt => opt.id === sortBy)?.label}
          </Button>
          
          <Menu
            anchorEl={sortMenuAnchor}
            open={Boolean(sortMenuAnchor)}
            onClose={() => setSortMenuAnchor(null)}
          >
            {sortOptions.map((option) => (
              <MenuItem
                key={option.id}
                selected={sortBy === option.id}
                onClick={() => handleSortChange(option.id)}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <SidebarDrawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {t('videos.categories')}
            </Typography>
            
            <List>
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  button
                  selected={selectedCategory === category.id}
                  onClick={() => handleCategoryChange(null, category.id)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {category.icon}
                  </ListItemIcon>
                  <ListItemText primary={localize(category.label)} />
                </ListItem>
              ))}
            </List>

            {/* Subcategories */}
            {subcategories[selectedCategory] && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {t('videos.subcategories')}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {subcategories[selectedCategory].map((sub) => (
                    <Chip
                      key={sub.id}
                      label={localize(sub.label)}
                      variant={selectedSubcategory === sub.id ? 'filled' : 'outlined'}
                      color={selectedSubcategory === sub.id ? 'primary' : 'default'}
                      onClick={() => handleSubcategoryChange(sub.id)}
                      size="small"
                    />
                  ))}
                </Box>
              </>
            )}
          </Box>
        </SidebarDrawer>

        {/* Main Content */}
        <ContentArea className={sidebarOpen && !isMobile ? 'with-sidebar' : ''}>
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {/* Category Tabs (Mobile) */}
            {isMobile && (
              <CategoryTabs
                value={selectedCategory}
                onChange={handleCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
              >
                {categories.map((category) => (
                  <Tab
                    key={category.id}
                    value={category.id}
                    label={localize(category.label)}
                    icon={category.icon}
                    iconPosition="start"
                  />
                ))}
              </CategoryTabs>
            )}

            {/* Video Grid */}
            <PerformanceOptimizedVideoGrid
              videos={videos}
              onVideoPlay={handleVideoPlay}
              onVideoLike={handleVideoLike}
              onVideoSave={handleVideoSave}
              onVideoShare={handleVideoShare}
              loading={loading && videos.length === 0}
              containerWidth={window.innerWidth - (sidebarOpen && !isMobile ? 280 : 0) - 32}
              containerHeight={window.innerHeight - 200}
            />

            {/* Load More Trigger */}
            {hasMore && (
              <Box
                ref={loadMoreRef}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                {loading && <Typography>{i18n.t('auto_loading_more_videos')}</Typography>}
              </Box>
            )}

            {/* Empty State */}
            {!loading && videos.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 400,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t('videos.noVideosFound')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('videos.tryDifferentSearch')}
                </Typography>
              </Box>
            )}
          </Box>
        </ContentArea>
      </Box>
    </StyledContainer>
  );
};

export default VideoGridPage;

