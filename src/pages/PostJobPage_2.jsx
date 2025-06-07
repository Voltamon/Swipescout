import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Divider,
  InputAdornment,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert,
  styled,
  useTheme
} from '@mui/material';
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  VideoCall as VideoCallIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  postJob, 
  updateJob, 
  getJobCategories, 
  getSkills 
} from '../services/jobService';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4)
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
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

const PostJobPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State for job form
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    type: 'full-time',
    remote: false,
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    salaryPeriod: 'yearly',
    categories: [],
    skills: [],
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    applicationDeadline: '',
    videoRequired: false
  });
  
  // State for available options
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  
  // State for UI
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Fetch categories and skills
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await getJobCategories();
        setAvailableCategories(categoriesResponse.data.categories);
        
        // Fetch skills
        const skillsResponse = await getSkills();
        setAvailableSkills(skillsResponse.data.skills);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbar({
          open: true,
          message: 'Error loading categories and skills',
          severity: 'error'
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle form change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobForm({
      ...jobForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle category change
  const handleCategoryChange = (event, newValue) => {
    setJobForm({
      ...jobForm,
      categories: newValue
    });
  };
  
  // Handle skill change
  const handleSkillChange = (event, newValue) => {
    setJobForm({
      ...jobForm,
      skills: newValue
    });
  };
  
  // Handle list item change (requirements, responsibilities, benefits)
  const handleListItemChange = (type, index, value) => {
    const updatedList = [...jobForm[type]];
    updatedList[index] = value;
    setJobForm({
      ...jobForm,
      [type]: updatedList
    });
  };
  
  // Add list item
  const addListItem = (type) => {
    setJobForm({
      ...jobForm,
      [type]: [...jobForm[type], '']
    });
  };
  
  // Remove list item
  const removeListItem = (type, index) => {
    const updatedList = [...jobForm[type]];
    updatedList.splice(index, 1);
    setJobForm({
      ...jobForm,
      [type]: updatedList
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!jobForm.title || !jobForm.description || !jobForm.location) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    // Filter out empty list items
    const filteredForm = {
      ...jobForm,
      requirements: jobForm.requirements.filter(item => item.trim() !== ''),
      responsibilities: jobForm.responsibilities.filter(item => item.trim() !== ''),
      benefits: jobForm.benefits.filter(item => item.trim() !== '')
    };
    
    try {
      setSaving(true);
      
      // Post job
      await postJob(filteredForm);
      
      setSnackbar({
        open: true,
        message: 'Job posted successfully',
        severity: 'success'
      });
      
      // Navigate to jobs page after successful submission
      setTimeout(() => {
        navigate('/employer/jobs');
      }, 2000);
      
      setSaving(false);
    } catch (error) {
      console.error('Error posting job:', error);
      setSnackbar({
        open: true,
        message: 'Error posting job',
        severity: 'error'
      });
      setSaving(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate(-1);
  };
  
  // Mock data for demonstration
  const mockCategories = [
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
  
  const mockSkills = [
    'JavaScript',
    'React',
    'Angular',
    'Vue.js',
    'Node.js',
    'Express',
    'Python',
    'Django',
    'Flask',
    'Java',
    'Spring Boot',
    'C#',
    '.NET',
    'PHP',
    'Laravel',
    'Ruby',
    'Ruby on Rails',
    'Swift',
    'Kotlin',
    'Flutter',
    'React Native',
    'HTML',
    'CSS',
    'SASS',
    'Bootstrap',
    'Material UI',
    'Tailwind CSS',
    'SQL',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'Redis',
    'AWS',
    'Azure',
    'Google Cloud',
    'Docker',
    'Kubernetes',
    'Jenkins',
    'Git',
    'GitHub',
    'GitLab',
    'Jira',
    'Confluence',
    'Figma',
    'Adobe XD',
    'Sketch'
  ];
  
  // Use mock data if real data is not available
  const categories = availableCategories.length > 0 ? availableCategories : mockCategories;
  const skills = availableSkills.length > 0 ? availableSkills : mockSkills;
  
  return (
    <PageContainer>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Post a New Job
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Posting...' : 'Post Job'}
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <FormPaper elevation={1}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    name="title"
                    value={jobForm.title}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={jobForm.location}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g., San Francisco, CA"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="job-type-label">Job Type</InputLabel>
                    <Select
                      labelId="job-type-label"
                      name="type"
                      value={jobForm.type}
                      onChange={handleFormChange}
                      label="Job Type"
                    >
                      <MenuItem value="full-time">Full-time</MenuItem>
                      <MenuItem value="part-time">Part-time</MenuItem>
                      <MenuItem value="contract">Contract</MenuItem>
                      <MenuItem value="internship">Internship</MenuItem>
                      <MenuItem value="temporary">Temporary</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={jobForm.remote}
                        onChange={handleFormChange}
                        name="remote"
                        color="primary"
                      />
                    }
                    label="Remote position"
                  />
                </Grid>
              </Grid>
            </FormPaper>
            
            {/* Categories and Skills */}
            <FormPaper elevation={1}>
              <Typography variant="h6" gutterBottom>
                Categories and Skills
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="categories"
                    options={categories}
                    value={jobForm.categories}
                    onChange={handleCategoryChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Categories"
                        placeholder="Select categories"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <CategoryIcon />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <CategoryChip
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                  />
                  <FormHelperText>
                    Select categories that best describe this job
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="skills"
                    options={skills}
                    value={jobForm.skills}
                    onChange={handleSkillChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Required Skills"
                        placeholder="Select skills"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <SkillChip
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                  />
                  <FormHelperText>
                    Select skills required for this position
                  </FormHelperText>
                </Grid>
              </Grid>
            </FormPaper>
            
            {/* Salary Information */}
            <FormPaper elevation={1}>
              <Typography variant="h6" gutterBottom>
                Salary Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Minimum Salary"
                    name="salaryMin"
                    type="number"
                    value={jobForm.salaryMin}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Maximum Salary"
                    name="salaryMax"
                    type="number"
                    value={jobForm.salaryMax}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="salary-currency-label">Currency</InputLabel>
                    <Select
                      labelId="salary-currency-label"
                      name="salaryCurrency"
                      value={jobForm.salaryCurrency}
                      onChange={handleFormChange}
                      label="Currency"
                    >
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                      <MenuItem value="GBP">GBP (£)</MenuItem>
                      <MenuItem value="CAD">CAD (C$)</MenuItem>
                      <MenuItem value="AUD">AUD (A$)</MenuItem>
                      <MenuItem value="JPY">JPY (¥)</MenuItem>
                      <MenuItem value="INR">INR (₹)</MenuItem>
                      <MenuItem value="SAR">SAR (﷼)</MenuItem>
                      <MenuItem value="AED">AED (د.إ)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="salary-period-label">Period</InputLabel>
                    <Select
                      labelId="salary-period-label"
                      name="salaryPeriod"
                      value={jobForm.salaryPeriod}
                      onChange={handleFormChange}
                      label="Period"
                    >
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormPaper>
            
            {/* Job Description */}
            <FormPaper elevation={1}>
              <Typography variant="h6" gutterBottom>
                Job Description
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Job Description"
                    name="description"
                    value={jobForm.description}
                    onChange={handleFormChange}
                    multiline
                    rows={6}
                    required
                    placeholder="Provide a detailed description of the job position"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <DescriptionIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </FormPaper>
            
            {/* Requirements */}
            <FormPaper elevation={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Requirements
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => addListItem('requirements')}
                >
                  Add Requirement
                </Button>
              </Box>
              {jobForm.requirements.map((requirement, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Requirement ${index + 1}`}
                    value={requirement}
                    onChange={(e) => handleListItemChange('requirements', index, e.target.value)}
                    placeholder="e.g., At least 3 years of experience in React development"
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeListItem('requirements', index)}
                    disabled={jobForm.requirements.length <= 1}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </FormPaper>
            
            {/* Responsibilities */}
            <FormPaper elevation={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Responsibilities
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => addListItem('responsibilities')}
                >
                  Add Responsibility
                </Button>
              </Box>
              {jobForm.responsibilities.map((responsibility, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Responsibility ${index + 1}`}
                    value={responsibility}
                    onChange={(e) => handleListItemChange('responsibilities', index, e.target.value)}
                    placeholder="e.g., Develop and maintain web applications using React"
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeListItem('responsibilities', index)}
                    disabled={jobForm.responsibilities.length <= 1}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </FormPaper>
            
            {/* Benefits */}
            <FormPaper elevation={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Benefits
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => addListItem('benefits')}
                >
                  Add Benefit
                </Button>
              </Box>
              {jobForm.benefits.map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Benefit ${index + 1}`}
                    value={benefit}
                    onChange={(e) => handleListItemChange('benefits', index, e.target.value)}
                    placeholder="e.g., Comprehensive health insurance"
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeListItem('benefits', index)}
                    disabled={jobForm.benefits.length <= 1}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </FormPaper>
            
            {/* Additional Information */}
            <FormPaper elevation={1}>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Application Deadline"
                    name="applicationDeadline"
                    type="date"
                    value={jobForm.applicationDeadline}
                    onChange={handleFormChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={jobForm.videoRequired}
                        onChange={handleFormChange}
                        name="videoRequired"
                        color="primary"
                      />
                    }
                    label="Require video resume from applicants"
                    icon={<VideoCallIcon />}
                    checkedIcon={<VideoCallIcon />}
                  />
                </Grid>
              </Grid>
            </FormPaper>
            
            {/* Submit Buttons */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                type="submit"
                disabled={saving}
              >
                {saving ? 'Posting...' : 'Post Job'}
              </Button>
            </Box>
          </form>
        )}
      </Container>
      
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
    </PageContainer>
  );
};

export default PostJobPage;
