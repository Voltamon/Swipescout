import React, { useEffect, useState } from 'react';
import { getAdminConnections, purgeRemovedConnections } from '@/services/adminService.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { useToast } from '@/hooks/use-toast';

const AdminConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await getAdminConnections();
      setConnections(res?.data?.connections || []);
      setAudits(res?.data?.audits || []);
    } catch (err) {
      console.error('Failed to load admin connections', err);
      toast({ title: 'Error', description: 'Failed to load connections', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handlePurge = async () => {
    try {
      await purgeRemovedConnections({ days: 30 });
      toast({ title: 'Purge started', description: 'Old removed connections will be purged.' });
      await fetchAll();
    } catch (err) {
      console.error('Purge failed', err);
      toast({ title: 'Error', description: 'Purge failed', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Connections Audit</h1>
        <p className="text-sm text-muted-foreground">Review connection events and purge removed connections.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Removed Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={handlePurge} className="bg-red-600">Purge removed connections older than 30 days</Button>
          </div>
          {connections.length === 0 ? (
            <div className="text-sm text-muted-foreground">No removed connections</div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {connections.map(c => (
                <div key={c.id} className="p-2 border rounded">{c.id} — {c.status} — {c.userOne?.displayName || c.userOne?.firstName} ↔ {c.userTwo?.displayName || c.userTwo?.firstName}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Events</CardTitle>
        </CardHeader>
        <CardContent>
          {audits.length === 0 ? (
            <div className="text-sm text-muted-foreground">No audit events</div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {audits.map(a => (
                <div key={a.id} className="p-2 border rounded">{a.action} — {a.connectionId} — {a.actorId} → {a.targetId} — {a.created_at}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminConnectionsPage;
