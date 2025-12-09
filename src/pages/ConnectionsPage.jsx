import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import OpenChatModal from '@/components/Chat/OpenChatModal.jsx';
import { getConnections, getPendingReceived, getPendingSent, acceptConnection, rejectConnection } from '@/services/connectionService.js';
import localize from '@/utils/localize';
import { Users, UserCheck, UserPlus, Clock, MessageCircle, X, Check, Loader2 } from 'lucide-react';

const ConnectionsPage = () => {
  const { toast } = useToast();
  const { role } = useAuth();
  const [accepted, setAccepted] = useState([]);
  const [pendingReceived, setPendingReceived] = useState([]);
  const [pendingSent, setPendingSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConversation, setOpenConversation] = useState(null);
  const [openChat, setOpenChat] = useState(false);

  // Dynamically import theme based on role
  const [themeColors, setThemeColors] = useState(null);
  useEffect(() => {
    const loadTheme = async () => {
      if (role === 'jobseeker') {
        const theme = await import('@/config/theme-colors-jobseeker');
        setThemeColors(theme.themeColors);
      } else {
        const theme = await import('@/config/theme-colors');
        setThemeColors(theme.themeColors);
      }
    };
    loadTheme();
  }, [role]);

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

  // Listen for real-time connection updates and refresh lists
  useEffect(() => {
    const onConnectionUpdated = (e) => {
      try {
        fetchAll();
      } catch (err) {}
    };
    window.addEventListener('connectionUpdated', onConnectionUpdated);
    return () => window.removeEventListener('connectionUpdated', onConnectionUpdated);
  }, []);

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

  const handleCancel = async (connectionId) => {
    try {
      await import('@/services/connectionService.js').then(m => m.deleteConnection(connectionId));
      toast({ description: 'Request cancelled' });
      await fetchAll();
    } catch (err) {
      console.error('Failed to cancel request', err);
      toast({ description: 'Failed to cancel request', variant: 'destructive' });
    }
  };

  if (!themeColors || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeColors.backgrounds.page} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.primary}`}>
              <Users className="h-8 w-8" />
            </div>
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${themeColors.text.gradient}`}>
            Your Connections
          </h1>
          <p className={`${themeColors.text.secondary} text-lg`}>
            Manage your professional network and pending requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={`${themeColors.shadows.md} border-l-4 border-l-green-500`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${themeColors.text.secondary}`}>Connected</p>
                  <p className="text-3xl font-bold mt-2">{accepted.length}</p>
                </div>
                <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.success}`}>
                  <UserCheck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${themeColors.shadows.md} border-l-4 border-l-amber-500`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${themeColors.text.secondary}`}>Requests Received</p>
                  <p className="text-3xl font-bold mt-2">{pendingReceived.length}</p>
                </div>
                <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.warning}`}>
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${themeColors.shadows.md} border-l-4 border-l-blue-500`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${themeColors.text.secondary}`}>Requests Sent</p>
                  <p className="text-3xl font-bold mt-2">{pendingSent.length}</p>
                </div>
                <div className={`p-3 rounded-full ${themeColors.iconBackgrounds.info}`}>
                  <UserPlus className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Received */}
        <Card className={`${themeColors.shadows.lg} hover:shadow-xl transition-shadow`}>
          <CardHeader className={`bg-gradient-to-r ${themeColors.gradients.primary} text-white`}>
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6" />
              <div>
                <CardTitle className="text-xl">Pending Requests Received</CardTitle>
                <CardDescription className="text-white/80">
                  Review and respond to connection requests
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {pendingReceived.length === 0 ? (
              <div className="text-center py-12">
                <div className={`inline-flex p-4 rounded-full ${themeColors.iconBackgrounds.info} mb-4`}>
                  <Clock className="h-12 w-12" />
                </div>
                <p className={`${themeColors.text.secondary} text-lg`}>No pending requests received</p>
                <p className={`${themeColors.text.muted} text-sm mt-2`}>When someone wants to connect, they'll appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReceived.map(r => (
                  <div key={r.connectionId} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border ${themeColors.borders.default} rounded-lg ${themeColors.backgrounds.cardHover} transition-colors`}>
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-indigo-500">
                        <AvatarImage src={r.sender?.photoUrl || r.sender?.photo_url} />
                        <AvatarFallback className={`${themeColors.buttons.primary} text-white text-lg`}>
                          {(r.sender?.displayName || r.sender?.firstName || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-lg">{r.sender?.displayName || r.sender?.firstName}</div>
                        <Badge variant="outline" className="mt-1">
                          {localize(r.sender?.role || '')}
                        </Badge>
                        {r.sender?.email && (
                          <p className={`${themeColors.text.muted} text-sm mt-1`}>{r.sender.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button 
                        onClick={() => handleAccept(r.connectionId)} 
                        className={`${themeColors.buttons.primary} text-white flex-1 sm:flex-none`}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleReject(r.connectionId)}
                        className="flex-1 sm:flex-none hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Requests Sent */}
        <Card className={`${themeColors.shadows.lg} hover:shadow-xl transition-shadow`}>
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <UserPlus className="h-6 w-6" />
              <div>
                <CardTitle className="text-xl">Pending Requests Sent</CardTitle>
                <CardDescription className="text-white/80">
                  Waiting for response from these connections
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {pendingSent.length === 0 ? (
              <div className="text-center py-12">
                <div className={`inline-flex p-4 rounded-full ${themeColors.iconBackgrounds.info} mb-4`}>
                  <UserPlus className="h-12 w-12" />
                </div>
                <p className={`${themeColors.text.secondary} text-lg`}>No pending requests sent</p>
                <p className={`${themeColors.text.muted} text-sm mt-2`}>Start connecting with professionals in your network</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSent.map(r => (
                  <div key={r.connectionId} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border ${themeColors.borders.default} rounded-lg ${themeColors.backgrounds.cardHover} transition-colors`}>
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-blue-500">
                        <AvatarImage src={r.receiver?.photoUrl || r.receiver?.photo_url} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg">
                          {(r.receiver?.displayName || r.receiver?.firstName || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-lg">{r.receiver?.displayName || r.receiver?.firstName}</div>
                        <Badge variant="outline" className="mt-1">
                          {localize(r.receiver?.role || '')}
                        </Badge>
                        {r.receiver?.email && (
                          <p className={`${themeColors.text.muted} text-sm mt-1`}>{r.receiver.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Badge className={`${themeColors.badges.warning}`}>
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      <Button 
                        variant="outline" 
                        onClick={() => handleCancel(r.connectionId)}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connected Users */}
        <Card className={`${themeColors.shadows.lg} hover:shadow-xl transition-shadow`}>
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <div className="flex items-center gap-3">
              <UserCheck className="h-6 w-6" />
              <div>
                <CardTitle className="text-xl">Your Network</CardTitle>
                <CardDescription className="text-white/80">
                  {accepted.length} professional connection{accepted.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {accepted.length === 0 ? (
              <div className="text-center py-12">
                <div className={`inline-flex p-4 rounded-full ${themeColors.iconBackgrounds.success} mb-4`}>
                  <UserCheck className="h-12 w-12" />
                </div>
                <p className={`${themeColors.text.secondary} text-lg`}>No connections yet</p>
                <p className={`${themeColors.text.muted} text-sm mt-2`}>Build your professional network by connecting with others</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {accepted.map(a => (
                  <Card key={a.id} className={`${themeColors.shadows.md} hover:shadow-lg transition-all hover:scale-105 cursor-pointer`}>
                    <CardContent className="p-5">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-3 ring-2 ring-offset-2 ring-green-500">
                          <AvatarImage src={a.photoUrl || a.photo_url} />
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl">
                            {(a.displayName || a.firstName || 'U').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-semibold text-lg mb-1">{a.displayName}</div>
                        {a.role && (
                          <Badge variant="outline" className="mb-3">
                            {localize(a.role)}
                          </Badge>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            // Open chat or navigate to profile
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <OpenChatModal open={openChat} onOpenChange={setOpenChat} conversation={openConversation} />
    </div>
  );
};

export default ConnectionsPage;
