import { useState, useEffect, useCallback } from 'react';
import { getConnections } from '@/services/connectionService.js';
import { getPendingReceived, getPendingSent } from '@/services/connectionService.js';

export default function useConnectionMap(initialUserIds = []) {
  const [connectionMap, setConnectionMap] = useState({});
  const [loading, setLoading] = useState(false);

  const buildMap = useCallback(async () => {
    try {
      setLoading(true);
      const [acceptedRes, sentRes, recRes] = await Promise.all([
        getConnections(),
        getPendingSent(),
        getPendingReceived()
      ]);

      const map = {};
      const accepted = acceptedRes?.data?.connections || acceptedRes?.data || [];
      const sent = sentRes?.data?.pendingSent || [];
      const rec = recRes?.data?.pendingReceived || [];

      accepted.forEach(a => {
        const otherId = a.id || a.user?.id || a.userId;
        if (otherId) map[otherId] = { status: 'accepted', id: a.id };
      });
      sent.forEach(s => {
        const id = s.receiver?.id || s.receiverId;
        if (id) map[id] = { status: 'pending', id: s.connectionId, isSender: true };
      });
      rec.forEach(r => {
        const id = r.sender?.id || r.senderId;
        if (id) map[id] = { status: 'pending', id: r.connectionId, isSender: false };
      });

      setConnectionMap(map);
      return map;
    } catch (err) {
      console.warn('useConnectionMap: failed to build map', err);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buildMap();
  }, [buildMap]);

  return { connectionMap, refresh: buildMap, loading };
}
