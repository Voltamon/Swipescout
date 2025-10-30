import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAdminTabCategories } from '@/config/adminTabsConfig';
import { getAdminStats } from '@/services/api';
import themeColors from '@/config/theme-colors-admin';
import {
  Home,
  LayoutDashboard,
  Users,
  Briefcase,
  Film,
  Shield,
  FileText,
  PenTool,
  BarChart3,
  Settings,
  Eye,
  AlertCircle,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

const AdminTabs = () => {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalVideos: 0,
    totalJobs: 0,
    pendingReports: 0,
    newUsersWeek: 0
  });
  const [viewingAs, setViewingAs] = useState(null); // 'employer' or 'jobseeker'

  const tabCategoryKey = searchParams.get('group') || 'dashboard';
  const tabParam = searchParams.get('tab') || 'overview';

  const adminTabCategoriesData = getAdminTabCategories(t);

  const tabCategory =
    adminTabCategoriesData.find((cat) => cat.key === tabCategoryKey) ||
    adminTabCategoriesData[0];

  const currentTab = tabCategory.tabs.find((tab) => tab.path === tabParam) || tabCategory.tabs[0];

  useEffect(() => {
    if (user) {
      const primary = Array.isArray(role) ? role[0] : role;
      if (primary && primary !== 'admin') {
        // Redirect non-admin users
        if (primary === 'employer' || primary === 'recruiter') {
          navigate('/employer-tabs');
        } else if (primary === 'job_seeker' || primary === 'employee') {
          navigate('/jobseeker-tabs');
        } else {
          navigate('/');
        }
      }
    }
  }, [user, role, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await getAdminStats();
        if (statsResponse && statsResponse.data) {
          setStats(statsResponse.data.stats || statsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        // Use mock data if API fails
        setStats({
          totalUsers: 1250,
          activeUsers: 890,
          totalVideos: 3420,
          totalJobs: 890,
          pendingReports: 12,
          newUsersWeek: 45
        });
      }
    };

    fetchStats();
  }, []);

  // Icon mapping
  const iconMap = {
    LayoutDashboard: LayoutDashboard,
    Users: Users,
    Briefcase: Briefcase,
    Film: Film,
    Shield: Shield,
    FileText: FileText,
    PenTool: PenTool,
    BarChart3: BarChart3,
    Settings: Settings,
  };

  // Build navigation items from config
  const navigationItems = adminTabCategoriesData.flatMap((category, catIndex) => {
    const items = category.tabs.map((tab) => {
      const IconComponent = iconMap[tab.icon.name] || LayoutDashboard;
      return {
        label: tab.label,
        icon: IconComponent,
        path: `/admin-tabs?group=${category.key}&tab=${tab.path}`,
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

  // Handle view as different role
  const handleViewAs = (roleType) => {
    setViewingAs(roleType);
    if (roleType === 'employer') {
      navigate('/employer-tabs');
    } else if (roleType === 'jobseeker') {
      navigate('/jobseeker-tabs');
    }
  };

  const handleReturnToAdmin = () => {
    setViewingAs(null);
    navigate('/admin-tabs');
  };

  if (!user || !(Array.isArray(role) ? role.includes('admin') : role === 'admin')) {
    return null;
  }

  return (
    <DashboardLayout navigationItems={navigationItems}>
      <div className="space-y-6">
        {/* Viewing As Badge */}
        {viewingAs && (
          <div className={`p-4 ${themeColors.backgrounds.card} border-l-4 ${themeColors.borders.warning} rounded-lg flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-amber-600" />
              <span className={themeColors.text.primary}>
                Viewing as: <Badge variant="outline">{viewingAs}</Badge>
              </span>
            </div>
            <Button onClick={handleReturnToAdmin} variant="outline" size="sm">
              Return to Admin
            </Button>
          </div>
        )}

        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className={`text-3xl font-bold tracking-tight ${themeColors.text.gradient}`}>
            Admin Dashboard 🛡️
          </h1>
          <p className={themeColors.text.secondary}>
            Manage platform users, content, and settings from this central control panel.
          </p>
        </div>

        {/* Quick Stats Cards */}
        {tabParam === 'overview' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className={`border-l-4 ${themeColors.borders.primary} hover:shadow-lg transition-shadow`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className={`h-4 w-4 ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.totalUsers ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +{stats?.newUsersWeek ?? 0} this week
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className={`h-4 w-4 ${themeColors.iconBackgrounds.secondary.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.activeUsers ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  {stats?.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total users
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <AlertCircle className={`h-4 w-4 ${themeColors.iconBackgrounds.warning.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.pendingReports ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  Requires attention
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                <Film className={`h-4 w-4 ${themeColors.iconBackgrounds.info.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>
                  {(stats?.totalVideos ?? 0) + (stats?.totalJobs ?? 0)}
                </div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  {stats?.totalVideos ?? 0} videos, {stats?.totalJobs ?? 0} jobs
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* View As Buttons - Only on overview */}
        {tabParam === 'overview' && (
          <Card>
            <CardHeader>
              <CardTitle>View Platform As</CardTitle>
              <CardDescription>
                Switch to employer or jobseeker view to test the platform experience
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button
                onClick={() => handleViewAs('employer')}
                variant="outline"
                className={`${themeColors.buttons.outline}`}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                View as Employer
              </Button>
              <Button
                onClick={() => handleViewAs('jobseeker')}
                variant="outline"
                className={`${themeColors.buttons.outline}`}
              >
                <Users className="mr-2 h-4 w-4" />
                View as Job Seeker
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Current Tab Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {React.createElement(iconMap[currentTab.icon.name] || LayoutDashboard, {
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

export default AdminTabs;
