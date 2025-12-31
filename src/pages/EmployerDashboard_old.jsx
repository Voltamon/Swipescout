import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Chip,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Visibility as VisibilityIcon,
    PersonSearch as PersonSearchIcon,
    Work as WorkIcon,
    Message as MessageIcon,
    Notifications as NotificationsIcon,
    TrendingUp as TrendingUpIcon,
    PlayCircleOutline as PlayCircleOutlineIcon,
    Add as AddIcon,
    ArrowForward as ArrowForwardIcon,
    Business as BusinessIcon,
    People as PeopleIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import {
    getEmployerDashboardStats,
    getRecentActivities,
    getCandidateRecommendations,
    getJobPostings
} from '../services/dashboardService';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const DashboardContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: 'calc(100vh - 56px)',
}));

const StatsCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4],
    },
}));

const StatsCardContent = styled(CardContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
}));

const StatsIcon = styled(Box)(({ theme, color }) => ({
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette[color].light,
    color: theme.palette[color].main,
}));

const ActivityItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const EmployerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch dashboard statistics
                const statsResponse = await getEmployerDashboardStats();
                setStats(statsResponse.data.stats);

                // Fetch recent activities
                const activitiesResponse = await getRecentActivities();
                setActivities(activitiesResponse.data.activities);

                // Fetch candidate recommendations
                const recommendationsResponse = await getCandidateRecommendations();
                setRecommendations(recommendationsResponse.data.recommendations);

                // Fetch job postings
                const jobsResponse = await getJobPostings();
                setJobs(jobsResponse.data.jobs);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Views chart data
    const viewsChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Job Views',
                data: stats?.job_views_chart || [120, 190, 150, 250, 220, 300],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    };

    // Applicants chart data
    const applicantsChartData = {
        labels: stats?.job_titles || ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Project Manager', 'Digital Marketer'],
        datasets: [
            {
                label: 'Number of Applicants',
                data: stats?.applicants_per_job || [25, 18, 12, 8, 15],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Applicant sources chart data
    const applicantSourcesChartData = {
        labels: ['Direct Search', 'Referrals', 'Social Media', 'Job Boards', 'Other'],
        datasets: [
            {
                data: stats?.applicant_sources || [35, 25, 20, 15, 5],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <DashboardContainer maxWidth="lg" sx={{ mt: 3}}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">{'Welcome '+ user.displayName + ' to Your Dashboard' }  </Typography>

                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ mr: 1 }}
                    >{i18n.t('auto_post_new_job')}</Button>

                    <Button
                        variant="outlined"
                        startIcon={<BusinessIcon />}
                    >{i18n.t('auto_update_company_profile')}</Button>
                </Box>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard>
                        <StatsCardContent>
                            <StatsIcon color="primary">
                                <VisibilityIcon fontSize="large" />
                            </StatsIcon>
                            <Typography variant="h4" gutterBottom>
                                {stats?.total_job_views || 0}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">{i18n.t('auto_job_views')}</Typography>
                        </StatsCardContent>
                    </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard>
                        <StatsCardContent>
                            <StatsIcon color="success">
                                <PersonSearchIcon fontSize="large" />
                            </StatsIcon>
                            <Typography variant="h4" gutterBottom>
                                {stats?.total_applicants || 0}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">{i18n.t('auto_applicants')}</Typography>
                        </StatsCardContent>
                    </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard>
                        <StatsCardContent>
                            <StatsIcon color="warning">
                                <WorkIcon fontSize="large" />
                            </StatsIcon>
                            <Typography variant="h4" gutterBottom>
                                {stats?.active_jobs || 0}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">{i18n.t('auto_active_jobs')}</Typography>
                        </StatsCardContent>
                    </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard>
                        <StatsCardContent>
                            <StatsIcon color="info">
                                <MessageIcon fontSize="large" />
                            </StatsIcon>
                            <Typography variant="h4" gutterBottom>
                                {stats?.unread_messages || 0}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">{i18n.t('auto_unread_messages')}</Typography>
                        </StatsCardContent>
                    </StatsCard>
                </Grid>
            </Grid>

            {/* Charts and Recommendations */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ mb: 3 }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label={i18n.t('auto_overview')}  />
                            <Tab label={i18n.t('auto_active_jobs')}  />
                            <Tab label={i18n.t('auto_applicants')}  />
                        </Tabs>

                        <TabPanel value={tabValue} index={0}>
                            <Box sx={{ height: 300, mb: 4 }}>
                                <Typography variant="h6" gutterBottom>{i18n.t('auto_job_views')}</Typography>
                                <Line
                                    data={viewsChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                        },
                                    }}
                                />
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ height: 250 }}>
                                        <Typography variant="h6" gutterBottom>{i18n.t('auto_applicants_per_job')}</Typography>
                                        <Bar
                                            data={applicantsChartData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        display: false,
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ height: 250 }}>
                                        <Typography variant="h6" gutterBottom>{i18n.t('auto_applicant_sources')}</Typography>
                                        <Doughnut
                                            data={applicantSourcesChartData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <Typography variant="h6" gutterBottom>{i18n.t('auto_active_jobs')}</Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{i18n.t('auto_job_title')}</TableCell>
                                            <TableCell>{i18n.t('auto_posted_date')}</TableCell>
                                            <TableCell>{i18n.t('auto_views')}</TableCell>
                                            <TableCell>{i18n.t('auto_applicants')}</TableCell>
                                            <TableCell>{i18n.t('auto_status')}</TableCell>
                                            <TableCell>{i18n.t('auto_actions')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {jobs.map((job) => (
                                            <TableRow key={job.id}>
                                                <TableCell>{job.title}</TableCell>
                                                <TableCell>{new Date(job.created_at).toLocaleDateString('en-US')}</TableCell>
                                                <TableCell>{job.views}</TableCell>
                                                <TableCell>{job.applicants_count}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={job.status === 'active' ? 'Active' : 'Closed'}
                                                        color={job.status === 'active' ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button size="small" color="primary">{i18n.t('auto_view')}</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    endIcon={<ArrowForwardIcon />}
                                >{i18n.t('auto_view_all_jobs')}</Button>
                            </Box>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <Typography variant="h6" gutterBottom>{i18n.t('auto_latest_applicants')}</Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{i18n.t('auto_candidate')}</TableCell>
                                            <TableCell>{i18n.t('auto_job')}</TableCell>
                                            <TableCell>{i18n.t('auto_applied_date')}</TableCell>
                                            <TableCell>{i18n.t('auto_match_percentage')}</TableCell>
                                            <TableCell>{i18n.t('auto_status')}</TableCell>
                                            <TableCell>{i18n.t('auto_actions')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recommendations.slice(0, 5).map((candidate) => (
                                            <TableRow key={candidate.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar src={candidate.photoUrl} sx={{ mr: 1, width: 32, height: 32 }} />
                                                        {candidate.name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{candidate.job_title}</TableCell>
                                                <TableCell>{new Date(candidate.appliedAt).toLocaleDateString('en-US')}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={candidate.match_percentage + '%'}
                                                        color={
                                                            candidate.match_percentage > 80 ? 'success' :
                                                                candidate.match_percentage > 60 ? 'primary' : 'default'
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={
                                                            candidate.status === 'new' ? 'New' :
                                                                candidate.status === 'reviewed' ? 'Reviewed' :
                                                                    candidate.status === 'interview' ? 'Interview' : 'Rejected'
                                                        }
                                                        color={
                                                            candidate.status === 'new' ? 'info' :
                                                                candidate.status === 'reviewed' ? 'primary' :
                                                                    candidate.status === 'interview' ? 'success' : 'error'
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                            <TableCell>
                                            <Button size="small" color="primary">{i18n.t('auto_view')}</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                    >{i18n.t('auto_view_all_applicants')}</Button>
                </Box>
            </TabPanel>
        </Paper>
    </Grid>

    <Grid item xs={12} md={4}>
        <Paper sx={{ mb: 3 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{i18n.t('auto_recent_activities')}</Typography>
                <IconButton size="small">
                    <NotificationsIcon />
                </IconButton>
            </Box>

            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {activities.length === 0 ? (
                    <ListItem>
                        <ListItemText
                            primary="No recent activities"
                            secondary="Your activities will appear here as you interact with the application"
                        />
                    </ListItem>
                ) : (
                    activities.map((activity, index) => (
                        <ActivityItem key={index}>
                            <ListItemIcon>
                                {activity.type === 'view' && <VisibilityIcon color="primary" />}
                                {activity.type === 'application' && <PersonSearchIcon color="success" />}
                                {activity.type === 'job' && <WorkIcon color="warning" />}
                                {activity.type === 'message' && <MessageIcon color="info" />}
                            </ListItemIcon>
                            <ListItemText
                                primary={activity.title}
                                secondary={activity.time}
                            />
                        </ActivityItem>
                    ))
                )}
            </List>
        </Paper>

        <Paper>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{i18n.t('auto_recommended_candidates')}</Typography>
                <Button
                    endIcon={<ArrowForwardIcon />}
                    size="small"
                >{i18n.t('auto_view_all')}</Button>
            </Box>

            <List sx={{ maxHeight: 350, overflow: 'auto' }}>
                {recommendations.length === 0 ? (
                    <ListItem>
                        <ListItemText
                            primary="No recommendations currently"
                            secondary="Recommendations will appear here based on your posted jobs"
                        />
                    </ListItem>
                ) : (
                    recommendations.map((candidate, index) => (
                        <React.Fragment key={candidate.id}>
                            <ListItem
                                button
                                sx={{ py: 2 }}
                            >
                                <Avatar
                                    src={candidate.photoUrl}
                                    sx={{ mr: 2 }}
                                />
                                <ListItemText
                                    primary={candidate.name}
                                    secondary={
                                        <React.Fragment>
                                            <Typography variant="body2" component="span">
                                                {candidate.job_title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                <WorkIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                                                <Typography variant="body2" component="span" color="textSecondary">
                                                    {candidate.experience} years of experience
                                                </Typography>
                                            </Box>
                                        </React.Fragment>
                                    }
                                />
                                <Box>
                                    <Chip
                                        label={candidate.match_percentage + '%'}
                                        size="small"
                                        color={
                                            candidate.match_percentage > 80 ? 'success' :
                                                candidate.match_percentage > 60 ? 'primary' : 'default'
                                        }
                                    />
                                </Box>
                            </ListItem>
                            {index < recommendations.length - 1 && <Divider />}
                        </React.Fragment>
                    ))
                )}
            </List>
        </Paper>
    </Grid>
</Grid>

{/* Tips and Improvements Section */}
<Paper sx={{ p: 3, mt: 3 }}>
    <Typography variant="h6" gutterBottom>{i18n.t('auto_tips_to_attract_more_qualified_candidate')}</Typography>

    <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PlayCircleOutlineIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">{i18n.t('auto_add_a_video_to_your_job_posting')}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                        Jobs with videos receive 34% more applications than traditional text-based job posts.
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >{i18n.t('auto_add_video')}</Button>
                </CardContent>
            </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BusinessIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">{i18n.t('auto_complete_your_company_profile')}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                        Companies with complete profiles attract higher quality candidates and increase acceptance rates.
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >{i18n.t('auto_update_profile')}</Button>
                </CardContent>
            </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">{i18n.t('auto_analyze_job_performance')}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                        Review your job performance analytics to improve visibility and application rates for future postings.
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >{i18n.t('auto_view_analytics')}</Button>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
</Paper>
</DashboardContainer>
);
};

export default EmployerDashboard;