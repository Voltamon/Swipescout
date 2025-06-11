import React, { useEffect, useState, useRef } from 'react';
import {
  Container, Typography, TextField, Button, Grid, MenuItem,
  Card, CardContent, CardActions, CircularProgress, Box,
  Avatar, IconButton, Divider, Chip, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PhotoCamera, Delete, Edit } from '@mui/icons-material';
import employerService from '../services/employerService';

const EditEmployerProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    industry: '',
    address: '',
    logo: '',
    size: '',
    establish_year: '',
    categoryId: '',
    phone: '',
    email: '',
    social: {
      linkedin: '',
      github: '',
      twitter: ''
    }
  });
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoLoading, setLogoLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profileData, videoData, jobData, categoryData] = await Promise.all([
          employerService.getEmployerProfile(),
          employerService.getEmployerVideos(),
          employerService.getEmployerJobs(),
          employerService.getJobCategories()
        ]);
        
        setProfile({
          ...profileData,
          categoryId: profileData.category?.id || '',
          social: profileData.social || {
            linkedin: '',
            github: '',
            twitter: ''
          }
        });
        setVideos(videoData);
        setJobs(jobData);
        setCategories(categoryData);
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: 'Failed to load profile data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLogoLoading(true);
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await employerService.uploadCompanyLogo(formData);
      setProfile(prev => ({ ...prev, logo: response.data.url }));
      setSnackbar({
        open: true,
        message: 'Logo uploaded successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Failed to upload logo',
        severity: 'error'
      });
    } finally {
      setLogoLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await employerService.updateEmployerProfile(profile);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    }
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await employerService.deleteEmployerVideo(id);
        setVideos(videos.filter(v => v.id !== id));
        setSnackbar({
          open: true,
          message: 'Video deleted successfully',
          severity: 'success'
        });
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: 'Failed to delete video',
          severity: 'error'
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Employer Profile</Typography>

      {/* Logo Upload */}
      <Box display="flex" alignItems="center" mb={4}>
        <input
          accept="image/*"
          type="file"
          ref={fileInputRef}
          onChange={handleLogoUpload}
          style={{ display: 'none' }}
        />
        <IconButton onClick={() => fileInputRef.current.click()} disabled={logoLoading}>
          <Avatar
            src={profile.logo}
            sx={{ width: 100, height: 100, mr: 2 }}
          >
            {profile.name.charAt(0)}
          </Avatar>
          <PhotoCamera />
        </IconButton>
        {logoLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
      </Box>

      {/* Profile Fields */}
      <Grid container spacing={2}>
        {[
          'name', 'description', 'website', 'location', 
          'industry', 'address', 'size', 'establish_year',
          'phone', 'email'
        ].map((field) => (
          <Grid item xs={12} sm={field === 'description' ? 12 : 6} key={field}>
            <TextField
              label={field.replace('_', ' ').toUpperCase()}
              name={field}
              value={profile[field] || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              multiline={field === 'description'}
              rows={field === 'description' ? 4 : 1}
            />
          </Grid>
        ))}

        {/* Social Media Fields */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Social Media</Typography>
          <Grid container spacing={2}>
            {['linkedin', 'github', 'twitter'].map((platform) => (
              <Grid item xs={12} sm={6} key={platform}>
                <TextField
                  label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  name={`social.${platform}`}
                  value={profile.social?.[platform] || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Category Selection */}
        <Grid item xs={12}>
          <TextField
            select
            label="Category"
            name="categoryId"
            value={profile.categoryId}
            onChange={handleChange}
            fullWidth
          >
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            color="primary"
            size="large"
          >
            Save Profile
          </Button>
        </Grid>
      </Grid>

      {/* Videos Section */}
      <Box mt={6}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Company Videos</Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/upload-video')}
            startIcon={<PhotoCamera />}
          >
            Upload Video
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {videos.map(video => (
            <Grid item xs={12} sm={6} key={video.id}>
              <Card>
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <video
                    src={video.video_url}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    controls
                  />
                </Box>
                <CardContent>
                  <Typography variant="h6">{video.video_title}</Typography>
                  <Box sx={{ mt: 1 }}>
                    {video.hashtags?.map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        sx={{ mr: 1, mb: 1 }} 
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<Edit />}
                    onClick={() => navigate(`/edit-video/${video.id}`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    startIcon={<Delete />}
                    onClick={() => handleDeleteVideo(video.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Jobs Section */}
      <Box mt={6}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Job Posts</Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/post-job')}
          >
            Post New Job
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {jobs.map(job => (
            <Grid item xs={12} sm={6} key={job.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {job.location} • {job.employment_type}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={job.job_status} 
                      size="small" 
                      color={job.job_status === 'open' ? 'success' : 'default'}
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/edit-job/${job.id}`)}
                    startIcon={<Edit />}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => navigate(`/delete-job/${job.id}`)}
                    startIcon={<Delete />}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditEmployerProfilePage;