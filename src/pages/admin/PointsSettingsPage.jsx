import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { getAdminPointsRules, saveAdminPointsRules, getAdminPointsConversions, saveAdminPointsConversions, getAdminPointsTiers, saveAdminPointsTiers } from '@/services/points';

const PointsSettingsPage = () => {
  const [rules, setRules] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const [r, c, t] = await Promise.all([
        getAdminPointsRules(),
        getAdminPointsConversions(),
        getAdminPointsTiers(),
      ]);
      setRules(r);
      setConversions(c);
      setTiers(t);
    } catch (e) {
      setError(e?.message || 'Failed to load settings');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const saveAll = async () => {
    try {
      await saveAdminPointsRules(rules);
      await saveAdminPointsConversions(conversions);
      await saveAdminPointsTiers(tiers);
      alert('Saved');
    } catch (e) { alert(e?.message || 'Save failed'); }
  };

  const updateRule = (idx, key, value) => {
    const next = [...rules];
    next[idx] = { ...next[idx], [key]: value };
    setRules(next);
  };

  const addRule = () => setRules([...rules, { action: '', points: 0, dailyLimit: null, enabled: true }]);
  const addConversion = () => setConversions([...conversions, { type: 'subscription_plan', key: '', pointsCost: 0, enabled: true }]);
  const addTier = () => setTiers([...tiers, { name: '', minPoints: 0, sortOrder: 0 }]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Points Settings</h1>
      {loading ? <div>Loading…</div> : error ? <div className="text-red-500">{error}</div> : (
        <>
          <Card><CardContent>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Rules</h2>
              <button className="px-3 py-1 rounded bg-gray-200" onClick={addRule}>Add Rule</button>
            </div>
            <div className="mt-3 space-y-3">
              {rules.map((r, idx) => (
                <div key={r.id || idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                  <input className="border p-1" value={r.action || ''} onChange={e => updateRule(idx, 'action', e.target.value)} placeholder="action" />
                  <input className="border p-1" type="number" value={r.points ?? 0} onChange={e => updateRule(idx, 'points', parseInt(e.target.value || '0', 10))} placeholder="points" />
                  <input className="border p-1" type="number" value={r.dailyLimit ?? ''} onChange={e => updateRule(idx, 'dailyLimit', e.target.value === '' ? null : parseInt(e.target.value, 10))} placeholder="dailyLimit" />
                  <select className="border p-1" value={r.enabled ? 'true' : 'false'} onChange={e => updateRule(idx, 'enabled', e.target.value === 'true')}>
                    <option value="true">enabled</option>
                    <option value="false">disabled</option>
                  </select>
                  <div className="text-sm text-gray-500">{r.description?.en || ''}</div>
                </div>
              ))}
            </div>
          </CardContent></Card>

          <Card><CardContent>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Conversions</h2>
              <button className="px-3 py-1 rounded bg-gray-200" onClick={addConversion}>Add Conversion</button>
            </div>
            <div className="mt-3 space-y-3">
              {conversions.map((c, idx) => (
                <div key={c.id || idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                  <select className="border p-1" value={c.type || 'subscription_plan'} onChange={e => setConversions(prev => { const n = [...prev]; n[idx] = { ...n[idx], type: e.target.value }; return n; })}>
                    <option value="subscription_plan">subscription_plan</option>
                    <option value="feature">feature</option>
                    <option value="discount">discount</option>
                  </select>
                  <input className="border p-1" value={c.key || ''} onChange={e => setConversions(prev => { const n = [...prev]; n[idx] = { ...n[idx], key: e.target.value }; return n; })} placeholder="key (e.g. planId)" />
                  <input className="border p-1" type="number" value={c.pointsCost ?? 0} onChange={e => setConversions(prev => { const n = [...prev]; n[idx] = { ...n[idx], pointsCost: parseInt(e.target.value || '0', 10) }; return n; })} placeholder="pointsCost" />
                  <select className="border p-1" value={c.enabled ? 'true' : 'false'} onChange={e => setConversions(prev => { const n = [...prev]; n[idx] = { ...n[idx], enabled: e.target.value === 'true' }; return n; })}>
                    <option value="true">enabled</option>
                    <option value="false">disabled</option>
                  </select>
                  <div className="text-sm text-gray-500">{c.details ? JSON.stringify(c.details) : ''}</div>
                </div>
              ))}
            </div>
          </CardContent></Card>

          <Card><CardContent>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tiers</h2>
              <button className="px-3 py-1 rounded bg-gray-200" onClick={addTier}>Add Tier</button>
            </div>
            <div className="mt-3 space-y-3">
              {tiers.map((t, idx) => (
                <div key={t.id || idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                  <input className="border p-1" value={t.name || ''} onChange={e => setTiers(prev => { const n = [...prev]; n[idx] = { ...n[idx], name: e.target.value }; return n; })} placeholder="name" />
                  <input className="border p-1" type="number" value={t.minPoints ?? 0} onChange={e => setTiers(prev => { const n = [...prev]; n[idx] = { ...n[idx], minPoints: parseInt(e.target.value || '0', 10) }; return n; })} placeholder="minPoints" />
                  <input className="border p-1" type="number" value={t.sortOrder ?? 0} onChange={e => setTiers(prev => { const n = [...prev]; n[idx] = { ...n[idx], sortOrder: parseInt(e.target.value || '0', 10) }; return n; })} placeholder="sortOrder" />
                  <div className="text-sm text-gray-500">{t.benefits ? JSON.stringify(t.benefits) : ''}</div>
                </div>
              ))}
            </div>
          </CardContent></Card>

          <div className="flex gap-2">
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={saveAll}>Save All</button>
            <button className="px-4 py-2 rounded bg-gray-100" onClick={load}>Reload</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PointsSettingsPage;
