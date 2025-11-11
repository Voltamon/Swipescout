import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

      setProfile(profileRes.data);
      setVideos(videosRes.data.videos || []);
      setSkills(skillsRes.data.skills || []);
      setExperiences(expRes.data.experiences || []);
      setEducation(eduRes.data.education || []);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
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
                      {(String(localize(profile?.fullName)) || 'U').charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name & Title */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h1 className="text-4xl font-bold mb-2">{String(localize(profile?.fullName || 'User Name'))}</h1>
                        <p className="text-xl text-muted-foreground">{String(localize(profile?.headline || 'Professional Title'))}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleEditProfile} className="bg-cyan-600 hover:bg-cyan-700">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
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
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600">
                            Website
                          </a>
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
                    <h3 className="font-semibold text-lg mb-2">About Me</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{profile.bio}</p>
                  </div>
                )}
              </div>

              {/* Video Resume Section */}
              {currentVideo && (
                <div className="lg:w-[350px] flex-shrink-0">
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white p-4">
                      <CardTitle className="text-lg">Video Resume</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative bg-black aspect-[9/16] max-h-[450px]">
                        <video
                          ref={videoRef}
                          src={`${VITE_API_BASE_URL}${currentVideo.videoUrl}`}
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
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Skills Preview */}
          {skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-cyan-600" />
                  Top Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 10).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-cyan-100 text-cyan-800">
                      {String(localize(skill.name))}
                      {skill.level && <span className="ml-1 text-xs">â€¢ {skill.level}</span>}
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
                  <Briefcase className="h-5 w-5 ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
                  Latest Experience
                </CardTitle>
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
                  <GraduationCap className="h-5 w-5 text-cyan-600" />
                  Education
                </CardTitle>
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
                <h3 className="text-xl font-semibold mb-2">No experience added yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your work experience to showcase your professional journey
                </p>
                <Button 
                  onClick={() => handleEditProfile('experience', 'add')}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                >
                  Add Experience
                </Button>
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
                <h3 className="text-xl font-semibold mb-2">No education added yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your educational background to complete your profile
                </p>
                <Button 
                  onClick={() => handleEditProfile('education', 'add')}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                >
                  Add Education
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          {skills.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>All Skills</CardTitle>
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
                        <span className="ml-2 text-xs opacity-75">â€¢ {skill.level}</span>
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
                <h3 className="text-xl font-semibold mb-2">No skills added yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your skills to help employers find you
                </p>
                <Button 
                  onClick={() => handleEditProfile('skills', 'add')}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                >
                  Add Skills
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
