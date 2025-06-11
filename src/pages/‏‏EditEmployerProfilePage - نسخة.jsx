import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Grid, MenuItem,
  Card, CardContent, CardActions, CircularProgress, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import employerService from '../services/employerService';

const EditEmployerProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '', description: '', website: '', location: '',
    industry: '', address: '', logo: '', size: '', establish_year: '', categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const employerId = 'your-employer-id'; // Replace with actual

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, videoData, jobData, categoryData] = await Promise.all([
          employerService.getEmployerProfile(),
          employerService.getEmployerVideos(),
          employerService.getEmployerJobs(),
          employerService.getAllCategories() // implement this
        ]);
        setProfile({ ...profileData, categoryId: profileData.category?.id || '' });
        setVideos(videoData);
        setJobs(jobData);
        setCategories(categoryData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await employerService.updateEmployerProfile(employerId, profile);
      alert('Profile updated successfully.');
    } catch (err) {
      alert('Update failed.');
    }
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm('Delete this video?')) {
      await employerService.deleteEmployerVideo(id); // implement this
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Employer Profile</Typography>

      <Grid container spacing={2}>
        {['name', 'description', 'website', 'location', 'industry', 'address', 'logo', 'size', 'establish_year'].map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <TextField
              label={field.replace('_', ' ').toUpperCase()}
              name={field}
              value={profile[field] || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
        ))}

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
          <Button variant="contained" onClick={handleSave} color="primary">Save Profile</Button>
        </Grid>
      </Grid>

      {/* Videos */}
      <Box mt={6}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Company Videos</Typography>
          <Button variant="outlined" onClick={() => navigate('/upload-video')}>Upload Video</Button>
        </Box>
        <Grid container spacing={2}>
          {videos.map(video => (
            <Grid item xs={12} sm={6} key={video.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{video.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{video.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/edit-video/${video.id}`)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteVideo(video.id)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Jobs */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>Job Posts</Typography>
        <Grid container spacing={2}>
          {jobs.map(job => (
            <Grid item xs={12} sm={6} key={job.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {job.location} • {job.employment_type}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/edit-job/${job.id}`)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => navigate(`/delete-job/${job.id}`)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default EditEmployerProfilePage;
