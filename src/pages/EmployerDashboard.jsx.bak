import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    getEmployerDashboardStats,
    getRecentActivities,
    getCandidateRecommendations,
    getJobPostings
} from '../services/dashboardService';
import {
    Eye,
    UserSearch,
    Briefcase,
    MessageSquare,
    Bell,
    TrendingUp,
    PlayCircle,
    Plus,
    ArrowRight,
    Building2,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/UI/table.jsx';
import { ScrollArea } from '@/components/UI/scroll-area.jsx';
import themeColors from '@/config/theme-colors-employer';

const EmployerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('jobs');

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

    // Listen for profile view events and refresh employer dashboard stats
    useEffect(() => {
        const onProfileView = async (e) => {
            try {
                setLoading(true);
                const statsResponse = await getEmployerDashboardStats();
                setStats(statsResponse.data.stats);
            } catch (err) {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        window.addEventListener('profileViewRecorded', onProfileView);
        return () => window.removeEventListener('profileViewRecorded', onProfileView);
    }, []);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'view':
                return <Eye className="h-5 w-5 text-purple-600" />;
            case 'application':
                return <UserSearch className="h-5 w-5 text-green-600" />;
            case 'job':
                return <Briefcase className="h-5 w-5 text-yellow-600" />;
            case 'message':
                return <MessageSquare className="h-5 w-5 text-blue-600" />;
            default:
                return <Bell className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { label: 'Active', variant: 'success' },
            closed: { label: 'Closed', variant: 'gray' },
            new: { label: 'New', variant: 'info' },
            reviewed: { label: 'Reviewed', variant: 'primary' },
            interview: { label: 'Interview', variant: 'success' },
            rejected: { label: 'Rejected', variant: 'danger' },
        };

        const config = statusConfig[status] || statusConfig.new;
        return (
            <Badge className={themeColors.badges[config.variant]}>
                {config.label}
            </Badge>
        );
    };

    const getMatchBadge = (percentage) => {
        let variant = 'gray';
        if (percentage > 80) variant = 'success';
        else if (percentage > 60) variant = 'primary';

        return (
            <Badge className={themeColors.badges[variant]}>
                {percentage}%
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${themeColors.backgrounds.page} p-6`}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className={`text-3xl font-bold ${themeColors.text.gradient}`}>
                            Welcome {user?.displayName}
                        </h1>
                        <p className={themeColors.text.secondary}>
                            Here's what's happening with your job postings today
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            className={`${themeColors.buttons.primary} text-white`}
                            onClick={() => navigate('/employer-tabs?group=jobManagement&tab=post-job')}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Post New Job
                        </Button>
                        <Button 
                            variant="outline" 
                            className={themeColors.buttons.outline}
                            onClick={() => navigate('/employer-tabs?group=companyContent&tab=edit-employer-profile')}
                        >
                            <Building2 className="h-4 w-4 mr-2" />
                            Update Profile
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate('/employer-tabs?group=dashboard&tab=analytics')}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${themeColors.text.secondary}`}>
                                        Job Views
                                    </p>
                                    <h3 className={`text-3xl font-bold mt-2 ${themeColors.text.primary}`}>
                                        {stats?.total_job_views || 0}
                                    </h3>
                                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        +12% this week
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.primary}`}>
                                    <Eye className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => setActiveTab('applicants')}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                     <p className={`text-sm font-medium ${themeColors.text.secondary}`}>
                                        New Applicants
                                    </p>
                                    <h3 className={`text-3xl font-bold mt-2 ${themeColors.text.primary}`}>
                                        {stats?.total_applicants || 0}
                                    </h3>
                                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        +8% this week
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.success}`}>
                                    <UserSearch className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => setActiveTab('jobs')}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${themeColors.text.secondary}`}>
                                        Active Jobs
                                    </p>
                                    <h3 className={`text-3xl font-bold mt-2 ${themeColors.text.primary}`}>
                                        {stats?.active_jobs || 0}
                                    </h3>
                                    <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                                        {stats?.draft_jobs || 0} drafts
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.warning}`}>
                                    <Briefcase className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}

                    <Card className="hover:shadow-lg transition-all duration-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${themeColors.text.secondary}`}>
                                        Unread Messages
                                    </p>
                                    <h3 className={`text-3xl font-bold mt-2 ${themeColors.text.primary}`}>
                                        {stats?.unread_messages || 0}
                                    </h3>
                                    <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                                        From candidates
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.info}`}>
                                    <MessageSquare className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Jobs and Applicants */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Job Management</CardTitle>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-indigo-600"
                                            onClick={() => navigate('/employer-tabs?group=dashboard&tab=analytics')}
                                        >
                                            <BarChart3 className="h-4 w-4 mr-1" />
                                            View Analytics
                                        </Button>
                                    </div>
                                    <TabsList className="grid w-full grid-cols-2 mt-4">
                                        <TabsTrigger value="jobs">Active Jobs ({jobs.length})</TabsTrigger>
                                        <TabsTrigger value="applicants">Recent Applicants</TabsTrigger>
                                    </TabsList>
                                </CardHeader>
                                <CardContent>
                                    <TabsContent value="jobs" className="space-y-4 mt-0">
                                        {jobs.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                                <p className={`text-sm ${themeColors.text.secondary} mb-4`}>
                                                    No active jobs yet
                                                </p>
                                                <Button 
                                                    className={`${themeColors.buttons.primary} text-white`}
                                                    onClick={() => navigate('/employer-tabs?group=jobManagement&tab=post-job')}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Post Your First Job
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="rounded-md border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Job Title</TableHead>
                                                                <TableHead>Posted</TableHead>
                                                                <TableHead>Views</TableHead>
                                                                <TableHead>Applicants</TableHead>
                                                                <TableHead>Status</TableHead>
                                                                <TableHead>Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {jobs.slice(0, 5).map((job) => (
                                                                <TableRow key={job.id}>
                                                                    <TableCell className="font-medium">
                                                                        <div>
                                                                            <div>{job.title}</div>
                                                                            <div className="text-xs text-gray-500">{job.location}</div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-1 text-sm">
                                                                            <Calendar className="h-3 w-3 text-gray-400" />
                                                                            {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-1">
                                                                            <Eye className="h-3 w-3 text-gray-400" />
                                                                            {job.views}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge className={themeColors.badges.info}>
                                                                            {job.applicationsCount ?? job.applicants_count ?? 0}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getStatusBadge(job.status)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button variant="ghost" size="sm" className="text-purple-600">
                                                                            Manage
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                <div className="flex justify-center">
                                                    <Button 
                                                        variant="outline" 
                                                        className={themeColors.buttons.outline}
                                                        onClick={() => navigate('/employer/my-jobs')}
                                                    >
                                                        View All Jobs
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="applicants" className="space-y-4 mt-0">
                                        {recommendations.length === 0 ? (
                                            <div className="text-center py-12">
                                                <UserSearch className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                                <p className={`text-sm ${themeColors.text.secondary}`}>
                                                    No applicants yet
                                                </p>
                                                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                                                    Applicants will appear here once they apply to your jobs
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="rounded-md border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Candidate</TableHead>
                                                                <TableHead>Job</TableHead>
                                                                <TableHead>Applied</TableHead>
                                                                <TableHead>Match</TableHead>
                                                                <TableHead>Status</TableHead>
                                                                <TableHead>Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {recommendations.slice(0, 5).map((candidate) => (
                                                                <TableRow key={candidate.id}>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <Avatar className="h-9 w-9">
                                                                                <AvatarImage src={candidate.photoUrl} />
                                                                                <AvatarFallback>{candidate.name?.charAt(0)}</AvatarFallback>
                                                                            </Avatar>
                                                                            <div>
                                                                                <div className="font-medium">{candidate.name}</div>
                                                                                <div className="text-xs text-gray-500">{candidate.experience} years exp</div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-sm">{candidate.job_title}</TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-1 text-sm">
                                                                            <Clock className="h-3 w-3 text-gray-400" />
                                                                            {new Date(candidate.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getMatchBadge(candidate.match_percentage)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getStatusBadge(candidate.status)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button variant="ghost" size="sm" className="text-purple-600">
                                                                            Review
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                <div className="flex justify-center">
                                                    <Button 
                                                        variant="outline" 
                                                        className={themeColors.buttons.outline}
                                                        onClick={() => navigate('/employer/find-candidates')}
                                                    >
                                                        View All Applicants
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </TabsContent>
                                </CardContent>
                            </Tabs>
                        </Card>
                    </div>

                    {/* Right Column - Activity and Recommendations */}
                    <div className="space-y-6">
                        {/* Recent Activities */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
                                <Bell className="h-5 w-5 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-72">
                                    {activities.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className={`text-sm ${themeColors.text.secondary}`}>
                                                No recent activities
                                            </p>
                                            <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                                                Your activities will appear here
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {activities.map((activity, index) => (
                                                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                                                    <div className="mt-1">
                                                        {getActivityIcon(activity.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium ${themeColors.text.primary}`}>
                                                            {activity.title}
                                                        </p>
                                                        <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                                                            {activity.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Recommended Candidates */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-semibold">Recommended Candidates</CardTitle>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-purple-600"
                                    onClick={() => navigate('/employer/find-candidates')}
                                >
                                    View All
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-80">
                                    {recommendations.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className={`text-sm ${themeColors.text.secondary}`}>
                                                No recommendations currently
                                            </p>
                                            <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                                                Recommendations will appear based on your posted jobs
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recommendations.map((candidate) => (
                                                <div key={candidate.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={candidate.photoUrl} />
                                                        <AvatarFallback>{candidate.name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <p className={`text-sm font-medium ${themeColors.text.primary}`}>
                                                                    {candidate.name}
                                                                </p>
                                                                <p className={`text-xs ${themeColors.text.secondary}`}>
                                                                    {candidate.job_title}
                                                                </p>
                                                            </div>
                                                            {getMatchBadge(candidate.match_percentage)}
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Briefcase className="h-3 w-3 text-gray-400" />
                                                            <span className={`text-xs ${themeColors.text.muted}`}>
                                                                {candidate.experience} years experience
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tips Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            Quick Actions to Improve Your Results
                        </CardTitle>
                        <CardDescription>
                            Take these steps to attract more qualified candidates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`p-6 rounded-lg border-2 ${themeColors.borders.default} hover:shadow-lg transition-all duration-200 cursor-pointer`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-lg ${themeColors.iconBackgrounds.primary}`}>
                                        <PlayCircle className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <h3 className={`font-semibold ${themeColors.text.primary}`}>
                                        Add Job Video
                                    </h3>
                                </div>
                                <p className={`text-sm mb-4 ${themeColors.text.secondary}`}>
                                    Jobs with videos receive 34% more applications and attract higher quality candidates.
                                </p>
                                <Button 
                                    className={`w-full ${themeColors.buttons.primary} text-white`}
                                    onClick={() => navigate('/employer-tabs?group=videoManagement&tab=video-upload')}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Video
                                </Button>
                            </div>

                            <div className={`p-6 rounded-lg border-2 ${themeColors.borders.default} hover:shadow-lg transition-all duration-200 cursor-pointer`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-lg ${themeColors.iconBackgrounds.secondary}`}>
                                        <Building2 className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h3 className={`font-semibold ${themeColors.text.primary}`}>
                                        Complete Profile
                                    </h3>
                                </div>
                                <p className={`text-sm mb-4 ${themeColors.text.secondary}`}>
                                    Complete profiles increase candidate trust and boost application acceptance rates by 45%.
                                </p>
                                <Button 
                                    className={`w-full ${themeColors.buttons.secondary} text-white`}
                                    onClick={() => navigate('/employer-tabs?group=companyContent&tab=edit-employer-profile')}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Update Now
                                </Button>
                            </div>

                            <div className={`p-6 rounded-lg border-2 ${themeColors.borders.default} hover:shadow-lg transition-all duration-200 cursor-pointer`} onClick={() => navigate('/employer-tabs?group=dashboard&tab=analytics')}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-lg ${themeColors.iconBackgrounds.info}`}>
                                        <BarChart3 className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className={`font-semibold ${themeColors.text.primary}`}>
                                        View Analytics
                                    </h3>
                                </div>
                                <p className={`text-sm mb-4 ${themeColors.text.secondary}`}>
                                    Review detailed analytics to optimize your job postings and improve visibility.
                                </p>
                                <Button className={`w-full ${themeColors.buttons.success} text-white`} onClick={() => navigate('/employer-tabs?group=dashboard&tab=analytics')}>
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmployerDashboard;
