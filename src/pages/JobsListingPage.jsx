import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getEmployerJobs, getCategories } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/UI/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select.jsx';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  TrendingUp,
  Loader2,
  Plus,
  Filter,
  PlayCircle
} from 'lucide-react';
// Use public images as placeholders
const placeholderOptions = [
  '/images/videoPlaceholder1.jpeg',
  '/images/videoPlaceholder2.jpeg'
];
import themeColors from '@/config/theme-colors';

export default function JobsListingPage() {
  const { user, role } = useAuth();
  // pick a single random placeholder per page load
  const [placeholderImage] = useState(() => placeholderOptions[Math.floor(Math.random() * placeholderOptions.length)]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchCategories();

    // Listen for view count updates from other parts of the app
    const onViewsUpdated = (e) => {
      try {
        const { jobId, views } = e.detail || {};
        if (!jobId) return;
        setJobs(prev => {
          const idx = prev.findIndex(j => String(j.id) === String(jobId));
          if (idx === -1) return prev;
          const copy = [...prev];
          copy[idx] = { ...copy[idx], views };
          return copy;
        });
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('job:viewsUpdated', onViewsUpdated);
    return () => { window.removeEventListener('job:viewsUpdated', onViewsUpdated); };
  }, [statusFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Use employer-specific jobs endpoint to list only jobs posted by the current employer
      const response = await getEmployerJobs();
      setJobs(response.data.jobs || response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load job listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEdit = (jobId) => {
    navigate(`/employer-tabs?group=jobManagement&tab=post-job&edit=${jobId}`);
  };

  const handleDelete = async () => {
    try {
      // Add delete API call here
      toast({
        title: "Success!",
        description: "Job deleted successfully",
      });
      setDeleteDialog(false);
      fetchJobs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const computeStatus = (job) => {
      const now = new Date();
      if (job.status === 'draft') return 'draft';
      if (job.status === 'closed') return 'closed';
      if (job.deadline && new Date(job.deadline) < now) return 'closed';
      return 'active';
    };

    const computedStatus = computeStatus(job);
    const matchesSearch = (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || computedStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const JobCard = ({ job }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              {(() => {
                const computeStatus = (job) => {
                  const now = new Date();
                  if (job.status === 'draft') return 'draft';
                  if (job.status === 'closed') return 'closed';
                  if (job.deadline && new Date(job.deadline) < now) return 'closed';
                  return 'active';
                };
                const computedStatus = computeStatus(job);
                const computedLabel = computedStatus.charAt(0).toUpperCase() + computedStatus.slice(1);
                const variant = computedStatus === 'active' ? 'default' : 'secondary';
                return (
                  <Badge variant={variant}>{computedLabel}</Badge>
                );
              })()}
              {job.jobType && (
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {job.jobType}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(job.id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setSelectedJob(job);
                setDeleteDialog(true);
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Video / placeholder area */}
        <div className="mb-4">
          {job.video?.video_url || job.video_url ? (
            <div className="relative w-full h-48 rounded-md overflow-hidden">
              <video
                src={job.video?.video_url || job.video_url}
                controls
                className="w-full h-full object-cover"
              />
                {((Array.isArray(role) ? role.includes('employer') || role.includes('recruiter') : role === 'employer') || (user && String(user.id) === String(job?.employer?.userId || job?.employer?.user?.id || job?.employerProfile?.userId || job?.employerProfile?.user_id))) && (
                <div className="absolute top-3 right-3 z-20">
                  <Button size="xs" variant="ghost" aria-label="Manage Video" onClick={() => navigate(`/employer-tabs?group=videoManagement&tab=video-editor&id=${job.id}`)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-44 rounded-lg overflow-hidden relative shadow-sm border border-slate-100" style={{backgroundImage: `url(${placeholderImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-9 rounded-md bg-gradient-to-r from-sky-500 to-indigo-600 flex items-center justify-center border border-white/10 shadow-md">
                    <PlayCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
                <div className="absolute inset-0 flex items-end justify-end pr-6 pb-3">
                <p className="text-white font-medium bg-black/30 px-3 py-1 rounded">No Video</p>
              </div>
            </div>
          )}
        </div>
        {job.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {job.description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {job.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{job.location}</span>
            </div>
          )}

          {(job.minSalary || job.maxSalary) && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>
                {job.minSalary && job.maxSalary 
                  ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                  : job.minSalary 
                    ? `From $${job.minSalary.toLocaleString()}`
                    : `Up to $${job.maxSalary.toLocaleString()}`
                }
              </span>
            </div>
          )}

          {(() => {
            const applicantsCount = job.applicationsCount ?? job.applicants_count ?? job.applicants?.length ?? job.applications?.length ?? job.applicantList?.length ?? job.applicantsList?.length ?? 0;
            if (!applicantsCount || applicantsCount <= 0) return null;
            return (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{applicantsCount} Applicants</span>
              </div>
            );
          })()}

          {(() => {
            const getViews = (job) => job.views ?? job.viewsCount ?? job.stats?.views ?? 0;
            const views = getViews(job) || 0;
            return (
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>{views} Views</span>
              </div>
            );
          })()}
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Required Skills:</p>
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 5).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill.name || skill}
                </Badge>
              ))}
              {job.skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/job/${job.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className={`${themeColors.buttons.primary} text-white flex-1  hover:from-purple-700 hover:to-cyan-700`}
            onClick={() => navigate(`/employer-tabs?group=jobManagement&tab=job-applicants&id=${job.id}`)}
          >
            <Users className="h-4 w-4 mr-1" />
            View Applications
          </Button>
        </div>

        {job.createdAt && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="`${themeColors.text.gradient} text-4xl font-bold ">
          My Job Listings
        </h1>
        <Button
          onClick={() => navigate('/employer-tabs?group=jobManagement&tab=post-job')}
          className={`${themeColors.buttons.primary} text-white  hover:from-purple-700 hover:to-cyan-700`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {jobs.filter(j => {
                // Use the same computeStatus logic to determine active jobs
                const computeStatus = (job) => {
                  const now = new Date();
                  if (job.status === 'draft') return 'draft';
                  if (job.status === 'closed') return 'closed';
                  if (job.deadline && new Date(job.deadline) < now) return 'closed';
                  return 'active';
                };
                return computeStatus(j) === 'active';
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                // Prefer counting unique applicant user ids across jobs if applicants/apps lists exist.
                const uniqueApplicants = new Set();
                let foundArray = false;
                const getApplicantId = (a) => {
                  if (!a) return null;
                  return a.userId || a.user_id || a.id || a.applicantId || (a.user && (a.user.id || a.userId || a.user._id)) || null;
                };
                jobs.forEach(j => {
                  const arr = j.applicants || j.applications || j.applicantList || j.applicantsList;
                  if (Array.isArray(arr)) {
                    foundArray = true;
                    arr.forEach(a => {
                      const id = getApplicantId(a);
                      if (id) uniqueApplicants.add(String(id));
                    });
                  }
                });
                if (foundArray) return uniqueApplicants.size;
                // Fallback: sum applicants_count numbers if provided
                return jobs.reduce((sum, j) => sum + ((j.applicationsCount ?? j.applicants_count) || 0), 0);
              })()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.reduce((sum, j) => sum + (j.views ?? j.viewsCount ?? j.stats?.views ?? 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Jobs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className={`h-12 w-12 animate-spin ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? "Try adjusting your filters"
                : "Start by posting your first job"}
            </p>
            <Button
              onClick={() => navigate('/employer-tabs?group=jobManagement&tab=post-job')}
              className={`${themeColors.buttons.primary} text-white  hover:from-purple-700 hover:to-cyan-700`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job Posting?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedJob?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
