import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Play, Pause, Volume2, VolumeX, Upload, Trash2, Video as VideoIcon,
  Loader2, Download, RotateCw, Sliders, Scissors, Sparkles
} from 'lucide-react';
import { uploadVideoResume, getAllVideos, deleteEditedVideo, editVideo as editVideoApi, exportVideo as exportVideoApi, getSubscriptionStatus, getVideoInfo, updateUserVideo, deleteUserVideo, checkUploadStatus } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useVideoContext } from '@/contexts/VideoContext';
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
import { v4 as uuidv4 } from 'uuid';

// FFmpeg import with fallback
let ffmpeg;
let FFmpegClass;
let fetchFile;
let toBlobURL;

console.log('VideoEditPage: Starting FFmpeg import...');

try {
  import('@ffmpeg/ffmpeg').then(module => {
    console.log('FFmpeg module loaded successfully');
    FFmpegClass = module.FFmpeg;

    // Provide a lightweight fetchFile polyfill (works for Blob/File or remote URL)
    fetchFile = async (file) => {
      if (file instanceof File || file instanceof Blob) {
        return new Uint8Array(await file.arrayBuffer());
      }
      const response = await fetch(file);
      return new Uint8Array(await response.arrayBuffer());
    };

    // toBlobURL not required; rely on ffmpeg.load() defaults from @ffmpeg/core package
    initializeFFmpeg();
  }).catch(err => {
    console.error('Failed to load FFmpeg:', err);
  });
} catch (error) {
  console.error('Failed to load FFmpeg:', error);
}

function initializeFFmpeg() {
  console.log('initializeFFmpeg called, FFmpegClass exists:', !!FFmpegClass);
  if (FFmpegClass) {
    try {
      ffmpeg = new FFmpegClass();
      console.log('FFmpeg instance created:', ffmpeg);
    } catch (err) {
      console.error('Failed to create FFmpeg instance:', err);
    }
  } else {
    console.error('FFmpegClass is not available');
  }
}

export default function VideoEditPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addLocalVideo, updateVideoStatus, updateVideoServerId } = useVideoContext();
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
  const [wasJustProcessed, setWasJustProcessed] = useState(false);

  useEffect(() => {
    async function loadFFmpeg() {
      console.log('loadFFmpeg effect running, ffmpeg:', ffmpeg, 'loaded:', ffmpeg?.loaded);
      try {
        if (ffmpeg && !ffmpeg.loaded) {
          console.log('FFmpeg exists but not loaded, loading now...');

          // Create a load task that first tries a local-hosted core (public/ffmpeg),
          // then CDN, then finally the bundled default. We pre-check the local files
          // with `fetch` so we can log HTTP status and avoid calling `ffmpeg.load`
          // with a URL that will 404 or return the wrong MIME type which can hang.
          const loadTask = (async () => {
            const localCore = '/ffmpeg/ffmpeg-core.js';
            const localWasm = '/ffmpeg/ffmpeg-core.wasm';

            // Helper to try loading from a specific core + wasm pair and log details
            const tryLoad = async (coreURL, wasmURL, label) => {
              console.log(`Attempting to load FFmpeg core from ${label}:`, coreURL, wasmURL);
              try {
                await ffmpeg.load({ coreURL, wasmURL });
                console.log(`Loaded FFmpeg core from ${label}`);
                return true;
              } catch (err) {
                console.warn(`Load from ${label} failed:`, err);
                return false;
              }
            };

            // 1) Check local-core availability with a direct fetch so we can report
            // precise HTTP status and CORS problems before calling ffmpeg.load.
            try {
              const resp = await fetch(localCore, { method: 'GET' });
              console.log('Local core fetch response for', localCore, 'status=', resp.status, 'content-type=', resp.headers.get('content-type'));
              if (resp.ok) {
                // If local file exists, attempt load using it
                const ok = await tryLoad(localCore, localWasm, 'local path');
                if (ok) return;
                console.warn('Local core exists but ffmpeg.load failed for local path, will try CDN next');
              } else {
                console.warn('Local core not available (non-OK response), will try CDN. HTTP status:', resp.status);
              }
            } catch (fetchErr) {
              console.warn('Could not fetch local FFmpeg core (network/CORS/404):', fetchErr);
            }

            // 2) Try the CDN (pin to a specific known version). If CDN fails, fall back
            // to calling ffmpeg.load() without parameters (bundled/bundler provided assets).
            const cdnCore = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/ffmpeg-core.js';
            const cdnWasm = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/ffmpeg-core.wasm';
            const cdnOk = await tryLoad(cdnCore, cdnWasm, 'CDN');
            if (cdnOk) return;

            // 3) Final fallback - let @ffmpeg/ffmpeg decide (bundled worker). This
            // can still hang if the build environment doesn't include the worker files
            // or Vite rewrites them with wrong headers, but it's worth trying.
            try {
              console.log('Falling back to bundled ffmpeg.load() (no coreURL specified)');
              await ffmpeg.load();
              console.log('Loaded FFmpeg core via bundled loader');
              return;
            } catch (finalErr) {
              console.warn('Bundled ffmpeg.load() also failed:', finalErr);
              throw finalErr;
            }
          })();

          // Timeout guard: if load doesn't complete in a reasonable time, give up and
          // disable FFmpeg so the UI can continue in basic mode instead of being stuck.
          // Increase timeout to allow slower connections or local fetch checks
          const timeoutMs = 20000; // 20s
          try {
            await Promise.race([
              loadTask,
              new Promise((_, reject) => setTimeout(() => reject(new Error('FFmpeg load timeout')), timeoutMs))
            ]);
            console.log('FFmpeg loaded successfully!');
            setLoadingFFmpeg(false);
          } catch (loadErr) {
            console.error('FFmpeg failed to load (timeout or error):', loadErr);
            // Ensure we don't keep a partly-initialized ffmpeg instance around
            try { ffmpeg = null; } catch (e) { /* ignore */ }
            setLoadingFFmpeg(false);
            toast({
              description: 'FFmpeg failed to load or timed out. Editor will run in basic mode.',
              variant: 'destructive'
            });
          }

        } else if (!ffmpeg) {
          console.log('FFmpeg instance does not exist, waiting briefly then continuing in basic mode...');
          setTimeout(() => {
            console.log('FFmpeg still not available after delay, ffmpeg:', ffmpeg);
            setLoadingFFmpeg(false);
            toast({ 
              description: 'FFmpeg not available. Editor will run in basic mode.',
              variant: 'destructive'
            });
          }, 3000);
        } else {
          console.log('FFmpeg already loaded');
          setLoadingFFmpeg(false);
        }
      } catch (error) {
        console.error('Failed to load FFmpeg:', error);
        // Defensive: clear ffmpeg so other code falls back to basic mode
        try { ffmpeg = null; } catch (e) { /* ignore */ }
        setLoadingFFmpeg(false);
        toast({
          description: 'Failed to initialize video editor. Basic editing may still work.',
          variant: 'destructive'
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
        description: v.description || v.desc || '',
        updatedAt: v.updatedAt || v.updated_at || v.modifiedAt,
        createdAt: v.createdAt || v.created_at
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
    console.log('=== handleProcessVideo called ===');
    if (!videoUrl) {
      toast({ description: "Please select a video first", variant: "destructive" });
      return;
    }

    if (!ffmpeg || !ffmpeg.loaded) {
      // FFmpeg not available: show a live preview with the same CSS filters
      // applied so the user can inspect the edited look. Don't set
      // `processedVideoUrl` to the original source because that bypasses
      // the live preview and shows the unedited video.
      console.log('FFmpeg not loaded, opening live preview (basic mode)');
      setProcessing(true);
      try {
        // small delay to simulate processing and let UI update
        await new Promise(resolve => setTimeout(resolve, 800));
        // Ensure processedVideoUrl is empty so the preview dialog will render
        // the live preview branch (which applies the CSS filters)
        if (processedVideoUrl) {
          try { URL.revokeObjectURL(processedVideoUrl); } catch (e) { /* ignore */ }
        }
        setProcessedVideoUrl("");
        setPreviewDialog(true);
        toast({ description: "Preview opened (basic mode). Use server or install FFmpeg for real exports." });
      } catch (error) {
        console.error('Error opening live preview:', error);
        toast({ description: "Failed to open preview", variant: "destructive" });
      } finally {
        setProcessing(false);
      }
      return;
    }

    console.log('FFmpeg is loaded, starting real processing...');
    setProcessing(true);
    setProcessingProgress(0);
    
    try {
      const inputFileName = 'input.mp4';
      const outputFileName = 'output.mp4';

      console.log('Writing input file to FFmpeg...');
      if (videoFile) {
        await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile));
      } else if (selectedVideoFromList) {
        const videoFetchUrl = selectedVideoFromList.videoUrl || selectedVideoFromList.video_url || selectedVideoFromList.secure_url || '';
        if (videoFetchUrl) {
          const response = await fetch(videoFetchUrl);
          const blob = await response.blob();
          await ffmpeg.writeFile(inputFileName, await fetchFile(blob));
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
      // Frontend `brightness` is a relative value (0 = no change). FFmpeg eq expects
      // a brightness offset where 0 = no change (range approx -1..1). Map the
      // UI brightness to FFmpeg by dividing by 100 (so 50 -> 0.5, -20 -> -0.2).
      const brightnessVal = brightness / 100;
      if (brightnessVal !== 0 || contrastVal !== 1 || saturationVal !== 1) {
        videoFilters.push(`eq=brightness=${brightnessVal}:contrast=${contrastVal}:saturation=${saturationVal}`);
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

      console.log('Running FFmpeg command:', command.join(' '));
      await ffmpeg.exec(command);

      console.log('FFmpeg processing complete, reading output file...');
      const data = await ffmpeg.readFile(outputFileName);
      const processedBlob = new Blob([data.buffer || data], { type: 'video/mp4' });
      const processedUrl = URL.createObjectURL(processedBlob);
      
      console.log('Local processing complete. Blob size:', processedBlob.size, 'URL:', processedUrl);
      console.log('Current processedVideoUrl before update:', processedVideoUrl);
      console.log('Current videoUrl (original):', videoUrl);
      
      if (processedVideoUrl) {
        console.log('Revoking old processedVideoUrl:', processedVideoUrl);
        URL.revokeObjectURL(processedVideoUrl);
      }
      
      setProcessedVideoUrl(processedUrl);
      console.log('Set new processedVideoUrl to:', processedUrl);
      setWasJustProcessed(true);
      
      // Small delay to ensure state updates before opening dialog
      setTimeout(() => {
        console.log('Opening preview dialog with processedVideoUrl:', processedUrl);
        console.log('State check - processedVideoUrl should be set now');
        setPreviewDialog(true);
        toast({ description: "Video processed successfully! Ready to upload." });
      }, 200);

      try {
        await ffmpeg.deleteFile(inputFileName);
        await ffmpeg.deleteFile(outputFileName);
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
      // Try to load the processed file for preview. The server returns a new video id
      // in res.data.data.videoId. If we can fetch its info and the file path, attempt
      // to construct a public URL to preview it. (This assumes the backend serves
      // the uploads directory from the server root or via a public URL.)
      const newVideoId = res?.data?.data?.videoId || res?.data?.data?.id;
      if (newVideoId) {
        try {
          const info = await getVideoInfo(newVideoId);
          const filePath = info?.data?.data?.filePath || info?.data?.data?.file_path || info?.data?.filePath || info?.data?.file_path;
          if (filePath) {
            // Derive public base by stripping /api from API base if present
            const apiRaw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const cleaned = String(apiRaw).replace(/\/\/+$/g, '');
            const publicBase = cleaned.match(/\/api(?:$|\/)\/?/) ? cleaned.replace(/\/api(?:$|\/)\/?/, '') : cleaned;
            const publicUrl = `${publicBase}/${String(filePath).replace(/^\/+/, '')}`;
            setProcessedVideoUrl(publicUrl);
            setWasJustProcessed(true);
            setPreviewDialog(true);
            toast({ description: 'Video processed on server successfully. Preview loaded.' });
            setProcessing(false);
            return;
          }
        } catch (e) {
          console.warn('Could not fetch processed video info for preview', e);
        }
      }

      // Fallback: open preview dialog without a processed URL (user can download/upload from server)
      toast({ description: 'Video processed on server successfully.' });
      setPreviewDialog(true);
    } catch (e) {
      console.error(e);
      toast({ description: 'Server processing failed', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  // Helper function to check if any edits exist
  const checkIfEditsExist = () => {
    return (
      segments.length > 0 ||
      trimStart > 0 ||
      trimEnd > 0 ||
      brightness !== 0 ||
      contrast !== 100 ||
      saturation !== 100 ||
      blur > 0 ||
      playbackSpeed !== 1 ||
      rotation !== 0 ||
      (crop.w > 0 && crop.h > 0) ||
      audioFile !== null ||
      watermarkFile !== null
    );
  };

  // Quick update for metadata only (no video file replacement)
  const handleQuickUpdate = async () => {
    if (!selectedVideoFromList || !selectedVideoFromList.id) {
      toast({ 
        title: "No Video Selected",
        description: "Quick Update only works when editing an existing video from library",
        variant: "destructive"
      });
      return;
    }

    setExporting(true);
    try {
      const updateData = {
        title: videoTitle || 'Updated Video',
        description: videoDescription || '',
        updatedAt: new Date().toISOString()
      };

      await updateUserVideo(selectedVideoFromList.id, updateData);

      toast({ 
        title: "✅ Metadata Updated",
        description: "Video title and description have been updated",
        duration: 3000
      });

      setPreviewDialog(false);
      await loadMyVideos();
      setActiveTab('library');
      
    } catch (error) {
      console.error('Quick update error:', error);
      toast({ 
        title: "Update Failed",
        description: error.response?.data?.message || error.message || "Failed to update video metadata",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  const handleUploadProcessedVideo = async () => {
    if (!processedVideoUrl && !videoUrl) {
      toast({ description: "No video to upload", variant: "destructive" });
      return;
    }

    // Check if edits were made but video wasn't processed (unless just processed)
    const hasEdits = checkIfEditsExist();

    if (hasEdits && !processedVideoUrl && !wasJustProcessed) {
      toast({ 
        title: "⚠️ Unprocessed Edits",
        description: "You have made edits but haven't processed the video. Click 'Process Video' first, or use 'Quick Update' to save title/description only.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }

    setExporting(true);
    try {
      // Check if we're updating an existing video (keeping same ID) or creating new one
      const isUpdatingExisting = selectedVideoFromList && selectedVideoFromList.id;
      const oldVideoId = isUpdatingExisting ? selectedVideoFromList.id : null;
      
      // Prepare video file (processed or original)
      let videoBlob, videoFile;
      if (processedVideoUrl) {
        const response = await fetch(processedVideoUrl);
        videoBlob = await response.blob();
      } else if (videoUrl) {
        const response = await fetch(videoUrl);
        videoBlob = await response.blob();
      }
      
      if (videoBlob) {
        videoFile = new File([videoBlob], `${videoTitle || 'video'}.mp4`, { type: 'video/mp4' });
      }
      
      if (isUpdatingExisting) {
        // STEP 1: Create temp local video for immediate preview
        const tempVideoId = uuidv4();
        const blobUrl = URL.createObjectURL(videoBlob);
        
        const tempLocalVideo = {
          id: tempVideoId,
          video_title: videoTitle,
          title: videoTitle,
          description: videoDescription,
          video_description: videoDescription,
          video_url: blobUrl,
          videoUrl: blobUrl,
          isLocal: true,
          status: 'completed',
          serverProcessing: true, // Mark as uploading to server
          progress: 0,
          submitted_at: new Date().toISOString()
        };
        
        // Add to context so VideosPage shows it immediately
        addLocalVideo(tempLocalVideo);
        
        toast({ 
          title: "Uploading...",
          description: "Uploading new video file to server", 
          duration: 2000 
        });
        
        // STEP 2: Upload new video file to backend (creates new video entry with new ID)
        const uploadFormData = new FormData();
        if (videoFile) {
          uploadFormData.append('video', videoFile);
        }
        uploadFormData.append('title', videoTitle || 'Updated Video');
        uploadFormData.append('description', videoDescription || '');
        
        // Upload and get upload ID - use uploadVideoResume (POST /videos/)
        const uploadResponse = await uploadVideoResume(uploadFormData, (progress) => {
          setProcessingProgress(progress);
          updateVideoStatus(tempVideoId, { progress });
        });
        
        console.log('Upload response:', uploadResponse.data);
        
        // Get the uploadId to poll for status
        const uploadId = uploadResponse.data?.uploadId;
        
        if (!uploadId) {
          throw new Error('Failed to get upload ID from response');
        }
        
        console.log(`Upload started with ID: ${uploadId}, polling for completion...`);
        
        // Poll for upload status until completed
        let finalVideo = null;
        let pollAttempts = 0;
        const maxPollAttempts = 60; // 60 seconds max
        
        while (pollAttempts < maxPollAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          pollAttempts++;
          
          try {
            const statusResponse = await checkUploadStatus(uploadId);
            const statusData = statusResponse.data || {};
            const status = statusData.status || '';
            const progress = statusData.progress || 0;
            
            console.log(`Upload status poll ${pollAttempts}: ${status} (${progress}%)`);
            
            // Update progress
            updateVideoStatus(tempVideoId, { 
              progress,
              serverProcessing: true 
            });
            
            if (status === 'completed' && statusData.video) {
              finalVideo = statusData.video;
              console.log('Upload completed:', finalVideo);
              break;
            }
            
            if (status === 'failed') {
              throw new Error(statusData.error || 'Upload failed on server');
            }
          } catch (pollError) {
            console.warn('Poll error:', pollError);
            // Continue polling on transient errors
          }
        }
        
        if (!finalVideo) {
          throw new Error('Upload polling timeout - video not ready');
        }
        
        const newVideoId = finalVideo.id;
        const newVideoUrl = finalVideo.secure_url || finalVideo.video_url || finalVideo.videoUrl;
        
        if (!newVideoId || !newVideoUrl) {
          throw new Error('Invalid video data from server');
        }
        
        console.log(`New video uploaded with ID: ${newVideoId}, URL: ${newVideoUrl}`);
        
        // Update temp local video with server ID and URL
        updateVideoServerId(tempVideoId, newVideoId, {
          status: 'completed',
          isLocal: false,
          serverProcessing: false,
          video_url: newVideoUrl,
          videoUrl: newVideoUrl,
          ...finalVideo
        });
        
        // STEP 3: Update old video record to use new video's URL and data
        toast({ 
          title: "Updating...",
          description: `Transferring content to video ID: ${oldVideoId}`, 
          duration: 2000 
        });
        
        const updateData = {
          title: videoTitle || 'Updated Video',
          description: videoDescription || '',
          video_url: newVideoUrl,
          video_url_signed: newVideoUrl,
          // Transfer any additional data from the new upload
          cloudinary_public_id: finalVideo.cloudinary_public_id,
          duration: finalVideo.duration,
          file_size: finalVideo.file_size || finalVideo.fileSize,
          updatedAt: new Date().toISOString()
        };
        
        try {
          await updateUserVideo(oldVideoId, updateData);
          
          // STEP 4: Delete the temporary new video entry
          try {
            await deleteUserVideo(newVideoId);
            console.log(`Deleted temporary video with ID: ${newVideoId}`);
          } catch (deleteError) {
            console.warn('Could not delete temporary video:', deleteError);
          }
          
          toast({ 
            title: "✨ Video Replaced!",
            description: `Video content updated on ID: ${oldVideoId}`, 
            duration: 4000 
          });
          
        } catch (updateError) {
          console.error('Error updating old video:', updateError);
          throw new Error(`Failed to update old video: ${updateError.message}`);
        }
        
      } else {
        // UPLOAD MODE: Create new video with new ID (same as VideoUpload)
        const tempVideoId = uuidv4();
        const blobUrl = URL.createObjectURL(videoBlob);
        
        const localVideo = {
          id: tempVideoId,
          video_title: videoTitle,
          title: videoTitle,
          description: videoDescription,
          video_description: videoDescription,
          video_url: blobUrl,
          videoUrl: blobUrl,
          isLocal: true,
          status: 'completed',
          serverProcessing: true,
          progress: 0,
          submitted_at: new Date().toISOString()
        };
        
        addLocalVideo(localVideo);
        
        toast({ 
          title: "Uploading...",
          description: "Uploading video to server", 
          duration: 2000 
        });
        
        const formData = new FormData();
        if (videoFile) {
          formData.append('video', videoFile);
        }
        formData.append('title', videoTitle || 'New Video');
        formData.append('description', videoDescription || '');

        const uploadResponse = await uploadVideoResume(formData, (progress) => {
          setProcessingProgress(progress);
          updateVideoStatus(tempVideoId, { progress });
        });
        
        console.log('Upload response:', uploadResponse.data);
        
        // Get the uploadId to poll for status
        const uploadId = uploadResponse.data?.uploadId;
        
        if (!uploadId) {
          throw new Error('Failed to get upload ID from response');
        }
        
        console.log(`Upload started with ID: ${uploadId}, polling for completion...`);
        
        // Poll for upload status until completed
        let finalVideo = null;
        let pollAttempts = 0;
        const maxPollAttempts = 60; // 60 seconds max
        
        while (pollAttempts < maxPollAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          pollAttempts++;
          
          try {
            const statusResponse = await checkUploadStatus(uploadId);
            const statusData = statusResponse.data || {};
            const status = statusData.status || '';
            const progress = statusData.progress || 0;
            
            console.log(`Upload status poll ${pollAttempts}: ${status} (${progress}%)`);
            
            // Update progress
            updateVideoStatus(tempVideoId, { 
              progress,
              serverProcessing: true 
            });
            
            if (status === 'completed' && statusData.video) {
              finalVideo = statusData.video;
              console.log('Upload completed:', finalVideo);
              break;
            }
            
            if (status === 'failed') {
              throw new Error(statusData.error || 'Upload failed on server');
            }
          } catch (pollError) {
            console.warn('Poll error:', pollError);
            // Continue polling on transient errors
          }
        }
        
        if (!finalVideo) {
          throw new Error('Upload polling timeout - video not ready');
        }
        
        const newVideoId = finalVideo.id;
        const newVideoUrl = finalVideo.secure_url || finalVideo.video_url || finalVideo.videoUrl;
        
        if (!newVideoId || !newVideoUrl) {
          throw new Error('Invalid video data from server');
        }
        
        console.log(`New video uploaded with ID: ${newVideoId}, URL: ${newVideoUrl}`);
        
        // Update temp video with server ID and URL
        updateVideoServerId(tempVideoId, newVideoId, {
          status: 'completed',
          isLocal: false,
          serverProcessing: false,
          video_url: newVideoUrl,
          videoUrl: newVideoUrl,
          ...finalVideo
        });
        
        toast({ 
          title: "Video Uploaded!",
          description: "New video has been uploaded successfully", 
          duration: 3000 
        });
      }
      
      // Close dialog and cleanup
      setPreviewDialog(false);
      setWasJustProcessed(false);
      
      if (processedVideoUrl) {
        URL.revokeObjectURL(processedVideoUrl);
        setProcessedVideoUrl("");
      }
      
      setProcessingProgress(0);
      
      // Reload video list
      await loadMyVideos();
      
      // Switch to library tab to show the result
      setActiveTab('library');
      
    } catch (error) {
      console.error('Error uploading/updating video:', error);
      toast({ 
        title: "Operation Failed",
        description: error.response?.data?.message || error.message || "Failed to upload/update video", 
        variant: "destructive",
        duration: 4000
      });
    } finally {
      setExporting(false);
      setProcessingProgress(0);
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
                  myVideos.map((video) => {
                    // Check if video was updated recently (within last 5 minutes)
                    const isRecentlyUpdated = video.updatedAt && video.createdAt && 
                      new Date(video.updatedAt).getTime() > new Date(video.createdAt).getTime() &&
                      (Date.now() - new Date(video.updatedAt).getTime()) < 5 * 60 * 1000;
                    
                    return (
                      <Card
                        key={video.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedVideoFromList?.id === video.id ? 'border-2 border-purple-600' : ''
                        } ${video.serverProcessing ? 'border-2 border-yellow-400 border-dashed' : ''}`}
                        onClick={() => handleSelectVideoFromList(video)}
                      >
                        <div className="aspect-video bg-gray-900 rounded-t-lg overflow-hidden relative">
                          {video.videoUrl ? (
                            <video src={video.videoUrl} className="w-full h-full object-cover" />
                          ) : (
                            <img src={video.thumbnailUrl ? (video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${VITE_API_BASE_URL}${video.thumbnailUrl}`) : ''} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                          )}
                          {video.serverProcessing && (
                            <div className="absolute bottom-0 left-0 right-0 bg-yellow-400/90 text-yellow-900 text-xs font-medium py-1 px-2 flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span>Processing...</span>
                            </div>
                          )}
                          {isRecentlyUpdated && !video.serverProcessing && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Updated
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <p className="font-medium truncate">{video.title}</p>
                          <p className="text-xs text-gray-600 truncate">{video.description || 'No description'}</p>
                          {video.serverProcessing && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600">
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                              <span>Uploading to server</span>
                            </div>
                          )}
                          {isRecentlyUpdated && !video.serverProcessing && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                              <RotateCw className="h-3 w-3" />
                              <span>Recently updated</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
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
                {selectedVideoFromList && (
                  <div className="md:col-span-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                        Editing Mode
                      </Badge>
                      <span className="text-blue-700 dark:text-blue-300">
                        Video ID: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded font-mono text-xs">{selectedVideoFromList.id}</code>
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Saving will replace the video file and metadata while keeping this ID
                    </p>
                  </div>
                )}
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
                {selectedVideoFromList && (
                  <div className="space-y-2 flex items-end">
                    <Button 
                      onClick={async () => {
                        try {
                          const oldVideoId = selectedVideoFromList.id;
                          
                          // If there's a processed video or current video file to upload
                          if (processedVideoUrl || videoFile) {
                            // STEP 1: Upload new video file
                            toast({ 
                              title: "Uploading...",
                              description: "Uploading new video file", 
                              duration: 2000 
                            });
                            
                            let videoBlob;
                            if (processedVideoUrl) {
                              const response = await fetch(processedVideoUrl);
                              videoBlob = await response.blob();
                            } else if (videoFile) {
                              videoBlob = videoFile;
                            }
                            
                            const file = new File([videoBlob], `${videoTitle || 'updated_video'}.mp4`, { type: 'video/mp4' });
                            
                            const uploadFormData = new FormData();
                            uploadFormData.append('video', file);
                            uploadFormData.append('title', videoTitle);
                            uploadFormData.append('description', videoDescription);
                            
                            const uploadResponse = await uploadVideo(uploadFormData);
                            const newVideoData = uploadResponse.data?.video || uploadResponse.data?.data || {};
                            const newVideoId = newVideoData.id || uploadResponse.data?.uploadId;
                            const newVideoUrl = newVideoData.video_url || newVideoData.secure_url;
                            
                            // STEP 2: Update old video with new URL
                            const updateData = {
                              title: videoTitle,
                              description: videoDescription,
                              video_url: newVideoUrl,
                              video_url_signed: newVideoUrl,
                              cloudinary_public_id: newVideoData.cloudinary_public_id,
                              duration: newVideoData.duration,
                              file_size: newVideoData.file_size,
                              updatedAt: new Date().toISOString()
                            };
                            
                            await updateUserVideo(oldVideoId, updateData);
                            
                            // STEP 3: Delete temporary video
                            try {
                              await deleteUserVideo(newVideoId);
                            } catch (e) {
                              console.warn('Could not delete temp video:', e);
                            }
                            
                            toast({ 
                              title: "✨ Video Updated!",
                              description: `Video content replaced on ID: ${oldVideoId}`, 
                              duration: 4000 
                            });
                          } else {
                            // Just update metadata
                            await updateUserVideo(oldVideoId, {
                              title: videoTitle,
                              description: videoDescription
                            });
                            
                            toast({ 
                              title: "Info Updated",
                              description: "Video information updated", 
                              duration: 3000 
                            });
                          }
                          
                          await loadMyVideos();
                        } catch (error) {
                          console.error('Error updating video:', error);
                          toast({ 
                            title: "Update Failed",
                            description: error.response?.data?.message || "Failed to update video", 
                            variant: "destructive" 
                          });
                        }
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Update Video & Replace File
                    </Button>
                  </div>
                )}
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
          {console.log('=== PREVIEW DIALOG STATE ===')}
          {console.log('processedVideoUrl:', processedVideoUrl)}
          {console.log('wasJustProcessed:', wasJustProcessed)}
          {console.log('videoUrl:', videoUrl)}
          {console.log('hasEdits:', checkIfEditsExist())}
          {console.log('=========================')}
          
          {/* Warning if edits exist but not processed */}
          {(() => {
            const hasEdits = checkIfEditsExist();
            
            // Don't show warning if video was just processed or if processedVideoUrl exists
            if (hasEdits && !processedVideoUrl && !wasJustProcessed) {
              return (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Unprocessed Edits</h3>
                      <p className="mt-1 text-sm text-amber-700">
                        You've made edits but haven't processed the video. Click "Process Video" button first to apply your changes before uploading.
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
          
          {processedVideoUrl ? (
            <div className="bg-black rounded-lg overflow-hidden">
              <video 
                key={processedVideoUrl} 
                src={processedVideoUrl} 
                controls 
                className="w-full"
                onLoadedMetadata={(e) => {
                  console.log('Preview video loaded successfully');
                  console.log('Video element src:', e.target.src);
                  console.log('Video element currentSrc:', e.target.currentSrc);
                }}
                onError={(e) => console.error('Preview video error:', e)}
              />
            </div>
          ) : (
            // If no processed URL is available, show a live preview of the currently
            // selected/original video with the same CSS filters so the user can inspect
            // how the edited result will look before actually running FFmpeg.
            (videoUrl ? (
              <div className="bg-black rounded-lg overflow-hidden">
                <div className="p-4 text-sm text-gray-300">Live preview (not yet processed). Use "Process Locally" or "Process on Server" to generate a processed file.</div>
                <video
                  src={videoUrl}
                  controls
                  className="w-full"
                  style={{
                    filter: `brightness(${1 + brightness/100}) contrast(${contrast/100}) saturate(${saturation/100}) blur(${blur}px)`,
                    transform: `rotate(${rotation}deg)`
                  }}
                  onLoadedMetadata={(e) => console.log('Live preview loaded, src:', e.target.currentSrc)}
                  onError={(e) => console.error('Live preview error:', e)}
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-600">No processed video available for preview</p>
              </div>
            ))
          )}
          {exporting && processingProgress > 0 && (
            <div className="px-6 pb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Upload Progress</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setPreviewDialog(false);
              setWasJustProcessed(false);
            }} disabled={exporting}>Cancel</Button>
            {selectedVideoFromList && (
              <Button 
                variant="secondary" 
                onClick={handleQuickUpdate} 
                disabled={exporting}
                className="mr-auto"
              >
                Quick Update (Metadata Only)
              </Button>
            )}
            {selectedVideoFromList ? (
              <Button onClick={handleUploadProcessedVideo} disabled={exporting} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {processingProgress > 0 ? `Uploading ${processingProgress}%` : 'Processing...'}
                  </>
                ) : (
                  <>
                    <RotateCw className="h-4 w-4 mr-2" />
                    Replace Video (Keep ID)
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleUploadProcessedVideo} disabled={exporting} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {processingProgress > 0 ? `Uploading ${processingProgress}%` : 'Processing...'}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload as New Video
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
