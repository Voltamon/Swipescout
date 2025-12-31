import i18n from 'i18next';
import React, { useContext, useState, useRef, useEffect  } from 'react';
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
import { useNavigate, useParams } from "react-router-dom"; // Add useParams
import { uploadVideo, saveVideoMetadata } from '@/services/videoService';
import { v4 as uuidv4 } from 'uuid';
import { useVideoContext } from '@/contexts/VideoContext';
import { 
  checkUploadStatus, 

} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

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

// Modify the component props to include onStatusChange
const VideoUpload = ({newjobid, onComplete, onStatusChange, embedded}) => {
  // const theme = useTheme(); // Removed: unused variable
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState(null);
  // Destructure addLocalVideo and updateVideoStatus from context
  const { addLocalVideo, updateVideoStatus } = useVideoContext();
  const { user, role } = useAuth();
  
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
  const [uploadId, setUploadId] = useState(null); // This is the server-assigned ID once upload starts
  const [tempLocalId, setTempLocalId] = useState(null); // This is the temporary ID for local tracking
  
  // State for video metadata
  const [videoTitle, setVideoTitle] = useState('');
  const [videoPosition, setVideoPosition] = useState('main');
  const [videoType, setVideoType] = useState('intro');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [newHashtag, setNewHashtag] = useState('');
  
  // UI state
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [recordingPermissionGranted, setRecordingPermissionGranted] = useState(false);
  
  // Timer for recording
  const timerRef = useRef(null);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Inform parent component about uploading/recording status
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(isUploading, isRecording);
    }
  }, [isUploading, isRecording, onStatusChange]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (videoUrl && videoUrl.startsWith('blob:') && !tempLocalId) {
        URL.revokeObjectURL(videoUrl); 
      }
    };
  }, [videoUrl, tempLocalId]); 


// Effect to monitor upload status from the server
useEffect(() => {
  let statusCheckInterval;
  // Use `uploadId` for status checks as it's the server-assigned ID
  if (uploadId) { 
    console.log(`[VideoUpload] Starting status check for uploadId: ${uploadId}`);
    statusCheckInterval = setInterval(async () => {
      try {
        const response = await checkUploadStatus(uploadId);
        const data = response;// await response.json();
        
        console.log(`[VideoUpload] Status check response for ${uploadId}:`, data.status);

        if (data.status === 'completed') {
          console.log(`[VideoUpload] Video ${uploadId} completed processing.`);
          clearInterval(statusCheckInterval);
          
          updateVideoStatus(uploadId, {
            status: 'completed',
            video_url: data.video_url,
            isLocal: false, // Now it's truly not local, fully processed on server
            ...data.video
          });

          setSnackbar({
            open: true,
            message: 'Video processing completed!',
            severity: 'success'
          });

          // This useEffect only updates VideoContext; onComplete and navigation are handled by parent
        } else if (data.status === 'failed') {
          console.log(`[VideoUpload] Video ${uploadId} failed processing.`);
          clearInterval(statusCheckInterval);
          updateVideoStatus(uploadId, {
            status: 'failed',
            error: data.message || 'Processing failed',
            isLocal: true // Mark as local again if it failed, for potential client-side retry/management
          });
          setSnackbar({
            open: true,
            message: 'Video processing failed.',
            severity: 'error'
          });
          // This useEffect only updates VideoContext; onComplete and navigation are handled by parent
        }
      } catch (error) {
        console.error(`[VideoUpload] Status check error for ${uploadId}:`, error);
        clearInterval(statusCheckInterval);
        updateVideoStatus(uploadId, {
          status: 'failed',
          error: error.message || 'Network error during status check',
          isLocal: true // Mark as local if network error during status check
        });
        setSnackbar({
          open: true,
          message: 'Error checking video status.',
          severity: 'error'
        });
        // This useEffect only updates VideoContext; onComplete and navigation are handled by parent
      }
    }, 3000); 
  }

  return () => {
    if (statusCheckInterval) {
      console.log(`[VideoUpload] Clearing status check interval for uploadId: ${uploadId}`);
      clearInterval(statusCheckInterval);
    }
  };
}, [uploadId, updateVideoStatus, API_BASE_URL]);


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
    setUploadStatus('preparing');
    
    // Generate a temporary ID for local tracking
    // This ensures a unique ID for the initial addLocalVideo call,
    // preventing duplicates if the component re-renders before server ID is available.
    const currentTempLocalId = uuidv4(); 
    setTempLocalId(currentTempLocalId); 
    console.log(`[VideoUpload] Generated new tempLocalId: ${currentTempLocalId}`);

    const formData = new FormData();
    const videoData = videoFile || new File([videoBlob], `video-resume-${Date.now()}.webm`, {
      type: 'video/webm'
    });

    formData.append('video', videoData);
    formData.append('title', videoTitle);
    formData.append('jobId', newjobid || ''); // Use newjobid prop
    formData.append('hashtags', hashtags.join(','));
  formData.append('category', category || '');
  formData.append('source', source || '');
    formData.append('videoType', videoType);
    formData.append('video_position', videoPosition);
    formData.append('videoDuration', videoRef.current?.duration?.toFixed(0) || '30');

    const persistentBlobUrl = URL.createObjectURL(
      videoFile || new Blob([videoBlob], { type: 'video/webm' })
    );
    
    // Add to local videos immediately with the temporary ID
    const newVideo = {
      id: currentTempLocalId, // Use the newly generated temp ID here
      video_url: persistentBlobUrl,
      video_title: videoTitle,
      video_type: videoType,
      hashtags: hashtags.join(','),
      job_id: newjobid || null,
      video_duration: videoRef.current?.duration || 0,
      category: category || null,
      source: source || null,
      progress: 0,
      status: 'uploading',
      isLocal: true,
      submitted_at: new Date().toISOString()
    };
    
    addLocalVideo(newVideo); // This will add it to the context
    setUploadStatus('uploading');

    // Start the upload process
    const uploadResponse = await uploadVideo(formData, (progress) => {
      setUploadProgress(progress);
      updateVideoStatus(currentTempLocalId, { progress }); // Update status using the temp ID
    });

    const serverUploadId = uploadResponse.data.uploadId;
    console.log(`[VideoUpload] Server assigned ID: ${serverUploadId}. Updating local entry from ${currentTempLocalId} to ${serverUploadId}.`);
    
    // Update the video's ID and status in the context
    updateVideoStatus(currentTempLocalId, { // Update the video that was tracked by tempLocalId
      id: serverUploadId, // Set the actual server ID
      status: 'processing', // Video is now 'processing' on the server side
      isLocal: true // Keep true until server reports 'completed'
    });
    
    // Update component's local state to use the server ID for future status checks
    setUploadId(serverUploadId); 
    setUploadStatus('processing');

    // Call onComplete here to signal to the parent (PostJobPage) that the upload process has been initiated
    // and the dialog can be closed.
        if (!newjobid ) { //&& !embedded
          if(role=='job_seeker')
      navigate('/jobseeker-tabs?group=profileContent&tab=my-videos'); 
    else if(role=='employer') 
      navigate('/employer-tabs?group=profileContent&tab=my-videos');
    }
    if (onComplete) {
      onComplete(serverUploadId); 
    }

  } catch (error) {
    console.error('[VideoUpload] Upload error:', error);
    setUploadStatus('failed');
    setSnackbar({
      open: true,
      message: 'Upload failed. You can retry from the videos page.',
      severity: 'error'
    });
    
    // Use currentTempLocalId for error update as server ID might not be available
    const idToUpdate = tempLocalId; 
    if (idToUpdate) {
      updateVideoStatus(idToUpdate, {
        status: 'failed',
        error: error.message,
        isLocal: true 
      });
      console.log(`[VideoUpload] Updated video status to failed for ID: ${idToUpdate}`);
    } else {
      console.warn('[VideoUpload] Could not update video status as no valid ID was found during error.');
    }

    if (onComplete) {
      onComplete(null); // Signal failure to the parent
    }
  } finally {
    setIsUploading(false); 
    console.log('[VideoUpload] handleSubmit finished. isUploading set to false.');
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
      
      if (duration < 14  || duration > 45) {
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
      console.error('[VideoUpload] Error checking video:', error);
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
        console.warn("[VideoUpload] Autoplay prevented:", err);
      }
    }

    setRecordingPermissionGranted(true);
    return true;

  } catch (error) {
    console.error('[VideoUpload] Media access error:', error);
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
      supportedType = '';
      console.warn('[VideoUpload] No specific codec supported, using browser default');
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
    console.error('[VideoUpload] Recording error:', error);
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


  // Reset form completely
  const resetForm = () => {
    console.log("[VideoUpload] Resetting form.");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoUrl && videoUrl.startsWith('blob:')) URL.revokeObjectURL(videoUrl);
    
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
    setVideoPosition('');
    setVideoType('');
    setHashtags([]);
    setNewHashtag('');
    setShowRecordDialog(false);
    setUploadId(null); 
    setTempLocalId(null); // Crucial: Reset tempLocalId on form reset
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render different steps
  const renderInitialStep = () => (
    <>
      <Typography variant="h5" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 0.5 }}>{i18n.t('auto_upload_your_video_resume')}</Typography>
      <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 2 }}>{i18n.t('auto_show_employers_who_you_are_in_15_45_seco')}</Typography>

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
        <Typography variant="body2" color="textSecondary">{i18n.t('auto_or_click_to_browse_files_15_45_seconds')}</Typography>
      </UploadBox>

      <Stack spacing={1.5} sx={{ mt: "20px" }}>
        <VideoButton 
          variant="contained" 
          disableElevation 
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
        >{i18n.t('auto_select_video')}</VideoButton>
        <SecondaryButton 
          variant="outlined" 
          disableElevation 
          startIcon={<VideocamIcon />}
          onClick={() => setShowRecordDialog(true)}
        >{i18n.t('auto_record_new_video')}</SecondaryButton>
      </Stack>
    </>
  );
  
  const renderPreviewStep = () => (
    <>
      <Typography variant="h5" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 0.5 }}>{i18n.t('auto_preview_your_video')}</Typography>
      <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 2 }}>{i18n.t('auto_make_sure_your_video_looks_and_sounds_go')}</Typography>

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
        >{i18n.t('auto_use_this_video')}</VideoButton>
        <SecondaryButton 
          variant="outlined" 
          disableElevation 
          startIcon={<RefreshIcon />}
          onClick={resetForm}
        >{i18n.t('auto_start_over')}</SecondaryButton>
      </Stack>
    </>
  );
  
  const renderMetadataStep = () => (
    <>
      <Typography variant="h5" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 0.5 }}>{i18n.t('auto_video_details')}</Typography>
      <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 2 }}>{i18n.t('auto_add_information_about_your_video_resume')}</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={i18n.t('auto_video_title')} 
            variant="outlined"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            required
            placeholder={i18n.t('auto_e_g_my_professional_introduction')} 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={i18n.t('auto_category')} 
            variant="outlined"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={i18n.t('auto_e_g_engineering_design')} 
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={i18n.t('auto_source_page')} 
            variant="outlined"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder={i18n.t('auto_e_g_profile_job_post')} 
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>{i18n.t('auto_video_position')}</InputLabel>
            <Select
              value={videoPosition}
              onChange={(e) => setVideoPosition(e.target.value)}
              label={i18n.t('auto_video_position')} 
            >
              <MenuItem value="main">{i18n.t('auto_main')}</MenuItem>
              <MenuItem value="intro">{i18n.t('auto_intro')}</MenuItem>
              <MenuItem value="outro">{i18n.t('auto_outro')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>{i18n.t('auto_video_type')}</InputLabel>
            <Select
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              label={i18n.t('auto_video_type')} 
            >
              <MenuItem value="intro">{i18n.t('auto_introduction')}</MenuItem>
              <MenuItem value="skills">{i18n.t('auto_skills_showcase')}</MenuItem>
              <MenuItem value="experience">{i18n.t('auto_work_experience')}</MenuItem>
              <MenuItem value="portfolio">{i18n.t('auto_portfolio')}</MenuItem>
              <MenuItem value="personal">{i18n.t('auto_personal_statement')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>{i18n.t('auto_add_hashtags_skills_industries_etc')}</Typography>
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
                placeholder={i18n.t('auto_add_a_hashtag_e_g_webdesign')} 
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
            {uploadStatus === 'preparing' && 'Preparing video for upload...'}
            {uploadStatus === 'uploading' && `Uploading video... ${uploadProgress}%`}
            {uploadStatus === 'processing' && 'Processing video...'}
          </Typography>
          <LinearProgress 
            variant={
              uploadStatus === 'processing' ? 'indeterminate' : 'determinate'
            } 
            value={uploadProgress} 
            color={
              uploadStatus === 'failed' ? 'error' : 
              uploadStatus === 'completed' ? 'success' : 'primary'
            }
          />
          {uploadStatus === 'processing' && (
            <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>{i18n.t('auto_this_may_take_a_few_minutes_you_can_chec')}</Typography>
          )}
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
        >{i18n.t('auto_back_to_preview')}</SecondaryButton>
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
            aria-label={i18n.t('auto_close_1')} 
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
              <Typography variant="body1">{i18n.t('auto_camera_preview_will_appear_here')}</Typography>
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
              >{i18n.t('auto_start_recording')}</Button>
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
      bgcolor: 'background.jobseeker',
      minHeight: "100vh",
      py: 3 ,pt: {
      xs: 20,  
      sm: 16   
    }
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

export default VideoUpload;
