import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Avatar,
  Button,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Divider,
  Paper,
  styled,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  People as PeopleIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployerProfile, getEmployerVideos, getEmployerJobs } from '../services/employerService';

// Styled components
const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4)
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  }
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    paddingRight: theme.spacing(4),
  }
}));

const MainVideoContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 250,
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  position: 'relative',
  marginBottom: theme.spacing(2),
  backgroundColor: '#000',
  [theme.breakpoints.up('md')]: {
    width: 300,
    height: 400,
    marginBottom: 0,
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
}));

const VideoActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const CompanyLogo = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `4px solid ${theme.palette.primary.main}`,
  marginRight: theme.spacing(2),
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
  }
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const VideoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  }
}));

const VideoCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '56.25%', // 16:9 aspect ratio
  position: 'relative',
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

const JobCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const EmployerProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [tabValue, setTabValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Refs
  const videoRef = React.useRef(null);
  
  // Fetch employer data
  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const profileResponse = await getEmployerProfile(id);
        setProfile(profileResponse.data);
        
        // Fetch videos
        const videosResponse = await getEmployerVideos(id);
        setVideos(videosResponse.data.videos);
        
        // Fetch jobs
        const jobsResponse = await getEmployerJobs(id);
        setJobs(jobsResponse.data.jobs);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employer data:', error);
        setLoading(false);
      }
    };
    
    fetchEmployerData();
  }, [id]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Toggle video playback
  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle video ended
  const handleVideoEnded = () => {
    setIsPlaying(false);
  };
  
  // Navigate to edit profile
  const handleEditProfile = () => {
    navigate(`/employer/edit/${id}`);
  };
  
  // Navigate to post job
  const handlePostJob = () => {
    navigate('/employer/post-job');
  };
  
  // Mock data for demonstration
  const mockProfile = {
    id: '1',
    name: 'Tech Innovations Inc.',
    industry: 'Information Technology',
    size: '50-200 employees',
    founded: 2010,
    location: 'San Francisco, CA',
    description: 'Tech Innovations Inc. is a leading technology company specializing in innovative software solutions for businesses. We develop cutting-edge applications that help companies streamline their operations and improve efficiency.',
    email: 'careers@techinnovations.com',
    phone: '+1 (415) 555-1234',
    website: 'www.techinnovations.com',
    logo: 'https://via.placeholder.com/100',
    mainVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    categories: ['Software Development', 'Cloud Computing', 'AI & Machine Learning'],
    social: {
      linkedin: 'linkedin.com/company/techinnovations',
      facebook: 'facebook.com/techinnovations',
      twitter: 'twitter.com/techinnovations'
    }
  };
  
  const mockVideos = [
    {
      id: '1',
      title: 'Company Introduction',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 120,
      type: 'intro',
      views: 1250
    },
    {
      id: '2',
      title: 'Our Work Culture',
      thumbnail: 'https://i.ytimg.com/vi/LDZX4ooRsWs/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 90,
      type: 'culture',
      views: 850
    },
    {
      id: '3',
      title: 'Office Tour',
      thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 180,
      type: 'tour',
      views: 670
    },
    {
      id: '4',
      title: 'Employee Testimonials',
      thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 150,
      type: 'testimonial',
      views: 920
    }
  ];
  
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      posted: '2023-05-15',
      applicants: 24,
      description: 'We are looking for a Senior Frontend Developer to join our team. The ideal candidate will have experience with React, TypeScript, and modern frontend development practices.',
      requirements: [
        'At least 5 years of experience in frontend development',
        'Strong knowledge of React and TypeScript',
        'Experience with state management libraries like Redux',
        'Understanding of responsive design and cross-browser compatibility'
      ]
    },
    {
      id: '2',
      title: 'Backend Engineer',
      location: 'Remote',
      type: 'Full-time',
      salary: '$110,000 - $140,000',
      posted: '2023-05-10',
      applicants: 18,
      description: 'We are seeking a Backend Engineer to develop and maintain our server-side applications. The ideal candidate will have experience with Node.js, Express, and database design.',
      requirements: [
        'At least 3 years of experience in backend development',
        'Strong knowledge of Node.js and Express',
        'Experience with SQL and NoSQL databases',
        'Understanding of RESTful API design principles'
      ]
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      posted: '2023-05-05',
      applicants: 32,
      description: 'We are looking for a UX/UI Designer to create engaging and intuitive user experiences for our products. The ideal candidate will have a strong portfolio demonstrating their design skills.',
      requirements: [
        'At least 3 years of experience in UX/UI design',
        'Proficiency in design tools like Figma or Adobe XD',
        'Experience with user research and usability testing',
        'Understanding of design systems and component libraries'
      ]
    }
  ];
  
  // Use mock data if real data is not available
  const employerData = profile || mockProfile;
  const employerVideos = videos.length > 0 ? videos : mockVideos;
  const employerJobs = jobs.length > 0 ? jobs : mockJobs;
  
  // Format date (YYYY-MM-DD to readable format)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <ProfileContainer>
      <Container maxWidth="lg">
        {/* Profile Header */}
        <ProfileHeader>
          <ProfileInfo>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CompanyLogo src={employerData.logo} alt={employerData.name} />
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {employerData.name}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {employerData.industry}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                    {employerData.location}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<WorkIcon />}
                onClick={handlePostJob}
              >
                Post Job
              </Button>
            </Box>
            
            <Typography variant="body1" paragraph>
              {employerData.description}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {employerData.categories.map((category, index) => (
                  <CategoryChip key={index} label={category} />
                ))}
              </Box>
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Founded: {employerData.founded}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Size: {employerData.size}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {employerJobs.length} Active Jobs
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {employerData.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {employerData.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageIcon fontSize="small" color="action" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {employerData.website}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
            </Box>
          </ProfileInfo>
          
          {/* Main Video */}
          <MainVideoContainer>
            <video
              ref={videoRef}
              src={employerData.mainVideo}
              width="100%"
              height="100%"
              poster={employerVideos[0]?.thumbnail}
              onEnded={handleVideoEnded}
              style={{ objectFit: 'cover' }}
            />
            
            <VideoControls>
              <IconButton size="small" color="inherit" onClick={togglePlayback}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <Typography variant="caption" color="inherit">
                Company Introduction
              </Typography>
            </VideoControls>
            
            <VideoActions>
              <IconButton color="inherit">
                <FavoriteIcon />
              </IconButton>
              <IconButton color="inherit">
                <ShareIcon />
              </IconButton>
              <IconButton color="inherit">
                <BookmarkIcon />
              </IconButton>
            </VideoActions>
          </MainVideoContainer>
        </ProfileHeader>
        
        {/* Tabs Section */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            centered={!isMobile}
          >
            <Tab label="About" />
            <Tab label="Jobs" />
            <Tab label="Videos" />
            <Tab label="Contact" />
          </Tabs>
          
          {/* About Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Company Overview
                </Typography>
                <Typography variant="body1" paragraph>
                  {employerData.description}
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  Industry
                </Typography>
                <Typography variant="body1" paragraph>
                  {employerData.industry}
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  Company Size
                </Typography>
                <Typography variant="body1" paragraph>
                  {employerData.size}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Founded
                </Typography>
                <Typography variant="body1" paragraph>
                  {employerData.founded}
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  Headquarters
                </Typography>
                <Typography variant="body1" paragraph>
                  {employerData.location}
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  Categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {employerData.categories.map((category, index) => (
                    <CategoryChip key={index} label={category} />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Jobs Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Open Positions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<WorkIcon />}
                onClick={handlePostJob}
              >
                Post New Job
              </Button>
            </Box>
            
            {employerJobs.map((job) => (
              <JobCard key={job.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" component="h3">
                        {job.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                          {job.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Posted: {formatDate(job.posted)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {job.applicants} Applicants
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip label={job.type} size="small" color="primary" variant="outlined" />
                    <Chip label={job.salary} size="small" color="secondary" variant="outlined" />
                  </Box>
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {job.description}
                  </Typography>
                  
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Requirements:
                  </Typography>
                  <List dense>
                    {job.requirements.map((req, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={req} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </JobCard>
            ))}
          </TabPanel>
          
          {/* Videos Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {employerVideos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <VideoCard>
                    <VideoCardMedia
                      image={video.thumbnail}
                      title={video.title}
                    >
                      <VideoPlayButton aria-label="play">
                        <PlayArrowIcon />
                      </VideoPlayButton>
                    </VideoCardMedia>
                    <CardContent>
                      <Typography variant="subtitle1" component="h3" gutterBottom>
                        {video.title}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="textSecondary">
                          {formatDuration(video.duration)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {video.views} views
                        </Typography>
                      </Box>
                    </CardContent>
                  </VideoCard>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          
          {/* Contact Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={employerData.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={employerData.phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LanguageIcon />
                    </ListItemIcon>
                    <ListItemText primary="Website" secondary={employerData.website} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText primary="Location" secondary={employerData.location} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Social Media
                </Typography>
                <List>
                  <ListItem button component="a" href={employerData.social?.linkedin} target="_blank">
                    <ListItemIcon>
                      <LinkedInIcon />
                    </ListItemIcon>
                    <ListItemText primary="LinkedIn" secondary={employerData.social?.linkedin} />
                  </ListItem>
                  <ListItem button component="a" href={employerData.social?.facebook} target="_blank">
                    <ListItemIcon>
                      <FacebookIcon />
                    </ListItemIcon>
                    <ListItemText primary="Facebook" secondary={employerData.social?.facebook} />
                  </ListItem>
                  <ListItem button component="a" href={employerData.social?.twitter} target="_blank">
                    <ListItemIcon>
                      <TwitterIcon />
                    </ListItemIcon>
                    <ListItemText primary="Twitter" secondary={employerData.social?.twitter} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Container>
    </ProfileContainer>
  );
};

export default EmployerProfile;
