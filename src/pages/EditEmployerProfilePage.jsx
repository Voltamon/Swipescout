import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getEmployerProfile,
  updateEmployerProfile,
  uploadCompanyLogo,
  getEmployerCategories,
  addEmployerCategory,
  deleteEmployerCategory,
  getCategories,
  createEmployerProfile
} from '@/services/api';
import i18n from 'i18next';

// shadcn/ui components
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Textarea } from '@/components/UI/textarea';
import { Badge } from '@/components/UI/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { getEmployerProfileCompleteness } from '@/utils/profile';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  Camera,
  Save,
  Plus,
  X,
  Check,
  Linkedin,
  Facebook,
  Twitter,
  Eye,
  Loader2
} from 'lucide-react';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function EditEmployerProfilePage() {
  const { t } = useTranslation(['employerProfile', 'employerTabs', 'common']);
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    industry: '',
    location: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    logo: null,
    establish_year: null,
    size: '',
    social: {
      linkedin: '',
      facebook: '',
      twitter: ''
    }
  });

  const [companyLogoPicture, setCompanyLogoPicture] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessageVisible, setSavedMessageVisible] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [companyVideos, setCompanyVideos] = useState([]);

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

  // Helper: support multilingual `name` values that may be either a string or a translations object
  const getLocalizedText = (text, defaultValue = 'Unknown') => {
    if (!text) return defaultValue;
    if (typeof text === 'string') return text;
    if (typeof text === 'object') {
      return text.en || text.ar || text.zh || Object.values(text)[0] || defaultValue;
    }
    return defaultValue;
  };

  const createStarterProfile = async () => {
    setSaving(true);
    try {
      await createEmployerProfile({
        name: ' ',
        industry: ' '
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setProfileCompleteness(getEmployerProfileCompleteness(profile));
  }, [profile]);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        setLoading(true);
        
        let profileResponse;
        try {
          profileResponse = await getEmployerProfile();
        } catch (error) {
          if (error.status === 404) {
            try {
              await createStarterProfile();
              profileResponse = await getEmployerProfile();
              toast({
                title: t('employerProfile:save') || "Profile Created",
                description: t('employerProfile:savedMessage') || "Starter profile created successfully",
                variant: 'success',
              });
            } catch (error) {
              toast({
                title: t('employerProfile:error') || "Error",
                description: t('employerProfile:error_create') || "Failed to create starter profile",
                variant: "destructive",
              });
              return;
            }
          } else {
            throw error;
          }
        }

        const [categoriesResponse, allCategoriesResponse] = await Promise.all([
          getEmployerCategories(),
          getCategories()
        ]);

        const employerData = profileResponse.data;
        setProfile({
          name: employerData.name || '',
          industry: employerData.industry || '',
          location: employerData.location || '',
          description: employerData.description || '',
          email: employerData.email || '',
          phone: employerData.phone || '',
          website: employerData.website || '',
          logo: employerData.logo || null,
          establish_year: employerData.establish_year || null,
          size: employerData.size || '',
          social: employerData.social || {
            linkedin: '',
            facebook: '',
            twitter: ''
          }
        ,
          id: employerData.id || null,
          userId: employerData.userId || employerData.user?.id || null,
        });

        // Save returned videos (if provided) for post-job checks / preview
        const vids = profileResponse.data?.videos || [];
        setCompanyVideos(vids || []);
        setProfileCompleteness(getEmployerProfileCompleteness(profileResponse.data));

        const companyCategoryIds = categoriesResponse.data?.categories?.map(c => c.id) || [];
        const filteredAvailableCategories = allCategoriesResponse.data?.categories?.filter(
          cat => !companyCategoryIds.includes(cat.id)
        ) || [];

        setCategories(categoriesResponse.data?.categories || []);
        setAvailableCategories(filteredAvailableCategories);

        if (employerData.logo) {
          const logoUrl = `${VITE_API_BASE_URL}${employerData.logo}?t=${Date.now()}`;
          try {
            await verifyImageAvailability(logoUrl);
            setCompanyLogoPicture(logoUrl);
          } catch (error) {
            console.error('Company logo image not available:', error);
            setCompanyLogoPicture('');
          }
        }
      } catch (error) {
        console.error('Error fetching employer data:', error);
        toast({
          title: t('employerProfile:error') || "Error",
          description: t('employerProfile:loadError') || "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployerData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile({
        ...profile,
        [parent]: {
          ...profile[parent],
          [child]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updateEmployerProfile(profile);
      console.log('Profile updated successfully - showing toast');
      toast({
        title: t('employerProfile:save') || "Success",
        description: t('employerProfile:savedMessage') || "Profile updated successfully",
        variant: 'success',
      });
      setSavedMessageVisible(true);
      setTimeout(() => setSavedMessageVisible(false), 3500);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('employerProfile:error'),
        description: t('employerProfile:updateError') || 'Failed to update profile',
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewClick = () => {
    const hasProfile = profileCompleteness?.isComplete || false;
    if (!hasProfile) {
      setPreviewDialogOpen(true);
      return;
    }
    const id = profile?.id || profile?.userId || profile?.user?.id;
    if (!id) return;
    window.open(`/employer-profile/${id}`, '_blank');
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append('logo', file);

      const tempPreviewUrl = URL.createObjectURL(file);
      setCompanyLogoPicture(tempPreviewUrl);

      const response = await uploadCompanyLogo(formData);
      const serverUrl = `${VITE_API_BASE_URL}${response.data.logo_url}?t=${Date.now()}`;

      let loaded = false;
      for (let i = 0; i < 3; i++) {
        try {
          await verifyImageAvailability(serverUrl);
          loaded = true;
          break;
        } catch {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (loaded) {
        setProfile(prev => ({ ...prev, logo: response.data.logo_url }));
        setCompanyLogoPicture(serverUrl);
        toast({
          title: t('employerProfile:save') || "Success",
          description: t('employerProfile:logoUpdated') || "Company logo updated!",
          variant: 'success',
        });
      } else {
        toast({
          title: "Uploaded",
          description: t('employerProfile:uploadRefresh') || "Refresh to see changes.",
        });
      }

      URL.revokeObjectURL(tempPreviewUrl);
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: t('employerProfile:error') || "Error",
        description: t('employerProfile:uploadFailed') || "Upload failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      setSaving(true);
      await addEmployerCategory(selectedCategory);
      
      const addedCategory = availableCategories.find(cat => String(cat.id) === String(selectedCategory));
      
      if (addedCategory) {
        setCategories([...categories, addedCategory]);
        setAvailableCategories(availableCategories.filter(cat => String(cat.id) !== String(selectedCategory)));
      }
      
      toast({
        title: t('employerProfile:save') || "Success",
        description: t('employerProfile:categoryAdded') || "Category added successfully",
        variant: 'success',
      });
      setSelectedCategory('');
      setCategoryDialogOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to add category';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setSaving(true);
      await deleteEmployerCategory(categoryId);
      
      setCategories(categories.filter(cat => cat.id !== categoryId));
      
      const deletedCategory = categories.find(cat => cat.id === categoryId);
      if (deletedCategory) {
        setAvailableCategories([...availableCategories, deletedCategory]);
      }
      
      toast({
        title: t('employerProfile:save') || "Success",
        description: t('employerProfile:categoryRemoved') || "Category removed successfully",
        variant: 'success',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to remove category';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600" />
          <p className="mt-4 text-slate-600">{t('employerProfile:loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('employerProfile:title')}</h1>
            <p className="text-slate-600 mt-1">{t('employerProfile:subtitle')}</p>
          </div>
          {savedMessageVisible && (
            <div className="ml-4 px-4 py-2 rounded-md bg-green-50 border border-green-200 text-green-800">
              {t('employerProfile:savedMessage')}
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button
              onClick={handlePreviewClick}
              variant="outline"
              disabled={saving}
              size="lg"
              className="hidden md:inline-flex items-center"
            >
              <Eye className="mr-2 h-4 w-4" />
              {t('employerProfile:preview')}
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('employerProfile:saving') || 'Saving...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('employerProfile:save')}
              </>
            )}
            </Button>
          </div>
        </div>

        {/* Logo Section */}
        <Card className="mb-6 border-slate-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-indigo-500">
                  <AvatarImage src={companyLogoPicture} alt={profile.name} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl">
                    {profile.name?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">{profile.name || 'Company Name'}</h2>
              <p className="text-slate-600">{profile.industry || 'Industry'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200 p-1">
            <TabsTrigger value="details" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Building2 className="h-4 w-4 mr-2" />{i18n.t('auto_company_details')}</TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Briefcase className="h-4 w-4 mr-2" />{i18n.t('auto_categories')}</TabsTrigger>
          </TabsList>

          {/* Company Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />{i18n.t('auto_basic_information')}</CardTitle>
                <CardDescription>{i18n.t('auto_core_details_about_your_company')}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-indigo-600" />
                      Company Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name || ''}
                      onChange={handleProfileChange}
                      placeholder={i18n.t('auto_enter_company_name')} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-indigo-600" />
                      Industry *
                    </Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={profile.industry || ''}
                      onChange={handleProfileChange}
                      placeholder={i18n.t('auto_e_g_technology_finance')} 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-600" />{i18n.t('auto_location')}</Label>
                  <Input
                    id="location"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleProfileChange}
                    placeholder={i18n.t('auto_city_country')} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-indigo-600" />{i18n.t('auto_description')}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={profile.description || ''}
                    onChange={handleProfileChange}
                    placeholder={i18n.t('auto_tell_job_seekers_about_your_company_and_')} 
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-indigo-600" />{i18n.t('auto_contact_information')}</CardTitle>
                <CardDescription>{i18n.t('auto_how_job_seekers_can_reach_you')}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-indigo-600" />{i18n.t('auto_email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email || ''}
                      onChange={handleProfileChange}
                      placeholder={i18n.t('auto_contact_company_com')} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-indigo-600" />{i18n.t('auto_phone')}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleProfileChange}
                      placeholder={i18n.t('auto_1_555_000_0000')} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-indigo-600" />{i18n.t('auto_website')}</Label>
                  <Input
                    id="website"
                    name="website"
                    value={profile.website || ''}
                    onChange={handleProfileChange}
                    placeholder={i18n.t('auto_https_www_yourcompany_com')} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="establish_year" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-600" />{i18n.t('auto_founded_year')}</Label>
                    <Input
                      id="establish_year"
                      name="establish_year"
                      type="number"
                      value={profile.establish_year || ''}
                      onChange={handleProfileChange}
                      placeholder={i18n.t('auto_2020')} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-indigo-600" />{i18n.t('auto_company_size')}</Label>
                    <Input
                      id="size"
                      name="size"
                      value={profile.size || ''}
                      onChange={handleProfileChange}
                      placeholder={i18n.t('auto_1_50_51_200_200')} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle>{i18n.t('auto_social_media')}</CardTitle>
                <CardDescription>{i18n.t('auto_your_company_s_social_media_presence')}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-600" />{i18n.t('auto_linkedin')}</Label>
                    <Input
                      id="linkedin"
                      name="social.linkedin"
                      value={profile.social?.linkedin || ''}
                      onChange={handleProfileChange}
                      placeholder={i18n.t('auto_linkedin_url')} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-500" />{i18n.t('auto_facebook')}</Label>
                    <Input
                      id="facebook"
                      name="social.facebook"
                      value={profile.social?.facebook || ''}
                      onChange={handleProfileChange}
                      placeholder={i18n.t('auto_facebook_url')} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-sky-500" />{i18n.t('auto_twitter')}</Label>
                    <Input
                      id="twitter"
                      name="social.twitter"
                      value={profile.social?.twitter || ''}
                      onChange={handleProfileChange}
                      placeholder={i18n.t('auto_twitter_url')} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-indigo-600" />{i18n.t('auto_company_categories')}</CardTitle>
                    <CardDescription>{i18n.t('auto_select_categories_that_describe_your_bus')}</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      if (availableCategories?.length > 0) setSelectedCategory(String(availableCategories[0].id));
                      setCategoryDialogOpen(true);
                    }}
                    disabled={availableCategories.length === 0}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />{i18n.t('auto_add_category')}</Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                  {categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-900 hover:from-indigo-200 hover:to-purple-200"
                        >
                        {getLocalizedText(category.name)}
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>{t('employerProfile:noCategories')}</p>
                    <p className="text-sm mt-1">{t('employerProfile:noCategoriesDesc')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Category Dialog */}
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{i18n.t('auto_add_category_to_company')}</DialogTitle>
              <DialogDescription>
                {availableCategories.length === 0 
                  ? t('employerProfile:noMoreCategories') 
                  : t('employerProfile:selectCategory')}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="category-select">{i18n.t('auto_available_categories')}</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={i18n.t('auto_select_a_category')}  />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {getLocalizedText(cat.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                {t('employerProfile:cancel')}
              </Button>
              <Button 
                onClick={handleSaveCategory} 
                disabled={saving || !selectedCategory}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('employerProfile:saving') || 'Adding...'}
                  </>
                ) : (
                  t('employerProfile:addCategoryButton')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Preview dialog for incomplete employer profile */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('employerProfile:previewTitle')}</DialogTitle>
              <DialogDescription>
                {t('employerProfile:previewDescription')}
              </DialogDescription>
              <div className="mt-4">
                {profileCompleteness ? (
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      {profileCompleteness.name ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
                      <span>{i18n.t('auto_company_name_required')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {profileCompleteness.description ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
                      <span>{i18n.t('auto_company_description_min_10_characters')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {profileCompleteness.logo ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
                      <span>{i18n.t('auto_company_logo')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {profileCompleteness.website ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
                      <span>{i18n.t('auto_website')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {profileCompleteness.social ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
                      <span>Social link (LinkedIn / Facebook / Twitter)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {profileCompleteness.contact ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
                      <span>{i18n.t('auto_contact_email_or_phone')}</span>
                    </li>
                  </ul>
                ) : (
                  <div className="text-sm">{t('employerProfile:noProfileInfo') || 'No profile information found — please provide a company name and at least one additional detail.'}</div>
                )}
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => { setPreviewDialogOpen(false); navigate('/employer-tabs?group=companyContent&tab=edit-employer-profile'); }} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                {t('employerProfile:createEditProfile')}
              </Button>
              <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                {t('employerProfile:cancel')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
