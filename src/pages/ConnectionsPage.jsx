import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { useToast } from '@/hooks/use-toast';
import OpenChatModal from '@/components/Chat/OpenChatModal.jsx';
import { getConnections, getPendingReceived, getPendingSent, acceptConnection, rejectConnection } from '@/services/connectionService.js';
import localize from '@/utils/localize';

const ConnectionsPage = () => {
  const { toast } = useToast();
  const [accepted, setAccepted] = useState([]);
  const [pendingReceived, setPendingReceived] = useState([]);
  const [pendingSent, setPendingSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConversation, setOpenConversation] = useState(null);
  const [openChat, setOpenChat] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [accRes, recRes, sentRes] = await Promise.all([
        getConnections(),
        getPendingReceived(),
        getPendingSent(),
      ]);
      setAccepted(accRes?.data?.connections || accRes?.data || []);
      setPendingReceived(recRes?.data?.pendingReceived || []);
      setPendingSent(sentRes?.data?.pendingSent || []);
    } catch (err) {
      console.error('Error fetching connections', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAccept = async (connectionId) => {
    try {
      const { data } = await acceptConnection(connectionId);
      toast({ description: 'Connection accepted' });
      await fetchAll();
      if (data?.conversation) {
        setOpenConversation(data.conversation);
        setOpenChat(true);
      }
    } catch (err) {
      console.error('Failed to accept', err);
      toast({ description: 'Failed to accept connection', variant: 'destructive' });
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await rejectConnection(connectionId);
      toast({ description: 'Connection declined' });
      await fetchAll();
    } catch (err) {
      console.error('Failed to reject', err);
      toast({ description: 'Failed to decline connection', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Connections</h1>
        <p className="text-sm text-muted-foreground">Manage your connections and pending requests.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests Received</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pendingReceived.length === 0 ? (
              <div className="text-sm text-muted-foreground">No pending requests received</div>
            ) : (
              pendingReceived.map(r => (
                <div key={r.connectionId} className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={r.sender?.photoUrl || r.sender?.photo_url} />
                      <AvatarFallback>{(r.sender?.displayName || r.sender?.firstName || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{r.sender?.displayName || r.sender?.firstName}</div>
                      <div className="text-sm text-muted-foreground">{localize(r.sender?.role || '')}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleAccept(r.connectionId)} className="bg-gradient-to-r from-cyan-600 to-purple-600">Accept</Button>
                    <Button variant="outline" onClick={() => handleReject(r.connectionId)}>Decline</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests Sent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pendingSent.length === 0 ? (
              <div className="text-sm text-muted-foreground">No pending requests sent</div>
            ) : (
              pendingSent.map(r => (
                <div key={r.connectionId} className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={r.receiver?.photoUrl || r.receiver?.photo_url} />
                      <AvatarFallback>{(r.receiver?.displayName || r.receiver?.firstName || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{r.receiver?.displayName || r.receiver?.firstName}</div>
                      <div className="text-sm text-muted-foreground">{localize(r.receiver?.role || '')}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button disabled>Pending</Button>
                    <Button variant="outline" onClick={() => handleReject(r.connectionId)}>Cancel</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected</CardTitle>
        </CardHeader>
        <CardContent>
          {accepted.length === 0 ? (
            <div className="text-sm text-muted-foreground">No connections yet</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accepted.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 border rounded">
                  <Avatar>
                    <AvatarImage src={a.photoUrl || a.photo_url} />
                    <AvatarFallback>{(a.displayName || a.firstName || 'U').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{a.displayName}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <OpenChatModal open={openChat} onOpenChange={setOpenChat} conversation={openConversation} />
    </div>
  );
};

export default ConnectionsPage;
