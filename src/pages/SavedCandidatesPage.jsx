import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar
} from "@mui/material";
import { 
  LocationOn, 
  WorkOutline, 
  School,
  Star,
  Handshake as Connect,
  Visibility,
  PersonAdd,
  MoreVert,
  Delete,
  Message,
  BookmarkRemove
} from "@mui/icons-material";
import { getSavedCandidates, unsaveCandidate, connectWithCandidate } from "../services/api";
import { useAuth } from '../contexts/AuthContext';
import { useContext } from 'react';

export default function SavedCandidatesPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [connectDialog, setConnectDialog] = useState({ open: false, candidate: null });
  const [connectMessage, setConnectMessage] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchSavedCandidates();
  }, []);

  const fetchSavedCandidates = async () => {
    setLoading(true);
    try {
      const response = await getSavedCandidates();
      setCandidates(response.data.candidates || []);
    } catch (error) {
      console.error('Error fetching saved candidates:', error);
      setError('Failed to load saved candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, candidate) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCandidate(candidate);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCandidate(null);
  };

  const handleUnsave = async (candidateId) => {
    try {
      await unsaveCandidate(candidateId);
      setCandidates(prev => prev.filter(c => c.id !== candidateId));
      setSnackbar({
        open: true,
        message: "Candidate removed from saved list",
        severity: "info"
      });
    } catch (error) {
      console.error('Error unsaving candidate:', error);
      setSnackbar({
        open: true,
        message: "Failed to remove candidate. Please try again.",
        severity: "error"
      });
    }
    handleMenuClose();
  };

  const handleConnect = (candidate) => {
    setConnectDialog({ open: true, candidate });
    setConnectMessage(`Hi ${candidate.firstName}, I'm interested in discussing potential opportunities with you based on your impressive profile.`);
    handleMenuClose();
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
        <Box display="flex" alignItems="flex-start" mb={2}>
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
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen(e, candidate)}
          >
            <MoreVert />
          </IconButton>
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
        </Box>

        {candidate.savedAt && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Saved on {new Date(candidate.savedAt).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Saved Candidates
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {candidates.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            No saved candidates yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Start saving candidates from the candidate search page to build your talent pool.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.href = '/candidate-search'}
          >
            Search Candidates
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h6" mb={3}>
            {candidates.length} saved candidate{candidates.length !== 1 ? 's' : ''}
          </Typography>

          <Grid container spacing={3}>
            {candidates.map((candidate) => (
              <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                <CandidateCard candidate={candidate} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleConnect(selectedCandidate)}>
          <Connect sx={{ mr: 1 }} />
          Connect
        </MenuItem>
        <MenuItem onClick={() => window.open(`/recruit/${selectedCandidate?.id}`, '_blank')}>
          <PersonAdd sx={{ mr: 1 }} />
          Recruit
        </MenuItem>
        <MenuItem onClick={() => window.open(`/candidate/${selectedCandidate?.id}`, '_blank')}>
          <Visibility sx={{ mr: 1 }} />
          View Profile
        </MenuItem>
        <MenuItem 
          onClick={() => handleUnsave(selectedCandidate?.id)}
          sx={{ color: 'error.main' }}
        >
          <BookmarkRemove sx={{ mr: 1 }} />
          Remove from Saved
        </MenuItem>
      </Menu>

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

