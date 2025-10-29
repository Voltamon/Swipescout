import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllJobsPosted, getCategories } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Badge } from '@/components/UI/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/UI/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
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
import themeColors from '@/config/theme-colors';

export default function JobsListingPage() {
  const { user } = useAuth();
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
  }, [statusFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getAllJobsPosted();
      setJobs(response.data.jobs || []);
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
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const JobCard = ({ job }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                {job.status || 'Active'}
              </Badge>
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

          {job.applicants_count !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{job.applicants_count} Applicants</span>
            </div>
          )}

          {job.views !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>{job.views} Views</span>
            </div>
          )}
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
            onClick={() => navigate(`/job/${job.id}/applications`)}
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
              {jobs.filter(j => j.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.reduce((sum, j) => sum + (j.applicants_count || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.reduce((sum, j) => sum + (j.views || 0), 0)}
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
          <Loader2 className="h-12 w-12 animate-spin ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
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
