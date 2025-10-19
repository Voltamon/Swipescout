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
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  IconButton,
  Divider
} from "@mui/material";
import { 
  Work,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
  Visibility,
  Message,
  MoreVert,
  FilterList,
  Search,
  Business,
  LocationOn,
  CalendarToday,
  TrendingUp,
  Assessment
} from "@mui/icons-material";
import { getUserApplications, withdrawApplication, getApplicationDetails } from "../services/api";
import { useAuth } from '../contexts/AuthContext';
import { useContext } from 'react';

const applicationStatuses = {
  'submitted': { label: 'Submitted', color: 'info', icon: <Pending /> },
  'under_review': { label: 'Under Review', color: 'warning', icon: <Schedule /> },
  'interview_scheduled': { label: 'Interview Scheduled', color: 'primary', icon: <CalendarToday /> },
  'interview_completed': { label: 'Interview Completed', color: 'secondary', icon: <CheckCircle /> },
  'offer_extended': { label: 'Offer Extended', color: 'success', icon: <TrendingUp /> },
  'accepted': { label: 'Accepted', color: 'success', icon: <CheckCircle /> },
  'rejected': { label: 'Rejected', color: 'error', icon: <Cancel /> },
  'withdrawn': { label: 'Withdrawn', color: 'default', icon: <Cancel /> }
};

export default function ApplicationTrackingPage() {
  const theme = useTheme();
  const { user } = useAuth();
  
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuApplication, setMenuApplication] = useState(null);

  const tabFilters = [
    { label: 'All Applications', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Interview Stage', value: 'interview' },
    { label: 'Completed', value: 'completed' }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedTab, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await getUserApplications();
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by tab
    const tabFilter = tabFilters[selectedTab].value;
    if (tabFilter !== 'all') {
      switch (tabFilter) {
        case 'active':
          filtered = filtered.filter(app => 
            !['accepted', 'rejected', 'withdrawn'].includes(app.status)
          );
          break;
        case 'interview':
          filtered = filtered.filter(app => 
            ['interview_scheduled', 'interview_completed'].includes(app.status)
          );
          break;
        case 'completed':
          filtered = filtered.filter(app => 
            ['accepted', 'rejected', 'withdrawn'].includes(app.status)
          );
          break;
      }
    }

    // Sort by application date (newest first)
    filtered.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    setFilteredApplications(filtered);
  };

  const handleViewDetails = async (application) => {
    try {
      const response = await getApplicationDetails(application.id);
      setSelectedApplication(response.data);
      setDetailsDialog(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
    handleMenuClose();
  };

  const handleWithdraw = async (applicationId) => {
    try {
      await withdrawApplication(applicationId);
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'withdrawn' }
            : app
        )
      );
    } catch (error) {
      console.error('Error withdrawing application:', error);
    }
    handleMenuClose();
  };

  const handleMenuOpen = (event, application) => {
    setAnchorEl(event.currentTarget);
    setMenuApplication(application);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuApplication(null);
  };

  const getApplicationProgress = (status) => {
    const statusOrder = [
      'submitted', 'under_review', 'interview_scheduled', 
      'interview_completed', 'offer_extended', 'accepted'
    ];
    const currentIndex = statusOrder.indexOf(status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  const ApplicationCard = ({ application }) => {
    const statusInfo = applicationStatuses[application.status] || applicationStatuses['submitted'];
    const progress = getApplicationProgress(application.status);

    return (
      <Card 
        sx={{ 
          mb: 2,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" flexGrow={1}>
              <Avatar
                src={application.companyLogo}
                sx={{ width: 50, height: 50, mr: 2 }}
              >
                {application.company?.[0]}
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="h6" fontWeight="bold">
                  {application.jobTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {application.company}
                </Typography>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {application.location}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={statusInfo.label}
                color={statusInfo.color}
                size="small"
                icon={statusInfo.icon}
              />
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, application)}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </Box>

          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Application Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Applied on {new Date(application.appliedAt).toLocaleDateString()}
            </Typography>
            
            <Box display="flex" gap={1}>
              <Button
                size="small"
                startIcon={<Visibility />}
                onClick={() => handleViewDetails(application)}
              >
                View Details
              </Button>
              {application.interviewId && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CalendarToday />}
                  onClick={() => window.open(`/interviews/${application.interviewId}`, '_blank')}
                >
                  Interview
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const ApplicationTimeline = ({ application }) => {
    if (!application.timeline) return null;

    return (
      <Timeline>
        {application.timeline.map((event, index) => {
          const statusInfo = applicationStatuses[event.status] || applicationStatuses['submitted'];
          return (
            <TimelineItem key={index}>
              <TimelineOppositeContent color="text.secondary">
                {new Date(event.timestamp).toLocaleDateString()}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={statusInfo.color}>
                  {statusInfo.icon}
                </TimelineDot>
                {index < application.timeline.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6" component="span">
                  {statusInfo.label}
                </Typography>
                {event.note && (
                  <Typography color="text.secondary">
                    {event.note}
                  </Typography>
                )}
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Application Tracking
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assessment sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {applications.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Applications
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {applications.filter(app => 
                      !['accepted', 'rejected', 'withdrawn'].includes(app.status)
                    ).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Applications
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarToday sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {applications.filter(app => 
                      ['interview_scheduled', 'interview_completed'].includes(app.status)
                    ).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Interview Stage
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {applications.filter(app => app.status === 'accepted').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Offers Received
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Status Filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {Object.entries(applicationStatuses).map(([key, status]) => (
                  <MenuItem key={key} value={key}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs 
        value={selectedTab} 
        onChange={(e, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3 }}
      >
        {tabFilters.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            No applications found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {applications.length === 0 
              ? "You haven't applied to any jobs yet. Start exploring opportunities!"
              : "Try adjusting your filters to see more results."
            }
          </Typography>
          {applications.length === 0 && (
            <Button
              variant="contained"
              onClick={() => window.location.href = '/job-search'}
            >
              Search Jobs
            </Button>
          )}
        </Box>
      ) : (
        filteredApplications.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewDetails(menuApplication)}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => window.open(`/jobs/${menuApplication?.jobId}`, '_blank')}>
          <Work sx={{ mr: 1 }} />
          View Job Posting
        </MenuItem>
        {menuApplication?.interviewId && (
          <MenuItem onClick={() => window.open(`/interviews/${menuApplication.interviewId}`, '_blank')}>
            <CalendarToday sx={{ mr: 1 }} />
            View Interview
          </MenuItem>
        )}
        <Divider />
        {!['accepted', 'rejected', 'withdrawn'].includes(menuApplication?.status) && (
          <MenuItem 
            onClick={() => handleWithdraw(menuApplication?.id)}
            sx={{ color: 'error.main' }}
          >
            <Cancel sx={{ mr: 1 }} />
            Withdraw Application
          </MenuItem>
        )}
      </Menu>

      {/* Application Details Dialog */}
      <Dialog 
        open={detailsDialog} 
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Application Details
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedApplication.jobTitle} at {selectedApplication.company}
              </Typography>
              
              <ApplicationTimeline application={selectedApplication} />
              
              {selectedApplication.notes && (
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Application Notes
                  </Typography>
                  <Typography variant="body2">
                    {selectedApplication.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

