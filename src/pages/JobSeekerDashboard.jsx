import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Eye, ThumbsUp, Briefcase, MessageSquare, Bell, TrendingUp,
    PlayCircle, Plus, ArrowRight, MapPin, Loader2
} from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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

const JobSeekerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
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
                const statsPayload = statsResponse?.stats ?? statsResponse?.data ?? statsResponse;
                setStats(statsPayload || {});

                // Fetch video engagement stats
                try {
                    const videoEngResp = await getVideoEngagement();
                    const videoEngPayload = videoEngResp?.data?.stats ?? videoEngResp?.stats ?? videoEngResp?.data ?? videoEngResp;
                    setSwipeStats({ videoEngagement: videoEngPayload?.stats ? videoEngPayload.stats : videoEngPayload });
                } catch (e) {
                    console.warn('Failed to fetch video engagement stats:', e);
                    try {
                        const swipeResp = await getSwipeStats();
                        const swipePayload = swipeResp?.stats ?? swipeResp?.data ?? swipeResp;
                        setSwipeStats(swipePayload || null);
                    } catch (err) {
                        setSwipeStats(null);
                    }
                }

                // Fetch recent activities
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

    // Activity chart data
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
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                tension: 0.4,
            }
        ]
    };

    // Job Engagement chart data
    const videoEng = swipeStats?.videoEngagement ?? stats?.video_engagement ?? stats?.videoEngagement ?? null;
    const likes = videoEng?.likes ?? videoEng?.likesPct ?? 0;
    const shares = videoEng?.shares ?? videoEng?.sharesPct ?? 0;
    const saves = videoEng?.saves ?? videoEng?.savesPct ?? 0;

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
        chartValues = [60,25,15];
    }

    const swipeChartData = {
        labels: ['Likes', 'Shares', 'Saves'],
        datasets: [
            {
                data: chartValues,
                backgroundColor: ['rgba(6,182,212,0.6)', 'rgba(147,51,234,0.6)', 'rgba(236,72,153,0.6)'],
                borderColor: ['#06b6d4', '#9333ea', '#ec4899'],
                borderWidth: 2
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
                backgroundColor: 'rgba(147,51,234,0.6)',
                borderColor: '#9333ea',
                borderWidth: 2
            }
        ]
    };

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
            let skillId = null;
            try {
                const searchRes = await getSkills(newSkillName);
                const found = (searchRes?.data?.skills || searchRes?.skills || []).find(s => s.name?.toLowerCase() === newSkillName.trim().toLowerCase());
                if (found) skillId = found.id;
            } catch (e) {
                // ignore
            }

            if (!skillId) {
                try {
                    const createRes = await createSkill({ name: newSkillName });
                    skillId = createRes?.data?.skill?.id || createRes?.skill?.id;
                } catch (err) {
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

            const payload = {
                skill_id: skillId,
                level: newSkillLevel,
                years_experience: Number(newSkillYears || 0)
            };

            await addUserSkill(payload);

            const statsResponse = await getJobSeekerDashboardStats();
            const statsPayload = statsResponse?.stats ?? statsResponse?.data ?? statsResponse;
            setStats(statsPayload || {});
            
            toast({ description: "Skill added successfully!" });
        } catch (e) {
            console.error('Add skill error:', e);
            toast({ description: "Failed to add skill", variant: "destructive" });
        } finally {
            setAddingSkill(false);
            setOpenAddSkillDialog(false);
        }
    };

    const handleUploadVideoClick = () => {
        navigate('/jobseeker-tabs?group=profileContent&tab=video-upload');
    };

    const getActivityIcon = (type) => {
        switch(type) {
            case 'view': return <Eye className="h-5 w-5 text-cyan-600" />;
            case 'match': return <ThumbsUp className="h-5 w-5 text-green-600" />;
            case 'application': return <Briefcase className="h-5 w-5 text-purple-600" />;
            case 'message': return <MessageSquare className="h-5 w-5 text-blue-600" />;
            default: return <Bell className="h-5 w-5 text-gray-600" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-56px)]">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    Dashboard
                </h1>

                <div className="flex gap-2">
                    <Button
                        onClick={handleUploadVideoClick}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                    >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Upload Video CV
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleOpenAddSkill}
                        className="border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skills
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-cyan-500">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                            <Eye className="h-8 w-8 text-cyan-600" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats?.profile_views ?? stats?.profileViews ?? 0}</h3>
                        <p className="text-sm text-gray-600">Profile Views</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <ThumbsUp className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats?.matches || 0}</h3>
                        <p className="text-sm text-gray-600">Matches</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats?.applications || 0}</h3>
                        <p className="text-sm text-gray-600">Applications</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats?.unread_messages || 0}</h3>
                        <p className="text-sm text-gray-600">Unread Messages</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
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
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Engagement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px]">
                                    <Doughnut
                                        data={swipeChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Skill Level</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px]">
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
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Activities</CardTitle>
                            <Bell className="h-5 w-5 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 max-h-[300px] overflow-auto">
                                {(activities?.length ?? 0) === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="font-medium">No recent activities</p>
                                        <p className="text-sm">Your activities will appear here</p>
                                    </div>
                                ) : (
                                    activities.map((activity, index) => (
                                        <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                                            <div className="mt-0.5">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{activity.title}</p>
                                                <p className="text-xs text-gray-500">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recommended Jobs</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewAllOpen(true)}
                                className="text-purple-600 hover:text-purple-700"
                            >
                                View All <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 max-h-[350px] overflow-auto">
                                {recommendations.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="font-medium">No recommendations</p>
                                        <p className="text-sm">Check back later for job matches</p>
                                    </div>
                                ) : (
                                    recommendations.map((job) => (
                                        <div key={job.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                            <Avatar>
                                                <AvatarImage src={job.company?.logo_url} />
                                                <AvatarFallback>{job.company?.name?.charAt(0) || 'C'}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{job.title}</p>
                                                <p className="text-xs text-gray-600 truncate">{job.company?.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {job.location}
                                                </div>
                                            </div>
                                            <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600">
                                                {job.match_percentage}%
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Tips Section */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Tips to Improve Your Chances</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-l-4 border-l-cyan-500">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="h-5 w-5 text-cyan-600" />
                                    <h3 className="font-semibold">Complete Your Profile</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Complete profiles get more attention from employers.
                                </p>
                                <Progress value={stats?.profile_completion || 0} className="h-2" />
                                <p className="text-xs text-right mt-1 text-gray-600">
                                    {stats?.profile_completion || 0}% Complete
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <PlayCircle className="h-5 w-5 text-purple-600" />
                                    <h3 className="font-semibold">Add Video CV</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    A video increases matching chances by 70% and makes you stand out.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                                    onClick={handleUploadVideoClick}
                                >
                                    Upload Video
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-pink-500">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Briefcase className="h-5 w-5 text-pink-600" />
                                    <h3 className="font-semibold">Update Your Skills</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Add in-demand skills to increase your visibility.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full border-pink-600 text-pink-600 hover:bg-pink-50"
                                    onClick={handleOpenAddSkill}
                                >
                                    Add Skills
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            {/* Add Skill Dialog */}
            <Dialog open={openAddSkillDialog} onClose={handleCloseAddSkill}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a Skill</DialogTitle>
                        <DialogDescription>Add a new skill to your profile to improve job matching</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="skill-name">Skill Name</Label>
                            <Input
                                id="skill-name"
                                value={newSkillName}
                                onChange={(e) => setNewSkillName(e.target.value)}
                                placeholder="e.g. React, Python"
                            />
                        </div>
                        <div>
                            <Label htmlFor="skill-level">Level</Label>
                            <Select value={newSkillLevel} onValueChange={setNewSkillLevel}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                    <SelectItem value="Expert">Expert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="skill-years">Years of Experience</Label>
                            <Input
                                id="skill-years"
                                type="number"
                                value={newSkillYears}
                                onChange={(e) => setNewSkillYears(e.target.value)}
                                min="0"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseAddSkill} disabled={addingSkill}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmAddSkill} disabled={addingSkill}>
                            {addingSkill ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Skill"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View All Recommendations Dialog */}
            <Dialog open={viewAllOpen} onOpenChange={setViewAllOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Recommended Jobs</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 max-h-[400px] overflow-auto">
                        {recommendations.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No recommendations available</p>
                            </div>
                        ) : (
                            recommendations.slice((viewAllPage - 1) * itemsPerPage, viewAllPage * itemsPerPage).map((job) => (
                                <div key={job.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                                    <Avatar>
                                        <AvatarImage src={job.company?.logo_url} />
                                        <AvatarFallback>{job.company?.name?.charAt(0) || 'C'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium">{job.title}</p>
                                        <p className="text-sm text-gray-600">
                                            {job.company?.name}{job.location ? ` • ${job.location}` : ''}
                                        </p>
                                    </div>
                                    <Badge>{job.match_percentage ? `${job.match_percentage}%` : job.score ? Math.round(job.score) + '%' : '—'}</Badge>
                                </div>
                            ))
                        )}
                    </div>
                    <DialogFooter className="justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => setViewAllPage(p => Math.max(1, p - 1))} disabled={viewAllPage === 1}>
                                Previous
                            </Button>
                            <span className="text-sm">Page {viewAllPage} of {Math.max(1, Math.ceil(recommendations.length / itemsPerPage))}</span>
                            <Button variant="outline" onClick={() => setViewAllPage(p => Math.min(Math.ceil(recommendations.length / itemsPerPage), p + 1))} disabled={viewAllPage >= Math.ceil(recommendations.length / itemsPerPage)}>
                                Next
                            </Button>
                        </div>
                        <Button onClick={() => setViewAllOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default JobSeekerDashboard;
