import i18n from 'i18next';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadVideo, saveVideoMetadata } from '@/services/videoService';
import { checkUploadStatus, checkUploadLimit } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useVideoContext } from '@/contexts/VideoContext';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Textarea } from '@/components/UI/textarea.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Progress } from '@/components/UI/progress.jsx';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select.jsx';
import {
  Video,
  Upload,
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  X,
  Plus,
  Save,
  Loader2,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import themeColors from '@/config/theme-colors-employer';

export default function VideoUpload({ newjobid, onComplete, onStatusChange, embedded }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role } = useAuth();
  const { addLocalVideo, updateVideoStatus, updateVideoServerId } = useVideoContext();
  
  // Debug logging for role detection
  useEffect(() => {
    console.log('[VideoUpload] User:', user);
    console.log('[VideoUpload] Role:', role);
    console.log('[VideoUpload] Role type:', typeof role);
    console.log('[VideoUpload] Is Array:', Array.isArray(role));
    if (Array.isArray(role)) {
      console.log('[VideoUpload] Role includes employer:', role.includes('employer'));
      console.log('[VideoUpload] Role includes jobseeker:', role.includes('jobseeker') || role.includes('job_seeker'));
    }
  }, [user, role]);

  useEffect(() => {
    const checkLimit = async () => {
      try {
        const data = await checkUploadLimit();
        setUploadLimit(data);
        if (!data.allowed) {
          setLimitReached(true);
        }
      } catch (error) {
        console.error('Failed to check upload limit:', error);
      }
    };
    checkLimit();
  }, []);
  
  // Refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);

  // State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('record'); // 'record' or 'upload'

  // Metadata
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoCategory, setVideoCategory] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [jobId, setJobId] = useState(newjobid || '');
  const [privacy, setPrivacy] = useState('public');
  const [uploadLimit, setUploadLimit] = useState(null);
  const [limitReached, setLimitReached] = useState(false);

  // Allow user to choose role to upload as if they have multiple roles
  const [selectedUploaderRole, setSelectedUploaderRole] = useState(() => {
    if (Array.isArray(role) && role.length) return role[0];
    if (typeof role === 'string') return role;
    return null;
  });

  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Polling ref to allow cleanup
  const uploadPollRef = useRef(null);

  useEffect(() => {
    return () => {
      if (uploadPollRef.current) {
        clearInterval(uploadPollRef.current);
        uploadPollRef.current = null;
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      toast({
        title: "Camera ready",
        description: "You can now start recording",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Failed to access camera and microphone",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      await startCamera();
      setTimeout(startRecording, 500);
      return;
    }

    try {
      chunksRef.current = [];
      
      // Try different codecs in order of preference until one is supported
      const codecOptions = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm;codecs=h264',
        'video/webm',
        'video/mp4'
      ];
      
      let selectedMimeType = '';
      for (const codec of codecOptions) {
        if (MediaRecorder.isTypeSupported(codec)) {
          selectedMimeType = codec;
          break;
        }
      }
      
      if (!selectedMimeType) {
        throw new Error('No supported video codec found');
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: selectedMimeType
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: selectedMimeType });
        const url = URL.createObjectURL(blob);
        setRecordedVideo({ blob, url });
        stopCamera();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: error.message || "Failed to start recording",
        variant: "destructive",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setUploadedFile(file);
        const url = URL.createObjectURL(file);
        setRecordedVideo({ blob: file, url });
        
        toast({
          title: "Video uploaded",
          description: `${file.name} is ready for processing`,
        });
      } else {
        toast({
          title: "Invalid file",
          description: "Please upload a video file",
          variant: "destructive",
        });
      }
    }
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const handleSaveVideo = async () => {
    if (!recordedVideo && !uploadedFile) {
      toast({
        title: "No video",
        description: "Please record or upload a video first",
        variant: "destructive",
      });
      return;
    }

    if (!videoTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a video title",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const videoId = uuidv4();

    // Build a local video object that the VideosPage can render immediately
    const blobUrl = recordedVideo?.url || (uploadedFile ? URL.createObjectURL(uploadedFile) : null);
    const localVideo = {
      id: videoId,
      video_title: videoTitle,
      title: videoTitle,
      description: videoDescription,
      video_description: videoDescription,
      video_url: blobUrl,
      videoUrl: blobUrl, // for VideosPage preview which expects video.videoUrl
      isLocal: true,
      // Mark as completed locally so the UI shows it as available immediately.
      // We'll track server-side processing separately via `serverProcessing` so
      // the UI doesn't show the 'processing' overlay while the upload is in
      // progress on the server.
      status: 'completed',
      serverProcessing: false,
      progress: 0,
      hashtags: hashtags,
      job_id: jobId || null,
      submitted_at: new Date().toISOString()
    };
    // Attach uploader role for local preview if selected
    if (selectedUploaderRole) {
      localVideo.uploaderRole = selectedUploaderRole;
      localVideo.uploader_role = selectedUploaderRole;
    }

    try {
      // Add to local context immediately so VideosPage can show the uploading item
      if (addLocalVideo) {
        addLocalVideo(localVideo);
      }

      // If not embedded, navigate to VideosPage immediately so user sees upload in list
      if (!embedded) {
        // Determine which role the user chose to upload as (default to selectedUploaderRole)
        const roleToUse = selectedUploaderRole || (Array.isArray(role) ? (role.includes('employer') ? 'employer' : role[0]) : role);
        const isEmployer = roleToUse && roleToUse.includes('employer');
        console.log('[VideoUpload] Navigation decision:', {
          role,
          isEmployer,
          targetUrl: isEmployer ? '/employer-tabs?group=companyContent&tab=company-videos' : '/jobseeker-tabs?group=profileContent&tab=my-videos'
        });
        if (isEmployer) {
          navigate('/employer-tabs?group=companyContent&tab=company-videos');
        } else {
          navigate('/jobseeker-tabs?group=profileContent&tab=my-videos');
        }
      }

      // Prepare form data for upload
      const formData = new FormData();
      formData.append('video', recordedVideo?.blob || uploadedFile);
      formData.append('title', videoTitle);
      formData.append('description', videoDescription);
      formData.append('category', videoCategory);
      formData.append('hashtags', JSON.stringify(hashtags));
      formData.append('privacy', privacy);
      if (jobId) formData.append('jobId', jobId);
      if (selectedUploaderRole) formData.append('uploaderRole', selectedUploaderRole);
      formData.append('videoId', videoId);

      // Start upload in background and update context with progress
      uploadVideo(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
        if (updateVideoStatus) {
          updateVideoStatus(videoId, {
            status: 'uploading',
            progress: percentCompleted
          });
        }
      })
      .then((response) => {
        if (response.data && (response.data.uploadId || response.data.video?.id)) {
          const serverId = response.data.uploadId || response.data.video?.id;

          // Transition the temp/local ID to the server-provided ID and mark processing
          if (updateVideoServerId) {
            // Transition temp id -> server id but don't mark the item as visually
            // 'processing' (which would show an overlay). Instead set
            // `serverProcessing: true` so the UI can keep the uploaded look but
            // optionally show a subtle border or indicator.
            updateVideoServerId(videoId, serverId, {
              serverProcessing: true,
              isLocal: true,
              progress: 100,
              job_id: response.data.jobId || jobId || null
            });
          }

          // If server returned an uploadId, start polling server-side upload status
          if (response.data.uploadId) {
            // Clear any existing poll
            if (uploadPollRef.current) {
              clearInterval(uploadPollRef.current);
            }

            const uploadId = response.data.uploadId;
            // Poll every 1s
            uploadPollRef.current = setInterval(async () => {
              try {
                const statusRes = await checkUploadStatus(uploadId);
                const statusData = statusRes.data || {};
                const status = statusData.status || '';
                const progress = statusData.progress ?? 0;

                // Update local context/progress
                if (updateVideoStatus) {
                  // Keep the UI showing the video as uploaded locally. Use
                  // serverProcessing to indicate backend processing where needed.
                  updateVideoStatus(videoId, {
                    serverProcessing: status === 'processing' || status === 'uploading',
                    status: status === 'completed' ? 'completed' : (status === 'failed' ? 'failed' : 'completed'),
                    progress
                  });
                }

                // If completed, reconcile server id (if returned) and stop polling
                if (status === 'completed') {
                  if (statusData.video && updateVideoServerId) {
                    const returnedId = statusData.video.id || statusData.video.videoId || uploadId;
                    // Finalize the transition to the server-provided ID and
                    // update the video URL to the canonical server URL.
                    updateVideoServerId(videoId, returnedId, { status: 'completed', progress: 100, isLocal: false, serverProcessing: false, video_url: statusData.video.secure_url || statusData.video.video_url || statusData.video.videoUrl || null, videoUrl: statusData.video.secure_url || statusData.video.video_url || statusData.video.videoUrl || null });
                  } else if (updateVideoStatus) {
                    updateVideoStatus(videoId, { status: 'completed', progress: 100, serverProcessing: false });
                  }
                  clearInterval(uploadPollRef.current);
                  uploadPollRef.current = null;
                }

                if (status === 'failed') {
                  if (updateVideoStatus) updateVideoStatus(videoId, { status: 'failed', progress: 0 });
                  clearInterval(uploadPollRef.current);
                  uploadPollRef.current = null;
                }
              } catch (err) {
                // keep polling on transient errors; log for debug
                console.error('Error polling upload status:', err?.message || err);
              }
            }, 1000);
          }

          // Optionally call onComplete with server video data
          if (onComplete && response.data.video) {
            onComplete(response.data.video);
          }

          toast({
            title: "Upload started",
            description: "Video uploaded and is being processed. It will appear when ready.",
          });
        } else if (response.data && response.data.success) {
          // Fallback if server returns success without id — mark serverProcessing
          // so the UI keeps the uploaded look while backend works.
          if (updateVideoStatus) {
            updateVideoStatus(videoId, { serverProcessing: true, progress: 100, status: 'completed' });
          }
          toast({ title: 'Upload started', description: 'Video is processing.' });
        }
      })
      .catch((error) => {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: error.response?.data?.message || "Failed to upload video",
          variant: "destructive",
        });
        if (updateVideoStatus) {
          updateVideoStatus(videoId, {
            status: 'failed',
            error: error.message,
            isLocal: true
          });
        }
      })
      .finally(() => {
        setIsUploading(false);
      });

      // If embedded, reset the form after starting upload
      if (embedded) {
        resetForm();
      }
    } catch (error) {
      console.error('Upload error (sync):', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video",
        variant: "destructive",
      });
      if (updateVideoStatus) {
        updateVideoStatus(videoId, {
          status: 'failed',
          error: error.message
        });
      }
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setRecordedVideo(null);
    setUploadedFile(null);
    setVideoTitle('');
    setVideoDescription('');
    setVideoCategory('');
    setHashtags([]);
    setHashtagInput('');
    setUploadProgress(0);
    setRecordingTime(0);
    stopCamera();
  };

  const discardVideo = () => {
    if (recordedVideo?.url) {
      URL.revokeObjectURL(recordedVideo.url);
    }
    resetForm();
  };

  if (limitReached) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />{i18n.t('auto_upload_limit_reached')}</CardTitle>
            <CardDescription className="text-red-600">
              You have reached the maximum number of videos allowed for your current plan ({uploadLimit?.limit}).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-700">
              Upgrade your subscription to upload more videos and unlock premium features.
            </p>
            <Button 
              onClick={() => navigate('/pricing')} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >{i18n.t('auto_upgrade_plan')}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 ${embedded ? 'p-0' : ''}`}>
      {/* Header */}
      {!embedded && (
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />{i18n.t('auto_back')}</Button>
          <h1 className={`${themeColors.text.gradient} text-4xl font-bold  mb-2`}>{i18n.t('auto_upload_video')}</h1>
          <p className="text-muted-foreground">{i18n.t('auto_record_a_new_video_or_upload_an_existing')}</p>
        </div>
      )}

      {/* Method Selection */}
      {!recordedVideo && !uploadedFile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Button
            variant={uploadMethod === 'record' ? 'default' : 'outline'}
            className="h-24 text-lg"
            onClick={() => setUploadMethod('record')}
          >
            <Video className="h-6 w-6 mr-3" />{i18n.t('auto_record_video')}</Button>
          <Button
            variant={uploadMethod === 'upload' ? 'default' : 'outline'}
            className="h-24 text-lg"
            onClick={() => setUploadMethod('upload')}
          >
            <Upload className="h-6 w-6 mr-3" />{i18n.t('auto_upload_video')}</Button>
        </div>
      )}

      {/* Recording / Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Preview/Recording */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle>
              {uploadMethod === 'record' ? 'Camera' : 'Video File'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Element */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {uploadMethod === 'record' && !recordedVideo ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />
              ) : recordedVideo ? (
                <video
                  src={recordedVideo.url}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <Upload className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">{i18n.t('auto_no_video_selected')}</p>
                  </div>
                </div>
              )}

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
                </div>
              )}
            </div>

            {/* Controls */}
            {!recordedVideo && uploadMethod === 'record' && (
              <div className="space-y-3">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className={`${themeColors.buttons.primary} text-white w-full `}
                  >
                    <Video className="h-4 w-4 mr-2" />{i18n.t('auto_start_recording')}</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={isPaused ? resumeRecording : pauseRecording}
                      variant="outline"
                      className="flex-1"
                    >
                      {isPaused ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />{i18n.t('auto_resume')}</>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 mr-2" />{i18n.t('auto_pause')}</>
                      )}
                    </Button>
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Square className="h-4 w-4 mr-2" />{i18n.t('auto_stop')}</Button>
                  </div>
                )}

                {streamRef.current && (
                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    variant="outline"
                    className="w-full"
                  >
                    {isMuted ? (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />{i18n.t('auto_unmute')}</>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />{i18n.t('auto_mute_1')}</>
                    )}
                  </Button>
                )}
              </div>
            )}

            {!recordedVideo && uploadMethod === 'upload' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className={`${themeColors.buttons.primary} text-white w-full `}
                >
                  <Upload className="h-4 w-4 mr-2" />{i18n.t('auto_choose_video_file')}</Button>
              </div>
            )}

            {recordedVideo && (
              <div className="flex gap-2">
                <Button
                  onClick={discardVideo}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />{i18n.t('auto_record_again')}</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Details Form */}
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader>
            <CardTitle>{i18n.t('auto_video_details')}</CardTitle>
            <CardDescription>{i18n.t('auto_add_information_about_your_video')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder={i18n.t('auto_enter_video_title')} 
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{i18n.t('auto_description')}</Label>
              <Textarea
                id="description"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder={i18n.t('auto_describe_your_video')} 
                rows={4}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">{i18n.t('auto_category')}</Label>
              <Select value={videoCategory} onValueChange={setVideoCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={i18n.t('auto_select_category')}  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="introduction">{i18n.t('auto_introduction')}</SelectItem>
                  <SelectItem value="skills">{i18n.t('auto_skills_demo')}</SelectItem>
                  <SelectItem value="experience">{i18n.t('auto_experience')}</SelectItem>
                  <SelectItem value="portfolio">{i18n.t('auto_portfolio')}</SelectItem>
                  <SelectItem value="other">{i18n.t('auto_other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <Label htmlFor="hashtags">{i18n.t('auto_hashtags')}</Label>
              <div className="flex gap-2">
                <Input
                  id="hashtags"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHashtag();
                    }
                  }}
                  placeholder={i18n.t('auto_add_hashtag_and_press_enter')} 
                />
                <Button onClick={addHashtag} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    #{tag}
                    <button onClick={() => removeHashtag(tag)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div className="space-y-2">
              <Label htmlFor="privacy">{i18n.t('auto_privacy')}</Label>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">{i18n.t('auto_public')}</SelectItem>
                  <SelectItem value="private">{i18n.t('auto_private')}</SelectItem>
                  <SelectItem value="unlisted">{i18n.t('auto_unlisted')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload as (role) */}
            {Array.isArray(role) && role.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="uploaderRole">{i18n.t('auto_upload_as')}</Label>
                <Select value={selectedUploaderRole} onValueChange={setSelectedUploaderRole}>
                  {role.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </Select>
              </div>
            )}

            {/* Job ID (if applicable) */}
            {Array.isArray(role) && (role.includes('jobseeker') || role.includes('job_seeker')) && (
              <div className="space-y-2">
                <Label htmlFor="jobId">{i18n.t('auto_job_application_optional')}</Label>
                <Input
                  id="jobId"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  placeholder={i18n.t('auto_enter_job_id_if_applying')} 
                />
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{i18n.t('auto_uploading')}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSaveVideo}
              disabled={isUploading || (!recordedVideo && !uploadedFile)}
              className={`${themeColors.buttons.primary} text-white w-full `}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />{i18n.t('auto_save_video')}</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
