import React, { useState, useEffect } from 'react';
import {
  extractCVData,
  generateResume,
  previewResume,
  saveResume,
  getUserResumes
} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Textarea } from '@/components/UI/textarea.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/UI/accordion.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/UI/dialog.jsx';
import { Progress } from '@/components/UI/progress.jsx';
import {
  Upload,
  Download,
  Eye,
  Plus,
  Trash2,
  Edit,
  Save,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Trophy,
  Loader2,
  File,
  ChevronDown
} from 'lucide-react';
import themeColors from '@/config/theme-colors-jobseeker';

export default function ResumeBuilderPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('build');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Resume data
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: []
  });

  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchSavedResumes();
  }, []);

  const fetchSavedResumes = async () => {
    try {
      const response = await getUserResumes();
      setSavedResumes(response.data.resumes || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setExtracting(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await extractCVData(formData);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (response.data) {
        const incoming = response.data;
        const normalizedSkills = (incoming.skills || []).map(s => (typeof s === 'string' ? s : (s?.name || ''))).filter(Boolean);
        const experiencesFromExtract = Array.isArray(incoming.experience) ? incoming.experience : [];

        setResumeData(prevData => ({
          ...prevData,
          personalInfo: {
            ...prevData.personalInfo,
            ...incoming.personalInfo,
            // keep UI top-level summary in sync
            // but prefer extracted personalInfo.summary if provided
          },
          summary: incoming?.personalInfo?.summary || prevData.summary || '',
          experiences: experiencesFromExtract.length ? experiencesFromExtract.map(exp => ({
            title: exp.title || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: !!exp.current,
            description: exp.description || ''
          })) : (prevData.experiences || []),
          education: Array.isArray(incoming.education) ? incoming.education : (prevData.education || []),
          skills: normalizedSkills.length ? normalizedSkills : (prevData.skills || []),
          languages: Array.isArray(incoming.languages) ? incoming.languages : (prevData.languages || []),
          certifications: Array.isArray(incoming.certifications) ? incoming.certifications : (prevData.certifications || []),
          projects: Array.isArray(incoming.projects) ? incoming.projects : (prevData.projects || []),
        }));
        
        toast({
          title: "Success",
          description: "CV data extracted successfully!",
        });
      }
    } catch (error) {
      console.error('Error extracting CV:', error);
      toast({
        title: "Error",
        description: "Failed to extract CV data",
        variant: "destructive",
      });
    } finally {
      setExtracting(false);
      setProgress(0);
    }
  };

  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ]
    }));
  };

  const handleRemoveExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleAddEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: '',
          institution: '',
          location: '',
          startYear: '',
          endYear: '',
          gpa: '',
          description: ''
        }
      ]
    }));
  };

  const handleRemoveEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleAddSkill = (skill) => {
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleRemoveSkill = (skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleGenerateResume = async () => {
    setGenerating(true);
    try {
      // Map UI data to backend schema
      const mapped = mapToBackendSchema(resumeData);
      const payload = { data: mapped, template: 'modern', format: 'pdf' };

      const response = await generateResume(payload);

      // response is a Blob (application/pdf)
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      toast({
        title: "Success",
        description: "Resume generated successfully!",
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Error",
        description: "Failed to generate resume",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handlePreviewResume = async () => {
    try {
      const mapped = mapToBackendSchema(resumeData);
      const payload = { data: mapped, template: 'modern' };
      const response = await previewResume(payload);

      // Expect { success, data: { html } }
      const html = response?.data?.data?.html;
      if (html) {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        throw new Error('No preview HTML returned');
      }
    } catch (error) {
      console.error('Error previewing resume:', error);
      toast({
        title: "Error",
        description: "Failed to preview resume",
        variant: "destructive",
      });
    }
  };

  const handleSaveResume = async () => {
    setLoading(true);
    try {
      const mapped = mapToBackendSchema(resumeData);
      const payload = { data: mapped, template: 'modern' };
      await saveResume(payload);
      
      toast({
        title: "Success",
        description: "Resume saved successfully!",
      });
      
      fetchSavedResumes();
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Map the client-side resume model to the backend template schema
  const mapToBackendSchema = (data) => {
    const personalInfo = {
      ...data.personalInfo,
      // Backend templates expect summary under personalInfo
      summary: data.summary || data.personalInfo?.summary || '',
      // Classic template uses address; map location to address if provided
      address: data.personalInfo?.location || data.personalInfo?.address || ''
    };

    // Experience: backend expects `experience` array
    const experience = (data.experiences || []).map(exp => ({
      title: exp.title || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.current ? '' : (exp.endDate || ''),
      current: !!exp.current,
      description: exp.description || ''
    }));

    // Education: backend template references `graduationDate`
    const education = (data.education || []).map(edu => ({
      degree: edu.degree || '',
      institution: edu.institution || '',
      location: edu.location || '',
      graduationDate: edu.endYear || edu.startYear || '',
      gpa: edu.gpa || '',
      description: edu.description || ''
    }));

    // Skills: template expects objects with { name, level }
    const skills = (data.skills || []).map(s => (
      typeof s === 'string' ? { name: s, level: 'Intermediate' } : (s.name ? s : { name: String(s), level: 'Intermediate' })
    ));

    return {
      personalInfo,
      experience,
      education,
      skills,
      languages: data.languages || [],
      certifications: data.certifications || [],
      projects: data.projects || []
    };
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Resume Builder
        </h1>
        <p className="text-muted-foreground">
          Create a professional resume with our AI-powered builder
        </p>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="build">Build Resume</TabsTrigger>
          <TabsTrigger value="upload">Upload CV</TabsTrigger>
          <TabsTrigger value="saved">Saved Resumes ({savedResumes.length})</TabsTrigger>
        </TabsList>

        {/* Build Resume Tab */}
        <TabsContent value="build" className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handlePreviewResume}
              variant="outline"
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button 
              onClick={handleSaveResume}
              variant="outline"
              className="gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
            <Button 
              onClick={handleGenerateResume}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 gap-2 ml-auto"
              disabled={generating}
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Generate PDF
            </Button>
          </div>

          {/* Personal Information */}
          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                    }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: e.target.value }
                    }))}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                    }))}
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website/Portfolio</Label>
                  <Input
                    id="website"
                    value={resumeData.personalInfo.website}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, website: e.target.value }
                    }))}
                    placeholder="www.yourwebsite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
              <CardDescription>
                Write a brief overview of your professional background
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resumeData.summary}
                onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Experienced professional with..."
                rows={5}
              />
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-cyan-600" />
                  Work Experience
                </div>
                <Button onClick={handleAddExperience} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.experiences.map((exp, index) => (
                <Accordion key={index} type="single" collapsible>
                  <AccordionItem value={`exp-${index}`}>
                    <AccordionTrigger>
                      {exp.title || `Experience ${index + 1}`} {exp.company && `at ${exp.company}`}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Job Title *</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company *</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                            placeholder="Tech Corp"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                            placeholder="New York, NY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`current-${index}`}
                            checked={exp.current}
                            onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`current-${index}`}>I currently work here</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          rows={4}
                        />
                      </div>
                      <Button 
                        onClick={() => handleRemoveExperience(index)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
              
              {resumeData.experiences.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No work experience added yet. Click "Add Experience" to get started.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
                  Education
                </div>
                <Button onClick={handleAddEducation} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <Accordion key={index} type="single" collapsible>
                  <AccordionItem value={`edu-${index}`}>
                    <AccordionTrigger>
                      {edu.degree || `Education ${index + 1}`} {edu.institution && `from ${edu.institution}`}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Degree *</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            placeholder="Bachelor of Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Institution *</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                            placeholder="University Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Year</Label>
                          <Input
                            type="number"
                            value={edu.startYear}
                            onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                            placeholder="2018"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Year</Label>
                          <Input
                            type="number"
                            value={edu.endYear}
                            onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                            placeholder="2022"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>GPA (Optional)</Label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                            placeholder="3.8/4.0"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Additional Details</Label>
                        <Textarea
                          value={edu.description}
                          onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                          placeholder="Relevant coursework, honors, etc..."
                          rows={3}
                        />
                      </div>
                      <Button 
                        onClick={() => handleRemoveEducation(index)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
              
              {resumeData.education.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No education added yet. Click "Add Education" to get started.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-cyan-600" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  id="skillInput"
                  placeholder="Type a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="gap-2 px-3 py-1"
                  >
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {resumeData.skills.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No skills added yet. Type a skill above and press Enter.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload CV Tab */}
        <TabsContent value="upload">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
                Upload Existing CV
              </CardTitle>
              <CardDescription>
                Upload your CV and we'll extract the information automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={extracting}
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full flex items-center justify-center">
                      {extracting ? (
                        <Loader2 className="h-8 w-8 animate-spin ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
                      ) : (
                        <Upload className="h-8 w-8 ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        {extracting ? 'Extracting data...' : 'Upload your CV'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {extracting ? 'Please wait while we process your document' : 'PDF, DOC, or DOCX (Max 5MB)'}
                      </p>
                    </div>
                    {!extracting && (
                      <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                        Choose File
                      </Button>
                    )}
                  </div>
                </label>
              </div>

              {extracting && progress > 0 && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">{progress}% complete</p>
                </div>
              )}

              {selectedFile && !extracting && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <File className="h-8 w-8 text-cyan-600" />
                  <div className="flex-grow">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Badge variant="secondary">Uploaded</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saved Resumes Tab */}
        <TabsContent value="saved">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedResumes.length > 0 ? (
              savedResumes.map((resume, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{resume.title || 'Untitled Resume'}</CardTitle>
                    <CardDescription>
                      Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full text-center py-12">
                <CardContent>
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No saved resumes</h3>
                  <p className="text-muted-foreground mb-4">
                    Create and save your first resume to get started
                  </p>
                  <Button 
                    onClick={() => setActiveTab('build')}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                  >
                    Build Resume
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
