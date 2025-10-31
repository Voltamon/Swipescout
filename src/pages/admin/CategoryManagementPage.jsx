import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from '@/services/api';
import themeColors from '@/config/theme-colors-admin';
import {
  Plus,
  Edit,
  Trash2,
  Folder,
  Save,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';

const CategoryManagementPage = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    nameZh: '',
    description: '',
    descriptionAr: '',
    descriptionZh: '',
    slug: '',
    color: '#3B82F6',
    icon: '',
    isActive: true,
    sortOrder: 0,
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getBlogCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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
    if (field === 'name' && !editingCategory) {
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
      nameAr: '',
      nameZh: '',
      description: '',
      descriptionAr: '',
      descriptionZh: '',
      slug: '',
      color: '#3B82F6',
      icon: '',
      isActive: true,
      sortOrder: 0,
      metaTitle: '',
      metaDescription: '',
    });
    setEditingCategory(null);
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        nameAr: category.nameAr || '',
        nameZh: category.nameZh || '',
        description: category.description || '',
        descriptionAr: category.descriptionAr || '',
        descriptionZh: category.descriptionZh || '',
        slug: category.slug || '',
        color: category.color || '#3B82F6',
        icon: category.icon || '',
        isActive: category.isActive !== undefined ? category.isActive : true,
        sortOrder: category.sortOrder || 0,
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (editingCategory) {
        await updateBlogCategory(editingCategory.id, formData);
      } else {
        await createBlogCategory(formData);
      }
      fetchCategories();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert(error?.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await deleteBlogCategory(selectedCategory.id);
      setCategories(categories.filter((c) => c.id !== selectedCategory.id));
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert(error?.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>
            Blog Categories
          </h2>
          <p className={themeColors.text.secondary}>
            Manage blog post categories and organize your content
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className={`${themeColors.buttons.primary} text-white`}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-700"></div>
                      Loading categories...
                    </div>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Folder className="h-12 w-12 text-gray-300" />
                      <p className={themeColors.text.muted}>No categories found</p>
                      <Button
                        variant="outline"
                        onClick={() => handleOpenDialog()}
                        className="mt-2"
                      >
                        Create First Category
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Folder 
                          className="h-4 w-4" 
                          style={{ color: category.color }}
                        />
                        <div>
                          <div>{category.name}</div>
                          {category.nameAr && (
                            <div className="text-xs text-gray-500">
                              AR: {category.nameAr}
                            </div>
                          )}
                          {category.nameZh && (
                            <div className="text-xs text-gray-500">
                              ZH: {category.nameZh}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">
                        {category.description || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-xs">{category.color}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {category.isActive ? (
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
                    <TableCell>{category.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(category);
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update category information'
                : 'Add a new category for organizing blog posts'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* English Fields */}
            <div>
              <Label htmlFor="name">Name (English) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Category name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="nameAr">Name (Arabic)</Label>
              <Input
                id="nameAr"
                value={formData.nameAr}
                onChange={(e) => handleChange('nameAr', e.target.value)}
                placeholder="اسم الفئة"
                className="mt-1"
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="nameZh">Name (Chinese)</Label>
              <Input
                id="nameZh"
                value={formData.nameZh}
                onChange={(e) => handleChange('nameZh', e.target.value)}
                placeholder="类别名称"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="category-slug"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (English)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Category description"
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="descriptionAr">Description (Arabic)</Label>
              <Textarea
                id="descriptionAr"
                value={formData.descriptionAr}
                onChange={(e) => handleChange('descriptionAr', e.target.value)}
                placeholder="وصف الفئة"
                rows={2}
                className="mt-1"
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="descriptionZh">Description (Chinese)</Label>
              <Textarea
                id="descriptionZh"
                value={formData.descriptionZh}
                onChange={(e) => handleChange('descriptionZh', e.target.value)}
                placeholder="类别描述"
                rows={2}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleChange('sortOrder', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="icon">Icon (Optional)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                placeholder="icon-name"
                className="mt-1"
              />
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
              {saving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot
              be undone. Blog posts in this category will become uncategorized.
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

export default CategoryManagementPage;
