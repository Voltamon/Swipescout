import React, { useContext, useState, useEffect  } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Dashboard,
  People,
  VideoLibrary,
  Work,
  Analytics,
  Settings,
  Block,
  CheckCircle,
  Warning,
  Delete,
  Edit,
  Visibility,
  TrendingUp,
  TrendingDown,
  Psychology
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalJobs: 0,
    activeUsers: 0,
    pendingReports: 0,
    aiAnalyses: 0
  });
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalUsers: 1250,
        totalVideos: 3420,
        totalJobs: 890,
        activeUsers: 890,
        pendingReports: 12,
        aiAnalyses: 2150
      });

      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'job_seeker', status: 'active', joinDate: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'employer', status: 'active', joinDate: '2024-01-20' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'job_seeker', status: 'suspended', joinDate: '2024-02-01' }
      ]);

      setVideos([
        { id: 1, title: 'Frontend Developer Introduction', user: 'John Doe', status: 'approved', views: 1250, reports: 0 },
        { id: 2, title: 'Company Culture Video', user: 'Jane Smith', status: 'pending', views: 890, reports: 2 },
        { id: 3, title: 'Software Engineer Portfolio', user: 'Bob Johnson', status: 'flagged', views: 450, reports: 5 }
      ]);

      setJobs([
        { id: 1, title: 'Senior React Developer', company: 'Tech Corp', status: 'active', applications: 45, posted: '2024-03-01' },
        { id: 2, title: 'UX Designer', company: 'Design Studio', status: 'active', applications: 32, posted: '2024-03-05' },
        { id: 3, title: 'Backend Engineer', company: 'StartupXYZ', status: 'expired', applications: 28, posted: '2024-02-15' }
      ]);

      setReports([
        { id: 1, type: 'video', itemId: 2, reason: 'Inappropriate content', reporter: 'User123', status: 'pending' },
        { id: 2, type: 'user', itemId: 3, reason: 'Spam behavior', reporter: 'User456', status: 'investigating' },
        { id: 3, type: 'job', itemId: 1, reason: 'Misleading information', reporter: 'User789', status: 'resolved' }
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAction = (action, item) => {
    setSelectedItem({ ...item, action });
    setDialogOpen(true);
  };

  const confirmAction = () => {
    // Implement action logic here
    console.log(`Performing ${selectedItem.action} on:`, selectedItem);
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { color: 'success', label: 'Active' },
      pending: { color: 'warning', label: 'Pending' },
      suspended: { color: 'error', label: 'Suspended' },
      approved: { color: 'success', label: 'Approved' },
      flagged: { color: 'error', label: 'Flagged' },
      expired: { color: 'default', label: 'Expired' },
      investigating: { color: 'info', label: 'Investigating' },
      resolved: { color: 'success', label: 'Resolved' }
    };

    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Dashboard color="primary" />
        {t('admin.title', 'Admin Dashboard')}
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <People color="primary" />
                <Box>
                  <Typography variant="h6">{stats.totalUsers}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.totalUsers', 'Total Users')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <VideoLibrary color="primary" />
                <Box>
                  <Typography variant="h6">{stats.totalVideos}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.totalVideos', 'Total Videos')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Work color="primary" />
                <Box>
                  <Typography variant="h6">{stats.totalJobs}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.totalJobs', 'Total Jobs')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp color="success" />
                <Box>
                  <Typography variant="h6">{stats.activeUsers}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.activeUsers', 'Active Users')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Warning color="warning" />
                <Box>
                  <Typography variant="h6">{stats.pendingReports}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.pendingReports', 'Pending Reports')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Psychology color="info" />
                <Box>
                  <Typography variant="h6">{stats.aiAnalyses}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.aiAnalyses', 'AI Analyses')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin dashboard tabs">
        <Tab label={t('admin.users', 'Users')} icon={<People />} iconPosition="start" />
        <Tab label={t('admin.videos', 'Videos')} icon={<VideoLibrary />} iconPosition="start" />
        <Tab label={t('admin.jobs', 'Jobs')} icon={<Work />} iconPosition="start" />
        <Tab label={t('admin.reports', 'Reports')} icon={<Warning />} iconPosition="start" />
        <Tab label={t('admin.analytics', 'Analytics')} icon={<Analytics />} iconPosition="start" />
        <Tab label={t('admin.settings', 'Settings')} icon={<Settings />} iconPosition="start" />
      </Tabs>

      {/* Users Tab */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.user', 'User')}</TableCell>
                <TableCell>{t('admin.email', 'Email')}</TableCell>
                <TableCell>{t('admin.role', 'Role')}</TableCell>
                <TableCell>{t('admin.status', 'Status')}</TableCell>
                <TableCell>{t('admin.joinDate', 'Join Date')}</TableCell>
                <TableCell>{t('admin.actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar>{user.name.charAt(0)}</Avatar>
                      <Typography>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role.replace('_', ' ')} 
                      variant="outlined" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{getStatusChip(user.status)}</TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleAction('view', user)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit User">
                      <IconButton size="small" onClick={() => handleAction('edit', user)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.status === 'active' ? 'Suspend' : 'Activate'}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleAction(user.status === 'active' ? 'suspend' : 'activate', user)}
                      >
                        {user.status === 'active' ? <Block /> : <CheckCircle />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Videos Tab */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.title', 'Title')}</TableCell>
                <TableCell>{t('admin.user', 'User')}</TableCell>
                <TableCell>{t('admin.status', 'Status')}</TableCell>
                <TableCell>{t('admin.views', 'Views')}</TableCell>
                <TableCell>{t('admin.reports', 'Reports')}</TableCell>
                <TableCell>{t('admin.actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>{video.title}</TableCell>
                  <TableCell>{video.user}</TableCell>
                  <TableCell>{getStatusChip(video.status)}</TableCell>
                  <TableCell>{video.views.toLocaleString()}</TableCell>
                  <TableCell>
                    {video.reports > 0 && (
                      <Chip 
                        label={video.reports} 
                        color="error" 
                        size="small" 
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Video">
                      <IconButton size="small" onClick={() => handleAction('view', video)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Approve/Reject">
                      <IconButton size="small" onClick={() => handleAction('moderate', video)}>
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleAction('delete', video)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Jobs Tab */}
      <TabPanel value={tabValue} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.jobTitle', 'Job Title')}</TableCell>
                <TableCell>{t('admin.company', 'Company')}</TableCell>
                <TableCell>{t('admin.status', 'Status')}</TableCell>
                <TableCell>{t('admin.applications', 'Applications')}</TableCell>
                <TableCell>{t('admin.posted', 'Posted')}</TableCell>
                <TableCell>{t('admin.actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{getStatusChip(job.status)}</TableCell>
                  <TableCell>{job.applications}</TableCell>
                  <TableCell>{new Date(job.posted).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Tooltip title="View Job">
                      <IconButton size="small" onClick={() => handleAction('view', job)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Job">
                      <IconButton size="small" onClick={() => handleAction('edit', job)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleAction('delete', job)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Reports Tab */}
      <TabPanel value={tabValue} index={3}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('admin.reportsAlert', 'Review and handle user reports promptly to maintain platform quality.')}
        </Alert>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.type', 'Type')}</TableCell>
                <TableCell>{t('admin.reason', 'Reason')}</TableCell>
                <TableCell>{t('admin.reporter', 'Reporter')}</TableCell>
                <TableCell>{t('admin.status', 'Status')}</TableCell>
                <TableCell>{t('admin.actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Chip 
                      label={report.type} 
                      variant="outlined" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{report.reporter}</TableCell>
                  <TableCell>{getStatusChip(report.status)}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleAction('investigate', report)}
                    >
                      {t('admin.investigate', 'Investigate')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info">
              {t('admin.analyticsInfo', 'Advanced analytics and reporting features will be available here.')}
            </Alert>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info">
              {t('admin.settingsInfo', 'System settings and configuration options will be available here.')}
            </Alert>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Action Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {t('admin.confirmAction', 'Confirm Action')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('admin.confirmMessage', `Are you sure you want to ${selectedItem?.action} this ${selectedItem?.name || selectedItem?.title || 'item'}?`)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={confirmAction} variant="contained" color="primary">
            {t('common.confirm', 'Confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;

