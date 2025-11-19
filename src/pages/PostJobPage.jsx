import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Calendar,
  MapPin,
  DollarSign,
  Save,
  X,
  Plus,
  Trash2,
  Briefcase,
  FileText,
  Video,
  Building2,
  GraduationCap,
  Clock,
  Tag
} from 'lucide-react';

import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Textarea } from '@/components/UI/textarea';
import { Checkbox } from '@/components/UI/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { Alert, AlertDescription } from '@/components/UI/alert';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/UI/dialog';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

import { 
  postJob, 
  getCategories,
  getSkills,
  updateJob
} from '@/services/api';
import VideoUpload from './VideoUpload';
import { themeColors } from '@/config/theme-colors';

const PostJobPage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // Helper function to get localized name
  const getLocalizedName = (nameObj) => {
    if (!nameObj) return '';
    if (typeof nameObj === 'string') return nameObj;
    return nameObj[currentLang] || nameObj.en || nameObj.ar || nameObj.zh || '';
  };
  
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    employment_type: 'full-time',
    remote_ok: false,
    salary_min: null,
    salary_max: null,
    experience_level: '',
    education_level: '',
    job_status: 'active',
    categoryIds: [],
    skillIds: [],
    requirements: [''],
    responsibilities: [''],
    deadline: '',
    videoRequired: false // Indicates if a video is required for this job post
  });
  
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    location: false,
    salary: false
  });
  
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [uploadedVideoId, setUploadedVideoId] = useState(null); // This is the ID of the video from VideoUpload
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isChildUploading, setIsChildUploading] = useState(false);
  const [isChildRecording, setIsChildRecording] = useState(false);
  const [newJobId, setNewJobId] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Category selection state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await getCategories();
        setAvailableCategories(categoriesResponse.data.categories);
        const skillsResponse = await getSkills();
        setAvailableSkills(skillsResponse.data.skills);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        showNotification('Error loading categories and skills', 'error');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 6000);
  };

  const validateForm = () => {
    const newErrors = {
      title: !jobForm.title,
      description: !jobForm.description,
      location: !jobForm.location,
      salary: jobForm.salary_min && jobForm.salary_max && 
              Number(jobForm.salary_min) > Number(jobForm.salary_max)
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

const handleFormChange = (e) => {
  const { name, value, type, checked } = e.target;
  
  let processedValue = type === 'checkbox' ? checked : value;
  if ((name === 'salary_min' || name === 'salary_max') && value !== '') {
    processedValue = Number(value);
  }
  
  setJobForm({
    ...jobForm,
    [name]: processedValue
  });
  
  if (errors[name]) {
    setErrors({
      ...errors,
      [name]: false
    });
  }
};

  const handleSelectChange = (name, value) => {
    setJobForm({
      ...jobForm,
      [name]: value
    });
  };

  const toggleCategory = (categoryId) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updatedCategories);
    setJobForm({
      ...jobForm,
      categoryIds: updatedCategories
    });
  };

  const toggleSkill = (skillId) => {
    const updatedSkills = selectedSkills.includes(skillId)
      ? selectedSkills.filter(id => id !== skillId)
      : [...selectedSkills, skillId];
    
    setSelectedSkills(updatedSkills);
    setJobForm({
      ...jobForm,
      skillIds: updatedSkills
    });
  };

  const handleListItemChange = (type, index, value) => {
    const updatedList = [...jobForm[type]];
    updatedList[index] = value;
    setJobForm({
      ...jobForm,
      [type]: updatedList
    });
  };

  const addListItem = (type) => {
    setJobForm({
      ...jobForm,
      [type]: [...jobForm[type], '']
    });
  };

  const removeListItem = (type, index) => {
    const updatedList = [...jobForm[type]];
    updatedList.splice(index, 1);
    setJobForm({
      ...jobForm,
      [type]: updatedList
    });
  };

  const handleVideoUploadClick = async () => {
    if (!validateForm()) {
      showNotification('Please fill in all required fields before uploading video', 'error');
      return;
    }

    if (!newJobId) {
      try {
        setSaving(true);
        const jobDataToPost = {
          ...jobForm,
          requirements: jobForm.requirements.filter(item => item.trim() !== ''),
          responsibilities: jobForm.responsibilities.filter(item => item.trim() !== ''),
          deadline: jobForm.deadline || null,
          video_id: null,
        };
        const response = await postJob(jobDataToPost);
        setNewJobId(response.data.job.id);
        showNotification('Job draft saved. Proceeding to video upload.', 'info');
      } catch (error) {
        console.error('Error creating job draft:', error);
        showNotification('Error creating job draft for video upload.', 'error');
        setSaving(false);
        return;
      } finally {
        setSaving(false);
      }
    }
    setShowVideoUpload(true);
  };

  const handleVideoUploadComplete = async (videoId) => {
    console.log('handleVideoUploadComplete called with videoId:', videoId);
    setUploadedVideoId(videoId);
    setShowVideoUpload(false);
    console.log('setShowVideoUpload(false) called.');
    
    if (newJobId && videoId) {
      try {
        setSaving(true);
        const updatedJobData = {
          ...jobForm,
          video_id: videoId,
          requirements: jobForm.requirements.filter(item => item.trim() !== ''),
          responsibilities: jobForm.responsibilities.filter(item => item.trim() !== ''),
          deadline: jobForm.deadline || null,
        };
        
        await updateJob(newJobId, updatedJobData);
        showNotification('Video linked to job and job updated successfully!', 'success');
        
        navigate(`/job/${newJobId}`);
      } catch (error) {
        console.error('Error updating job with video ID:', error);
        showNotification('Error linking video to job.', 'error');
      } finally {
        setSaving(false);
      }
    } else if (!videoId) {
      showNotification('Video upload failed or was cancelled. Job not updated with video.', 'error');
    }
  };

  const handleChildStatusChange = (uploading, recording) => {
    setIsChildUploading(uploading);
    setIsChildRecording(recording);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    if (jobForm.videoRequired && !uploadedVideoId && !newJobId) {
      showNotification('Please upload the required video resume, or ensure job is created first.', 'error');
      return;
    }

    try {
      setSaving(true);
      const jobData = {
        ...jobForm,
        requirements: jobForm.requirements.filter(item => item.trim() !== ''),
        responsibilities: jobForm.responsibilities.filter(item => item.trim() !== ''),
        deadline: jobForm.deadline || null,
        video_id: uploadedVideoId || null, 
      };

      let finalJobId = newJobId;
      if (finalJobId) {
        await updateJob(finalJobId, jobData);
        showNotification('Job updated successfully!', 'success');
      } else {
        const response = await postJob(jobData);
        finalJobId = response.data.job.id;
        setNewJobId(finalJobId);
        showNotification('Job posted successfully!', 'success');
      }
      
      navigate(`/job/${finalJobId}`);
      
    } catch (error) {
      console.error('Error posting/updating job:', error);
      showNotification('Error posting/updating job', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Post a New Job
              </h1>
              <p className="text-slate-600 mt-2">Fill in the details to create a new job posting</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="border-slate-300 hover:bg-slate-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Posting...' : 'Post Job'}
              </Button>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <Alert className={`mb-6 ${
            notification.type === 'error' ? 'border-red-500 bg-red-50' :
            notification.type === 'info' ? 'border-blue-500 bg-blue-50' :
            'border-green-500 bg-green-50'
          }`}>
            <AlertDescription className={
              notification.type === 'error' ? 'text-red-800' :
              notification.type === 'info' ? 'text-blue-800' :
              'text-green-800'
            }>
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <CardTitle className="flex items-center text-slate-900">
                <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="title" className="text-slate-700">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={jobForm.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Senior Frontend Developer"
                  className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-slate-700">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="location"
                      name="location"
                      value={jobForm.location}
                      onChange={handleFormChange}
                      placeholder="e.g., San Francisco, CA"
                      className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">This field is required</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="employment_type" className="text-slate-700">
                    Employment Type
                  </Label>
                  <Select
                    value={jobForm.employment_type}
                    onValueChange={(value) => handleSelectChange('employment_type', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote_ok"
                  checked={jobForm.remote_ok}
                  onCheckedChange={(checked) => 
                    setJobForm({ ...jobForm, remote_ok: checked })
                  }
                />
                <Label htmlFor="remote_ok" className="text-slate-700 cursor-pointer">
                  Remote position available
                </Label>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="videoRequired"
                    checked={jobForm.videoRequired}
                    onCheckedChange={(checked) => 
                      setJobForm({ ...jobForm, videoRequired: checked })
                    }
                  />
                  <Label htmlFor="videoRequired" className="text-slate-700 cursor-pointer">
                    Add video introduction to this job posting
                  </Label>
                </div>
                {jobForm.videoRequired && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVideoUploadClick}
                    disabled={saving}
                    className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {uploadedVideoId ? 'Video Uploaded ✓' : 'Upload Video'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <CardTitle className="flex items-center text-slate-900">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div>
                <Label htmlFor="description" className="text-slate-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={jobForm.description}
                  onChange={handleFormChange}
                  placeholder="Provide a detailed description of the job position"
                  rows={6}
                  className={`mt-1 ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Categories and Skills */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <CardTitle className="flex items-center text-slate-900">
                <Tag className="w-5 h-5 mr-2 text-indigo-600" />
                Categories and Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <Label className="text-slate-700 mb-3 block">Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedCategories.includes(category.id)
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'border-slate-300 text-slate-600 hover:border-indigo-400'
                      }`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      {getLocalizedName(category.name)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-slate-700 mb-3 block">Required Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((skill) => (
                    <Badge
                      key={skill.skill_id}
                      variant={selectedSkills.includes(skill.skill_id) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedSkills.includes(skill.skill_id)
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'border-slate-300 text-slate-600 hover:border-blue-400'
                      }`}
                      onClick={() => toggleSkill(skill.skill_id)}
                    >
                      {getLocalizedName(skill.name)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Information */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <CardTitle className="flex items-center text-slate-900">
                <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
                Salary Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary_min" className="text-slate-700">
                    Minimum Salary
                  </Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="salary_min"
                      name="salary_min"
                      type="number"
                      value={jobForm.salary_min || ''}
                      onChange={handleFormChange}
                      placeholder="50000"
                      className={`pl-10 ${errors.salary ? 'border-red-500' : ''}`}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="salary_max" className="text-slate-700">
                    Maximum Salary
                  </Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="salary_max"
                      name="salary_max"
                      type="number"
                      value={jobForm.salary_max || ''}
                      onChange={handleFormChange}
                      placeholder="100000"
                      className={`pl-10 ${errors.salary ? 'border-red-500' : ''}`}
                    />
                  </div>
                </div>
              </div>
              {errors.salary && (
                <p className="text-red-500 text-sm mt-2">
                  Maximum salary must be greater than minimum salary
                </p>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-slate-900">
                  <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                  Requirements
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem('requirements')}
                  className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {jobForm.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={requirement}
                    onChange={(e) => handleListItemChange('requirements', index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeListItem('requirements', index)}
                    disabled={jobForm.requirements.length <= 1}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-slate-900">
                  <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
                  Responsibilities
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem('responsibilities')}
                  className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {jobForm.responsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={responsibility}
                    onChange={(e) => handleListItemChange('responsibilities', index, e.target.value)}
                    placeholder={`Responsibility ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeListItem('responsibilities', index)}
                    disabled={jobForm.responsibilities.length <= 1}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <CardTitle className="flex items-center text-slate-900">
                <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="deadline" className="text-slate-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Application Deadline
                  </Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={jobForm.deadline}
                    onChange={handleFormChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="experience_level" className="text-slate-700 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Experience Level
                  </Label>
                  <Select
                    value={jobForm.experience_level}
                    onValueChange={(value) => handleSelectChange('experience_level', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="education_level" className="text-slate-700 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Education Level
                  </Label>
                  <Select
                    value={jobForm.education_level}
                    onValueChange={(value) => handleSelectChange('education_level', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="associate">Associate Degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
              className="border-slate-300 hover:bg-slate-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </div>

      {/* Video Upload Dialog */}
      <Dialog open={showVideoUpload} onOpenChange={setShowVideoUpload}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Upload Job Video
            </DialogTitle>
          </DialogHeader>
          <VideoUpload 
            onComplete={handleVideoUploadComplete}
            onStatusChange={handleChildStatusChange}
            newjobid={newJobId}
            embedded={true}
          />
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setShowVideoUpload(false)} 
              disabled={isChildRecording}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostJobPage;
