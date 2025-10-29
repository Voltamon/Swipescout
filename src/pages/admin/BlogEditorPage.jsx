import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Textarea } from '@/components/UI/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select';
import { createBlog, updateBlog, getBlog } from '@/services/api';
import themeColors from '@/config/theme-colors-admin';
import { Save, ArrowLeft, Eye } from 'lucide-react';

const BlogEditorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const blogId = searchParams.get('id');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    category: '',
    tags: '',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await getBlog(blogId);
      const blog = response.data;
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        featuredImage: blog.featuredImage || '',
        category: blog.category || '',
        tags: blog.tags?.join(', ') || '',
        status: blog.status || 'draft',
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
      });
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to load blog post';
      alert(errorMessage);
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

    // Auto-generate slug from title
    if (field === 'title' && !blogId) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleSubmit = async (status = formData.status) => {
    try {
      setSaving(true);
      const payload = {
        ...formData,
        status,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      if (blogId) {
        await updateBlog(blogId, payload);
      } else {
        await createBlog(payload);
      }

      navigate('/admin-tabs?group=blog&tab=blogs');
    } catch (error) {
      console.error('Failed to save blog:', error);
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to save blog post. Please try again.';
      alert(errorMessage);
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
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
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
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter post title..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="url-friendly-slug"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: /blog/{formData.slug || 'your-slug-here'}
                </p>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="Brief description of the post..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Write your blog post content here... (Markdown supported)"
                  rows={15}
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports Markdown formatting
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  placeholder="SEO title (defaults to post title)"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  placeholder="SEO description (defaults to excerpt)"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  placeholder="e.g. Career Tips"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated tags
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="featuredImage">Image URL</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => handleChange('featuredImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
              {formData.featuredImage && (
                <div className="mt-3">
                  <img
                    src={formData.featuredImage}
                    alt="Featured"
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

export default BlogEditorPage;
