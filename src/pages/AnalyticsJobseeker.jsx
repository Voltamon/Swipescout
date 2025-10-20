import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

export default function AnalyticsJobseeker() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/analytics/profile-views');
        setStats(res.data.stats || res.data || {});
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const labels = (stats?.daily_stats || stats?.profile_views_daily || []).map(d => d.date) || [];
  const data = (stats?.daily_stats || stats?.profile_views_daily || []).map(d => d.views) || [];

  return (
    <div style={{ padding: 24 }}>
      <h2>Jobseeker Analytics</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <strong>Total views:</strong> {stats?.total_views ?? stats?.profile_views ?? 0}
            <br />
            <strong>Unique viewers:</strong> {stats?.unique_viewers ?? 0}
            <br />
            <strong>Employer views:</strong> {stats?.employer_views ?? 0}
          </div>

          {labels.length > 0 ? (
            <Line data={{ labels, datasets: [{ label: 'Profile Views', data, fill: false }] }} />
          ) : (
            <div>No daily data available</div>
          )}
        </div>
      )}
    </div>
  );
}
