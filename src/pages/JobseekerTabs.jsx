import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { jobseekerTabCategories } from '@/config/jobseekerTabsConfig';
import { getJobseekerStats } from '@/services/api';
import themeColors from '@/config/theme-colors-jobseeker';
import {
  Home,
  Search,
  Film as VideoLibrary,
  User as Person,
  CalendarDays as CalendarToday,
  Bell as Notifications,
  Settings,
  Bookmark,
  Heart as Favorite,
  LayoutDashboard as Dashboard,
  BarChart3 as Analytics,
  CloudUpload,
  FileText,
  MessageSquare,
  Eye,
  ThumbsUp as ThumbUp,
  Briefcase,
  Mail,
  TrendingUp,
} from 'lucide-react';

const JobseekerTabs = () => {
  const DashboardIcon = Dashboard;
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stats, setStats] = useState({
    activeApplications: 0,
    upcomingInterviews: 0,
    myVideos: 0,
    savedJobs: 0,
    profileViews: 0,
    matches: 0,
    applications: 0,
    unreadMessages: 0
  });

  const tabCategoryKey = searchParams.get('group') || 'dashboard';
  const tabParam = searchParams.get('tab') || 'overview';

  const jobseekerTabCategoriesData = jobseekerTabCategories();

  const tabCategory =
    jobseekerTabCategoriesData.find((cat) => cat.key === tabCategoryKey) ||
    jobseekerTabCategoriesData[0];

  const currentTab = tabCategory.tabs.find((tab) => tab.path === tabParam) || tabCategory.tabs[0];

  useEffect(() => {
    if (user) {
      const primary = Array.isArray(role) ? role[0] : role;
      if (primary && primary !== 'job_seeker' && primary !== 'employee') {
        if (primary === 'employer' || primary === 'recruiter') navigate('/employer-tabs');
        else if (primary === 'admin') navigate('/admin-dashboard');
        else navigate('/');
      }
    }
  }, [user, role, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await getJobseekerStats();
        if (statsResponse && statsResponse.data) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch jobseeker stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Convert MUI icons to Lucide icons
  const iconMap = {
    Search: Search,
    Work: Briefcase,
    VideoLibrary: VideoLibrary,
    Person: Person,
    CalendarToday: CalendarToday,
    Notifications: Notifications,
    Settings: Settings,
    Bookmark: Bookmark,
    Favorite: Favorite,
    Dashboard: DashboardIcon,
    ChatIcon: MessageSquare,
    AnalyticsIcon: Analytics,
  };

  // Build navigation items from config
  const navigationItems = jobseekerTabCategoriesData.flatMap((category, catIndex) => {
    const items = category.tabs.map((tab) => {
      const IconComponent = iconMap[tab.icon.name] || DashboardIcon;
      return {
        label: tab.label,
        icon: IconComponent,
        path: `/jobseeker-tabs?group=${category.key}&tab=${tab.path}`,
      };
    });

    // Add separator before each category (except first)
    if (catIndex > 0) {
      return [
        {
          type: 'separator',
          label: category.label,
        },
        ...items,
      ];
    }

    return items;
  });

  // Add Home at the beginning
  navigationItems.unshift({
    label: t('nav.home', 'Home'),
    icon: Home,
    path: '/',
  });

  if (!user || !(Array.isArray(role) ? role.includes('job_seeker') || role.includes('employee') : role === 'job_seeker' || role === 'employee')) {
    return null;
  }

  return (
    <DashboardLayout navigationItems={navigationItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className={`text-3xl font-bold tracking-tight ${themeColors.text.gradient}`}>
            Welcome back, {user?.firstName || 'Job Seeker'}! 👋
          </h1>
          <p className={themeColors.text.secondary}>
            Manage your job search, profile, and career opportunities all in one place.
          </p>
        </div>

        {/* Quick Stats Cards - OpenVC Style */}
        {tabParam === 'overview' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className={`border-l-4 ${themeColors.borders.primary} hover:shadow-lg transition-shadow`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <Eye className={`h-4 w-4 ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.profileViews ?? stats?.profile_views ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Matches</CardTitle>
                <ThumbUp className={`h-4 w-4 ${themeColors.iconBackgrounds.secondary.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.matches ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  Companies interested in you
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <Briefcase className={`h-4 w-4 ${themeColors.iconBackgrounds.warning.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.applications ?? stats?.applications_count ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  Active job applications
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <Mail className={`h-4 w-4 ${themeColors.iconBackgrounds.info.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.unreadMessages ?? stats?.unread_messages ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  New messages waiting
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Tab Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {React.createElement(iconMap[currentTab.icon.name] || DashboardIcon, {
                className: `h-6 w-6 ${themeColors.iconBackgrounds.primary.split(' ')[1]}`,
              })}
              <div>
                <CardTitle>{currentTab.label}</CardTitle>
                <CardDescription className="mt-1">{currentTab.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentTab.context
              ? React.createElement(currentTab.component, { context: currentTab.context })
              : React.createElement(currentTab.component)}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobseekerTabs;
