import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import themeColors from '@/config/theme-colors-admin';
import { BarChart3 } from 'lucide-react';
import { getPlatformAnalytics } from '@/services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const AdminAnalyticsPage = () => {
  const { t } = useTranslation('adminAnalytics');
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const fetchAnalytics = async (p = '7d') => {
    try {
      setLoading(true);
      const response = await getPlatformAnalytics({ period: p });
      setAnalytics(response.data.analytics || response.data || null);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  // Memoized chart datasets to avoid re-computation on every render
  const userGrowthData = useMemo(() => {
    if (!analytics?.userGrowth?.length) return null;
    const labels = analytics.userGrowth.map((r) => r.date);
    const data = analytics.userGrowth.map((r) => r.count);
    return {
      labels,
      datasets: [
        {
          label: 'Users',
          data,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 2
        }
      ]
    };
  }, [analytics]);

  const videoTrendsData = useMemo(() => {
    if (!analytics?.videoTrends?.length) return null;
    const labels = analytics.videoTrends.map((r) => r.date);
    const data = analytics.videoTrends.map((r) => r.count);
    return {
      labels,
      datasets: [
        {
          label: 'Videos',
          data,
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 2
        }
      ]
    };
  }, [analytics]);

  const jobTrendsData = useMemo(() => {
    if (!analytics?.jobTrends?.length) return null;
    const labels = analytics.jobTrends.map((r) => r.date);
    const data = analytics.jobTrends.map((r) => r.count);
    return {
      labels,
      datasets: [
        {
          label: 'Jobs',
          data,
          borderColor: '#9333ea',
          backgroundColor: 'rgba(147, 51, 234, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 2
        }
      ]
    };
  }, [analytics]);

  const roleDistributionData = useMemo(() => {
    if (!analytics?.roleDistribution?.length) return null;
    const labels = analytics.roleDistribution.map((r) => r.role ?? r.name ?? 'Unknown');
    const data = analytics.roleDistribution.map((r) => r.count ?? r.value ?? 0);
    const colors = [
      '#2563eb',
      '#16a34a',
      '#9333ea',
      '#f59e0b',
      '#ef4444',
      '#06b6d4',
      '#84cc16',
      '#f97316'
    ];
    return {
      labels,
      datasets: [
        {
          label: 'Users by role',
          data,
          backgroundColor: labels.map((_, i) => colors[i % colors.length]),
          borderWidth: 0
        }
      ]
    };
  }, [analytics]);

  const commonLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true }, tooltip: { mode: 'index', intersect: false } },
    interaction: { mode: 'nearest', intersect: false },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>{t('title')}</h2>
        <div className="flex gap-2">
          {['7d','30d','90d','1y'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded ${period===p? 'bg-slate-200':''}`}>{p}</button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics ({period})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading analytics...</div>
          ) : analytics ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">User Growth</h4>
                <div className="mt-3 h-48">
                  {userGrowthData ? <Line data={userGrowthData} options={commonLineOptions} /> : <div className="text-sm text-muted">No data</div>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Video Trends</h4>
                <div className="mt-3 h-48">
                  {videoTrendsData ? <Line data={videoTrendsData} options={commonLineOptions} /> : <div className="text-sm text-muted">No data</div>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Job Trends</h4>
                <div className="mt-3 h-48">
                  {jobTrendsData ? <Line data={jobTrendsData} options={commonLineOptions} /> : <div className="text-sm text-muted">No data</div>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Role Distribution</h4>
                <div className="mt-3 h-56">
                  {roleDistributionData ? <Doughnut data={roleDistributionData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} /> : <div className="text-sm text-muted">No data</div>}
                </div>
              </div>
            </div>
          ) : (
            <div>No analytics available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;
