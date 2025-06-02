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
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, getUserVideos, getUserSkills, getUserExperiences } from '../services/userService';

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

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `4px solid ${theme.palette.primary.main}`,
  marginRight: theme.spacing(2),
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
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
  paddingTop: '177.78%', // 16:9 aspect ratio
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

const ExperienceCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const JobSeekerProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [tabValue, setTabValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Refs
  const videoRef = React.useRef(null);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const profileResponse = await getUserProfile();
        setProfile(profileResponse.data);
        
        // Fetch skills
        const skillsResponse = await getUserSkills();
        setSkills(skillsResponse.data.skills);
        
        // Fetch experiences
        const experiencesResponse = await getUserExperiences();
        setExperiences(experiencesResponse.data.experiences);
        setEducation(experiencesResponse.data.education);
        
        // Fetch videos
        const videosResponse = await getUserVideos();
        setVideos(videosResponse.data.videos);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
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
    navigate('/profile/edit');
  };
  
  // Mock data for demonstration
  const mockProfile = {
    id: '1',
    name: 'أحمد محمد',
    title: 'مطور واجهات أمامية',
    location: 'الرياض، المملكة العربية السعودية',
    bio: 'مطور واجهات أمامية ذو خبرة 5 سنوات في تطوير تطبيقات الويب باستخدام React و Angular. متخصص في تصميم واجهات المستخدم وتحسين تجربة المستخدم.',
    email: 'ahmed@example.com',
    phone: '+966 50 123 4567',
    website: 'www.ahmeddev.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    mainVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    social: {
      linkedin: 'linkedin.com/in/ahmed',
      github: 'github.com/ahmed',
      twitter: 'twitter.com/ahmed'
    }
  };
  
  const mockSkills = [
    'React', 'Angular', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 
    'Material UI', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Git',
    'Responsive Design', 'UI/UX', 'RESTful APIs', 'GraphQL'
  ];
  
  const mockExperiences = [
    {
      id: '1',
      company: 'شركة التقنية المتقدمة',
      position: 'مطور واجهات أمامية أول',
      startDate: '2020-01',
      endDate: null,
      current: true,
      description: 'تطوير واجهات المستخدم لتطبيقات الويب باستخدام React و TypeScript. تصميم وتنفيذ هيكل التطبيق وإدارة حالة التطبيق باستخدام Redux. العمل مع فريق من المطورين لتحسين أداء التطبيق وتجربة المستخدم.',
      location: 'الرياض'
    },
    {
      id: '2',
      company: 'شركة البرمجيات العالمية',
      position: 'مطور واجهات أمامية',
      startDate: '2018-03',
      endDate: '2019-12',
      current: false,
      description: 'تطوير واجهات المستخدم لتطبيقات الويب باستخدام Angular. تنفيذ تصاميم المستخدم وتحسين تجربة المستخدم. العمل مع فريق من المطورين لتطوير تطبيقات ويب تفاعلية.',
      location: 'جدة'
    },
    {
      id: '3',
      company: 'شركة الحلول الرقمية',
      position: 'مطور ويب',
      startDate: '2016-06',
      endDate: '2018-02',
      current: false,
      description: 'تطوير مواقع الويب باستخدام HTML و CSS و JavaScript. تنفيذ تصاميم المستخدم وتحسين تجربة المستخدم. العمل مع فريق من المطورين لتطوير مواقع ويب تفاعلية.',
      location: 'الدمام'
    }
  ];
  
  const mockEducation = [
    {
      id: '1',
      institution: 'جامعة الملك سعود',
      degree: 'بكالوريوس علوم الحاسب',
      field: 'علوم الحاسب',
      startDate: '2012-09',
      endDate: '2016-05',
      description: 'تخصص في تطوير البرمجيات وهندسة البرمجيات. مشروع التخرج: تطوير تطبيق ويب لإدارة المشاريع.',
      location: 'الرياض'
    },
    {
      id: '2',
      institution: 'أكاديمية البرمجة',
      degree: 'شهادة تطوير الويب المتقدم',
      field: 'تطوير الويب',
      startDate: '2016-06',
      endDate: '2016-08',
      description: 'دورة مكثفة في تطوير الويب باستخدام أحدث التقنيات.',
      location: 'الرياض'
    }
  ];
  
  const mockVideos = [
    {
      id: '1',
      title: 'مقدمة عن نفسي',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 30,
      type: 'intro',
      views: 120
    },
    {
      id: '2',
      title: 'مهاراتي في React',
      thumbnail: 'https://i.ytimg.com/vi/LDZX4ooRsWs/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 45,
      type: 'skills',
      views: 85
    },
    {
      id: '3',
      title: 'خبراتي السابقة',
      thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 40,
      type: 'experience',
      views: 67
    },
    {
      id: '4',
      title: 'مشاريعي السابقة',
      thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 35,
      type: 'portfolio',
      views: 92
    },
    {
      id: '5',
      title: 'لماذا أنا مناسب للوظيفة',
      thumbnail: 'https://i.ytimg.com/vi/RgKAFK5djSk/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 42,
      type: 'outro',
      views: 105
    },
    {
      id: '6',
      title: 'مهاراتي في Angular',
      thumbnail: 'https://i.ytimg.com/vi/fRh_vgS2dFE/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 38,
      type: 'skills',
      views: 73
    }
  ];
  
  // Use mock data if real data is not available
  const userData = profile || mockProfile;
  const userSkills = skills.length > 0 ? skills : mockSkills;
  const userExperiences = experiences.length > 0 ? experiences : mockExperiences;
  const userEducation = education.length > 0 ? education : mockEducation;
  const userVideos = videos.length > 0 ? videos : mockVideos;
  
  // Format date (YYYY-MM to readable format)
  const formatDate = (dateString) => {
    if (!dateString) return 'الحالي';
    
    const date = new Date(dateString);
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  return (
    <ProfileContainer>
      <Container maxWidth="lg">
        {/* Profile Header */}
        <ProfileHeader>
          <ProfileInfo>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ProfileAvatar src={userData.avatar} alt={userData.name} />
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {userData.name}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {userData.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                    {userData.location}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditProfile}
              sx={{ mb: 2 }}
            >
              تعديل الملف الشخصي
            </Button>
            
            <Typography variant="body1" paragraph>
              {userData.bio}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                المهارات
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {userSkills.map((skill, index) => (
                  <SkillChip key={index} label={skill} />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {userData.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {userData.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageIcon fontSize="small" color="action" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {userData.website}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="primary" aria-label="GitHub">
                <GitHubIcon />
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
              src={userData.mainVideo}
              width="100%"
              height="100%"
              poster={userVideos[0]?.thumbnail}
              onEnded={handleVideoEnded}
              style={{ objectFit: 'cover' }}
            />
            
            <VideoControls>
              <IconButton size="small" color="inherit" onClick={togglePlayback}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <Typography variant="caption" color="inherit">
                فيديو تعريفي
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
            <Tab label="الخبرات" />
            <Tab label="التعليم" />
            <Tab label="المهارات" />
            <Tab label="معلومات إضافية" />
          </Tabs>
          
          {/* Experience Tab */}
          <TabPanel value={tabValue} index={0}>
            {userExperiences.map((exp) => (
              <ExperienceCard key={exp.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" component="h3">
                        {exp.position}
                      </Typography>
                      <Typography variant="subtitle1" color="primary">
                        {exp.company}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(exp.startDate)} - {exp.current ? 'الحالي' : formatDate(exp.endDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                      {exp.location}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {exp.description}
                  </Typography>
                </CardContent>
              </ExperienceCard>
            ))}
          </TabPanel>
          
          {/* Education Tab */}
          <TabPanel value={tabValue} index={1}>
            {userEducation.map((edu) => (
              <ExperienceCard key={edu.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" component="h3">
                        {edu.degree}
                      </Typography>
                      <Typography variant="subtitle1" color="primary">
                        {edu.institution}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {edu.field}
                      </Typography>
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
                  <Typography variant="body2">
                    {edu.description}
                  </Typography>
                </CardContent>
              </ExperienceCard>
            ))}
          </TabPanel>
          
          {/* Skills Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={2}>
              {userSkills.map((skill, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
                    <SkillChip label={skill} />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          
          {/* Additional Info Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  معلومات الاتصال
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary="البريد الإلكتروني" secondary={userData.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary="رقم الهاتف" secondary={userData.phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LanguageIcon />
                    </ListItemIcon>
                    <ListItemText primary="الموقع الإلكتروني" secondary={userData.website} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText primary="الموقع" secondary={userData.location} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  وسائل التواصل الاجتماعي
                </Typography>
                <List>
                  <ListItem button component="a" href={userData.social?.linkedin} target="_blank">
                    <ListItemIcon>
                      <LinkedInIcon />
                    </ListItemIcon>
                    <ListItemText primary="LinkedIn" secondary={userData.social?.linkedin} />
                  </ListItem>
                  <ListItem button component="a" href={userData.social?.github} target="_blank">
                    <ListItemIcon>
                      <GitHubIcon />
                    </ListItemIcon>
                    <ListItemText primary="GitHub" secondary={userData.social?.github} />
                  </ListItem>
                  <ListItem button component="a" href={userData.social?.twitter} target="_blank">
                    <ListItemIcon>
                      <TwitterIcon />
                    </ListItemIcon>
                    <ListItemText primary="Twitter" secondary={userData.social?.twitter} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
        
        {/* Videos Gallery */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            فيديوهاتي
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            {userVideos.map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
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
                    <Typography variant="subtitle1" component="h3" noWrap>
                      {video.title}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" color="textSecondary">
                        {video.duration} ثانية
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {video.views} مشاهدة
                      </Typography>
                    </Box>
                  </CardContent>
                </VideoCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </ProfileContainer>
  );
};

export default JobSeekerProfile;
