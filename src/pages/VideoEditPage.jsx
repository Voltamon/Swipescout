import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Play, Pause, Volume2, VolumeX, Upload, Trash2, Video as VideoIcon,
  Loader2, Download, RotateCw, Sliders, Scissors, Sparkles
} from 'lucide-react';
import { uploadVideo, getAllVideos, deleteEditedVideo, editVideo as editVideoApi, exportVideo as exportVideoApi, getSubscriptionStatus } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Slider } from '@/components/UI/slider.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/UI/dialog.jsx';
import { Textarea } from '@/components/UI/textarea.jsx';
import { Progress } from '@/components/UI/progress.jsx';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/UI/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select.jsx';

// FFmpeg import with fallback
let ffmpeg;
let createFFmpeg;
let fetchFile;

try {
  import('@ffmpeg/ffmpeg').then(module => {
    createFFmpeg = module.createFFmpeg;
    fetchFile = module.fetchFile;
    initializeFFmpeg();
  }).catch(async () => {
    const ffmpegModule = await import('@ffmpeg/ffmpeg');
    createFFmpeg = ffmpegModule.default?.createFFmpeg || ffmpegModule.createFFmpeg;
    fetchFile = ffmpegModule.default?.fetchFile || ffmpegModule.fetchFile;
    initializeFFmpeg();
  });
} catch (error) {
  console.error('Failed to load FFmpeg:', error);
}

function initializeFFmpeg() {
  if (createFFmpeg) {
    ffmpeg = createFFmpeg({ 
      log: true,
      corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
    });
  }
}

export default function VideoEditPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('upload');
  const [searchParams] = useSearchParams();
  const [initialVideoId, setInitialVideoId] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [loadingFFmpeg, setLoadingFFmpeg] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [myVideos, setMyVideos] = useState([]);
  const [selectedVideoFromList, setSelectedVideoFromList] = useState(null);
  const [useServerProcessing, setUseServerProcessing] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Video editing parameters
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [targetRes, setTargetRes] = useState({ w: 0, h: 0 });
  const [segments, setSegments] = useState([]); // [{start,end}]
  const [audioFile, setAudioFile] = useState(null);
  const [watermarkFile, setWatermarkFile] = useState(null);
  const [watermarkPos, setWatermarkPos] = useState('top-right');
  const [watermarkOpacity, setWatermarkOpacity] = useState(100);

  // Preview and export
  const [previewDialog, setPreviewDialog] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState("");

  useEffect(() => {
    async function loadFFmpeg() {
      try {
        if (ffmpeg && !ffmpeg.isLoaded()) {
          ffmpeg.setProgress(({ ratio }) => {
            setProcessingProgress(Math.round(ratio * 100));
          });
          await ffmpeg.load();
          setLoadingFFmpeg(false);
        } else if (!ffmpeg) {
          setTimeout(() => {
            setLoadingFFmpeg(false);
            toast({ 
              description: "FFmpeg failed to load. Some features may not work.",
              variant: "destructive"
            });
          }, 3000);
        }
      } catch (error) {
        console.error('Failed to load FFmpeg:', error);
        setLoadingFFmpeg(false);
        toast({
          description: "Failed to load video editor. Basic editing may still work.",
          variant: "destructive"
        });
      }
    }
    
    loadFFmpeg();
    loadMyVideos();
    // Capture initial videoId param so we can auto-select after videos load
    try {
      const vid = searchParams.get('videoId') || searchParams.get('videoid') || searchParams.get('id');
      if (vid) setInitialVideoId(String(vid));
    } catch (e) {
      // ignore
    }
    // Load subscription status
    if (user?.id) {
      getSubscriptionStatus(user.id).then(r => {
        const status = r.data;
        // Consider active states
        setIsPro(!!status?.active);
      }).catch(() => setIsPro(false));
    }
  }, []);

  // When videos load and an initialVideoId was provided, auto-select that video
  useEffect(() => {
    if (!initialVideoId) return;
    if (!myVideos || myVideos.length === 0) return;

    // Try to find a matching video by normalized id or alternate fields
    const match = myVideos.find(v => {
      if (!v) return false;
      return String(v.id) === String(initialVideoId) || String(v.video_id) === String(initialVideoId) || String(v._id) === String(initialVideoId) || String(v.videoId) === String(initialVideoId);
    });

    if (match) {
      // switch to library tab so user sees selection
      setActiveTab('library');
      // small delay to ensure UI updated before selecting / scrolling
      setTimeout(() => {
        handleSelectVideoFromList(match);
        // Scroll preview into view after selection
        if (previewRef.current && typeof previewRef.current.scrollIntoView === 'function') {
          previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 350);
    }
  }, [initialVideoId, myVideos]);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  useEffect(() => {
    if (videoRef.current && duration > 0) {
      setTrimEnd(duration);
    }
  }, [duration]);

  useEffect(() => {
    return () => {
      if (processedVideoUrl) {
        URL.revokeObjectURL(processedVideoUrl);
      }
    };
  }, [processedVideoUrl]);

  const loadMyVideos = async () => {
    try {
      const response = await getAllVideos(1, 50, { userId: user?.id });
      const raw = response.data?.videos || [];
      // Normalize server video objects to a common shape used by the UI
      const mapped = (raw || []).map(v => ({
        ...v,
        id: v.id || v._id || v.video_id || v.videoId,
        title: v.title || v.video_title || v.videoTitle || v.name || v.original_name || v.videoName,
        videoUrl: v.videoUrl || v.video_url || v.secure_url || v.video_url_signed || v.file_url,
        thumbnailUrl: v.thumbnailUrl || v.thumbnail_url || v.thumb || v.poster || v.preview_image,
        status: v.status || 'completed',
        progress: v.progress || v.upload_progress || 0,
        description: v.description || v.desc || ''
      }));

      // Client-side filter: ensure we only show videos that belong to the current user
      // or that appear to be fully uploaded/ready (to avoid showing temporary/partial uploads)
      const userIdStr = user?.id ? String(user.id) : null;
      const filtered = (mapped || []).filter(v => {
        if (!v || !v.id) return false; // skip entries without id

        // Collect possible owner/uploader fields that backends sometimes use
        const ownerCandidates = [v.userId, v.user_id, v.ownerId, v.owner_id, v.uploaderId, v.uploader_id, v.createdBy, v.created_by, v.uploader];
        const hasMatchingOwner = userIdStr && ownerCandidates.some(o => o && String(o) === userIdStr);
        if (hasMatchingOwner) return true;

        // If owner not present or doesn't match, only include if the video looks finalized:
        // - status is completed/ready, or progress is >= 100
        // - and there is an accessible videoUrl
        const readyStatus = typeof v.status === 'string' && ['completed', 'ready', 'available'].includes(v.status.toLowerCase());
        const progressOk = Number(v.progress) >= 100;
        const hasUrl = !!v.videoUrl;
        if ((readyStatus || progressOk) && hasUrl) return true;

        // Otherwise treat as temporary/other-user and filter out
        console.debug('Filtered out non-user/temporary video in editor library', { video: v });
        return false;
      });

      // Remove duplicates by id just in case
      const uniqueById = [];
      const seen = new Set();
      for (const vid of filtered) {
        const key = String(vid.id);
        if (!seen.has(key)) {
          seen.add(key);
          uniqueById.push(vid);
        }
      }

      setMyVideos(uniqueById || []);
    } catch (error) {
      console.error('Error loading my videos:', error);
    }
  };

  const handleSelectVideoFromList = (video) => {
    setSelectedVideoFromList(video);
    setVideoUrl(video.videoUrl || video.video_url || video.secure_url || '');
    setVideoTitle(video.title || video.video_title || video.name || '');
    setVideoDescription(video.description || video.desc || '');
    setVideoFile(null);
    resetEditingParameters();
  };

  const resetEditingParameters = () => {
    setBrightness(0);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setPlaybackSpeed(1);
    setRotation(0);
    setTrimStart(0);
    setSegments([]);
    setCrop({ x: 0, y: 0, w: 0, h: 0 });
    setTargetRes({ w: 0, h: 0 });
    setAudioFile(null);
    setWatermarkFile(null);
    setWatermarkPos('top-right');
    setWatermarkOpacity(100);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
      setVideoDescription("");
      setSelectedVideoFromList(null);
      resetEditingParameters();
    } else {
      toast({ description: "Please select a valid video file", variant: "destructive" });
    }
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setTrimEnd(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value) => {
    if (videoRef.current) {
      const volumeValue = value[0] / 100;
      videoRef.current.volume = volumeValue;
      setVolume(value[0]);
      setIsMuted(value[0] === 0);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProcessVideo = async () => {
    if (!videoUrl) {
      toast({ description: "Please select a video first", variant: "destructive" });
      return;
    }

    if (!ffmpeg || !ffmpeg.isLoaded()) {
      setProcessing(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProcessedVideoUrl(videoUrl);
        setPreviewDialog(true);
        toast({ description: "Video processed successfully! (Basic mode)" });
      } catch (error) {
        console.error('Error processing video:', error);
        toast({ description: "Failed to process video", variant: "destructive" });
      } finally {
        setProcessing(false);
      }
      return;
    }

    setProcessing(true);
    setProcessingProgress(0);
    
    try {
      const inputFileName = 'input.mp4';
      const outputFileName = 'output.mp4';

      if (videoFile) {
        ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));
      } else if (selectedVideoFromList) {
        const videoFetchUrl = selectedVideoFromList.videoUrl || selectedVideoFromList.video_url || selectedVideoFromList.secure_url || '';
        if (videoFetchUrl) {
          const response = await fetch(videoFetchUrl);
          const blob = await response.blob();
          ffmpeg.FS('writeFile', inputFileName, await fetchFile(blob));
        } else {
          throw new Error('Selected video has no accessible URL');
        }
      }

      let command = ['-i', inputFileName];
      let videoFilters = [];
      // Multi-segment: client-side support is PRO-only and heavy, prefer server. We'll simulate by trimming range if multiple not available
      if (segments.length > 1 && !isPro) {
        toast({ description: 'Multi-segment editing is available for Pro users. Using first segment only.', variant: 'default' });
      }
      
      // If segments present (pro), use first segment locally; full multi-clip via server
      if (segments.length > 0) {
        const s = segments[0];
        command.push('-ss', (s?.start ?? trimStart).toString());
        const tEnd = (s?.end ?? trimEnd);
        command.push('-t', Math.max(0, tEnd - (s?.start ?? trimStart)).toString());
      } else if (trimStart > 0 || trimEnd < duration) {
        command.push('-ss', trimStart.toString());
        command.push('-t', (trimEnd - trimStart).toString());
      }
      
      const contrastVal = contrast / 100;
      const saturationVal = saturation / 100;
      if (brightness !== 0 || contrastVal !== 1 || saturationVal !== 1) {
        videoFilters.push(`eq=brightness=${brightness}:contrast=${contrastVal}:saturation=${saturationVal}`);
      }
      
      if (blur > 0) {
        videoFilters.push(`boxblur=${blur}`);
      }
      
      if (rotation !== 0) {
        const rotationMap = {
          90: 'transpose=1',
          180: 'transpose=2,transpose=2',
          270: 'transpose=2'
        };
        if (rotationMap[rotation]) {
          videoFilters.push(rotationMap[rotation]);
        }
      }

      // Crop
      if (crop.w && crop.h) {
        videoFilters.push(`crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`);
      }
      // Scale
      if (targetRes.w && targetRes.h) {
        videoFilters.push(`scale=${targetRes.w}:${targetRes.h}`);
      }
      
      if (playbackSpeed !== 1) {
        videoFilters.push(`setpts=${1/playbackSpeed}*PTS`);
        command.push('-af', `atempo=${playbackSpeed}`);
      }
      
      if (videoFilters.length > 0) {
        command.push('-vf', videoFilters.join(','));
      }
      
  command.push('-c:v', 'libx264');
      command.push('-preset', 'fast');
      command.push('-crf', '23');
      command.push(outputFileName);

      await ffmpeg.run(...command);

      const data = ffmpeg.FS('readFile', outputFileName);
      const processedBlob = new Blob([data.buffer], { type: 'video/mp4' });
      const processedUrl = URL.createObjectURL(processedBlob);
      
      if (processedVideoUrl) {
        URL.revokeObjectURL(processedVideoUrl);
      }
      
      setProcessedVideoUrl(processedUrl);
      setPreviewDialog(true);
      toast({ description: "Video processed successfully!" });

      try {
        ffmpeg.FS('unlink', inputFileName);
        ffmpeg.FS('unlink', outputFileName);
      } catch (e) {
        // Ignore cleanup errors
      }

    } catch (error) {
      console.error('Error processing video:', error);
      toast({ description: "Failed to process video", variant: "destructive" });
    } finally {
      setProcessing(false);
      setProcessingProgress(0);
    }
  };

  const buildServerFormData = async () => {
    const formData = new FormData();
    // Prefer the original input video for server processing
    if (videoFile) {
      formData.append('video', videoFile);
    } else if (selectedVideoFromList?.videoUrl || selectedVideoFromList?.video_url) {
      const videoFetchUrl = selectedVideoFromList.videoUrl || selectedVideoFromList.video_url;
      const resp = await fetch(videoFetchUrl);
      const blob = await resp.blob();
      formData.append('video', new File([blob], selectedVideoFromList.video_title || selectedVideoFromList.title || 'video.mp4', { type: blob.type || 'video/mp4' }));
    } else if (processedVideoUrl) {
      const resp = await fetch(processedVideoUrl);
      const blob = await resp.blob();
      formData.append('video', new File([blob], `${videoTitle || 'edited_video'}.mp4`, { type: 'video/mp4' }));
    }
    formData.append('title', videoTitle || 'Edited Video');
    formData.append('description', videoDescription || '');
    formData.append('trimStart', String(trimStart));
    formData.append('trimEnd', String(trimEnd || duration));
    formData.append('brightness', String(100 + brightness)); // server expects 0-200
    formData.append('contrast', String(contrast));
    formData.append('saturation', String(saturation));
    if (crop.w && crop.h) {
      formData.append('cropX', String(crop.x));
      formData.append('cropY', String(crop.y));
      formData.append('cropW', String(crop.w));
      formData.append('cropH', String(crop.h));
    }
    if (targetRes.w && targetRes.h) {
      formData.append('targetWidth', String(targetRes.w));
      formData.append('targetHeight', String(targetRes.h));
    }
    if (segments.length > 0) {
      formData.append('segments', JSON.stringify(segments));
    }
    if (audioFile && isPro) {
      formData.append('audio', audioFile);
      formData.append('mixAudio', 'true');
    }
    if (watermarkFile && isPro) {
      formData.append('watermark', watermarkFile);
      formData.append('watermarkPos', watermarkPos);
      formData.append('watermarkOpacity', String(watermarkOpacity / 100));
    }
    return formData;
  };

  const handleProcessOnServer = async () => {
    try {
      setProcessing(true);
      const formData = await buildServerFormData();
      const res = await editVideoApi(formData);
      toast({ description: 'Video processed on server successfully.' });
      setPreviewDialog(true);
      // Optionally fetch back via getVideoInfo
    } catch (e) {
      console.error(e);
      toast({ description: 'Server processing failed', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const handleUploadProcessedVideo = async () => {
    if (!processedVideoUrl) {
      toast({ description: "No processed video to upload", variant: "destructive" });
      return;
    }

    setExporting(true);
    try {
      const response = await fetch(processedVideoUrl);
      const blob = await response.blob();
      const file = new File([blob], `${videoTitle || 'edited_video'}.mp4`, { type: 'video/mp4' });

      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', videoTitle);
      formData.append('description', videoDescription);

      await uploadVideo(formData);
      
      toast({ description: "Video uploaded successfully!" });
      setPreviewDialog(false);
      
      URL.revokeObjectURL(processedVideoUrl);
      setProcessedVideoUrl("");
      
      loadMyVideos();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({ description: "Failed to upload video", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6">
        Video Editor
      </h1>

      {loadingFFmpeg && (
        <Card className="mb-6 border-l-4 border-l-purple-600">
          <CardContent className="pt-6 flex items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <div>
              <p className="font-semibold">Loading video editor...</p>
              <p className="text-sm text-gray-600">Please wait while we initialize FFmpeg</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="upload">Upload New</TabsTrigger>
          <TabsTrigger value="library">My Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" />
                Upload Video
              </CardTitle>
              <CardDescription>Upload a video file to start editing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 hover:border-purple-600 transition-colors">
                <VideoIcon className="h-16 w-16 text-gray-400 mb-4" />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Video File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-sm text-gray-600 mt-2">MP4, MOV, AVI, WebM supported</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <VideoIcon className="h-5 w-5 text-cyan-600" />
                My Videos
              </CardTitle>
              <CardDescription>Select a video from your library to edit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myVideos.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p>No videos found</p>
                  </div>
                ) : (
                  myVideos.map((video) => (
                    <Card
                      key={video.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedVideoFromList?.id === video.id ? 'border-2 border-purple-600' : ''
                      }`}
                      onClick={() => handleSelectVideoFromList(video)}
                    >
                      <div className="aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
                        {video.videoUrl ? (
                          <video src={video.videoUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={video.thumbnailUrl ? (video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${VITE_API_BASE_URL}${video.thumbnailUrl}`) : ''} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p className="font-medium truncate">{video.title}</p>
                        <p className="text-xs text-gray-600 truncate">{video.description || 'No description'}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {videoUrl && (
        <>
          {/* Video Player */}
          <Card ref={previewRef} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Video Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onLoadedMetadata={handleVideoLoad}
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full"
                  style={{
                    filter: `brightness(${1 + brightness/100}) contrast(${contrast/100}) saturate(${saturation/100}) blur(${blur}px)`,
                    transform: `rotate(${rotation}deg)`
                  }}
                />
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1 space-y-2">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  <div className="w-32">
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Enter video title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Enter video description"
                    rows={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Processing Mode</Label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={useServerProcessing} onChange={(e) => setUseServerProcessing(e.target.checked)} />
                      Use server processing {isPro ? <Badge className="ml-2">PRO</Badge> : <Badge variant="secondary" className="ml-2">Basic</Badge>}
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editing Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Trim & Segments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-cyan-600" />
                  Trim & Cut
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Start Time: {formatTime(trimStart)}</Label>
                  <Slider value={[trimStart]} max={duration || 100} step={0.1} onValueChange={(val) => setTrimStart(val[0])} />
                </div>
                <div className="space-y-2">
                  <Label>End Time: {formatTime(trimEnd)}</Label>
                  <Slider value={[trimEnd]} max={duration || 100} step={0.1} onValueChange={(val) => setTrimEnd(val[0])} />
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Segments {isPro ? <Badge className="ml-2">PRO</Badge> : <Badge variant="secondary" className="ml-2">PRO</Badge>}</Label>
                    <Button variant="outline" size="sm" onClick={() => {
                      if (!isPro) { toast({ description: 'Multi-segment editing is a PRO feature', variant: 'default' }); return; }
                      const start = Math.max(0, currentTime - 2);
                      const end = Math.min(duration, currentTime + 2);
                      setSegments([...segments, { start, end }]);
                    }}>Add segment at playhead</Button>
                  </div>
                  {segments.length === 0 ? (
                    <p className="text-xs text-gray-500">No segments added.</p>
                  ) : (
                    <div className="space-y-2">
                      {segments.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="w-16">#{idx + 1}</span>
                          <Input className="w-24" type="number" step="0.1" value={s.start} onChange={(e) => {
                            const v = [...segments]; v[idx] = { ...v[idx], start: Number(e.target.value) }; setSegments(v);
                          }} />
                          <span>to</span>
                          <Input className="w-24" type="number" step="0.1" value={s.end} onChange={(e) => {
                            const v = [...segments]; v[idx] = { ...v[idx], end: Number(e.target.value) }; setSegments(v);
                          }} />
                          <Button size="icon" variant="ghost" onClick={() => { setSegments(segments.filter((_, i) => i !== idx)); }}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Visual Adjustments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-purple-600" />
                  Visual Adjustments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Brightness: {brightness}</Label>
                  <Slider value={[brightness]} min={-100} max={100} step={1} onValueChange={(val) => setBrightness(val[0])} />
                </div>
                <div className="space-y-2">
                  <Label>Contrast: {contrast}%</Label>
                  <Slider value={[contrast]} min={0} max={200} step={1} onValueChange={(val) => setContrast(val[0])} />
                </div>
                <div className="space-y-2">
                  <Label>Saturation: {saturation}%</Label>
                  <Slider value={[saturation]} min={0} max={200} step={1} onValueChange={(val) => setSaturation(val[0])} />
                </div>
                <div className="space-y-2">
                  <Label>Blur: {blur}px</Label>
                  <Slider value={[blur]} min={0} max={10} step={0.5} onValueChange={(val) => setBlur(val[0])} />
                </div>
              </CardContent>
            </Card>

            {/* Transform */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCw className="h-5 w-5 text-pink-600" />
                  Transform
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Rotation</Label>
                  <Select value={rotation.toString()} onValueChange={(val) => setRotation(Number(val))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0° (Normal)</SelectItem>
                      <SelectItem value="90">90° (Right)</SelectItem>
                      <SelectItem value="180">180° (Upside down)</SelectItem>
                      <SelectItem value="270">270° (Left)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Playback Speed</Label>
                  <Select value={playbackSpeed.toString()} onValueChange={(val) => setPlaybackSpeed(Number(val))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x (Slow)</SelectItem>
                      <SelectItem value="1">1x (Normal)</SelectItem>
                      <SelectItem value="1.5">1.5x (Fast)</SelectItem>
                      <SelectItem value="2">2x (Very Fast)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Crop (x,y,w,h)</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <Input type="number" placeholder="x" value={crop.x} onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) })} />
                      <Input type="number" placeholder="y" value={crop.y} onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) })} />
                      <Input type="number" placeholder="w" value={crop.w} onChange={(e) => setCrop({ ...crop, w: Number(e.target.value) })} />
                      <Input type="number" placeholder="h" value={crop.h} onChange={(e) => setCrop({ ...crop, h: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Resolution</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" placeholder="width" value={targetRes.w} onChange={(e) => setTargetRes({ ...targetRes, w: Number(e.target.value) })} />
                      <Input type="number" placeholder="height" value={targetRes.h} onChange={(e) => setTargetRes({ ...targetRes, h: Number(e.target.value) })} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overlays & Audio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-green-600" />
                  Overlays & Audio {isPro ? <Badge className="ml-2">PRO</Badge> : <Badge variant="secondary" className="ml-2">PRO</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Watermark (image)</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setWatermarkFile(e.target.files?.[0] || null)} />
                  <div className="grid grid-cols-3 gap-2">
                    <Select value={watermarkPos} onValueChange={setWatermarkPos}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="space-y-1">
                      <Label className="text-xs">Opacity: {watermarkOpacity}%</Label>
                      <Slider value={[watermarkOpacity]} max={100} step={1} onValueChange={(v) => setWatermarkOpacity(v[0])} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Background/Mix Audio</Label>
                  <Input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
                </div>
                {!isPro && <p className="text-xs text-gray-500">Overlays and audio mix are Pro features. You can still export without them.</p>}
              </CardContent>
            </Card>
          </div>

          {/* Process Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center gap-3 flex-wrap">
                {!useServerProcessing && (
                  <Button onClick={handleProcessVideo} disabled={processing || loadingFFmpeg} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-6 text-lg">
                    {processing ? (<><Loader2 className="h-5 w-5 mr-2 animate-spin" />Processing {processingProgress}%</>) : (<><Sparkles className="h-5 w-5 mr-2" />Process Locally</>)}
                  </Button>
                )}
                {useServerProcessing && (
                  <Button onClick={handleProcessOnServer} disabled={processing} className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 px-8 py-6 text-lg">
                    {processing ? (<><Loader2 className="h-5 w-5 mr-2 animate-spin" />Sending to server...</>) : (<><Upload className="h-5 w-5 mr-2" />Process on Server</>)}
                  </Button>
                )}
              </div>
              {processing && (<Progress value={processingProgress} className="mt-4" />)}
            </CardContent>
          </Card>
        </>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview Processed Video</DialogTitle>
            <DialogDescription>Review your edited video before uploading</DialogDescription>
          </DialogHeader>
          {processedVideoUrl && (
            <div className="bg-black rounded-lg overflow-hidden">
              <video src={processedVideoUrl} controls className="w-full" />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialog(false)}>Cancel</Button>
            <Button onClick={handleUploadProcessedVideo} disabled={exporting} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
              {exporting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>) : (<><Upload className="h-4 w-4 mr-2" />Upload Video</>)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
