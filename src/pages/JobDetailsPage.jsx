import i18n from 'i18next';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobDetails, incrementJobView } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useVideoContext } from '@/contexts/VideoContext';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import localize from '@/utils/localize';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
} from '@/components/icons/heroicons';
import { Eye, Plus, Edit } from 'lucide-react';

// Public placeholder images - randomly selected per page open
const placeholderOptions = [
  '/images/videoPlaceholder1.jpeg',
  '/images/videoPlaceholder2.jpeg'
];

const JobDetailsPage = ({ id: propId }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId; // Use prop if available, fallback to URL param
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [showVideoInfo, setShowVideoInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { role, user } = useAuth();
  const { videos: localVideos } = useVideoContext();
  const videoRef = React.useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseOverControls, setIsMouseOverControls] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await getJobDetails(id);
        const jobData = response.data.job;
        setJob(jobData);

        // Increment the job view count on the server and update UI
        try {
          const inc = await incrementJobView(id);
          const updatedViews = inc?.data?.views ?? jobData?.views ?? jobData?.viewsCount ?? 0;
          setJob((prev) => ({ ...(prev || jobData), views: updatedViews }));
          // Notify other pages to refresh listing or update counts
          try {
            window.dispatchEvent(new CustomEvent('job:viewsUpdated', { detail: { jobId: id, views: updatedViews } }));
          } catch (e) {
            // ignore if CustomEvent unsupported
          }
        } catch (e) {
          // ignore increment errors
          console.warn('Failed to increment job view:', e);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details");
        setLoading(false);
        setSnackbar({ open: true, message: "Failed to load job details", severity: "error" });
      }
    };

    fetchJobDetails();
  }, [id]);

  const getDisplayVideo = () => {
    // 1. Check for local videos first (uploading/processing)
    const associatedLocalVideo = localVideos.find(v => v.job_id === id);
    
    if (associatedLocalVideo && 
        (associatedLocalVideo.status === 'uploading' || 
         associatedLocalVideo.status === 'processing' || 
         associatedLocalVideo.status === 'failed') && 
        associatedLocalVideo.video_url
    ) {
      return associatedLocalVideo;
    }

    // 2. Check for completed server video in job data
    if (job?.video?.video_url && job?.video?.status === 'completed') {
      return job.video;
    }

    // 3. Check if job has a video_id but no full video object
    if (job?.video_id) {
      return {
        id: job.video_id,
        status: job.video?.status || 'processing',
        video_title: job.title ? `${job.title} Video` : 'Job Video',
        submitted_at: job.video?.submitted_at || new Date().toISOString(),
        video_url: null
      };
    }
    
    // 4. Check if there's a completed local video for this job
    const completedLocalVideo = localVideos.find(v => 
      v.job_id === id && v.status === 'completed'
    );
    if (completedLocalVideo) {
      return completedLocalVideo;
    }

    return null;
  };

  const displayVideo = getDisplayVideo();
  const hasVideo = () => !!displayVideo;
  const getVideoUrl = () => displayVideo?.video_url || null;

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => console.log("Play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatSalary = (amount) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const computeStatus = (job) => {
    const now = new Date();
    if (!job) return 'active';
    if (job.status === 'draft') return 'draft';
    if (job.status === 'closed') return 'closed';
    if (job.deadline && new Date(job.deadline) < now) return 'closed';
    return 'active';
  };

  const handleMouseEnterVideo = () => {
    setIsHovering(true);
    if (!isPlaying && !isMouseOverControls) {
      videoRef.current?.play().catch(e => console.log("Play failed:", e));
    }
  };

  const handleMouseLeaveVideo = () => {
    setIsHovering(false);
    if (isPlaying && !isMouseOverControls) {
      videoRef.current?.pause();
    }
  };

  const [placeholderImage] = useState(() => placeholderOptions[Math.floor(Math.random() * placeholderOptions.length)]);

  const renderVideoHero = () => {
    const videoUrl = getVideoUrl();
    const video = displayVideo;
    // Use the deterministic random placeholder chosen at mount
    const placeholderDataUrl = `url(${placeholderImage})`;
    
    return (
      <Card className="w-full relative overflow-hidden mb-8 border-0 shadow-xl">
        <div
          className="relative cursor-pointer group"
          onClick={togglePlayback}
          onMouseEnter={handleMouseEnterVideo}
          onMouseLeave={handleMouseLeaveVideo}
        >
          {videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                controls={false}
                autoPlay={isPlaying}
                muted={isMuted}
                loop
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-[65vh] min-h-[450px] max-h-[850px] object-cover"
              />

              {/* Video overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Video info overlay */}
              <div className="absolute left-0 right-0 bottom-0 p-8 z-10">
                <div className="max-w-4xl">
                  <Badge variant="secondary" className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {video?.video_title || "Job Video"}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">{job?.title}</h1>
                  <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base text-white/90">
                    <div className="flex items-center gap-2 backdrop-blur-sm bg-black/20 rounded-full px-3 py-1.5">
                      <BuildingOfficeIcon className="w-5 h-5" />
                      <span className="font-medium">{job?.employer?.company_name || job?.company || job?.companyName || job?.employerProfile?.company_name}</span>
                    </div>
                    <div className="flex items-center gap-2 backdrop-blur-sm bg-black/20 rounded-full px-3 py-1.5">
                      <MapPinIcon className="w-5 h-5" />
                      <span className="font-medium">{job?.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video controls */}
              <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between gap-4 z-20">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={(e) => { e.stopPropagation(); togglePlayback(); }}
                  className="bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <PauseIcon className="w-5 h-5 text-slate-900" /> : <PlayIcon className="w-5 h-5 text-slate-900" />}
                </Button>

                <div className="flex-1 flex items-center justify-center">
                  <div className="text-xs md:text-sm font-medium text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    {videoRef.current ? formatTime(videoRef.current.currentTime) : '00:00'} / {videoRef.current ? formatTime(videoRef.current.duration) : '00:00'}
                  </div>
                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                  className="bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <SpeakerXIcon className="w-5 h-5 text-slate-900" /> : <SpeakerWaveIcon className="w-5 h-5 text-slate-900" />}
                </Button>
              </div>
              {/* Manage Video Button for Employers/Job Owner */}
              {((Array.isArray(role) ? role.includes('employer') || role.includes('recruiter') : role === 'employer') || (user && String(user.id) === String(job?.employer?.userId || job?.employer?.user?.id || job?.employerProfile?.userId || job?.employerProfile?.user_id))) && (
                <div className="absolute top-4 right-4 z-30">
                  <Button size="sm" variant="outline" aria-label={i18n.t('auto_manage_video')}  onClick={(e) => { e.stopPropagation(); navigate(`/employer-tabs?group=videoManagement&tab=video-editor&id=${job.id}`); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div
              onMouseEnter={() => setIsMouseOverControls(true)}
              onMouseLeave={() => setIsMouseOverControls(false)}
              className="w-full h-[65vh] min-h-[450px] max-h-[850px] flex flex-col items-center justify-center rounded-lg shadow-inner border border-slate-200 text-white"
              style={{ backgroundImage: placeholderDataUrl, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {(video?.status === 'uploading' || video?.status === 'processing') && (
                <>
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6" />
                  <h3 className="text-2xl font-semibold mb-2">
                    {video?.status === 'uploading' ? `Uploading: ${video?.progress || 0}%` : 'Processing your video...'}
                  </h3>
                  {video?.status === 'uploading' && (
                    <div className="w-80 max-w-[80%] bg-slate-700/50 rounded-full h-3 overflow-hidden mt-4">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 rounded-full" 
                        style={{ width: `${video?.progress || 0}%` }} 
                      />
                    </div>
                  )}
                  <p className="mt-3 text-slate-300">{i18n.t('auto_this_may_take_a_few_moments')}</p>
                </>
              )}

              {video?.status === 'failed' && (
                <>
                  <DocumentTextIcon className="w-20 h-20 text-yellow-400 mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">{i18n.t('auto_video_upload_failed')}</h3>
                  <p className="text-slate-300">{i18n.t('auto_please_check_the_videos_page_for_details')}</p>
                </>
              )}

              {(!video?.status || video?.status === 'completed') && !videoUrl && (
                <>
                  <div className="w-full max-w-3xl h-60 mb-4 rounded-lg overflow-hidden relative shadow-lg border border-slate-100">
                    <div className="absolute inset-0" style={{ backgroundImage: placeholderDataUrl, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  </div>
                  <div className="mt-2 flex items-end justify-end pr-8 pb-3">
                    <p className="text-white font-medium bg-black/30 px-3 py-1 rounded">{i18n.t('auto_no_video')}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {video?.status === 'processing' && (
            <div className="absolute inset-0 border-4 border-purple-500 pointer-events-none rounded-lg" />
          )}
          {video?.status === 'failed' && (
            <div className="absolute inset-0 border-4 border-red-500 pointer-events-none rounded-lg" />
          )}
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50 pt-20 pb-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-600 font-medium">{i18n.t('auto_loading_job_details')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50 pt-20 pb-20">
        <div className="container max-w-6xl mx-auto px-4">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="pt-6">
              <div className="text-red-700 text-center">
                <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-xl font-semibold mb-2">{error || "Job not found"}</h3>
                <p className="text-sm text-red-600 mb-6">We couldn't load this job listing. It may have been removed or you may not have permission to view it.</p>
                <Button variant="outline" onClick={() => navigate("/jobs-Listing-Page")}>
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />{i18n.t('auto_back_to_jobs')}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50 pt-20 pb-20">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Video Hero Section */}
        {renderVideoHero()}

        {/* Main Job Details Card */}
        <Card className="shadow-xl border-slate-200/60 mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Company Logo/Icon */}
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <BuildingOfficeIcon className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Job Title and Company Info */}
              <div className="flex-1 min-w-0">
                <CardDescription className="text-xs uppercase tracking-wider font-semibold text-purple-600 mb-2">{i18n.t('auto_job_opportunity')}</CardDescription>
                <div className="flex items-center gap-3">
                  <CardTitle className="text-3xl md:text-4xl mb-4">{job.title}</CardTitle>
                  <Badge variant={computeStatus(job) === 'active' ? 'default' : 'secondary'}>
                    {computeStatus(job).charAt(0).toUpperCase() + computeStatus(job).slice(1)}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <BuildingOfficeIcon className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">{job?.employer?.company_name || job?.company || job?.companyName || job?.employerProfile?.company_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPinIcon className="w-5 h-5 text-purple-500" />
                    <span>{job?.location}</span>
                    {job.remote_ok && <Badge variant="secondary" className="ml-1">{i18n.t('auto_remote')}</Badge>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Posted {formatDate(job.posted_at)}</span>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4" />
                      <span>Expires {formatDate(job.deadline)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Profile Button */}
              <div className="shrink-0">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/employer-profile/${job.employer?.userId || job.employer?.user_id || job.employerProfile?.userId || job.employerProfile?.user_id}`)}
                  className="w-full md:w-auto"
                >{i18n.t('auto_view_company')}</Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50/50 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-600" />{i18n.t('auto_salary_range')}</div>
                <div className="text-lg font-semibold text-slate-900">
                  {(job.salary_min || job.salary_max || job.salaryMin || job.salaryMax) 
                    ? `${formatSalary(job.salaryMin || job.salary_min)} - ${formatSalary(job.salaryMax || job.salary_max)}` 
                    : 'Not specified'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <BriefcaseIcon className="w-5 h-5 text-blue-600" />{i18n.t('auto_employment_type')}</div>
                <div className="text-lg font-semibold text-slate-900">
                  {job.employment_type ? job.employment_type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not specified'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <ClockIcon className="w-5 h-5 text-purple-600" />{i18n.t('auto_experience_level')}</div>
                <div className="text-lg font-semibold text-slate-900">
                  {job.experience_level || 'Not specified'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <AcademicCapIcon className="w-5 h-5 text-orange-600" />{i18n.t('auto_education_level')}</div>
                <div className="text-lg font-semibold text-slate-900">
                  {job.education_level || 'Not specified'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <MapPinIcon className="w-5 h-5 text-red-600" />{i18n.t('auto_location')}</div>
                <div className="text-lg font-semibold text-slate-900">
                  {job.location}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <Eye className="w-5 h-5 text-indigo-600" />{i18n.t('auto_views')}</div>
                <div className="text-lg font-semibold text-slate-900">
                  {job.views ?? job.viewsCount ?? job.stats?.views ?? 0}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />{i18n.t('auto_job_description')}</h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">{i18n.t('auto_requirements_1')}</h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                      <span className="flex-1">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">{i18n.t('auto_responsibilities')}</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span className="flex-1">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">{i18n.t('auto_required_skills')}</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(s => (
                    <Badge 
                      key={s.id} 
                      variant="outline" 
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                    >
                      {localize(s.name)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {job.categories && job.categories.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">{i18n.t('auto_categories')}</h3>
                <div className="flex flex-wrap gap-2">
                  {job.categories.map(c => (
                    <Badge 
                      key={c.id} 
                      variant="secondary" 
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border-indigo-200"
                    >
                      {localize(c.name)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button */}
            {role === 'job_seeker' && (
              <div className="pt-6 border-t border-slate-200">
                <Button 
                  size="lg" 
                  onClick={() => navigate(`/apply/${job.id}`)} 
                  disabled={Boolean(user?.id && (String(user.id) === String(job?.employer?.userId || job?.employer?.user?.id || job?.employerProfile?.userId || job?.employerProfile?.user_id)))}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30 px-12"
                >
                  {user?.id && (String(user.id) === String(job?.employer?.userId || job?.employer?.user?.id || job?.employerProfile?.userId || job?.employerProfile?.user_id)) ? 'You posted this job' : 'Apply for this Position'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Snackbar Notification */}
      {snackbar.open && (
        <div className={`fixed top-6 right-6 z-50 min-w-[300px] p-4 rounded-lg shadow-2xl border backdrop-blur-sm transition-all ${
          snackbar.severity === 'error' 
            ? 'bg-red-50/95 border-red-200 text-red-900' 
            : 'bg-green-50/95 border-green-200 text-green-900'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <p className="flex-1 font-medium">{snackbar.message}</p>
            <button 
              className="shrink-0 text-2xl leading-none opacity-60 hover:opacity-100 transition-opacity" 
              onClick={() => setSnackbar({ ...snackbar, open: false })}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;