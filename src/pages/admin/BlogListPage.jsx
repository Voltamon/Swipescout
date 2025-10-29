import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Input } from '@/components/UI/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/UI/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/UI/dropdown-menu';
import { getBlogs, deleteBlog, updateBlog } from '@/services/api';
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
} from 'lucide-react';

const BlogListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

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
      // Mock data for development
      setBlogs([
        {
          id: '1',
          title: 'How to Create the Perfect Video Resume',
          slug: 'how-to-create-perfect-video-resume',
          excerpt: 'Learn the best practices for creating a compelling video resume that gets you noticed.',
          status: 'published',
          category: 'Career Tips',
          author: { firstName: 'Admin', lastName: 'User' },
          publishedAt: new Date('2024-03-15'),
          views: 1250,
        },
        {
          id: '2',
          title: 'Top 10 Interview Questions for 2024',
          slug: 'top-10-interview-questions-2024',
          excerpt: 'Prepare for your next interview with these commonly asked questions.',
          status: 'published',
          category: 'Interview Prep',
          author: { firstName: 'Admin', lastName: 'User' },
          publishedAt: new Date('2024-03-10'),
          views: 890,
        },
        {
          id: '3',
          title: 'Understanding SwipeScout Features',
          slug: 'understanding-swipescout-features',
          excerpt: 'A complete guide to all the features available on SwipeScout platform.',
          status: 'draft',
          category: 'Platform Guide',
          author: { firstName: 'Admin', lastName: 'User' },
          publishedAt: null,
          views: 0,
        },
      ]);
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

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
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
        <Button
          onClick={() => navigate('/admin-tabs?group=blog&tab=blogs/new')}
          className={`${themeColors.buttons.primary} text-white`}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
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
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-700"></div>
                      Loading blogs...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-12 w-12 text-gray-300" />
                      <p className={themeColors.text.muted}>No blog posts found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className={themeColors.text.primary}>{blog.title}</div>
                        <div className={`text-sm ${themeColors.text.muted} line-clamp-1`}>
                          {blog.excerpt}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{blog.category || 'Uncategorized'}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(blog.status)}</TableCell>
                    <TableCell>
                      {blog.author?.firstName} {blog.author?.lastName}
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
                        {blog.views || 0}
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
    </div>
  );
};

export default BlogListPage;
