import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
    Users,
    BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import themeColors from '@/config/theme-colors';

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

const EmployerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

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

    // Views chart data with theme colors
    const viewsChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Job Views',
                data: stats?.job_views_chart || [120, 190, 150, 250, 220, 300],
                ...themeColors.charts.line.primary,
                tension: 0.4,
            },
        ],
    };

    // Applicants chart data with theme colors
    const applicantsChartData = {
        labels: stats?.job_titles || ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Project Manager', 'Digital Marketer'],
        datasets: [
            {
                label: 'Number of Applicants',
                data: stats?.applicants_per_job || [25, 18, 12, 8, 15],
                backgroundColor: themeColors.charts.bar.secondary,
                borderColor: themeColors.charts.bar.secondary,
                borderWidth: 1,
            },
        ],
    };

    // Applicant sources chart data with theme colors
    const applicantSourcesChartData = {
        labels: ['Direct Search', 'Referrals', 'Social Media', 'Job Boards', 'Other'],
        datasets: [
            {
                data: stats?.applicant_sources || [35, 25, 20, 15, 5],
                backgroundColor: themeColors.charts.doughnut,
                borderColor: themeColors.charts.doughnutBorders,
                borderWidth: 2,
            },
        ],
    };

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
                        <Button className={`${themeColors.buttons.primary} text-white`}>
                            <Plus className="h-4 w-4 mr-2" />
                            Post New Job
                        </Button>
                        <Button variant="outline" className={themeColors.buttons.outline}>
                            <Building2 className="h-4 w-4 mr-2" />
                            Update Profile
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${themeColors.text.secondary}`}>
                                        Job Views
                                    </p>
                                    <h3 className={`text-3xl font-bold mt-2 ${themeColors.text.primary}`}>
                                        {stats?.total_job_views || 0}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.primary}`}>
                                    <Eye className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${themeColors.text.secondary}`}>
                                        Applicants
                                    </p>
                                    <h3 className={`text-3xl font-bold mt-2 ${themeColors.text.primary}`}>
                                        {stats?.total_applicants || 0}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.success}`}>
                                    <UserSearch className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${themeColors.text.secondary}`}>
                                        Active Jobs
                                    </p>
                                    <h3 className={`text-3xl font-bold mt-2 ${themeColors.text.primary}`}>
                                        {stats?.active_jobs || 0}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.warning}`}>
                                    <Briefcase className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${themeColors.text.secondary}`}>
                                        Unread Messages
                                    </p>
                                    <h3 className={`text-3xl font-bold mt-2 ${themeColors.text.primary}`}>
                                        {stats?.unread_messages || 0}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.info}`}>
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Charts and Jobs */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <CardHeader>
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="overview">Overview</TabsTrigger>
                                        <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
                                        <TabsTrigger value="applicants">Applicants</TabsTrigger>
                                    </TabsList>
                                </CardHeader>
                                <CardContent>
                                    <TabsContent value="overview" className="space-y-6">
                                        {/* Job Views Chart */}
                                        <div className="h-80">
                                            <h3 className={`text-lg font-semibold mb-4 ${themeColors.text.primary}`}>
                                                Job Views Over Time
                                            </h3>
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
                                        </div>

                                        {/* Additional Charts */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="h-64">
                                                <h3 className={`text-lg font-semibold mb-4 ${themeColors.text.primary}`}>
                                                    Applicants Per Job
                                                </h3>
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
                                            </div>

                                            <div className="h-64">
                                                <h3 className={`text-lg font-semibold mb-4 ${themeColors.text.primary}`}>
                                                    Applicant Sources
                                                </h3>
                                                <Doughnut
                                                    data={applicantSourcesChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="jobs">
                                        <div className="space-y-4">
                                            <h3 className={`text-lg font-semibold ${themeColors.text.primary}`}>
                                                Active Job Postings
                                            </h3>
                                            <div className="rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Job Title</TableHead>
                                                            <TableHead>Posted Date</TableHead>
                                                            <TableHead>Views</TableHead>
                                                            <TableHead>Applicants</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead>Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {jobs.map((job) => (
                                                            <TableRow key={job.id}>
                                                                <TableCell className="font-medium">{job.title}</TableCell>
                                                                <TableCell>{new Date(job.created_at).toLocaleDateString('en-US')}</TableCell>
                                                                <TableCell>{job.views}</TableCell>
                                                                <TableCell>{job.applicants_count}</TableCell>
                                                                <TableCell>
                                                                    {getStatusBadge(job.status)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button variant="ghost" size="sm" className="text-purple-600">
                                                                        View
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            <div className="flex justify-center">
                                                <Button variant="outline" className={themeColors.buttons.outline}>
                                                    View All Jobs
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="applicants">
                                        <div className="space-y-4">
                                            <h3 className={`text-lg font-semibold ${themeColors.text.primary}`}>
                                                Latest Applicants
                                            </h3>
                                            <div className="rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Candidate</TableHead>
                                                            <TableHead>Job</TableHead>
                                                            <TableHead>Applied Date</TableHead>
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
                                                                        <Avatar className="h-8 w-8">
                                                                            <AvatarImage src={candidate.photoUrl} />
                                                                            <AvatarFallback>{candidate.name?.charAt(0)}</AvatarFallback>
                                                                        </Avatar>
                                                                        <span className="font-medium">{candidate.name}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>{candidate.job_title}</TableCell>
                                                                <TableCell>{new Date(candidate.applied_at).toLocaleDateString('en-US')}</TableCell>
                                                                <TableCell>
                                                                    {getMatchBadge(candidate.match_percentage)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getStatusBadge(candidate.status)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button variant="ghost" size="sm" className="text-purple-600">
                                                                        View
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            <div className="flex justify-center">
                                                <Button variant="outline" className={themeColors.buttons.outline}>
                                                    View All Applicants
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
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
                                <Button variant="ghost" size="sm" className="text-purple-600">
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
                            Tips to Attract More Qualified Candidates
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`p-6 rounded-lg border-2 ${themeColors.borders.default} hover:shadow-md transition-shadow`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${themeColors.iconBackgrounds.primary}`}>
                                        <PlayCircle className="h-6 w-6" />
                                    </div>
                                    <h3 className={`font-semibold ${themeColors.text.primary}`}>
                                        Add Video to Job Posting
                                    </h3>
                                </div>
                                <p className={`text-sm mb-4 ${themeColors.text.secondary}`}>
                                    Jobs with videos receive 34% more applications than traditional text-based job posts.
                                </p>
                                <Button className={`w-full ${themeColors.buttons.primary} text-white`}>
                                    Add Video
                                </Button>
                            </div>

                            <div className={`p-6 rounded-lg border-2 ${themeColors.borders.default} hover:shadow-md transition-shadow`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${themeColors.iconBackgrounds.secondary}`}>
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <h3 className={`font-semibold ${themeColors.text.primary}`}>
                                        Complete Company Profile
                                    </h3>
                                </div>
                                <p className={`text-sm mb-4 ${themeColors.text.secondary}`}>
                                    Companies with complete profiles attract higher quality candidates and increase acceptance rates.
                                </p>
                                <Button className={`w-full ${themeColors.buttons.secondary} text-white`}>
                                    Update Profile
                                </Button>
                            </div>

                            <div className={`p-6 rounded-lg border-2 ${themeColors.borders.default} hover:shadow-md transition-shadow`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${themeColors.iconBackgrounds.info}`}>
                                        <BarChart3 className="h-6 w-6" />
                                    </div>
                                    <h3 className={`font-semibold ${themeColors.text.primary}`}>
                                        Analyze Job Performance
                                    </h3>
                                </div>
                                <p className={`text-sm mb-4 ${themeColors.text.secondary}`}>
                                    Review your job performance analytics to improve visibility and application rates.
                                </p>
                                <Button className={`w-full ${themeColors.buttons.success} text-white`}>
                                    View Analytics
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
