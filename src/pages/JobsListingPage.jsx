import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  Paper,
  Skeleton,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  VolumeOff as VolumeOffIcon,
  VolumeUp as VolumeUpIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import { getAllJobs, getJobById, getEmployerProfile, getCategories ,getAllJobsPosted } from '../services/api';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  padding: theme.spacing(3),
  width: '100%'
}));

const SearchPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  width: '100%'
}));

const JobCard = styled(Card)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  }
}));

const JobCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '56.25%',
  position: 'relative',
  backgroundColor: theme.palette.grey[200],
  cursor: 'pointer',
  '&:hover .video-controls': {
    opacity: 1
  }
}));

const VideoPlayButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const JobCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
  }
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  }
}));

const VideoDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
    width: '100%',
    maxWidth: '800px'
  }
}));

const VideoDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: 0,
  backgroundColor: '#000',
  position: 'relative',
}));

const JobsListingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {role} =useAuth;
  
  // State
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [videoDialog, setVideoDialog] = useState({
    open: false,
    videoUrl: '',
    title: '',
    isPlaying: false,
    isMuted: true
  });
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  
  // Refs
  const videoRef = React.useRef(null);
  const hoverVideoRefs = React.useRef({});
  
  // Constants
  const jobsPerPage = 9;
  
  // Fetch jobs and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let  jobsResponse;
        // Fetch jobs
        if (role=="job_seeker")
        {
jobsResponse = await getAllJobsPosted({
          page,
          limit: jobsPerPage,
          search: searchQuery,
          location: locationFilter,
          category: categoryFilter,
          sort: sortBy
        });
        }
        else
         jobsResponse = await getAllJobs({
          page,
          limit: jobsPerPage,
          search: searchQuery,
          location: locationFilter,
          category: categoryFilter,
          sort: sortBy
        });
        
        // Fetch categories
        const categoriesResponse = await getCategories();
        
        setJobs(jobsResponse.data.jobs);
        setTotalPages(Math.ceil(jobsResponse.data.total / jobsPerPage));
        setCategories(categoriesResponse.data.categories);
        
        // Extract unique locations from jobs
        const uniqueLocations = [...new Set(jobsResponse.data.jobs.map(job => job.location).filter(Boolean))];
        setLocations(uniqueLocations);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [page, searchQuery, locationFilter, categoryFilter, sortBy]);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...jobs];
    
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(job => 
        job.categoryRelations && job.categoryRelations.some(categoryRel => 
          categoryRel.category_id === categoryFilter
        )
      );
    }
    
    // Sort jobs
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at));
        break;
      case 'salary-high':
        filtered.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
        break;
      case 'salary-low':
        filtered.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
        break;
      default:
        break;
    }
    
    setFilteredJobs(filtered);
  }, [jobs, searchQuery, locationFilter, categoryFilter, sortBy]);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };
  
  // Handle location filter
  const handleLocationFilter = (e) => {
    setLocationFilter(e.target.value);
    setPage(1);
  };
  
  // Handle category filter
  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  // Open video dialog
  const openVideoDialog = (videoUrl, title) => {
    setVideoDialog({
      open: true,
      videoUrl,
      title,
      isPlaying: true,
      isMuted: true
    });
  };
  
  // Close video dialog
  const closeVideoDialog = () => {
    setVideoDialog({
      ...videoDialog,
      open: false,
      isPlaying: false
    });
    
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };
  
  // Toggle video playback
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoDialog.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      
      setVideoDialog({
        ...videoDialog,
        isPlaying: !videoDialog.isPlaying
      });
    }
  };
  
  // Toggle video mute
  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setVideoDialog({
        ...videoDialog,
        isMuted: !videoDialog.isMuted
      });
    }
  };
  
  // Handle video ended
  const handleVideoEnded = () => {
    setVideoDialog({
      ...videoDialog,
      isPlaying: false
    });
  };
  
  // Handle hover video play
  const handleVideoHover = (jobId, action) => {
    const videoElement = hoverVideoRefs.current[jobId];
    if (videoElement) {
      if (action === 'enter') {
        videoElement.play();
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    }
  };
  
  // Toggle favorite
  const toggleFavorite = (jobId) => {
    if (favorites.includes(jobId)) {
      setFavorites(favorites.filter(id => id !== jobId));
    } else {
      setFavorites([...favorites, jobId]);
    }
  };
  
  // Navigate to job details
  const navigateToJobDetails = (jobId) => {
    navigate(`/job/${jobId}`);
  };
  
  // Navigate to employer profile
  const navigateToEmployerProfile = (employerId) => {
    navigate(`/employer/${employerId}`);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Format salary range
  const formatSalaryRange = (min, max, currency = 'USD', period = 'yearly') => {
    if (!min && !max) return 'Salary not specified';
    
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥',
      INR: '₹',
      SAR: '﷼',
      AED: 'د.إ'
    };
    
    const symbol = currencySymbols[currency] || currency;
    
    let range = '';
    if (min && max) {
      range = `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
    } else if (min) {
      range = `${symbol}${min.toLocaleString()}+`;
    } else if (max) {
      range = `Up to ${symbol}${max.toLocaleString()}`;
    }
    
    const periodMap = {
      hourly: 'per hour',
      daily: 'per day',
      weekly: 'per week',
      monthly: 'per month',
      yearly: 'per year'
    };
    
    return `${range} ${periodMap[period] || ''}`;
  };
  
  return (
    <PageContainer>
      <Container maxWidth="lg" sx={{ width: '100%', padding: 0 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Job Listings
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Find your next career opportunity with video previews of companies and positions
          </Typography>
        </Box>
        
        {/* Search and Filter Section */}
        <SearchPaper elevation={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Jobs"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Job title, company, or keywords"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="location-filter-label">Location</InputLabel>
                <Select
                  labelId="location-filter-label"
                  value={locationFilter}
                  onChange={handleLocationFilter}
                  label="Location"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="category-filter-label">Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={categoryFilter}
                  onChange={handleCategoryFilter}
                  label="Category"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="salary-high">Highest Salary</MenuItem>
                  <MenuItem value="salary-low">Lowest Salary</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </SearchPaper>
        
        {/* Jobs List */}
        {loading ? (
          <Box sx={{ width: '100%' }}>
            {[...Array(3)].map((_, index) => (
              <Box key={index} sx={{ mb: 3, width: '100%' }}>
                <JobCard>
                  <Skeleton variant="rectangular" height={200} width="100%" />
                  <CardContent>
                    <Skeleton variant="text" height={32} width="80%" />
                    <Skeleton variant="text" height={24} width="60%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Box sx={{ mt: 2 }}>
                      <Skeleton variant="text" height={20} width="100%" />
                      <Skeleton variant="text" height={20} width="100%" />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Skeleton variant="rectangular" height={32} width={80} />
                      <Skeleton variant="rectangular" height={32} width={80} />
                    </Box>
                  </CardContent>
                </JobCard>
              </Box>
            ))}
          </Box>
        ) : filteredJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5, width: '100%' }}>
            <Typography variant="h6" color="textSecondary">
              No jobs found matching your criteria
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%' }}>
            {filteredJobs.map((job) => (
              <Box key={job.id} sx={{ mb: 3, width: '100%' }}>
                <JobCard>
                  {job.video?.video_url ? (
                    <Box
                      sx={{
                        height: 0,
                        paddingTop: '56.25%',
                        position: 'relative',
                        backgroundColor: theme.palette.grey[200],
                        overflow: 'hidden',
                        '&:hover video': {
                          opacity: 1,
                        },
                        '& video': {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0,
                          transition: 'opacity 0.3s ease-in-out',
                        },
                        '&:hover .video-overlay': {
                          opacity: 0,
                        },
                      }}
                      onMouseEnter={() => handleVideoHover(job.id, 'enter')}
                      onMouseLeave={() => handleVideoHover(job.id, 'leave')}
                      onClick={() => openVideoDialog(job.video.video_url, job.title)}
                    >
                      <video
                        ref={el => hoverVideoRefs.current[job.id] = el}
                        src={job.video.video_url}
                        poster={job.video.thumbnail || `https://via.placeholder.com/640x360?text=${encodeURIComponent(job.title)}`}
                        muted
                        loop
                        playsInline
                      />
                      <VideoPlayButton aria-label="play" className="video-overlay">
                        <PlayArrowIcon />
                      </VideoPlayButton>
                    </Box>
                  ) : ''}
                  
                  <JobCardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {job.company.logo && (
                        <><Box
                        component="img"
                        src={job.company.logo || 'https://via.placeholder.com/40x40?text=Logo'}
                        alt={job.company.name}
                        sx={{ width: 40, height: 40, borderRadius: '50%', mr: 1, objectFit: 'cover' ,fontSize:8 }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigateToEmployerProfile(job.company.id)}
                      >
                        {job.company.name}
                      </Typography></>)}
                    </Box>
                    
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigateToJobDetails(job.id)}
                    >
                      {job.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="textSecondary">
                        {job.location || 'Location not specified'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MoneyIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="textSecondary">
                        {formatSalaryRange(job.salary_min, job.salary_max)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      <Chip
                        label={job.employment_type || 'Full-time'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {job.remote_ok && (
                        <Chip
                          label="Remote"
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {job.description || 'No description provided'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
                      {job.jobSkills?.slice(0, 3).map((skill, index) => (
                        <SkillChip
                          key={index}
                          label={skill}
                          size="small"
                        />
                      ))}
                      {job.jobSkills?.length > 3 && (
                        <Chip
                          label={`+${job.jobSkills.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="caption" color="textSecondary">
                        Posted: {formatDate(job.posted_at)}
                      </Typography>
                    </Box>
                  </JobCardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigateToJobDetails(job.id)}
                    >
                      View Details
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => toggleFavorite(job.id)}
                    >
                      {favorites.includes(job.id) ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <ShareIcon />
                    </IconButton>
                  </CardActions>
                </JobCard>
              </Box>
            ))}
          </Box>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: '100%' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? 'small' : 'medium'}
            />
          </Box>
        )}
      </Container>
      
      {/* Video Dialog */}
      <VideoDialog
        open={videoDialog.open}
        onClose={closeVideoDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{videoDialog.title}</Typography>
            <IconButton edge="end" color="inherit" onClick={closeVideoDialog} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <VideoDialogContent>
          <video
            ref={videoRef}
            src={videoDialog.videoUrl}
            width="100%"
            height="auto"
            autoPlay
            muted={videoDialog.isMuted}
            onEnded={handleVideoEnded}
            style={{ display: 'block' }}
          />
          <VideoControls>
            <IconButton size="small" color="inherit" onClick={toggleVideoPlayback}>
              {videoDialog.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton size="small" color="inherit" onClick={toggleVideoMute}>
              {videoDialog.isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
            <Typography variant="caption" color="inherit">
              {videoDialog.title}
            </Typography>
          </VideoControls>
        </VideoDialogContent>
      </VideoDialog>
    </PageContainer>
  );
};

export default JobsListingPage;