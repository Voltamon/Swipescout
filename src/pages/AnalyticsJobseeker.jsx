import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsJobseeker() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
  // `api` instance already includes the `/api` base path, so request path
  // here should not include an extra `/api` segment to avoid `/api/api`.
  const res = await api.get(`/analytics/profile-views`, { params: { period } });
        setStats(res.data.stats || {});
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [period]);

  const lineChartData = {
    labels: (stats?.daily_stats || []).map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Profile Views',
        data: (stats?.daily_stats || []).map(d => d.views),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Analytics</h2>
        <div className="flex items-center space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Profile Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats?.total_views ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unique Viewers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats?.unique_viewers ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Based on your profile views, we recommend highlighting your skills in 'React' and 'Node.js' to attract more employers.
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Profile Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.daily_stats?.length > 0 ? (
                <Line data={lineChartData} />
              ) : (
                <p>No daily data available for this period.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
