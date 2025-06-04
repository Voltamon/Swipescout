import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  IconButton,
  TextField,
  CircularProgress,
  Slider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  LinearProgress,
  Stack,
  Tooltip,
  styled,
  useTheme
} from "@mui/material";
import {
  Videocam as VideocamIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  AddCircle as AddCircleIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { uploadVideo, saveVideoMetadata } from '../services/videoService';
import { v4 as uuidv4 } from 'uuid';
import { useVideoContext } from '../context/VideoContext';


// Styled components (keep the same as before)
const UploadBox = styled(Box)(({ theme }) => ({
  border: "2px dashed #f0f0f0",
  borderRadius: "8px",
  padding: theme.spacing(4),
  backgroundColor: "#f9f9f9",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  minHeight: "170px",
  textAlign: "center",
  marginBottom: theme.spacing(2),
  "&:hover": {
    borderColor: "#3366ff",
    backgroundColor: "#e9f7ff",
  },
}));

const VideoButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#3366ff",
  color: "white",
  padding: theme.spacing(1),
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#2952cc",
  },
  width: "100%",
  marginBottom: theme.spacing(1.5),
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white",
  color: "black",
  padding: theme.spacing(1),
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  width: "100%",
}));

const VideoPreviewContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  position: 'relative',
  marginBottom: theme.spacing(2),
  backgroundColor: '#000',
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const RecordingIndicator = styled(Box)(({ theme, isRecording }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: '4px',
  backgroundColor: isRecording ? 'rgba(255, 0, 0, 0.7)' : 'transparent',
  color: '#fff',
}));

const HashtagInput = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const HashtagChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const VideoResumeUpload = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState(null);
  const { addLocalVideo, updateVideoStatus } = useVideoContext();

  
  // Refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // State for video upload/recording
  const [videoFile, setVideoFile] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingStep, setRecordingStep] = useState(0);
  const [uploadId, setUploadId] = useState(null);
  
  // State for video metadata
  const [videoTitle, setVideoTitle] = useState('');
  const [videoPosition, setVideoPosition] = useState('main');
  const [videoType, setVideoType] = useState('intro');
  const [hashtags, setHashtags] = useState([]);
  const [jobId, setJobId] = useState([]);
  const [newHashtag, setNewHashtag] = useState('');
  
  // UI state
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [recordingPermissionGranted, setRecordingPermissionGranted] = useState(false);
  
  // Timer for recording
  const timerRef = useRef(null);
  const statusCheckIntervalRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

useEffect(() => {
  if (!uploadId) return;

  const interval = setInterval(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/job-seekers/upload-status/${uploadId}`);
      const data = await response.json();
      
      if (data.status === 'completed') {
        clearInterval(interval);
        
        // Update the video in context with final details
        updateVideoStatus(uploadId, {
          status: 'completed',
          video_url: data.video_url,
          isLocal: false,
          ...data.video
        });

        setSnackbar({
          open: true,
          message: 'Video processing completed!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Status check error:', error);
    }
  }, 3000);

  return () => clearInterval(interval);
}, [uploadId, updateVideoStatus]);


// In VideoResumeUpload.jsx
const handleSubmit = async () => {
  if ((!videoFile && !videoBlob) || !videoTitle.trim()) {
    setSnackbar({
      open: true,
      message: !videoFile && !videoBlob 
        ? 'Please select or record a video' 
        : 'Please enter a video title',
      severity: 'error'
    });
    return;
  }

  try {
    setIsUploading(true);
    
    const formData = new FormData();
    const videoData = videoFile || new File([videoBlob], `video-resume-${Date.now()}.webm`, {
      type: 'video/webm'
    });

    formData.append('video', videoData);
    formData.append('title', videoTitle);
    formData.append('jobId', jobId);
    formData.append('hashtags', hashtags.join(','));
    formData.append('videoType', videoType);
    formData.append('videoDuration', videoRef.current?.duration?.toFixed(0) || '30');

    // Add to local videos immediately
    const tempId = uuidv4();
    const persistentBlobUrl = URL.createObjectURL(
      videoFile || new Blob([videoBlob], { type: 'video/webm' })
    );
    
    const newVideo = {
      id: tempId,
      video_url: persistentBlobUrl,
      video_title: videoTitle,
      video_type: videoType,
      hashtags: hashtags.join(','),
      job_id: jobId,
      video_duration: videoRef.current?.duration || 0,
      progress: 0,
      status: 'uploading',
      isLocal: true,
      submitted_at: new Date().toISOString()
    };
    
    addLocalVideo(newVideo);
    console.log('Added local video with tempId:', tempId);

    // Navigate immediately but continue upload in background
    navigate('/videos');

    // Upload in background
    const uploadResponse = await uploadVideo(formData, (progress) => {
      updateVideoStatus(tempId, { progress });
    });

    console.log('Upload response received:', uploadResponse);
    
    // Update with server ID and mark as processing
    updateVideoStatus(tempId, {
      id: uploadResponse.data.uploadId,
      status: 'processing'
    });

    
    console.log('Updated video with uploadId:', uploadResponse.data.uploadId);
    setUploadId(uploadResponse.data.uploadId);

  } catch (error) {
    console.error('Upload error:', error);
    updateVideoStatus(tempId, {
      status: 'failed',
      error: error.message
    });
    setSnackbar({
      open: true,
      message: 'Upload failed. You can retry from the videos page.',
      severity: 'error'
    });
  } finally {
    setIsUploading(false);
  }
};
  // Handle file selection with proper duration validation
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      setSnackbar({
        open: true,
        message: 'Please select a valid video file',
        severity: 'error'
      });
      return;
    }
    
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      const duration = await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
        video.onerror = () => reject(new Error('Failed to load video metadata'));
        video.src = URL.createObjectURL(file);
      });
      
      if (duration < 15 || duration > 45) {
        setSnackbar({
          open: true,
          message: 'Video must be between 15 and 45 seconds',
          severity: 'error'
        });
        return;
      }
      
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setRecordingStep(1);
    } catch (error) {
      console.error('Error checking video:', error);
      setSnackbar({
        open: true,
        message: 'Error processing video file',
        severity: 'error'
      });
    }
  };

  // Request media permissions with proper constraints
const requestMediaPermissions = async () => {
  if (recordingPermissionGranted) return true;

  try {
    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
        frameRate: { ideal: 30 }
      }, 
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    });

    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;

      try {
        await videoRef.current.play();
      } catch (err) {
        console.warn("Autoplay failed:", err);
      }
    }

    setRecordingPermissionGranted(true);
    return true;

  } catch (error) {
    console.error('Media access error:', error);
    setSnackbar({
      open: true,
      message: 'Please enable camera and microphone access',
      severity: 'error'
    });
    return false;
  }
};

  // Start recording with proper stream handling
const startRecording = async () => {
  if (!recordingPermissionGranted && !(await requestMediaPermissions())) return;
  
  try {
    const stream = streamRef.current;
    
    // Try to find a supported mimeType
    const options = {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000
    };
    
    // List of supported mimeTypes to try (in order of preference)
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
      'video/mp4'
    ];
    
    // Find the first supported mimeType
    let supportedType = mimeTypes.find(type => 
      MediaRecorder.isTypeSupported(type)
    );
    
    if (!supportedType) {
      // Fallback to browser default if no explicit type is supported
      supportedType = '';
      console.warn('No specific codec supported, using browser default');
    }
    
    const mediaRecorder = new MediaRecorder(stream, { 
      mimeType: supportedType,
      ...options
    });
    
    const chunks = [];
    mediaRecorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { 
        type: chunks[0]?.type || 'video/webm' 
      });
      setVideoBlob(blob);
      setVideoUrl(URL.createObjectURL(blob));
      setIsRecording(false);
      setRecordingStep(1);
      setShowRecordDialog(false);
      stream.getTracks().forEach(track => track.stop());
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000); // Collect data every 1 second
    setIsRecording(true);
    
    let seconds = 0;
    timerRef.current = setInterval(() => {
      seconds++;
      setRecordingTime(seconds);
      if (seconds >= 45) stopRecording();
    }, 1000);
  } catch (error) {
    console.error('Recording error:', error);
    setSnackbar({
      open: true,
      message: `Error starting recording: ${error.message}`,
      severity: 'error'
    });
  }
};

  // Stop recording safely
  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  // Toggle video playback
  const togglePlayback = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Handle video ended event
  const handleVideoEnded = () => setIsPlaying(false);

  // Hashtag management
  const addHashtag = () => {
    const tag = newHashtag.trim();
    if (!tag) return;
    
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (!hashtags.includes(formattedTag)) {
      setHashtags([...hashtags, formattedTag]);
      setNewHashtag('');
    }
  };

  const removeHashtag = (tag) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const handleHashtagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    }
  };

  // Check upload status
// Fixed checkUploadStatus function
  const checkUploadStatus = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/job-seekers/upload-status/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // First check if the response is HTML (like a 404 page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') === -1) {
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE html>')) {
          throw new Error('Server returned HTML instead of JSON');
        }
        throw new Error('Invalid response format');
      }
      
      const data = await response.json();
      
      if (data.status === 'completed') {
        clearInterval(statusCheckIntervalRef.current);
        return data.video;
      } else if (data.status === 'failed') {
        clearInterval(statusCheckIntervalRef.current);
        throw new Error(data.message || 'Upload failed');
      }
      
      return null;
    } catch (error) {
      console.error('Error checking upload status:', error);
      throw error;
    }
  };


  // Reset form completely
  const resetForm = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoUrl.startsWith('blob:')) URL.revokeObjectURL(videoUrl);
    
    setVideoFile(null);
    setVideoBlob(null);
    setVideoUrl('');
    setIsRecording(false);
    setRecordingTime(0);
    setIsPlaying(false);
    setUploadProgress(0);
    setIsUploading(false);
    setRecordingStep(0);
    setVideoTitle('');
    setVideoPosition('main');
    setVideoType('intro');
    setJobId(null);
    setHashtags([]);
    setNewHashtag('');
    setShowRecordDialog(false);
    setUploadId(null);
    
    if (statusCheckIntervalRef.current) {
      clearInterval(statusCheckIntervalRef.current);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

   // Add this to your render method
  const renderUploadQueue = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Upload Status
      </Typography>
      {uploadQueue.map((item) => (
        <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>{item.title}</Typography>
            <Typography color={
              item.status === 'completed' ? 'success.main' :
              item.status === 'failed' ? 'error.main' : 'text.secondary'
            }>
              {item.status.toUpperCase()}
            </Typography>
          </Box>
          {item.status === 'uploading' && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress variant="determinate" value={item.progress || 0} />
              <Typography variant="caption">
                {item.progress || 0}% uploaded
              </Typography>
            </Box>
          )}
          {item.status === 'failed' && (
            <Button 
              size="small" 
              color="error" 
              onClick={() => retryUpload(item.id)}
              sx={{ mt: 1 }}
            >
              Retry
            </Button>
          )}
        </Paper>
      ))}
    </Box>
  );

  // Render different steps
  const renderInitialStep = () => (
    <>
      <Typography variant="h5" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 0.5 }}>
        Upload Your Video Resume
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 2 }}>
        Show employers who you are in 15-45 seconds
      </Typography>

      <UploadBox component="label" htmlFor="video-upload">
        <input 
          id="video-upload" 
          type="file" 
          accept="video/*" 
          hidden 
          ref={fileInputRef}
          onChange={handleFileSelect} 
        />
        <VideocamIcon sx={{ fontSize: 50, color: "#555", mb: 1.5 }} />
        <Typography variant="body1" sx={{ fontWeight: "medium", mb: 0.5 }}>
          Drag & drop video here
        </Typography>
        <Typography variant="body2" color="textSecondary">
          or click to browse files (15-45 seconds)
        </Typography>
      </UploadBox>

      <Stack spacing={1.5} sx={{ mt: "20px" }}>
        <VideoButton 
          variant="contained" 
          disableElevation 
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Select Video
        </VideoButton>
        <SecondaryButton 
          variant="outlined" 
          disableElevation 
          startIcon={<VideocamIcon />}
          onClick={() => setShowRecordDialog(true)}
        >
          Record New Video
        </SecondaryButton>
      </Stack>
    </>
  );
  
  const renderPreviewStep = () => (
    <>
      <Typography variant="h5" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 0.5 }}>
        Preview Your Video
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 2 }}>
        Make sure your video looks and sounds good
      </Typography>

      <VideoPreviewContainer>
        <video
          ref={videoRef}
          src={videoUrl}
          width="100%"
          height="auto"
          controls={false}
          onEnded={handleVideoEnded}
        />
        <VideoControls>
          <IconButton size="small" color="inherit" onClick={togglePlayback}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <Typography variant="caption" color="inherit">
            {videoRef.current ? formatTime(Math.floor(videoRef.current.currentTime)) : '00:00'} / 
            {videoRef.current ? formatTime(Math.floor(videoRef.current.duration)) : '00:00'}
          </Typography>
        </VideoControls>
      </VideoPreviewContainer>

      <Stack spacing={1.5} sx={{ mt: "20px" }}>
        <VideoButton 
          variant="contained" 
          disableElevation 
          startIcon={<CheckCircleIcon />}
          onClick={() => setRecordingStep(2)}
        >
          Use This Video
        </VideoButton>
        <SecondaryButton 
          variant="outlined" 
          disableElevation 
          startIcon={<RefreshIcon />}
          onClick={resetForm}
        >
          Start Over
        </SecondaryButton>
      </Stack>
    </>
  );
  
  const renderMetadataStep = () => (
    <>
      <Typography variant="h5" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 0.5 }}>
        Video Details
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 2 }}>
        Add information about your video resume
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Video Title"
            variant="outlined"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            required
            placeholder="e.g., My Professional Introduction"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Video Position</InputLabel>
            <Select
              value={videoPosition}
              onChange={(e) => setVideoPosition(e.target.value)}
              label="Video Position"
            >
              <MenuItem value="main">Main</MenuItem>
              <MenuItem value="intro">Intro</MenuItem>
              <MenuItem value="outro">Outro</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Video Type</InputLabel>
            <Select
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              label="Video Type"
            >
              <MenuItem value="intro">Introduction</MenuItem>
              <MenuItem value="skills">Skills Showcase</MenuItem>
              <MenuItem value="experience">Work Experience</MenuItem>
              <MenuItem value="portfolio">Portfolio</MenuItem>
              <MenuItem value="personal">Personal Statement</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Add Hashtags (skills, industries, etc.)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
              {hashtags.map((tag) => (
                <HashtagChip
                  key={tag}
                  label={tag}
                  onDelete={() => removeHashtag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex' }}>
              <HashtagInput
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Add a hashtag (e.g., #webdesign)"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                onKeyPress={handleHashtagKeyPress}
              />
              <IconButton 
                color="primary" 
                onClick={addHashtag}
                disabled={!newHashtag.trim()}
              >
                <AddCircleIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {isUploading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="body2" align="center" gutterBottom>
            {uploadId ? 'Processing video...' : `Uploading video... ${uploadProgress}%`}
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      <Stack spacing={1.5} sx={{ mt: "20px" }}>
        <VideoButton 
          variant="contained" 
          disableElevation 
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={isUploading}
        >
          {isUploading ? (uploadId ? 'Processing...' : 'Uploading...') : 'Save & Upload'}
        </VideoButton>
        <SecondaryButton 
          variant="outlined" 
          disableElevation 
          startIcon={<ArrowBackIcon />}
          onClick={() => setRecordingStep(1)}
          disabled={isUploading}
        >
          Back to Preview
        </SecondaryButton>
      </Stack>
    </>
  );
  
// Fixed renderRecordingDialog
  const renderRecordingDialog = () => (
    <Dialog 
      open={showRecordDialog} 
      onClose={() => !isRecording && setShowRecordDialog(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Record Video
        {!isRecording && (
          <IconButton
            aria-label="close"
            onClick={() => {
              if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
              }
              setShowRecordDialog(false);
              setRecordingPermissionGranted(false);
            }}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          position: 'relative',
          backgroundColor: '#000',
          borderRadius: 1,
          overflow: 'hidden',
          minHeight: '300px'
        }}>
          <video
            ref={videoRef}
            width="100%"
            height="auto"
            autoPlay
            playsInline
            muted
            style={{
              display: recordingPermissionGranted ? 'block' : 'none',
              transform: 'scaleX(-1)'
            }}
          />
          
          {!recordingPermissionGranted && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              color: '#555'
            }}>
              <Typography variant="body1">Camera preview will appear here</Typography>
            </Box>
          )}
          
          {isRecording && (
            <Box sx={{ 
              position: 'absolute', 
              top: 10, 
              right: 10,
              backgroundColor: 'rgba(255, 0, 0, 0.7)',
              color: 'white',
              px: 1,
              borderRadius: 1
            }}>
              <Typography variant="caption">
                REC {formatTime(recordingTime)}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="body2" gutterBottom>
            Recording time: 15-45 seconds
          </Typography>
          <Slider
            value={recordingTime}
            min={0}
            max={45}
            marks={[
              { value: 0, label: '0s' },
              { value: 15, label: '15s' },
              { value: 45, label: '45s' },
            ]}
            disabled
          />
        </Box>
      </DialogContent>
      <DialogActions>
        {!recordingPermissionGranted ? (
          <Button 
            onClick={async () => {
              const granted = await requestMediaPermissions();
              if (granted) {
                setRecordingPermissionGranted(true);
              }
            }}
            color="primary"
            variant="contained"
            fullWidth
            startIcon={<VideocamIcon />}
          >
            Allow Camera & Microphone
          </Button>
        ) : (
          <>
            {!isRecording ? (
              <Button 
                onClick={startRecording}
                color="primary"
                variant="contained"
                startIcon={<VideocamIcon />}
                fullWidth
              >
                Start Recording
              </Button>
            ) : (
              <Button 
                onClick={stopRecording}
                color="error"
                variant="contained"
                startIcon={<StopIcon />}
                fullWidth
              >
                Stop Recording ({45 - recordingTime}s left)
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );

  
  return (
    <Box sx={{ 
      background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%)`,
      minHeight: "100vh",
      py: 3
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          {recordingStep === 0 && renderInitialStep()}
          {recordingStep === 1 && renderPreviewStep()}
          {recordingStep === 2 && renderMetadataStep()}
        </Paper>
      </Container>
      
      {renderRecordingDialog()}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VideoResumeUpload;