import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobDetails } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useVideoContext } from '@/contexts/VideoContext';
import themeColors, { getButtonClass, getBadgeClass, getStatusClass } from '@/config/theme-colors-jobseeker';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Card } from '@/components/UI/card.jsx';
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
} from '@/components/icons/heroicons';

// Note: This page intentionally uses Tailwind utility classes for layout and
// uses shared color utility helpers from theme-colors-jobseeker for consistency.

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [showVideoInfo, setShowVideoInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { role } = useAuth();
  const { videos: localVideos } = useVideoContext();
  const videoRef = React.useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseOverControls, setIsMouseOverControls] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await getJobDetails(id);
        setJob(response.data.job);
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
    if (job?.video?.video_url && job.video.status === 'completed') {
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

  const renderVideoHero = () => {
    if (!hasVideo()) return null;

    const videoUrl = getVideoUrl();
    const video = displayVideo;



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



    
    return (
      <div
        className="w-full relative rounded-2xl overflow-hidden shadow-lg mb-6 bg-black"
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
              className="w-full h-[60vh] min-h-[400px] max-h-[800px] object-cover absolute inset-0"
            />

            <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent text-white z-10">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-1">{job?.title}</h1>
                <div className="flex gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <BuildingOfficeIcon className="w-5 h-5 text-white/90" />
                      <span>{job?.employer?.company_name || job?.company || job?.companyName || job?.employerProfile?.company_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-5 h-5 text-white/90" />
                      <span>{job?.location}</span>
                    </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 max-w-xs transition-all">
                <div className="text-sm">{displayVideo.video_title || "Video Title"}</div>
              </div>
            </div>

            <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between p-2 text-white/95 bg-black/20 z-20">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); togglePlayback(); }}
                className="p-2 rounded bg-white/10 hover:bg-white/20"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
              </button>

              <div className="text-xs">
                {videoRef.current ? formatTime(videoRef.current.currentTime) : '00:00'} / {videoRef.current ? formatTime(videoRef.current.duration) : '00:00'}
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="p-2 rounded bg-white/10 hover:bg-white/20"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <SpeakerXIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
              </button>
            </div>
          </>
        ) : (
          <div
            onMouseEnter={() => setIsMouseOverControls(true)}
            onMouseLeave={() => setIsMouseOverControls(false)}
            className="w-full h-[60vh] min-h-[400px] max-h-[800px] flex flex-col items-center justify-center bg-gray-900 text-white p-6"
          >
            {(video.status === 'uploading' || video.status === 'processing') && (
              <>
                <div className="loader mb-4" />
                <h3 className="text-xl">{video.status === 'uploading' ? `Uploading: ${video.progress || 0}%` : 'Processing your video...'}</h3>
                {video.status === 'uploading' && (
                  <div className="w-4/5 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div className="h-2 bg-indigo-600" style={{ width: `${video.progress || 0}%` }} />
                  </div>
                )}
                <p className="mt-2 text-sm">This may take a few moments...</p>
              </>
            )}

            {video.status === 'failed' && (
              <>
                <div className="text-6xl mb-2"><DocumentTextIcon className="w-12 h-12 text-yellow-400" /></div>
                <h3 className="text-xl">Video upload failed</h3>
                <p className="mt-1 text-sm">Please check the videos page for details or try again</p>
              </>
            )}

            {(!video.status || video.status === 'completed') && !videoUrl && (
              <>
                <div className="text-6xl mb-2"><DocumentTextIcon className="w-12 h-12 text-slate-300" /></div>
                <h3 className="text-xl">Video content not available</h3>
              </>
            )}
          </div>
        )}

        {(video.status === 'processing' || video.status === 'failed') && (
          <div className={`absolute inset-0 rounded border-4 ${video.status === 'processing' ? 'border-indigo-700' : 'border-red-600'} pointer-events-none`} />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center my-8">
            <div className="loader" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen pt-16 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">{error || "Job not found"}</div>
          <button
            className={`px-4 py-2 rounded ${getButtonClass('outline')}`}
            onClick={() => navigate("/jobs-Listing-Page")}
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-12">
      <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <Button variant="outline" onClick={() => navigate('/jobs-Listing-Page')}>Back to Jobs</Button>
          </div>

        {hasVideo() && renderVideoHero()}

        <Card className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl"><DocumentTextIcon className="w-8 h-8 text-indigo-600" /></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Job:</div>
                  <h2 className="text-2xl font-bold">{job.title}</h2>
                  <div className="flex gap-4 mt-2 text-sm text-slate-600">
                    <div>Posted: {formatDate(job.posted_at)}</div>
                    {job.deadline && <div>Expires: {formatDate(job.deadline)}</div>}
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/employer-profile/${job.employer?.id || job.employerProfile?.id || job.employerProfileId}`)}>
                    About {job.employer?.company_name || job.company || job.companyName || job.employerProfile?.company_name}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <div className="mb-4">
                <div className="text-sm text-slate-500">Location</div>
                <div className="text-base">{job.location} {job.remote_ok ? "(Remote OK)" : ""}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-slate-500">Salary Range</div>
                <div className="text-base">{(job.salary_min || job.salary_max || job.salaryMin || job.salaryMax) ? `${formatSalary(job.salaryMin || job.salary_min)} - ${formatSalary(job.salaryMax || job.salary_max)}` : 'Not specified'}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-slate-500">Employment Type</div>
                <div className="text-base">{job.employment_type ? job.employment_type.replace('-', ' ').toUpperCase() : 'Not specified'}</div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <div className="text-sm text-slate-500">Experience Level</div>
                <div className="text-base">{job.experience_level ? job.experience_level : 'Not specified'}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-slate-500">Education Level</div>
                <div className="text-base">{job.education_level ? job.education_level : 'Not specified'}</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-slate-500 mb-2">Job Description</div>
            <div className="whitespace-pre-line text-base text-slate-800">{job.description}</div>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="mt-6">
              <div className="text-sm text-slate-500 mb-2">Requirements</div>
              <ul className="list-disc pl-6">
                {job.requirements.map((req, i) => <li key={i} className="mb-1">{req}</li>)}
              </ul>
            </div>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="mt-6">
              <div className="text-sm text-slate-500 mb-2">Responsibilities</div>
              <ul className="list-disc pl-6">
                {job.responsibilities.map((r, i) => <li key={i} className="mb-1">{r}</li>)}
              </ul>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="mt-6">
              <div className="text-sm text-slate-500 mb-2">Required Skills</div>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(s => (
                  <Badge key={s.id} variant="outline" className="px-2 py-1">{s.name}</Badge>
                ))}
              </div>
            </div>
          )}

          {job.categories && job.categories.length > 0 && (
            <div className="mt-6">
              <div className="text-sm text-slate-500 mb-2">Categories</div>
              <div className="flex flex-wrap gap-2">
                {job.categories.map(c => (<Badge key={c.id} variant="secondary" className="px-2 py-1">{c.name}</Badge>))}
              </div>
            </div>
          )}

          {role === 'job_seeker' && (
            <div className="flex justify-center mt-6">
              <Button variant="default" size="lg" onClick={() => navigate(`/apply/${job.id}`)} className="rounded-full px-8">Apply Now</Button>
            </div>
          )}
        </Card>
      </div>

      {snackbar.open && (
        <div className={`fixed top-6 right-6 p-3 rounded ${snackbar.severity === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-green-50 border border-green-200 text-green-800'}`}>
          {snackbar.message}
          <button className="ml-3 font-bold" onClick={() => setSnackbar({ ...snackbar, open: false })}>×</button>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;