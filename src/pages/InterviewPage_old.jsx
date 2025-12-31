import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  VideoCall,
  Schedule,
  Person,
  Work,
  AccessTime,
  Event,
  MoreVert,
  Edit,
  Cancel,
  CheckCircle,
  Pending
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  getUserInterviews, 
  getInterviewDetails, 
  updateInterviewStatus,
  rescheduleInterview,
  cancelInterview,
  joinInterview
} from '@/services/api';
import VideoCallInterface from '../components/VideoCallInterface';

const InterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const theme = useTheme();
  
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [newDateTime, setNewDateTime] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchInterviews();
    if (id) {
      fetchInterviewDetails(id);
    }
  }, [id]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await getUserInterviews();
      setInterviews(response.data.interviews || []);
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
      setError('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewDetails = async (interviewId) => {
    try {
      const response = await getInterviewDetails(interviewId);
      setSelectedInterview(response.data.interview);
    } catch (error) {
      console.error('Failed to fetch interview details:', error);
      setError('Failed to load interview details');
    }
  };

  const handleJoinInterview = async (interview) => {
    try {
      const response = await joinInterview(interview.id);
      setSelectedInterview({
        ...interview,
        meetingLink: response.data.meetingLink,
        roomName: response.data.roomName
      });
      setShowVideoCall(true);
    } catch (error) {
      console.error('Failed to join interview:', error);
      setError(error.response?.data?.message || 'Failed to join interview');
    }
  };

  const handleReschedule = async () => {
    try {
      await rescheduleInterview(selectedInterview.id, {
        newDateTime,
        reason: 'Rescheduled by user'
      });
      setRescheduleDialog(false);
      setNewDateTime('');
      fetchInterviews();
      if (selectedInterview) {
        fetchInterviewDetails(selectedInterview.id);
      }
    } catch (error) {
      console.error('Failed to reschedule interview:', error);
      setError('Failed to reschedule interview');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelInterview(selectedInterview.id, { reason: cancelReason });
      setCancelDialog(false);
      setCancelReason('');
      fetchInterviews();
      if (selectedInterview) {
        fetchInterviewDetails(selectedInterview.id);
      }
    } catch (error) {
      console.error('Failed to cancel interview:', error);
      setError('Failed to cancel interview');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'rescheduled': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Schedule />;
      case 'in_progress': return <VideoCall />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <Cancel />;
      case 'rescheduled': return <Edit />;
      default: return <Pending />;
    }
  };

  const filterInterviews = (status) => {
    if (status === 'upcoming') {
      return interviews.filter(interview => 
        ['scheduled', 'rescheduled'].includes(interview.status) &&
        new Date(interview.scheduled_at) > new Date()
      );
    }
    if (status === 'past') {
      return interviews.filter(interview => 
        ['completed', 'cancelled'].includes(interview.status) ||
        new Date(interview.scheduled_at) < new Date()
      );
    }
    return interviews;
  };

  const canJoinInterview = (interview) => {
    const now = new Date();
    const scheduledTime = new Date(interview.scheduled_at);
    const timeDiff = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);
    return timeDiff <= 15 && timeDiff >= -60 && interview.status === 'scheduled';
  };

  if (showVideoCall && selectedInterview) {
    return (
      <VideoCallInterface
        interviewId={selectedInterview.id}
        roomName={selectedInterview.roomName}
        meetingLink={selectedInterview.meetingLink}
        onCallEnd={() => {
          setShowVideoCall(false);
          fetchInterviews();
        }}
        interviewDetails={selectedInterview}
      />
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 2, md: 4 }, // Adjust padding for mobile
        px: { xs: 2, md: 4 }, // Adjust padding for mobile
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            mb: { xs: 2, md: 4 },
            fontSize: { xs: "1.5rem", md: "2rem" }, // Adjust font size for mobile
          }}
        >
          {t('interviews.title')}
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {interviews.map((interview, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[3],
                  "&:hover": {
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <CardContent>
                  <Box mb={2}>
                    <Typography variant="h6" component="div" fontWeight="medium">
                      {interview.job?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.role === 'employer' 
                        ? interview.candidate?.displayName 
                        : interview.employer?.displayName}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Event fontSize="small" />
                      <Typography variant="body2">
                        {new Date(interview.scheduled_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body2">
                        {new Date(interview.scheduled_at).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      icon={getStatusIcon(interview.status)}
                      label={interview.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(interview.status)}
                      size="small"
                    />
                    
                    {canJoinInterview(interview) && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<VideoCall />}
                        onClick={() => handleJoinInterview(interview)}
                        size="small"
                      >{i18n.t('auto_join_interview')}</Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default InterviewPage;
