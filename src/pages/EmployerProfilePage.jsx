import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  IconButton,
  Divider,
  Paper,
  styled,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  VolumeOff as VolumeOffIcon,
  VolumeUp as VolumeOnIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getEmployerProfile, getVideoResume, getEmployerJobs, getJobVideos } from '../services/api';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Enhanced styled components
const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6)
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  
  marginBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',alignItems: 'flex-start',
  gap: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    gap: theme.spacing(4),
    alignItems: 'flex-start',
  }
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[1],
   alignSelf: 'flex-start',
  [theme.breakpoints.up('md')]: {
    paddingRight: theme.spacing(4)
  }
}));

const MainVideoContainer = styled(Box)(({ theme }) => ({

  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  position: 'relative',
  alignSelf: 'flex-start',
  backgroundColor: theme.palette.grey[900],
  boxShadow: theme.shadows[4],
  [theme.breakpoints.up('md')]: {
    width: 320,
    height: 370,
    flexShrink: 0
  }
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  backgroundColor: 'rgba(253, 251, 251, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity 0.3s ease'
}));

const VideoActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  color: theme.palette.common.white,
  opacity: 0.8,
  '&:hover': {
    opacity: 1
  }
}));

const CompanyLogo = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.primary.main}`,
  marginRight: theme.spacing(3),
  boxShadow: theme.shadows[4]
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.contrastText,
  fontWeight: 500,
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    transform: 'translateY(-2px)'
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const VideoCard = styled(Card)(({ theme }) => ({
  width: '300px',
  height: '400px', 
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  alignSelf: 'stretch',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '& $VideoCardMedia': {
      '&:after': {
        opacity: 1
      }
    }
  }
}));

const VideoCardMedia = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '300px', // Increased height
  backgroundColor: '#000', // Pure black background
  
  overflow: 'hidden',
  '& video': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    cursor: 'pointer'
  }
}));


const JobCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateX(5px)'
  }
}));

const EmployerProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobVideos, setJobVideos] = useState({});
  const [loading, setLoading] = useState(true);

  // Video states
  const [mainVideoState, setMainVideoState] = useState({
    isPlaying: false,
    isMuted: true
  });
  
  const [videoStates, setVideoStates] = useState({});

  // Refs
  const mainVideoRef = useRef(null);
  const videoRefs = useRef({});

  // Fetch employer data
  useEffect(() => {
    let isMounted = true;

    const fetchEmployerData = async () => {
      if (!isMounted) return;

      try {
        setLoading(true);

        // Fetch profile
        const profileResponse = await getEmployerProfile();
        if (isMounted) setProfile(profileResponse.data);

        console.log("logo::::::::::::::::");
        console.log(profileResponse.data.logo);
        console.log("videos::::::::::::::::");
        console.log(profileResponse.data?.videos);
        // Fetch company videos
        // const videosResponse = await getVideoResume({ page: 1, limit: 10 });
        if (isMounted) setVideos(profileResponse.data?.videos || []);

        // Fetch jobs
        const jobsResponse = await getEmployerJobs();
        if (isMounted) setJobs(jobsResponse.data?.jobs || []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching employer data:', error);
        setLoading(false);
      }
    };

    fetchEmployerData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch job videos when Jobs tab is selected
  useEffect(() => {
    if (tabValue === 1 && jobs.length > 0) {
      const fetchJobVideos = async () => {
        const jobPromises = jobs.map(async (job) => {
          try {
            const response = await getJobVideos(job.id);
            return { jobId: job.id, videos: response.data.videos || [] };
          } catch (error) {
            console.error(`Failed to fetch videos for job ${job.id}`, error);
            return { jobId: job.id, videos: [] };
          }
        });

        const results = await Promise.all(jobPromises);
        const jobVideosMap = {};

        results.forEach(({ jobId, videos }) => {
          jobVideosMap[jobId] = videos;
        });

        setJobVideos(jobVideosMap);
      };

      fetchJobVideos();
    }
  }, [tabValue, jobs]);

  // Handle tab change
  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  // Main video controls
  const toggleMainVideoPlayback = useCallback(() => {
    if (mainVideoRef.current) {
      if (mainVideoState.isPlaying) {
        mainVideoRef.current.pause();
      } else {
        mainVideoRef.current.play();
      }
      setMainVideoState(prev => ({
        ...prev,
        isPlaying: !prev.isPlaying
      }));
    }
  }, [mainVideoState.isPlaying]);

  const toggleMainVideoMute = useCallback(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = !mainVideoState.isMuted;
      setMainVideoState(prev => ({
        ...prev,
        isMuted: !prev.isMuted
      }));
    }
  }, [mainVideoState.isMuted]);

  const handleMainVideoEnded = useCallback(() => {
    setMainVideoState(prev => ({
      ...prev,
      isPlaying: false
    }));
  }, []);

  // Gallery video controls
  const toggleVideoPlayback = useCallback((videoId) => {
    const videoRef = videoRefs.current[videoId];
    if (videoRef) {
      if (videoStates[videoId]?.isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setVideoStates(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          isPlaying: !prev[videoId]?.isPlaying
        }
      }));
    }
  }, [videoStates]);

  const toggleVideoMute = useCallback((videoId) => {
    const videoRef = videoRefs.current[videoId];
    if (videoRef) {
      videoRef.muted = !videoStates[videoId]?.isMuted;
      setVideoStates(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          isMuted: !prev[videoId]?.isMuted
        }
      }));
    }
  }, [videoStates]);

  const handleVideoEnded = useCallback((videoId) => {
    setVideoStates(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        isPlaying: false
      }
    }));
  }, []);

  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // Format duration
  const formatDuration = useCallback((seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Find main video
  const getMainVideo = useCallback(() => {
    return videos.find((video) => video.video_position === 'main') || videos[0];
  }, [videos]);

  // Mock profile fallback
  const mockProfile = {
    name: 'A SAMPLE Profile data / Start Edit Yours instead',
    industry: 'Information Technology',
    size: '50-200 employees',
    founded: 2010,
    location: 'San Francisco, CA',
    description: 'Tech Innovations Inc. is a leading technology company specializing in innovative software solutions...',
    email: 'careers@techinnovations.com',
    phone: '+1 (415) 555-1234',
    website: 'www.techinnovations.com',
    logo: 'https://via.placeholder.com/100',
    categories: ['Software Development', 'Cloud Computing', 'AI & Machine Learning'],
    social: {
      linkedin: 'linkedin.com/company/techinnovations',
      facebook: 'facebook.com/techinnovations',
      twitter: 'twitter.com/techinnovations'
    }
  };

  const employerData = profile || mockProfile;
  const employerVideos = videos.length > 0 ? videos : [];
  const employerJobs = jobs.length > 0 ? jobs : [];
  const mainVideo = getMainVideo();

  if (loading) {
    return (
      <ProfileContainer  sx={{
  
    padding: theme.spacing(2),
    height: '100vh',
    mt: 2,
    mb: 0,
    paddingBottom: 4,
  }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Typography variant="h6">Loading profile...</Typography>
          </Box>
        </Container>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer sx={{
     bgcolor: 'background.default',
      height: '100%',
      mt: 0,
      mb: 0,
      paddingBottom: 4,
    }}>
      <Container maxWidth="lg"  >
        {/* Profile Header */}
        <ProfileHeader sx={{ 
  alignItems: 'flex-start',
  '& > *': {
    
    alignSelf: 'flex-start !important' // Force top alignment
  }
}}>
          <ProfileInfo sx={{ mt: isMobile ? 3 : 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CompanyLogo src={VITE_API_BASE_URL+employerData.logo} alt={employerData.name} />
              <Box>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                  {employerData.name}
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="medium">
                  {employerData.industry}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                    {employerData.location}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate('/edit-employer-profile')}
                sx={{ boxShadow: 2 }}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<WorkIcon />}
                onClick={() => navigate('/Post-job-page')}
                sx={{ boxShadow: 1 }}
              >
                Post Job
              </Button>
            </Box>

            <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
              {employerData.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {employerData.categories?.map((category, index) => (
                  <CategoryChip key={index} label={category.name || category} sx={{ mb: 1, mr: 1 }} />
                ))}
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2">
                  <Box component="span" fontWeight="bold">Founded:</Box> {employerData.founded}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2">
                  <Box component="span" fontWeight="bold">Size:</Box> {employerData.size}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2">
                  <Box component="span" fontWeight="bold">Active Jobs:</Box> {employerJobs.length}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {employerData.email && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {employerData.email}
                  </Typography>
                </Box>
              )}
              {employerData.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {employerData.phone}
                  </Typography>
                </Box>
              )}
              {employerData.website && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LanguageIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {employerData.website}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
              {employerData.social?.linkedin && (
                <Tooltip title="LinkedIn">
                  <IconButton 
                    color="primary" 
                    aria-label="LinkedIn" 
                    href={employerData.social.linkedin} 
                    target="_blank"
                  >
                    <LinkedInIcon />
                  </IconButton>
                </Tooltip>
              )}
              {employerData.social?.facebook && (
                <Tooltip title="Facebook">
                  <IconButton 
                    color="primary" 
                    aria-label="Facebook" 
                    href={employerData.social.facebook} 
                    target="_blank"
                  >
                    <FacebookIcon />
                  </IconButton>
                </Tooltip>
              )}
              {employerData.social?.twitter && (
                <Tooltip title="Twitter">
                  <IconButton 
                    color="primary" 
                    aria-label="Twitter" 
                    href={employerData.social.twitter} 
                    target="_blank"
                  >
                    <TwitterIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </ProfileInfo>

          {/* Main Video */}
          {mainVideo?.video_url && (
            <MainVideoContainer sx={{ alignSelf: 'flex-start !important', mt:2 }}>
              <video
                ref={mainVideoRef}
                src={mainVideo.video_url}
                width="100%"
                height="100%"
                muted={mainVideoState.isMuted}
                onEnded={handleMainVideoEnded}
                onClick={toggleMainVideoPlayback}
                style={{ objectFit: 'cover', cursor: 'pointer' }}
              />

              <VideoControls>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton size="small" color="inherit" onClick={toggleMainVideoPlayback}>
                    {mainVideoState.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <IconButton size="small" color="inherit" onClick={toggleMainVideoMute}>
                    {mainVideoState.isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
                  </IconButton>
                </Box>
                <Typography variant="caption" color="inherit" noWrap sx={{ maxWidth: '60%' }}>
                  {mainVideo.video_title || 'Company Introduction'}
                </Typography>
              </VideoControls>

              <VideoActions>
                <Tooltip title="Like">
                  <IconButton color="inherit">
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton color="inherit">
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Save">
                  <IconButton color="inherit">
                    <BookmarkIcon />
                  </IconButton>
                </Tooltip>
              </VideoActions>
            </MainVideoContainer>
          )}
        </ProfileHeader>

        {/* Tabs Section */}
        <Paper sx={{ mb: 4, borderRadius: theme.shape.borderRadius, overflow: 'hidden', boxShadow: theme.shadows[3] }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            centered={!isMobile}
            sx={{
              '& .MuiTab-root': {
                fontSize: isMobile ? '0.875rem' : '1rem',
                fontWeight: 500,
                minHeight: 48
              }
            }}
          >
            <Tab label="About" icon={isMobile ? null : <WorkIcon />} iconPosition="start" />
            <Tab label="Jobs" icon={isMobile ? null : <WorkIcon />} iconPosition="start" />
            <Tab label="Videos" icon={isMobile ? null : <PlayArrowIcon />} iconPosition="start" />
            <Tab label="Contact" icon={isMobile ? null : <EmailIcon />} iconPosition="start" />
          </Tabs>

          {/* About Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Company Overview
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  {employerData.description}
                </Typography>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Industry
                </Typography>
                <Typography variant="body1" paragraph>
                  {employerData.industry}
                </Typography>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Company Size
                </Typography>
                <Typography variant="body1" paragraph>
                  {employerData.size}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Founded
                </Typography>
                <Typography variant="body1" paragraph>
                  {employerData.founded}
                </Typography>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Headquarters
                </Typography>
                <Typography variant="body1" paragraph>
                  {employerData.location}
                </Typography>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {employerData.categories?.map((category, index) => (
                    <CategoryChip key={index} label={category.name || category} sx={{ mb: 1, mr: 1 }} />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Jobs Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" fontWeight="medium">
                Open Positions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<WorkIcon />}
                onClick={() => navigate('/Post-job-page')}
                sx={{ boxShadow: 2 }}
              >
                Post New Job
              </Button>
            </Box>

            {employerJobs.length > 0 ? (
              employerJobs.map((job) => (
                <JobCard key={job.id} sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" component="h3" fontWeight="medium">
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
                          <Box component="span" fontWeight="bold">Posted:</Box> {formatDate(job.posted_at)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <Box component="span" fontWeight="bold">Applicants:</Box> {job.applicants_count || 0}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip label={job.employment_type} size="small" color="primary" variant="outlined" />
                      <Chip
                        label={`${job.salary_min || 0} - ${job.salary_max || 0}`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
                      {job.description}
                    </Typography>

                    {job.requirements?.length > 0 && (
                      <>
                        <Typography variant="subtitle1" sx={{ mt: 2 }} fontWeight="medium">
                          Requirements:
                        </Typography>
                        <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
                          {job.requirements.map((req, idx) => (
                            <ListItem key={idx} sx={{ display: 'list-item', pl: 1 }}>
                              <ListItemText primary={req} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}

                    {jobVideos[job.id]?.length > 0 && (
                      <>
                        <Typography variant="subtitle1" sx={{ mt: 2 }} fontWeight="medium">
                          Job Videos:
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                        {jobVideos[job.id].map((video) => (
                          <Grid item xs={12} sm={6} md={4} key={video.id}>
                          <Grid item xs={12} sm={6} md={4} key={video.id}>
                          <VideoCard sx={{ height: '100%' }}>
                          <VideoCardMedia onClick={() => toggleVideoPlayback(video.id)}>
                          <video
                            ref={el => {
                              if (el) {
                                videoRefs.current[video.id] = el;
                                el.muted = videoStates[video.id]?.isMuted ?? true;
                              }
                            }}
                            src={video.video_url}
                            onEnded={() => handleVideoEnded(video.id)}
                          />
                          
                          {/* Title overlapping on video */}
                          <Box sx={{
                            position: 'absolute',
                            bottom: 35,
                            left: 0,
                            right: 0,
                            padding: '16px',
                          }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: 'white',
                                
                                fontWeight: 'bold'
                              }}
                            >
                              {video.video_title || 'Untitled Video'}
                            </Typography>
                          </Box>
                    
                          {/* Play/Pause overlay */}
                          <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(247, 236, 236, 0.3)',
                            opacity: videoStates[video.id]?.isPlaying ? 0 : 1,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: 'none'
                          }}>
                            <PlayArrowIcon sx={{ fontSize: 50, color: 'white' }} />
                          </Box>
                          
                          {/* Video controls with black background */}
                          <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px',
                            
                           
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleVideoPlayback(video.id);
                                }}
                                sx={{ 
                                  color: 'white',
                                  backgroundColor: 'rgba(255,255,255,0.2)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.3)'
                                  }
                                }}
                              >
                                {videoStates[video.id]?.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                              </IconButton>
                              
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleVideoMute(video.id);
                                }}
                                sx={{ 
                                  color: 'white',
                                  backgroundColor: 'rgba(255,255,255,0.2)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.3)'
                                  }
                                }}
                              >
                                {videoStates[video.id]?.isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
                              </IconButton>
                              
                              <Typography variant="caption" sx={{ color: 'white', ml: 1 }}>
                                {formatDuration(video.video_duration)}
                              </Typography>
                            </Box>
                            
                            <Typography variant="caption" sx={{ color: 'white' }}>
                              {video.views || 0} views
                            </Typography>
                          </Box>
                        </VideoCardMedia>
                            
                            {/* Optional: Additional info below video if needed */}
                            {/* <CardContent>
                              <Typography variant="body2" color="textSecondary">
                                Additional information here
                              </Typography>
                            </CardContent> */}
                          </VideoCard>
                        </Grid>                         </Grid>
                          ))}
                        </Grid>
                      </>
                    )}

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/job/${job.id}`)}
                        sx={{ boxShadow: 2 }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </JobCard>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                No job postings available
              </Typography>
            )}
          </TabPanel>

          {/* Videos Tab */}
          <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {employerVideos.length > 0 ? (
              employerVideos.filter(video => video.id !== mainVideo?.id).map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
  <VideoCard sx={{ height: '100%' }}>
    <VideoCardMedia onClick={() => toggleVideoPlayback(video.id)}>
      <video
        ref={el => {
          if (el) {
            videoRefs.current[video.id] = el;
            el.muted = videoStates[video.id]?.isMuted ?? true;
          }
        }}
        src={video.video_url}
        onEnded={() => handleVideoEnded(video.id)}
      />
      
      {/* Title overlapping on video */}
      <Box sx={{
        position: 'absolute',
        bottom: 35,
        left: 0,
        right: 0,
        padding: '16px',
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white',
            
            fontWeight: 'bold'
          }}
        >
          {video.video_title || 'Untitled Video'}
        </Typography>
      </Box>

      {/* Play/Pause overlay */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        opacity: videoStates[video.id]?.isPlaying ? 0 : 1,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none'
      }}>
        <PlayArrowIcon sx={{ fontSize: 50, color: 'white' }} />
      </Box>
      
      {/* Video controls with black background */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        
       
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              toggleVideoPlayback(video.id);
            }}
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            {videoStates[video.id]?.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleVideoMute(video.id);
            }}
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            {videoStates[video.id]?.isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
          </IconButton>
          
          <Typography variant="caption" sx={{ color: 'white', ml: 1 }}>
            {formatDuration(video.video_duration)}
          </Typography>
        </Box>
        
        <Typography variant="caption" sx={{ color: 'white' }}>
          {video.views || 0} views
        </Typography>
      </Box>
    </VideoCardMedia>
    
    {/* Optional: Additional info below video if needed */}
    {/* <CardContent>
      <Typography variant="body2" color="textSecondary">
        Additional information here
      </Typography>
    </CardContent> */}
  </VideoCard>
</Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  No videos available
                </Typography>
              </Grid>
            )}
          </Grid>
        </TabPanel>

          {/* Contact Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Contact Information
                </Typography>
                <List>
                  {employerData.email && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <EmailIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={employerData.email} 
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>
                  )}
                  {employerData.phone && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Phone" secondary={employerData.phone} />
                    </ListItem>
                  )}
                  {employerData.website && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LanguageIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Website" 
                        secondary={employerData.website} 
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>
                  )}
                  {employerData.location && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LocationIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Location" secondary={employerData.location} />
                    </ListItem>
                  )}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Social Media
                </Typography>
                <List>
                  {employerData.social?.linkedin && (
                    <ListItem button component="a" href={employerData.social.linkedin} target="_blank" sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LinkedInIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="LinkedIn" 
                        secondary={employerData.social.linkedin} 
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>
                  )}
                  {employerData.social?.facebook && (
                    <ListItem button component="a" href={employerData.social.facebook} target="_blank" sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <FacebookIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Facebook" 
                        secondary={employerData.social.facebook} 
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>
                  )}
                  {employerData.social?.twitter && (
                    <ListItem button component="a" href={employerData.social.twitter} target="_blank" sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TwitterIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Twitter" 
                        secondary={employerData.social.twitter} 
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>
                  )}
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