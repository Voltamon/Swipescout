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
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  VolumeOff as VolumeOffIcon,
  VolumeUp as VolumeOnIcon,
  VolumeUp as  WorkIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getEmployerProfile, getVideoResume, getEmployerJobs, getJobVideos } from '../services/api';

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
    flexDirection: 'row'
  }
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    paddingRight: theme.spacing(4)
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
    marginBottom: 0
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
  justifyContent: 'space-between'
}));

const VideoActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

const CompanyLogo = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `4px solid ${theme.palette.primary.main}`,
  marginRight: theme.spacing(2)
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.main
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
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10]
  }
}));

const JobCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid ${theme.palette.primary.main}`
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

  // Refs
  const mainVideoRef = useRef(null);
  const videoRefs = useRef({});

  // Video state
  const [playingVideos, setPlayingVideos] = useState({});
  const [mutedVideos, setMutedVideos] = useState({});

  // Fetch employer data
  useEffect(() => {
    let isMounted = true;

    const fetchEmployerData = async () => {
      if (!isMounted) return;

      try {
        setLoading(true);

        // Fetch profile
        const profileResponse = await getEmployerProfile();
        if (isMounted) setProfile(profileResponse.data.company);

        // Fetch company videos
        const videosResponse = await getVideoResume({ page: 1, limit: 10 });
        if (isMounted) setVideos(videosResponse.data?.videos || []);

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

  // Toggle playback
  const togglePlayback = useCallback((videoId, isMain = false) => {
    if (isMain && mainVideoRef.current) {
      const video = mainVideoRef.current;
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      setPlayingVideos((prev) => ({ ...prev, main: !video.paused }));
    } else if (videoRefs.current[videoId]) {
      const video = videoRefs.current[videoId];
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      setPlayingVideos((prev) => ({ ...prev, [videoId]: !video.paused }));
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback((videoId, isMain = false) => {
    if (isMain && mainVideoRef.current) {
      const video = mainVideoRef.current;
      video.muted = !video.muted;
      setMutedVideos((prev) => ({ ...prev, main: video.muted }));
    } else if (videoRefs.current[videoId]) {
      const video = videoRefs.current[videoId];
      video.muted = !video.muted;
      setMutedVideos((prev) => ({ ...prev, [videoId]: video.muted }));
    }
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Find main video
  const getMainVideo = () => {
    return videos.find((video) => video.video_position === 'main') || videos[0];
  };

  // Render video card
  const renderVideoCard = useCallback(
    (video, isJobVideo = false) => {
      const isMain = video.id === getMainVideo()?.id;
      const videoId = isMain ? 'main' : video.id;

      return (
        <Grid item xs={12} sm={6} md={4} key={video.id}>
          <VideoCard>
            <Box sx={{ position: 'relative' }}>
              <video
                ref={(el) => {
                  if (el && !isMain) {
                    videoRefs.current[video.id] = el;
                  }
                }}
                src={video.video_url}
                style={{
                  width: '100%',
                  maxHeight: 250,
                  objectFit: 'cover'
                }}
                muted={mutedVideos[videoId]}
              />
              {/* Overlay play button */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  opacity: playingVideos[videoId] ? 0 : 0.8
                }}
              >
                <PlayArrowIcon fontSize="large" />
              </Box>

              {/* Video controls overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  padding: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <IconButton size="small" color="inherit" onClick={() => togglePlayback(video.id)}>
                  {playingVideos[video.id] ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => toggleMute(video.id)}
                  sx={{ mr: 1 }}
                >
                  {mutedVideos[video.id] ? <VolumeOffIcon /> : <VolumeOnIcon />}
                </IconButton>
              </Box>
            </Box>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                {video.video_title || 'Untitled Video'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  {video.video_type || 'video'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {video.views || 0} views
                </Typography>
              </Box>
            </CardContent>
          </VideoCard>
        </Grid>
      );
    },
    [playingVideos, mutedVideos, togglePlayback, toggleMute, getMainVideo]
  );

  // Mock profile fallback
  const mockProfile = {
    name: 'Tech Innovations Inc.',
    industry: 'Information Technology',
    size: '50-200 employees',
    founded: 2010,
    location: 'San Francisco, CA',
    description: 'Tech Innovations Inc. is a leading technology company specializing in innovative software solutions...',
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

  const employerData = profile || mockProfile;
  const employerVideos = videos.length > 0 ? videos : [];
  const employerJobs = jobs.length > 0 ? jobs : [];

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
                  <Box component="span" sx={{ mr: 0.5 }}>
                    📍
                  </Box>
                  <Typography variant="body2" color="textSecondary">
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
                onClick={() => navigate('/employer/edit')}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<WorkIcon />}
                onClick={() => navigate('/employer/post-job')}
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
                {employerData.categories?.map((category, index) => (
                  <CategoryChip key={index} label={category.name || category} />
                ))}
              </Box>
            </Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2">Founded: {employerData.founded}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2">Size: {employerData.size}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2">{employerJobs.length} Active Jobs</Typography>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2">📧 {employerData.email}</Typography>
              <Typography variant="body2">📞 {employerData.phone}</Typography>
              <Typography variant="body2">🌐 {employerData.website}</Typography>
            </Box>
          </ProfileInfo>

          {/* Main Video */}
          <MainVideoContainer>
            <video
              ref={mainVideoRef}
              src={getMainVideo()?.video_url}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
              muted={mutedVideos.main}
            />
            <VideoControls>
              <IconButton size="small" color="inherit" onClick={() => togglePlayback('main', true)}>
                {playingVideos.main ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <Typography variant="caption" color="inherit">
                Company Introduction
              </Typography>
            </VideoControls>
            <VideoActions>
              <IconButton color="inherit" onClick={() => toggleMute('main', true)}>
                {mutedVideos.main ? <VolumeOffIcon /> : <VolumeOnIcon />}
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
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons={isMobile ? 'auto' : false}
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
                  {employerData.categories?.map((category, index) => (
                    <CategoryChip key={index} label={category.name || category} />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Jobs Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Open Positions</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<WorkIcon />}
                onClick={() => navigate('/employer/post-job')}
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
                        <Box component="span" sx={{ mr: 0.5 }}>
                          📍
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {job.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Posted: {formatDate(job.posted_at)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {job.applicants_count || 0} Applicants
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
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {job.description}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Requirements:
                  </Typography>
                  <ul>
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                  {jobVideos[job.id]?.length > 0 && (
                    <>
                      <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Job Videos:
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {jobVideos[job.id].map((video) => (
                          <Grid item xs={12} sm={6} md={4} key={video.id}>
                            <Box sx={{ position: 'relative' }}>
                              <video
                                ref={(el) => {
                                  if (el) videoRefs.current[video.id] = el;
                                }}
                                src={video.video_url}
                                style={{
                                  width: '100%',
                                  maxHeight: 200,
                                  objectFit: 'cover',
                                  borderRadius: theme.shape.borderRadius
                                }}
                                muted={mutedVideos[video.id]}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  pointerEvents: 'none',
                                  opacity: playingVideos[video.id] ? 0 : 0.8
                                }}
                              >
                                <PlayArrowIcon sx={{ fontSize: 30 }} />
                              </Box>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                  padding: 1,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <IconButton size="small" color="inherit" onClick={() => togglePlayback(video.id)}>
                                  {playingVideos[video.id] ? <PauseIcon /> : <PlayArrowIcon />}
                                </IconButton>
                                <IconButton size="small" color="inherit" onClick={() => toggleMute(video.id)}>
                                  {mutedVideos[video.id] ? <VolumeOffIcon /> : <VolumeOnIcon />}
                                </IconButton>
                              </Box>
                            </Box>
                            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                              {video.video_title || 'Untitled Video'}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
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
              {employerVideos.map((video) => renderVideoCard(video))}
            </Grid>
          </TabPanel>

          {/* Contact Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Typography>Email: {employerData.email}</Typography>
                <Typography>Phone: {employerData.phone}</Typography>
                <Typography>Website: {employerData.website}</Typography>
                <Typography>Location: {employerData.location}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Social Media
                </Typography>
                <Typography>
                  LinkedIn: <a href={employerData.social?.linkedin}>{employerData.social?.linkedin}</a>
                </Typography>
                <Typography>
                  Facebook: <a href={employerData.social?.facebook}>{employerData.social?.facebook}</a>
                </Typography>
                <Typography>
                  Twitter: <a href={employerData.social?.twitter}>{employerData.social?.twitter}</a>
                </Typography>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Container>
    </ProfileContainer>
  );
};

export default EmployerProfile;