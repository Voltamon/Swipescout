import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  IconButton,
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
  Snackbar
} from "@mui/material";
import { 
  LocationOn, 
  Search, 
  PlayArrow, 
  Code, 
  WorkOutline, 
  Email,
  Phone,
  LinkedIn,
  School,
  Star,
  Handshake as Connect,
  Visibility,
  PersonAdd
} from "@mui/icons-material";
import { searchCandidates, connectWithCandidate, getFilterOptions } from "../services/api";
import { useAuth } from '../contexts/AuthContext';
import { useContext } from 'react';

export default function CandidateSearchPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("any");
  const [location, setLocation] = useState("");
  const [educationLevel, setEducationLevel] = useState("any");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOptions, setFilterOptions] = useState({});
  const [connectDialog, setConnectDialog] = useState({ open: false, candidate: null });
  const [connectMessage, setConnectMessage] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const experienceLevelOptions = [
    { value: "any", label: "Any Experience" },
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6+ years)" }
  ];

  const educationLevelOptions = [
    { value: "any", label: "Any Education" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "phd", label: "PhD" }
  ];

  useEffect(() => {
    loadFilterOptions();
    fetchCandidates();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const fetchCandidates = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = {
        q: searchTerm,
        skills: skills || undefined,
        experienceLevel: experienceLevel === "any" ? undefined : experienceLevel,
        location: location || undefined,
        educationLevel: educationLevel === "any" ? undefined : educationLevel,
        page: currentPage,
        limit: 12
      };

      const response = await searchCandidates(searchParams);
      setCandidates(response.data.candidates || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(currentPage);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to fetch candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchCandidates(1);
  };

  const handlePageChange = (event, newPage) => {
    fetchCandidates(newPage);
  };

  const handleConnect = async (candidate) => {
    setConnectDialog({ open: true, candidate });
    setConnectMessage(`Hi ${candidate.firstName}, I'm interested in discussing potential opportunities with you.`);
  };

  const handleSendConnection = async () => {
    try {
      await connectWithCandidate(connectDialog.candidate.id, connectMessage);
      setSnackbar({
        open: true,
        message: "Connection request sent successfully!",
        severity: "success"
      });
      setConnectDialog({ open: false, candidate: null });
      setConnectMessage("");
    } catch (error) {
      console.error('Error sending connection:', error);
      setSnackbar({
        open: true,
        message: "Failed to send connection request. Please try again.",
        severity: "error"
      });
    }
  };

  const CandidateCard = ({ candidate }) => (
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
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={candidate.profileImage}
            sx={{ width: 60, height: 60, mr: 2 }}
          >
            {candidate.firstName?.[0]}{candidate.lastName?.[0]}
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h6" fontWeight="bold">
              {candidate.firstName} {candidate.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {candidate.title || 'Job Seeker'}
            </Typography>
            {candidate.rating && (
              <Box display="flex" alignItems="center" mt={0.5}>
                <Star sx={{ color: '#ffc107', fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">{candidate.rating}/5</Typography>
              </Box>
            )}
          </Box>
        </Box>

        {candidate.summary && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {candidate.summary.length > 120 
              ? `${candidate.summary.substring(0, 120)}...` 
              : candidate.summary
            }
          </Typography>
        )}

        {candidate.location && (
          <Box display="flex" alignItems="center" mb={1}>
            <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {candidate.location}
            </Typography>
          </Box>
        )}

        {candidate.experience && (
          <Box display="flex" alignItems="center" mb={1}>
            <WorkOutline sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {candidate.experience} years experience
            </Typography>
          </Box>
        )}

        {candidate.education && (
          <Box display="flex" alignItems="center" mb={2}>
            <School sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {candidate.education}
            </Typography>
          </Box>
        )}

        {candidate.skills && candidate.skills.length > 0 && (
          <Box mb={2}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Skills:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {candidate.skills.slice(0, 4).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill.name || skill}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              {candidate.skills.length > 4 && (
                <Chip
                  label={`+${candidate.skills.length - 4} more`}
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
            startIcon={<Visibility />}
            onClick={() => window.open(`/candidate/${candidate.id}`, '_blank')}
            sx={{ flex: 1 }}
          >
            View Profile
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Connect />}
            onClick={() => handleConnect(candidate)}
            sx={{ flex: 1 }}
          >
            Connect
          </Button>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            startIcon={<PersonAdd />}
            onClick={() => window.open(`/recruit/${candidate.id}`, '_blank')}
            sx={{ flex: 1 }}
          >
            Recruit
          </Button>
        </Box>

        {candidate.videoResume && (
          <Button
            variant="text"
            size="small"
            startIcon={<PlayArrow />}
            onClick={() => window.open(candidate.videoResume, '_blank')}
            sx={{ mt: 1, width: '100%' }}
          >
            Watch Video Resume
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Find Talented Candidates
      </Typography>

      {/* Search Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search candidates"
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
                label="Skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Python, etc."
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <Select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  displayEmpty
                >
                  {experienceLevelOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                <Select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  displayEmpty
                >
                  {educationLevelOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
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
            {candidates.length > 0 
              ? `Found ${candidates.length} candidates` 
              : 'No candidates found'
            }
          </Typography>

          <Grid container spacing={3}>
            {candidates.map((candidate) => (
              <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                <CandidateCard candidate={candidate} />
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

      {/* Connect Dialog */}
      <Dialog 
        open={connectDialog.open} 
        onClose={() => setConnectDialog({ open: false, candidate: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Connect with {connectDialog.candidate?.firstName} {connectDialog.candidate?.lastName}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={connectMessage}
            onChange={(e) => setConnectMessage(e.target.value)}
            placeholder="Write a personalized message..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectDialog({ open: false, candidate: null })}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSendConnection}
            disabled={!connectMessage.trim()}
          >
            Send Connection Request
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

