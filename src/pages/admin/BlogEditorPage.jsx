import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Tag as TagIcon,
  Folder,
  Image as ImageIcon,
  Briefcase,
  Award,
  Users,
  BarChart,
  Settings,
  X
} from 'lucide-react';
import { Button } from '../../components/UI/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/UI/card';
import { Input } from '../../components/UI/input';
import { Label } from '../../components/UI/label';
import { Textarea } from '../../components/UI/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/UI/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/UI/tabs';
import { Badge } from '../../components/UI/badge';
import { Switch } from '../../components/UI/switch';
import { Separator } from '../../components/UI/separator';
import { 
  getBlog, 
  createBlog, 
  updateBlog, 
  getBlogCategories, 
  getBlogTags, 
  createBlogTag
} from '../../services/api';
import TagSelector from '../../components/admin/TagSelector';
import themeColors from '@/config/theme-colors-admin';

const BlogEditorPageEnhanced = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const blogId = searchParams.get('id');

  // Language state
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  // Form data for all languages
  const [formData, setFormData] = useState({
    // English
    title: '',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    
    // Arabic
    titleAr: '',
    contentAr: '',
    excerptAr: '',
    metaTitleAr: '',
    metaDescriptionAr: '',
    
    // Chinese
    titleZh: '',
    contentZh: '',
    excerptZh: '',
    metaTitleZh: '',
    metaDescriptionZh: '',
    
    // Common fields
    featuredImage: '',
    categoryId: '',
    tagInput: '',
    selectedTags: [],
    status: 'draft',
    language: 'en',
    featured: false,
    metaKeywords: [],
    keywordInput: '',
    
    // Job-related
    relatedJobTitles: [],
    jobTitleInput: '',
    relatedSkills: [],
    skillInput: '',
    targetAudience: [],
    experienceLevel: '',
    
    // SEO
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: ''
  });

  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchCategories = async () => {
    try {
      const response = await getBlogCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await getBlogTags(100);
      setAvailableTags(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await getBlog(blogId);
      const blog = response.data;
      
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        
        titleAr: blog.titleAr || '',
        contentAr: blog.contentAr || '',
        excerptAr: blog.excerptAr || '',
        metaTitleAr: blog.metaTitleAr || '',
        metaDescriptionAr: blog.metaDescriptionAr || '',
        
        titleZh: blog.titleZh || '',
        contentZh: blog.contentZh || '',
        excerptZh: blog.excerptZh || '',
        metaTitleZh: blog.metaTitleZh || '',
        metaDescriptionZh: blog.metaDescriptionZh || '',
        
        featuredImage: blog.featuredImage || '',
        categoryId: blog.categoryId || '',
        selectedTags: blog.blogTags?.map(bt => bt.tag.name) || [],
        status: blog.status || 'draft',
        language: blog.language || 'en',
        featured: blog.featured || false,
        metaKeywords: blog.metaKeywords || [],
        
        relatedJobTitles: blog.relatedJobTitles || [],
        relatedSkills: blog.relatedSkills || [],
        targetAudience: blog.targetAudience || [],
        experienceLevel: blog.experienceLevel || '',
        
        canonicalUrl: blog.canonicalUrl || '',
        ogTitle: blog.socialMedia?.ogTitle || '',
        ogDescription: blog.socialMedia?.ogDescription || '',
        ogImage: blog.socialMedia?.ogImage || '',
        twitterTitle: blog.socialMedia?.twitterTitle || '',
        twitterDescription: blog.socialMedia?.twitterDescription || '',
        twitterImage: blog.socialMedia?.twitterImage || '',
        
        tagInput: '',
        keywordInput: '',
        jobTitleInput: '',
        skillInput: ''
      });
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      alert('Failed to load blog post');
      navigate('/admin-tabs?group=blog&tab=blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    if (formData.tagInput.trim() && !formData.selectedTags.includes(formData.tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        selectedTags: [...prev.selectedTags, prev.tagInput.trim()],
        tagInput: ''
      }));
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.filter(t => t !== tag)
    }));
  };

  const addKeyword = () => {
    if (formData.keywordInput.trim() && !formData.metaKeywords.includes(formData.keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, prev.keywordInput.trim()],
        keywordInput: ''
      }));
    }
  };

  const toggleTag = (tagName) => {
    setFormData(prev => {
      const exists = prev.selectedTags.includes(tagName);
      return {
        ...prev,
        selectedTags: exists ? prev.selectedTags.filter(t => t !== tagName) : [...prev.selectedTags, tagName]
      };
    });
  };

  const createNewTag = async (tagName) => {
    try {
      const payload = { name: tagName };
      const response = await createBlogTag(payload);
      const created = response?.data || { id: Date.now(), name: tagName };
      // Add to availableTags and select it
      setAvailableTags(prev => [created, ...prev.filter(t => t.name !== created.name)]);
      setFormData(prev => ({ ...prev, selectedTags: Array.from(new Set([...(prev.selectedTags || []), created.name])) }));
    } catch (error) {
      console.error('Failed to create tag:', error);
      alert('Failed to create tag');
    }
  };

  const removeKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter(k => k !== keyword)
    }));
  };

  const addJobTitle = () => {
    if (formData.jobTitleInput.trim() && !formData.relatedJobTitles.includes(formData.jobTitleInput.trim())) {
      setFormData(prev => ({
        ...prev,
        relatedJobTitles: [...prev.relatedJobTitles, prev.jobTitleInput.trim()],
        jobTitleInput: ''
      }));
    }
  };

  const removeJobTitle = (title) => {
    setFormData(prev => ({
      ...prev,
      relatedJobTitles: prev.relatedJobTitles.filter(t => t !== title)
    }));
  };

  const addSkill = () => {
    if (formData.skillInput.trim() && !formData.relatedSkills.includes(formData.skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        relatedSkills: [...prev.relatedSkills, prev.skillInput.trim()],
        skillInput: ''
      }));
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      relatedSkills: prev.relatedSkills.filter(s => s !== skill)
    }));
  };

  const toggleTargetAudience = (audience) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter(a => a !== audience)
        : [...prev.targetAudience, audience]
    }));
  };

  const handleSubmit = async (status = formData.status) => {
    try {
      setSaving(true);
      
      const payload = {
        title: formData.title,
        titleAr: formData.titleAr,
        titleZh: formData.titleZh,
        content: formData.content,
        contentAr: formData.contentAr,
        contentZh: formData.contentZh,
        excerpt: formData.excerpt,
        excerptAr: formData.excerptAr,
        excerptZh: formData.excerptZh,
        featuredImage: formData.featuredImage,
        categoryId: formData.categoryId || null,
        tags: formData.selectedTags,
        status,
        language: formData.language,
        metaTitle: formData.metaTitle,
        metaTitleAr: formData.metaTitleAr,
        metaTitleZh: formData.metaTitleZh,
        metaDescription: formData.metaDescription,
        metaDescriptionAr: formData.metaDescriptionAr,
        metaDescriptionZh: formData.metaDescriptionZh,
        metaKeywords: formData.metaKeywords,
        featured: formData.featured,
        relatedJobTitles: formData.relatedJobTitles,
        relatedSkills: formData.relatedSkills,
        targetAudience: formData.targetAudience,
        experienceLevel: formData.experienceLevel || null,
        canonicalUrl: formData.canonicalUrl || null,
        socialMedia: {
          ogTitle: formData.ogTitle || null,
          ogDescription: formData.ogDescription || null,
          ogImage: formData.ogImage || null,
          twitterTitle: formData.twitterTitle || null,
          twitterDescription: formData.twitterDescription || null,
          twitterImage: formData.twitterImage || null,
        }
      };

      if (blogId) {
        await updateBlog(blogId, payload);
      } else {
        await createBlog(payload);
      }

      navigate('/admin-tabs?group=blog&tab=blogs');
    } catch (error) {
      console.error('Failed to save blog:', error);
      alert(error?.response?.data?.message || 'Failed to save blog post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  // Get field names based on current language
  const getTitleField = () => currentLanguage === 'ar' ? 'titleAr' : currentLanguage === 'zh' ? 'titleZh' : 'title';
  const getContentField = () => currentLanguage === 'ar' ? 'contentAr' : currentLanguage === 'zh' ? 'contentZh' : 'content';
  const getExcerptField = () => currentLanguage === 'ar' ? 'excerptAr' : currentLanguage === 'zh' ? 'excerptZh' : 'excerpt';
  const getMetaTitleField = () => currentLanguage === 'ar' ? 'metaTitleAr' : currentLanguage === 'zh' ? 'metaTitleZh' : 'metaTitle';
  const getMetaDescField = () => currentLanguage === 'ar' ? 'metaDescriptionAr' : currentLanguage === 'zh' ? 'metaDescriptionZh' : 'metaDescription';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin-tabs?group=blog&tab=blogs')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>
              {blogId ? 'Edit Blog Post' : 'Create New Post'}
            </h2>
            <p className={themeColors.text.secondary}>
              {blogId ? 'Update your blog post' : 'Write and publish a new blog post'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />{i18n.t('auto_save_draft')}</Button>
          <Button
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className={`${themeColors.buttons.primary} text-white`}
          >
            <Eye className="mr-2 h-4 w-4" />
            {saving ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="md:col-span-2 space-y-6">
          {/* Language Tabs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle>{i18n.t('auto_content')}</CardTitle>
                </div>
                <Tabs value={currentLanguage} onValueChange={setCurrentLanguage}>
                  <TabsList>
                    <TabsTrigger value="en" className={currentLanguage === 'en' ? 'bg-blue-100' : ''}>{i18n.t('auto_english')}</TabsTrigger>
                    <TabsTrigger value="ar" className={currentLanguage === 'ar' ? 'bg-blue-100' : ''}>
                      العربية
                    </TabsTrigger>
                    <TabsTrigger value="zh" className={currentLanguage === 'zh' ? 'bg-blue-100' : ''}>
                      中文
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>
                Content for {currentLanguage === 'en' ? 'English' : currentLanguage === 'ar' ? 'Arabic' : 'Chinese'}
                {currentLanguage !== 'en' && ' (Optional - Falls back to English if empty)'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={getTitleField()}>
                  Title *
                  {currentLanguage !== 'en' && formData[getTitleField()] && (
                    <Badge variant="outline" className="ml-2 bg-green-50">{i18n.t('auto_connected')}</Badge>
                  )}
                </Label>
                <Input
                  id={getTitleField()}
                  value={formData[getTitleField()]}
                  onChange={(e) => handleChange(getTitleField(), e.target.value)}
                  placeholder={`Enter post title in ${currentLanguage === 'en' ? 'English' : currentLanguage === 'ar' ? 'Arabic' : 'Chinese'}...`}
                  className="mt-1"
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <Label htmlFor={getExcerptField()}>
                  Excerpt
                  {currentLanguage !== 'en' && formData[getExcerptField()] && (
                    <Badge variant="outline" className="ml-2 bg-green-50">{i18n.t('auto_connected')}</Badge>
                  )}
                </Label>
                <Textarea
                  id={getExcerptField()}
                  value={formData[getExcerptField()]}
                  onChange={(e) => handleChange(getExcerptField(), e.target.value)}
                  placeholder={i18n.t('auto_brief_description')} 
                  rows={3}
                  className="mt-1"
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <Label htmlFor={getContentField()}>
                  Content *
                  {currentLanguage !== 'en' && formData[getContentField()] && (
                    <Badge variant="outline" className="ml-2 bg-green-50">{i18n.t('auto_connected')}</Badge>
                  )}
                </Label>
                <Textarea
                  id={getContentField()}
                  value={formData[getContentField()]}
                  onChange={(e) => handleChange(getContentField(), e.target.value)}
                  placeholder={i18n.t('auto_write_your_blog_post_content_here_markdo')} 
                  rows={15}
                  className="mt-1 font-mono text-sm"
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
                <p className="text-xs text-gray-500 mt-1">{i18n.t('auto_supports_markdown_formatting')}</p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings with Language Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>{i18n.t('auto_seo_settings')}</CardTitle>
              <CardDescription>Optimize for search engines in {currentLanguage === 'en' ? 'English' : currentLanguage === 'ar' ? 'Arabic' : 'Chinese'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={getMetaTitleField()}>
                  Meta Title
                  {currentLanguage !== 'en' && formData[getMetaTitleField()] && (
                    <Badge variant="outline" className="ml-2 bg-green-50">{i18n.t('auto_connected')}</Badge>
                  )}
                </Label>
                <Input
                  id={getMetaTitleField()}
                  value={formData[getMetaTitleField()]}
                  onChange={(e) => handleChange(getMetaTitleField(), e.target.value)}
                  placeholder={i18n.t('auto_seo_title_defaults_to_post_title')} 
                  className="mt-1"
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <Label htmlFor={getMetaDescField()}>
                  Meta Description
                  {currentLanguage !== 'en' && formData[getMetaDescField()] && (
                    <Badge variant="outline" className="ml-2 bg-green-50">{i18n.t('auto_connected')}</Badge>
                  )}
                </Label>
                <Textarea
                  id={getMetaDescField()}
                  value={formData[getMetaDescField()]}
                  onChange={(e) => handleChange(getMetaDescField(), e.target.value)}
                  placeholder={i18n.t('auto_seo_description_defaults_to_excerpt')} 
                  rows={3}
                  className="mt-1"
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              {currentLanguage === 'en' && (
                <>
                  <div>
                    <Label htmlFor="metaKeywords">{i18n.t('auto_meta_keywords')}</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="metaKeywords"
                        value={formData.keywordInput}
                        onChange={(e) => handleChange('keywordInput', e.target.value)}
                        placeholder={i18n.t('auto_add_keyword_and_press_enter')} 
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      />
                      <Button type="button" onClick={addKeyword}>{i18n.t('auto_add')}</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.metaKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {keyword}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="canonicalUrl">{i18n.t('auto_canonical_url')}</Label>
                    <Input
                      id="canonicalUrl"
                      value={formData.canonicalUrl}
                      onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                      placeholder={i18n.t('auto_https_example_com_canonical_url')} 
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Career-Related Fields */}
          {currentLanguage === 'en' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <CardTitle>{i18n.t('auto_career_information')}</CardTitle>
                </div>
                <CardDescription>{i18n.t('auto_link_this_post_to_jobs_and_skills')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="relatedJobTitles">{i18n.t('auto_related_job_titles')}</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="relatedJobTitles"
                      value={formData.jobTitleInput}
                      onChange={(e) => handleChange('jobTitleInput', e.target.value)}
                      placeholder={i18n.t('auto_add_job_title')} 
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addJobTitle())}
                    />
                    <Button type="button" onClick={addJobTitle}>{i18n.t('auto_add')}</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.relatedJobTitles.map((title, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        {title}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeJobTitle(title)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="relatedSkills">{i18n.t('auto_related_skills')}</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="relatedSkills"
                      value={formData.skillInput}
                      onChange={(e) => handleChange('skillInput', e.target.value)}
                      placeholder={i18n.t('auto_add_skill')} 
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill}>{i18n.t('auto_add')}</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.relatedSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {skill}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>{i18n.t('auto_target_audience')}</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['job_seekers', 'employers', 'both'].map((audience) => (
                      <Badge
                        key={audience}
                        variant={formData.targetAudience.includes(audience) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleTargetAudience(audience)}
                      >
                        {audience.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="experienceLevel">{i18n.t('auto_experience_level')}</Label>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(value) => handleChange('experienceLevel', value === '__none' ? '' : value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={i18n.t('auto_select_level')}  />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">{i18n.t('auto_none')}</SelectItem>
                      <SelectItem value="entry">{i18n.t('auto_entry_level')}</SelectItem>
                      <SelectItem value="junior">{i18n.t('auto_junior')}</SelectItem>
                      <SelectItem value="mid">{i18n.t('auto_mid_level')}</SelectItem>
                      <SelectItem value="senior">{i18n.t('auto_senior')}</SelectItem>
                      <SelectItem value="executive">{i18n.t('auto_executive')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Media Settings */}
          {currentLanguage === 'en' && (
            <Card>
              <CardHeader>
                <CardTitle>{i18n.t('auto_social_media_preview')}</CardTitle>
                <CardDescription>{i18n.t('auto_customize_how_your_post_appears_on_socia')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{i18n.t('auto_open_graph_facebook_linkedin')}</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder={i18n.t('auto_og_title')} 
                      value={formData.ogTitle}
                      onChange={(e) => handleChange('ogTitle', e.target.value)}
                    />
                    <Textarea
                      placeholder={i18n.t('auto_og_description')} 
                      value={formData.ogDescription}
                      onChange={(e) => handleChange('ogDescription', e.target.value)}
                      rows={2}
                    />
                    <Input
                      placeholder={i18n.t('auto_og_image_url')} 
                      value={formData.ogImage}
                      onChange={(e) => handleChange('ogImage', e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">{i18n.t('auto_twitter_card')}</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder={i18n.t('auto_twitter_title')} 
                      value={formData.twitterTitle}
                      onChange={(e) => handleChange('twitterTitle', e.target.value)}
                    />
                    <Textarea
                      placeholder={i18n.t('auto_twitter_description')} 
                      value={formData.twitterDescription}
                      onChange={(e) => handleChange('twitterDescription', e.target.value)}
                      rows={2}
                    />
                    <Input
                      placeholder={i18n.t('auto_twitter_image_url')} 
                      value={formData.twitterImage}
                      onChange={(e) => handleChange('twitterImage', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <CardTitle>{i18n.t('auto_settings')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">{i18n.t('auto_status')}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{i18n.t('auto_draft')}</SelectItem>
                    <SelectItem value="published">{i18n.t('auto_published')}</SelectItem>
                    <SelectItem value="archived">{i18n.t('auto_archived')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">{i18n.t('auto_primary_language')}</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleChange('language', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{i18n.t('auto_english')}</SelectItem>
                    <SelectItem value="ar">{i18n.t('auto_arabic')}</SelectItem>
                    <SelectItem value="zh">{i18n.t('auto_chinese')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">{i18n.t('auto_featured_post')}</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleChange('featured', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                <CardTitle>{i18n.t('auto_category')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleChange('categoryId', value === '__none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={i18n.t('auto_select_category')}  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">{i18n.t('auto_none')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TagIcon className="h-5 w-5" />
                <CardTitle>{i18n.t('auto_tags')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(value) => handleChange('experienceLevel', value === '__none' ? '' : value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={i18n.t('auto_select_level')}  />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">{i18n.t('auto_none')}</SelectItem>
                      <SelectItem value="entry">{i18n.t('auto_entry_level')}</SelectItem>
                      <SelectItem value="junior">{i18n.t('auto_junior')}</SelectItem>
                      <SelectItem value="mid">{i18n.t('auto_mid_level')}</SelectItem>
                      <SelectItem value="senior">{i18n.t('auto_senior')}</SelectItem>
                      <SelectItem value="executive">{i18n.t('auto_executive')}</SelectItem>
                    </SelectContent>
                  </Select>
              </div>

              {availableTags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Popular Tags:</p>
                    <TagSelector availableTags={availableTags} selectedTags={formData.selectedTags} onToggleTag={toggleTag} onAddTag={createNewTag} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <CardTitle>{i18n.t('auto_featured_image')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="featuredImage">{i18n.t('auto_image_url')}</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => handleChange('featuredImage', e.target.value)}
                  placeholder={i18n.t('auto_https_example_com_image_jpg')} 
                  className="mt-1"
                />
              </div>
              {formData.featuredImage && (
                <div className="mt-3">
                  <img
                    src={formData.featuredImage}
                    alt={i18n.t('auto_featured')} 
                    className="w-full h-40 object-cover rounded-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogEditorPageEnhanced;
