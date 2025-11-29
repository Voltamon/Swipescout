import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  postJob, 
  getCategories,
  getSkills,
  updateJob
} from '@/services/api';
import VideoUpload from './VideoUpload';

// shadcn/ui components
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Textarea } from '@/components/UI/textarea';
import { Checkbox } from '@/components/UI/checkbox';
import { Badge } from '@/components/UI/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/UI/dialog';

// Lucide icons
import {
  Briefcase,
  MapPin,
  DollarSign,
  Save,
  X,
  Plus,
  Trash2,
  Video,
  FileText,
  Loader2,
  Calendar,
  GraduationCap,
  Award,
  CheckCircle2,
} from 'lucide-react';

// Theme colors
import { themeColors } from '@/config/theme-colors';

const PostJobPage = () => {
  const navigate = useNavigate();
  
  // Helper function to extract text from multilingual objects
  const getLocalizedText = (text, defaultValue = 'Unknown') => {
    if (!text) return defaultValue;
    if (typeof text === 'string') return text;
    if (typeof text === 'object') {
      // Priority: English > Arabic > Chinese > First available value
      return text.en || text.ar || text.zh || Object.values(text)[0] || defaultValue;
    }
    return defaultValue;
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
    salary: false,
  });
  
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [uploadedVideoId, setUploadedVideoId] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isChildUploading, setIsChildUploading] = useState(false);
  const [isChildRecording, setIsChildRecording] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'success'
  });
  const [newJobId, setNewJobId] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, skillsResponse] = await Promise.all([
          getCategories(),
          getSkills()
        ]);
        setAvailableCategories(categoriesResponse.data.categories);
        setAvailableSkills(skillsResponse.data.skills);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Error loading categories and skills', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast({ ...toast, open: false }), 5000);
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
    if ((name === 'salary_min' || name === 'salary_max')) {
      processedValue = value !== '' ? Number(value) : null;
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
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newCategories);
    setJobForm({
      ...jobForm,
      categoryIds: newCategories
    });
  };

  const toggleSkill = (skillId) => {
    const newSkills = selectedSkills.includes(skillId)
      ? selectedSkills.filter(id => id !== skillId)
      : [...selectedSkills, skillId];
    
    setSelectedSkills(newSkills);
    setJobForm({
      ...jobForm,
      skillIds: newSkills
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

  // Modified: This function now handles creating the job first if not already created
  const handleVideoUploadClick = async () => {
    if (!validateForm()) {
      showToast('Please fill in all required fields before uploading video', 'error');
      return;
    }

    // If job hasn't been posted yet, post it first to get an ID
    if (!newJobId) {
      try {
        setSaving(true);
        const jobDataToPost = {
          ...jobForm,
          requirements: jobForm.requirements.filter(item => item.trim() !== ''),
          responsibilities: jobForm.responsibilities.filter(item => item.trim() !== ''),
        };
        // Remove frontend-only fields that backend doesn't expect
        delete jobDataToPost.videoRequired;
        delete jobDataToPost.deadline;
        delete jobDataToPost.video_id;
        
        const response = await postJob(jobDataToPost);
        setNewJobId(response.data.job.id);
        showToast('Job draft saved. Proceeding to video upload.', 'info');
      } catch (error) {
        console.error('Error creating job draft:', error);
        showToast('Error creating job draft for video upload.', 'error');
        setSaving(false);
        return;
      } finally {
        setSaving(false);
      }
    }
    setShowVideoUpload(true);
  };

  // Callback when video upload completes - updates job with video ID
  const handleVideoUploadComplete = async (videoId) => {
    console.log('handleVideoUploadComplete called with videoId:', videoId);
    setUploadedVideoId(videoId);
    setShowVideoUpload(false); // Close the dialog immediately after upload initiation
    console.log('setShowVideoUpload(false) called.');
    
    if (newJobId && videoId) {
      try {
        setSaving(true);
        const updatedJobData = {
          ...jobForm,
          requirements: jobForm.requirements.filter(item => item.trim() !== ''),
          responsibilities: jobForm.responsibilities.filter(item => item.trim() !== ''),
        };
        // Remove frontend-only fields that backend doesn't expect
        delete updatedJobData.videoRequired;
        delete updatedJobData.deadline;
        delete updatedJobData.video_id;
        // Note: Backend Job entity has a video relation managed through the video entity itself
        // The video should already be associated with the job via the VideoUpload component
        
        await updateJob(newJobId, updatedJobData);
        showToast('Video linked to job and job updated successfully!', 'success');
        
        // Navigate to job details page
        navigate(`/job/${newJobId}`);
      } catch (error) {
        console.error('Error updating job with video ID:', error);
        showToast('Error linking video to job.', 'error');
      } finally {
        setSaving(false);
      }
    } else if (!videoId) {
      showToast('Video upload failed or was cancelled. Job not updated with video.', 'error');
    }
  };

  // Callback to receive current uploading/recording status from VideoUpload
  const handleChildStatusChange = (uploading, recording) => {
    setIsChildUploading(uploading);
    setIsChildRecording(recording);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    // Check if video is required but not uploaded/linked yet
    if (jobForm.videoRequired && !uploadedVideoId && !newJobId) {
      showToast('Please upload the required video resume, or ensure job is created first.', 'error');
      return;
    }

    try {
      setSaving(true);
      const jobData = {
        ...jobForm,
        requirements: jobForm.requirements.filter(item => item.trim() !== ''),
        responsibilities: jobForm.responsibilities.filter(item => item.trim() !== ''),
      };
      
      // Remove frontend-only fields that backend doesn't expect
      delete jobData.videoRequired;
      delete jobData.deadline;
      delete jobData.video_id;
      // Note: Backend Job entity doesn't directly accept deadline or video_id fields
      // Video association is handled through the video entity's job relation

      let finalJobId = newJobId;
      if (finalJobId) {
        // If job already exists (from video upload pre-creation), update it
        await updateJob(finalJobId, jobData);
        showToast('Job updated successfully!', 'success');
      } else {
        // If job does not exist yet, create it
        const response = await postJob(jobData);
        finalJobId = response.data.job.id;
        setNewJobId(finalJobId);
        showToast('Job posted successfully!', 'success');
      }
      
      navigate(`/job/${finalJobId}`);
      
    } catch (error) {
      console.error('Error posting/updating job:', error);
      showToast('Error posting/updating job', 'error');
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
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast.open && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className={`rounded-lg px-6 py-4 shadow-lg ${
            toast.type === 'success' ? 'bg-green-50 border border-green-200' :
            toast.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {toast.type === 'error' && <X className="h-5 w-5 text-red-600" />}
              <p className={`font-medium ${
                toast.type === 'success' ? 'text-green-800' :
                toast.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Post a New Job
              </h1>
              <p className="text-slate-600 mt-2">Create an amazing job opportunity</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Post Job
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                Basic Information
              </CardTitle>
              <CardDescription>Provide the core details about this position</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <Label htmlFor="title" className="text-slate-700 font-medium">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={jobForm.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Senior Frontend Developer"
                  className={`mt-1.5 ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location" className="text-slate-700 font-medium">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                  <Label htmlFor="employment_type" className="text-slate-700 font-medium">
                    Employment Type
                  </Label>
                  <Select
                    value={jobForm.employment_type}
                    onValueChange={(value) => handleSelectChange('employment_type', value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select employment type" />
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
                  onCheckedChange={(checked) => handleSelectChange('remote_ok', checked)}
                />
                <Label htmlFor="remote_ok" className="text-slate-700 font-medium cursor-pointer">
                  Remote position available
                </Label>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="videoRequired"
                      checked={jobForm.videoRequired}
                      onCheckedChange={(checked) => handleSelectChange('videoRequired', checked)}
                    />
                    <Label htmlFor="videoRequired" className="text-slate-700 font-medium cursor-pointer">
                      Add a video to this job post
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
                      <Video className="mr-2 h-4 w-4" />
                      {uploadedVideoId ? 'Video Uploaded ✓' : 'Upload Video'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <FileText className="h-5 w-5 text-indigo-600" />
                Job Description
              </CardTitle>
              <CardDescription>Describe what this position entails</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div>
                <Label htmlFor="description" className="text-slate-700 font-medium">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={jobForm.description}
                  onChange={handleFormChange}
                  placeholder="Provide a detailed description of the job position..."
                  rows={8}
                  className={`mt-1.5 ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Categories and Skills */}
          <Card className="border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Award className="h-5 w-5 text-indigo-600" />
                Categories & Skills
              </CardTitle>
              <CardDescription>Select relevant categories and required skills</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <Label className="text-slate-700 font-medium mb-3 block">Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <Badge
                      key={`category-${category.id}`}
                      variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        selectedCategories.includes(category.id)
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                          : 'hover:bg-slate-100'
                      }`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      {getLocalizedText(category.name)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-slate-700 font-medium mb-3 block">Required Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((skill) => (
                    <Badge
                      key={`skill-${skill.id}`}
                      variant={selectedSkills.includes(skill.id) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        selectedSkills.includes(skill.id)
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700'
                          : 'hover:bg-slate-100'
                      }`}
                      onClick={() => toggleSkill(skill.id)}
                    >
                      {getLocalizedText(skill.name)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Information */}
          <Card className="border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <DollarSign className="h-5 w-5 text-indigo-600" />
                Salary Information
              </CardTitle>
              <CardDescription>Define the salary range for this position</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="salary_min" className="text-slate-700 font-medium">
                    Minimum Salary
                  </Label>
                  <div className="relative mt-1.5">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                  <Label htmlFor="salary_max" className="text-slate-700 font-medium">
                    Maximum Salary
                  </Label>
                  <div className="relative mt-1.5">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="salary_max"
                      name="salary_max"
                      type="number"
                      value={jobForm.salary_max || ''}
                      onChange={handleFormChange}
                      placeholder="80000"
                      className={`pl-10 ${errors.salary ? 'border-red-500' : ''}`}
                    />
                  </div>
                </div>
              </div>
              {errors.salary && (
                <p className="text-red-500 text-sm mt-2">Maximum salary must be greater than minimum salary</p>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                    Requirements
                  </CardTitle>
                  <CardDescription>List the requirements for this position</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem('requirements')}
                  className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {jobForm.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={requirement}
                    onChange={(e) => handleListItemChange('requirements', index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeListItem('requirements', index)}
                    disabled={jobForm.requirements.length <= 1}
                    className="shrink-0 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card className="border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                    Responsibilities
                  </CardTitle>
                  <CardDescription>Define the key responsibilities</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem('responsibilities')}
                  className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {jobForm.responsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={responsibility}
                    onChange={(e) => handleListItemChange('responsibilities', index, e.target.value)}
                    placeholder={`Responsibility ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeListItem('responsibilities', index)}
                    disabled={jobForm.responsibilities.length <= 1}
                    className="shrink-0 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
                Additional Information
              </CardTitle>
              <CardDescription>Add more details about the position</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="deadline" className="text-slate-700 font-medium">
                    Application Deadline
                  </Label>
                  <div className="relative mt-1.5">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={jobForm.deadline}
                      onChange={handleFormChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience_level" className="text-slate-700 font-medium">
                    Experience Level
                  </Label>
                  <Select
                    value={jobForm.experience_level}
                    onValueChange={(value) => handleSelectChange('experience_level', value)}
                  >
                    <SelectTrigger className="mt-1.5">
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
                  <Label htmlFor="education_level" className="text-slate-700 font-medium">
                    Education Level
                  </Label>
                  <Select
                    value={jobForm.education_level}
                    onValueChange={(value) => handleSelectChange('education_level', value)}
                  >
                    <SelectTrigger className="mt-1.5">
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
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Post Job
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Video Upload Dialog - Modal for uploading job video */}
      <Dialog open={showVideoUpload} onOpenChange={setShowVideoUpload}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Upload Job Video</DialogTitle>
          </DialogHeader>
          <VideoUpload 
            onComplete={handleVideoUploadComplete}
            onStatusChange={handleChildStatusChange}
            newjobid={newJobId}
            embedded={true}
          />
          <DialogFooter>
            {/* Always allow cancel button if the dialog is open and not actively recording */}
            <Button 
              variant="outline"
              onClick={() => setShowVideoUpload(false)} 
              disabled={isChildRecording} // Only disable if actively recording
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
