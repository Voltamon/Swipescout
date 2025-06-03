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

const JobCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '56.25%', // 16:9 aspect ratio
  position: 'relative',
  backgroundColor: theme.palette.grey[200],
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
  }
}));

const VideoDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: 0,
  backgroundColor: '#000',
  position: 'relative',
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
}));

const JobsListingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
    isPlaying: false
  });
  const [favorites, setFavorites] = useState([]);
  
  // Refs
  const videoRef = React.useRef(null);
  
  // Constants
  const jobsPerPage = 9;
  
  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs from API
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
  
  // Apply filters
  useEffect(() => {
    // If we're using server-side filtering, this would be redundant
    // But keeping it for client-side filtering option
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
        job.categories.some(category => 
          category.toLowerCase() === categoryFilter.toLowerCase()
        )
      );
    }
    
    // Sort jobs
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.posted) - new Date(a.posted));
        break;
      case 'salary-high':
        filtered.sort((a, b) => b.salaryMax - a.salaryMax);
        break;
      case 'salary-low':
        filtered.sort((a, b) => a.salaryMin - b.salaryMin);
        break;
      default:
        break;
    }
    
    setFilteredJobs(filtered);
  }, [jobs, searchQuery, locationFilter, categoryFilter, sortBy]);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
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
      isPlaying: true
    });
  };
  
  // Close video dialog
  const closeVideoDialog = () => {
    setVideoDialog({
      ...videoDialog,
      open: false,
      isPlaying: false
    });
    
    // Pause video when dialog is closed
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
  
  // Handle video ended
  const handleVideoEnded = () => {
    setVideoDialog({
      ...videoDialog,
      isPlaying: false
    });
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
    navigate(`/jobs/${jobId}`);
  };
  
  // Navigate to employer profile
  const navigateToEmployerProfile = (employerId) => {
    navigate(`/employer/${employerId}`);
  };
  
  // Format date (YYYY-MM-DD to readable format)
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
  
  // Mock data for demonstration
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: {
        id: '101',
        name: 'Tech Innovations Inc.',
        logo: 'https://via.placeholder.com/100'
      },
      location: 'San Francisco, CA',
      type: 'Full-time',
      remote: true,
      salaryMin: 120000,
      salaryMax: 150000,
      salaryCurrency: 'USD',
      salaryPeriod: 'yearly',
      description: 'We are looking for a Senior Frontend Developer to join our team. The ideal candidate will have experience with React, TypeScript, and modern frontend development practices.',
      posted: '2023-05-15',
      deadline: '2023-06-15',
      categories: ['Software Development', 'Web Development'],
      skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      videoThumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      applicants: 24
    },
    {
      id: '2',
      title: 'Backend Engineer',
      company: {
        id: '102',
        name: 'DataFlow Systems',
        logo: 'https://via.placeholder.com/100'
      },
      location: 'Remote',
      type: 'Full-time',
      remote: true,
      salaryMin: 110000,
      salaryMax: 140000,
      salaryCurrency: 'USD',
      salaryPeriod: 'yearly',
      description: 'We are seeking a Backend Engineer to develop and maintain our server-side applications. The ideal candidate will have experience with Node.js, Express, and database design.',
      posted: '2023-05-10',
      deadline: '2023-06-10',
      categories: ['Software Development', 'Backend Development'],
      skills: ['Node.js', 'Express', 'MongoDB', 'SQL', 'API Design'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      videoThumbnail: 'https://i.ytimg.com/vi/LDZX4ooRsWs/maxresdefault.jpg',
      applicants: 18
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      company: {
        id: '103',
        name: 'Creative Solutions',
        logo: 'https://via.placeholder.com/100'
      },
      location: 'New York, NY',
      type: 'Full-time',
      remote: false,
      salaryMin: 100000,
      salaryMax: 130000,
      salaryCurrency: 'USD',
      salaryPeriod: 'yearly',
      description: 'We are looking for a UX/UI Designer to create engaging and intuitive user experiences for our products. The ideal candidate will have a strong portfolio demonstrating their design skills.',
      posted: '2023-05-05',
      deadline: '2023-06-05',
      categories: ['Design', 'UI/UX Design'],
      skills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping'],
      videoUrl: null,
      videoThumbnail: null,
      applicants: 32
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: {
        id: '104',
        name: 'Cloud Innovations',
        logo: 'https://via.placeholder.com/100'
      },
      location: 'Seattle, WA',
      type: 'Full-time',
      remote: true,
      salaryMin: 130000,
      salaryMax: 160000,
      salaryCurrency: 'USD',
      salaryPeriod: 'yearly',
      description: 'We are seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. The ideal candidate will have experience with AWS, Docker, and CI/CD pipelines.',
      posted: '2023-05-01',
      deadline: '2023-06-01',
      categories: ['DevOps', 'Cloud Computing'],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      videoThumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      applicants: 15
    },
    {
      id: '5',
      title: 'Data Scientist',
      company: {
        id: '105',
        name: 'Analytics Pro',
        logo: 'https://via.placeholder.com/100'
      },
      location: 'Boston, MA',
      type: 'Full-time',
      remote: true,
      salaryMin: 125000,
      salaryMax: 155000,
      salaryCurrency: 'USD',
      salaryPeriod: 'yearly',
      description: 'We are looking for a Data Scientist to help us extract insights from our data. The ideal candidate will have experience with machine learning, statistical analysis, and data visualization.',
      posted: '2023-04-28',
      deadline: '2023-05-28',
      categories: ['Data Science', 'Machine Learning'],
      skills: ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch'],
      videoUrl: null,
      videoThumbnail: null,
      applicants: 27
    },
    {
      id: '6',
      title: 'Product Manager',
      company: {
        id: '106',
        name: 'Product Visionaries',
        logo: 'https://via.placeholder.com/100'
      },
      location: 'Austin, TX',
      type: 'Full-time',
      remote: false,
      salaryMin: 115000,
      salaryMax: 145000,
      salaryCurrency: 'USD',
      salaryPeriod: 'yearly',
      description: 'We are seeking a Product Manager to lead our product development efforts. The ideal candidate will have experience with agile methodologies, user research, and product strategy.',
      posted: '2023-04-25',
      deadline: '2023-05-25',
      categories: ['Product Management'],
      skills: ['Agile', 'User Research', 'Product Strategy', 'Roadmapping', 'Stakeholder Management'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      videoThumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
      applicants: 21
    }
  ];
  
  // Use mock data if real data is not available
  const displayJobs = jobs.length > 0 ? jobs : mockJobs;
  
  // Available categories for filter
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
  
  // Available locations for filter
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
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
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
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
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
            {displayJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <JobCard>
                  {job.videoUrl ? (
                    <JobCardMedia
                      image={job.videoThumbnail || `https://via.placeholder.com/640x360?text=${encodeURIComponent(job.title)}`}
                      title={job.title}
                      onClick={() => openVideoDialog(job.videoUrl, job.title)}
                    >
                      <VideoPlayButton aria-label="play">
                        <PlayArrowIcon />
                      </VideoPlayButton>
                    </JobCardMedia>
                  ) : (
                    <JobCardMedia
                      image={`https://via.placeholder.com/640x360?text=${encodeURIComponent(job.title)}`}
                      title={job.title}
                    />
                  )}
                  <JobCardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        component="img"
                        src={job.company.logo}
                        alt={job.company.name}
                        sx={{ width: 40, height: 40, borderRadius: '50%', mr: 1 }}
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
                        {job.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MoneyIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="textSecondary">
                        {formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      <Chip
                        label={job.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {job.remote && (
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
                      {job.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <SkillChip
                          key={index}
                          label={skill}
                          size="small"
                        />
                      ))}
                      {job.skills.length > 3 && (
                        <Chip
                          label={`+${job.skills.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="caption" color="textSecondary">
                        Posted: {formatDate(job.posted)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {job.applicants} applicants
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
            onEnded={handleVideoEnded}
            style={{ display: 'block' }}
          />
          <VideoControls>
            <IconButton size="small" color="inherit" onClick={toggleVideoPlayback}>
              {videoDialog.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
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
