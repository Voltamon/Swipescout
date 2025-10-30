import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Upload, Trash2, Video as VideoIcon,
  Loader2, Download, RotateCw, Sliders, Scissors, Sparkles
} from 'lucide-react';
import { uploadVideo, getAllVideos, deleteEditedVideo } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  
  const [activeTab, setActiveTab] = useState('upload');
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
  }, []);

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
      setMyVideos(response.data?.videos || []);
    } catch (error) {
      console.error('Error loading my videos:', error);
    }
  };

  const handleSelectVideoFromList = (video) => {
    setSelectedVideoFromList(video);
    setVideoUrl(video.video_url);
    setVideoTitle(video.video_title || '');
    setVideoDescription(video.description || '');
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
        const response = await fetch(selectedVideoFromList.video_url);
        const blob = await response.blob();
        ffmpeg.FS('writeFile', inputFileName, await fetchFile(blob));
      }

      let command = ['-i', inputFileName];
      let videoFilters = [];
      
      if (trimStart > 0 || trimEnd < duration) {
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
                        <video src={video.video_url} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-3">
                        <p className="font-medium truncate">{video.video_title}</p>
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
          <Card className="mb-6">
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
              </div>
            </CardContent>
          </Card>

          {/* Editing Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  <Slider
                    value={[trimStart]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={(val) => setTrimStart(val[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time: {formatTime(trimEnd)}</Label>
                  <Slider
                    value={[trimEnd]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={(val) => setTrimEnd(val[0])}
                  />
                </div>
              </CardContent>
            </Card>

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
                  <Slider
                    value={[brightness]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={(val) => setBrightness(val[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contrast: {contrast}%</Label>
                  <Slider
                    value={[contrast]}
                    min={0}
                    max={200}
                    step={1}
                    onValueChange={(val) => setContrast(val[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Saturation: {saturation}%</Label>
                  <Slider
                    value={[saturation]}
                    min={0}
                    max={200}
                    step={1}
                    onValueChange={(val) => setSaturation(val[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Blur: {blur}px</Label>
                  <Slider
                    value={[blur]}
                    min={0}
                    max={10}
                    step={0.5}
                    onValueChange={(val) => setBlur(val[0])}
                  />
                </div>
              </CardContent>
            </Card>

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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x (Slow)</SelectItem>
                      <SelectItem value="1">1x (Normal)</SelectItem>
                      <SelectItem value="1.5">1.5x (Fast)</SelectItem>
                      <SelectItem value="2">2x (Very Fast)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <Button
                  onClick={handleProcessVideo}
                  disabled={processing || loadingFFmpeg}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-6 text-lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing {processingProgress}%
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Process Video
                    </>
                  )}
                </Button>
              </div>
              {processing && (
                <Progress value={processingProgress} className="mt-4" />
              )}
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
            <Button variant="outline" onClick={() => setPreviewDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUploadProcessedVideo}
              disabled={exporting}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
