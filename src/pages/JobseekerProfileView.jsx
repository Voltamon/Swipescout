import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/UI/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import localize from '@/utils/localize';
import {
  Heart,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Twitter,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowLeft,
  Eye,
  Globe
} from 'lucide-react';
import { sendConnection } from '@/services/connectionService.js';
import {
  getJobSeekerProfile,
  getUserVideosByUserId,
  getJobSeekerSkills,
  getJobSeekerExperiences,
  getJobSeekerEducation
} from '../services/api.js';

const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const JobSeekerProfileView = ({ userId: propUserId }) => {
  const { userId: paramId } = useParams();
  const id = paramId || propUserId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [videos, setVideos] = useState([]);
  const [mainVideo, setMainVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const mainVideoRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Component mount - no-op (previously had debug alerts)

  useEffect(() => {
    const fetchAll = async () => {
      if (!id) {
        return setError('No user id provided');
      }
      // fetchAll starting for id: (no alert)
      setLoading(true);
      setError(null);
      try {
        const [pRes, sRes, eRes, edRes, vRes] = await Promise.all([
          getJobSeekerProfile(id).catch(e => ({ error: e })),
          getJobSeekerSkills(id).catch(e => ({ error: e })),
          getJobSeekerExperiences(id).catch(e => ({ error: e })),
          getJobSeekerEducation(id).catch(e => ({ error: e })),
          getUserVideosByUserId(id).catch(e => ({ error: e }))
        ]);

        if (pRes?.error) throw pRes.error;
        // axios returns response object; normalize to the actual profile object
        const profileObj = pRes?.data ?? pRes;
        setProfile(profileObj);

        if (!sRes?.error) setSkills(sRes.data?.skills || []);
        else setSkills([]);

        setExperiences(eRes.data?.experiences || []);
        setEducation(edRes.data?.educations || []);

        const vids = vRes.data?.videos || [];
        setVideos(vids);
        setMainVideo(vids.find(v => v.video_position === 'main') || null);

        setLoading(false);
      } catch (e) {
        console.error('fetch error', e);
        setError(e?.message || String(e));
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mx-auto" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-72 mx-auto" />
          </div>
          <p className="text-sm text-slate-500 mt-4">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-lg text-center p-6 bg-white rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Error loading profile</h3>
          <p className="text-sm text-red-600 mb-4">{String(error)}</p>
          <p className="text-sm text-slate-600">If you see a connection refused error, make sure your backend is running on {VITE_API_BASE_URL} and accepts requests.</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">No profile found</div>
      </div>
    );
  }

  // Helpers to map backend fields to UI-friendly values
  const getDisplayName = (p) => {
    if (!p) return '';
    const first = p.first_name || p.user?.firstName || '';
    const middle = p.second_name || p.user?.middleName || '';
    const last = p.last_name || p.user?.lastName || '';
    const displayName = p.user?.displayName || p.displayName || '';
    const nameParts = [first, middle, last].filter(Boolean);
    return displayName || nameParts.join(' ') || 'User';
  };

  const getHeadline = (p) => {
    return p?.title || p?.headline || p?.preferred_job_title || p?.user?.title || 'Professional';
  };

  const getPhotoUrl = (p) => {
    const pic = p?.profile_pic || p?.user?.photoUrl || p?.user?.photoURL || null;
    if (!pic) return null;
    if (pic.startsWith('http://') || pic.startsWith('https://')) return pic;
    return `${VITE_API_BASE_URL}${pic}`;
  };

  const normalizeMediaUrl = (u) => {
    if (!u) return null;
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return `${VITE_API_BASE_URL}${u}`;
  };

  const handleConnect = async () => {
    if (!user || !user.id) {
      try { console.trace && console.trace('[JobSeekerProfileView] handleConnect trace'); } catch (e) {}
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    const receiverId = profile?.user?.id || profile?.userId || profile?.id;
    if (!receiverId) {
      toast({ title: 'Error', description: 'Could not identify profile owner', variant: 'destructive' });
      return;
    }

    try {
      await sendConnection(receiverId);
      toast({ title: 'Connection sent', description: 'Your connection request has been sent successfully!' });
    } catch (err) {
      console.error('Connection failed', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to send connection request', 
        variant: 'destructive' 
      });
    }
  };

  const handlePlayPause = () => {
    if (mainVideoRef.current) {
      if (isPlaying) {
        mainVideoRef.current.pause();
      } else {
        mainVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Determine whether the current viewer is the profile owner.
  const profileOwnerId = profile?.user?.id || profile?.userId || profile?.id || null;
  const isOwnProfile = Boolean(user?.id && profileOwnerId && String(profileOwnerId) === String(user.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => {
            if (window.history.length > 1) navigate(-1);
            else navigate('/');
          }}
          className="mb-6 hover:bg-white/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header Section */}
        <Card className="mb-8 border-l-4 border-l-cyan-500 shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Info Section */}
              <div className="flex-grow">
                <div className="flex items-start gap-6 mb-6">
                  {/* Avatar */}
                  <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                    <AvatarImage src={getPhotoUrl(profile)} alt={getDisplayName(profile)} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-4xl">
                      {getDisplayName(profile).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name & Title */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                          {getDisplayName(profile)}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-2">{getHeadline(profile)}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>{profile?.profileViews || 0} profile views</span>
                        </div>
                      </div>
                      {/* Connect Button - show when viewing another user (or not logged in) */}
                      {(!user?.id || !isOwnProfile) && (
                        <Button 
                          onClick={handleConnect}
                          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 shadow-lg"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </div>

                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {profile?.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-cyan-600" />
                          <span>{localize(profile.location)}</span>
                        </div>
                      )}

                      {profile?.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-cyan-600" />
                          <a href={`mailto:${profile.email}`} className="hover:text-cyan-600">
                            {profile.email}
                          </a>
                        </div>
                      )}

                      {profile?.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-cyan-600" />
                          <span>{profile.phone}</span>
                        </div>
                      )}

                      {profile?.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-cyan-600" />
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600">
                            Website
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    {(profile?.linkedin_url || profile?.social?.linkedin || profile?.social?.github || profile?.social?.twitter) && (
                      <div className="flex gap-2">
                        {(profile?.linkedin_url || profile?.social?.linkedin) && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={profile.linkedin_url || profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {profile?.social?.github && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={profile.social.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {profile?.social?.twitter && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* About Me */}
                {profile?.bio && (
                  <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-cyan-600" />
                      About Me
                    </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{localize(profile.bio)}</p>
                  </div>
                )}
              </div>

              {/* Video Resume Section */}
              {mainVideo && (
                <div className="lg:w-[380px] flex-shrink-0">
                  <Card className="overflow-hidden shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white p-4">
                      <CardTitle className="text-lg">Video Resume</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative bg-black aspect-[9/16] max-h-[500px]">
                        <video
                          ref={mainVideoRef}
                          src={normalizeMediaUrl(mainVideo.video_url)}
                          className="w-full h-full object-cover"
                          loop
                          onClick={handlePlayPause}
                        />
                        
                        {/* Video Controls Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                            <div className="flex justify-center">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white"
                                onClick={handlePlayPause}
                              >
                                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                              </Button>
                            </div>

                            <div className="flex justify-end">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-white hover:bg-white/20"
                                onClick={handleMuteToggle}
                              >
                                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="font-medium">{localize(mainVideo.video_title) || 'Video Resume'}</p>
                        {mainVideo.description && (
                          <p className="text-sm text-muted-foreground mt-1">{localize(mainVideo.description)}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Skills Preview */}
            {skills.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-cyan-600" />
                    Top Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.slice(0, 10).map((s, i) => (
                      <Badge key={i} variant="secondary" className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200">
                        {localize(s.name || s.skill?.name)}
                        {s.level && <span className="ml-1 text-xs">• {s.level}</span>}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Latest Experience */}
            {experiences.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    Latest Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {experiences.slice(0, 2).map((exp, index) => (
                    <div key={exp.id} className={index > 0 ? "mt-4 pt-4 border-t" : ""}>
                      <h3 className="font-semibold text-lg">{localize(exp.title)}</h3>
                        <p className="text-muted-foreground">{localize(exp.company_name)}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(exp.start_date)} - {exp.currently_working ? 'Present' : formatDate(exp.end_date)}
                        </span>
                      </div>
                        {exp.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{localize(exp.location)}</span>
                        </div>
                      )}
                      {exp.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{localize(exp.description)}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Latest Education */}
            {education.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-cyan-600" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {education.slice(0, 2).map((edu, index) => (
                    <div key={edu.id} className={index > 0 ? "mt-4 pt-4 border-t" : ""}>
                      <h3 className="font-semibold text-lg">{localize(edu.degree)}</h3>
                      <p className="text-muted-foreground">{localize(edu.institution)}</p>
                      {edu.field && (
                        <p className="text-sm text-cyan-600 mt-1">{localize(edu.field)}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      {edu.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{localize(edu.description)}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
      {experiences.length > 0 ? (
        experiences.map((exp) => (
                <Card key={exp.id} className="border-l-4 border-l-purple-500 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                              <h3 className="font-semibold text-xl">{localize(exp.title)}</h3>
                              <p className="text-lg text-cyan-600">{localize(exp.company_name)}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(exp.start_date)} - {exp.currently_working ? 'Present' : formatDate(exp.end_date)}
                          </span>
                        </div>
                              {exp.location && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{localize(exp.location)}</span>
                                </div>
                              )}
                      </div>
                      {exp.currently_working && (
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      )}
                    </div>
                    {exp.description && (
                      <p className="mt-4 text-muted-foreground whitespace-pre-line">{localize(exp.description)}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12 shadow-lg">
                <CardContent>
                  <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No experience listed</h3>
                  <p className="text-muted-foreground">This user hasn't added their work experience yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            {education.length > 0 ? (
              education.map((edu) => (
                <Card key={edu.id} className="border-l-4 border-l-cyan-500 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-xl">{localize(edu.degree)}</h3>
                        <p className="text-lg text-cyan-600">{localize(edu.institution)}</p>
                        {edu.field && (
                          <Badge variant="outline" className="mt-2">{localize(edu.field)}</Badge>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </span>
                        </div>
                      </div>
                      {edu.gpa && (
                        <Badge variant="secondary">GPA: {edu.gpa}</Badge>
                      )}
                    </div>
                    {edu.description && (
                      <p className="mt-4 text-muted-foreground whitespace-pre-line">{localize(edu.description)}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12 shadow-lg">
                <CardContent>
                  <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No education listed</h3>
                  <p className="text-muted-foreground">This user hasn't added their educational background yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            {skills.length > 0 ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>All Skills</CardTitle>
                  <CardDescription>{skills.length} skill{skills.length !== 1 ? 's' : ''} listed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((s, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="bg-gradient-to-r from-cyan-100 to-purple-100 text-gray-800 px-4 py-2 text-sm hover:from-cyan-200 hover:to-purple-200"
                      >
                        {localize(s.name || s.skill?.name)}
                        {s.level && <span className="ml-2 text-xs opacity-75">• {s.level}</span>}
                        {s.years_of_experience && <span className="ml-1 text-xs opacity-75">({s.years_of_experience}y)</span>}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12 shadow-lg">
                <CardContent>
                  <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No skills listed</h3>
                  <p className="text-muted-foreground">This user hasn't added their skills yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* All Videos Section */}
        {videos && videos.length > 1 && (
          <Card className="mt-8 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-cyan-600" />
                All Videos
              </CardTitle>
              <CardDescription>{videos.length} video{videos.length !== 1 ? 's' : ''} available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos.filter(v => v.video_position !== 'main').map((video, idx) => (
                  <Card key={video.id || idx} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="relative bg-black aspect-video">
                      <video 
                        src={normalizeMediaUrl(video.video_url)} 
                        className="w-full h-full object-cover"
                        poster={video.thumbnail_url ? normalizeMediaUrl(video.thumbnail_url) : undefined}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium truncate text-sm">{localize(video.video_title) || 'Untitled Video'}</p>
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{video.video_duration ? `${Math.round(video.video_duration)}s` : ''}</span>
                        <span>{video.views ? `${video.views} views` : ''}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom Connect Button */}
        {(!user?.id || !isOwnProfile) && (
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleConnect}
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 shadow-xl text-lg px-8"
            >
              <Heart className="h-5 w-5 mr-2" />
              Connect with {getDisplayName(profile).split(' ')[0]}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerProfileView;