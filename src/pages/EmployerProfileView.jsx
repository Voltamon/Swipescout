import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import ReportButton from '@/components/ReportButton.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import localize from '@/utils/localize';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { sendConnection } from '@/services/connectionService.js';
import { Play, Pause, Volume2, VolumeX, MapPin, Briefcase, ExternalLink, Loader2 } from 'lucide-react';
import { getEmployerPublicProfile, getUserVideosByUserId, getEmployerPublicJobs } from '@/services/api';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function EmployerPublicProfile({ userId: propUserId }) {
  const { userId: routeId } = useParams();
  const id = routeId || propUserId;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const mainVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [pRes, vRes, jRes] = await Promise.all([
          getEmployerPublicProfile(id),
          getUserVideosByUserId(id),
          getEmployerPublicJobs(id)
        ]);
        if (!mounted) return;
        setProfile(pRes.data);
        setVideos(vRes.data?.videos || []);
        setJobs(jRes.data?.jobs || []);
      } catch (err) {
        console.error('Error fetching employer public data', err);
        toast({ title: 'Error', description: 'Failed to load employer data', variant: 'destructive' });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [id, toast]);

  const togglePlay = () => {
    if (!mainVideoRef.current) return;
    if (isPlaying) mainVideoRef.current.pause(); else mainVideoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!mainVideoRef.current) return;
    mainVideoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold">Employer not found</h2>
        <p className="text-muted-foreground">The requested employer profile doesn't exist.</p>
      </div>
    );
  }

  const mainVideo = videos.find(v => (v.videoPosition === 'main' || v.video_position === 'main')) || videos[0];

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-8">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile.logo ? `${VITE_API_BASE_URL}${profile.logo}` : ''} alt={profile.companyName} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-4xl">
                    {profile.companyName?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{profile.companyName}</h1>
                    <p className="text-lg text-muted-foreground">{profile.industry}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* Show Connect only when viewing someone else's profile */}
                    {profile?.id && user?.id && profile.id !== user.id && (
                      <Button
                        variant="outline"
                        onClick={async () => {
                          try {
                            await sendConnection(profile.id);
                            toast({ title: 'Connection sent', description: 'Connection request sent successfully.' });
                          } catch (err) {
                            console.error('Connection failed', err);
                            toast({ title: 'Error', description: err.response?.data?.message || 'Failed to send connection', variant: 'destructive' });
                          }
                        }}
                      >
                        Connect
                      </Button>
                    )}
                      <ReportButton contentType="user" contentId={profile.id} className="bg-white/5 text-white hover:bg-white/20" />
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {profile.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  {profile.companySize && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.companySize} employees</span>
                    </div>
                  )}

                  {profile.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${profile.email}`} className="hover:text-cyan-600">{profile.email}</a>
                    </div>
                  )}

                  {profile.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 flex items-center gap-1">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {profile.description && (
                  <div className="mt-3 text-muted-foreground whitespace-pre-line">{profile.description}</div>
                )}
              </div>

              {/* Main company video (public view) */}
              {mainVideo && (
                <div className="lg:w-[360px] flex-shrink-0">
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-black p-3">
                      <CardTitle className="text-white text-lg">Company Video</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative bg-black aspect-video max-h-56">
                        <video
                          src={mainVideo.video_url || mainVideo.videoUrl || ''}
                          className="w-full h-full object-cover"
                          controls
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm text-gray-900">{mainVideo.video_title || mainVideo.videoTitle || 'Company Video'}</p>
                        {mainVideo.description && (
                          <p className="text-sm text-muted-foreground mt-1">{mainVideo.description}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{jobs.filter(j => j.status === 'active').length}</div>
                <p className="text-xs text-muted-foreground mt-1">Job postings</p>
              </CardContent>
            </Card>

            {/* Total Applications removed for public view */}

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{profile.profileViews || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">In the last 30 days</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <div className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-3 w-3" />{job.location}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>{localize(job.status)}</Badge>
                        <Badge variant="outline">{localize(job.jobType)}</Badge>
                      </div>
                      {job.description && <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>}
                      <Button variant="outline" className="w-full" onClick={() => navigate(`/job/${job.id}`)}>View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
                <p className="text-muted-foreground mb-4">Start attracting candidates by posting your first job</p>
                <Button onClick={() => navigate('/employer-tabs?group=jobManagement&tab=post-job')} className="bg-cyan-600 text-white">Post a Job</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          {mainVideo ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{mainVideo.video_title || 'Company Video'}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative bg-black aspect-video">
                      <video
                        ref={mainVideoRef}
                        src={mainVideo.video_url || mainVideo.videoUrl || ''}
                        className="w-full h-full object-cover"
                        muted={isMuted}
                        onClick={togglePlay}
                      />

                      <div className="absolute inset-0 flex items-end p-4 pointer-events-none">
                        <div className="w-full flex justify-between items-center pointer-events-auto">
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={togglePlay} className="bg-white/20 text-white">
                              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            </Button>
                            <Button size="icon" variant="ghost" onClick={toggleMute} className="bg-white/20 text-white">
                              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                          </div>
                          <div className="text-white text-sm">{mainVideo.viewsCount || 0} views</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                {videos.filter(v => v.id !== mainVideo.id).map(v => (
                  <Card key={v.id} className="overflow-hidden cursor-pointer" onClick={() => { /* optionally open modal */ }}>
                    <div className="relative bg-black aspect-video">
                      <video src={v.video_url || v.videoUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <CardContent>
                      <h3 className="font-semibold truncate">{v.video_title || v.title}</h3>
                      {v.description && <p className="text-sm text-muted-foreground truncate mt-1">{v.description}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No videos</h3>
                <p className="text-muted-foreground">This employer hasn't uploaded any videos yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
    
  );
} 

   