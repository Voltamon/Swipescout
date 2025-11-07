import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton
} from "@mui/material";
import { 
  PersonAdd,
  Work,
  Schedule,
  AttachMoney,
  LocationOn,
  Email,
  Phone,
  LinkedIn,
  School,
  Star,
  Close,
  Send,
  CheckCircle
} from "@mui/icons-material";
import { useParams, useNavigate } from 'react-router-dom';
import { getCandidateProfile, recruitCandidate, getJobPostings } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';

const recruitmentSteps = [
  'Select Position',
  'Customize Offer',
  'Review & Send'
];

export default function RecruitCandidatePage() {
  // const theme = useTheme(); // Removed: unused variable
  const { candidateId } = useParams();
  const navigate = useNavigate();
  // const { user } = useAuth(); // Removed: unused variable
  
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Recruitment form data
  const [selectedJob, setSelectedJob] = useState('');
  const [customPosition, setCustomPosition] = useState({
    title: '',
    department: '',
    location: '',
    jobType: 'Full-Time',
    description: ''
  });
  const [offerDetails, setOfferDetails] = useState({
    salaryMin: '',
    salaryMax: '',
    benefits: [],
    startDate: '',
    message: '',
    urgency: 'normal'
  });
  const [useCustomPosition, setUseCustomPosition] = useState(false);

  const benefitOptions = [
    'Health Insurance',
    'Dental Insurance',
    'Vision Insurance',
    '401(k) Matching',
    'Paid Time Off',
    'Remote Work Options',
    'Professional Development',
    'Stock Options',
    'Flexible Hours',
    'Gym Membership',
    'Commuter Benefits',
    'Life Insurance'
  ];

  useEffect(() => {
    if (candidateId) {
      fetchCandidateData();
      fetchJobPostings();
    }
  }, [candidateId]);

  const fetchCandidateData = async () => {
    try {
      const response = await getCandidateProfile(candidateId);
      setCandidate(response.data);
    } catch (error) {
      console.error('Error fetching candidate:', error);
      setError('Failed to load candidate information');
    }
  };

  const fetchJobPostings = async () => {
    try {
      const response = await getJobPostings();
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedJob && !useCustomPosition) {
      setSnackbar({
        open: true,
        message: "Please select a position or create a custom one",
        severity: "warning"
      });
      return;
    }
    
    if (activeStep === 0 && useCustomPosition && !customPosition.title) {
      setSnackbar({
        open: true,
        message: "Please enter a position title",
        severity: "warning"
      });
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleBenefitToggle = (benefit) => {
    setOfferDetails(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const handleSendRecruitment = async () => {
    try {
      const recruitmentData = {
        candidateId,
        position: useCustomPosition ? customPosition : jobs.find(j => j.id === selectedJob),
        offer: offerDetails,
        isCustomPosition: useCustomPosition
      };

      await recruitCandidate(recruitmentData);
      
      setSnackbar({
        open: true,
        message: "Recruitment offer sent successfully!",
        severity: "success"
      });

      // Navigate back after a delay
      setTimeout(() => {
        navigate('/candidate-search');
      }, 2000);

    } catch (error) {
      console.error('Error sending recruitment offer:', error);
      setSnackbar({
        open: true,
        message: "Failed to send recruitment offer. Please try again.",
        severity: "error"
      });
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Position for {candidate?.firstName} {candidate?.lastName}
            </Typography>
            
            <Box mb={3}>
              <Button
                variant={!useCustomPosition ? "contained" : "outlined"}
                onClick={() => setUseCustomPosition(false)}
                sx={{ mr: 2 }}
              >
                Existing Position
              </Button>
              <Button
                variant={useCustomPosition ? "contained" : "outlined"}
                onClick={() => setUseCustomPosition(true)}
              >
                Create Custom Position
              </Button>
            </Box>

            {!useCustomPosition ? (
              <FormControl fullWidth>
                <InputLabel>Select Job Position</InputLabel>
                <Select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  label="Select Job Position"
                >
                  {jobs.map((job) => (
                    <MenuItem key={job.id} value={job.id}>
                      <Box>
                        <Typography variant="body1">{job.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {job.department} • {job.location}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Position Title"
                    value={customPosition.title}
                    onChange={(e) => setCustomPosition(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={customPosition.department}
                    onChange={(e) => setCustomPosition(prev => ({
                      ...prev,
                      department: e.target.value
                    }))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={customPosition.location}
                    onChange={(e) => setCustomPosition(prev => ({
                      ...prev,
                      location: e.target.value
                    }))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      value={customPosition.jobType}
                      onChange={(e) => setCustomPosition(prev => ({
                        ...prev,
                        jobType: e.target.value
                      }))}
                      label="Job Type"
                    >
                      <MenuItem value="Full-Time">Full-Time</MenuItem>
                      <MenuItem value="Part-Time">Part-Time</MenuItem>
                      <MenuItem value="Contract">Contract</MenuItem>
                      <MenuItem value="Freelance">Freelance</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Job Description"
                    value={customPosition.description}
                    onChange={(e) => setCustomPosition(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Customize Offer Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Salary"
                  type="number"
                  value={offerDetails.salaryMin}
                  onChange={(e) => setOfferDetails(prev => ({
                    ...prev,
                    salaryMin: e.target.value
                  }))}
                  InputProps={{
                    startAdornment: <AttachMoney />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Salary"
                  type="number"
                  value={offerDetails.salaryMax}
                  onChange={(e) => setOfferDetails(prev => ({
                    ...prev,
                    salaryMax: e.target.value
                  }))}
                  InputProps={{
                    startAdornment: <AttachMoney />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Preferred Start Date"
                  type="date"
                  value={offerDetails.startDate}
                  onChange={(e) => setOfferDetails(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Urgency</InputLabel>
                  <Select
                    value={offerDetails.urgency}
                    onChange={(e) => setOfferDetails(prev => ({
                      ...prev,
                      urgency: e.target.value
                    }))}
                    label="Urgency"
                  >
                    <MenuItem value="low">Low Priority</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High Priority</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Benefits Package
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {benefitOptions.map((benefit) => (
                    <Chip
                      key={benefit}
                      label={benefit}
                      clickable
                      color={offerDetails.benefits.includes(benefit) ? "primary" : "default"}
                      onClick={() => handleBenefitToggle(benefit)}
                      variant={offerDetails.benefits.includes(benefit) ? "filled" : "outlined"}
                    />
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Personal Message"
                  value={offerDetails.message}
                  onChange={(e) => setOfferDetails(prev => ({
                    ...prev,
                    message: e.target.value
                  }))}
                  placeholder="Add a personal message to make your offer more appealing..."
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        const position = useCustomPosition ? customPosition : jobs.find(j => j.id === selectedJob);
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Recruitment Offer
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Position Details
                </Typography>
                <Typography><strong>Title:</strong> {position?.title}</Typography>
                {position?.department && (
                  <Typography><strong>Department:</strong> {position.department}</Typography>
                )}
                {position?.location && (
                  <Typography><strong>Location:</strong> {position.location}</Typography>
                )}
                <Typography><strong>Type:</strong> {position?.jobType || position?.type}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Offer Details
                </Typography>
                {(offerDetails.salaryMin || offerDetails.salaryMax) && (
                  <Typography>
                    <strong>Salary Range:</strong> 
                    {offerDetails.salaryMin && ` $${parseInt(offerDetails.salaryMin).toLocaleString()}`}
                    {offerDetails.salaryMin && offerDetails.salaryMax && ' - '}
                    {offerDetails.salaryMax && `$${parseInt(offerDetails.salaryMax).toLocaleString()}`}
                  </Typography>
                )}
                {offerDetails.startDate && (
                  <Typography><strong>Start Date:</strong> {new Date(offerDetails.startDate).toLocaleDateString()}</Typography>
                )}
                <Typography><strong>Priority:</strong> {offerDetails.urgency}</Typography>
                
                {offerDetails.benefits.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>Benefits:</Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {offerDetails.benefits.map((benefit) => (
                        <Chip key={benefit} label={benefit} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
                
                {offerDetails.message && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>Personal Message:</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      "{offerDetails.message}"
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Recruit Candidate
        </Typography>
        
        {candidate && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src={candidate.profileImage}
                  sx={{ width: 60, height: 60, mr: 2 }}
                >
                  {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {candidate.firstName} {candidate.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {candidate.title || 'Job Seeker'}
                  </Typography>
                  {candidate.location && (
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{candidate.location}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {recruitmentSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            
            {activeStep === recruitmentSteps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSendRecruitment}
                startIcon={<Send />}
              >
                Send Recruitment Offer
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

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

