import i18n from 'i18next';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import api from '../services/api';
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
  TrendingUp,
  Users,
  Briefcase,
  Download,
  Calendar,
  RefreshCw,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/UI/table.jsx';
import themeColors from '@/config/theme-colors-employer';

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

function Spinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium ${themeColors.text.secondary}`}>{title}</p>
            <h3 className={`text-3xl font-bold mt-2 ${themeColors.text.primary}`}>{value}</h3>
            {subtitle && (
              <p className={`text-xs mt-1 ${themeColors.text.muted}`}>{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                {trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trendValue}
                </span>
                <span className={`text-xs ${themeColors.text.muted}`}>{i18n.t('auto_vs_last_month')}</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.primary}`}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsEmployer() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchStats = useCallback(async (opts = {}) => {
    setError(null);
    setLoading(true);
    try {
      const params = {};
      if (opts.from) params.from = opts.from;
      if (opts.to) params.to = opts.to;
  // Always include profileType to scope analytics to employer profile views
  params.profileType = 'employer';
  const res = await import('@/services/api').then(m => m.getEmployerStats(params));
      setStats(res.data || {});
    } catch (e) {
      console.error('[AnalyticsEmployer] fetch error', e);
      setError(e.response?.data?.message || e.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const onProfileView = (e) => {
      // refresh stats when profile view is recorded for the tracked employer
      fetchStats();
    };
    window.addEventListener('profileViewRecorded', onProfileView);
    return () => window.removeEventListener('profileViewRecorded', onProfileView);
  }, [fetchStats]);

  const jobStats = useMemo(() => stats?.stats || stats?.jobs || [], [stats]);
  const labels = useMemo(() => (Array.isArray(jobStats) ? jobStats.map(j => j.job_title || j.title || j.job_id) : []), [jobStats]);
  const values = useMemo(() => (Array.isArray(jobStats) ? jobStats.map(j => j.totalSwipes || j.views || 0) : []), [jobStats]);

  // Chart data configurations
  const viewsChartData = useMemo(() => ({
    labels: stats?.job_views_timeline?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Job Views',
        data: stats?.job_views_timeline?.data || [120, 190, 150, 250, 220, 300],
        ...themeColors.charts.line.primary,
        tension: 0.4,
      },
    ],
  }), [stats]);

  const applicantsChartData = useMemo(() => ({
    labels: labels.slice(0, 5),
    datasets: [
      {
        label: 'Applicants per Job',
        data: stats?.applicants_per_job || [25, 18, 12, 8, 15],
        backgroundColor: themeColors.charts.bar.secondary,
        borderColor: themeColors.charts.bar.secondary,
        borderWidth: 1,
      },
    ],
  }), [labels, stats]);

  const applicantSourcesChartData = useMemo(() => ({
    labels: ['Direct Search', 'Referrals', 'Social Media', 'Job Boards', 'Other'],
    datasets: [
      {
        data: stats?.applicant_sources || [35, 25, 20, 15, 5],
        backgroundColor: themeColors.charts.doughnut,
        borderColor: themeColors.charts.doughnutBorders,
        borderWidth: 2,
      },
    ],
  }), [stats]);

  const handleRefresh = () => fetchStats({ from: fromDate, to: toDate });

  const handleExport = () => {
    if (!Array.isArray(jobStats) || jobStats.length === 0) return;
    const rows = jobStats.map(j => ({
      job_id: j.job_id || '',
      title: j.job_title || j.title || '',
      views: j.views ?? j.totalSwipes ?? 0,
      applicants: j.applicants_count || 0,
      status: j.status || 'active',
    }));
    const csv = [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employer-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${themeColors.backgrounds.page} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${themeColors.text.gradient}`}>{i18n.t('auto_analytics_dashboard')}</h1>
            <p className={themeColors.text.secondary}>
              Comprehensive insights into your job postings and applicant engagement
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
                aria-label={i18n.t('auto_from_date')} 
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
                aria-label={i18n.t('auto_to_date')} 
              />
            </div>
            <Button onClick={handleRefresh} className={`${themeColors.buttons.primary} text-white`}>
              <RefreshCw className="h-4 w-4 mr-2" />{i18n.t('auto_refresh')}</Button>
            <Button onClick={handleExport} variant="outline" className={themeColors.buttons.outline}>
              <Download className="h-4 w-4 mr-2" />{i18n.t('auto_export')}</Button>
          </div>
        </div>

        {loading && <Spinner />}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && stats && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title={i18n.t('auto_total_job_views')} 
                value={stats?.total_job_views || stats?.totalJobViews || 0}
                subtitle={i18n.t('auto_all_time')} 
                icon={Eye}
                trend="up"
                trendValue="+12%"
              />
              <StatCard
                title={i18n.t('auto_total_applicants')} 
                value={stats?.total_applicants || stats?.newApplications || 0}
                subtitle={i18n.t('auto_all_time')} 
                icon={Users}
                trend="up"
                trendValue="+8%"
              />
              <StatCard
                title={i18n.t('auto_active_jobs')} 
                value={stats?.activeJobs ?? stats?.active_jobs ?? 0}
                subtitle={i18n.t('auto_currently_posted')} 
                icon={Briefcase}
              />
              <StatCard
                title={i18n.t('auto_avg_applications_per_job')} 
                value={stats?.avg_applications_per_job || Math.round((stats?.total_applicants || 0) / (stats?.active_jobs || 1))}
                subtitle={i18n.t('auto_across_all_jobs')} 
                icon={TrendingUp}
                trend="up"
                trendValue="+5%"
              />
            </div>

            {/* Charts Section */}
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{i18n.t('auto_performance_analytics')}</CardTitle>
                      <CardDescription>{i18n.t('auto_detailed_breakdown_of_your_job_posting_p')}</CardDescription>
                    </div>
                  </div>
                  <TabsList className="grid w-full grid-cols-3 mt-4">
                    <TabsTrigger value="overview">{i18n.t('auto_overview')}</TabsTrigger>
                    <TabsTrigger value="engagement">{i18n.t('auto_engagement')}</TabsTrigger>
                    <TabsTrigger value="sources">{i18n.t('auto_sources')}</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-6">
                  <TabsContent value="overview" className="space-y-6 mt-0">
                    <div className="h-80">
                      <h3 className={`text-lg font-semibold mb-4 ${themeColors.text.primary}`}>{i18n.t('auto_job_views_over_time')}</h3>
                      <Line
                        data={viewsChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'top' },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              padding: 12,
                              titleFont: { size: 14 },
                              bodyFont: { size: 13 },
                            },
                          },
                          scales: {
                            y: { beginAtZero: true },
                          },
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="engagement" className="space-y-6 mt-0">
                    <div className="h-80">
                      <h3 className={`text-lg font-semibold mb-4 ${themeColors.text.primary}`}>{i18n.t('auto_applicants_per_job')}</h3>
                      <Bar
                        data={applicantsChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              padding: 12,
                            },
                          },
                          scales: {
                            y: { beginAtZero: true },
                          },
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="sources" className="space-y-6 mt-0">
                    <div className="h-80 flex items-center justify-center">
                      <div className="w-full max-w-md">
                        <h3 className={`text-lg font-semibold mb-4 text-center ${themeColors.text.primary}`}>{i18n.t('auto_applicant_sources')}</h3>
                        <Doughnut
                          data={applicantSourcesChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'bottom' },
                              tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                padding: 12,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            {/* Detailed Job Stats Table */}
            {Array.isArray(jobStats) && jobStats.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{i18n.t('auto_job_performance_details')}</CardTitle>
                  <CardDescription>{i18n.t('auto_individual_job_statistics_and_metrics')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{i18n.t('auto_job_title')}</TableHead>
                          <TableHead>{i18n.t('auto_job_id')}</TableHead>
                          <TableHead className="text-right">{i18n.t('auto_views')}</TableHead>
                          <TableHead className="text-right">{i18n.t('auto_applicants')}</TableHead>
                          <TableHead className="text-right">{i18n.t('auto_conversion_rate')}</TableHead>
                          <TableHead>{i18n.t('auto_status')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobStats.map((j, idx) => {
                          const views = j.views ?? j.totalSwipes ?? 0;
                          const applicants = j.applicants_count || 0;
                          const conversionRate = views > 0 ? ((applicants / views) * 100).toFixed(1) : '0.0';
                          
                          return (
                            <TableRow key={j.job_id || j.id || idx}>
                              <TableCell className="font-medium">
                                {j.job_title || j.title || 'Untitled'}
                              </TableCell>
                              <TableCell className="text-gray-500">
                                {j.job_id || j.id || '-'}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {views}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {applicants}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge className={parseFloat(conversionRate) > 5 ? themeColors.badges.success : themeColors.badges.gray}>
                                  {conversionRate}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={j.status === 'active' ? themeColors.badges.success : themeColors.badges.gray}>
                                  {j.status || 'active'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
                    <h3 className={`text-lg font-semibold mb-2 ${themeColors.text.primary}`}>{i18n.t('auto_performance_insights')}</h3>
                    <p className={`text-sm ${themeColors.text.secondary}`}>
                      Your jobs are performing {stats?.performance_rating || 'well'} compared to similar postings
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <h3 className={`text-lg font-semibold mb-2 ${themeColors.text.primary}`}>{i18n.t('auto_growth_trend')}</h3>
                    <p className={`text-sm ${themeColors.text.secondary}`}>
                      {stats?.growth_trend || '+15%'} increase in applicant engagement this month
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                    <h3 className={`text-lg font-semibold mb-2 ${themeColors.text.primary}`}>{i18n.t('auto_top_source')}</h3>
                    <p className={`text-sm ${themeColors.text.secondary}`}>
                      Most applicants come from {stats?.top_source || 'Direct Search'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
