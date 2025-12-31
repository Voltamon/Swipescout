import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    TextField,
    Avatar,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Card,
    CardContent,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    Autocomplete,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
    FormLabel,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondary
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    PhotoCamera as PhotoCameraIcon,
    Person as PersonIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    Code as CodeIcon,
    VideoCall as VideoCallIcon,
    CheckCircle as CheckCircleIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    LocationOn as LocationOnIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LinkedIn as LinkedInIcon,
    GitHub as GitHubIcon,
    Language as LanguageIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getUserProfile,
    updateUserProfile,
    uploadProfileImage,
    getSkills,
    addUserSkill,
    addUserExperience,
    addUserEducation,
    calculateProfileCompleteness
} from '../services/userService';

const WizardContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: 'calc(100vh - 56px)',
}));

const StepCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
}));

const ProgressCard = styled(Card)(({ theme }) => ({
    position: 'sticky',
    top: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const ProfileSetupWizard = () => {
  // const { user } = useAuth(); // Removed: unused variable
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const [profileData, setProfileData] = useState({
        // Basic Info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        profileImage: null,
        
        // Professional Info
        currentTitle: '',
        experienceLevel: '',
        industry: '',
        expectedSalary: '',
        availability: '',
        
        // Skills
        skills: [],
        
        // Experience
        experiences: [],
        
        // Education
        education: [],
        
        // Social Links
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        
        // Preferences
        jobTypes: [],
        workLocation: '',
        remoteWork: false,
        
        // Video Resume
        hasVideoResume: false
    });
    
    const [availableSkills, setAvailableSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [profileCompleteness, setProfileCompleteness] = useState(0);
    const [experienceDialog, setExperienceDialog] = useState(false);
    const [educationDialog, setEducationDialog] = useState(false);
    const [currentExperience, setCurrentExperience] = useState({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    });
    const [currentEducation, setCurrentEducation] = useState({
        degree: '',
        institution: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: ''
    });

    const steps = [
        {
            label: 'Basic Information',
            description: 'Tell us about yourself',
            icon: <PersonIcon />,
            required: true
        },
        {
            label: 'Professional Details',
            description: 'Your career information',
            icon: <WorkIcon />,
            required: true
        },
        {
            label: 'Skills & Expertise',
            description: 'What are you good at?',
            icon: <CodeIcon />,
            required: true
        },
        {
            label: 'Work Experience',
            description: 'Your professional background',
            icon: <WorkIcon />,
            required: false
        },
        {
            label: 'Education',
            description: 'Your educational background',
            icon: <SchoolIcon />,
            required: false
        },
        {
            label: 'Social & Portfolio',
            description: 'Connect your online presence',
            icon: <LinkedInIcon />,
            required: false
        },
        {
            label: 'Job Preferences',
            description: 'What kind of job are you looking for?',
            icon: <StarIcon />,
            required: true
        },
        {
            label: 'Video Resume',
            description: 'Stand out with a video introduction',
            icon: <VideoCallIcon />,
            required: false
        }
    ];

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        calculateCompleteness();
    }, [profileData]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [profileResponse, skillsResponse] = await Promise.all([
                getUserProfile(),
                getSkills()
            ]);
            
            if (profileResponse.data) {
                setProfileData(prev => ({
                    ...prev,
                    ...profileResponse.data
                }));
            }
            
            setAvailableSkills(skillsResponse.data || []);
        } catch (error) {
            console.error('Error fetching initial data:', error);
            showSnackbar('Error loading profile data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const calculateCompleteness = async () => {
        try {
            const response = await calculateProfileCompleteness(profileData);
            setProfileCompleteness(response.data.completeness || 0);
        } catch (error) {
            console.error('Error calculating completeness:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('image', file);
                
                const response = await uploadProfileImage(formData);
                handleInputChange('profileImage', response.data.imageUrl);
                showSnackbar('Profile image uploaded successfully', 'success');
            } catch (error) {
                console.error('Error uploading image:', error);
                showSnackbar('Error uploading image', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSkillAdd = async (skill) => {
        try {
            await addUserSkill({ skillId: skill.id, level: 'intermediate' });
            setProfileData(prev => ({
                ...prev,
                skills: [...prev.skills, { ...skill, level: 'intermediate' }]
            }));
        } catch (error) {
            console.error('Error adding skill:', error);
            showSnackbar('Error adding skill', 'error');
        }
    };

    const handleSkillRemove = (skillId) => {
        setProfileData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill.id !== skillId)
        }));
    };

    const handleExperienceAdd = async () => {
        try {
            await addUserExperience(currentExperience);
            setProfileData(prev => ({
                ...prev,
                experiences: [...prev.experiences, { ...currentExperience, id: Date.now() }]
            }));
            setExperienceDialog(false);
            setCurrentExperience({
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            });
            showSnackbar('Experience added successfully', 'success');
        } catch (error) {
            console.error('Error adding experience:', error);
            showSnackbar('Error adding experience', 'error');
        }
    };

    const handleEducationAdd = async () => {
        try {
            await addUserEducation(currentEducation);
            setProfileData(prev => ({
                ...prev,
                education: [...prev.education, { ...currentEducation, id: Date.now() }]
            }));
            setEducationDialog(false);
            setCurrentEducation({
                degree: '',
                institution: '',
                field: '',
                startDate: '',
                endDate: '',
                gpa: '',
                description: ''
            });
            showSnackbar('Education added successfully', 'success');
        } catch (error) {
            console.error('Error adding education:', error);
            showSnackbar('Error adding education', 'error');
        }
    };

    const validateStep = (stepIndex) => {
        switch (stepIndex) {
            case 0: // Basic Information
                return profileData.firstName && profileData.lastName && profileData.email && profileData.location;
            case 1: // Professional Details
                return profileData.currentTitle && profileData.experienceLevel && profileData.industry;
            case 2: // Skills
                return profileData.skills.length >= 3;
            case 6: // Job Preferences
                return profileData.jobTypes.length > 0 && profileData.workLocation;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setCompletedSteps(prev => new Set([...prev, activeStep]));
            setActiveStep(prev => prev + 1);
        } else {
            showSnackbar('Please complete all required fields', 'warning');
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleStepClick = (stepIndex) => {
        setActiveStep(stepIndex);
    };

    const handleFinish = async () => {
        try {
            setLoading(true);
            await updateUserProfile(profileData);
            showSnackbar('Profile setup completed successfully!', 'success');
            
            // Redirect based on profile completeness
            if (profileCompleteness >= 60) {
                navigate('/video-resume-upload');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            showSnackbar('Error saving profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const renderStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0: // Basic Information
                return (
                    <StepCard>
                        <Typography variant="h6" gutterBottom>{i18n.t('auto_basic_information')}</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                                <Avatar
                                    src={profileData.profileImage}
                                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                                >
                                    <PersonIcon sx={{ fontSize: 60 }} />
                                </Avatar>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="profile-image-upload"
                                    type="file"
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="profile-image-upload">
                                    <IconButton color="primary" component="span">
                                        <PhotoCameraIcon />
                                    </IconButton>
                                </label>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={i18n.t('auto_first_name_1')} 
                                    value={profileData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={i18n.t('auto_last_name_1')} 
                                    value={profileData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={i18n.t('auto_email_2')} 
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={i18n.t('auto_phone')} 
                                    value={profileData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={i18n.t('auto_location_1')} 
                                    value={profileData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder={i18n.t('auto_city_country')} 
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={i18n.t('auto_bio')} 
                                    multiline
                                    rows={4}
                                    value={profileData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    placeholder={i18n.t('auto_tell_us_about_yourself')} 
                                />
                            </Grid>
                        </Grid>
                    </StepCard>
                );

            case 1: // Professional Details
                return (
                    <StepCard>
                        <Typography variant="h6" gutterBottom>{i18n.t('auto_professional_details')}</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={i18n.t('auto_current_job_title_1')} 
                                    value={profileData.currentTitle}
                                    onChange={(e) => handleInputChange('currentTitle', e.target.value)}
                                    placeholder={i18n.t('auto_e_g_software_developer')} 
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Experience Level *</InputLabel>
                                    <Select
                                        value={profileData.experienceLevel}
                                        onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                                        label={i18n.t('auto_experience_level_1')} 
                                    >
                                        <MenuItem value="entry">{i18n.t('auto_entry_level_0_2_years')}</MenuItem>
                                        <MenuItem value="mid">{i18n.t('auto_mid_level_2_5_years')}</MenuItem>
                                        <MenuItem value="senior">{i18n.t('auto_senior_level_5_10_years')}</MenuItem>
                                        <MenuItem value="lead">Lead/Principal (10+ years)</MenuItem>
                                        <MenuItem value="executive">{i18n.t('auto_executive')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Industry *</InputLabel>
                                    <Select
                                        value={profileData.industry}
                                        onChange={(e) => handleInputChange('industry', e.target.value)}
                                        label={i18n.t('auto_industry')} 
                                    >
                                        <MenuItem value="technology">{i18n.t('auto_technology')}</MenuItem>
                                        <MenuItem value="finance">{i18n.t('auto_finance')}</MenuItem>
                                        <MenuItem value="healthcare">{i18n.t('auto_healthcare')}</MenuItem>
                                        <MenuItem value="education">{i18n.t('auto_education')}</MenuItem>
                                        <MenuItem value="marketing">{i18n.t('auto_marketing')}</MenuItem>
                                        <MenuItem value="sales">{i18n.t('auto_sales')}</MenuItem>
                                        <MenuItem value="design">{i18n.t('auto_design')}</MenuItem>
                                        <MenuItem value="engineering">{i18n.t('auto_engineering')}</MenuItem>
                                        <MenuItem value="other">{i18n.t('auto_other')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={i18n.t('auto_expected_salary_annual')} 
                                    value={profileData.expectedSalary}
                                    onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                                    placeholder={i18n.t('auto_e_g_50_000_70_000')} 
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>{i18n.t('auto_availability')}</InputLabel>
                                    <Select
                                        value={profileData.availability}
                                        onChange={(e) => handleInputChange('availability', e.target.value)}
                                        label={i18n.t('auto_availability')} 
                                    >
                                        <MenuItem value="immediate">{i18n.t('auto_available_immediately')}</MenuItem>
                                        <MenuItem value="2weeks">{i18n.t('auto_2_weeks_notice')}</MenuItem>
                                        <MenuItem value="1month">{i18n.t('auto_1_month_notice')}</MenuItem>
                                        <MenuItem value="2months">{i18n.t('auto_2_months_notice')}</MenuItem>
                                        <MenuItem value="3months">3+ Months</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </StepCard>
                );

            case 2: // Skills
                return (
                    <StepCard>
                        <Typography variant="h6" gutterBottom>
                            Skills & Expertise
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{i18n.t('auto_add_at_least_3_skills_that_represent_you')}</Typography>
                        
                        <Autocomplete
                            options={availableSkills}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, value) => {
                                if (value && !profileData.skills.find(skill => skill.id === value.id)) {
                                    handleSkillAdd(value);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={i18n.t('auto_search_and_add_skills')} 
                                    placeholder={i18n.t('auto_type_to_search_skills')} 
                                />
                            )}
                            sx={{ mb: 3 }}
                        />
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {profileData.skills.map((skill) => (
                                <Chip
                                    key={skill.id}
                                    label={skill.name}
                                    onDelete={() => handleSkillRemove(skill.id)}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                        
                        {profileData.skills.length < 3 && (
                            <Alert severity="info" sx={{ mt: 2 }}>{i18n.t('auto_please_add_at_least_3_skills_to_continue')}</Alert>
                        )}
                    </StepCard>
                );

            case 3: // Experience
                return (
                    <StepCard>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">{i18n.t('auto_work_experience')}</Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => setExperienceDialog(true)}
                            >{i18n.t('auto_add_experience')}</Button>
                        </Box>
                        
                        {profileData.experiences.length === 0 ? (
                            <Alert severity="info">
                                Add your work experience to showcase your professional background
                            </Alert>
                        ) : (
                            <List>
                                {profileData.experiences.map((exp, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <WorkIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${exp.title} at ${exp.company}`}
                                            secondary={`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate} | ${exp.location}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </StepCard>
                );

            case 4: // Education
                return (
                    <StepCard>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">{i18n.t('auto_education')}</Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => setEducationDialog(true)}
                            >{i18n.t('auto_add_education')}</Button>
                        </Box>
                        
                        {profileData.education.length === 0 ? (
                            <Alert severity="info">{i18n.t('auto_add_your_educational_background_to_stren')}</Alert>
                        ) : (
                            <List>
                                {profileData.education.map((edu, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <SchoolIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${edu.degree} in ${edu.field}`}
                                            secondary={`${edu.institution} | ${edu.startDate} - ${edu.endDate}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </StepCard>
                );

            case 5: // Social & Portfolio
                return (
                    <StepCard>
                        <Typography variant="h6" gutterBottom>
                            Social & Portfolio Links
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{i18n.t('auto_connect_your_professional_online_presenc')}</Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={i18n.t('auto_linkedin_profile')} 
                                    value={profileData.linkedinUrl}
                                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                                    placeholder={i18n.t('auto_https_linkedin_com_in_yourprofile')} 
                                    InputProps={{
                                        startAdornment: <LinkedInIcon sx={{ mr: 1, color: 'action.active' }} />
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={i18n.t('auto_github_profile')} 
                                    value={profileData.githubUrl}
                                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                                    placeholder={i18n.t('auto_https_github_com_yourusername')} 
                                    InputProps={{
                                        startAdornment: <GitHubIcon sx={{ mr: 1, color: 'action.active' }} />
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={i18n.t('auto_portfolio_website')} 
                                    value={profileData.portfolioUrl}
                                    onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                                    placeholder={i18n.t('auto_https_yourportfolio_com')} 
                                />
                            </Grid>
                        </Grid>
                    </StepCard>
                );

            case 6: // Job Preferences
                return (
                    <StepCard>
                        <Typography variant="h6" gutterBottom>{i18n.t('auto_job_preferences')}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{i18n.t('auto_help_us_match_you_with_the_right_opportu')}</Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Preferred Job Types *</InputLabel>
                                    <Select
                                        multiple
                                        value={profileData.jobTypes}
                                        onChange={(e) => handleInputChange('jobTypes', e.target.value)}
                                        label={i18n.t('auto_preferred_job_types')} 
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} size="small" />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        <MenuItem value="full-time">{i18n.t('auto_full_time_1')}</MenuItem>
                                        <MenuItem value="part-time">{i18n.t('auto_part_time_1')}</MenuItem>
                                        <MenuItem value="contract">{i18n.t('auto_contract')}</MenuItem>
                                        <MenuItem value="freelance">{i18n.t('auto_freelance')}</MenuItem>
                                        <MenuItem value="internship">{i18n.t('auto_internship')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Work Location *</InputLabel>
                                    <Select
                                        value={profileData.workLocation}
                                        onChange={(e) => handleInputChange('workLocation', e.target.value)}
                                        label={i18n.t('auto_work_location')} 
                                    >
                                        <MenuItem value="onsite">{i18n.t('auto_on_site')}</MenuItem>
                                        <MenuItem value="remote">{i18n.t('auto_remote')}</MenuItem>
                                        <MenuItem value="hybrid">{i18n.t('auto_hybrid')}</MenuItem>
                                        <MenuItem value="flexible">{i18n.t('auto_flexible')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={profileData.remoteWork}
                                            onChange={(e) => handleInputChange('remoteWork', e.target.checked)}
                                        />
                                    }
                                    label={i18n.t('auto_open_to_remote_work')} 
                                />
                            </Grid>
                        </Grid>
                    </StepCard>
                );

            case 7: // Video Resume
                return (
                    <StepCard>
                        <Typography variant="h6" gutterBottom>{i18n.t('auto_video_resume')}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Stand out with a video introduction (optional but recommended)
                        </Typography>
                        
                        {profileData.hasVideoResume ? (
                            <Alert severity="success" sx={{ mb: 2 }}>{i18n.t('auto_you_already_have_a_video_resume_uploaded')}</Alert>
                        ) : (
                            <Card sx={{ textAlign: 'center', p: 4 }}>
                                <VideoCallIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>{i18n.t('auto_upload_your_video_resume')}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    A 60-90 second video introducing yourself can significantly increase your chances of getting noticed by employers.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/video-resume-upload')}
                                    disabled={profileCompleteness < 60}
                                >{i18n.t('auto_upload_video_resume')}</Button>
                                {profileCompleteness < 60 && (
                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                        Complete at least 60% of your profile to upload a video resume
                                    </Typography>
                                )}
                            </Card>
                        )}
                    </StepCard>
                );

            default:
                return null;
        }
    };

    return (
        <WizardContainer maxWidth="lg">
            <Grid container spacing={3}>
                {/* Progress Sidebar */}
                <Grid item xs={12} md={4}>
                    <ProgressCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>{i18n.t('auto_profile_completion')}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={profileCompleteness}
                                    sx={{ flex: 1, mr: 2 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {profileCompleteness}%
                                </Typography>
                            </Box>
                            
                            <Stepper activeStep={activeStep} orientation="vertical">
                                {steps.map((step, index) => (
                                    <Step key={step.label} completed={completedSteps.has(index)}>
                                        <StepLabel
                                            onClick={() => handleStepClick(index)}
                                            sx={{ cursor: 'pointer' }}
                                            icon={
                                                completedSteps.has(index) ? (
                                                    <CheckCircleIcon color="success" />
                                                ) : (
                                                    step.icon
                                                )
                                            }
                                        >
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {step.label}
                                                    {step.required && <span style={{ color: 'red' }}> *</span>}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {step.description}
                                                </Typography>
                                            </Box>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </CardContent>
                    </ProgressCard>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" gutterBottom>{i18n.t('auto_complete_your_profile_1')}</Typography>
                        <Typography variant="body1" color="text.secondary">
                            Let's set up your profile to help you find the perfect job opportunities
                        </Typography>
                    </Box>

                    {renderStepContent(activeStep)}

                    {/* Navigation Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                            onClick={handleBack}
                            disabled={activeStep === 0}
                            variant="outlined"
                        >{i18n.t('auto_back')}</Button>
                        
                        <Box>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    onClick={handleFinish}
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Complete Setup'}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    variant="contained"
                                    disabled={!validateStep(activeStep)}
                                >{i18n.t('auto_next')}</Button>
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Experience Dialog */}
            <Dialog
                open={experienceDialog}
                onClose={() => setExperienceDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>{i18n.t('auto_add_work_experience')}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_job_title')} 
                                value={currentExperience.title}
                                onChange={(e) => setCurrentExperience(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_company')} 
                                value={currentExperience.company}
                                onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_location')} 
                                value={currentExperience.location}
                                onChange={(e) => setCurrentExperience(prev => ({ ...prev, location: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_start_date')} 
                                type="month"
                                value={currentExperience.startDate}
                                onChange={(e) => setCurrentExperience(prev => ({ ...prev, startDate: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_end_date')} 
                                type="month"
                                value={currentExperience.endDate}
                                onChange={(e) => setCurrentExperience(prev => ({ ...prev, endDate: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                                disabled={currentExperience.current}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={currentExperience.current}
                                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, current: e.target.checked }))}
                                    />
                                }
                                label={i18n.t('auto_i_currently_work_here')} 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_description')} 
                                multiline
                                rows={4}
                                value={currentExperience.description}
                                onChange={(e) => setCurrentExperience(prev => ({ ...prev, description: e.target.value }))}
                                placeholder={i18n.t('auto_describe_your_role_and_achievements')} 
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExperienceDialog(false)}>{i18n.t('auto_cancel')}</Button>
                    <Button onClick={handleExperienceAdd} variant="contained">{i18n.t('auto_add_experience')}</Button>
                </DialogActions>
            </Dialog>

            {/* Education Dialog */}
            <Dialog
                open={educationDialog}
                onClose={() => setEducationDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>{i18n.t('auto_add_education')}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_degree')} 
                                value={currentEducation.degree}
                                onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
                                placeholder={i18n.t('auto_e_g_bachelor_s_master_s')} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_field_of_study')} 
                                value={currentEducation.field}
                                onChange={(e) => setCurrentEducation(prev => ({ ...prev, field: e.target.value }))}
                                placeholder={i18n.t('auto_e_g_computer_science')} 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_institution')} 
                                value={currentEducation.institution}
                                onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_start_date')} 
                                type="month"
                                value={currentEducation.startDate}
                                onChange={(e) => setCurrentEducation(prev => ({ ...prev, startDate: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_end_date')} 
                                type="month"
                                value={currentEducation.endDate}
                                onChange={(e) => setCurrentEducation(prev => ({ ...prev, endDate: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_gpa_optional')} 
                                value={currentEducation.gpa}
                                onChange={(e) => setCurrentEducation(prev => ({ ...prev, gpa: e.target.value }))}
                                placeholder={i18n.t('auto_e_g_3_8_4_0')} 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={i18n.t('auto_description')} 
                                multiline
                                rows={3}
                                value={currentEducation.description}
                                onChange={(e) => setCurrentEducation(prev => ({ ...prev, description: e.target.value }))}
                                placeholder={i18n.t('auto_relevant_coursework_achievements_etc')} 
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEducationDialog(false)}>{i18n.t('auto_cancel')}</Button>
                    <Button onClick={handleEducationAdd} variant="contained">{i18n.t('auto_add_education')}</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
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
        </WizardContainer>
    );
};

export default ProfileSetupWizard;

