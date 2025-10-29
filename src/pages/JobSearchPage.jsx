import React, { useState, useEffect } from 'react';
import { searchJobs, applyToJob, getFilterOptions, saveVideo, unsaveVideo } from "../services/api";
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Badge } from '@/components/UI/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar';
import { Alert, AlertDescription } from '@/components/UI/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/UI/dialog';
import { Textarea } from '@/components/UI/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { Checkbox } from '@/components/UI/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Share2,
  Loader2,
  AlertCircle,
  PlayCircle
} from 'lucide-react';
import themeColors from '@/config/theme-colors-jobseeker';

export default function JobSearchPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [jobTypes, setJobTypes] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("any");
  const [industry, setIndustry] = useState("any");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOptions, setFilterOptions] = useState({});
  const [applyDialog, setApplyDialog] = useState({ open: false, job: null });
  const [applicationMessage, setApplicationMessage] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());

  const jobTypeOptions = ["Full-Time", "Part-Time", "Contract", "Freelance", "Internship"];
  const experienceLevelOptions = [
    { value: "any", label: "Any Experience" },
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6+ years)" }
  ];

  useEffect(() => {
    loadFilterOptions();
    fetchJobs();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const handleJobTypeChange = (event) => {
    const { value, checked } = event.target;
    setJobTypes((prev) =>
      checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
  };

  const fetchJobs = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = {
        q: searchTerm,
        location: location || undefined,
        minSalary: minSalary || undefined,
        maxSalary: maxSalary || undefined,
        jobTypes: jobTypes.length > 0 ? jobTypes : undefined,
        experienceLevel: experienceLevel === "any" ? undefined : experienceLevel,
        industry: industry === "any" ? undefined : industry,
        page: currentPage,
        limit: 12
      };

      const response = await searchJobs(searchParams);
      setJobs(response.data.jobs || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(currentPage);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchJobs(1);
  };

  const handlePageChange = (event, newPage) => {
    fetchJobs(newPage);
  };

  const handleApply = (job) => {
    setApplyDialog({ open: true, job });
    setApplicationMessage(`Dear Hiring Manager,\n\nI am very interested in the ${job.title} position at ${job.company}. I believe my skills and experience make me a great fit for this role.\n\nBest regards,\n${user?.firstName} ${user?.lastName}`);
  };

  const handleSendApplication = async () => {
    try {
      await applyToJob(applyDialog.job.id, { message: applicationMessage });
      toast({
        title: "Success!",
        description: "Application sent successfully!",
      });
      setApplyDialog({ open: false, job: null });
      setApplicationMessage("");
    } catch (error) {
      console.error('Error sending application:', error);
      toast({
        title: "Error",
        description: "Failed to send application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      if (savedJobs.has(jobId)) {
        await unsaveVideo(jobId);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        toast({
          description: "Job removed from saved list",
        });
      } else {
        await saveVideo(jobId);
        setSavedJobs(prev => new Set(prev).add(jobId));
        toast({
          title: "Saved!",
          description: "Job saved successfully!",
        });
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const JobCard = ({ job }) => (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 border-l-4 border-l-cyan-500">
      <CardContent className="flex-grow p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-grow">
            <Avatar className="h-12 w-12 cursor-pointer" onClick={() => job.companyVideoId && window.open(`/company-video/${job.companyVideoId}`, '_blank')}>
              <AvatarImage src={job.companyLogo} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                {job.company?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <h3 className="font-bold text-lg truncate">{job.title}</h3>
              <p 
                className={`text-sm text-muted-foreground ${job.companyVideoId ? `cursor-pointer hover:${themeColors.iconBackgrounds.primary.split(' ')[1]}` : ''} flex items-center gap-1`}
                onClick={() => job.companyVideoId && window.open(`/company-video/${job.companyVideoId}`, '_blank')}
              >
                {job.company}
                {job.companyVideoId && (
                  <Badge variant="outline" className="ml-1 text-xs h-5">
                    <PlayCircle className="h-3 w-3 mr-1" />
                    Video
                  </Badge>
                )}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSaveJob(job.id)}
            className="shrink-0"
          >
            {savedJobs.has(job.id) ? (
              <BookmarkCheck className={`h-5 w-5 ${themeColors.iconBackgrounds.primary.split(' ')[1]} fill-current`} />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>

        {job.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {job.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          {job.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
          )}

          {job.jobType && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{job.jobType}</span>
            </div>
          )}

          {job.experienceLevel && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{job.experienceLevel} level</span>
            </div>
          )}

          {(job.minSalary || job.maxSalary) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
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
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Required Skills:</p>
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill.name || skill}
                </Badge>
              ))}
              {job.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(`/job/${job.id}`, '_blank')}
          >
            View Details
          </Button>
          <Button
            variant="default"
            size="sm"
            className={`${themeColors.buttons.primary} text-white flex-1 `}
            onClick={() => handleApply(job)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Apply Now
          </Button>
        </div>

        {job.postedDate && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Posted {new Date(job.postedDate).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <h1 className={`${themeColors.text.gradient} text-4xl font-bold mb-6 `}>
        Find Your Dream Job
      </h1>

      {/* Search Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search jobs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Job title, company, keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Any Experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="minSalary">Min Salary</Label>
              <Input
                id="minSalary"
                type="number"
                placeholder="50000"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="maxSalary">Max Salary</Label>
              <Input
                id="maxSalary"
                type="number"
                placeholder="100000"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
              />
            </div>
          </div>

          {/* Job Type Filters */}
          <div className="mt-6">
            <Label className="text-base font-semibold mb-3 block">Job Type:</Label>
            <div className="flex flex-wrap gap-4">
              {jobTypeOptions.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={jobTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      setJobTypes(prev =>
                        checked ? [...prev, type] : prev.filter(t => t !== type)
                      );
                    }}
                  />
                  <Label htmlFor={type} className="cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className={`${themeColors.buttons.primary} text-white `}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Jobs
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className={`h-12 w-12 animate-spin ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            {jobs.length > 0 
              ? `Found ${jobs.length} jobs` 
              : 'No jobs found'
            }
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(null, page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(null, page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Apply Dialog */}
      <Dialog 
        open={applyDialog.open} 
        onOpenChange={(open) => !open && setApplyDialog({ open: false, job: null })}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Apply for {applyDialog.job?.title} at {applyDialog.job?.company}
            </DialogTitle>
            <DialogDescription>
              Submit your application with a personalized cover letter.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Write your cover letter..."
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              rows={8}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setApplyDialog({ open: false, job: null })}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendApplication}
              disabled={!applicationMessage.trim()}
              className={`${themeColors.buttons.primary} text-white `}
            >
              Send Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

