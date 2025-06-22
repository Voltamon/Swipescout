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
  Close as CloseIcon, // No longer strictly needed for video dialog, but kept if used elsewhere
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllJobs, getJobById, getEmployerProfile } from '../services/api';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4)
}));

const SearchPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const JobCard = styled(Card)(({ theme }) => ({
  height: '100%',
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

// Placeholder for media when no video is available
const JobCardMediaPlaceholder = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '56.25%', // 16:9 aspect ratio
  position: 'relative',
  backgroundColor: theme.palette.grey[200],
}));

// Button for video playback overlay
const VideoPlayButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  transition: 'opacity 0.3s ease-in-out',
  zIndex: 1, // Ensure it's above the video
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }
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

const JobsListingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for job data and UI controls
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]); // This will be used if client-side filtering is active
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState([]);
  
  // Constants for pagination
  const jobsPerPage = 9; // Number of jobs to display per page

  // Fetch jobs from the API whenever filters or pagination change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        const response = await getAllJobs({
          page,
          limit: jobsPerPage,
          search: searchQuery,
          location: locationFilter,
          category: categoryFilter,
          sort: sortBy
        });
        
        setJobs(response.data.jobs);
        setTotalPages(Math.ceil(response.data.total / jobsPerPage));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [page, searchQuery, locationFilter, categoryFilter, sortBy]);
  
  // Client-side filtering and sorting (This useEffect will run if getAllJobs does not handle all filters backend)
  // If your backend handles all filtering and sorting, this useEffect can be simplified or removed.
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
    
    // Filter by category using categoryRelations
    if (categoryFilter) {
      filtered = filtered.filter(job => 
        job.categoryRelations && job.categoryRelations.some(categoryRel => 
          categoryRel.category_name.toLowerCase() === categoryFilter.toLowerCase()
        )
      );
    }
    
    // Sort jobs
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at));
        break;
      case 'salary-high':
        filtered.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0)); // Handle null salaries
        break;
      case 'salary-low':
        filtered.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0)); // Handle null salaries
        break;
      default:
        break;
    }
    
    setFilteredJobs(filtered);
  }, [jobs, searchQuery, locationFilter, categoryFilter, sortBy]);
  
  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  // Handle location filter change
  const handleLocationFilter = (e) => {
    setLocationFilter(e.target.value);
    setPage(1);
  };
  
  // Handle category filter change
  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };
  
  // Handle sort order change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Handle pagination page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0); // Scroll to top on page change
  };
  
  // Toggle favorite status for a job
  const toggleFavorite = (jobId) => {
    if (favorites.includes(jobId)) {
      setFavorites(favorites.filter(id => id !== jobId));
    } else {
      setFavorites([...favorites, jobId]);
    }
  };
  
  // Navigate to job details page
  const navigateToJobDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };
  
  // Navigate to employer profile page
  const navigateToEmployerProfile = (employerId) => {
    navigate(`/employer/${employerId}`);
  };
  
  // Format date string to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Format salary range for display
  const formatSalaryRange = (min, max, currency = 'USD', period = 'yearly') => {
    if (min === null && max === null) return 'Salary not specified';
    
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
    if (min !== null && max !== null) {
      range = `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
    } else if (min !== null) {
      range = `${symbol}${min.toLocaleString()}+`;
    } else if (max !== null) {
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
  
  // Mock data for demonstration (used when actual API data is empty or during development)
  const mockJobs = []; // As requested, mock variables are empty now
  
  // Determine which jobs to display (real data if available, otherwise mock data)
  const displayJobs = jobs.length > 0 ? jobs : mockJobs;
  
  // Available categories for filter (these should ideally be fetched from API)
  const availableCategories = [
    'Software Development',
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
    'Network Administration',
    'Database Administration',
    'Project Management',
    'Product Management',
    'Quality Assurance',
    'Technical Support'
  ];
  
  // Available locations for filter (these should ideally be fetched from API)
  const availableLocations = [
    'San Francisco, CA',
    'New York, NY',
    'Seattle, WA',
    'Boston, MA',
    'Austin, TX',
    'Remote'
  ];
  
  return (
    <PageContainer>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
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
                  {availableLocations.map((location) => (
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
                  {availableCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
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
        
        {/* Jobs Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} key={index}> {/* Each job displayed on full width */}
                <JobCard>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} width="80%" />
                    <Skeleton variant="text" height={24} width="60%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Box sx={{ mt: 2 }}>
                      <Skeleton variant="text" height={20} width="100%" />
                      <Skeleton variant="text" height={20} width="100%" />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}> {/* Corrected syntax error here */}
                      <Skeleton variant="rectangular" height={32} width={80} />
                      <Skeleton variant="rectangular" height={32} width={80} />
                    </Box>
                  </CardContent>
                </JobCard>
              </Grid>
            ))}
          </Grid>
        ) : displayJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="textSecondary">
              No jobs found matching your criteria
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Using filteredJobs here for client-side filtering responsiveness */}
            {filteredJobs.map((job) => (
              <Grid item xs={12} key={job.id}> {/* Each job displayed on full width */}
                <JobCard>
                  {/* Conditionally render video or placeholder */}
                  {job.video?.video_url ? (
                    <Box
                      sx={{
                        height: 0,
                        paddingTop: '56.25%', // 16:9 aspect ratio
                        position: 'relative',
                        backgroundColor: theme.palette.grey[200],
                        overflow: 'hidden', // Ensures video stays within bounds
                        '&:hover video': {
                          opacity: 1, // Video becomes visible on hover
                        },
                        '& video': {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0, // Video hidden by default
                          transition: 'opacity 0.3s ease-in-out',
                        },
                        // Hide play button overlay on hover
                        '&:hover .video-overlay': {
                           opacity: 0,
                         },
                      }}
                      onMouseEnter={(e) => {
                        const videoElement = e.currentTarget.querySelector('video');
                        if (videoElement) {
                          videoElement.play();
                        }
                      }}
                      onMouseLeave={(e) => {
                        const videoElement = e.currentTarget.querySelector('video');
                        if (videoElement) {
                          videoElement.pause();
                          videoElement.currentTime = 0; // Reset video to start
                        }
                      }}
                    >
                      <video
                        src={job.video.video_url}
                        poster={job.video.thumbnail || `https://via.placeholder.com/640x360?text=${encodeURIComponent(job.title)}`}
                        muted // Muted for autoplay on hover
                        loop
                        playsInline // Ensures video plays inline on iOS
                      />
                      {/* Play button overlay */}
                      <VideoPlayButton aria-label="play" className="video-overlay">
                        <PlayArrowIcon />
                      </VideoPlayButton>
                    </Box>
                  ) : ( // If no video available, display a simple placeholder image
                    <JobCardMediaPlaceholder
                      image={`https://via.placeholder.com/640x360?text=${encodeURIComponent(job.title)}`}
                      title={job.title}
                    />
                  )}
                  
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {/* Company Logo and Name */}
                      <Box
                        component="img"
                        src={job.company.logo || 'https://via.placeholder.com/40x40?text=Logo'} // Fallback for missing logo
                        alt={job.company.name}
                        sx={{ width: 40, height: 40, borderRadius: '50%', mr: 1, objectFit: 'cover' }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigateToEmployerProfile(job.company.id)}
                      >
                        {job.company.name}
                      </Typography>
                    </Box>
                    
                    {/* Job Title */}
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
                    
                    {/* Location */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="textSecondary">
                        {job.location}
                      </Typography>
                    </Box>
                    
                    {/* Salary Range */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MoneyIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="textSecondary">
                        {formatSalaryRange(job.salary_min, job.salary_max, 'USD', 'yearly')} {/* Assuming USD and yearly for mock, adjust if API provides this */}
                      </Typography>
                    </Box>
                    
                    {/* Job Type (employment_type) and Remote status */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      <Chip
                        label={job.employment_type}
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
                    
                    {/* Job Description */}
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
                      {job.description}
                    </Typography>
                    
                    {/* Job Skills */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
                      {job.jobSkills && job.jobSkills.slice(0, 3).map((skill, index) => (
                        <SkillChip
                          key={index}
                          label={skill}
                          size="small"
                        />
                      ))}
                      {job.jobSkills && job.jobSkills.length > 3 && (
                        <Chip
                          label={`+${job.jobSkills.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    
                    {/* Posted Date, Deadline, and Applicants */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="caption" color="textSecondary">
                        Posted: {formatDate(job.posted_at)}
                      </Typography>
                      {job.deadline && ( // Display deadline field
                        <Typography variant="caption" color="textSecondary">
                          Deadline: {formatDate(job.deadline)}
                        </Typography>
                      )}
                      <Typography variant="caption" color="textSecondary">
                        {job.applicants !== undefined ? `${job.applicants} applicants` : 'No applicants data'} {/* Display applicants field */}
                      </Typography>
                    </Box>
                  </CardContent>
                  
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
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
    </PageContainer>
  );
};

export default JobsListingPage;
