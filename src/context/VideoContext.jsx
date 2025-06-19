import React, { createContext, useContext, useState, useEffect } from 'react';
import { uploadVideo, saveVideoMetadata ,getVideoStatus} from '../services/videoService';
import api from '../services/api'; // Make sure this import is present if used in retryUpload

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

  // Status check for all processing videos
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updates = await Promise.all(
          videos
            .filter(video => (video.status === 'processing' || video.status === 'uploading') && video.id)
            .map(async (video) => {
              try {
                console.log(`Checking status for video: ${video.id}`);
                const response = await getVideoStatus(video.id);
                const data = response.data;
                
                console.log(`Status check response for ${video.id}:`, data);

                if (data.status === 'completed') {
                  console.log(`Video ${video.id} completed processing`);
                  return {
                    id: video.id,
                    updates: {
                      status: 'completed',
                      video_url: data.video_url,
                      isLocal: false, // Mark as not local once successfully on server
                      ...data.video
                    }
                  };
                } else if (data.status === 'failed') {
                  console.log(`Video ${video.id} failed processing`);
                  return {
                    id: video.id,
                    updates: {
                      status: 'failed',
                      error: data.message || 'Processing failed',
                      isLocal: true, // Keep as local if server doesn't know it or failed
                    }
                  };
                }
                // If status is still processing/uploading, no update needed here.
                return null;
              } catch (error) {
                console.error(`Status check error for video ${video.id}:`, error);
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
                    }
                  }
                }
                return null;
              }
            })
        );

        const validUpdates = updates.filter(Boolean);
        if (validUpdates.length > 0) {
          console.log('Applying updates to videos:', validUpdates);
          setVideos(prev => prev.map(video => {
            const update = validUpdates.find(u => u.id === video.id);
            return update ? { ...video, ...update.updates } : video;
          }));
        }
      } catch (error) {
        console.error('Error in status check interval:', error);
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
    const newVideo = {
      ...video,
      isLocal: true,
      status: 'uploading',
      progress: 0,
      submitted_at: new Date().toISOString()
    };
    setVideos(prev => [...prev, newVideo]);
    console.log('Added new local video:', newVideo);
    return newVideo;
  };

  const updateVideoStatus = (id, updates) => {
    console.log(`Updating video ${id} with:`, updates);
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, ...updates } : video
    ));
  };

  // NEW FUNCTION: Handles changing the ID of an existing video entry
  const updateVideoServerId = (tempId, serverId, initialUpdates = {}) => {
    setVideos(prev => prev.map(video => {
      if (video.id === tempId) {
        console.log(`Transitioning video ID from ${tempId} to ${serverId} in context.`);
        return { ...video, id: serverId, ...initialUpdates };
      }
      return video;
    }));
  };

  const removeVideo = (videoId) => {
    setVideos(prev => {
      const videoToRemove = prev.find(v => v.id === videoId);
      if (videoToRemove && videoToRemove.video_url?.startsWith('blob:')) {
        URL.revokeObjectURL(videoToRemove.video_url); // Revoke URL if it's a blob
      }
      return prev.filter(video => video.id !== videoId);
    });
  };

  const retryUpload = async (videoId) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

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

        // Update with new upload ID if provided by the upload response
        // Note: The ID in context might still be the local tempId at this point.
        // We need to ensure the ID is correctly transitioned.
        updateVideoServerId(videoId, response.data.uploadId, { // Use new function
          status: 'processing',
          isLocal: true, // It's still local until server confirms completion
        });
        return response.data.uploadId;
      } 
      // For server videos (or local videos that might have an ID but are stuck processing server-side)
      else {
        // Call a dedicated retry-processing API or re-trigger upload if needed
        const response = await api.post(`/videos/${videoId}/retry-upload`); // Or retry-processing
        updateVideoStatus(videoId, {
          status: 'processing'
        });
        return videoId;
      }
    } catch (error) {
      console.error(`Retry failed for video ${videoId}:`, error);
      updateVideoStatus(videoId, {
        status: 'failed',
        error: error.message || 'Retry failed',
        isLocal: true,
      });
      throw error;
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
