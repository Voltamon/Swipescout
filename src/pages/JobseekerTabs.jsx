import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { jobseekerTabCategories } from '@/config/jobseekerTabsConfig';
import EditJobSeekerProfile from '@/pages/EditJobSeekerProfile';
import { getJobseekerStats } from '@/services/api';
import themeColors from '@/config/theme-colors-jobseeker';
import { Button } from '@/components/UI/button.jsx';
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
  Lock,
} from 'lucide-react';

const LockedFeature = ({ requiredPlan, navigate }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="bg-gray-100 p-4 rounded-full mb-4">
      <Lock className="h-8 w-8 text-gray-500" />
    </div>
    <h3 className="text-xl font-bold mb-2">Feature Locked</h3>
    <p className="text-gray-600 mb-6 max-w-md">
      This feature requires the {requiredPlan} plan. Upgrade your subscription to access this feature.
    </p>
    <Button onClick={() => navigate('/pricing')}>View Plans</Button>
  </div>
);

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

  const jobseekerTabCategoriesData = jobseekerTabCategories(user);

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
    const items = category.tabs
      .filter((tab) => !tab.hideInSidebar) // Filter out hidden tabs
      .map((tab) => {
        const IconComponent = iconMap[tab.icon.name] || DashboardIcon;
        const navItem = {
          label: tab.label,
          icon: IconComponent,
          path: `/jobseeker-tabs?group=${category.key}&tab=${tab.path}`,
          locked: tab.locked, // Pass locked state
        };
        navItem.labelKey = tab.labelKey || '';
        return navItem;
      });

    // Add separator before each category (except first)
    if (catIndex > 0 && items.length > 0) {
      return [
        {
          type: 'separator',
          label: category.label,
          labelKey: category.labelKey || ''
        },
        ...items,
      ];
    }

    return items;
  });

  // Add Home at the beginning
  navigationItems.unshift({
    label: t('nav.home', 'Home'),
    labelKey: 'nav.home',
    icon: Home,
    path: '/',
  });

  if (!user || !(Array.isArray(role) ? role.includes('job_seeker') || role.includes('employee') : role === 'job_seeker' || role === 'employee')) {
    return null;
  }

  const breadcrumbItems = [
    { labelKey: 'nav.home', link: '/' },
    { labelKey: tabCategory.labelKey, link: `/jobseeker-tabs?group=${tabCategory.key}` },
    { labelKey: currentTab.labelKey }
  ];

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title={'jobseekerTabs:title'}
      breadcrumbItems={breadcrumbItems}
    >
      <div className="space-y-6">
        {/* Welcome Section - only show on overview tab */}
        {tabParam === 'overview' && (
          <div className="space-y-2">
            <h1 className={`text-3xl font-bold tracking-tight ${themeColors.text.gradient}`}>
              {t('jobseekerTabs:welcome', { name: user?.firstName || t('jobseekerTabs:jobSeeker') })}
            </h1>
            <p className={themeColors.text.secondary}>
              {t('jobseekerTabs:welcome_message')}
            </p>
          </div>
        )}

        {/* Quick Stats Cards - OpenVC Style */}
        {tabParam === 'overview' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className={`border-l-4 ${themeColors.borders.primary} hover:shadow-lg transition-shadow`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('jobseekerTabs:profile_views')}</CardTitle>
                <Eye className={`h-4 w-4 ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.profileViews ?? stats?.profile_views ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {t('jobseekerTabs:from_last_month', { percent: 12 })}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('jobseekerTabs:matches')}</CardTitle>
                <ThumbUp className={`h-4 w-4 ${themeColors.iconBackgrounds.secondary.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.matches ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  {t('jobseekerTabs:companies_interested')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('jobseekerTabs:applications')}</CardTitle>
                <Briefcase className={`h-4 w-4 ${themeColors.iconBackgrounds.warning.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.applications ?? stats?.applications_count ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  {t('jobseekerTabs:active_applications')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('jobseekerTabs:unread_messages')}</CardTitle>
                <Mail className={`h-4 w-4 ${themeColors.iconBackgrounds.info.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.unreadMessages ?? stats?.unread_messages ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  {t('jobseekerTabs:new_messages')}
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
            {/* If the current tab is the profile tab and mode=edit is present in the query, render the edit form */}
            {currentTab.locked ? (
              <LockedFeature requiredPlan={currentTab.requiredPlan} navigate={navigate} />
            ) : currentTab.path === 'my-profile' && searchParams.get('mode') === 'edit' ? (
              <EditJobSeekerProfile openTab={searchParams.get('openTab')} action={searchParams.get('action')} />
            ) : currentTab.context ? (
              React.createElement(currentTab.component, { context: currentTab.context })
            ) : (
              React.createElement(currentTab.component)
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobseekerTabs;
