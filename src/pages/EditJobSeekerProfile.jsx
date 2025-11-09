import React, { useState, useEffect, useRef  } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getUserProfile,
  updateUserProfile,
  getUserSkills,
  addUserSkill,
  
  deleteUserSkill,
  getUserExperiences,
  addUserExperience,
  updateUserExperience,
  deleteUserExperience,
  getUserEducation,
  addUserEducation,
  updateUserEducation,
  deleteUserEducation,
  getUserVideos,
  deleteUserVideo,
  uploadProfileImage,
  getSkills,
  getCountries,
  getCities,
} from '@/services/api';
import dayjs from 'dayjs';
import localize from '@/utils/localize';


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Textarea } from '@/components/UI/textarea.jsx';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/UI/avatar.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/UI/tabs.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/UI/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Progress } from '@/components/UI/progress.jsx';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Camera,
  Video,
  Play,
  Pause,
  Plus,
  Edit,
  Trash,
  Save,
  X,
  RefreshCw
} from 'lucide-react';
import themeColors from '@/config/theme-colors-jobseeker';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// A tiny wrapper used by MUI-based code earlier. We use shadcn Tabs below instead.

const EditJobSeekerProfile = ({ initialProfile = null, onClose = () => {}, onSaved = () => {}, openTab = null, action = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for tabs
  const [tabValue, setTabValue] = useState(0);

  // State for profile data
  const [profile, setProfile] = useState({
    first_name: '',
    second_name: '',
    last_name: '',
    title: '',
    // Use explicit country/city/address fields so we can render dropdowns
    country_id: '',
    city_id: '',
    location: '',
    bio: '',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    profile_pic: '',
    address: '',
    preferred_job_title: '',
    current_job_title: '',
    social: {
      linkedin_url: '',
      github: '',
      twitter: ''
    }
  });

  // Countries / cities for dropdowns
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  // State for skills
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedSkillName, setSelectedSkillName] = useState('');
  const [skillCategories, setSkillCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [skillSearchLoading, setSkillSearchLoading] = useState(false);
  const [avatarPicture, setAvatarPicture] = useState('');
  // New states for skill level and years when adding a skill
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('Intermediate');
  const [selectedSkillYears, setSelectedSkillYears] = useState(1);


  // State for experiences
  const [experiences, setExperiences] = useState([]);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [experienceForm, setExperienceForm] = useState({
    company_name: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    currently_working: false,
    description: ''
  });

  // State for education
  const [education, setEducation] = useState([]);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [educationForm, setEducationForm] = useState({
    institution: '',
    degree: '',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  // State for videos
  const [videos, setVideos] = useState([]);

  // Use `localize` utility to pick the right language string from localized fields
  const renderSkillName = (skill) => {
    const val = skill == null ? '' : (skill.name ?? skill);
    // Ensure we always return a string to avoid React complaining about objects
    const localized = localize(val);
    return (localized === null || localized === undefined) ? '' : String(localized);
  };

  // Helper to get a stable skill id from different shapes
  const getSkillId = (s) => s?.id ?? s?.skill_id ?? s?._id ?? s?.skillId ?? null;

  // Helper to test whether a suggestion is already added
  const isSkillAlreadyAdded = (sugg) => {
    const sid = getSkillId(sugg);
    if (!sid) return false;
    return (skills || []).some(sk => getSkillId(sk) === sid);
  };

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const fileInputRef = useRef(null);

  // Add this helper function somewhere in your component (outside the main function)
  const verifyImageAvailability = (url) => {
    return new Promise((resolve, reject) => {
      if (!url) reject(new Error('Empty URL'));

      const img = new Image();
      let timer = setTimeout(() => {
        img.onload = img.onerror = null;
        reject(new Error('Image load timeout'));
      }, 5000);

      img.onload = () => {
        clearTimeout(timer);
        if (img.width > 0 && img.height > 0) {
          resolve();
        } else {
          reject(new Error('Zero dimensions'));
        }
      };
      img.onerror = () => {
        clearTimeout(timer);
        reject(new Error('Failed to load'));
      };
      img.src = url;
    });
  };

  const createStarterProfile = async () => {
    setSaving(true);
    const starterProfile = { first_name: '' };
    try {
      const resp = await updateUserProfile(starterProfile);
      // update local state with server response if provided, otherwise use starterProfile
      const newProfile = resp?.data || starterProfile;
      setProfile(newProfile);
      setSaving(false);
      return newProfile;
    } catch (err) {
      setSaving(false);
      throw err;
    }
  }

  // Normalize backend profile response so UI fields (snake_case) are present
  const normalizeProfile = (p = {}) => {
    if (!p || typeof p !== 'object') return p || {};
    const normalized = {
      ...p,
      first_name: p.first_name ?? p.firstName ?? p.first ?? p.name ?? '',
      second_name: p.second_name ?? p.Second_name ?? p.secondName ?? '',
      last_name: p.last_name ?? p.lastName ?? p.last ?? '',
      title: p.title ?? p.professional_title ?? p.professionalTitle ?? '',
      // Accept different shapes for country/city
      country_id: p.country_id ?? p.countryId ?? p.country?.id ?? '',
      city_id: p.city_id ?? p.cityId ?? p.city?.id ?? '',
      location: p.location ?? p.city ?? '',
      bio: p.bio ?? p.description ?? p.about ?? '',
      email: p.email ?? p.emailAddress ?? '',
      phone: p.phone ?? p.phoneNumber ?? '',
      mobile: p.mobile ?? p.mobileNumber ?? '',
      website: p.website ?? p.websiteUrl ?? '',
      profile_pic: p.profile_pic ?? p.profilePicture ?? p.profile_picture_url ?? p.logo_url ?? '',
      address: p.address ?? p.street ?? '',
      preferred_job_title: p.preferred_job_title ?? p.preferredJobTitle ?? '',
  // Accept different shapes for current job title (backend may return currentJobName)
  current_job_title: p.current_job_title ?? p.currentJobTitle ?? p.currentJobName ?? p.currentTitle ?? '',
      social: {
        linkedin_url: p.social?.linkedin_url ?? p.social?.linkedin ?? p.linkedin_url ?? p.linkedin ?? '',
        github: p.social?.github ?? p.social?.github_url ?? p.github ?? '',
        twitter: p.social?.twitter ?? p.social?.twitter_url ?? p.twitter ?? ''
      }
    };
    return normalized;
  };

  // Fetch user data (or use initialProfile passed by parent)
  useEffect(() => {
    const fetchUserData = async () => {
      if (initialProfile) {
          const norm = normalizeProfile(initialProfile);
          setProfile(norm);
          setAvatarPicture(norm.profile_pic ? `${VITE_API_BASE_URL}${norm.profile_pic}?t=${Date.now()}` : '');
          setLoading(false);
          return;
        }

      let profileResponse;
      try {
        setLoading(true);
        try {
          profileResponse = await getUserProfile();
        } catch (error) {
          if (error?.status === 404) {
            try {
              await createStarterProfile();
              profileResponse = await getUserProfile();
              setSnackbar({ open: true, message: 'Starter profile created..', severity: 'success' });
            } catch (err) {
              console.error('Failed to create starter profile:', err);
              setSnackbar({ open: true, message: 'Failed to create starter profile ..', severity: 'error' });
            }
          } else {
            throw error;
          }
        }

        const allResults = await Promise.allSettled([
          getUserSkills(),
          getSkills(),
          getUserExperiences(),
          getUserEducation(),
          getUserVideos()
        ]);

        // Map settled results to expected response-shape, falling back to empty lists when a call failed
        const [
          skillsResult,
          availableSkillsResult,
          experiencesResult,
          educationResult,
          videosResult
        ] = allResults;

        const skillsResponse = skillsResult.status === 'fulfilled' ? skillsResult.value : { data: { skills: [] } };
        const availableSkillsResponse = availableSkillsResult.status === 'fulfilled' ? availableSkillsResult.value : { data: { skills: [] } };
        const experiencesResponse = experiencesResult.status === 'fulfilled' ? experiencesResult.value : { data: { experiences: [] } };
        const educationResponse = educationResult.status === 'fulfilled' ? educationResult.value : { data: { educations: [] } };
        const videosResponse = videosResult.status === 'fulfilled' ? videosResult.value : { data: { videos: [] } };

        // Log any rejected results for easier debugging
        allResults.forEach((r, idx) => {
          if (r.status === 'rejected') {
            const names = ['getUserSkills','getSkills','getUserExperiences','getUserEducation','getUserVideos'];
            console.error(`Failed to fetch ${names[idx]}:`, r.reason || r);
          }
        });

        // Some backend responses wrap the actual profile under `data.profile`.
        // Accept both shapes: `response.data` or `response.data.profile`.
        const rawProfile = profileResponse?.data?.profile ?? profileResponse?.data ?? {};
        const normProfile = normalizeProfile(rawProfile);
        setProfile(normProfile);
        // Fetch countries & cities via API helpers (mounted under /api/locations)
        try {
          const c = await getCountries();
          setCountries(c?.data || []);
        } catch (e) {
          console.warn('Could not fetch countries', e);
        }

        try {
          const countryId = normProfile.country_id || normProfile.countryId || normProfile.country?.id || '';
          if (countryId) {
            const ct = await getCities(countryId);
            setCities(ct?.data || []);
          }
        } catch (e) {
          console.warn('Could not fetch cities', e);
        }
        setSkills(skillsResponse.data?.skills || []);
        setAvailableSkills(availableSkillsResponse.data?.skills || []);
        setExperiences(experiencesResponse.data?.experiences || []);
        setEducation(educationResponse.data?.educations || []);
        setVideos(videosResponse.data?.videos || []);
        
  const initialAvatarUrl = normProfile?.profile_pic ? `${VITE_API_BASE_URL}${normProfile.profile_pic}?t=${Date.now()}` : '';
        try {
          if (initialAvatarUrl) await verifyImageAvailability(initialAvatarUrl);
          setAvatarPicture(initialAvatarUrl);
        } catch (err) {
          console.error('Avatar image not available:', err);
          setAvatarPicture('');
        }

          setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [initialProfile]);

  // Listen for query params so other pages can link directly to a tab or open a dialog
  useEffect(() => {
    if (!location) return;
    const params = new URLSearchParams(location.search);
    // prefer props passed in (openTab/action) so parent components can control the inner tab/dialog
    const tabParam = (openTab || params.get('openTab') || params.get('tab') || '').toLowerCase();
    const actionParam = (action || params.get('action') || params.get('open') || '').toLowerCase();

    const tabMap = {
      'basic': 0,
      'info': 0,
      'profile': 0,
      'skills': 1,
      'experience': 2,
      'education': 3,
      'videos': 4,
      'video-upload': 4,
      'video_upload': 4,
      'video': 4
    };

    let targetTab;
    if (tabParam) {
      if (tabMap.hasOwnProperty(tabParam)) targetTab = tabMap[tabParam];
      else if (!Number.isNaN(parseInt(tabParam, 10))) targetTab = parseInt(tabParam, 10);
    }

    if (typeof targetTab === 'number') {
      setTabValue(targetTab);
    }

    // Open specific dialogs when asked
    if (tabParam === 'add-skill' || actionParam === 'add-skill' || (tabParam === 'skills' && actionParam === 'add')) {
      setSkillDialogOpen(true);
    }

    if (tabParam === 'add-experience' || actionParam === 'add-experience' || (tabParam === 'experience' && actionParam === 'add')) {
      handleOpenExperienceDialog();
    }

    if (tabParam === 'add-education' || actionParam === 'add-education' || (tabParam === 'education' && actionParam === 'add')) {
      handleOpenEducationDialog();
    }

    if (tabParam === 'video-upload' || actionParam === 'upload-video' || (tabParam === 'videos' && actionParam === 'upload')) {
      // trigger upload flow (existing helper will navigate to upload route)
      handleUploadVideo();
    }
  }, [location.search, openTab, action]);

  // Handle tab change (shadcn Tabs uses value strings)
  const handleTabChange = (value) => setTabValue(value);

  // Handle profile form change (compatible with Input/Textarea components)
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    if (name && name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile({
        ...profile,
        [parent]: {
          ...profile[parent],
          [child]: value
        }
      });
    } else if (name) {
      setProfile({ ...profile, [name]: value });
    }
  };

  // Fetch cities for a given country id (best-effort)
  const fetchCitiesForCountry = async (countryId) => {
    if (!countryId) {
      setCities([]);
      return;
    }
    try {
      const resp = await getCities(countryId);
      setCities(resp?.data || []);
    } catch (e) {
      console.warn('Could not fetch cities for country', countryId, e);
    }
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      // Map frontend field names to backend entity property names where necessary
      const payload = {
        ...profile,
        // Backend entity expects property `currentJobName`
        currentJobName: profile.current_job_title || profile.currentJobName || profile.currentJob || undefined,
        // Backend entity property for city is `cityId`
        cityId: profile.city_id || profile.cityId || undefined,
        // linkedin_url column exists; populate top-level key too for convenience
        linkedin_url: profile.social?.linkedin_url || profile.linkedin_url || undefined
      };

      // Remove undefined keys so backend doesn't get explicit undefined
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      console.log("profile payload:", payload);
      const response = await updateUserProfile(payload);
      let updatedProfile = response?.data || response;
  updatedProfile = normalizeProfile(updatedProfile);
      // Normalize backend picture field to frontend expected field
      if (updatedProfile && updatedProfile.profile_picture_url && !updatedProfile.profile_pic) {
        updatedProfile = { ...updatedProfile, profile_pic: updatedProfile.profile_picture_url };
      }

      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });

      // Update local state and inform parent so the profile page refreshes
      setSaving(false);
  setProfile(updatedProfile);
      try {
        onSaved && onSaved(updatedProfile);
      } catch {
        /* ignore callback errors */
      }
      try {
        onClose && onClose();
      } catch {
        /* ignore */
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Error updating profile',
        severity: 'error'
      });
      setSaving(false);
    }
  };


  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);

      // 1. Show instant preview
      const tempPreviewUrl = URL.createObjectURL(file);
      setAvatarPicture(tempPreviewUrl);

      // 2. Upload to server
      const response = await uploadProfileImage(file);

      // 3. Server returns the FINAL URL (must be immediately accessible)
      const serverUrl = `${VITE_API_BASE_URL}${response.data.logo_url}?t=${Date.now()}`;

      // 4. Verify the image is truly ready (with retries)
      let loaded = false;
      for (let i = 0; i < 3; i++) {
        try {
          await verifyImageAvailability(serverUrl);
          loaded = true;
          break;
        } catch {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
        }
      }

      if (loaded) {
        const newPic = response.data?.profile?.profile_pic || response.data.logo_url;
        if (newPic) setProfile(prev => ({ ...prev, profile_pic: newPic }));
        setAvatarPicture(serverUrl);
        setSnackbar({ open: true, message: 'Profile picture updated!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Uploaded! Refresh to see changes.', severity: 'info' });
      }

      // Clean up preview
      URL.revokeObjectURL(tempPreviewUrl);

    } catch (error) {
      console.error('Avatar upload error:', error);
      setSnackbar({ open: true, message: 'Upload failed. Please try again.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Skill dialog handlers
  const handleOpenSkillDialog = () => {
    // prepare suggestion list and categories from availableSkills
    setSelectedSkill('');
    setSelectedSkillName('');
    setSelectedCategory(null);
    // set defaults for new skill entries
    setSelectedSkillLevel('Intermediate');
    setSelectedSkillYears(1);
    try {
      // Build categories from availableSkills but prefer category objects whose types include 'skill'.
      const catsSet = new Set();
      (availableSkills || []).forEach(s => {
        if (!s) return;
        const rawCat = s.category ?? s.group ?? s.rawCategory ?? null;
        if (!rawCat) return;

        // If category is an object try to use name only when it is intended for skills
        if (typeof rawCat === 'object') {
          const cName = rawCat.name ?? rawCat.title ?? null;
          const types = rawCat.types ?? rawCat.type ?? null;
          if (cName && (!types || (Array.isArray(types) ? types.includes('skill') : String(types).toLowerCase() === 'skill'))) {
            catsSet.add(cName);
          }
        } else if (typeof rawCat === 'string') {
          // Keep string categories
          catsSet.add(rawCat);
        }
      });
      setSkillCategories(Array.from(catsSet));
    } catch (e) {
      setSkillCategories([]);
    }
    setSkillDialogOpen(true);
  };

  const handleCloseSkillDialog = () => {
    setSkillDialogOpen(false);
    setSelectedSkill('');
    // reset temp fields
    setSelectedSkillLevel('Intermediate');
    setSelectedSkillYears(1);
  };


  const handleSaveSkill = async () => {
    if (!selectedSkill) return;

    try {
      setSaving(true);
      // include level and years of experience (default years = 1)
      const payload = {
        skill_id: selectedSkill,
        level: selectedSkillLevel,
        years_experience: Number(selectedSkillYears) || 1
      };
      await addUserSkill(payload);

      // Refresh skills
      const response = await getUserSkills() || [];
      setSkills(response.data.skills);

      setSnackbar({
        open: true,
        message: 'Skill added successfully',
        severity: 'success'
      });

      handleCloseSkillDialog();
      setSaving(false);
    } catch (error) {
      console.error('Error saving skill:', error);
      // Try to provide a friendlier message when backend rejects duplicate
      const status = error?.response?.status || error?.status;
      const msg = error?.response?.data?.message || error?.message || '';
      if (status === 400 && /exist|already|duplicate|added/i.test(msg)) {
        setSnackbar({ open: true, message: 'Skill already added to your profile', severity: 'info' });
        // refresh skills list to ensure UI is up-to-date
        try { const resp = await getUserSkills(); setSkills(resp.data.skills || []); } catch (e) { /* ignore */ }
        handleCloseSkillDialog();
      } else {
        setSnackbar({ open: true, message: 'Error saving skill', severity: 'error' });
      }
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (skill_id) => {
    try {
      setSaving(true);
      await deleteUserSkill(skill_id);

      setSkills(skills.filter(skill => skill.skill_id !== skill_id));

      setSnackbar({
        open: true,
        message: 'Skill deleted successfully',
        severity: 'success'
      });

      setSaving(false);
    } catch (error) {
      console.error('Error deleting skill:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting skill',
        severity: 'error'
      });
      setSaving(false);
    }
  };

  // Experience dialog handlers
  const handleOpenExperienceDialog = (experience = null) => {
    if (experience) {
      setExperienceForm({
        id: experience.id,
        company_name: experience.company_name,
        position: experience.position,
        location: experience.location,
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        currently_working: experience.currently_working || false,
        description: experience.description
      });
    } else {
      setExperienceForm({
        company_name: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        currently_working: false,
        description: ''
      });
    }
    setExperienceDialogOpen(true);
  };

  const handleCloseExperienceDialog = () => {
    setExperienceDialogOpen(false);
  };

  const handleExperienceFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExperienceForm({
      ...experienceForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveExperience = async () => {
    try {
      setSaving(true);
      let edited = false;
      if (experienceForm.id) {

        // Update existing experience
        await updateUserExperience(experienceForm.id, experienceForm);
        edited = true;
      } else if (edited != true) {
        // Add new experience
        await addUserExperience(experienceForm);
      }

      // Refresh experiences
      const response = await getUserExperiences() || [];
      setExperiences(response.data.experiences);

      setSnackbar({
        open: true,
        message: 'Experience saved successfully',
        severity: 'success'
      });

      handleCloseExperienceDialog();
      edited = false;
      setSaving(false);
    } catch (error) {
      console.error('Error saving experience:', error);
      setSnackbar({
        open: true,
        message: 'Error saving experience',
        severity: 'error'
      });
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      setSaving(true);
      await deleteUserExperience(experienceId);

      setExperiences(experiences.filter(exp => exp.id !== experienceId));

      setSnackbar({
        open: true,
        message: 'Experience deleted successfully',
        severity: 'success'
      });

      setSaving(false);
    } catch (error) {
      console.error('Error deleting experience:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting experience',
        severity: 'error'
      });
      setSaving(false);
    }
  };

  // Education dialog handlers
  const handleOpenEducationDialog = (education = null) => {
    if (education) {
      setEducationForm({
        id: education.id,
        institution: education.institution,
        degree: education.degree,
        field: education.field,
        location: education.location,
        startDate: education.startDate,
        endDate: education.endDate || '',
        description: education.description
      });
    } else {
      setEducationForm({
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
    setEducationDialogOpen(true);
  };

  const handleCloseEducationDialog = () => {
    setEducationDialogOpen(false);
  };

  const handleEducationFormChange = (e) => {
    const { name, value } = e.target;
    setEducationForm({
      ...educationForm,
      [name]: value
    });
  };

  const handleSaveEducation = async () => {
    try {
      setSaving(true);

      if (educationForm.id) {
        // Update existing education
        await updateUserEducation(educationForm.id, educationForm);
      } else {
        // Add new education
        await addUserEducation(educationForm);
      }

      // Refresh education
      const response = await getUserEducation() || [];
      setEducation(response.data.educations || []);

      setSnackbar({
        open: true,
        message: 'Education saved successfully',
        severity: 'success'
      });

      handleCloseEducationDialog();
      setSaving(false);
    } catch (error) {
      console.error('Error saving education:', error);
      setSnackbar({
        open: true,
        message: 'Error saving education',
        severity: 'error'
      });
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (educationId) => {
    try {
      setSaving(true);
      await deleteUserEducation(educationId);

      setEducation(education.filter(edu => edu.id !== educationId));

      setSnackbar({
        open: true,
        message: 'Education deleted successfully',
        severity: 'success'
      });

      setSaving(false);
    } catch (error) {
      console.error('Error deleting education:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting education',
        severity: 'error'
      });
      setSaving(false);
    }
  };

  // Video handlers
  const handleDeleteVideo = async (videoId) => {
    try {
      setSaving(true);
      await deleteUserVideo(videoId);

      setVideos(videos.filter(video => video.id !== videoId));

      setSnackbar({
        open: true,
        message: 'Video deleted successfully',
        severity: 'success'
      });

      setSaving(false);
    } catch (error) {
      console.error('Error deleting video:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting video',
        severity: 'error'
      });
      setSaving(false);
    }
  };

  const handleUploadVideo = () => {
    // navigate('/video-upload');
    navigate('/jobseeker-tabs?group=profileContent&tab=video-upload');
  };

  const handleEditVideo = (videoId) => {
    // Navigate to the Video Editor tab inside the jobseeker tabs layout.
    // Include the videoId as a query param so the editor page can optionally pre-select it.
    navigate(`/jobseeker-tabs?group=videoManagement&tab=video-editor&videoId=${encodeURIComponent(videoId)}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return dayjs(dateString).format('MMM YYYY');
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold mb-1 ${themeColors.text.gradient}`}>Edit My Profile</h1>
          <p className="text-sm text-muted-foreground">Update your profile details, skills, experience and videos.</p>
        </div>

        <Button onClick={handleSaveProfile} className={`rounded-full px-4 ${themeColors.buttons.primary}`} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Avatar Section */}
          <Card className="mb-6">
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <div className="relative">
                <Avatar className="h-28 w-28">
                  {avatarPicture ? (
                    <AvatarImage src={avatarPicture} alt={`${profile.first_name} ${profile.last_name}`} />
                  ) : (
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white">
                      {`${(profile.first_name||'')?.charAt(0)}${(profile.last_name||'')?.charAt(0)}` || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>

                <input id="avatar-upload" accept="image/*" type="file" className="hidden" ref={fileInputRef} onChange={handleAvatarUpload} />
                <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2">
                  <Button size="icon" variant="outline" asChild>
                    <span>
                      <Camera className="h-4 w-4" />
                    </span>
                  </Button>
                </label>
              </div>

              <div className="text-center">
                <div className="text-xl font-semibold">{profile.first_name} {profile.last_name}</div>
                <div className="text-sm text-muted-foreground">{profile.title}</div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={tabValue} onValueChange={handleTabChange} className="space-y-4">
            <TabsList className="grid grid-cols-5 gap-2">
              <TabsTrigger value={0}>Basic Info</TabsTrigger>
              <TabsTrigger value={1}>Skills</TabsTrigger>
              <TabsTrigger value={2}>Experience</TabsTrigger>
              <TabsTrigger value={3}>Education</TabsTrigger>
              <TabsTrigger value={4}>Videos</TabsTrigger>
            </TabsList>

            {/* Basic Info */}
            <TabsContent value={0}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" name="first_name" value={profile.first_name || ''} onChange={handleProfileChange} />
                </div>

                <div>
                  <Label htmlFor="second_name">Second Name</Label>
                  <Input id="second_name" name="second_name" value={profile.second_name || ''} onChange={handleProfileChange} />
                </div>

                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" name="last_name" value={profile.last_name || ''} onChange={handleProfileChange} />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input id="title" name="title" value={profile.title || ''} onChange={handleProfileChange} />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="country_id">Country</Label>
                  <Select value={profile.country_id || ''} onValueChange={(val) => { setProfile({ ...profile, country_id: val, city_id: '' }); fetchCitiesForCountry(val); }}>
                    <SelectTrigger id="country_id">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {(countries || []).map(c => (
                        <SelectItem key={c.id || c.code || JSON.stringify(c.name)} value={c.id || c.code || ''}>{String(typeof c.name === 'string' ? c.name : (localize(c.name) || c.name?.en || c.code || c.id))}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="mt-2">
                    <Label htmlFor="city_id">City</Label>
                    <Select value={profile.city_id || ''} onValueChange={(val) => setProfile({ ...profile, city_id: val })}>
                      <SelectTrigger id="city_id">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {(cities || []).map(city => (
                          <SelectItem key={city.id || JSON.stringify(city.name)} value={city.id || ''}>{String(typeof city.name === 'string' ? city.name : (localize(city.name) || city.name?.en || city.name?.value || city.id))}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={profile.address || ''} onChange={handleProfileChange} placeholder="Street address" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferred_job_title">Preferred Job Title</Label>
                  <Input id="preferred_job_title" name="preferred_job_title" value={profile.preferred_job_title || ''} onChange={handleProfileChange} />
                </div>

                <div>
                  <Label htmlFor="current_job_title">Current Job Title</Label>
                  <Input id="current_job_title" name="current_job_title" value={profile.current_job_title || ''} onChange={handleProfileChange} />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={profile.bio || ''} onChange={handleProfileChange} rows={4} placeholder="Tell employers about yourself" />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={profile.email || ''} onChange={handleProfileChange} />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={profile.phone || ''} onChange={handleProfileChange} />
                </div>

                <div>
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input id="mobile" name="mobile" value={profile.mobile || ''} onChange={handleProfileChange} />
                </div>
                
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" value={profile.website || ''} onChange={handleProfileChange} />
                </div>

                <div>
                  <Label htmlFor="social.linkedin_url">LinkedIn URL</Label>
                  <Input id="social.linkedin_url" name="social.linkedin_url" value={profile.social?.linkedin_url || ''} onChange={handleProfileChange} />
                </div>
              </div>
            </TabsContent>

            {/* Skills */}
            <TabsContent value={1}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Skills</h3>
                <Button onClick={handleOpenSkillDialog} className={`rounded-full ${themeColors.buttons.secondary}`}>
                  <Plus className="h-4 w-4 mr-2" /> Add Skill
                </Button>
              </div>

              {skills.length === 0 ? (
                <div className="border-2 border-dashed rounded-md p-8 text-center text-muted-foreground">No skills added yet. Click &quot;Add Skill&quot; to showcase your expertise.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill.skill_id} className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-800 inline-flex items-center gap-2">
                      {renderSkillName(skill)}
                      <button onClick={() => handleDeleteSkill(skill.skill_id)} className="text-indigo-600"><Trash className="h-4 w-4" /></button>
                    </Badge>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Experience */}
            <TabsContent value={2}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Work Experience</h3>
                <Button onClick={() => handleOpenExperienceDialog()} className={`rounded-full ${themeColors.buttons.secondary}`}>
                  <Plus className="h-4 w-4 mr-2" /> Add Experience
                </Button>
              </div>

              {experiences.length === 0 ? (
                <div className="border-2 border-dashed rounded-md p-8 text-center text-muted-foreground">No work experience added yet. Click &quot;Add Experience&quot; to get started.</div>
              ) : (
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <Card key={exp.id} className="p-4">
                      <CardContent>
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">{exp.position}</div>
                            <div className="text-sm text-indigo-600">{exp.company_name}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(exp.start_date)} - {exp.currently_working ? 'Present' : formatDate(exp.end_date)}</div>
                            {exp.location && <div className="text-sm text-muted-foreground mt-1"><MapPin className="inline-block h-4 w-4 mr-1"/>{exp.location}</div>}
                          </div>
                          <div className="flex items-start gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleOpenExperienceDialog(exp)}><Edit className="h-4 w-4"/></Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteExperience(exp.id)}><Trash className="h-4 w-4 text-red-600"/></Button>
                          </div>
                        </div>
                        {exp.description && <div className="mt-2 text-sm text-muted-foreground">{exp.description}</div>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Education */}
            <TabsContent value={3}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Education</h3>
                <Button onClick={() => handleOpenEducationDialog()} className={`rounded-full ${themeColors.buttons.secondary}`}>
                  <Plus className="h-4 w-4 mr-2" /> Add Education
                </Button>
              </div>

              {education.length === 0 ? (
                <div className="border-2 border-dashed rounded-md p-8 text-center text-muted-foreground">No education added yet. Click &quot;Add Education&quot; to get started.</div>
              ) : (
                <div className="space-y-3">
                  {education.map((edu) => (
                    <Card key={edu.id} className="p-4">
                      <CardContent>
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">{edu.degree}</div>
                            <div className="text-sm text-indigo-600">{edu.institution}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}</div>
                            {edu.location && <div className="text-sm text-muted-foreground mt-1"><MapPin className="inline-block h-4 w-4 mr-1"/>{edu.location}</div>}
                          </div>
                          <div className="flex items-start gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleOpenEducationDialog(edu)}><Edit className="h-4 w-4"/></Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteEducation(edu.id)}><Trash className="h-4 w-4 text-red-600"/></Button>
                          </div>
                        </div>
                        {edu.description && <div className="mt-2 text-sm text-muted-foreground">{edu.description}</div>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Videos */}
            <TabsContent value={4}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Videos</h3>
                <Button onClick={handleUploadVideo} className={`rounded-full ${themeColors.buttons.secondary}`}>
                  <Video className="h-4 w-4 mr-2" /> Upload Video
                </Button>
              </div>

              {videos.length === 0 ? (
                <div className="border-2 border-dashed rounded-md p-8 text-center text-muted-foreground">No videos uploaded yet. Click &quot;Upload Video&quot; to add your first video.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="relative bg-black aspect-video">
                        <img src={video.thumbnail} alt={video.video_title} className="object-cover w-full h-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button size="icon" variant="ghost" className="bg-black/40 text-white"><Play className="h-6 w-6"/></Button>
                        </div>
                      </div>
                      <CardContent>
                        <div className="font-semibold">{video.video_title}</div>
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>{video.video_duration} sec</span>
                          <span>{video.views} views</span>
                        </div>
                      </CardContent>
                      <div className="flex justify-between p-3">
                        <Button size="sm" onClick={() => handleEditVideo(video.id)} className="">Edit</Button>
                        <Button size="sm" onClick={() => handleDeleteVideo(video.id)} className="text-red-600">Delete</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Skill Dialog */}
      <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>Select a skill to add to your profile.</DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <Label htmlFor="skill-search">Skill</Label>
            <Input
              id="skill-search"
              value={selectedSkillName}
              onChange={(e) => { setSelectedSkillName(e.target.value); setSelectedSkill(''); }}
              placeholder="Type to search or click a suggestion"
            />

            {/* Category filter */}
            {skillCategories.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                <button type="button" className={`px-2 py-1 text-xs rounded ${selectedCategory === null ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`} onClick={() => setSelectedCategory(null)}>All</button>
                {skillCategories.map(cat => (
                  <button key={cat} type="button" className={`px-2 py-1 text-xs rounded ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`} onClick={() => setSelectedCategory(cat)}>{cat}</button>
                ))}
              </div>
            )}

            <div className="max-h-40 overflow-auto border rounded bg-white mt-2">
              {(skillSearchLoading ? [] : (availableSkills || [])).filter(s => {
                if (!s) return false;
                // hide skills already added to the user's profile
                if (isSkillAlreadyAdded(s)) return false;

                const name = typeof s.name === 'string' ? s.name : (s.name?.en || s.name?.value || String(s.name || ''));
                // category filter: support category as string or object
                const catName = typeof s.category === 'string' ? s.category : (s.category?.name ?? s.group ?? s.rawCategory ?? null);
                if (selectedCategory && catName !== selectedCategory) return false;
                if (!selectedSkillName) return true;
                try {
                  return name.toLowerCase().includes(selectedSkillName.trim().toLowerCase());
                } catch (e) {
                  return String(name).toLowerCase().includes(selectedSkillName.trim().toLowerCase());
                }
              }).slice(0,50).map(s => (
                <div key={getSkillId(s) ?? renderSkillName(s)} className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm flex justify-between" onClick={() => { setSelectedSkill(getSkillId(s)); setSelectedSkillName(renderSkillName(s)); setSelectedCategory(typeof s.category === 'string' ? s.category : (s.category?.name ?? s.group ?? null)); }}>
                  <div>{renderSkillName(s)}</div>
                  { ((typeof s.category === 'string' ? s.category : (s.category?.name ?? s.group)) ) && <div className="text-xs text-gray-400">{typeof s.category === 'string' ? s.category : (s.category?.name ?? s.group)}</div> }
                </div>
              ))}
              {((availableSkills || []).filter(s => !isSkillAlreadyAdded(s)).length === 0) && !skillSearchLoading && (
                <div className="px-3 py-2 text-sm text-gray-500">No suggestions available</div>
              )}
            </div>

            {/* Level & Years inputs */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <Label htmlFor="skill-level">Level</Label>
                <Select value={selectedSkillLevel} onValueChange={(val) => setSelectedSkillLevel(val)}>
                  <SelectTrigger id="skill-level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="skill-years">Years of experience</Label>
                <Input id="skill-years" type="number" min={0} value={selectedSkillYears} onChange={(e) => setSelectedSkillYears(Number(e.target.value))} />
              </div>
            </div>

            {selectedSkillName && !selectedSkill && (
              <div className="text-xs text-yellow-600 mt-1">Please select a skill from the suggestions to enable saving.</div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseSkillDialog}>Cancel</Button>
            <Button onClick={handleSaveSkill} disabled={!selectedSkill || saving} className={themeColors.buttons.primary}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Experience Dialog */}
      <Dialog open={experienceDialogOpen} onOpenChange={setExperienceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{experienceForm.id ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 mt-2">
            <div>
              <Label>Company Name</Label>
              <Input name="company_name" value={experienceForm.company_name} onChange={handleExperienceFormChange} />
            </div>
            <div>
              <Label>Position</Label>
              <Input name="position" value={experienceForm.position} onChange={handleExperienceFormChange} />
            </div>
            <div>
              <Label>Location</Label>
              <Input name="location" value={experienceForm.location} onChange={handleExperienceFormChange} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date</Label>
                <Input name="start_date" type="date" value={experienceForm.start_date} onChange={handleExperienceFormChange} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input name="end_date" type="date" value={experienceForm.end_date} onChange={handleExperienceFormChange} disabled={experienceForm.currently_working} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="currently_working" type="checkbox" name="currently_working" checked={experienceForm.currently_working} onChange={handleExperienceFormChange} />
              <label htmlFor="currently_working">I currently work here</label>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea name="description" rows={4} value={experienceForm.description} onChange={handleExperienceFormChange} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseExperienceDialog}>Cancel</Button>
            <Button onClick={handleSaveExperience} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Education Dialog */}
      <Dialog open={educationDialogOpen} onOpenChange={setEducationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{educationForm.id ? 'Edit Education' : 'Add Education'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 mt-2">
            <div>
              <Label>Institution</Label>
              <Input name="institution" value={educationForm.institution} onChange={handleEducationFormChange} />
            </div>
            <div>
              <Label>Degree</Label>
              <Input name="degree" value={educationForm.degree} onChange={handleEducationFormChange} />
            </div>
            <div>
              <Label>Field of Study</Label>
              <Input name="field" value={educationForm.field} onChange={handleEducationFormChange} />
            </div>
            <div>
              <Label>Location</Label>
              <Input name="location" value={educationForm.location} onChange={handleEducationFormChange} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date</Label>
                <Input name="startDate" type="date" value={educationForm.startDate} onChange={handleEducationFormChange} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input name="endDate" type="date" value={educationForm.endDate} onChange={handleEducationFormChange} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea name="description" rows={4} value={educationForm.description} onChange={handleEducationFormChange} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseEducationDialog}>Cancel</Button>
            <Button onClick={handleSaveEducation} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Snackbar / toast fallback - we keep the existing snackbar state but use toast hook for nicer UI elsewhere */}
      {snackbar.open && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-md ${snackbar.severity === 'success' ? 'bg-green-600 text-white' : snackbar.severity === 'error' ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'}`}>
          {snackbar.message}
          <button onClick={handleCloseSnackbar} className="ml-3"><X className="inline-block h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
};

export default EditJobSeekerProfile;