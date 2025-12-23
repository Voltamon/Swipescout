import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  getUserInterviews, 
  getInterviewDetails, 
  updateInterviewStatus,
  rescheduleInterview,
  cancelInterview,
  joinInterview
} from '@/services/api';
import VideoCallInterface from '../components/VideoCallInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/UI/dialog.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Textarea } from '@/components/UI/textarea.jsx';
import {
  Video,
  Calendar,
  Clock,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
  Edit,
  Loader2,
  MapPin
} from 'lucide-react';
import themeColors from '@/config/theme-colors-jobseeker';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [newDateTime, setNewDateTime] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchInterviews();
    if (id) {
      fetchInterviewDetails(id);
    }
  }, [id]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await getUserInterviews();
      setInterviews(response.data.interviews || []);
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
      toast({
        title: "Error",
        description: "Failed to load interviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewDetails = async (interviewId) => {
    try {
      const response = await getInterviewDetails(interviewId);
      setSelectedInterview(response.data.interview);
    } catch (error) {
      console.error('Failed to fetch interview details:', error);
      toast({
        title: "Error",
        description: "Failed to load interview details",
        variant: "destructive",
      });
    }
  };

  const handleJoinInterview = async (interview) => {
    try {
      const response = await joinInterview(interview.id);
      setSelectedInterview({
        ...interview,
        meetingLink: response.data.meetingLink,
        roomName: response.data.roomName
      });
      setShowVideoCall(true);
    } catch (error) {
      console.error('Failed to join interview:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to join interview",
        variant: "destructive",
      });
    }
  };

  const handleReschedule = async () => {
    if (!newDateTime) {
      toast({
        title: "Error",
        description: "Please select a new date and time",
        variant: "destructive",
      });
      return;
    }

    try {
      await rescheduleInterview(selectedInterview.id, {
        newDateTime,
        reason: 'Rescheduled by user'
      });
      
      setRescheduleDialog(false);
      setNewDateTime('');
      
      toast({
        title: "Success",
        description: "Interview rescheduled successfully",
      });
      
      fetchInterviews();
      if (selectedInterview) {
        fetchInterviewDetails(selectedInterview.id);
      }
    } catch (error) {
      console.error('Failed to reschedule interview:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule interview",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for cancellation",
        variant: "destructive",
      });
      return;
    }

    try {
      await cancelInterview(selectedInterview.id, { reason: cancelReason });
      
      setCancelDialog(false);
      setCancelReason('');
      
      toast({
        title: "Success",
        description: "Interview cancelled successfully",
      });
      
      fetchInterviews();
      if (selectedInterview) {
        fetchInterviewDetails(selectedInterview.id);
      }
    } catch (error) {
      console.error('Failed to cancel interview:', error);
      toast({
        title: "Error",
        description: "Failed to cancel interview",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { variant: 'default', icon: Calendar, label: 'Scheduled', className: 'bg-blue-100 text-blue-800' },
      in_progress: { variant: 'default', icon: PlayCircle, label: 'In Progress', className: 'bg-yellow-100 text-yellow-800' },
      completed: { variant: 'default', icon: CheckCircle, label: 'Completed', className: 'bg-green-100 text-green-800' },
      cancelled: { variant: 'destructive', icon: XCircle, label: 'Cancelled', className: 'bg-red-100 text-red-800' },
      rescheduled: { variant: 'default', icon: Edit, label: 'Rescheduled', className: 'bg-purple-100 text-purple-800' }
    };

    const config = badges[status] || badges.scheduled;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filterInterviews = (status) => {
    if (status === 'upcoming') {
      return interviews.filter(interview => 
        ['scheduled', 'rescheduled'].includes(interview.status) &&
        new Date(interview.scheduled_at) > new Date()
      );
    }
    if (status === 'past') {
      return interviews.filter(interview => 
        ['completed', 'cancelled'].includes(interview.status) ||
        new Date(interview.scheduled_at) < new Date()
      );
    }
    return interviews;
  };

  const canJoinInterview = (interview) => {
    const now = new Date();
    const scheduledTime = new Date(interview.scheduled_at);
    const timeDiff = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);
    return timeDiff <= 15 && timeDiff >= -60 && interview.status === 'scheduled';
  };

  if (showVideoCall && selectedInterview) {
    return (
      <VideoCallInterface
        interviewId={selectedInterview.id}
        roomName={selectedInterview.roomName}
        meetingLink={selectedInterview.meetingLink}
        onCallEnd={() => {
          setShowVideoCall(false);
          fetchInterviews();
        }}
        interviewDetails={selectedInterview}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="`${themeColors.text.gradient} text-4xl font-bold  mb-2">
          {t('interviews.title') || 'Interviews'}
        </h1>
        <p className="text-muted-foreground">
          Manage and join your scheduled interviews
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({filterInterviews('upcoming').length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({filterInterviews('past').length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({interviews.length})
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Interviews */}
        <TabsContent value="upcoming" className="space-y-6">
          {filterInterviews('upcoming').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterInterviews('upcoming').map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  user={user}
                  canJoin={canJoinInterview(interview)}
                  onJoin={handleJoinInterview}
                  onReschedule={(int) => {
                    setSelectedInterview(int);
                    setRescheduleDialog(true);
                  }}
                  onCancel={(int) => {
                    setSelectedInterview(int);
                    setCancelDialog(true);
                  }}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No upcoming interviews</h3>
                <p className="text-muted-foreground">
                  Your scheduled interviews will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Past Interviews */}
        <TabsContent value="past" className="space-y-6">
          {filterInterviews('past').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterInterviews('past').map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  user={user}
                  canJoin={false}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No past interviews</h3>
                <p className="text-muted-foreground">
                  Completed and cancelled interviews will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* All Interviews */}
        <TabsContent value="all" className="space-y-6">
          {interviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  user={user}
                  canJoin={canJoinInterview(interview)}
                  onJoin={handleJoinInterview}
                  onReschedule={(int) => {
                    setSelectedInterview(int);
                    setRescheduleDialog(true);
                  }}
                  onCancel={(int) => {
                    setSelectedInterview(int);
                    setCancelDialog(true);
                  }}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No interviews yet</h3>
                <p className="text-muted-foreground">
                  Your interviews will appear here once scheduled
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialog} onOpenChange={setRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Interview</DialogTitle>
            <DialogDescription>
              Select a new date and time for the interview
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newDateTime">New Date & Time</Label>
              <Input
                id="newDateTime"
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReschedule}
              className={`${themeColors.buttons.primary} text-white  hover:from-purple-700 hover:to-cyan-700`}
            >
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Interview</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this interview
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Reason for Cancellation</Label>
              <Textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please explain why you need to cancel..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(false)}>
              Keep Interview
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancel}
            >
              Cancel Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Interview Card Component
function InterviewCard({ interview, user, canJoin, onJoin, onReschedule, onCancel, getStatusBadge }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-grow">
            <CardTitle className="text-lg mb-1">{interview.job?.title || 'Interview'}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <User className="h-3 w-3" />
              {user?.role === 'employer' 
                ? interview.candidate?.displayName || interview.candidate?.fullName
                : interview.job?.employerProfile?.name || interview.employer?.displayName || 'Company'}
            </CardDescription>
          </div>
        </div>
        {getStatusBadge(interview.status)}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Date & Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(interview.scheduled_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(interview.scheduled_at).toLocaleTimeString()}</span>
          </div>
          {interview.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{interview.location}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {canJoin && (
            <Button 
              className={`${themeColors.buttons.primary} text-white w-full  hover:from-purple-700 hover:to-cyan-700`}
              onClick={() => onJoin(interview)}
            >
              <Video className="h-4 w-4 mr-2" />
              Join Interview
            </Button>
          )}
          
          {interview.status === 'scheduled' && !canJoin && (
            <div className="flex gap-2">
              {onReschedule && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onReschedule(interview)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              )}
              {onCancel && (
                <Button 
                  variant="outline" 
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onCancel(interview)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
