import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  FormControl,
  InputLabel
} from "@mui/material";
import { 
  Search, 
  LocationOn, 
  Work, 
  AttachMoney, 
  Schedule,
  Business,
  Check as Apply,
  Bookmark,
  BookmarkBorder,
  Share
} from "@mui/icons-material";
import { searchJobs, applyToJob, getFilterOptions, saveVideo, unsaveVideo } from "../services/api";

import { useAuth } from '../contexts/AuthContext';
import { useContext } from 'react';

export default function JobSearchPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [jobTypes, setJobTypes] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("any");
  const [industry, setIndustry] = useState("any");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOptions, setFilterOptions] = useState({});
  const [applyDialog, setApplyDialog] = useState({ open: false, job: null });
  const [applicationMessage, setApplicationMessage] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [savedJobs, setSavedJobs] = useState(new Set());

  const jobTypeOptions = ["Full-Time", "Part-Time", "Contract", "Freelance", "Internship"];
  const experienceLevelOptions = [
    { value: "any", label: "Any Experience" },
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6+ years)" }
  ];

  useEffect(() => {
    loadFilterOptions();
    fetchJobs();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const handleJobTypeChange = (event) => {
    const { value, checked } = event.target;
    setJobTypes((prev) =>
      checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
  };

  const fetchJobs = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = {
        q: searchTerm,
        location: location || undefined,
        minSalary: minSalary || undefined,
        maxSalary: maxSalary || undefined,
        jobTypes: jobTypes.length > 0 ? jobTypes : undefined,
        experienceLevel: experienceLevel === "any" ? undefined : experienceLevel,
        industry: industry === "any" ? undefined : industry,
        page: currentPage,
        limit: 12
      };

      const response = await searchJobs(searchParams);
      setJobs(response.data.jobs || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(currentPage);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchJobs(1);
  };

  const handlePageChange = (event, newPage) => {
    fetchJobs(newPage);
  };

  const handleApply = (job) => {
    setApplyDialog({ open: true, job });
    setApplicationMessage(`Dear Hiring Manager,\n\nI am very interested in the ${job.title} position at ${job.company}. I believe my skills and experience make me a great fit for this role.\n\nBest regards,\n${user?.firstName} ${user?.lastName}`);
  };

  const handleSendApplication = async () => {
    try {
      await applyToJob(applyDialog.job.id, { message: applicationMessage });
      setSnackbar({
        open: true,
        message: "Application sent successfully!",
        severity: "success"
      });
      setApplyDialog({ open: false, job: null });
      setApplicationMessage("");
    } catch (error) {
      console.error('Error sending application:', error);
      setSnackbar({
        open: true,
        message: "Failed to send application. Please try again.",
        severity: "error"
      });
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      if (savedJobs.has(jobId)) {
        await unsaveVideo(jobId);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        setSnackbar({
          open: true,
          message: "Job removed from saved list",
          severity: "info"
        });
      } else {
        await saveVideo(jobId);
        setSavedJobs(prev => new Set(prev).add(jobId));
        setSnackbar({
          open: true,
          message: "Job saved successfully!",
          severity: "success"
        });
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      setSnackbar({
        open: true,
        message: "Failed to save job. Please try again.",
        severity: "error"
      });
    }
  };

  const JobCard = ({ job }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Avatar
              src={job.companyLogo}
              sx={{ width: 50, height: 50, mr: 2, cursor: 'pointer' }}
              onClick={() => job.companyVideoId && window.open(`/company-video/${job.companyVideoId}`, '_blank')}
            >
              {job.company?.[0]}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h6" fontWeight="bold" noWrap>
                {job.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  cursor: job.companyVideoId ? 'pointer' : 'default',
                  '&:hover': job.companyVideoId ? { color: 'primary.main' } : {}
                }}
                onClick={() => job.companyVideoId && window.open(`/company-video/${job.companyVideoId}`, '_blank')}
              >
                {job.company}
                {job.companyVideoId && (
                  <Chip 
                    label="Video" 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    sx={{ ml: 1, fontSize: '0.7rem', height: '20px' }}
                  />
                )}
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            onClick={() => handleSaveJob(job.id)}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            {savedJobs.has(job.id) ? <Bookmark /> : <BookmarkBorder />}
          </Button>
        </Box>

        {job.description && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {job.description.length > 150 
              ? `${job.description.substring(0, 150)}...` 
              : job.description
            }
          </Typography>
        )}

        <Box mb={2}>
          {job.location && (
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {job.location}
              </Typography>
            </Box>
          )}

          {job.jobType && (
            <Box display="flex" alignItems="center" mb={1}>
              <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {job.jobType}
              </Typography>
            </Box>
          )}

          {job.experienceLevel && (
            <Box display="flex" alignItems="center" mb={1}>
              <Work sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {job.experienceLevel} level
              </Typography>
            </Box>
          )}

          {(job.minSalary || job.maxSalary) && (
            <Box display="flex" alignItems="center" mb={1}>
              <AttachMoney sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {job.minSalary && job.maxSalary 
                  ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                  : job.minSalary 
                    ? `From $${job.minSalary.toLocaleString()}`
                    : `Up to $${job.maxSalary.toLocaleString()}`
                }
              </Typography>
            </Box>
          )}
        </Box>

        {job.skills && job.skills.length > 0 && (
          <Box mb={2}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Required Skills:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {job.skills.slice(0, 4).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill.name || skill}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              {job.skills.length > 4 && (
                <Chip
                  label={`+${job.skills.length - 4} more`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
          </Box>
        )}

        <Box display="flex" gap={1} mt="auto">
          <Button
            variant="outlined"
            size="small"
            onClick={() => window.open(`/job/${job.id}`, '_blank')}
            sx={{ flex: 1 }}
          >
            View Details
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Apply />}
            onClick={() => handleApply(job)}
            sx={{ flex: 1 }}
          >
            Apply Now
          </Button>
        </Box>

        {job.postedDate && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Posted {new Date(job.postedDate).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Find Your Dream Job
      </Typography>

      {/* Search Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search jobs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job title, company, keywords..."
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State, Country"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  label="Experience Level"
                >
                  {experienceLevelOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <TextField
                fullWidth
                label="Min Salary"
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="50000"
              />
            </Grid>
            <Grid item xs={12} md={1.5}>
              <TextField
                fullWidth
                label="Max Salary"
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                placeholder="100000"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                sx={{ height: '56px' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : <Search />}
              </Button>
            </Grid>
          </Grid>

          {/* Job Type Filters */}
          <Box mt={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Job Type:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {jobTypeOptions.map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      value={type}
                      checked={jobTypes.includes(type)}
                      onChange={handleJobTypeChange}
                      size="small"
                    />
                  }
                  label={type}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Results */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Typography variant="h6" mb={3}>
            {jobs.length > 0 
              ? `Found ${jobs.length} jobs` 
              : 'No jobs found'
            }
          </Typography>

          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <JobCard job={job} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Apply Dialog */}
      <Dialog 
        open={applyDialog.open} 
        onClose={() => setApplyDialog({ open: false, job: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Apply for {applyDialog.job?.title} at {applyDialog.job?.company}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Cover Letter"
            value={applicationMessage}
            onChange={(e) => setApplicationMessage(e.target.value)}
            placeholder="Write your cover letter..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialog({ open: false, job: null })}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSendApplication}
            disabled={!applicationMessage.trim()}
          >
            Send Application
          </Button>
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

