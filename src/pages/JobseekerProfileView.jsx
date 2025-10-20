import React, { useContext, useState, useEffect, useRef  } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Avatar,
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
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  VolumeUp,
  VolumeOff
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { getJobSeekerProfile, getUserVideosByUserId, getJobSeekerSkills, getJobSeekerExperiences, getJobSeekerEducation } from '../services/api.js';

// Enhanced styled components (same as original)
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
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    gap: theme.spacing(4)
  }
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[1],
  [theme.breakpoints.up('md')]: {
    paddingRight: theme.spacing(4),
  }
}));

const MainVideoContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 300,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.grey[900],
  boxShadow: theme.shadows[4],
  [theme.breakpoints.up('md')]: {
    width: 350,
    height: 450,
    flexShrink: 0
  }
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  color: '#fff',
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity 0.3s ease',
}));

const VideoActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  display: 'flex',
  color: theme.palette.common.white,
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  opacity: 0.8,
  '&:hover': {
    opacity: 1
  }
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.primary.main}`,
  marginRight: theme.spacing(3),
  boxShadow: theme.shadows[4]
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  fontWeight: 500,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    transform: 'translateY(-2px)'
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
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
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
  paddingTop: '56.25%', // 16:9 aspect ratio
  backgroundColor: theme.palette.grey[800],
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.2)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  }
}));

const VideoPlayButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    transform: 'translate(-50%, -50%) scale(1.1)'
  }
}));

const ExperienceCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateX(5px)'
  }
}));

const JobSeekerPublicProfile = ({userId:propUserId}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { userId  } = useParams(); // Get job seeker ID from URL params
  
  const id = userId || propUserId; // Use propUserId if userId is not available in URL
  // State
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [videos, setVideos] = useState([]);
  const [mainVideo, setMainVideo] = useState({ video_url: '', video_title: '' });
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
  
  // Fetch job seeker data by ID
  useEffect(() => {
    const fetchJobSeekerData = async () => {
      try {
        setLoading(true);
        
        const profileResponse = await getJobSeekerProfile(id);
        setProfile(profileResponse.data);
        
        const skillsResponse = await getJobSeekerSkills(id);
        setSkills(skillsResponse.data.skills);
        
        const experiencesResponse = await getJobSeekerExperiences(id);
        const educationResponse = await getJobSeekerEducation(id);
        setExperiences(experiencesResponse.data.experiences);
        setEducation(educationResponse.data.educations);
        
        const videosResponse = await getUserVideosByUserId(id);
        setVideos(videosResponse.data.videos);
        
        const mainVideo = videosResponse.data.videos.find(video => video.video_position === "main");
        setMainVideo(mainVideo || { video_url: '', video_title: '' });
        
        // Initialize video states
        const initialVideoStates = {};
        videosResponse.data.videos.forEach(video => {
          initialVideoStates[video.id] = {
            isPlaying: false,
            isMuted: true
          };
        });
        setVideoStates(initialVideoStates);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job seeker data:', error);
        setLoading(false);
      }
    };
    
    if (id) {
      fetchJobSeekerData();
    }
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Main video controls
  const toggleMainVideoPlayback = () => {
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
  };
  
  const toggleMainVideoMute = () => {
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = !mainVideoState.isMuted;
      setMainVideoState(prev => ({
        ...prev,
        isMuted: !prev.isMuted
      }));
    }
  };
  
  const handleMainVideoEnded = () => {
    setMainVideoState(prev => ({
      ...prev,
      isPlaying: false
    }));
  };
  
  // Gallery video controls
  const toggleVideoPlayback = (videoId) => {
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
  };
  
  const toggleVideoMute = (videoId) => {
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
  };
  
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleVideoEnded = (videoId) => {
    setVideoStates(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        isPlaying: false
      }
    }));
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <ProfileContainer>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Typography variant="h6">Loading profile...</Typography>
          </Box>
        </Container>
      </ProfileContainer>
    );
  }

  if (!profile) {
    return (
      <ProfileContainer>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Typography variant="h6">Profile not found</Typography>
          </Box>
        </Container>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer sx={{
      //backgroundclr 
      padding: 0,
      minHeight: '100vh',
      height: '100%', 
      mt: 0,
      pt: 2, 
      mb: 0,
      paddingBottom: 4,
    }}>
      <Container maxWidth="lg"  sx={{ mt: isMobile ? 3 : 0 }}>
        {/* Profile Header */}
        <ProfileHeader>
          <ProfileInfo>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ProfileAvatar src={`${VITE_API_BASE_URL}${profile.profile_pic}`} alt={profile.name} />
              <Box>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                  {profile.name}
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="medium">
                  {profile.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                    {profile.location}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
              {profile.bio}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {skills.map((skill, index) => (
                  <SkillChip key={index} label={skill.name} sx={{ mb: 1, mr: 1 }} />
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {profile.email && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {profile.email}
                  </Typography>
                </Box>
              )}
              {profile.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {profile.phone}
                  </Typography>
                </Box>
              )}
              {profile.website && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LanguageIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {profile.website}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
              {profile.social?.linkedin && (
                <Tooltip title="LinkedIn">
                  <IconButton color="primary" aria-label="LinkedIn" href={profile.social.linkedin} target="_blank">
                    <LinkedInIcon />
                  </IconButton>
                </Tooltip>
              )}
              {profile.social?.github && (
                <Tooltip title="GitHub">
                  <IconButton color="primary" aria-label="GitHub" href={profile.social.github} target="_blank">
                    <GitHubIcon />
                  </IconButton>
                </Tooltip>
              )}
              {profile.social?.twitter && (
                <Tooltip title="Twitter">
                  <IconButton color="primary" aria-label="Twitter" href={profile.social.twitter} target="_blank">
                    <TwitterIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </ProfileInfo>

          {/* Main Video */}
          {mainVideo.video_url && (
            <MainVideoContainer>
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
                    {mainVideoState.isMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                </Box>
                <Typography variant="caption" color="inherit" noWrap sx={{ maxWidth: '60%' }}>
                  {mainVideo.video_title || 'Intro Video'}
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
            <Tab label="Experience" icon={<WorkIcon />} iconPosition="start" />
            <Tab label="Education" icon={<SchoolIcon />} iconPosition="start" />
            <Tab label="Skills" />
            <Tab label="Additional Info" />
          </Tabs>

          {/* Experience Tab */}
          <TabPanel value={tabValue} index={0}>
            {experiences.length > 0 ? (
              experiences.map((exp) => (
                <ExperienceCard key={exp.id} sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" component="h3" fontWeight="medium">
                          {exp.title}{exp.position ? ` - ${exp.position}` : ''}
                        </Typography>
                        <Typography variant="subtitle1" color="primary" fontWeight="medium">
                          {exp.company_name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(exp.start_date)} - {exp.currently_working ? 'Present' : formatDate(exp.end_date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        {exp.location}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                      {exp.description}
                    </Typography>
                  </CardContent>
                </ExperienceCard>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                No experience information available
              </Typography>
            )}
          </TabPanel>

          {/* Education Tab */}
          <TabPanel value={tabValue} index={1}>
            {education.length > 0 ? (
              education.map((edu) => (
                <ExperienceCard key={edu.id} sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" component="h3" fontWeight="medium">
                          {edu.degree}
                        </Typography>
                        <Typography variant="subtitle1" color="primary" fontWeight="medium">
                          {edu.institution}
                        </Typography>
                        {edu.field && (
                          <Typography variant="body2" color="textSecondary">
                            {edu.field}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        {edu.location}
                      </Typography>
                    </Box>
                    {edu.description && (
                      <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                        {edu.description}
                      </Typography>
                    )}
                  </CardContent>
                </ExperienceCard>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                No education information available
              </Typography>
            )}
          </TabPanel>

          {/* Skills Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={2}>
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      height: '100%',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}>
                      <SkillChip label={skill.name} sx={{ mr: 1 }} />
                      {skill.level && (
                        <Typography variant="caption" color="textSecondary">
                          {skill.level}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                    No skills information available
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* Additional Info Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Contact Information
                </Typography>
                <List>
                  {profile.email && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <EmailIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={profile.email} 
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>
                  )}
                  {profile.phone && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Phone Number" secondary={profile.phone} />
                    </ListItem>
                  )}
                  {profile.website && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LanguageIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Website" 
                        secondary={profile.website} 
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>
                  )}
                  {profile.location && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LocationIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Location" secondary={profile.location} />
                    </ListItem>
                  )}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Social Media
                </Typography>
                <List>
                  {profile.social?.linkedin && (
                    <ListItem button component="a" href={profile.social.linkedin} target="_blank" sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LinkedInIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="LinkedIn" 
                        secondary={profile.social.linkedin} 
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>
                  )}
                  {profile.social?.github && (
                    <ListItem button component="a" href={profile.social.github} target="_blank" sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <GitHubIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="GitHub" 
                        secondary={profile.social.github} 
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>
                  )}
                  {profile.social?.twitter && (
                    <ListItem button component="a" href={profile.social.twitter} target="_blank" sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TwitterIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Twitter" 
                        secondary={profile.social.twitter} 
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>

        {/* Videos Gallery */}
        {videos.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              My Videos
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {videos.filter(video => video.video_position !== "main").map((video) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                  <VideoCard>
                    <VideoCardMedia>
                      <video
                        ref={el => videoRefs.current[video.id] = el}
                        src={video.video_url}
                        width="100%"
                        height="100%"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        muted={videoStates[video.id]?.isMuted ?? true}
                        onClick={() => toggleVideoPlayback(video.id)}
                        onEnded={() => handleVideoEnded(video.id)}
                      />
                      <VideoPlayButton 
                        aria-label="play" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVideoPlayback(video.id);
                        }}
                      >
                        {videoStates[video.id]?.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                      </VideoPlayButton>
                      <Box sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <IconButton 
                          size="small" 
                          color="inherit" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVideoMute(video.id);
                          }}
                          sx={{
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.8)'
                            }
                          }}
                        >
                          {videoStates[video.id]?.isMuted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
                        </IconButton>
                      </Box>
                    </VideoCardMedia>
                    <CardContent>
                      <Typography variant="subtitle1" component="h3" noWrap>
                        {video.video_title}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        {video.video_duration && (
                          <Typography variant="caption" color="textSecondary">
                            {Math.round(video.video_duration)}s
                          </Typography>
                        )}
                        {video.views && (
                          <Typography variant="caption" color="textSecondary">
                            {video.views} views
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </VideoCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </ProfileContainer>
  );
};

export default JobSeekerPublicProfile;