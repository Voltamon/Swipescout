import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

export default function AnalyticsEmployer() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/analytics/employer-stats');
        setStats(res.data || res.data.stats || {});
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // attempt to read job-level stats if present
  const jobStats = stats?.stats || stats?.jobs || [];
  const labels = (Array.isArray(jobStats) ? jobStats.map(j => j.job_title || j.title || j.job_id) : []);
  const values = (Array.isArray(jobStats) ? jobStats.map(j => j.totalSwipes || j.views || 0) : []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Employer Analytics</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && !error && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <strong>Active Jobs:</strong> {stats?.activeJobs ?? stats?.active_jobs ?? 0}
            <br />
            <strong>New Applications:</strong> {stats?.newApplications ?? stats?.new_applications ?? 0}
            <br />
            <strong>Company Videos:</strong> {stats?.companyVideos ?? stats?.company_videos ?? 0}
          </div>

          {labels.length > 0 ? (
            <Bar data={{ labels, datasets: [{ label: 'Job Views / Swipes', data: values }] }} />
          ) : (
            <div>No per-job stats available</div>
          )}
        </div>
      )}
    </div>
  );
}
