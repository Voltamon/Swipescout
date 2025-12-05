import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployerProfile, getEmployerJobs, getMyProfileViewStats } from '@/services/api';
import { getEmployerDashboardStats } from '@/services/dashboardService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import localize from '@/utils/localize';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Facebook,
  Twitter,
  Users,
  Briefcase,
  Calendar,
  Edit,
  Eye,
  PlayCircle,
  Share2,
  Loader2,
  ExternalLink
} from 'lucide-react';
import themeColors from '@/config/theme-colors';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function EmployerProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
    fetchJobs();
  }, []);

  // Listen for profile view events and refresh profile view count when a view gets recorded
  useEffect(() => {
    const onProfileView = async (e) => {
      try {
        // Fetch the dashboard stats so we show the same total as the Employer Dashboard
        try {
          const dashRes = await getEmployerDashboardStats();
          const dashStats = dashRes?.data?.stats || dashRes?.data;
          const dashProfileViews = dashStats?.profileViews ?? dashStats?.profile_views ?? dashStats?.profileViewsTotal ?? 0;
          setProfile(prev => ({ ...(prev || {}), profileViews: dashProfileViews }));
        } catch (err) {
          // If dashboard call fails, fallback to last-30-day stats
          const statsRes = await getMyProfileViewStats({ profileType: 'employer' });
          const daily = statsRes?.data?.stats?.daily_stats || statsRes?.data?.stats?.dailyStats || [];
          const last30Count = daily.reduce((sum, d) => sum + (d.views || 0), 0);
          const totalViews = statsRes?.data?.stats?.total_views ?? statsRes?.data?.stats?.totalViews ?? 0;
          if (typeof last30Count === 'number') {
            setProfile(prev => ({ ...(prev || {}), profileViewsLast30: last30Count, profileViewsTotal: totalViews }));
          }
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('profileViewRecorded', onProfileView);
    return () => window.removeEventListener('profileViewRecorded', onProfileView);
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getEmployerProfile();
      setProfile(response.data);
      // Also fetch the dashboard stats (total profile views) to match Employer Dashboard
      try {
        const dashRes = await getEmployerDashboardStats();
        const dashStats = dashRes?.data?.stats || dashRes?.data;
        const dashProfileViews = dashStats?.profileViews ?? dashStats?.profile_views ?? dashStats?.profileViewsTotal ?? 0;
        setProfile(prev => ({ ...(prev || {}), profileViews: dashProfileViews }));
      } catch (err) {
        // Fallback: load last-30-day stats as before
        try {
          const statsRes = await getMyProfileViewStats({ profileType: 'employer' });
          const daily = statsRes?.data?.stats?.daily_stats || statsRes?.data?.stats?.dailyStats || [];
          const last30Count = daily.reduce((sum, d) => sum + (d.views || 0), 0);
          const totalViews = statsRes?.data?.stats?.total_views ?? statsRes?.data?.stats?.totalViews ?? 0;
          if (typeof last30Count === 'number') {
            setProfile(prev => ({ ...(prev || {}), profileViewsLast30: last30Count, profileViewsTotal: totalViews }));
          }
        } catch (err2) {
          // ignore
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await getEmployerJobs();
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleEditProfile = () => {
    navigate('/employer-tabs?group=companyContent&tab=edit-employer-profile');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className={`h-12 w-12 animate-spin ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Company Logo/Avatar */}
              <Avatar className="h-32 w-32">
                <AvatarImage 
                  src={profile?.logo ? `${VITE_API_BASE_URL}${profile.logo}` : ''} 
                  alt={profile?.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-4xl">
                  {profile?.name?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>

              {/* Company Info */}
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{profile?.name || 'Company Name'}</h1>
                    <p className="text-lg text-muted-foreground">{profile?.industry || 'Industry'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        const id = profile?.user?.id || profile?.userId || profile?.user_id || profile?.id || user?.id;
                        if (!id) return;
                        try {
                          // Call lightweight endpoint to record a public profile view without fetching the entire profile
                              await import('@/services/api').then(m => m.recordProfileView(id, 'employer'));
                              // Refresh viewer UI so they see updated profile view count (try dashboard's total views to match Employer Dashboard)
                              try {
                                const dashRes = await import('@/services/dashboardService').then(m => m.getEmployerDashboardStats());
                                const dashStats = dashRes?.data?.stats || dashRes?.data;
                                const dashProfileViews = dashStats?.profileViews ?? dashStats?.profile_views ?? dashStats?.profileViewsTotal ?? 0;
                                setProfile(prev => ({ ...(prev || {}), profileViews: dashProfileViews }));
                                try { window.dispatchEvent(new Event('profileViewRecorded')); } catch (e) {/* ignore */}
                              } catch (err) {
                                // fallback: try last-30-day stats
                                try {
                                  const statsRes = await import('@/services/api').then(m => m.getMyProfileViewStats({ profileType: 'employer' }));
                                  const daily = statsRes?.data?.stats?.daily_stats || statsRes?.data?.stats?.dailyStats || [];
                                  const last30Count = daily.reduce((sum, d) => sum + (d.views || 0), 0);
                                  const totalViews = statsRes?.data?.stats?.total_views ?? statsRes?.data?.stats?.totalViews ?? 0;
                                  setProfile(prev => ({ ...(prev || {}), profileViewsLast30: last30Count, profileViewsTotal: totalViews }));
                                  try { window.dispatchEvent(new Event('profileViewRecorded')); } catch (e) {/* ignore */}
                                } catch (err2) {
                                  // fallback to public profile value
                                  const publicRes = await import('@/services/api').then(m => m.getPublicProfile(id, 'employer'));
                                  const returnedProfile = publicRes?.data?.profile || publicRes?.data;
                                  if (returnedProfile && typeof returnedProfile.profileViews !== 'undefined') {
                                    setProfile(prev => ({ ...(prev || {}), profileViews: returnedProfile.profileViews ?? prev.profileViews }));
                                    try { window.dispatchEvent(new Event('profileViewRecorded')); } catch (e) {/* ignore */}
                                  }
                                }
                              }
                        } catch (err) {
                          // ignore
                        }
                        navigate(`/employer-profile/${id}`);
                      }}
                      variant="outline"
                      className="hidden md:inline-flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>

                    <Button onClick={handleEditProfile} className={`${themeColors.buttons.primary} text-white  hover:bg-purple-700`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {profile?.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  {profile?.size && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.size} employees</span>
                    </div>
                  )}

                  {profile?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${profile.email}`} className="hover:text-cyan-600">
                        {profile.email}
                      </a>
                    </div>
                  )}

                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}

                  {profile?.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-cyan-600 flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {profile?.establish_year && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Founded in {profile.establish_year}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(profile?.social?.linkedin || profile?.social?.facebook || profile?.social?.twitter) && (
                  <div className="flex gap-2">
                    {profile?.social?.linkedin && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {profile?.social?.facebook && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-4 w-4" />
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
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
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

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {jobs.reduce((sum, j) => sum + (j.applicants_count || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Candidates applied</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{(profile?.profileViews ?? profile?.profileViewsTotal ?? profile?.profileViewsLast30) || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total profile views
                  {typeof profile?.profileViewsLast30 !== 'undefined' && (
                    <span className="ml-2 text-xs text-muted-foreground">In the last 30 days: {profile.profileViewsLast30}</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {profile?.description && (
            <Card>
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{profile.description}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About {profile?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile?.description && (
                <div>
                  <h3 className="font-semibold mb-2">Company Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{profile.description}</p>
                </div>
              )}

              {profile?.mission && (
                <div>
                  <h3 className="font-semibold mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">{profile.mission}</p>
                </div>
              )}

              {profile?.values && (
                <div>
                  <h3 className="font-semibold mb-2">Company Values</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.values.split(',').map((value, index) => (
                      <Badge key={index} variant="secondary">
                        {value.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile?.benefits && (
                <div>
                  <h3 className="font-semibold mb-2">Benefits & Perks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {profile.benefits.split(',').map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`${themeColors.buttons.primary} text-white h-2 w-2 rounded-full `} />
                        <span className="text-sm">{benefit.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-6">
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                        <Badge variant="outline">{localize(job.jobType)}</Badge>
                      </div>

                      {job.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {job.description}
                        </p>
                      )}

                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/job/${job.id}`)}
                      >
                        View Details
                      </Button>
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
                <p className="text-muted-foreground mb-4">
                  Start attracting candidates by posting your first job
                </p>
                <Button 
                  onClick={() => navigate('/employer-tabs?group=jobManagement&tab=post-job')}
                  className={`${themeColors.buttons.primary} text-white  hover:from-purple-700 hover:to-cyan-700`}
                >
                  Post a Job
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6">
          <Card className="text-center py-12">
            <CardContent>
              <PlayCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Company Videos</h3>
              <p className="text-muted-foreground mb-4">
                Showcase your company culture and values through videos
              </p>
              <Button 
                onClick={() => navigate('/employer-tabs?group=companyContent&tab=company-videos')}
                className={`${themeColors.buttons.primary} text-white  hover:from-purple-700 hover:to-cyan-700`}
              >
                Manage Videos
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
