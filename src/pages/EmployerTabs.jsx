import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { getEmployerTabCategories } from '@/config/employerTabsConfig';
import { getEmployerStats } from '@/services/api';
import themeColors from '@/config/theme-colors';
import {
  Home,
  Search,
  Film as VideoLibrary,
  Building2,
  PlusCircle,
  BarChart3,
  Bell,
  Settings,
  Edit,
  MessageSquare,
  HelpCircle,
  Users,
  Briefcase,
  Eye,
  UserPlus,
  TrendingUp,
  FileText
} from 'lucide-react';
 
const EmployerTabs = () => {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stats, setStats] = useState({
    activeJobs: 0,
    newApplications: 0,
    companyVideos: 0,
    profileViews: 0,
    shortlisted: 0,
    interviewsScheduled: 0
  });

  const tabCategoryKey = searchParams.get('group') || 'dashboard';
  const tabParam = searchParams.get('tab') || 'overview';

  const employerTabCategories = getEmployerTabCategories(t);

  const tabCategory = employerTabCategories.find((cat) => cat.key === tabCategoryKey) || employerTabCategories[0];
  const currentTab = tabCategory.tabs.find((tab) => tab.path === tabParam) || tabCategory.tabs[0];

  useEffect(() => {
    if (user) {
      const primary = Array.isArray(role) ? role[0] : role;
      if (primary && primary !== 'employer' && primary !== 'recruiter') {
        if (primary === 'job_seeker' || primary === 'employee') navigate('/jobseeker-tabs');
        else if (primary === 'admin') navigate('/admin-dashboard');
        else navigate('/');
      }
    }
  }, [user, role, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await getEmployerStats();
        if (statsResponse && statsResponse.data) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch employer stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Convert MUI icons to Lucide icons
  const iconMap = {
    Search: Search,
    Work: Briefcase,
    VideoLibrary: VideoLibrary,
    Person: Users,
    PostAdd: PlusCircle,
    Analytics: BarChart3,
    Notifications: Bell,
    Settings: Settings,
    Business: Building2,
    Edit: Edit,
    ChatIcon: MessageSquare,
    HelpIcon: HelpCircle,
  };

  // Build navigation items from config
  const navigationItems = employerTabCategories.flatMap((category, catIndex) => {
    const items = category.tabs.map((tab) => {
      const IconComponent = iconMap[tab.icon.name] || BarChart3;
      return {
        label: tab.label,
        icon: IconComponent,
        path: `/employer-tabs?group=${category.key}&tab=${tab.path}`,
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

  const isEmployer = Array.isArray(role) ? role.includes('employer') || role.includes('recruiter') : role === 'employer';

  if (!user || !isEmployer) {
    return null;
  }

  return (
    <DashboardLayout navigationItems={navigationItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className={`text-3xl font-bold tracking-tight ${themeColors.text.gradient}`}>
            Welcome back, {user?.companyName || 'Employer'}! 🏢
          </h1>
          <p className={themeColors.text.secondary}>
            Manage your hiring process, company profile, and find the best talent for your team.
          </p>
        </div>

        {/* Quick Stats Cards - OpenVC Style */}
        {tabParam === 'overview' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className={`border-l-4 ${themeColors.borders.primary} hover:shadow-lg transition-shadow`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className={`h-4 w-4 ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.activeJobs ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Currently hiring positions
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Applications</CardTitle>
                <FileText className={`h-4 w-4 ${themeColors.iconBackgrounds.secondary.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.newApplications ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  Pending review
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                <UserPlus className={`h-4 w-4 ${themeColors.iconBackgrounds.warning.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.shortlisted ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  Candidates in pipeline
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <Eye className={`h-4 w-4 ${themeColors.iconBackgrounds.info.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.profileViews ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  Company visibility
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Tab Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {React.createElement(iconMap[currentTab.icon.name] || BarChart3, {
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

export default EmployerTabs;

