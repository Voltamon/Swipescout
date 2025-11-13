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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HERO */}
      <div className="relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-400 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20" />
        <div className="relative z-10 container mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-shrink-0">
              <div className="relative -mt-16">
                <Avatar className="h-36 w-36 ring-4 ring-white shadow-xl">
                  <AvatarImage src={profile.logo ? `${VITE_API_BASE_URL}${profile.logo}` : ''} alt={profile.companyName} />
                  <AvatarFallback className="bg-white/10 text-white text-4xl">{profile.companyName?.charAt(0) || 'C'}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="flex-1 text-white">
              <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">{profile.companyName}</h1>
              <p className="mt-1 text-lg opacity-90">{profile.industry} • {profile.companySize ? `${profile.companySize} employees` : 'Company'}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {profile.location && (
                  <Badge className="bg-white/10 text-white">{profile.location}</Badge>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="text-sm underline opacity-90">{profile.email}</a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm font-medium underline">Visit website</a>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {profile?.id && user?.id && profile.id !== user.id && (
                  <Button
                    onClick={async () => {
                      try {
                        const res = await sendConnection(profile.id);
                        toast({ title: 'Connection sent', description: res?.data?.message || 'Connection request sent.' });
                      } catch (err) {
                        const status = err?.response?.status;
                        const serverMsg = err?.response?.data?.message;
                        let userMsg = serverMsg || err?.message || 'Failed to send connection';
                        if (status === 404) userMsg = 'User not found (they may have been removed)';
                        toast({ title: 'Connection failed', description: userMsg, variant: 'destructive' });
                      }
                    }}
                    className="px-5 py-2"
                  >
                    Connect
                  </Button>
                )}

                <Button variant="outline" onClick={() => navigate(`/employer/${profile.id}/jobs`)} className="px-5 py-2">View Jobs</Button>
                <ReportButton contentType="user" contentId={profile.id} className="ml-2" />
              </div>
            </div>

            {/* Quick stats */}
            <div className="hidden lg:flex flex-col items-end gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold">{jobs.filter(j => j.status === 'active').length}</div>
                <div className="text-sm opacity-90">Open roles</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{profile.profileViews || 0}</div>
                <div className="text-sm opacity-90">Profile views</div>
              </div>
            </div>
          </div>

          {profile.description && (
            <div className="mt-6 max-w-3xl text-white/90 whitespace-pre-line">{profile.description}</div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow-sm">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">Jobs <span className="ml-2 text-sm text-muted-foreground">({jobs.length})</span></TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">Open Roles</div>
                      <div className="text-3xl font-bold">{jobs.filter(j => j.status === 'active').length}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">Profile Views (30d)</div>
                      <div className="text-3xl font-bold">{profile.profileViews || 0}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">Company Size</div>
                      <div className="text-3xl font-bold">{profile.companySize || '—'}</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="jobs" className="space-y-6">
                {jobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.map(job => (
                      <Card key={job.id} className="hover:shadow-lg transition-shadow">
                        <CardContent>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{job.title}</h3>
                              <div className="text-sm text-muted-foreground">{job.location} • {localize(job.jobType)}</div>
                            </div>
                            <div className="text-right">
                              <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>{localize(job.status)}</Badge>
                            </div>
                          </div>
                          {job.description && <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{job.description}</p>}
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" onClick={() => navigate(`/job/${job.id}`)}>View</Button>
                            <Button onClick={() => navigate(`/apply/${job.id}`)}>Apply</Button>
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
                      <p className="text-muted-foreground mb-4">This employer hasn't posted jobs yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
                {mainVideo ? (
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-0">
                        <div className="relative bg-black aspect-video">
                          <video
                            ref={mainVideoRef}
                            src={mainVideo.video_url || mainVideo.videoUrl || ''}
                            className="w-full h-full object-cover"
                            muted={isMuted}
                            onClick={togglePlay}
                            controls
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {videos.filter(v => v.id !== mainVideo.id).map(v => (
                        <Card key={v.id} className="overflow-hidden cursor-pointer" onClick={() => { /* open modal */ }}>
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
            </div>
          </Tabs>
        </div>

        {/* Right column: contact / quick info */}
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{profile.location}</div>}
                {profile.size && <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" />{profile.companySize}</div>}
                {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="underline">Visit website</a>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">{profile.shortBio || profile.description || 'No summary available.'}</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

   