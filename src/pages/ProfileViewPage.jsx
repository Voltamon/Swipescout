import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/UI/card.jsx';
import ReportButton from '@/components/ReportButton.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import localize from '@/utils/localize';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Facebook,
  Briefcase,
  GraduationCap,
  Calendar,
  Play,
  Pause,
  Heart,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Loader2,
  Award,
  Building2,
  Eye,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ProfileViewPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}`, { headers });
      setProfile(response.data.profile);
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

  const handleVideoChange = (index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <User className="h-24 w-24 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-gray-600 mb-4">The user profile you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const currentVideo = profile.videos?.[currentVideoIndex];
  const mainVideo = profile.videos?.find(v => v.isMainVideo) || profile.videos?.[0];
  const isJobSeeker = profile.profileType === 'jobseeker';
  const isEmployer = profile.profileType === 'employer';

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

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
                      src={profile.profilePicture ? `${API_BASE_URL}${profile.profilePicture}` : ''} 
                      alt={profile.fullName || profile.displayName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-3xl">
                      {(profile.fullName || profile.displayName || 'U').charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name & Title */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-4xl font-bold">{profile.fullName || profile.displayName || 'User'}</h1>
                          {isEmployer && <Building2 className="h-6 w-6 text-green-600" />}
                          {isJobSeeker && <User className="h-6 w-6 text-blue-600" />}
                        </div>
                        <p className="text-xl text-muted-foreground">{profile.headline || profile.title || 'Professional'}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>{profile.profileViews || 0} profile views</span>
                        </div>
                      </div>
                      <Badge className={isEmployer ? "bg-green-600" : "bg-blue-600"}>
                        {isEmployer ? 'Employer' : 'Job Seeker'}
                      </Badge>
                    </div>

                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profile.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.location}</span>
                        </div>
                      )}

                      {profile.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${profile.email}`} className="hover:text-cyan-600">
                            {profile.email}
                          </a>
                        </div>
                      )}

                      {profile.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.phone}</span>
                        </div>
                      )}

                      {profile.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600">
                            Website
                          </a>
                        </div>
                      )}

                      {isEmployer && profile.industry && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.industry}</span>
                        </div>
                      )}

                      {isEmployer && profile.companySize && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.companySize} employees</span>
                        </div>
                      )}

                      {isJobSeeker && profile.yearsOfExperience && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.yearsOfExperience} years experience</span>
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    {(profile.linkedin || profile.github || profile.twitter || profile.facebook) && (
                      <div className="flex gap-2 mt-4">
                        {profile.linkedin && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {profile.github && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={profile.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {profile.twitter && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {profile.facebook && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={profile.facebook} target="_blank" rel="noopener noreferrer">
                              <Facebook className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* About/Bio */}
                {profile.bio && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {isEmployer ? 'About Company' : 'About Me'}
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-line">{profile.bio}</p>
                  </div>
                )}
              </div>

              {/* Main Video Section */}
              {mainVideo && (
                <div className="lg:w-[350px] flex-shrink-0">
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white p-4">
                      <CardTitle className="text-lg">
                        {isEmployer ? 'Company Video' : 'Video Resume'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative bg-black aspect-[9/16] max-h-[450px]">
                        <video
                          ref={videoRef}
                          src={`${API_BASE_URL}${mainVideo.videoUrl}`}
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
                                <ReportButton contentType="user" contentId={profile.id} className="text-white hover:bg-white/20" />
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
                        <p className="font-medium">{mainVideo.title}</p>
                        {mainVideo.description && (
                          <p className="text-sm text-muted-foreground mt-1">{mainVideo.description}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{mainVideo.viewsCount || 0} views</span>
                          <span>{mainVideo.likesCount || 0} likes</span>
                        </div>
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
        <TabsList className={isJobSeeker ? "grid w-full grid-cols-4" : "grid w-full grid-cols-3"}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isJobSeeker && <TabsTrigger value="experience">Experience</TabsTrigger>}
          {isJobSeeker && <TabsTrigger value="education">Education</TabsTrigger>}
          {isJobSeeker && <TabsTrigger value="skills">Skills</TabsTrigger>}
          <TabsTrigger value="videos">All Videos</TabsTrigger>
          {isEmployer && <TabsTrigger value="company">Company Info</TabsTrigger>}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Job Seeker Overview */}
          {isJobSeeker && (
            <>
              {/* Skills Preview */}
              {profile.skills && profile.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-cyan-600" />
                      Top Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.slice(0, 10).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-cyan-100 text-cyan-800">
                          {localize(skill.name)}
                          {skill.level && <span className="ml-1 text-xs">• {skill.level}</span>}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Latest Experience */}
              {profile.experiences && profile.experiences.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                      Latest Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.experiences.slice(0, 2).map((exp, index) => (
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
              {profile.education && profile.education.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-cyan-600" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.education.slice(0, 2).map((edu, index) => (
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
            </>
          )}

          {/* Employer Overview */}
          {isEmployer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.industry && (
                  <div>
                    <span className="font-semibold">Industry:</span> {profile.industry}
                  </div>
                )}
                {profile.companySize && (
                  <div>
                    <span className="font-semibold">Company Size:</span> {profile.companySize}
                  </div>
                )}
                {profile.foundedYear && (
                  <div>
                    <span className="font-semibold">Founded:</span> {profile.foundedYear}
                  </div>
                )}
                {profile.categories && profile.categories.length > 0 && (
                  <div>
                    <span className="font-semibold">Categories:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.categories.map((cat, index) => (
                        <Badge key={index} variant="secondary">{localize(cat.name)}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Experience Tab (Job Seekers Only) */}
        {isJobSeeker && (
          <TabsContent value="experience" className="space-y-6">
            {profile.experiences && profile.experiences.length > 0 ? (
              profile.experiences.map((exp, index) => (
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
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
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
                  <h3 className="text-xl font-semibold mb-2">No experience listed</h3>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {/* Education Tab (Job Seekers Only) */}
        {isJobSeeker && (
          <TabsContent value="education" className="space-y-6">
            {profile.education && profile.education.length > 0 ? (
              profile.education.map((edu, index) => (
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
                            <Badge variant="outline">{localize(edu.fieldOfStudy)}</Badge>
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
                  <h3 className="text-xl font-semibold mb-2">No education listed</h3>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {/* Skills Tab (Job Seekers Only) */}
        {isJobSeeker && (
          <TabsContent value="skills" className="space-y-6">
            {profile.skills && profile.skills.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>All Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-gradient-to-r from-cyan-100 to-purple-100 text-gray-800 px-4 py-2 text-sm"
                      >
                        {skill.name}
                        {skill.level && (
                          <span className="ml-2 text-xs opacity-75">• {skill.level}</span>
                        )}
                        {skill.yearsExperience && (
                          <span className="ml-1 text-xs opacity-75">({skill.yearsExperience}y)</span>
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
                  <h3 className="text-xl font-semibold mb-2">No skills listed</h3>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6">
          {profile.videos && profile.videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.videos.map((video, index) => (
                <Card key={video.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleVideoChange(index)}>
                  <div className="relative bg-black aspect-video">
                    <video
                      src={`${API_BASE_URL}${video.videoUrl}`}
                      className="w-full h-full object-cover"
                      poster={video.thumbnailUrl ? `${API_BASE_URL}${video.thumbnailUrl}` : undefined}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    {video.isMainVideo && (
                      <Badge className="absolute top-2 right-2 bg-cyan-600">Main</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground truncate mt-1">{video.description}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{video.viewsCount || 0} views</span>
                      <span>{video.likesCount || 0} likes</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No videos</h3>
                <p className="text-muted-foreground">This user hasn't uploaded any videos yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Company Info Tab (Employers Only) */}
        {isEmployer && (
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.companyName && (
                  <div>
                    <span className="font-semibold">Company Name:</span>
                    <p className="text-muted-foreground mt-1">{profile.companyName}</p>
                  </div>
                )}
                {profile.industry && (
                  <div>
                    <span className="font-semibold">Industry:</span>
                    <p className="text-muted-foreground mt-1">{profile.industry}</p>
                  </div>
                )}
                {profile.companySize && (
                  <div>
                    <span className="font-semibold">Company Size:</span>
                    <p className="text-muted-foreground mt-1">{profile.companySize} employees</p>
                  </div>
                )}
                {profile.foundedYear && (
                  <div>
                    <span className="font-semibold">Founded:</span>
                    <p className="text-muted-foreground mt-1">{profile.foundedYear}</p>
                  </div>
                )}
                {profile.bio && (
                  <div>
                    <span className="font-semibold">About:</span>
                    <p className="text-muted-foreground mt-1 whitespace-pre-line">{profile.bio}</p>
                  </div>
                )}
                {profile.categories && profile.categories.length > 0 && (
                  <div>
                    <span className="font-semibold">Categories:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.categories.map((cat, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                          {localize(cat.name)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
