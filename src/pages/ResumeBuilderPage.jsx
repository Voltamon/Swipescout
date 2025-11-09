import React, { useState, useEffect } from 'react';
import {
  extractCVData,
  generateResume,
  previewResume,
  saveResume,
  getUserResumes,
  getUserProfile,
  getUserExperiences,
  getUserEducation,
  getUserSkills,
  getSkills,
  createSkill,
  addUserSkill
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
  // const { user } = useAuth(); // Removed: unused variable
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('build');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Resume data
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      first_name: '',
      second_name: '',
      last_name: '',
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
  const [openExp, setOpenExp] = useState(null);
  const [openEdu, setOpenEdu] = useState(null);

  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('');

  // Helper: extract a display name for a skill object (handles multiple shapes & translations)
  const extractSkillName = (s) => {
    if (!s) return '';
    if (typeof s === 'string') return s;
    // common direct properties
    if (typeof s.name === 'string' && s.name.trim()) return s.name;
    // localized name object
    if (s.name && typeof s.name === 'object') {
      const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.split('-')[0] : 'en';
      if (s.name[lang]) return s.name[lang];
      if (s.name.en) return s.name.en;
      const first = Object.values(s.name).find(v => typeof v === 'string' && v.trim());
      if (first) return first;
    }
    // nested skill object
    if (s.skill && typeof s.skill.name === 'string') return s.skill.name;
    if (s.skill && typeof s.skill.name === 'object') {
      const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.split('-')[0] : 'en';
      if (s.skill.name[lang]) return s.skill.name[lang];
      if (s.skill.name.en) return s.skill.name.en;
      const first = Object.values(s.skill.name).find(v => typeof v === 'string' && v.trim());
      if (first) return first;
    }
    if (typeof s.skill_name === 'string' && s.skill_name.trim()) return s.skill_name;
    if (typeof s.title === 'string' && s.title.trim()) return s.title;
    if (typeof s.label === 'string' && s.label.trim()) return s.label;
    if (Array.isArray(s.translations)) {
      const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.split('-')[0] : 'en';
      const t = s.translations.find(t => t.lang === lang) || s.translations.find(t => t.lang === 'en') || s.translations[0];
      if (t && (t.value || t.text)) return t.value || t.text;
    }
    // fallback: first string-valued property
    for (const k of Object.keys(s)) {
      if (typeof s[k] === 'string' && s[k].trim()) return s[k];
    }
    return JSON.stringify(s);
  };

  // Fetch available canonical skills list
  const fetchAvailableSkills = async () => {
    try {
      const res = await getSkills();
      const arr = Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.data) ? res.data.data : []);
      setAvailableSkills(arr || []);
    } catch (err) {
      console.warn('Failed to fetch available skills', err);
      setAvailableSkills([]);
    }
  };

  // Fetch saved resumes for the Saved tab
  const fetchSavedResumes = async () => {
    try {
      const res = await getUserResumes();
      const arr = Array.isArray(res?.data) ? res.data : (res?.data?.resumes || []);
      setSavedResumes(arr || []);
    } catch (err) {
      console.warn('Failed to fetch saved resumes', err);
      setSavedResumes([]);
    }
  };

  // On mount: populate from profile and fetch reference lists
  useEffect(() => {
    populateFromProfile();
    fetchAvailableSkills();
    fetchSavedResumes();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setExtracting(true);
    setProgress(0);

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await extractCVData(form);
      const data = res?.data || res;

      // Try to merge returned data into resumeData safely
      if (data) {
        // If API returns profile/resume wrapper
        if (data.profile) {
          setResumeData(prev => ({ ...prev, ...data.profile }));
        } else if (data.resume) {
          setResumeData(prev => ({ ...prev, ...data.resume }));
        } else {
          // Merge known keys defensively
          setResumeData(prev => ({
            ...prev,
            personalInfo: data.personalInfo || data.personal || prev.personalInfo,
            summary: data.summary || prev.summary,
            experiences: Array.isArray(data.experiences) ? data.experiences : prev.experiences,
            education: Array.isArray(data.education) ? data.education : prev.education,
            skills: Array.isArray(data.skills) ? data.skills : prev.skills,
            languages: Array.isArray(data.languages) ? data.languages : prev.languages,
            certifications: Array.isArray(data.certifications) ? data.certifications : prev.certifications,
            projects: Array.isArray(data.projects) ? data.projects : prev.projects,
          }));
        }
      }
      toast({ title: 'Extraction complete', description: 'CV data extracted', variant: 'default' });
    } catch (err) {
      console.error('Error extracting CV:', err);
      toast({ title: 'Error', description: 'Failed to extract CV data', variant: 'destructive' });
    } finally {
      setExtracting(false);
      setProgress(0);
    }
  };
  const extractSkillCategory = (s) => {
    if (!s) return '';
    // category may be a string or object
    const cand = s.category || s.ctg || s.type || (s.skill && s.skill.category) || (s.categories && Array.isArray(s.categories) && s.categories[0]);
    if (!cand) return '';
    if (typeof cand === 'string') return cand;
    if (typeof cand === 'object') {
      if (typeof cand.name === 'string') return cand.name;
      if (typeof cand.title === 'string') return cand.title;
      if (cand.name && typeof cand.name === 'object') {
        const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.split('-')[0] : 'en';
        if (cand.name[lang]) return cand.name[lang];
        if (cand.name.en) return cand.name.en;
        const first = Object.values(cand.name).find(v => typeof v === 'string' && v.trim());
        if (first) return first;
      }
      // fallback
      for (const k of Object.keys(cand)) {
        if (typeof cand[k] === 'string' && cand[k].trim()) return cand[k];
      }
    }
    return '';
  };

  const handleAddSkill = async (skill) => {
    if (!skill) return;

    const normalizedInput = (String(skill || '')).trim();
    const alreadyNames = new Set((resumeData.skills || []).map(s => extractSkillName(s).toLowerCase()));

    // try to find canonical skill object in availableSkills by name
    let match = Array.isArray(availableSkills) ? availableSkills.find(s => extractSkillName(s).toLowerCase() === normalizedInput.toLowerCase()) : null;

    try {
      // if no match, try server-side search
      if (!match) {
        const searchRes = await getSkills(normalizedInput);
        const cand = (searchRes?.data && Array.isArray(searchRes.data)) ? searchRes.data[0] : (searchRes?.data?.data && Array.isArray(searchRes.data.data) ? searchRes.data.data[0] : null);
        if (cand) match = cand;
      }

      let toAdd = match ? match : normalizedInput;

      // prevent duplicates
      if (alreadyNames.has(extractSkillName(toAdd).toLowerCase())) {
        console.debug('[ResumeBuilder] handleAddSkill: already added', { skill, toAdd });
        return;
      }

      // If we have a canonical skill object with id, add it to the user's profile first
      if (match && (match.id || match._id || match.skill_id)) {
        const skillId = match.id || match._id || match.skill_id;
        try {
          await addUserSkill({ skill_id: skillId, level: 'Intermediate', years_experience: 1 });
        } catch (err) {
          console.error('Failed to add user skill (existing):', err);
          // continue and still add to UI
        }
        // add canonical object to UI
        setResumeData(prev => ({ ...prev, skills: [...(prev.skills || []), match] }));
        return;
      }

      // If not matched, attempt to create the skill on the server then attach
      if (!match) {
        try {
          const createRes = await createSkill({ name: { en: normalizedInput } });
          const created = createRes?.data || createRes;
          const createdId = created?.id || created?._id || created?.skill_id;
          if (createdId) {
            // add to user's skills
            try {
              await addUserSkill({ skill_id: createdId, level: 'Intermediate', years_experience: 1 });
            } catch (err) {
              console.error('Failed to add user skill (created):', err);
            }
            // add created object to UI list
            setResumeData(prev => ({ ...prev, skills: [...(prev.skills || []), created] }));
            // refresh availableSkills list to include created skill
            try {
              const refreshed = await getSkills();
              const arr = Array.isArray(refreshed?.data) ? refreshed.data : (Array.isArray(refreshed?.data?.data) ? refreshed.data.data : []);
              setAvailableSkills(arr);
            } catch (err) {
              console.warn('Failed to refresh skills after create', err);
            }
            return;
          }
        } catch (err) {
          console.error('createSkill failed:', err);
        }
      }

      // Fallback: add raw string to UI only
      setResumeData(prev => ({ ...prev, skills: [...(prev.skills || []), normalizedInput] }));
    } catch (err) {
      console.error('[ResumeBuilder] handleAddSkill error', err);
      // fallback to optimistic add
      setResumeData(prev => ({ ...prev, skills: [...(prev.skills || []), skill] }));
    }
  };
  

  const handleAddExperience = () => {
    setResumeData(prev => {
      const idx = prev.experiences.length;
      const newExp = {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      };
      const next = { ...prev, experiences: [...prev.experiences, newExp] };
      // schedule UI open/scroll after React updates
      setTimeout(() => {
        const id = `exp-${idx}`;
        setOpenExp(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return next;
    });
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
    setResumeData(prev => {
      const idx = prev.education.length;
      const newEdu = {
        degree: '',
        institution: '',
        location: '',
        startYear: '',
        endYear: '',
        gpa: '',
        description: ''
      };
      const next = { ...prev, education: [...prev.education, newEdu] };
      setTimeout(() => {
        const id = `edu-${idx}`;
        setOpenEdu(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return next;
    });
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

  

  const handleRemoveSkill = (skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleGenerateResume = async () => {
    setGenerating(true);
    try {
  // Always generate from live profile
  const payload = { fromProfile: true, template: 'modern', format: 'pdf' };
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
  // Always preview from live profile
  const payload = { fromProfile: true, template: 'modern' };
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
  // Always save a snapshot from the live profile
  const payload = { fromProfile: true, template: 'modern' };
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
    // Combine name parts into a single fullName for backend templates
    const combinedFullName = ([data.personalInfo?.first_name, data.personalInfo?.second_name, data.personalInfo?.last_name].filter(Boolean).join(' ') || data.personalInfo?.fullName || '').trim();

    const personalInfo = {
      ...data.personalInfo,
      fullName: combinedFullName,
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

  // Populate the local form from the user's profile and related entities
  const populateFromProfile = async () => {
    try {
      const [profileRes, expRes, eduRes, skillsRes] = await Promise.all([
        getUserProfile(),
        getUserExperiences(),
        getUserEducation(),
        getUserSkills()
      ]);

      const profile = profileRes?.data || {};
      const experiences = Array.isArray(expRes?.data) ? expRes.data : (expRes?.data?.experiences || []);
      const education = Array.isArray(eduRes?.data) ? eduRes.data : (eduRes?.data?.education || []);
      const userSkills = Array.isArray(skillsRes?.data) ? skillsRes.data : (skillsRes?.data?.skills || []);

      // Map server profile shape to local resumeData structure
      const personalInfo = {
        first_name: profile.first_name || '',
        second_name: profile.second_name || '',
        last_name: profile.last_name || '',
        // keep combined fullName for downstream mapping
        fullName: [profile.first_name, profile.second_name, profile.last_name].filter(Boolean).join(' ') || profile.fullName || '',
        email: profile.email || '',
        phone: profile.mobile || profile.phone || '',
        location: profile.city?.name || profile.address || '',
        linkedin: profile.linkedin_url || (profile.social && profile.social.linkedin) || '',
        website: profile.website || ''
      };

      const mappedExperiences = (experiences || []).map(e => ({
        title: e.position || e.title || '',
        company: e.company_name || '',
        location: e.location || '',
        startDate: e.start_date ? e.start_date.slice(0,7) : (e.startDate ? e.startDate : ''),
        endDate: e.end_date ? e.end_date.slice(0,7) : (e.endDate ? e.endDate : ''),
        current: !!e.currently_working,
        description: e.description || ''
      }));

      const mappedEducation = (education || []).map(ed => ({
        degree: ed.degree || '',
        institution: ed.institution || '',
        location: ed.location || '',
        startYear: ed.startDate ? (ed.startDate.slice(0,4)) : (ed.startYear || ''),
        endYear: ed.endDate ? (ed.endDate.slice(0,4)) : (ed.endYear || ''),
        gpa: ed.gpa || '',
        description: ed.description || ''
      }));

      const mappedSkills = (userSkills || []).map(s => (typeof s === 'string' ? s : (s.skill_name || s.name?.en || s.name || s.skill?.name || ''))).filter(Boolean);

      setResumeData(prev => ({
        ...prev,
        personalInfo,
        experiences: mappedExperiences,
        education: mappedEducation,
        skills: mappedSkills
      }));
      console.debug('[ResumeBuilder] mappedSkills from profile:', mappedSkills);

      toast({ title: 'Profile loaded', description: 'Form populated from your profile data.' });
    } catch (err) {
      console.error('Error loading profile data:', err);
      toast({ title: 'Error', description: 'Failed to load profile data', variant: 'destructive' });
    }
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
            {/* Form is always populated from profile and always uses live profile for operations */}
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
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={resumeData.personalInfo.first_name}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, first_name: e.target.value }
                      }))}
                      placeholder="First"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondName">Second name</Label>
                    <Input
                      id="secondName"
                      value={resumeData.personalInfo.second_name}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, second_name: e.target.value }
                      }))}
                      placeholder="Second"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Family name</Label>
                    <Input
                      id="lastName"
                      value={resumeData.personalInfo.last_name}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, last_name: e.target.value }
                      }))}
                      placeholder="Family"
                    />
                  </div>
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
              {resumeData.experiences.length > 0 ? (
                <Accordion type="single" collapsible value={openExp} onValueChange={setOpenExp}>
                  {resumeData.experiences.map((exp, index) => (
                    <AccordionItem key={index} value={`exp-${index}`}>
                      <div id={`exp-${index}`}>
                        <AccordionTrigger>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                            <div>
                              <div className="font-medium">{exp.title || `Experience ${index + 1}`}{exp.company ? ` — ${exp.company}` : ''}</div>
                              <div className="text-xs text-muted-foreground">{exp.location || ''}</div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                              {exp.startDate ? exp.startDate : ''}{exp.startDate && ' - '}{exp.current ? 'Present' : (exp.endDate || '')}
                            </div>
                          </div>
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
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
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
                  {resumeData.education.length > 0 ? (
                    <Accordion type="single" collapsible value={openEdu} onValueChange={setOpenEdu}>
                      {resumeData.education.map((edu, index) => (
                        <AccordionItem key={index} value={`edu-${index}`}>
                          <div id={`edu-${index}`}>
                            <AccordionTrigger>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                                <div>
                                  <div className="font-medium">{edu.degree || `Education ${index + 1}`}{edu.institution ? ` — ${edu.institution}` : ''}</div>
                                  <div className="text-xs text-muted-foreground">{edu.location || ''}</div>
                                </div>
                                <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                                  {edu.startYear ? edu.startYear : ''}{edu.startYear && ' - '}{edu.endYear || ''}
                                </div>
                              </div>
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
                          </div>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : null}
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
              <div className="flex gap-2 items-center">
                {/* Category filter (if categories exist on skills) */}
                {Array.isArray(availableSkills) && (() => {
                  const cats = Array.from(new Set(availableSkills.map(s => extractSkillCategory(s)).filter(Boolean)));
                  if (cats.length === 0) return null;
                  return (
                    <select
                      value={skillCategoryFilter}
                      onChange={(e) => setSkillCategoryFilter(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                      aria-label="Filter skills by category"
                    >
                      <option value="">All categories</option>
                      {cats.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                  );
                })()}

                <Input
                  id="skillInput"
                  list="skills-list"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (skillInput) { handleAddSkill(skillInput); setSkillInput(''); }
                    }
                  }}
                  placeholder="Select or type a skill"
                />
                <datalist id="skills-list">
                  {Array.isArray(availableSkills) ? availableSkills
                    .filter(s => {
                      if (!skillCategoryFilter) return true;
                      const c = extractSkillCategory(s);
                      return String(c) === String(skillCategoryFilter);
                    })
                    .map((s, i) => {
                      const val = extractSkillName(s) || '';
                      return <option key={i} value={val} />;
                    }) : null}
                </datalist>
                <Button size="sm" onClick={() => { if (skillInput) { handleAddSkill(skillInput); setSkillInput(''); } }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(resumeData.skills) && resumeData.skills.map((skill, index) => {
                    const display = extractSkillName(skill) || 'Unnamed Skill';
                    return (
                      <Badge key={index} variant="secondary" className="gap-2 px-3 py-1">
                        {display}
                        <button onClick={() => handleRemoveSkill(skill)}>
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
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
