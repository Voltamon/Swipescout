import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { getMyPointsSummary, getMyPointsHistory, getConversions, redeemConversion } from '@/services/points';
import i18n from 'i18next';

const JobseekerPointsPage = () => {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState({ rows: [], total: 0, page: 1, limit: 20 });
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const [s, h, conv] = await Promise.all([
        getMyPointsSummary(),
        getMyPointsHistory(1, 20),
        getConversions(),
      ]);
      setSummary(s);
      setHistory(h);
      setConversions(conv);
    } catch (e) {
      setError(e?.message || 'Failed to load points');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRedeem = async (key, type) => {
    try {
      await redeemConversion(key, type);
      await load();
    } catch (e) { alert(e?.response?.data?.message || e?.message || 'Redeem failed'); }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">{i18n.t('auto_my_points')}</h1>
      {loading ? <div>Loading…</div> : error ? <div className="text-red-500">{error}</div> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardContent>
              <div className="text-gray-500">{i18n.t('auto_available')}</div>
              <div className="text-3xl font-bold">{summary?.availablePoints ?? 0}</div>
            </CardContent></Card>
            <Card><CardContent>
              <div className="text-gray-500">{i18n.t('auto_total')}</div>
              <div className="text-3xl font-bold">{summary?.totalPoints ?? 0}</div>
            </CardContent></Card>
            <Card><CardContent>
              <div className="text-gray-500">{i18n.t('auto_tier')}</div>
              <div className="text-3xl font-bold">{summary?.tier || '-'}</div>
            </CardContent></Card>
          </div>

          <div>
            <h2 className="text-xl font-semibold mt-6 mb-2">{i18n.t('auto_redeem')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {conversions.map((c) => (
                <Card key={`${c.type}:${c.key}`}>
                  <CardContent>
                    <div className="font-semibold">{c.type} - {c.key}</div>
                    <div className="text-sm text-gray-500">Cost: {c.pointsCost} pts</div>
                    <button className="mt-3 px-3 py-1 rounded bg-blue-600 text-white" onClick={() => handleRedeem(c.key, c.type)}>{i18n.t('auto_redeem')}</button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mt-6 mb-2">{i18n.t('auto_history')}</h2>
            <div className="bg-white rounded shadow divide-y">
              {history.rows.map((r) => (
                <div key={r.id} className="p-3 flex justify-between">
                  <div>
                    <div className="font-mono text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
                    <div className="font-semibold">{r.action}</div>
                  </div>
                  <div className={r.points >= 0 ? 'text-green-600' : 'text-red-600'}>{r.points > 0 ? `+${r.points}` : r.points}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobseekerPointsPage;
