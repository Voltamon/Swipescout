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
    LinearProgress,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles'; // <--- added import
import { useNavigate } from 'react-router-dom';
import {
    Visibility as VisibilityIcon,
    ThumbUp as ThumbUpIcon,
    Work as WorkIcon,
    Message as MessageIcon,
    Notifications as NotificationsIcon,
    TrendingUp as TrendingUpIcon,
    PlayCircleOutline as PlayCircleOutlineIcon,
    Add as AddIcon,
    ArrowForward as ArrowForwardIcon,
    LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { getJobSeekerDashboardStats, getRecentActivities, getJobRecommendations } from '../services/dashboardService';
import { getSwipeStats, getVideoEngagement, addUserSkill, getSkills, createSkill } from '@/services/api';
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

const JobSeekerDashboard = () => {
  // const { user } = useAuth(); // Removed: unused variable
    const navigate = useNavigate(); // <--- existing
    const theme = useTheme(); // <--- moved here (before any early returns / JSX)
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [swipeStats, setSwipeStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openAddSkillDialog, setOpenAddSkillDialog] = useState(false);
    const [viewAllOpen, setViewAllOpen] = useState(false);
    const [viewAllPage, setViewAllPage] = useState(1);
    const itemsPerPage = 6;
    const [newSkillName, setNewSkillName] = useState("");
    const [newSkillLevel, setNewSkillLevel] = useState("Intermediate");
    const [newSkillYears, setNewSkillYears] = useState(0);
    const [addingSkill, setAddingSkill] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch dashboard statistics
                const statsResponse = await getJobSeekerDashboardStats();
                // service returns response.data — accept multiple shapes defensively
                const statsPayload = statsResponse?.stats ?? statsResponse?.data ?? statsResponse;
                setStats(statsPayload || {});

                // Fetch aggregated video engagement (likes/shares/saves) for Job Engagement visualization
                try {
                    const videoEngResp = await getVideoEngagement();
                    const videoEngPayload = videoEngResp?.data?.stats ?? videoEngResp?.stats ?? videoEngResp?.data ?? videoEngResp;
                    // Normalized to { likes, shares, saves, likesPct, sharesPct, savesPct }
                    setSwipeStats({ videoEngagement: videoEngPayload?.stats ? videoEngPayload.stats : videoEngPayload });
                } catch (e) {
                    console.warn('Failed to fetch video engagement stats:', e);
                    // fall back to old swipe stats if available
                    try {
                        const swipeResp = await getSwipeStats();
                        const swipePayload = swipeResp?.stats ?? swipeResp?.data ?? swipeResp;
                        setSwipeStats(swipePayload || null);
                    } catch (err) {
                        setSwipeStats(null);
                    }
                }

                // Fetch recent activities (ask backend for jobseeker activities)
                const activitiesResponse = await getRecentActivities('jobseeker');
                const activitiesPayload = activitiesResponse?.activities ?? activitiesResponse?.data ?? activitiesResponse;
                const rawActivities = Array.isArray(activitiesPayload) ? activitiesPayload : (activitiesPayload?.activities || []);
                const normalized = rawActivities.map(a => ({
                    type: a.type || a.event_type || a.action || a.activityType || 'activity',
                    title: a.title || a.message || a.description || a.action || (a.type ? `${a.type} event` : 'Activity'),
                    time: a.time || a.created_at || a.date || a.timestamp || ''
                }));
                setActivities(normalized);

                // Fetch job recommendations
                const recommendationsResponse = await getJobRecommendations();
                const recsPayload = recommendationsResponse?.recommendations ?? recommendationsResponse?.data ?? recommendationsResponse;
                setRecommendations(Array.isArray(recsPayload) ? recsPayload : (recsPayload?.recommendations || []));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Activity chart data — derive from multiple possible shapes
    const activityLabels = stats?.profile_views_chart?.labels
        ?? stats?.profileViewsChart?.labels
        ?? (stats?.profile_views_daily?.map(d => d.date))
        ?? ['Week 1','Week 2','Week 3','Week 4'];

    const activityData = stats?.profile_views_chart?.data
        ?? stats?.profileViewsChart?.data
        ?? (stats?.profile_views_daily?.map(d => d.views))
        ?? (Array.isArray(stats?.profile_views) ? stats.profile_views : null)
        ?? [12,19,15,25,22,30];

    const activityChartData = {
        labels: activityLabels,
        datasets: [
            {
                label: 'Profile Views',
                data: activityData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.12)',
                tension: 0.4,
            }
        ]
    };

    // Job Engagement chart data (video engagement: likes / shares / saves)
    const videoEng = swipeStats?.videoEngagement ?? stats?.video_engagement ?? stats?.videoEngagement ?? null;
    const likes = videoEng?.likes ?? videoEng?.likesPct ?? 0;
    const shares = videoEng?.shares ?? videoEng?.sharesPct ?? 0;
    const saves = videoEng?.saves ?? videoEng?.savesPct ?? 0;

    // If backend returned absolute numbers, compute relative percentages for the chart
    let chartValues = [likes, shares, saves];
    if (videoEng && typeof videoEng.likes === 'number' && typeof videoEng.shares === 'number' && typeof videoEng.saves === 'number') {
        const total = (videoEng.likes + videoEng.shares + videoEng.saves) || 1;
        chartValues = [
            Math.round((videoEng.likes / total) * 100),
            Math.round((videoEng.shares / total) * 100),
            Math.round((videoEng.saves / total) * 100)
        ];
    } else if (videoEng && typeof videoEng.likesPct === 'number') {
        chartValues = [videoEng.likesPct, videoEng.sharesPct, videoEng.savesPct];
    } else if (!videoEng) {
        chartValues = [60,25,15]; // fallback
    }

    const swipeChartData = {
        labels: ['Likes', 'Shares', 'Saves'],
        datasets: [
            {
                data: chartValues,
                backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,206,86,0.6)', 'rgba(153,102,255,0.6)'],
                borderColor: ['rgba(75,192,192,1)', 'rgba(255,206,86,1)', 'rgba(153,102,255,1)'],
                borderWidth: 1
            }
        ]
    };

    const skillsSource = stats?.skills_chart ?? stats?.skillsChart ?? [];
    const skillsChartData = {
        labels: (skillsSource || []).map(s => s.name) || ['React','JavaScript'],
        datasets: [
            {
                label: 'Skill Level',
                data: (skillsSource || []).map(s => s.level) || [85,90],
                backgroundColor: 'rgba(54,162,235,0.6)',
                borderColor: 'rgba(54,162,235,1)',
                borderWidth: 1
            }
        ]
    };

    // Add Skill handlers
    const handleOpenAddSkill = () => {
        setNewSkillName("");
        setNewSkillLevel("Intermediate");
        setNewSkillYears(0);
        setOpenAddSkillDialog(true);
    };

    const handleCloseAddSkill = () => {
        setOpenAddSkillDialog(false);
    };

    const handleConfirmAddSkill = async () => {
        if (!newSkillName.trim()) return;
        setAddingSkill(true);
        try {
            // Ensure the skill exists in global skills table: try search first
            let skillId = null;
            try {
                const searchRes = await getSkills(newSkillName);
                const found = (searchRes?.data?.skills || searchRes?.skills || []).find(s => s.name?.toLowerCase() === newSkillName.trim().toLowerCase());
                if (found) skillId = found.id;
            } catch (e) {
                // ignore search errors and try to create
            }

            // If skill not found, create it using general skills endpoint
            if (!skillId) {
                try {
                    const createRes = await createSkill({ name: newSkillName });
                    skillId = createRes?.data?.skill?.id || createRes?.skill?.id;
                } catch (err) {
                    // If create returns 400 (already exists), try fetching again
                    try {
                        const retry = await getSkills(newSkillName);
                        const found2 = (retry?.data?.skills || retry?.skills || []).find(s => s.name?.toLowerCase() === newSkillName.trim().toLowerCase());
                        if (found2) skillId = found2.id;
                    } catch (e2) {
                        console.error('Failed to create or find skill:', e2);
                    }
                }
            }

            if (!skillId) {
                throw new Error('Unable to resolve skill id for: ' + newSkillName);
            }

            // Call job-seeker addSkill endpoint which expects { skill_id, level, years_experience }
            const payload = {
                skill_id: skillId,
                level: newSkillLevel,
                years_experience: Number(newSkillYears || 0)
            };

            await addUserSkill(payload);

            // refresh dashboard/stats
            const statsResponse = await getJobSeekerDashboardStats();
            const statsPayload = statsResponse?.stats ?? statsResponse?.data ?? statsResponse;
            setStats(statsPayload || {});
        } catch (e) {
            console.error('Add skill error:', e);
        } finally {
            setAddingSkill(false);
            setOpenAddSkillDialog(false);
        }
    };

    // Navigate to video upload tab
    const handleUploadVideoClick = () => {
        navigate('/jobseeker-tabs?group=profileContent&tab=video-upload');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <DashboardContainer maxWidth="lg" sx={{ mt: 4 ,
    bgcolor: 'background.jobseeker',
    padding: theme.spacing(2),
    mb: 0,
    paddingBottom: 4,
}}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Dashboard</Typography>

                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayCircleOutlineIcon />}
                        sx={{ mr: 1 }}
                        onClick={handleUploadVideoClick} // <--- navigate to tab
                    >
                        Upload Video CV
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddSkill} // <--- open dialog
                    >
                        Add Skills
                    </Button>
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
                                {stats?.profile_views ?? stats?.profileViews ?? 0}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Profile Views
                            </Typography>
                        </StatsCardContent>
                    </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard>
                        <StatsCardContent>
                            <StatsIcon color="success">
                                <ThumbUpIcon fontSize="large" />
                            </StatsIcon>
                            <Typography variant="h4" gutterBottom>
                                {stats?.matches || 0}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Matches
                            </Typography>
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
                                {stats?.applications || 0}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Applications
                            </Typography>
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
                            <Typography variant="subtitle1" color="textSecondary">
                                Unread Messages
                            </Typography>
                        </StatsCardContent>
                    </StatsCard>
                </Grid>
            </Grid>

            {/* Charts and Recommendations */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Profile Activity
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Line
                                data={activityChartData}
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
                    </Paper>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Job Engagement
                                </Typography>
                                <Box sx={{ height: 250 }}>
                                    <Doughnut
                                        data={swipeChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Skill Level
                                </Typography>
                                <Box sx={{ height: 250 }}>
                                    <Bar
                                        data={skillsChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            indexAxis: 'y',
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ mb: 3 }}>
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">
                                Recent Activities
                            </Typography>
                            <IconButton size="small">
                                <NotificationsIcon />
                            </IconButton>
                        </Box>

                        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                            { (activities?.length ?? 0) === 0 ? (
                                <ListItem>
                                    <ListItemText
                                        primary="No recent activities"
                                        secondary="Your activities will appear here as you interact with the platform"
                                    />
                                </ListItem>
                            ) : (
                                activities.map((activity, index) => (
                                    <ActivityItem key={index}>
                                        <ListItemIcon>
                                            {activity.type === 'view' && <VisibilityIcon color="primary" />}
                                            {activity.type === 'match' && <ThumbUpIcon color="success" />}
                                            {activity.type === 'application' && <WorkIcon color="warning" />}
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
                            <Typography variant="h6">
                                Recommended Jobs
                            </Typography>
                            <Button
                                endIcon={<ArrowForwardIcon />}
                                size="small"
                                onClick={() => setViewAllOpen(true)}
                            >
                                View All
                            </Button>
                        </Box>

                        <List sx={{ maxHeight: 350, overflow: 'auto' }}>
                            {recommendations.length === 0 ? (
                                <ListItem>
                                    <ListItemText
                                        primary="No recommendations at the moment"
                                        secondary="Recommendations will appear here based on your skills and interests"
                                    />
                                </ListItem>
                            ) : (
                                recommendations.map((job, index) => (
                                    <React.Fragment key={job.id}>
                                        <ListItem
                                            button
                                            sx={{ py: 2 }}
                                        >
                                            <Avatar
                                                src={job.company.logo_url}
                                                sx={{ mr: 2 }}
                                            />
                                            <ListItemText
                                                primary={job.title}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography variant="body2" component="span">
                                                            {job.company.name}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                                                            <Typography variant="body2" component="span" color="textSecondary">
                                                                {job.location}
                                                            </Typography>
                                                        </Box>
                                                    </React.Fragment>
                                                }
                                            />
                                            <Box>
                                                <Chip
                                                    label={job.match_percentage + '%'}
                                                    size="small"
                                                    color="primary"
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
                <Typography variant="h6" gutterBottom>
                    Tips to Improve Your Chances
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="subtitle1">
                                        Complete Your Profile
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                    Complete profiles get more attention from employers.
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={stats?.profile_completion || 0}
                                    sx={{ mt: 2 }}
                                />
                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}>
                            {typeof stats?.profile_completion === 'number' ? `${stats.profile_completion}% Complete` : `${stats?.profile_completion ?? 0}% Complete`}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PlayCircleOutlineIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="subtitle1">
                                        Add Video CV
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                    A video increases matching chances by 70% and makes you stand out.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={handleUploadVideoClick}
                                >
                                    Upload Video
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <WorkIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1">
                                    Update Your Skills
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                                Add the most in-demand skills in your field to increase your visibility.
                            </Typography>
                            <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={handleOpenAddSkill}
                                >
                                    Add Skills
                                </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>

        {/* Add Skill Dialog */}
        <Dialog open={openAddSkillDialog} onClose={handleCloseAddSkill} maxWidth="sm" fullWidth>
            <DialogTitle>Add a Skill</DialogTitle>
            <DialogContent>
                <TextField
                    label="Skill name"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Level</InputLabel>
                    <Select
                        value={newSkillLevel}
                        label="Level"
                        onChange={(e) => setNewSkillLevel(e.target.value)}
                    >
                        <MenuItem value="Beginner">Beginner</MenuItem>
                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                        <MenuItem value="Advanced">Advanced</MenuItem>
                        <MenuItem value="Expert">Expert</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Years of experience"
                    type="number"
                    value={newSkillYears}
                    onChange={(e) => setNewSkillYears(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseAddSkill} disabled={addingSkill}>Cancel</Button>
                <Button onClick={handleConfirmAddSkill} variant="contained" disabled={addingSkill}>
                    {addingSkill ? <CircularProgress size={20} /> : "Add Skill"}
                </Button>
            </DialogActions>
        </Dialog>
        {/* View All Recommendations Dialog */}
        <Dialog open={viewAllOpen} onClose={() => setViewAllOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Recommended Jobs</DialogTitle>
            <DialogContent>
                <List>
                    {recommendations.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No recommendations" secondary="There are no recommendations to show right now." />
                        </ListItem>
                    ) : (
                        (recommendations.slice((viewAllPage - 1) * itemsPerPage, viewAllPage * itemsPerPage)).map((job) => (
                            <ListItem key={job.id} sx={{ py: 1.5 }}>
                                <Avatar src={job.company?.logo_url} sx={{ mr: 2 }} />
                                <ListItemText
                                    primary={job.title}
                                    secondary={job.company?.name + (job.location ? ` • ${job.location}` : '')}
                                />
                                <Chip label={job.match_percentage ? `${job.match_percentage}%` : job.score ? Math.round(job.score) + '%' : '—'} size="small" color="primary" />
                            </ListItem>
                        ))
                    )}
                </List>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}> 
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button onClick={() => setViewAllPage(p => Math.max(1, p - 1))} disabled={viewAllPage === 1}>Previous</Button>
                    <Typography variant="body2">Page {viewAllPage} of {Math.max(1, Math.ceil(recommendations.length / itemsPerPage))}</Typography>
                    <Button onClick={() => setViewAllPage(p => Math.min(Math.ceil(recommendations.length / itemsPerPage), p + 1))} disabled={viewAllPage >= Math.ceil(recommendations.length / itemsPerPage)}>Next</Button>
                </Box>
                <Button onClick={() => setViewAllOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    </DashboardContainer>
);
};

export default JobSeekerDashboard;




