import i18n from 'i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { 
  getUserProfile, 
  getUserVideos, 
  getUserSkills, 
  getUserExperiences, 
  getUserEducation 
} from '../services/api.js';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import localize from '@/utils/localize';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/UI/dialog.jsx';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Briefcase,
  GraduationCap,
  Calendar,
  Edit,
  Eye,
  Play,
  Pause,
  Heart,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Loader2,
  Award,
  FileText
} from 'lucide-react';
import themeColors from '@/config/theme-colors-jobseeker';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function JobSeekerProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef(null);
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [profileRes, videosRes, skillsRes, expRes, eduRes] = await Promise.all([
        getUserProfile(),
        getUserVideos(),
        getUserSkills(),
        getUserExperiences(),
        getUserEducation()
      ]);

      // Normalize backend shapes to the frontend-friendly shape used in this component.
      const rawProfile = profileRes?.data || null;

      const normalizeProfile = (p) => {
        if (!p) return null;
        
        // Derive fullName from available fields (prefer profile fields; fall back to user as last resort)
        const first = (p.first_name || p.firstName || '').toString().trim();
        const middle = (p.second_name || p.secondName || '').toString().trim();
        const last = (p.last_name || p.lastName || '').toString().trim();

        const displayName = (p.displayName || p.display_name || '').toString().trim();

        // Build full name from profile fields; if none exist, fall back to user identity fields
        const nameParts = [first, middle, last].filter(Boolean);
        const combined = nameParts.join(' ');
        // Prefer profile-level name fields (fullName, displayName, profileName, name).
        // If none are available, fall back to the user's displayName (not individual first/last)
        // and use an explicit placeholder when no profile name exists.
        const fullName = p.fullName || displayName || combined || p.profileName || p.name || p.user?.displayName || 'Profile name not set';

        // Headline/title
        // Resolve professional/title from multiple possible backend fields
        const headline = (
          p.headline ||
          p.title ||
          p.preferred_job_title ||
          p.preferredJobTitle ||
          p.user?.title ||
          p.user?.headline ||
          null
        );

        // Picture may be stored under several keys
        const profilePicture = p.profilePicture || p.profile_pic || p.user?.photoUrl || p.photoUrl || null;

        // Social/contact
        const linkedin = p.linkedin || p.linkedin_url || p.social?.linkedin || null;
        const github = p.github || p.social?.github || null;
        const twitter = p.twitter || p.social?.twitter || null;

        // Location/email/phone
        const location = p.location || p.address || (p.city && p.city.name) || null;
        const email = p.email || p.user?.email || null;
        const phone = p.phone || p.mobile || p.user?.phone || null;

        return {
          ...p,
          fullName,
          headline,
          profilePicture,
          linkedin,
          github,
          twitter,
          location,
          email,
          phone
        };
      };

      setProfile(normalizeProfile(rawProfile));

      // Videos endpoint returns { success, page, limit, total, videos }
      setVideos(videosRes?.data?.videos || []);

      // Skills endpoint returns { message, skills }
      setSkills(skillsRes?.data?.skills || []);

      // Normalize experiences: backend uses company_name, start_date, end_date, currently_working
      const rawExperiences = expRes?.data?.experiences || [];
      const mappedExperiences = (rawExperiences || []).map((e) => ({
        ...e,
        company: e.company || e.company_name || '',
        startDate: e.startDate || e.start_date || e.start_date_time || e.start_date,
        endDate: e.endDate || e.end_date || e.end_date,
        current: e.current || e.currently_working || false,
        description: e.description || e.desc || ''
      }));
      setExperiences(mappedExperiences);

      // Education endpoint uses { educations }
      setEducation(eduRes?.data?.educations || eduRes?.data?.education || []);
    } catch (error) {
      // Prefer backend-provided detailed message when available for better feedback
      console.error('Error fetching profile data:', error?.response?.data || error);
      const errMsg = error?.response?.data?.details || error?.response?.data?.message || error?.message || "Failed to load profile data";
      toast({
        title: "Error",
        description: errMsg,
        variant: "destructive",
      });
      // For debugging: if server returned details, also log the full response body
      if (error?.response?.data) console.debug('Backend error payload:', error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleEditProfile = (openTab = '', action = '') => {
    // Navigate to the profile tab inside the jobseeker-tabs layout
    // `jobseekerTabsConfig` uses the group key `profileContent` and the tab path `my-profile`.
    // Add mode=edit so the tab renders the edit form.
    // Optionally pass openTab and action so EditJobSeekerProfile can select a specific inner tab
    // and open the add dialog (e.g. openTab=skills&action=add).
    let url = '/jobseeker-tabs?group=profileContent&tab=my-profile&mode=edit';
    if (openTab) url += `&openTab=${encodeURIComponent(openTab)}`;
    if (action) url += `&action=${encodeURIComponent(action)}`;
    navigate(url);
  };

  const handleGoToVideos = () => {
    // Navigate to the jobseeker-tabs page and open the My Videos tab
    navigate('/jobseeker-tabs?group=profileContent&tab=my-videos');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <Card className="border-l-4 border-l-cyan-500">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Info Section */}
              <div className="flex-grow">
                <div className="flex items-start gap-6 mb-6">
                  {/* Avatar */}
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={profile?.profilePicture ? `${VITE_API_BASE_URL}${profile.profilePicture}` : ''} 
                      alt={profile?.fullName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-3xl">
                      {String(localize(profile?.fullName || profile?.displayName || profile?.profileName || 'Profile name not set')).charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name & Title */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h1 className="text-4xl font-bold mb-2">{String(localize(profile?.fullName || profile?.displayName || profile?.profileName || 'Profile name not set'))}</h1>
                        <p className="text-xl text-muted-foreground">{String(localize(profile?.headline || 'Professional Title'))}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex gap-2">
                          <Button
                            onClick={async () => {
                              // Compute which required fields are missing so we can show them in the dialog
                              const missing = [];

                              // Full-name presence: prefer profile fullName/displayName/first/last; if missing, list missing name components
                              const hasFullName = !!(profile?.fullName || profile?.displayName || profile?.display_name || profile?.first_name || profile?.firstName || profile?.last_name || profile?.lastName);
                              if (!hasFullName) {
                                if (!(profile?.first_name || profile?.firstName)) missing.push('First name');
                                if (!(profile?.second_name || profile?.secondName)) missing.push('Middle name');
                                if (!(profile?.last_name || profile?.lastName)) missing.push('Last name');
                              }

                              // Headline/title
                              if (!(profile?.headline || profile?.title || profile?.preferred_job_title || profile?.preferredJobTitle || profile?.user?.title || profile?.user?.headline)) {
                                missing.push('Headline / Title');
                              }

                              // Email
                              if (!(profile?.email || profile?.user?.email)) {
                                missing.push('Email');
                              }

                              // Profile picture
                              if (!(profile?.profilePicture || profile?.profile_pic || profile?.user?.photoUrl || profile?.photoUrl)) {
                                missing.push('Profile picture');
                              }

                              if (missing.length > 0) {
                                setMissingFields(missing);
                                setPreviewDialogOpen(true);
                                return;
                              }

                              const id = profile?.user?.id || profile?.userId || profile?.user_id || profile?.id || user?.id;
                              if (!id) return;
                              try {
                                await import('@/services/api').then(m => m.recordProfileView(id, 'jobseeker'));
                                // Refresh profile view count after recording view so UI updates for the viewer
                                const publicRes = await import('@/services/api').then(m => m.getPublicProfile(id, 'jobseeker'));
                                const returnedProfile = publicRes?.data?.profile || publicRes?.data;
                                if (returnedProfile && typeof returnedProfile.profileViews !== 'undefined') {
                                  setProfile(prev => ({ ...(prev || {}), profileViews: returnedProfile.profileViews }));
                                }
                              } catch (e) {}
                              navigate(`/jobseeker-profile/${id}`);
                            }}
                            variant="outline"
                            className="hidden md:inline-flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />{i18n.t('auto_preview')}</Button>

                          <Button onClick={handleEditProfile} className="bg-cyan-600 hover:bg-cyan-700">
                          <Edit className="h-4 w-4 mr-2" />{i18n.t('auto_edit_profile')}</Button>
                        </div>
                        {/* Connect button intentionally omitted on the logged-in user's own JobSeeker profile */}
                      </div>
                    </div>

                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profile?.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{String(localize(profile.location))}</span>
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
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600">{i18n.t('auto_website')}</a>
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    {(profile?.linkedin || profile?.github || profile?.twitter) && (
                      <div className="flex gap-2 mt-4">
                        {profile?.linkedin && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {profile?.github && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={profile.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {profile?.twitter && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
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
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{i18n.t('auto_about_me')}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{profile.bio}</p>
                  </div>
                )}
              </div>

              {/* Video Resume Section */}
              {currentVideo && (
                <div className="lg:w-[350px] flex-shrink-0">
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white p-4">
                      <CardTitle className="text-lg">{i18n.t('auto_video_resume')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative bg-black aspect-[9/16] max-h-[450px]">
                        <video
                          ref={videoRef}
                          src={currentVideo.videoUrl?.startsWith('blob:') || currentVideo.videoUrl?.startsWith('http') ? currentVideo.videoUrl : `${VITE_API_BASE_URL}${currentVideo.videoUrl}`}
                          className="w-full h-full object-cover"
                          loop
                          onClick={handlePlayPause}
                        />
                        
                        {/* Video Controls Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                            {/* Play/Pause Button */}
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

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                                  <Heart className="h-5 w-5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                                  <Bookmark className="h-5 w-5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                                  <Share2 className="h-5 w-5" />
                                </Button>
                              </div>
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

                      {/* Video Title */}
                      <div className="p-4">
                        <p className="font-medium">{currentVideo.title}</p>
                        {currentVideo.description && (
                          <p className="text-sm text-muted-foreground mt-1">{currentVideo.description}</p>
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

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{i18n.t('auto_overview')}</TabsTrigger>
          <TabsTrigger value="experience">{i18n.t('auto_experience')}</TabsTrigger>
          <TabsTrigger value="education">{i18n.t('auto_education')}</TabsTrigger>
          <TabsTrigger value="skills">{i18n.t('auto_skills_1')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Skills Preview */}
          {skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-cyan-600" />{i18n.t('auto_top_skills')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 10).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-cyan-100 text-cyan-800">
                      {String(localize(skill.name))}
                      {skill.level && <span className="ml-1 text-xs">• {skill.level}</span>}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Latest Experience */}
          {experiences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />{i18n.t('auto_latest_experience')}</CardTitle>
              </CardHeader>
              <CardContent>
                {experiences.slice(0, 2).map((exp, index) => (
                  <div key={index} className={index > 0 ? "mt-4 pt-4 border-t" : ""}>
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="mt-2 text-sm">{exp.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Latest Education */}
          {education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-cyan-600" />{i18n.t('auto_education')}</CardTitle>
              </CardHeader>
              <CardContent>
                {education.slice(0, 2).map((edu, index) => (
                  <div key={index} className={index > 0 ? "mt-4 pt-4 border-t" : ""}>
                    <h3 className="font-semibold text-lg">{edu.degree}</h3>
                    <p className="text-muted-foreground">{edu.institution}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {edu.startYear} - {edu.endYear || 'Present'}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="mt-2 text-sm">{edu.description}</p>
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
            experiences.map((exp, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-xl">{exp.title}</h3>
                      <p className="text-lg text-muted-foreground">{exp.company}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                    {exp.current && (
                      <Badge className="bg-green-100 text-green-800">{i18n.t('auto_current')}</Badge>
                    )}
                  </div>
                  {exp.description && (
                    <p className="mt-4 text-muted-foreground whitespace-pre-line">{exp.description}</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{i18n.t('auto_no_experience_added_yet')}</h3>
                <p className="text-muted-foreground mb-4">
                  Add your work experience to showcase your professional journey
                </p>
                <Button 
                  onClick={() => handleEditProfile('experience', 'add')}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                >{i18n.t('auto_add_experience')}</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          {education.length > 0 ? (
            education.map((edu, index) => (
              <Card key={index} className="border-l-4 border-l-cyan-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-xl">{edu.degree}</h3>
                      <p className="text-lg text-muted-foreground">{edu.institution}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {edu.startYear} - {edu.endYear || 'Present'}
                        </span>
                      </div>
                      {edu.fieldOfStudy && (
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <Badge variant="outline">{String(localize(edu.fieldOfStudy))}</Badge>
                        </div>
                      )}
                    </div>
                    {edu.gpa && (
                      <Badge variant="secondary">GPA: {edu.gpa}</Badge>
                    )}
                  </div>
                  {edu.description && (
                    <p className="mt-4 text-muted-foreground whitespace-pre-line">{edu.description}</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{i18n.t('auto_no_education_added_yet')}</h3>
                <p className="text-muted-foreground mb-4">{i18n.t('auto_add_your_educational_background_to_compl')}</p>
                <Button 
                  onClick={() => handleEditProfile('education', 'add')}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                >{i18n.t('auto_add_education')}</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          {skills.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>{i18n.t('auto_all_skills')}</CardTitle>
                <CardDescription>
                  {skills.length} skill{skills.length !== 1 ? 's' : ''} listed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-gradient-to-r from-cyan-100 to-purple-100 text-gray-800 px-4 py-2 text-sm"
                    >
                      {String(localize(skill.name))}
                      {skill.level && (
                        <span className="ml-2 text-xs opacity-75">• {skill.level}</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{i18n.t('auto_no_skills_added_yet')}</h3>
                <p className="text-muted-foreground mb-4">{i18n.t('auto_add_your_skills_to_help_employers_find_y')}</p>
                <Button 
                  onClick={() => handleEditProfile('skills', 'add')}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                >{i18n.t('auto_add_skills')}</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      {/* Bottom action - go to user's videos page */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleGoToVideos}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
        >
          <Play className="h-4 w-4 mr-2" />{i18n.t('auto_my_videos')}</Button>
      </div>
      {/* Create profile preview warning dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{missingFields.length > 0 ? 'Profile incomplete — missing fields' : 'Profile incomplete'}</DialogTitle>
            <DialogDescription>
              {missingFields.length > 0 ? (
                <>
                  To preview your public profile, please complete the following required fields:
                  <ul className="list-disc list-inside mt-2">
                    {missingFields.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </>
              ) : (
                'You need to create and complete your profile before previewing it or sharing it with employers.'
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => { setPreviewDialogOpen(false); handleEditProfile(); }} className="bg-cyan-600 hover:bg-cyan-700">{i18n.t('auto_complete_profile_1')}</Button>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>{i18n.t('auto_cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
