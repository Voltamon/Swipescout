import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
} from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Textarea } from '@/components/UI/textarea.jsx';
import { Switch } from '@/components/UI/switch.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/UI/table.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog.jsx';
import {
  getBlogTags,
  createBlogTag,
  updateBlogTag,
  deleteBlogTag,
} from '@/services/api';
import themeColors from '@/config/theme-colors-admin';
import {
  Plus,
  Edit,
  Trash2,
  Tag as TagIcon,
  Save,
  X,
  Eye,
  EyeOff,
  TrendingUp,
} from 'lucide-react';

const TagManagementPage = () => {
  const { t } = useTranslation();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#6B7280',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await getBlogTags(100);
      setTags(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from name if not editing
    if (field === 'name' && !editingTag) {
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

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#6B7280',
      isActive: true,
      metaTitle: '',
      metaDescription: '',
    });
    setEditingTag(null);
  };

  const handleOpenDialog = (tag = null) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name || '',
        slug: tag.slug || '',
        description: tag.description || '',
        color: tag.color || '#6B7280',
        isActive: tag.isActive !== undefined ? tag.isActive : true,
        metaTitle: tag.metaTitle || '',
        metaDescription: tag.metaDescription || '',
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (editingTag) {
        await updateBlogTag(editingTag.id, formData);
      } else {
        await createBlogTag(formData);
      }
      fetchTags();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save tag:', error);
      alert(error?.response?.data?.message || 'Failed to save tag');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTag) return;

    try {
      await deleteBlogTag(selectedTag.id);
      setTags(tags.filter((t) => t.id !== selectedTag.id));
      setDeleteDialogOpen(false);
      setSelectedTag(null);
    } catch (error) {
      console.error('Failed to delete tag:', error);
      alert(error?.response?.data?.message || 'Failed to delete tag');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>
            Blog Tags
          </h2>
          <p className={themeColors.text.secondary}>
            Manage blog tags for better content organization and discoverability
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className={`${themeColors.buttons.primary} text-white`}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Tag
        </Button>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <Card className="col-span-full">
            <CardContent className="py-12">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-700"></div>
                Loading tags...
              </div>
            </CardContent>
          </Card>
        ) : tags.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-2">
                <TagIcon className="h-12 w-12 text-gray-300" />
                <p className={themeColors.text.muted}>No tags found</p>
                <Button
                  variant="outline"
                  onClick={() => handleOpenDialog()}
                  className="mt-2"
                >
                  Create First Tag
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          tags.map((tag) => (
            <Card key={tag.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <TagIcon
                        className="h-5 w-5"
                        style={{ color: tag.color }}
                      />
                      <div>
                        <h3 className="font-semibold">{tag.name}</h3>
                        <code className="text-xs text-gray-500">{tag.slug}</code>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(tag)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTag(tag);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {tag.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {tag.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Used {tag.usageCount || 0} times
                      </span>
                    </div>
                    {tag.isActive ? (
                      <Badge variant="default" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>

                  {/* Color Preview */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-full h-2 rounded"
                      style={{ backgroundColor: tag.color }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Tags Table (Alternative View) */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No tags available
                  </TableCell>
                </TableRow>
              ) : (
                tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <TagIcon
                          className="h-4 w-4"
                          style={{ color: tag.color }}
                        />
                        {tag.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {tag.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-gray-400" />
                        {tag.usageCount || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-xs">{tag.color}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tag.isActive ? (
                        <Badge variant="default" className="gap-1">
                          <Eye className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <EyeOff className="h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(tag)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTag(tag);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'Edit Tag' : 'Create New Tag'}
            </DialogTitle>
            <DialogDescription>
              {editingTag
                ? 'Update tag information'
                : 'Add a new tag for categorizing blog posts'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Tag name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="tag-slug"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Tag description"
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  placeholder="#6B7280"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange('isActive', checked)}
              />
            </div>

            <div>
              <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                placeholder="SEO title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                placeholder="SEO description"
                rows={2}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
              disabled={saving}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !formData.name || !formData.slug}
              className={`${themeColors.buttons.primary} text-white`}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : editingTag ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the tag "{selectedTag?.name}"? This action
              cannot be undone. The tag will be removed from all blog posts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className={`${themeColors.buttons.danger} text-white`}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagManagementPage;
