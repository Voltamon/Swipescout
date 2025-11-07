import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
} from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Textarea } from '@/components/UI/textarea.jsx';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/UI/dropdown-menu.jsx';
import { getBlogs, deleteBlog, updateBlog, bulkImportBlogs } from '@/services/api';
import themeColors from '@/config/theme-colors-admin';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Globe,
  FileText,
  Calendar,
  Upload,
  Download,
  Tag as TagIcon,
  Folder,
  FolderCog,
  TagsIcon,
} from 'lucide-react';

const BlogListPage = () => {
  // const { t } = useTranslation(); // Removed: unused variable
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter === 'all' ? undefined : statusFilter,
      };
      const response = await getBlogs(params);
      setBlogs(response.data.blogs || response.data || []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!selectedBlog) return;

    try {
      await deleteBlog(selectedBlog.id);
      setBlogs(blogs.filter((b) => b.id !== selectedBlog.id));
      setDeleteDialogOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error('Failed to delete blog:', error);
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to delete blog post';
      alert(errorMessage);
    }
  };

  const handlePublishToggle = async (blog) => {
    try {
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      await updateBlog(blog.id, { status: newStatus });
      fetchBlogs();
    } catch (error) {
      console.error('Failed to update blog status:', error);
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to update blog status';
      alert(errorMessage);
    }
  };

  const handleImportBlogs = async () => {
    try {
      setImporting(true);
      const blogsData = JSON.parse(importData);
      
      if (!Array.isArray(blogsData)) {
        alert('Invalid JSON format. Expected an array of blog objects.');
        return;
      }

      const response = await bulkImportBlogs(blogsData);
      const results = response.data.results;
      
      alert(`Import completed!\nSuccessful: ${results.successful}\nFailed: ${results.failed}${results.errors.length > 0 ? '\n\nErrors:\n' + results.errors.map(e => `- ${e.blog}: ${e.error}`).join('\n') : ''}`);
      
      setImportDialogOpen(false);
      setImportData('');
      fetchBlogs();
    } catch (error) {
      console.error('Failed to import blogs:', error);
      alert(error.response?.data?.message || 'Failed to import blogs. Please check the JSON format.');
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleJSON = () => {
    const sample = [
      {
        title: "Sample Blog Post",
        titleAr: "مقال عينة",
        titleZh: "示例博客文章",
        content: "# This is a sample blog post\n\nWith some **markdown** content.",
        contentAr: "# هذا مقال عينة",
        contentZh: "# 这是一篇示例博客文章",
        excerpt: "A brief description of the post",
        featuredImage: "https://example.com/image.jpg",
        categoryId: "uuid-of-category (optional)",
        tags: ["technology", "career"],
        status: "draft",
        language: "en",
        featured: false,
        metaTitle: "Sample Post - SEO Title",
        metaDescription: "SEO description for the sample post",
        metaKeywords: ["sample", "blog", "post"],
        relatedJobTitles: ["Software Developer", "Data Scientist"],
        relatedSkills: ["JavaScript", "Python"],
        targetAudience: ["job_seekers"],
        experienceLevel: "mid"
      }
    ];
    
    const dataStr = JSON.stringify(sample, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blog-import-sample.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.titleAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.titleZh?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const variants = {
      published: 'default',
      draft: 'secondary',
      archived: 'outline',
    };
    const colors = {
      published: themeColors.status.approved,
      draft: themeColors.status.pending,
      archived: themeColors.status.inactive,
    };
    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getLanguageBadge = (language) => {
    const languageNames = {
      en: 'English',
      ar: 'العربية',
      zh: '中文'
    };
    const colors = {
      en: 'bg-blue-100 text-blue-800',
      ar: 'bg-green-100 text-green-800',
      zh: 'bg-purple-100 text-purple-800'
    };
    return (
      <Badge variant="outline" className={colors[language] || 'bg-gray-100'}>
        <Globe className="h-3 w-3 mr-1" />
        {languageNames[language] || language}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>Blog Posts</h2>
          <p className={themeColors.text.secondary}>
            Manage all blog posts and articles
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/admin-tabs?group=blog&tab=categories')}
            className="gap-2"
          >
            <FolderCog className="h-4 w-4" />
            Categories
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/admin-tabs?group=blog&tab=tags')}
            className="gap-2"
          >
            <TagsIcon className="h-4 w-4" />
            Tags
          </Button>
          <Button
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button
            onClick={() => navigate('/admin-tabs?group=blog&tab=blogs/new')}
            className={`${themeColors.buttons.primary} text-white`}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts by title or excerpt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'published' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('published')}
                size="sm"
              >
                Published
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('draft')}
                size="sm"
              >
                Drafts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-700"></div>
                      Loading blogs...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-12 w-12 text-gray-300" />
                      <p className={themeColors.text.muted}>No blog posts found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div>
                        <div className={`${themeColors.text.primary} flex items-center gap-2`}>
                          {blog.featured && (
                            <Badge variant="secondary" className="text-xs">Featured</Badge>
                          )}
                          <span className="line-clamp-1">{blog.title}</span>
                        </div>
                        <div className={`text-sm ${themeColors.text.muted} line-clamp-1`}>
                          {blog.excerpt}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {blog.category ? (
                        <Badge 
                          variant="outline" 
                          style={{ 
                            borderColor: blog.category.color, 
                            color: blog.category.color 
                          }}
                        >
                          <Folder className="h-3 w-3 mr-1" />
                          {blog.category.name}
                        </Badge>
                      ) : (
                        <span className={themeColors.text.muted}>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {blog.blogTags && blog.blogTags.length > 0 ? (
                          <>
                            {blog.blogTags.slice(0, 2).map((blogTag) => (
                              <Badge key={blogTag.tag.id} variant="secondary" className="text-xs">
                                <TagIcon className="h-2 w-2 mr-1" />
                                {blogTag.tag.name}
                              </Badge>
                            ))}
                            {blog.blogTags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{blog.blogTags.length - 2}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className={themeColors.text.muted}>-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getLanguageBadge(blog.language)}
                    </TableCell>
                    <TableCell>{getStatusBadge(blog.status)}</TableCell>
                    <TableCell>
                      {blog.author ? (
                        <span>{blog.author.firstName} {blog.author.lastName}</span>
                      ) : (
                        <span className={themeColors.text.muted}>Unknown</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {blog.publishedAt ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(blog.publishedAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className={themeColors.text.muted}>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {blog.viewCount || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/admin-tabs?group=blog&tab=blogs/edit&id=${blog.id}`)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePublishToggle(blog)}>
                            <Globe className="mr-2 h-4 w-4" />
                            {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.open(`/blog/${blog.id}`, '_blank')}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedBlog(blog);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBlog?.title}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteBlog}
              className={`${themeColors.buttons.danger} text-white`}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Import Blogs
            </DialogTitle>
            <DialogDescription>
              Import multiple blog posts from JSON format. Each blog can include multi-language content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">JSON Data</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadSampleJSON}
                  className="gap-2"
                >
                  <Download className="h-3 w-3" />
                  Download Sample
                </Button>
              </div>
              <Textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='Paste your JSON array here, e.g.: [{"title": "Post 1", "content": "..."}, ...]'
                rows={12}
                className="font-mono text-xs"
              />
              <p className="text-xs text-gray-500 mt-2">
                Paste an array of blog objects. Download the sample to see the required format.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setImportDialogOpen(false);
                setImportData('');
              }}
              disabled={importing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportBlogs}
              disabled={importing || !importData.trim()}
              className={`${themeColors.buttons.primary} text-white`}
            >
              {importing ? 'Importing...' : 'Import Blogs'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogListPage;
