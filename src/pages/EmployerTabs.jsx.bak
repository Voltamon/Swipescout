import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { getEmployerTabCategories } from '@/config/employerTabsConfig';
import { getEmployerStats } from '@/services/api';
import themeColors from '@/config/theme-colors-employer';
import { Button } from '@/components/UI/button.jsx';
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
  FileText,
  BookOpen,
  Info,
  Lock
} from 'lucide-react';

const LockedFeature = ({ requiredPlan, navigate, role }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="bg-gray-100 p-4 rounded-full mb-4">
      <Lock className="h-8 w-8 text-gray-500" />
    </div>
    <h3 className="text-xl font-bold mb-2">Feature Locked</h3>
    <p className="text-gray-600 mb-6 max-w-md">
      This feature requires the {requiredPlan} plan. Upgrade your subscription to access this feature.
    </p>
    <Button onClick={() => navigate('/employer-tabs?group=managementSettings&tab=pricing', { state: { role } })}>View Plans</Button>
  </div>
);
 
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
  const tabId = searchParams.get('id'); // Get dynamic ID parameter

  const employerTabCategories = getEmployerTabCategories(t, user);

  const tabCategory = employerTabCategories.find((cat) => cat.key === tabCategoryKey) || employerTabCategories[0];
  
  // Match tab path with or without dynamic segments
  const currentTab = tabCategory.tabs.find((tab) => {
    const tabPathBase = tab.path.split('/:')[0]; // Get base path before :id
    const tabParamBase = tabParam.split('/')[0]; // Get base from query param
    return tabPathBase === tabParamBase || tab.path === tabParam;
  }) || tabCategory.tabs[0];

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
    BookOpen: BookOpen,
    Info: Info,
    CreditCard: Briefcase, // Fallback or specific icon for pricing
  };

  // Build navigation items from config
  const navigationItems = employerTabCategories.flatMap((category, catIndex) => {
    const items = category.tabs
      .filter((tab) => !tab.hideInSidebar) // Filter out hidden tabs
      .map((tab) => {
        const IconComponent = iconMap[tab.icon.name] || BarChart3;
        const navItem = {
          label: tab.label,
          icon: IconComponent,
          path: tab.externalLink ? tab.path : `/employer-tabs?group=${category.key}&tab=${tab.path}`,
          externalLink: tab.externalLink || false,
          // Force active styling for certain items that should look like other nav items
          forceActiveStyle: !!tab.forceActiveStyle || !!tab.externalLink,
          locked: tab.locked, // Pass locked state
        };
        // no-op: navItem prepared
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

  const isEmployer = Array.isArray(role) ? role.includes('employer') || role.includes('recruiter') : role === 'employer';

  if (!user || !isEmployer) {
    return null;
  }

  // Build breadcrumb: Home > Category > Tab
  const breadcrumbItems = [
    { labelKey: 'nav.home', link: '/' },
    { labelKey: tabCategory.labelKey, link: `/employer-tabs?group=${tabCategory.key}` },
    { labelKey: currentTab.labelKey }
  ];

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title={'employerTabs:title'}
      breadcrumbItems={breadcrumbItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        {tabParam === 'overview' && (
          <div className="space-y-2">
            <h1 className={`text-3xl font-bold tracking-tight ${themeColors.text.gradient}`}>
              {t('employerTabs:welcome', { name: user?.companyName || 'Employer' })}
            </h1>
            <p className={themeColors.text.secondary}>
              {t('employerTabs:welcome_message')}
            </p>
          </div>
        )}

        {/* Quick Stats Cards - OpenVC Style */}
        {tabParam === 'overview' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className={`border-l-4 ${themeColors.borders.primary} hover:shadow-lg transition-shadow`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('employerTabs:active_jobs')}</CardTitle>
                <Briefcase className={`h-4 w-4 ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.activeJobs ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {t('employerTabs:currently_hiring')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('employerTabs:new_applications')}</CardTitle>
                <FileText className={`h-4 w-4 ${themeColors.iconBackgrounds.secondary.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.newApplications ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  {t('employerTabs:pending_review')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('employerTabs:shortlisted')}</CardTitle>
                <UserPlus className={`h-4 w-4 ${themeColors.iconBackgrounds.warning.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.shortlisted ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  {t('employerTabs:candidates_in_pipeline')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('employerTabs:profile_views')}</CardTitle>
                <Eye className={`h-4 w-4 ${themeColors.iconBackgrounds.info.split(' ')[1]}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats?.profileViews ?? 0}</div>
                <p className={`text-xs mt-1 ${themeColors.text.muted}`}>
                  {t('employerTabs:company_visibility')}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Tab Content */}
        {currentTab.externalLink ? (
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
              <p className={themeColors.text.secondary}>
                {t('employerTabs:redirecting', 'Redirecting to external page...')}
              </p>
            </CardContent>
          </Card>
        ) : (
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
              {currentTab.locked ? (
                <LockedFeature requiredPlan={currentTab.requiredPlan} navigate={navigate} role={role} />
              ) : currentTab.component && (currentTab.context
                ? React.createElement(currentTab.component, { context: currentTab.context, id: tabId })
                : React.createElement(currentTab.component, { id: tabId }))}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployerTabs;

