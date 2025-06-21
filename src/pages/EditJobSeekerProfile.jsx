import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  IconButton,
  Paper,
  Divider,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  styled,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  VideoCall as VideoCallIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  PlayArrow as PlayArrowIcon,
  Person as PersonIcon,
  Code as CodeIcon,
  Business as BusinessIcon,
  Book as BookIcon,
  Videocam as VideocamIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserSkills, 
  addUserSkill, 
  updateUserSkill, 
  deleteUserSkill,
  getUserExperiences,
  addUserExperience,
  updateUserExperience,
  deleteUserExperience,
  getUserEducation,
  addUserEducation,
  updateUserEducation,
  deleteUserEducation,
  getUserVideos,
  deleteUserVideo,
  uploadProfileImage,
  getSkills
} from '../services/api';
import dayjs from 'dayjs';


// Styled components
const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4)
}));

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.primary.main}`,
  margin: '0 auto',
  position: 'relative',
}));

const AvatarUploadButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  }
}));

const VideoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  }
}));

const VideoCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '56.25%', // 16:9 aspect ratio
  position: 'relative',
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

const EditJobSeekerProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  
  // State for profile data
const [profile, setProfile] = useState({
  first_name: '',
  Second_name: '',
  last_name: '',
  title: '',
  location: '',
  bio: '',
  email: '',
  phone: '',
  mobile: '',
  website: '',
  profile_pic: '',
  address: '',
  preferred_job_title: '',
  social: {
    linkedin_url: '',
    github: '',
    twitter: ''
  }
});
  
  // State for skills
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [avatarPicture, setAvatarPicture] = useState('');
  const [avatarVersion, setAvatarVersion] = useState(0); // Cache busting

  
  // State for experiences
  const [experiences, setExperiences] = useState([]);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [experienceForm, setExperienceForm] = useState({
    company_name: '', 
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    currently_working: false,
    description: ''
  });
  
  // State for education
  const [education, setEducation] = useState([]);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [educationForm, setEducationForm] = useState({
    institution: '',
    degree: '',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  
  // State for videos
  const [videos, setVideos] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [dateError, setDateError] = useState(false);
  const fileInputRef = useRef(null);

  // Add this helper function somewhere in your component (outside the main function)
const verifyImageAvailability = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) reject(new Error('Empty URL'));

    const img = new Image();
    let timer = setTimeout(() => {
      img.onload = img.onerror = null;
      reject(new Error('Image load timeout'));
    }, 5000);

    img.onload = () => {
      clearTimeout(timer);
      if (img.width > 0 && img.height > 0) {
        resolve();
      } else {
        reject(new Error('Zero dimensions'));
      }
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error('Failed to load'));
    };
    img.src = url;
  });
};
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const [profileResponse, skillsResponse, availableSkillsResponse, 
               experiencesResponse, educationResponse, videosResponse] = await Promise.all([
          getUserProfile(),
          getUserSkills(),
          getSkills(),
          getUserExperiences(),
          getUserEducation(),
          getUserVideos()
        ]);
        console.log(profileResponse.data);
        // setProfile(profileResponse.data);
        console.log("Profile::::::",profile);
        setSkills(skillsResponse.data.skills);
        setAvailableSkills(availableSkillsResponse.data.skills);
        setExperiences(experiencesResponse.data.experiences);
        setEducation(educationResponse.data.educations || []);
        setVideos(videosResponse.data.videos);
       
        setAvatarVersion(0);


const initialAvatarUrl = profileResponse.data.profile_pic 
  ? `${VITE_API_BASE_URL}${profileResponse.data.profile_pic}?t=${Date.now()}`
  : '';

// Verify the image exists before setting it
try {
  if (initialAvatarUrl) {
    await verifyImageAvailability(initialAvatarUrl);
  }
  setAvatarPicture(initialAvatarUrl);
} catch (error) {
  console.error('Avatar image not available:', error);
  setAvatarPicture('');
}


setProfile(profileResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setSnackbar({
          open: true,
          message: 'Error loading profile data',
          severity: 'error'
        });
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle profile form change
const handleProfileChange = (e) => {
  const { name, value } = e.target;
  
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    setProfile({
      ...profile,
      [parent]: {
        ...profile[parent],
        [child]: value
      }
    });
  } else {
    setProfile({
      ...profile,
      [name]: value
    });
  }
};

  // Handle profile save
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updateUserProfile(profile);
      console.log(profile);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      
      setSaving(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Error updating profile',
        severity: 'error'
      });
      setSaving(false);
    }
  };
  

  // Handle avatar upload
const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setSaving(true);
    
    // 1. Show instant preview
    const tempPreviewUrl = URL.createObjectURL(file);
    setAvatarPicture(tempPreviewUrl);

    // 2. Upload to server
    const response = await uploadProfileImage(file); 

    // 3. Server returns the FINAL URL (must be immediately accessible)
    const serverUrl = `${VITE_API_BASE_URL}${response.data.path}?t=${Date.now()}`;

    // 4. Verify the image is truly ready (with retries)
    let loaded = false;
    for (let i = 0; i < 3; i++) {
      try {
        await verifyImageAvailability(serverUrl);
        loaded = true;
        break;
      } catch {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
      }
    }

    if (loaded) {
      setProfile(prev => ({ ...prev, profile_pic: response.data.path }));
      setAvatarPicture(serverUrl);
      showSnackbar("Profile picture updated!", "success");
    } else {
      showSnackbar("Uploaded! Refresh to see changes.", "info");
    }

    // Clean up preview
    URL.revokeObjectURL(tempPreviewUrl);

  } catch (error) {
    showSnackbar("Upload failed. Please try again.", "error");
  } finally {
    setSaving(false);
  }
};
  
  // Skill dialog handlers
  const handleOpenSkillDialog = () => {
    setSkillDialogOpen(true);
  };
  
  const handleCloseSkillDialog = () => {
    setSkillDialogOpen(false);
    setSelectedSkill('');
  };
  
  const handleSaveSkill = async () => {
    if (!selectedSkill) return;
    
    try {
      setSaving(true);
      await addUserSkill({ skill_id: selectedSkill });
      
      // Refresh skills
      const response = await getUserSkills();
      setSkills(response.data.skills);
      
      setSnackbar({
        open: true,
        message: 'Skill added successfully',
        severity: 'success'
      });
      
      handleCloseSkillDialog();
      setSaving(false);
    } catch (error) {
      console.error('Error saving skill:', error);
      setSnackbar({
        open: true,
        message: 'Error saving skill',
        severity: 'error'
      });
      setSaving(false);
    }
  };
  
  const handleDeleteSkill = async (skill_id) => {
    try {
      setSaving(true);
      await deleteUserSkill(skill_id);
      
      setSkills(skills.filter(skill => skill.skill_id !== skill_id));
      
      setSnackbar({
        open: true,
        message: 'Skill deleted successfully',
        severity: 'success'
      });
      
      setSaving(false);
    } catch (error) {
      console.error('Error deleting skill:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting skill',
        severity: 'error'
      });
      setSaving(false);
    }
  };
  
  // Experience dialog handlers
  const handleOpenExperienceDialog = (experience = null) => {
    if (experience) {
      setExperienceForm({
        id:experience.id,
        company_name: experience.company_name,
        position: experience.position,
        location: experience.location,
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        currently_working: experience.currently_working || false,
        description: experience.description
      });
    } else {
      setExperienceForm({
        company_name: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        currently_working: false,
        description: ''
      });
    }
    setExperienceDialogOpen(true);
  };
  
  const handleCloseExperienceDialog = () => {
    setExperienceDialogOpen(false);
  };
  
  const handleExperienceFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExperienceForm({
      ...experienceForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSaveExperience = async () => {
    try {
      setSaving(true);
      let edited=false;
      if (experienceForm.id) {
         
        // Update existing experience
        await updateUserExperience(experienceForm.id, experienceForm);
        edited=true;
      } else if(edited!=true) {
        // Add new experience
        await addUserExperience(experienceForm);
      }
      
      // Refresh experiences
      const response = await getUserExperiences();
      setExperiences(response.data.experiences);
      
      setSnackbar({
        open: true,
        message: 'Experience saved successfully',
        severity: 'success'
      });
      
      handleCloseExperienceDialog();
       edited=false;
      setSaving(false);
    } catch (error) {
      console.error('Error saving experience:', error);
      setSnackbar({
        open: true,
        message: 'Error saving experience',
        severity: 'error'
      });
      setSaving(false);
    }
  };
  
  const handleDeleteExperience = async (experienceId) => {
    try {
      setSaving(true);
      await deleteUserExperience(experienceId);
      
      setExperiences(experiences.filter(exp => exp.id !== experienceId));
      
      setSnackbar({
        open: true,
        message: 'Experience deleted successfully',
        severity: 'success'
      });
      
      setSaving(false);
    } catch (error) {
      console.error('Error deleting experience:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting experience',
        severity: 'error'
      });
      setSaving(false);
    }
  };
  
  // Education dialog handlers
  const handleOpenEducationDialog = (education = null) => {
    if (education) {
      setEducationForm({
        id: education.id,
        institution: education.institution,
        degree: education.degree,
        field: education.field,
        location: education.location,
        startDate: education.startDate,
        endDate: education.endDate || '',
        description: education.description
      });
    } else {
      setEducationForm({
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
    setEducationDialogOpen(true);
  };
  
  const handleCloseEducationDialog = () => {
    setEducationDialogOpen(false);
  };
  
  const handleEducationFormChange = (e) => {
    const { name, value } = e.target;
    setEducationForm({
      ...educationForm,
      [name]: value
    });
  };
  
  const handleSaveEducation = async () => {
    try {
      setSaving(true);
      
      if (educationForm.id) {
        // Update existing education
        await updateUserEducation(educationForm.id, educationForm);
      } else {
        // Add new education
        await addUserEducation(educationForm);
      }
      
      // Refresh education
      const response = await getUserEducation();
      setEducation(response.data.educations || []);
      
      setSnackbar({
        open: true,
        message: 'Education saved successfully',
        severity: 'success'
      });
      
      handleCloseEducationDialog();
      setSaving(false);
    } catch (error) {
      console.error('Error saving education:', error);
      setSnackbar({
        open: true,
        message: 'Error saving education',
        severity: 'error'
      });
      setSaving(false);
    }
  };
  
  const handleDeleteEducation = async (educationId) => {
    try {
      setSaving(true);
      await deleteUserEducation(educationId);
      
      setEducation(education.filter(edu => edu.id !== educationId));
      
      setSnackbar({
        open: true,
        message: 'Education deleted successfully',
        severity: 'success'
      });
      
      setSaving(false);
    } catch (error) {
      console.error('Error deleting education:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting education',
        severity: 'error'
      });
      setSaving(false);
    }
  };
  
  // Video handlers
  const handleDeleteVideo = async (videoId) => {
    try {
      setSaving(true);
      await deleteUserVideo(videoId);
      
      setVideos(videos.filter(video => video.id !== videoId));
      
      setSnackbar({
        open: true,
        message: 'Video deleted successfully',
        severity: 'success'
      });
      
      setSaving(false);
    } catch (error) {
      console.error('Error deleting video:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting video',
        severity: 'error'
      });
      setSaving(false);
    }
  };
  
  const handleUploadVideo = () => {
    navigate('/video-upload');
  };
  
  const handleEditVideo = (videoId) => {
    navigate(`/edit-video/${videoId}`);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return dayjs(dateString).format('MMM YYYY');
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ProfileContainer>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Edit My Profile
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveProfile}
            disabled={saving}
            sx={{ borderRadius: '20px', px: 3 }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Profile Avatar Section */}
            <SectionPaper elevation={1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ position: 'relative' }}>
<ProfileAvatar 
  src={avatarPicture}
  alt={`${profile.first_name} ${profile.last_name}`}
  sx={{
    '& .MuiAvatar-img': {
      display: avatarPicture ? 'block' : 'none'
    }
  }}
  imgProps={{
    onError: (e) => {
      e.target.style.display = 'none';
      // Automatically retry after delay
      if (avatarPicture && avatarPicture.startsWith(VITE_API_BASE_URL)) {
        setTimeout(() => {
          setAvatarPicture(`${avatarPicture.split('?')[0]}?retry=${Date.now()}`);
        }, 2000);
      }
    }
  }}
>
  {!avatarPicture && `${profile.first_name?.charAt(0)}${profile.last_name?.charAt(0)}`}
</ProfileAvatar>
                    
                
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarUpload}
                    ref={fileInputRef}
                  />
                  <label htmlFor="avatar-upload">
                    <AvatarUploadButton
                      component="span"
                      size="small"
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </AvatarUploadButton>
                  </label>
                </Box>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {profile.first_name} {profile.last_name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {profile.title}
                </Typography>
              </Box>
            </SectionPaper>
            
            {/* Tabs Navigation */}
            <Paper sx={{ mb: 3, borderRadius: '16px', overflow: 'hidden' }}>
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
                    minHeight: 64,
                    ...(isMobile ? { minWidth: 'auto', px: 1 } : {})
                  }
                }}
              >
                <Tab icon={<PersonIcon />} label="Basic Info" />
                <Tab icon={<CodeIcon />} label="Skills" />
                <Tab icon={<BusinessIcon />} label="Experience" />
                <Tab icon={<BookIcon />} label="Education" />
                <Tab icon={<VideocamIcon />} label="Videos" />
              </Tabs>
              
              {/* Basic Info Tab */}
              <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="First Name"
      name="first_name"
      value={profile.first_name || ''}
      onChange={handleProfileChange}
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PersonIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Second Name"
      name="Second_name"
      value={profile.Second_name || ''}
      onChange={handleProfileChange}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Last Name"
      name="last_name"
      value={profile.last_name || ''}
      onChange={handleProfileChange}
    />
  </Grid>
  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Professional Title"
      name="title"
      value={profile.title || ''}
      onChange={handleProfileChange}
      required
    />
  </Grid>
  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Location"
      name="location"
      value={profile.location || ''}
      onChange={handleProfileChange}
      placeholder="City, Country"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocationIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  </Grid>
  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Bio"
      name="bio"
      value={profile.bio || ''}
      onChange={handleProfileChange}
      multiline
      rows={4}
      placeholder="Tell employers about yourself, your skills, and your experience"
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Email"
      name="email"
      type="email"
      value={profile.email || ''}
      onChange={handleProfileChange}
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <EmailIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Phone"
      name="phone"
      value={profile.phone || ''}
      onChange={handleProfileChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PhoneIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Mobile"
      name="mobile"
      value={profile.mobile || ''}
      onChange={handleProfileChange}
    />
  </Grid>
</Grid>
              </TabPanel>
              
              {/* Skills Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Your Skills
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenSkillDialog}
                    sx={{ borderRadius: '20px' }}
                  >
                    Add Skill
                  </Button>
                </Box>
                
                {skills.length === 0 ? (
                  <Box sx={{ 
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center'
                  }}>
                    <Typography variant="body1" color="textSecondary">
                      No skills added yet. Click "Add Skill" to showcase your expertise.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skills.map((skill) => (
                      <SkillChip
                        key={skill.skill_id}
                        label={skill.name}
                        onDelete={() => handleDeleteSkill(skill.skill_id)}
                        sx={{ borderRadius: '4px' }}
                      />
                    ))}
                  </Box>
                )}
              </TabPanel>
              
              {/* Experience Tab */}
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Work Experience
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenExperienceDialog()}
                    sx={{ borderRadius: '20px' }}
                  >
                    Add Experience
                  </Button>
                </Box>
                
                {experiences.length === 0 ? (
                  <Box sx={{ 
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center'
                  }}>
                    <Typography variant="body1" color="textSecondary">
                      No work experience added yet. Click "Add Experience" to get started.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {experiences.map((exp) => (
                      <Card key={exp.id} sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                {exp.position}
                              </Typography>
                              <Typography variant="subtitle1" color="primary">
                                {exp.company_name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {formatDate(exp.start_date)} - {exp.currently_working ? 'Present' : formatDate(exp.end_date)}
                              </Typography>
                              {exp.location && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                  <LocationIcon fontSize="small" color="action" />
                                  <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                                    {exp.location}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            <Box>
                              <IconButton 
                                onClick={() => handleOpenExperienceDialog(exp)}
                                sx={{ color: 'primary.main' }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDeleteExperience(exp.id)}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                          {exp.description && (
                            <Typography variant="body2" sx={{ mt: 2 }}>
                              {exp.description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </TabPanel>
              
              {/* Education Tab */}
              <TabPanel value={tabValue} index={3}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Education
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenEducationDialog()}
                    sx={{ borderRadius: '20px' }}
                  >
                    Add Education
                  </Button>
                </Box>
                
                {education.length === 0 ? (
                  <Box sx={{ 
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center'
                  }}>
                    <Typography variant="body1" color="textSecondary">
                      No education added yet. Click "Add Education" to get started.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {education.map((edu) => (
                      <Card key={edu.id} sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                {edu.degree}
                              </Typography>
                              <Typography variant="subtitle1" color="primary">
                                {edu.institution}
                              </Typography>
                              {edu.field && (
                                <Typography variant="body2" color="textSecondary">
                                  {edu.field}
                                </Typography>
                              )}
                              <Typography variant="body2" color="textSecondary">
                                {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                              </Typography>
                              {edu.location && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                  <LocationIcon fontSize="small" color="action" />
                                  <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                                    {edu.location}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            <Box>
                              <IconButton 
                                onClick={() => handleOpenEducationDialog(edu)}
                                sx={{ color: 'primary.main' }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDeleteEducation(edu.id)}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                          {edu.description && (
                            <Typography variant="body2" sx={{ mt: 2 }}>
                              {edu.description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </TabPanel>
              
              {/* Videos Tab */}
              <TabPanel value={tabValue} index={4}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Your Videos
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VideoCallIcon />}
                    onClick={handleUploadVideo}
                    sx={{ borderRadius: '20px' }}
                  >
                    Upload Video
                  </Button>
                </Box>
                
                {videos.length === 0 ? (
                  <Box sx={{ 
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center'
                  }}>
                    <Typography variant="body1" color="textSecondary">
                      No videos uploaded yet. Click "Upload Video" to add your first video.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {videos.map((video) => (
                      <Grid item xs={12} sm={6} md={4} key={video.id}>
                        <VideoCard>
                          <VideoCardMedia
                            image={video.thumbnail}
                            title={video.video_title}
                          >
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: '#fff',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                },
                              }}
                            >
                              <PlayArrowIcon fontSize="large" />
                            </IconButton>
                          </VideoCardMedia>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              {video.video_title}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption" color="textSecondary">
                                {video.video_duration} sec
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {video.views} views
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'space-between' }}>
                            <Button
                              size="small"
                              color="primary"
                              startIcon={<EditIcon />}
                              onClick={() => handleEditVideo(video.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteVideo(video.id)}
                            >
                              Delete
                            </Button>
                          </CardActions>
                        </VideoCard>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </TabPanel>
            </Paper>
          </>
        )}
      </Container>
      
      {/* Skill Dialog */}
      <Dialog open={skillDialogOpen} onClose={handleCloseSkillDialog}>
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="skill-select-label">Select Skill</InputLabel>
            <Select
              labelId="skill-select-label"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              label="Select Skill"
            >
              {availableSkills.map((skill) => (
                <MenuItem key={skill.id} value={skill.id}>
                  {skill.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSkillDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSkill} 
            color="primary"
            disabled={!selectedSkill || saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Experience Dialog */}
      <Dialog 
        open={experienceDialogOpen} 
        onClose={handleCloseExperienceDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {experienceForm.id ? 'Edit Experience' : 'Add Experience'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="company_name"
                value={experienceForm.company_name}
                onChange={handleExperienceFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={experienceForm.position}
                onChange={handleExperienceFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={experienceForm.location}
                onChange={handleExperienceFormChange}
                placeholder="City, Country"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="start_date"
                type="date"
                value={experienceForm.start_date}
                onChange={handleExperienceFormChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                name="end_date"
                type="date"
                value={experienceForm.end_date}
                onChange={handleExperienceFormChange}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={experienceForm.currently_working}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={experienceForm.currently_working}
                    onChange={handleExperienceFormChange}
                    name="currently_working"
                    color="primary"
                  />
                }
                label="I currently work here"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={experienceForm.description}
                onChange={handleExperienceFormChange}
                multiline
                rows={4}
                placeholder="Describe your responsibilities and achievements"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExperienceDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveExperience} 
            color="primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Education Dialog */}
      <Dialog 
        open={educationDialogOpen} 
        onClose={handleCloseEducationDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {educationForm.id ? 'Edit Education' : 'Add Education'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Institution"
                name="institution"
                value={educationForm.institution}
                onChange={handleEducationFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Degree"
                name="degree"
                value={educationForm.degree}
                onChange={handleEducationFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Field of Study"
                name="field"
                value={educationForm.field}
                onChange={handleEducationFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={educationForm.location}
                onChange={handleEducationFormChange}
                placeholder="City, Country"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={educationForm.startDate}
                onChange={handleEducationFormChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={educationForm.endDate}
                onChange={handleEducationFormChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={educationForm.description}
                onChange={handleEducationFormChange}
                multiline
                rows={4}
                placeholder="Describe your studies, achievements, and projects"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEducationDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEducation} 
            color="primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ProfileContainer>
  );
};

export default EditJobSeekerProfile;