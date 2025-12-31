import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { getAdminUsersPoints } from '@/services/points';
import i18n from 'i18next';

const UsersPointsPage = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');

  const load = async (p = page) => {
    const data = await getAdminUsersPoints(p, limit, search);
    setRows(data.rows || []);
    setTotal(data.total || 0);
    setPage(data.page || p);
  };

  useEffect(() => { load(1); }, [limit, search]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{i18n.t('auto_users_points')}</h1>
      <div className="flex gap-2 items-center">
        <input className="border p-1" placeholder={i18n.t('auto_search_by_userid')}  value={search} onChange={e => setSearch(e.target.value)} />
        <select className="border p-1" value={limit} onChange={e => setLimit(parseInt(e.target.value, 10))}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div className="bg-white rounded shadow divide-y">
        {rows.map(r => (
          <div key={r.id} className="p-3 grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
            <div className="font-mono text-xs text-gray-500">{r.userId}</div>
            <div>Total: {r.totalPoints}</div>
            <div>Available: {r.availablePoints}</div>
            <div>Tier: {r.tier || '-'}</div>
            <div className="text-gray-400 text-sm">Updated: {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : ''}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-gray-100" onClick={() => load(Math.max(1, page - 1))}>{i18n.t('auto_prev')}</button>
        <div className="px-3 py-1">Page {page} of {Math.max(1, Math.ceil(total / limit))}</div>
        <button className="px-3 py-1 rounded bg-gray-100" onClick={() => load(page + 1)}>{i18n.t('auto_next')}</button>
      </div>
    </div>
  );
};

export default UsersPointsPage;
