/* eslint-disable react-refresh/only-export-components -- TODO: move provider helpers to separate modules */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { uploadVideo, saveVideoMetadata ,getVideoStatus} from '@/services/videoService';
import api from '@/services/api'; // Make sure this import is present if used in retryUpload

const VideoContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('videoResumes');
    return saved ? JSON.parse(saved) : [];
  });

  // Save videos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('videoResumes', JSON.stringify(videos));
  }, [videos]);

  // Status check for all processing videos or videos marked as serverProcessing
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updates = await Promise.all(
          videos
            .filter(video => ((video.status === 'processing' || video.status === 'uploading') || video.serverProcessing) && video.id)
            .map(async (video) => {
              try {
                console.log(`[VideoContext] Checking status for video: ${video.id}`);
                const response = await getVideoStatus(video.id);
                const data = response.data;
                
                console.log(`[VideoContext] Status check response for ${video.id}:`, data);

                if (data.status === 'completed') {
                  console.log(`[VideoContext] Video ${video.id} completed processing`);
                  // Keep the video in local state but mark it completed and update URL to server-provided URL.
                  const serverVideo = data.video || {};
                  const serverVideoUrl =
                    serverVideo.secure_url || serverVideo.video_url || serverVideo.videoUrl || data.video_url || null;
                  const serverId = serverVideo.id || serverVideo._id || null;

                  // If the server returned a canonical video id different from the temp id, update it.
                  if (serverId && serverId !== video.id) {
                    updateVideoServerId(video.id, serverId, {
                      status: 'completed',
                      isLocal: false,
                      serverProcessing: false,
                      video_url: serverVideoUrl,
                      videoUrl: serverVideoUrl,
                      job_id: video.job_id,
                      ...serverVideo
                    });
                    return null; // we already updated state via updateVideoServerId
                  }

                  return {
                    id: video.id,
                    updates: {
                      status: 'completed',
                      video_url: serverVideoUrl,
                      videoUrl: serverVideoUrl,
                      isLocal: false,
                      job_id: video.job_id,
                      ...serverVideo
                    }
                  };
                } else if (data.status === 'failed') {
                  console.log(`[VideoContext] Video ${video.id} failed processing`);
                  return {
                    id: video.id,
                    updates: {
                      status: 'failed',
                      error: data.message || 'Processing failed',
                      isLocal: true, // Keep as local if server doesn't know it or failed
                      serverProcessing: false,
                      job_id: video.job_id // Preserve job_id
                    }
                  };
                }
                // If status is still processing/uploading, no update needed here.
                return null;
              } catch (error) {
                console.error(`[VideoContext] Status check error for video ${video.id}:`, error);
                if (error.response?.status === 404) {
                  // If server returns 404, the video might have been deleted from server
                  // or never reached it. Mark as failed and local to keep it in context
                  // for potential retry from videos page or manual cleanup.
                  return {
                    id: video.id,
                    updates: {
                      status: 'failed',
                      error: 'Processing failed: Video not found on server.',
                      isLocal: true, // Keep as local if server doesn't know it
                      job_id: video.job_id // Preserve job_id even if 404
                    }
                  }
                }
                return null;
              }
            })
        );

        const validUpdates = updates.filter(Boolean);
        if (validUpdates.length > 0) {
          console.log('[VideoContext] Applying updates to videos:', validUpdates);
          setVideos(prev => prev.map(video => {
            const update = validUpdates.find(u => u.id === video.id);
            return update ? { ...video, ...update.updates } : video;
          }));
        }
      } catch (error) {
        console.error('[VideoContext] Error in status check interval:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [videos]);

  // Clean up local blob URLs when component unmounts or videos change
  useEffect(() => {
    return () => {
      videos.forEach(video => {
        if (video.isLocal && video.video_url?.startsWith('blob:')) {
          URL.revokeObjectURL(video.video_url);
        }
      });
    };
  }, []); // Depend on videos to ensure cleanup when videos array itself changes

  const addLocalVideo = (video) => {
    // Prevent adding duplicate entries if an ID (temp or server) already exists
    if (videos.some(v => v.id === video.id)) {
      console.warn(`[VideoContext] Video with ID ${video.id} already exists. Not adding duplicate.`);
      return video; // Return existing video or just prevent action
    }

    // Respect caller-provided status (e.g., 'completed' for immediate local preview).
    const newVideo = {
      ...video,
      isLocal: true,
      status: video.status || 'uploading',
      serverProcessing: video.serverProcessing || false,
      progress: video.progress ?? 0,
      submitted_at: video.submitted_at || new Date().toISOString()
    };
    setVideos(prev => [...prev, newVideo]);
    console.log('[VideoContext] Added new local video:', newVideo);
    return newVideo;
  };

  // In the updateVideoStatus function, make sure it handles job_id properly
  const updateVideoStatus = (id, updates) => {
    console.log(`[VideoContext] Updating video ${id} with:`, updates);
    setVideos(prev => prev.map(video => {
      if (video.id === id) {
        // If transitioning from local to server URL, clean up old blob
        if (video.isLocal && updates.isLocal === false) {
          if (video.video_url?.startsWith('blob:')) {
            console.log(`[VideoContext] Revoking old blob URL in updateVideoStatus: ${video.video_url}`);
            URL.revokeObjectURL(video.video_url);
          }
          if (video.videoUrl?.startsWith('blob:')) {
            console.log(`[VideoContext] Revoking old blob URL in updateVideoStatus: ${video.videoUrl}`);
            URL.revokeObjectURL(video.videoUrl);
          }
        }
        return { ...video, ...updates };
      }
      return video;
    }));
  };

  // Handles changing the ID of an existing video entry
  // This is crucial for transitioning from a temporary client-side ID to a server-assigned ID.
  const updateVideoServerId = (tempId, serverId, initialUpdates = {}) => {
    setVideos(prev => {
      let updated = false;
      const newVideos = prev.map(video => {
        if (video.id === tempId) {
          updated = true;
          console.log(`[VideoContext] Transitioning video ID from ${tempId} to ${serverId}.`);
          
          // If we're transitioning from local (blob URL) to server (permanent URL),
          // clean up the old blob URL to free memory
          if (video.isLocal && initialUpdates.isLocal === false) {
            if (video.video_url?.startsWith('blob:')) {
              console.log(`[VideoContext] Revoking old blob URL: ${video.video_url}`);
              URL.revokeObjectURL(video.video_url);
            }
            if (video.videoUrl?.startsWith('blob:')) {
              console.log(`[VideoContext] Revoking old blob URL: ${video.videoUrl}`);
              URL.revokeObjectURL(video.videoUrl);
            }
          }
          
          return { ...video, id: serverId, ...initialUpdates };
        }
        return video;
      });
      if (!updated) {
        console.warn(`[VideoContext] Could not find video with tempId ${tempId} to update its server ID to ${serverId}. It might have been removed or ID already changed.`);
      }
      return newVideos;
    });
  };

  const removeVideo = (videoId) => {
    setVideos(prev => {
      const videoToRemove = prev.find(v => v.id === videoId);
      if (videoToRemove ) { //&& videoToRemove.video_url?.startsWith('blob:')
        URL.revokeObjectURL(videoToRemove.video_url); // Revoke URL if it's a blob
      }
      console.log(`[VideoContext] Removing video with ID: ${videoId}`);
      return prev.filter(video => video.id !== videoId);
    });
  };

  const retryUpload = async (videoId) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) {
      console.error(`[VideoContext] Retry failed: Video ${videoId} not found in context.`);
      return;
    }

    try {
      updateVideoStatus(videoId, { 
        status: 'uploading', 
        progress: 0, 
        error: null 
      });

      // If it's a local video with a blob URL (meaning it needs re-uploading)
      if (video.isLocal && video.video_url?.startsWith('blob:')) { 
        const formData = new FormData();
        const videoBlob = await fetch(video.video_url).then(r => r.blob());
        const videoFile = new File([videoBlob], `video-retry-${Date.now()}.webm`, { 
          type: 'video/webm' 
        });

        formData.append('video', videoFile);
        formData.append('title', video.video_title);
        formData.append('jobId', video.job_id || ''); // Use the stored jobId
        formData.append('hashtags', video.hashtags);
        formData.append('videoType', video.video_type);
        formData.append('videoDuration', video.video_duration);

        const response = await uploadVideo(formData, (progress) => {
          updateVideoStatus(videoId, { progress });
        });

        // The ID will remain the same if it was already a server ID from a previous failed attempt.
        // If it was a temp local ID that never got a server ID, it will get one now.
        // Mark serverProcessing so the UI can keep the uploaded look but still
        // poll the server for completion.
        updateVideoServerId(videoId, response.data.uploadId, {
          serverProcessing: true,
          isLocal: true, // It's still local until server confirms completion
        });
        console.log(`[VideoContext] Retry upload successful for tempId ${videoId}. New serverId: ${response.data.uploadId}`);
        return response.data.uploadId;
      } else {
      // For server videos (or local videos that might have an ID but are stuck processing server-side)
          // Call a dedicated retry-processing API or re-trigger upload if needed
          // const response = await api.post(`/videos/${videoId}/retry-upload`); // Or retry-processing
          // Mark as serverProcessing to indicate backend work while keeping
          // the uploaded preview visible locally.
          updateVideoStatus(videoId, {
            serverProcessing: true,
            status: 'completed'
          });
          console.log(`[VideoContext] Retry processing triggered for serverId: ${videoId}`);
          return videoId;
        }
    } catch (error) {
      console.error(`[VideoContext] Retry failed for video ${videoId}:`, error);
      updateVideoStatus(videoId, {
        status: 'failed',
        error: error.message || 'Retry failed',
        isLocal: true, // Mark as local if retry fails, so it's visible for another retry
      });
      throw error; // Re-throw to propagate the error if needed by caller
    }
  };

  return (
    <VideoContext.Provider value={{ 
      videos, 
      addLocalVideo, 
      updateVideoStatus,
      updateVideoServerId, // Expose the new function
      retryUpload,
      removeVideo, 
    }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};
