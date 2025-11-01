import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadVideo, saveVideoMetadata } from '@/services/videoService';
import { checkUploadStatus } from '@/services/api';
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
  RefreshCw
} from 'lucide-react';
import themeColors from '@/config/theme-colors';

export default function VideoUpload({ newjobid, onComplete, onStatusChange, embedded }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role } = useAuth();
  const { addLocalVideo, updateVideoStatus } = useVideoContext();
  
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

  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

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

    try {
      // Add to local context immediately
      if (addLocalVideo) {
        addLocalVideo({
          id: videoId,
          title: videoTitle,
          description: videoDescription,
          status: 'uploading',
          progress: 0
        });
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('video', recordedVideo?.blob || uploadedFile);
      formData.append('title', videoTitle);
      formData.append('description', videoDescription);
      formData.append('category', videoCategory);
      formData.append('hashtags', JSON.stringify(hashtags));
      formData.append('privacy', privacy);
      if (jobId) formData.append('jobId', jobId);
      formData.append('videoId', videoId);

      // Upload video
      const response = await uploadVideo(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
        
        if (updateVideoStatus) {
          updateVideoStatus(videoId, {
            status: 'uploading',
            progress: percentCompleted
          });
        }
      });

      if (response.data.success) {
        toast({
          title: "Success!",
          description: "Video uploaded successfully",
        });

        if (updateVideoStatus) {
          updateVideoStatus(videoId, {
            status: 'completed',
            progress: 100
          });
        }

        if (onComplete) {
          onComplete(response.data.video);
        }

        if (!embedded) {
          setTimeout(() => {
            navigate('/jobseeker-tabs?group=videos&tab=my-videos');
          }, 1500);
        } else {
          // Reset form
          resetForm();
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || "Failed to upload video",
        variant: "destructive",
      });

      if (updateVideoStatus) {
        updateVideoStatus(videoId, {
          status: 'failed',
          error: error.message
        });
      }
    } finally {
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

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      {/* Header */}
      {!embedded && (
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className={`${themeColors.text.gradient} text-4xl font-bold  mb-2`}>
            Upload Video
          </h1>
          <p className="text-muted-foreground">
            Record a new video or upload an existing one
          </p>
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
            <Video className="h-6 w-6 mr-3" />
            Record Video
          </Button>
          <Button
            variant={uploadMethod === 'upload' ? 'default' : 'outline'}
            className="h-24 text-lg"
            onClick={() => setUploadMethod('upload')}
          >
            <Upload className="h-6 w-6 mr-3" />
            Upload Video
          </Button>
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
                    <p className="text-sm opacity-75">No video selected</p>
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
                    <Video className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={isPaused ? resumeRecording : pauseRecording}
                      variant="outline"
                      className="flex-1"
                    >
                      {isPaused ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
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
                        <MicOff className="h-4 w-4 mr-2" />
                        Unmute
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Mute
                      </>
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
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Video File
                </Button>
              </div>
            )}

            {recordedVideo && (
              <div className="flex gap-2">
                <Button
                  onClick={discardVideo}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Record Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Details Form */}
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
            <CardDescription>Add information about your video</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter video title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Describe your video..."
                rows={4}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={videoCategory} onValueChange={setVideoCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="introduction">Introduction</SelectItem>
                  <SelectItem value="skills">Skills Demo</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <Label htmlFor="hashtags">Hashtags</Label>
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
                  placeholder="Add hashtag and press Enter"
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
              <Label htmlFor="privacy">Privacy</Label>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job ID (if applicable) */}
            {role === 'jobseeker' && (
              <div className="space-y-2">
                <Label htmlFor="jobId">Job Application (Optional)</Label>
                <Input
                  id="jobId"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  placeholder="Enter Job ID if applying"
                />
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
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
                  <Save className="h-4 w-4 mr-2" />
                  Save Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
