import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  LinearProgress,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Container,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Build,
  PlayArrow,
  Stop,
  Refresh,
  Settings,
  Warning,
  CheckCircle,
  Error,
  Schedule,
  Storage,
  Security,
  Speed,
  Backup,
  CleaningServices,
  MoreVert,
  Download,
  Upload,
  Visibility,
  VisibilityOff,
  TrendingUp,
  Assessment,
  Timeline,
  BarChart
} from '@mui/icons-material';
import { 
  getMaintenanceTasks,
  runMaintenanceTask,
  runPendingTasks,
  getMaintenanceResults,
  getSystemHealth,
  setMaintenanceMode,
  getMaintenanceMode,
  updateMaintenanceTask,
  getMaintenanceStatistics,
  forceRunTask,
  exportMaintenanceData
} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';

const categoryIcons = {
  database: <Storage />,
  files: <CleaningServices />,
  logs: <Assessment />,
  cache: <Speed />,
  security: <Security />,
  performance: <TrendingUp />,
  backup: <Backup />
};

const priorityColors = {
  low: 'default',
  medium: 'warning',
  high: 'error',
  critical: 'error'
};

const statusColors = {
  pending: 'default',
  running: 'info',
  completed: 'success',
  failed: 'error'
};

export default function MaintenanceDashboard() {
  const { t } = useTranslation();
  // const { user } = useAuth(); // Removed: unused variable
  
  const [tasks, setTasks] = useState([]);
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [runningTasks, setRunningTasks] = useState(new Set());
  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Dialog states
  const [taskDialog, setTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  
  // Menu states
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuTask, setMenuTask] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, resultsRes, healthRes, modeRes, statsRes] = await Promise.all([
        getMaintenanceTasks(),
        getMaintenanceResults(),
        getSystemHealth(),
        getMaintenanceMode(),
        getMaintenanceStatistics()
      ]);
      
      setTasks(tasksRes.data.tasks || []);
      setResults(resultsRes.data.results || []);
      setSystemHealth(healthRes.data.health || {});
      setMaintenanceModeState(modeRes.data.maintenanceMode || false);
      setStatistics(statsRes.data.statistics || {});
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      setError('Failed to fetch maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const handleRunTask = async (taskId, force = false) => {
    try {
      setRunningTasks(prev => new Set([...prev, taskId]));
      
      if (force) {
        await forceRunTask(taskId);
      } else {
        await runMaintenanceTask(taskId);
      }
      
      await fetchData();
    } catch (error) {
      console.error('Error running task:', error);
      setError(`Failed to run task: ${error.message}`);
    } finally {
      setRunningTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleRunPendingTasks = async () => {
    try {
      setLoading(true);
      await runPendingTasks();
      await fetchData();
    } catch (error) {
      console.error('Error running pending tasks:', error);
      setError('Failed to run pending tasks');
    }
  };

  const handleToggleMaintenanceMode = async () => {
    try {
      const newMode = !maintenanceMode;
      await setMaintenanceMode(newMode);
      setMaintenanceModeState(newMode);
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      setError('Failed to toggle maintenance mode');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await updateMaintenanceTask(taskId, updates);
      await fetchData();
      setTaskDialog(false);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const handleExportData = async (format = 'json') => {
    try {
      const response = await exportMaintenanceData(format);
      
      // Create download link
      const blob = new Blob([format === 'json' ? JSON.stringify(response.data, null, 2) : response.data], {
        type: format === 'json' ? 'application/json' : 'text/csv'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `maintenance-export.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data');
    }
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getHealthStatus = () => {
    if (!systemHealth) return { color: 'default', text: 'Unknown' };
    
    switch (systemHealth.status) {
      case 'healthy':
        return { color: 'success', text: 'Healthy' };
      case 'warning':
        return { color: 'warning', text: 'Warning' };
      case 'critical':
        return { color: 'error', text: 'Critical' };
      default:
        return { color: 'default', text: 'Unknown' };
    }
  };

  const TaskCard = ({ task }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {categoryIcons[task.category] || <Build />}
            <Typography variant="h6" noWrap>
              {task.name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              setMenuAnchor(e.currentTarget);
              setMenuTask(task);
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          {task.description}
        </Typography>
        
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip
            label={task.status}
            color={statusColors[task.status]}
            size="small"
          />
          <Chip
            label={task.priority}
            color={priorityColors[task.priority]}
            size="small"
          />
          <Chip
            label={task.frequency}
            variant="outlined"
            size="small"
          />
        </Box>
        
        <Box mb={2}>
          <Typography variant="caption" color="text.secondary">
            Last Run: {task.lastRun ? new Date(task.lastRun).toLocaleString() : 'Never'}
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Next Run: {task.nextRun ? new Date(task.nextRun).toLocaleString() : 'N/A'}
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant="contained"
            startIcon={runningTasks.has(task.id) ? <CircularProgress size={16} /> : <PlayArrow />}
            onClick={() => handleRunTask(task.id)}
            disabled={runningTasks.has(task.id) || !task.enabled}
          >{i18n.t('auto_run')}</Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => {
              setSelectedTask(task);
              setTaskDialog(true);
            }}
          >{i18n.t('auto_configure')}</Button>
        </Box>
      </CardContent>
    </Card>
  );

  const ResultsTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{i18n.t('auto_task')}</TableCell>
            <TableCell>{i18n.t('auto_status')}</TableCell>
            <TableCell>{i18n.t('auto_start_time')}</TableCell>
            <TableCell>{i18n.t('auto_duration')}</TableCell>
            <TableCell>{i18n.t('auto_message')}</TableCell>
            <TableCell>{i18n.t('auto_actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.slice(0, 20).map((result, index) => (
            <TableRow key={index}>
              <TableCell>
                {tasks.find(t => t.id === result.taskId)?.name || result.taskId}
              </TableCell>
              <TableCell>
                <Chip
                  label={result.success ? 'Success' : 'Failed'}
                  color={result.success ? 'success' : 'error'}
                  size="small"
                  icon={result.success ? <CheckCircle /> : <Error />}
                />
              </TableCell>
              <TableCell>
                {new Date(result.startTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {formatDuration(result.duration)}
              </TableCell>
              <TableCell>
                <Tooltip title={result.message}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {result.message}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <IconButton size="small">
                  <Visibility />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const StatisticsCards = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Build color="primary" />
              <Box>
                <Typography variant="h4">{statistics?.totalTasks || 0}</Typography>
                <Typography variant="body2" color="text.secondary">{i18n.t('auto_total_tasks')}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Schedule color="warning" />
              <Box>
                <Typography variant="h4">{statistics?.pendingTasks || 0}</Typography>
                <Typography variant="body2" color="text.secondary">{i18n.t('auto_pending_tasks')}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <CheckCircle color="success" />
              <Box>
                <Typography variant="h4">{statistics?.completedRuns || 0}</Typography>
                <Typography variant="body2" color="text.secondary">{i18n.t('auto_completed_runs')}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Error color="error" />
              <Box>
                <Typography variant="h4">{statistics?.failedRuns || 0}</Typography>
                <Typography variant="body2" color="text.secondary">{i18n.t('auto_failed_runs')}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (loading && tasks.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const healthStatus = getHealthStatus();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Build color="primary" />
          {t('maintenance.title', 'Maintenance Dashboard')}
        </Typography>
        
        <Box display="flex" gap={1} alignItems="center">
          <Chip
            label={`System ${healthStatus.text}`}
            color={healthStatus.color}
            icon={healthStatus.color === 'success' ? <CheckCircle /> : <Warning />}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={maintenanceMode}
                onChange={handleToggleMaintenanceMode}
                color="warning"
              />
            }
            label={i18n.t('auto_maintenance_mode')} 
          />
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchData}
            disabled={loading}
          >{i18n.t('auto_refresh')}</Button>
          
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleRunPendingTasks}
            disabled={loading}
          >{i18n.t('auto_run_pending')}</Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {maintenanceMode && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          System is currently in maintenance mode. Some features may be unavailable.
        </Alert>
      )}

      {/* Statistics */}
      {statistics && (
        <Box mb={4}>
          <StatisticsCards />
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label={i18n.t('auto_tasks')}  />
          <Tab label={i18n.t('auto_results')}  />
          <Tab label={i18n.t('auto_analytics_1')}  />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
              <TaskCard task={task} />
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 1 && <ResultsTable />}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{i18n.t('auto_tasks_by_category')}</Typography>
                <List>
                  {Object.entries(statistics?.tasksByCategory || {}).map(([category, count]) => (
                    <ListItem key={category}>
                      <ListItemIcon>
                        {categoryIcons[category] || <Build />}
                      </ListItemIcon>
                      <ListItemText primary={category} />
                      <ListItemSecondaryAction>
                        <Chip label={count} size="small" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{i18n.t('auto_recent_activity')}</Typography>
                <List>
                  {statistics?.recentActivity?.map((activity, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {activity.success ? <CheckCircle color="success" /> : <Error color="error" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={tasks.find(t => t.id === activity.taskId)?.name || activity.taskId}
                        secondary={`${formatDuration(activity.duration * 1000)} - ${new Date(activity.timestamp).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Task Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleRunTask(menuTask?.id)}>
          <PlayArrow sx={{ mr: 1 }} />{i18n.t('auto_run_task')}</MenuItem>
        <MenuItem onClick={() => handleRunTask(menuTask?.id, true)}>
          <PlayArrow sx={{ mr: 1 }} />{i18n.t('auto_force_run')}</MenuItem>
        <MenuItem onClick={() => {
          setSelectedTask(menuTask);
          setTaskDialog(true);
          setMenuAnchor(null);
        }}>
          <Settings sx={{ mr: 1 }} />{i18n.t('auto_configure')}</MenuItem>
        <Divider />
        <MenuItem onClick={() => handleExportData('json')}>
          <Download sx={{ mr: 1 }} />{i18n.t('auto_export_json')}</MenuItem>
        <MenuItem onClick={() => handleExportData('csv')}>
          <Download sx={{ mr: 1 }} />{i18n.t('auto_export_csv')}</MenuItem>
      </Menu>

      {/* Task Configuration Dialog */}
      <Dialog 
        open={taskDialog} 
        onClose={() => setTaskDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Configure Task: {selectedTask?.name}</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Box sx={{ pt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedTask.enabled}
                    onChange={(e) => setSelectedTask({
                      ...selectedTask,
                      enabled: e.target.checked
                    })}
                  />
                }
                label={i18n.t('auto_enabled_1')} 
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary">
                {selectedTask.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialog(false)}>{i18n.t('auto_cancel')}</Button>
          <Button 
            onClick={() => handleUpdateTask(selectedTask?.id, {
              enabled: selectedTask?.enabled
            })}
            variant="contained"
          >{i18n.t('auto_save')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

