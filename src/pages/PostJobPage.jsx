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
  getCategories,
  getSkills,
  updateJob // Assuming you have an updateJob API
} from '../services/api';
import VideoUpload from './VideoUpload';
import IconButton from '@mui/material/IconButton';


const PageContainer = styled(Box)(({ theme }) => ({
  bgcolor: 'background.jobseeker',
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4),
  pt: {
    xs: 20,  
    sm: 16   
  }
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

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiAlert-root': {
    fontSize: '1rem',
    padding: theme.spacing(2),
  },
}));

const PostJobPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    employment_type: 'full-time',
    remote_ok: false,
    salary_min: null,
    salary_max: null,
    experience_level: '',
    education_level: '',
    job_status: 'active',
    categoryIds: [],
    skillIds: [],
    requirements: [''],
    responsibilities: [''],
    deadline: '',
    videoRequired: false // Indicates if a video is required for this job post
  });
  
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    location: false,
  });
  
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [uploadedVideoId, setUploadedVideoId] = useState(null); // This is the ID of the video from VideoUpload
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // States to track VideoUpload's internal status for dialog control
  const [isChildUploading, setIsChildUploading] = useState(false);
  const [isChildRecording, setIsChildRecording] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [newJobId, setNewJobId] = useState(null); // Stores the ID of the newly created job


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await getCategories();
        setAvailableCategories(categoriesResponse.data.categories);
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

  const validateForm = () => {
    const newErrors = {
    title: !jobForm.title,
    description: !jobForm.description,
    location: !jobForm.location,
    salary: jobForm.salary_min && jobForm.salary_max && 
            Number(jobForm.salary_min) > Number(jobForm.salary_max)
  };
  
  setErrors(newErrors);
  return !Object.values(newErrors).some(error => error);
};

const handleFormChange = (e) => {
  const { name, value, type, checked } = e.target;
  
  let processedValue = type === 'checkbox' ? checked : value;
  if ((name === 'salary_min' || name === 'salary_max') && value !== '') {
    processedValue = Number(value);
  }
  
  setJobForm({
    ...jobForm,
    [name]: processedValue
  });
  
  if (errors[name]) {
    setErrors({
      ...errors,
      [name]: false
    });
  }
};

  const handleCategoryChange = (event, newValue) => {
    setJobForm({
      ...jobForm,
      categoryIds: newValue.map(cat => cat.id)
    });
  };

  const handleSkillChange = (event, newValue) => {
    setJobForm({
      ...jobForm,
      skillIds: newValue.map(skill => skill.skill_id)
    });
  };

  const handleListItemChange = (type, index, value) => {
    const updatedList = [...jobForm[type]];
    updatedList[index] = value;
    setJobForm({
      ...jobForm,
      [type]: updatedList
    });
  };

  const addListItem = (type) => {
    setJobForm({
      ...jobForm,
      [type]: [...jobForm[type], '']
    });
  };

  const removeListItem = (type, index) => {
    const updatedList = [...jobForm[type]];
    updatedList.splice(index, 1);
    setJobForm({
      ...jobForm,
      [type]: updatedList
    });
  };

  // Modified: This function now handles creating the job first if not already created
  const handleVideoUploadClick = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields before uploading video',
        severity: 'error'
      });
      return;
    }

    // If job hasn't been posted yet, post it first to get an ID
    if (!newJobId) {
      try {
        setSaving(true);
        const jobDataToPost = {
          ...jobForm,
          requirements: jobForm.requirements.filter(item => item.trim() !== ''),
          responsibilities: jobForm.responsibilities.filter(item => item.trim() !== ''),
          deadline: jobForm.deadline || null,
          video_id: null, // Video ID will be added later
        };
        const response = await postJob(jobDataToPost);
        setNewJobId(response.data.job.id);
        setSnackbar({
          open: true,
          message: 'Job draft saved. Proceeding to video upload.',
          severity: 'info'
        });
      } catch (error) {
        console.error('Error creating job draft:', error);
        setSnackbar({
          open: true,
          message: 'Error creating job draft for video upload.',
          severity: 'error'
        });
        setSaving(false);
        return;
      } finally {
        setSaving(false);
      }
    }
    setShowVideoUpload(true);
  };

  // Modify the handleVideoUploadComplete function
const handleVideoUploadComplete = async (videoId) => {
  console.log('handleVideoUploadComplete called with videoId:', videoId);
  setUploadedVideoId(videoId);
  setShowVideoUpload(false); // Close the dialog immediately after upload initiation
  console.log('setShowVideoUpload(false) called.');
  
  if (newJobId && videoId) {
    try {
      setSaving(true);
      const updatedJobData = {
        ...jobForm,
        video_id: videoId,
        requirements: jobForm.requirements.filter(item => item.trim() !== ''),
        responsibilities: jobForm.responsibilities.filter(item => item.trim() !== ''),
        deadline: jobForm.deadline || null,
      };
      
      await updateJob(newJobId, updatedJobData);
      setSnackbar({
        open: true,
        message: 'Video linked to job and job updated successfully!',
        severity: 'success'
      });
      
      // Navigate to job details page
      navigate(`/job/${newJobId}`);
    } catch (error) {
      console.error('Error updating job with video ID:', error);
      setSnackbar({
        open: true,
        message: 'Error linking video to job.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  } else if (!videoId) {
    setSnackbar({
      open: true,
      message: 'Video upload failed or was cancelled. Job not updated with video.',
      severity: 'error'
    });
  }
};


  // Callback to receive current uploading/recording status from VideoUpload
  const handleChildStatusChange = (uploading, recording) => {
    setIsChildUploading(uploading);
    setIsChildRecording(recording);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    if (jobForm.videoRequired && !uploadedVideoId && !newJobId) { // Check if video is required but not uploaded/linked yet
      setSnackbar({
        open: true,
        message: 'Please upload the required video resume, or ensure job is created first.',
        severity: 'error'
      });
      return;
    }

    try {
      setSaving(true);
      const jobData = {
        ...jobForm,
        requirements: jobForm.requirements.filter(item => item.trim() !== ''),
        responsibilities: jobForm.responsibilities.filter(item => item.trim() !== ''),
        deadline: jobForm.deadline || null,
        // If newJobId exists and a video was uploaded/linked, keep its video_id.
        // Otherwise, it might be a job without a required video, or a fresh post without video.
        video_id: uploadedVideoId || null, 
      };

      let finalJobId = newJobId;
      if (finalJobId) {
        // If job already exists (from video upload pre-creation), update it
        await updateJob(finalJobId, jobData);
        setSnackbar({
          open: true,
          message: 'Job updated successfully!',
          severity: 'success'
        });
      } else {
        // If job does not exist yet, create it
        const response = await postJob(jobData);
        finalJobId = response.data.job.id;
        setNewJobId(finalJobId);
        setSnackbar({
          open: true,
          message: 'Job posted successfully!',
          severity: 'success'
        });
      }
      
      navigate(`/job/${finalJobId}`);
      
    } catch (error) {
      console.error('Error posting/updating job:', error);
      setSnackbar({
        open: true,
        message: 'Error posting/updating job',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Update the renderVideoUploadDialog function
const renderVideoUploadDialog = () => (
  <Dialog
    open={showVideoUpload}
    // Dialog should close when `showVideoUpload` becomes false
    onClose={() => setShowVideoUpload(false)}
    fullWidth
    maxWidth="md"
    // Loosen restrictions: allow escape key to close. The parent explicitly closes on upload complete.
    disableEscapeKeyDown={false} 
  >
    <DialogTitle>Upload Job Video</DialogTitle>
    <DialogContent>
      <VideoUpload 
        onComplete={handleVideoUploadComplete}
        onStatusChange={handleChildStatusChange}
        newjobid={newJobId}
        embedded={true}
      />
    </DialogContent>
    <DialogActions>
      {/* Always allow cancel button if the dialog is open and not actively recording */}
      <Button 
        onClick={() => setShowVideoUpload(false)} 
        disabled={isChildRecording} // Only disable if actively recording
      >
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);


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
            error={errors.title}
            helperText={errors.title ? "This field is required" : ""}
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
            error={errors.location}
            helperText={errors.location ? "This field is required" : ""}
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
            label="Post Job Video"
          />
          {jobForm.videoRequired && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<VideoCallIcon />}
              onClick={handleVideoUploadClick} // This will now ensure newJobId exists
              sx={{ mt: 1 }}
              disabled={saving} // Disable while job is being drafted/saved
            >
              {uploadedVideoId ? 'Video Uploaded' : 'Upload Video'}
            </Button>
          )}
        </Grid>
      </Grid>
    </FormPaper>
  );

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
                  key={option.id}
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
                fullWidth
                sx={{ minWidth: '300px' }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <SkillChip
                  label={option.name}
                  {...getTagProps({ index })}
                  key={option.skill_id}
                />
              ))
            }
          />
        </Grid>
      </Grid>
    </FormPaper>
  );

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
              error={errors.salary}
              helperText={errors.salary ? "Max salary must be greater than min salary" : ""}
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
              error={errors.salary}
              helperText={errors.salary ? "Max salary must be greater than min salary" : ""}
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

  const renderAdditionalInfoSection = () => (
    <FormPaper elevation={1}>
      <Typography variant="h6" gutterBottom>
        Additional Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Application Deadline"
            name="deadline"
            type="date"
            value={jobForm.deadline}
            onChange={handleFormChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
  
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="experience-level-label">Experience Level</InputLabel>
            <Select
              labelId="experience-level-label"
              name="experience_level"
              value={jobForm.experience_level}
              onChange={handleFormChange}
              label="Experience Level"
              sx={{ minWidth: '200px' }}
            >
              <MenuItem value="entry">Entry Level</MenuItem>
              <MenuItem value="mid">Mid Level</MenuItem>
              <MenuItem value="senior">Senior Level</MenuItem>
              <MenuItem value="executive">Executive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
  
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="education-level-label">Education Level</InputLabel>
            <Select
              labelId="education-level-label"
              name="education_level"
              value={jobForm.education_level}
              onChange={handleFormChange}
              label="Education Level"
              sx={{ minWidth: '200px' }}
            >
              <MenuItem value="high_school">High School</MenuItem>
              <MenuItem value="associate">Associate Degree</MenuItem>
              <MenuItem value="bachelor">Bachelor's Degree</MenuItem>
              <MenuItem value="master">Master's Degree</MenuItem>
              <MenuItem value="phd">PhD</MenuItem>
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

  const renderJobDescriptionSection = () => (
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
            error={errors.description}
            helperText={errors.description ? "This field is required" : ""}
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
  );

  const renderRequirementsSection = () => (
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
  );

  const renderResponsibilitiesSection = () => (
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
  );

  return (
    <PageContainer>
      <Container maxWidth="lg" sx={{ bgcolor: 'rgb(221, 235, 253)' , borderRadius: 1 ,padding: 1 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
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
            {renderJobDescriptionSection()}
            {renderRequirementsSection()}
            {renderResponsibilitiesSection()}
            {renderAdditionalInfoSection()}
            
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
      
      {renderVideoUploadDialog()}
      
      <StyledSnackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </StyledSnackbar>
    </PageContainer>
  );
};

export default PostJobPage;
