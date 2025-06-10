import React, { useState, useEffect } from 'react';
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
  useMediaQuery
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
  PlayArrow as PlayArrowIcon
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
// import { getUserSkills } from '../services/api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


// Styled components
const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4)
}));

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
  const [profile, setProfile] = useState(null);
  
  // State for skills
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  
  // State for experiences
  const [experiences, setExperiences] = useState([]);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [experienceForm, setExperienceForm] = useState({
    company_name: '', 
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    currently_working: false,
    description: ''});
  
  // State for education
  const [education, setEducation] = useState([]);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
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
  
  // State for UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [dateError, setDateError] = useState(false);
  const [expDateError, setExpDateError] = useState(false);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const profileResponse = await getUserProfile();
        setProfile(profileResponse.data);
        console.log('Profile data::::::::::::::::::');
        console.log(profileResponse.data);
        
        // Fetch skills
        const skillsResponse = await getUserSkills();
        setSkills(skillsResponse.data.skills);
        
        // Fetch available skills
        const availableSkillsResponse = await getSkills();
        setAvailableSkills(availableSkillsResponse.data.skills);
         
        // Fetch experiences
        const experiencesResponse = await getUserExperiences();
        setExperiences(experiencesResponse.data.experiences);
        
        // Fetch education
        const educationResponse = await getUserEducation();
        setEducation(educationResponse.data.educations|| []);
        
        // Fetch videos
        const videosResponse = await getUserVideos();
        setVideos(videosResponse.data.videos);
        
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
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setSnackbar({
        open: true,
        message: 'Please select a valid image file',
        severity: 'error'
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await uploadProfileImage(formData);
      
      setProfile({
        ...profile,
        avatar: response.data.avatar_url
      });
      
      setSnackbar({
        open: true,
        message: 'Profile picture updated successfully',
        severity: 'success'
      });
      
      setSaving(false);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setSnackbar({
        open: true,
        message: 'Error uploading profile picture',
        severity: 'error'
      });
      setSaving(false);
    }
  };
  
  // Handle skill dialog open
  const handleOpenSkillDialog = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setNewSkill(skill);
    } else {
      setEditingSkill(null);
      setNewSkill('');
    }
    setSkillDialogOpen(true);
  };
  
  // Handle skill dialog close
  const handleCloseSkillDialog = () => {
    setSkillDialogOpen(false);
    setEditingSkill(null);
    setNewSkill('');
  };
  
  // Handle skill save
  const handleSaveSkill = async () => {
    if (!newSkill) return;
    
    try {
      setSaving(true);
      
      if (editingSkill) {
        // Update existing skill
        await updateUserSkill(editingSkill.id, newSkill);
        
        setSkills(skills.map(skill => 
          skill === editingSkill ? newSkill : skill
        ));
      } else {
        // Add new skill
        await addUserSkill({skill_id:newSkill});
        console.log('New skill:::::::::', newSkill);
        setSkills([...skills, newSkill]);
      }
      
      setSnackbar({
        open: true,
        message: editingSkill ? 'Skill updated successfully' : 'Skill added successfully',
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
  
  // Handle skill delete
  const handleDeleteSkill = async (skill) => {
    try {
      setSaving(true);
      console.log('Deleting skill:::::::::', skill.skill_id);
      await deleteUserSkill(skill.skill_id);
      
      setSkills(skills.filter(s => s !== skill));
      
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
  
  // Handle experience dialog open
  const handleOpenExperienceDialog = (experience = null) => {
    if (experience) {
      setEditingExperience(experience);
      setExperienceForm({
        company_name: experience.company_name,
        position: experience.position,
        location: experience.location,
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        currently_working: experience.currently_working || false,
        description: experience.description
      });
    } else {
      setEditingExperience(null);
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
  
  // Handle experience dialog close
  const handleCloseExperienceDialog = () => {
    setExperienceDialogOpen(false);
    setEditingExperience(null);
    setExperienceForm({
      company_name: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      currently_working: false,
      description: ''
    });
  };
  
  // Handle experience form change
  const handleExperienceFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if ((name === 'start_date' || name === 'end_date') && value!=='') {
    checkExpDate(value); 
    }
    setExperienceForm({
      ...experienceForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle experience save
  const handleSaveExperience = async () => {
    // Validate form
    if (!experienceForm.company_name || !experienceForm.position || !experienceForm.start_date) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    try {
      setSaving(true);
      
      if (editingExperience) {
        // Update existing experience
        const updatedExperience = {
          ...editingExperience,
          ...experienceForm
        };
        
        await updateUserExperience(editingExperience.id, updatedExperience);
        
        setExperiences(experiences.map(exp => 
          exp.id === editingExperience.id ? updatedExperience : exp
        ));
      } else {
        // Add new experience
        const response = await addUserExperience(experienceForm);
        
        setExperiences([...experiences, response.data.experience]);
      }
      
      setSnackbar({
        open: true,
        message: editingExperience ? 'Experience updated successfully' : 'Experience added successfully',
        severity: 'success'
      });
      
      handleCloseExperienceDialog();
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
  
  // Handle experience delete
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
  
  function checkSafeDate(input) {
  const format = 'dd/M/YYYY';

const parsedDate = new Date(input);
if(isNaN(parsedDate) && !dateError) 
  {
  setDateError(true);
  return null;
  }
  else {
    setDateError(false);
  return new Date(input);//parsedDate.toDate();
  }
  }
   
  function checkExpDate(input) {
  const format = 'dd/M/YYYY';

const parsedDate = new Date(input);
if(isNaN(parsedDate) && !dateError) 
  {
  setExpDateError(true);
  return false;
  }
  else {
    setExpDateError(false);
  return new Date(input);//parsedDate.toDate();
  }
// const dbDate = parsed.isValid() ? parsed.format("YYYY-MM-DD") : null;

}

  // Handle education dialog open
  const handleOpenEducationDialog = (education = null) => {
    if (education) {
      setEditingEducation(education);
      setEducationForm({
        institution: education.institution,
        degree: education.degree,
        field: education.field,
        location: education.location,
        startDate: education.startDate ? dayjs(education.startDate, ['DD-MM-YYYY', 'YYYY-MM', 'YYYY-MM-DD']).format('YYYY-MM-DD') : '',
        endDate: education.endDate ? dayjs(education.endDate, ['DD-MM-YYYY', 'YYYY-MM', 'YYYY-MM-DD']).format('YYYY-MM-DD') : '',
        description: education.description
      });
    } else {
      setEditingEducation(null);
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
  

// const startDate = parseSafeDate(education.startDate);

  // Handle education dialog close
  const handleCloseEducationDialog = () => {
    setEducationDialogOpen(false);
    setEditingEducation(null);
    setEducationForm({
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };
  
  // Handle education form change
  const handleEducationFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate' || name === 'endDate') {
checkSafeDate(value);
    }
    setEducationForm({
      ...educationForm,
      [name]: value
    });
  };
  
  // Handle education save
  const handleSaveEducation = async () => {
    // Validate form
    if (!educationForm.institution || !educationForm.degree || !educationForm.startDate ) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
    }
      else if (dateError) {
        setSnackbar({
          open: true,
          message: 'Please enter a valid date in MM/YYYY format',
          severity: 'error'
        });
      
      return;
    }
    
    try {
      setSaving(true);
      
      if (editingEducation) {
        // Update existing education
        const updatedEducation = {
          ...editingEducation,
          ...educationForm
        };
        
        await updateUserEducation(editingEducation.id, updatedEducation);
        
        setEducation(education.map(edu => 
          edu.id === editingEducation.id ? updatedEducation : edu
        ));
      } else {
        // Add new education
        const response = await addUserEducation(educationForm);
        
        setEducation([...education, response.data.education]);
      }
      
      setSnackbar({
        open: true,
        message: editingEducation ? 'Education updated successfully' : 'Education added successfully',
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
  
  // Handle education delete
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
  
  // Handle video delete
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
  
  // Navigate to upload video page
  const handleUploadVideo = () => {
    navigate('/job-seeker/upload-video');
  };
  
  // Format date (YYYY-MM to input format)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // If it's already in YYYY-MM format, return as is
    if (/^\d{4}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Otherwise, try to parse and format
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    } catch (error) {
      return '';
    }
  };
  
  // Mock data for demonstration
  const mockProfile = {
    id: '1',
    name: 'John Smith',
    title: 'Frontend Developer',
    location: 'New York, USA',
    bio: 'Frontend developer with 5 years of experience in developing web applications using React and Angular. Specialized in UI design and user experience.',
    email: 'john@example.com',
    phone: '+1 123 456 7890',
    website: 'www.johnsmith.dev',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    social: {
      linkedin: 'linkedin.com/in/johnsmith',
      github: 'github.com/johnsmith',
      twitter: 'twitter.com/johnsmith'
    }
  };
  
  const mockSkills = [
    'React', 'Angular', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 
    'Material UI', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Git'
  ];
  
  const mockExperiences = [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      position: 'Senior Frontend Developer',
      startDate: '2020-01',
      endDate: null,
      current: true,
      description: 'Developing web applications using React and TypeScript. Designing and implementing application architecture and state management using Redux. Working with a team of developers to improve application performance and user experience.',
      location: 'New York'
    },
    {
      id: '2',
      company: 'Global Software Ltd.',
      position: 'Frontend Developer',
      startDate: '2018-03',
      endDate: '2019-12',
      current: false,
      description: 'Developed web applications using Angular. Implemented user interface designs and improved user experience. Worked with a team of developers to develop interactive web applications.',
      location: 'Boston'
    },
    {
      id: '3',
      company: 'Digital Solutions',
      position: 'Web Developer',
      startDate: '2016-06',
      endDate: '2018-02',
      current: false,
      description: 'Developed websites using HTML, CSS, and JavaScript. Implemented user interface designs and improved user experience. Worked with a team of developers to develop interactive websites.',
      location: 'Chicago'
    }
  ];
  
  const mockEducation = [
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2012-09',
      endDate: '2016-05',
      description: 'Specialized in software development and software engineering. Final project: Development of a web application for project management.',
      location: 'New York'
    },
    {
      id: '2',
      institution: 'Coding Academy',
      degree: 'Advanced Web Development Certificate',
      field: 'Web Development',
      startDate: '2016-06',
      endDate: '2016-08',
      description: 'Intensive course in web development using the latest technologies.',
      location: 'New York'
    }
  ];
  
  const mockVideos = [
    {
      id: '1',
      title: 'Introduction About Me',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 30,
      type: 'intro',
      views: 120
    },
    {
      id: '2',
      title: 'My React Skills',
      thumbnail: 'https://i.ytimg.com/vi/LDZX4ooRsWs/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 45,
      type: 'skills',
      views: 85
    },
    {
      id: '3',
      title: 'My Previous Experience',
      thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 40,
      type: 'experience',
      views: 67
    }
  ];
  
  // Use mock data if real data is not available
  const userData = profile  ? profile : mockProfile;
  const userSkills = skills.length > 0 ? skills : mockSkills;
  const userExperiences = experiences.length > 0 ? experiences : mockExperiences;
  const userEducation = education.length > 0 ? education : mockEducation;
  const userVideos = videos.length > 0 ? videos : mockVideos;
  
  return (
    <ProfileContainer>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Edit Profile
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveProfile}
            disabled={saving}
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
            {/* Profile Avatar */}
            <SectionPaper elevation={1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ position: 'relative' }}>
                  <ProfileAvatar src={userData.profile_pic} alt={userData.first_name||' ' +" "+userData.Second_name+" "+userData.last_name+"'s Avatar"}>
                    {userData.first_name?.charAt(0)}
                  </ProfileAvatar>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarUpload}
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
                <Typography variant="h6" sx={{ mt: 2 }}>
                {(userData.first_name ||" ") + " "+(userData.Second_name ||" ") + " "+ (userData.last_name ||" ")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {userData.title}
                </Typography>
              </Box>
            </SectionPaper>
            
            {/* Tabs Navigation */}
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
                <Tab label="Basic Info" />
                <Tab label="Skills" />
                <Tab label="Experience" />
                <Tab label="Education" />
                <Tab label="Videos" />
              </Tabs>
              
              {/* Basic Info Tab */}
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={(userData.first_name ||" ") + " "+(userData.Second_name ||" ") + " "+ (userData.last_name ||" ")}
                      onChange={handleProfileChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Professional Title"
                      name="title"
                      value={userData.title}
                      onChange={handleProfileChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={userData.location}
                      onChange={handleProfileChange}
                      placeholder="City, Country"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={userData.bio}
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
                      value={userData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={userData.phone}
                      onChange={handleProfileChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Website"
                      name="website"
                      value={userData.website}
                      onChange={handleProfileChange}
                      placeholder="www.example.com"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Social Media
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="LinkedIn"
                          name="social.linkedin"
                          value={userData.social?.linkedin || ''}
                          onChange={handleProfileChange}
                          placeholder="linkedin.com/in/username"
                          InputProps={{
                            startAdornment: <LinkedInIcon color="primary" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="GitHub"
                          name="social.github"
                          value={userData.social?.github || ''}
                          onChange={handleProfileChange}
                          placeholder="github.com/username"
                          InputProps={{
                            startAdornment: <GitHubIcon color="primary" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Twitter"
                          name="social.twitter"
                          value={userData.social?.twitter || ''}
                          onChange={handleProfileChange}
                          placeholder="twitter.com/username"
                          InputProps={{
                            startAdornment: <TwitterIcon color="primary" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </TabPanel>
              
              {/* Skills Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Your Skills
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenSkillDialog()}
                  >
                    Add Skill
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
                  {userSkills.map((skill, index) => (
                    <SkillChip
                      key={index}
                      label={skill.name}
                      onDelete={() => handleDeleteSkill(skill)}
                      onClick={() => handleOpenSkillDialog(skill)}
                    />
                  ))}
                  {userSkills.length === 0 && (
                    <Typography variant="body2" color="textSecondary">
                      No skills added yet. Click "Add Skill" to add your first skill.
                    </Typography>
                  )}
                </Box>
                
                <Typography variant="body2" color="textSecondary">
                  Add skills that showcase your expertise. These will help employers find you for relevant job opportunities.
                </Typography>
              </TabPanel>
              
              {/* Experience Tab */}
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Work Experience
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenExperienceDialog()}
                  >
                    Add Experience
                  </Button>
                </Box>
                
                {userExperiences.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    No work experience added yet. Click "Add Experience" to add your first work experience.
                  </Typography>
                ) : (
                  userExperiences.map((exp) => (
                    <Card key={exp.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="h6" component="h3">
                              {exp.position}
                            </Typography>
                            <Typography variant="subtitle1" color="primary">
                              {exp.company_name}
                            </Typography>
                          </Box>
                          <Box>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenExperienceDialog(exp)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteExperience(exp.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                            {exp.location}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {formatDateForInput(exp.start_date)} - {exp.currently_working ? 'Present' : formatDateForInput(exp.end_date)}
                        </Typography>
                        <Typography variant="body2">
                          {exp.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabPanel>
              
              {/* Education Tab */}
              <TabPanel value={tabValue} index={3}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Education
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenEducationDialog()}
                  >
                    Add Education
                  </Button>
                </Box>
                
                {userEducation.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    No education added yet. Click "Add Education" to add your first education.
                  </Typography>
                ) : (
                  userEducation.map((edu) => (
                    <Card key={edu.id} sx={{ mb: 2 }}>
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
                          <Box>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenEducationDialog(edu)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteEducation(edu.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                            {edu.location}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {formatDateForInput(edu.startDate)} - {formatDateForInput(edu.endDate)}
                        </Typography>
                        <Typography variant="body2">
                          {edu.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabPanel>
              
              {/* Videos Tab */}
              <TabPanel value={tabValue} index={4}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Your Videos
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VideoCallIcon />}
                    onClick={handleUploadVideo}
                  >
                    Upload New Video
                  </Button>
                </Box>
                
                {userVideos.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    No videos uploaded yet. Click "Upload New Video" to add your first video resume.
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    {userVideos.map((video) => (
                      <Grid item xs={12} sm={6} md={4} key={video.id}>
                        <VideoCard>
                          <VideoCardMedia
                            image={video.thumbnail}
                            title={video.title}
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
                            <Typography variant="subtitle1" component="h3" gutterBottom>
                              {video.title}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="textSecondary">
                                {video.duration} seconds
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {video.views} views
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              color="primary"
                              startIcon={<EditIcon />}
                              onClick={() => navigate(`/profile/edit-video/${video.id}`)}
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
        <DialogTitle>
          {editingSkill ? 'Edit Skill' : 'Add Skill'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="skill-select-label">Skill</InputLabel>
            <Select
              labelId="skill-select-label"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              label="Skill"
            >
              {availableSkills.map((skill) => (
                <MenuItem key={skill.id} value={skill.name}>
                  {skill.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Select a skill from the list or type a new one
            </FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSkillDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSkill} 
            color="primary"
            disabled={!newSkill || saving}
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
        maxWidth="md"
      >
        <DialogTitle>
          {editingExperience ? 'Edit Experience' : 'Add Experience'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                name="company_name"
                value={experienceForm.company_name}
                onChange={handleExperienceFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={experienceForm.position}
                onChange={handleExperienceFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
              <FormControl fullWidth>
                <InputLabel id="current-job-label">Current Job</InputLabel>
                <Select
                  labelId="current-job-label"
                  name="currently_working"
                  value={experienceForm.currently_working}
                  onChange={handleExperienceFormChange}
                  label="Current Job"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="start_date"
                type="month"
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
                type="month"
                value={experienceForm.end_date}
                onChange={handleExperienceFormChange}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={experienceForm.currently_working}
                required={!experienceForm.currently_working}
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
            <Typography fontWeight={600} color="error" sx={{ mt: 1 }}>
                { expDateError ? "Date most be in format dd-mm-yyyy" : ""}
              </Typography>
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
        maxWidth="md"
      >
        <DialogTitle>
          {editingEducation ? 'Edit Education' : 'Add Education'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Institution"
                name="institution"
                value={educationForm.institution}
                onChange={handleEducationFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Degree"
                name="degree"
                value={educationForm.degree}
                onChange={handleEducationFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Field of Study"
                name="field"
                value={educationForm.field}
                onChange={handleEducationFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                type="month"
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
                type="month"
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
              
            </Grid><Typography fontWeight={600} color="error" sx={{ mt: 1 }}>
                { dateError ? "Date most be in format dd-mm-yyyy" : ""}
              </Typography>
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
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ProfileContainer>
  );
};

export default EditJobSeekerProfile;
