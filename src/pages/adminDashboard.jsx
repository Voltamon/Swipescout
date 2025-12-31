import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/card.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import localize from '@/utils/localize';
import { Button } from '@/components/UI/button.jsx';
import { getAdminStats } from '@/services/api';
import themeColors from '@/config/theme-colors-admin';
import {
  Users,
  Film,
  Briefcase,
  TrendingUp,
  AlertCircle,
  UserCheck,
  Activity,
  Eye,
} from 'lucide-react';

const AdminDashboard = () => {
  // const { t } = useTranslation(); // Removed: unused variable
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    totalVideos: 0,
    totalJobs: 0,
    activeJobs: 0,
    pendingReports: 0,
    totalApplications: 0,
    recentActivity: {
      newUsersWeek: 0,
      newVideosWeek: 0,
      newJobsWeek: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getAdminStats();
      if (response?.data?.stats) {
        setStats(response.data.stats);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      // Set an error message and keep stats as-is (defaults remain)
      setError(err?.response?.data?.message || err.message || 'Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded bg-red-50 border border-red-100 text-red-700 flex items-center justify-between">
          <div>{error}</div>
          <div className="ml-4">
            <Button variant="ghost" onClick={fetchStats}>{i18n.t('auto_retry')}</Button>
          </div>
        </div>
      )}
      {/* Welcome Section */}
      <div>
        <h1 className={`text-3xl font-bold ${themeColors.text.gradient}`}>{i18n.t('auto_platform_overview')}</h1>
        <p className={themeColors.text.secondary}>{i18n.t('auto_monitor_platform_health_and_key_metrics')}</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`${themeColors.shadows.card} transition-all ${themeColors.backgrounds.cardHover}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{i18n.t('auto_total_users')}</CardTitle>
            <Users className={`h-4 w-4 ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats.totalUsers}</div>
            <p className={`text-xs ${themeColors.text.muted} flex items-center gap-1 mt-1`}>
              <TrendingUp className="h-3 w-3 text-green-500" />
              +{stats.recentActivity.newUsersWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card className={`${themeColors.shadows.card} transition-all ${themeColors.backgrounds.cardHover}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{i18n.t('auto_active_users')}</CardTitle>
            <UserCheck className={`h-4 w-4 ${themeColors.iconBackgrounds.secondary.split(' ')[1]}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats.activeUsers}</div>
            <p className={`text-xs ${themeColors.text.muted} mt-1`}>
              {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card className={`${themeColors.shadows.card} transition-all ${themeColors.backgrounds.cardHover}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{i18n.t('auto_pending_reports')}</CardTitle>
            <AlertCircle className={`h-4 w-4 ${themeColors.iconBackgrounds.warning.split(' ')[1]}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats.pendingReports}</div>
            <p className={`text-xs ${themeColors.text.muted} mt-1`}>{i18n.t('auto_requires_attention')}</p>
          </CardContent>
        </Card>

        <Card className={`${themeColors.shadows.card} transition-all ${themeColors.backgrounds.cardHover}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{i18n.t('auto_total_applications')}</CardTitle>
            <Activity className={`h-4 w-4 ${themeColors.iconBackgrounds.info.split(' ')[1]}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${themeColors.text.primary}`}>{stats.totalApplications}</div>
            <p className={`text-xs ${themeColors.text.muted} mt-1`}>{i18n.t('auto_platform_activity')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-5 w-5" />{i18n.t('auto_videos')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${themeColors.text.primary}`}>{stats.totalVideos}</div>
            <p className={`text-sm ${themeColors.text.muted} mt-2`}>{i18n.t('auto_total_videos_uploaded')}</p>
            <div className="mt-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">+{stats.recentActivity.newVideosWeek} this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />{i18n.t('auto_jobs')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${themeColors.text.primary}`}>{stats.totalJobs}</div>
            <p className={`text-sm ${themeColors.text.muted} mt-2`}>
              {stats.activeJobs} active postings
            </p>
            <div className="mt-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">+{stats.recentActivity.newJobsWeek} this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />{i18n.t('auto_user_status')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${themeColors.text.secondary}`}>{i18n.t('auto_active')}</span>
                <Badge className={themeColors.status.active}>{localize(stats.activeUsers)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${themeColors.text.secondary}`}>{i18n.t('auto_suspended')}</span>
                <Badge className={themeColors.status.suspended}>{localize(stats.bannedUsers)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${themeColors.text.secondary}`}>{i18n.t('auto_total')}</span>
                <Badge variant="outline">{localize(stats.totalUsers)}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{i18n.t('auto_quick_actions')}</CardTitle>
          <CardDescription>{i18n.t('auto_common_administrative_tasks')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin-tabs?group=users&tab=users')}
              className="justify-start"
            >
              <Users className="mr-2 h-4 w-4" />{i18n.t('auto_manage_users')}</Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin-tabs?group=content&tab=moderation')}
              className="justify-start"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Review Reports ({stats.pendingReports})
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin-tabs?group=blog&tab=blogs/new')}
              className="justify-start"
            >
              <Eye className="mr-2 h-4 w-4" />{i18n.t('auto_create_blog_post')}</Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin-tabs?group=analytics&tab=analytics')}
              className="justify-start"
            >
              <Activity className="mr-2 h-4 w-4" />{i18n.t('auto_view_analytics')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

