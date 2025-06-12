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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  useTheme
} from '@mui/material';
import {
  Work as WorkIcon,
  Work as IconButton,
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
  getCategories,
  getSkills 
} from '../services/api';
import VideoResumeUpload from './VideoResumeUpload'; // Import the video upload component

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
  
  // State for job form - updated field names
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    employment_type: 'full-time',
    remote_ok: false,
    salary_min: '',
    salary_max: '',
    experience_level: '',
    education_level: '',
    job_status: 'active',
    categoryIds: [],
    skillIds: [],
    requirements: [''],
    responsibilities: [''],
    expires_at: '',
    videoRequired: false
  });
  
  // State for video upload
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [uploadedVideoId, setUploadedVideoId] = useState(null);
  
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
        const categoriesResponse = await getCategories();
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
      categoryIds: newValue.map(cat => cat.id) // Store only category IDs
    });
  };
  
  // Handle skill change
  const handleSkillChange = (event, newValue) => {
    setJobForm({
      ...jobForm,
      skillIds: newValue.map(skill => skill.skill_id) // Store only skill IDs
    });
  };
  
  // Handle list item change (requirements, responsibilities)
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
  
  // Handle video upload completion
  const handleVideoUploadComplete = (videoId) => {
    setUploadedVideoId(videoId);
    setShowVideoUpload(false);
    setSnackbar({
      open: true,
      message: 'Video uploaded successfully!',
      severity: 'success'
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
    
    // Check if video is required but not uploaded
    if (jobForm.videoRequired && !uploadedVideoId) {
      setSnackbar({
        open: true,
        message: 'Please upload the required video resume',
        severity: 'error'
      });
      return;
    }
    
    // Prepare the data for submission
    const jobData = {
      ...jobForm,
      requirements: jobForm.requirements.filter(item => item.trim() !== ''),
      responsibilities: jobForm.responsibilities.filter(item => item.trim() !== ''),
      expires_at: jobForm.expires_at || null,
      video_id: jobForm.videoRequired ? uploadedVideoId : null
    };
    
    try {
      setSaving(true);
      
      // Post job
      await postJob(jobData);
      
      setSnackbar({
        open: true,
        message: 'Job posted successfully',
        severity: 'success'
      });
      
      // Navigate to jobs page after successful submission
      setTimeout(() => {
        navigate('/Jobs-Listing-Page');
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

  // Render the video upload dialog
  const renderVideoUploadDialog = () => (
    <Dialog
      open={showVideoUpload}
      onClose={() => setShowVideoUpload(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Upload Video Resume</DialogTitle>
      <DialogContent>
        <VideoResumeUpload 
          onComplete={handleVideoUploadComplete}
          jobId={null} // Will be set after job creation if needed
          embedded={true}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowVideoUpload(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  // ... rest of the component remains mostly the same, just update the field names in the form

  // Update the Additional Information section to include the video upload button
  const renderAdditionalInfoSection = () => (
    <FormPaper elevation={1}>
      <Typography variant="h6" gutterBottom>
        Additional Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Application Deadline"
            name="expires_at"
            type="date"
            value={jobForm.expires_at}
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
          />
          {jobForm.videoRequired && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<VideoCallIcon />}
              onClick={() => setShowVideoUpload(true)}
              sx={{ mt: 1 }}
            >
              {uploadedVideoId ? 'Video Uploaded' : 'Upload Video'}
            </Button>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="experience-level-label">Experience Level</InputLabel>
            <Select
              labelId="experience-level-label"
              name="experience_level"
              value={jobForm.experience_level}
              onChange={handleFormChange}
              label="Experience Level"
            >
              <MenuItem value="entry">Entry Level</MenuItem>
              <MenuItem value="mid">Mid Level</MenuItem>
              <MenuItem value="senior">Senior Level</MenuItem>
              <MenuItem value="executive">Executive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="education-level-label">Education Level</InputLabel>
            <Select
              labelId="education-level-label"
              name="education_level"
              value={jobForm.education_level}
              onChange={handleFormChange}
              label="Education Level"
            >
              <MenuItem value="high_school">High School</MenuItem>
              <MenuItem value="associate">Associate Degree</MenuItem>
              <MenuItem value="bachelor">Bachelor's Degree</MenuItem>
              <MenuItem value="master">Master's Degree</MenuItem>
              <MenuItem value="phd">PhD</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </FormPaper>
  );

  // Update the Categories and Skills section to use the correct field names
  const renderCategoriesAndSkillsSection = () => (
    <FormPaper elevation={1}>
      <Typography variant="h6" gutterBottom>
        Categories and Skills
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="categories"
            options={availableCategories}
            getOptionLabel={(option) => option.name}
            value={availableCategories.filter(cat => jobForm.categoryIds.includes(cat.id))}
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
                  label={option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="skills"
            options={availableSkills}
            getOptionLabel={(option) => option.name}
            value={availableSkills.filter(skill => jobForm.skillIds.includes(skill.skill_id))}
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
                  label={option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </Grid>
      </Grid>
    </FormPaper>
  );

  // Update the Basic Information section
  const renderBasicInfoSection = () => (
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
            <InputLabel id="employment-type-label">Employment Type</InputLabel>
            <Select
              labelId="employment-type-label"
              name="employment_type"
              value={jobForm.employment_type}
              onChange={handleFormChange}
              label="Employment Type"
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
                checked={jobForm.remote_ok}
                onChange={handleFormChange}
                name="remote_ok"
                color="primary"
              />
            }
            label="Remote position"
          />
        </Grid>
      </Grid>
    </FormPaper>
  );

  // Update the Salary Information section
  const renderSalaryInfoSection = () => (
    <FormPaper elevation={1}>
      <Typography variant="h6" gutterBottom>
        Salary Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Minimum Salary"
            name="salary_min"
            type="number"
            value={jobForm.salary_min}
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
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Maximum Salary"
            name="salary_max"
            type="number"
            value={jobForm.salary_max}
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
      </Grid>
    </FormPaper>
  );

  // In the return statement, replace the form sections with the updated ones
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
            {renderBasicInfoSection()}
            {renderCategoriesAndSkillsSection()}
            {renderSalaryInfoSection()}
            
            {/* Job Description (unchanged) */}
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
            
            {/* Requirements (unchanged except field names) */}
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
            
            {/* Responsibilities (unchanged except field names) */}
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
            
            {renderAdditionalInfoSection()}
            
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
      
      {/* Video Upload Dialog */}
      {renderVideoUploadDialog()}
      
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