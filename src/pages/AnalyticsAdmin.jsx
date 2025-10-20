import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AnalyticsAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        // try a few sensible endpoints; admin may not have a dedicated one
        const endpoints = [
          '/api/admin/analytics',
          '/api/analytics/site-stats',
          '/api/analytics/overview'
        ];
        let resp = null;
        for (const ep of endpoints) {
          try {
            const r = await axios.get(ep);
            if (r && r.data) { resp = r; break; }
          } catch (e) {
            // ignore and try next
          }
        }
        if (!resp) throw new Error('No admin analytics endpoint found');
        setStats(resp.data || resp.data.stats || {});
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Analytics</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(stats, null, 2)}</pre>
      )}
    </div>
  );
}
