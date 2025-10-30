// VideoUploadLogic.js
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useVideoContext } from "@/contexts/VideoContext";
import {

  checkUploadStatus
} from "@/services/api";
import { uploadVideo, saveVideoMetadata } from "@/services/videoService";

import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';

// This custom hook encapsulates all the logic for the video upload process.
const useVideoUploadLogic = () => {
  const [recordingStep, setRecordingStep] = useState(0); // 0: initial, 1: preview, 2: metadata
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const navigate = useNavigate();
  const { video_id: videoIdParam } = useParams();
  const { user } = useAuth();
  const { uploadStatus, setUploadStatus } = useVideoContext();

  useEffect(
    () => {
      // Handle background upload status check on mount and update
      if (videoIdParam && user && !hasCheckedStatus) {
        const checkStatus = async () => {
          try {
            const status = await checkUploadStatus(videoIdParam, user.token);
            if (
              status &&
              status.stage === "PROCESSING" &&
              status.status === "IN_PROGRESS"
            ) {
              setSnackbar({
                open: true,
                message:
                  "Your video is still being processed in the background.",
                severity: "info"
              });
              setUploadStatus({ stage: "PROCESSING", status: "IN_PROGRESS" });
              setHasCheckedStatus(true); // Mark as checked to prevent repeated calls
            }
          } catch (error) {
            console.error("Error checking upload status:", error);
          }
        };
        checkStatus();
      }
    },
    [videoIdParam, user, hasCheckedStatus, setUploadStatus]
  );

  // Handle timer for recording
  useEffect(
    () => {
      if (isRecording) {
        timerRef.current = setInterval(() => {
          setRecordingTime(prevTime => {
            const newTime = prevTime + 1;
            if (newTime >= 45) {
              stopRecording();
              return 45;
            }
            return newTime;
          });
        }, 1000);
      } else if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    },
    [isRecording]
  );

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      setDialogOpen(true);
      setIsRecording(true);
      setRecordedChunks([]);
      setRecordingTime(0);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: "video/webm; codecs=vp9"
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        setVideoBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        setDialogOpen(false);
        setRecordingStep(1); // Move to preview step
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setSnackbar({
        open: true,
        message:
          "Error accessing camera or microphone. Please check permissions.",
        severity: "error"
      });
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsRecording(false);
      setDialogOpen(false);
    }
  };

  const retakeVideo = () => {
    setRecordingStep(0);
    setVideoUrl(null);
    setVideoBlob(null);
    setRecordedChunks([]);
    setIsRecording(false);
  };

  const handleTitleChange = e => setTitle(e.target.value);
  const handleDescriptionChange = e => setDescription(e.target.value);
  const handleNewTagChange = e => setNewTag(e.target.value);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = tagToRemove => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = async event => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setVideoUrl(fileUrl);
      setVideoBlob(file);
      setRecordingStep(1); // Go to preview step
    }
  };

  const uploadAndSave = async () => {
    if (!videoBlob) {
      setSnackbar({
        open: true,
        message: "No video to upload.",
        severity: "warning"
      });
      return;
    }

    if (!title || !description) {
      setSnackbar({
        open: true,
        message: "Title and description are required.",
        severity: "warning"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const videoId = uuidv4();
      const uploadResponse = await uploadVideo(videoId, videoBlob, progress => {
        setUploadProgress(progress);
      });

      if (uploadResponse.success) {
        setSnackbar({
          open: true,
          message: "Video uploaded successfully!",
          severity: "success"
        });

        const metadata = {
          id: videoId,
          title,
          description,
          tags,
          uploadedBy: user.uid,
          uploadDate: new Date().toISOString(),
          processingStatus: "IN_PROGRESS"
        };
        await saveVideoMetadata(metadata, user.token);

        // Navigate to a video processing page or a dashboard
        setUploadStatus({ stage: "PROCESSING", status: "IN_PROGRESS" });
        navigate(`/video/${videoId}/processing`);
      } else {
        throw new Error(uploadResponse.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload and save failed:", error);
      setSnackbar({
        open: true,
        message: `Upload failed: ${error.message}`,
        severity: "error"
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Function to handle moving to the next step
  const goToMetadataStep = () => {
    setRecordingStep(2);
  };

  const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return {
    recordingStep,
    isRecording,
    stream,
    recordingTime,
    videoUrl,
    videoBlob,
    title,
    description,
    tags,
    newTag,
    uploading,
    uploadProgress,
    snackbar,
    dialogOpen,
    isMuted,
    isAudioOnly,
    videoRef,
    mediaRecorderRef,
    timerRef,
    handleTitleChange,
    handleDescriptionChange,
    handleNewTagChange,
    addTag,
    removeTag,
    handleFileUpload,
    uploadAndSave,
    toggleAudio,
    togglePlayPause,
    startRecording,
    stopRecording,
    retakeVideo,
    setRecordingStep,
    goToMetadataStep,
    closeSnackbar
  };
};

export default useVideoUploadLogic;
