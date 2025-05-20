import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Avatar, 
  Button, 
  Chip, 
  Divider, 
  Tabs, 
  Tab, 
  Card, 
  CardMedia, 
  CardContent,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useAuth } from '../hooks/useAuth';
// import { getUserProfile } from '../services/userService';
// import { getUserVideos } from '../services/videoService';
// import { getUserSkills } from '../services/skillService';

const ProfileContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  minHeight: 'calc(100vh - 56px)',
}));

const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  marginBottom: theme.spacing(2),
  border: `4px solid ${theme.palette.primary.main}`,
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(3),
    marginBottom: 0,
  },
}));

const EditButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const VideoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}));

const VideoCardMedia = styled(CardMedia)(({ theme }) => ({
  paddingTop: '56.25%', // 16:9 aspect ratio
  position: 'relative',
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
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
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileId = userId || user.id;
        setIsOwnProfile(profileId === user.id);
        
        // جلب بيانات الملف الشخصي
        const profileResponse = await getUserProfile(profileId);
        setProfile(profileResponse.data.profile);
        
        // جلب الفيديوهات
        const videosResponse = await getUserVideos(profileId);
        setVideos(videosResponse.data.videos);
        
        // جلب المهارات (للباحثين عن عمل فقط)
        if (profileResponse.data.profile.role === 'job_seeker') {
          const skillsResponse = await getUserSkills(profileId);
          setSkills(skillsResponse.data.skills);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, user.id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
        <Typography variant="h6">لم يتم العثور على الملف الشخصي</Typography>
      </Box>
    );
  }

  const isJobSeeker = profile.role === 'job_seeker';

  return (
    <ProfileContainer>
      <ProfileHeader elevation={2}>
        {isOwnProfile && (
          <EditButton color="primary" aria-label="تعديل الملف الشخصي">
            <EditIcon />
          </EditButton>
        )}
        
        <ProfileAvatar src={profile.photo_url} alt={profile.name}>
          {!profile.photo_url && profile.name.charAt(0)}
        </ProfileAvatar>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {profile.name}
          </Typography>
          
          <Typography variant="h6" color="primary" gutterBottom>
            {isJobSeeker ? profile.preferred_job_title || 'باحث عن عمل' : 'صاحب عمل'}
          </Typography>
          
          {profile.bio && (
            <Typography variant="body1" paragraph>
              {profile.bio}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {profile.location && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{profile.location}</Typography>
              </Box>
            )}
            
            {isJobSeeker && profile.experience_years && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{profile.experience_years} سنوات خبرة</Typography>
              </Box>
            )}
            
            {isJobSeeker && profile.education && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{profile.education}</Typography>
              </Box>
            )}
          </Box>
          
          {isOwnProfile ? (
            <Button variant="contained" color="primary">
              تعديل الملف الشخصي
            </Button>
          ) : (
            <Button variant="contained" color="primary">
              {isJobSeeker ? 'التواصل مع المرشح' : 'التواصل مع الشركة'}
            </Button>
          )}
        </Box>
      </ProfileHeader>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              معلومات الاتصال
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {profile.email && (
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary={profile.email} />
                </ListItem>
              )}
              
              {profile.mobile && (
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText primary={profile.mobile} />
                </ListItem>
              )}
              
              {profile.website && (
                <ListItem>
                  <ListItemIcon>
                    <LinkIcon />
                  </ListItemIcon>
                  <ListItemText primary={profile.website} />
                </ListItem>
              )}
            </List>
            
            {isJobSeeker && skills.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  المهارات
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {skills.map(skill => (
                    <SkillChip 
                      key={skill.id} 
                      label={`${skill.name} (${skill.level})`} 
                      color="primary" 
                      variant="outlined" 
                    />
                  ))}
                </Box>
              </>
            )}
            
            {!isJobSeeker && profile.company && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  معلومات الشركة
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="الصناعة" 
                      secondary={profile.company.industry} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="حجم الشركة" 
                      secondary={profile.company.size} 
                    />
                  </ListItem>
                  
                  {profile.company.founded && (
                    <ListItem>
                      <ListItemText 
                        primary="تأسست عام" 
                        secondary={profile.company.founded} 
                      />
                    </ListItem>
                  )}
                </List>
              </>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ minHeight: 400 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="profile tabs"
              centered
            >
              <Tab label="الفيديوهات" />
              {isJobSeeker && <Tab label="السيرة الذاتية" />}
              {!isJobSeeker && <Tab label="الوظائف المنشورة" />}
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              {videos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    لا توجد فيديوهات متاحة
                  </Typography>
                  {isOwnProfile && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ mt: 2 }}
                    >
                      تحميل فيديو جديد
                    </Button>
                  )}
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {videos.map(video => (
                    <Grid item xs={12} sm={6} md={4} key={video.id}>
                      <VideoCard>
                        <VideoCardMedia
                          image={video.thumbnail_url || '/placeholder-thumbnail.jpg'}
                          title={video.title}
                        >
                          <PlayButton aria-label="تشغيل">
                            <PlayArrowIcon fontSize="large" />
                          </PlayButton>
                        </VideoCardMedia>
                        <CardContent>
                          <Typography variant="subtitle1" noWrap>
                            {video.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(video.created_at).toLocaleDateString('ar-EG')}
                          </Typography>
                        </CardContent>
                      </VideoCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {isJobSeeker ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    السيرة الذاتية
                  </Typography>
                  
                  {profile.resume_video_url ? (
                    <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 2 }}>
                      <Box
                        component="video"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                        }}
                        controls
                        src={profile.resume_video_url}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        لا يوجد فيديو سيرة ذاتية متاح
                      </Typography>
                      {isOwnProfile && (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          sx={{ mt: 2 }}
                        >
                          تحميل فيديو السيرة الذاتية
                        </Button>
                      )}
                    </Box>
                  )}
                  
                  {profile.experience && profile.experience.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        الخبرات
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      {profile.experience.map((exp, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography variant="subtitle1">
                            {exp.title} - {exp.company}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {exp.start_date} - {exp.end_date || 'حتى الآن'}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {exp.description}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    الوظائف المنشورة
                  </Typography>
                  
                  {profile.jobs && profile.jobs.length > 0 ? (
                    profile.jobs.map(job => (
                      <Card key={job.id} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6">{job.title}</Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            {job.location} • {job.employment_type}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {job.description.substring(0, 150)}...
                          </Typography>
                          <Button size="small" color="primary">
                            عرض التفاصيل
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        لا توجد وظائف منشورة
                      </Typography>
                      {isOwnProfile && (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          sx={{ mt: 2 }}
                        >
                          نشر وظيفة جديدة
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </ProfileContainer>
  );
};

export default Profile;
