import React, { createContext, useContext, useState, useEffect } from 'react';
import { uploadVideo, saveVideoMetadata ,getVideoStatus} from '../services/videoService';

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
                      isLocal: false,
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
                     
                    }
                  };
                }
              } catch (error) {
                console.error(`Status check error for video ${video.id}:`, error);
                if (error.response?.status === 404) {
                  return {
                    id: video.id,
                    updates: {
                      status: 'failed',
                      error: 'Processing failed',
                      isLocal: true,
                      
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

  // Clean up local blob URLs when videos are removed or updated
  useEffect(() => {
    return () => {
      videos.forEach(video => {
        if (video.isLocal && video.video_url?.startsWith('blob:')) {
          URL.revokeObjectURL(video.video_url);
        }
      });
    };
  }, []);

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

  const retryUpload = async (videoId) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    try {
      updateVideoStatus(videoId, { status: 'uploading', progress: 0, error: null });
      
      const formData = new FormData();
      const videoBlob = await fetch(video.video_url).then(r => r.blob());
      const videoFile = new File([videoBlob], `video-retry-${Date.now()}.webm`, { type: 'video/webm' });

      formData.append('video', videoFile);
      formData.append('title', video.video_title);
      formData.append('jobId', video.job_id);
      formData.append('hashtags', video.hashtags);
      formData.append('videoType', video.video_type);
      formData.append('videoDuration', video.video_duration);

      const response = await uploadVideo(formData, (progress) => {
        updateVideoStatus(videoId, { progress });
      });

      updateVideoStatus(videoId, {
        id: response.uploadId,
        status: 'processing'
      });

      console.log(`Retry upload successful for video ${videoId}, new uploadId: ${response.uploadId}`);
    } catch (error) {
      console.error(`Retry upload failed for video ${videoId}:`, error);
      updateVideoStatus(videoId, {
        status: 'failed',
        error: error.message
      });
    }
  };

  return (
    <VideoContext.Provider value={{ 
      videos, 
      addLocalVideo, 
      updateVideoStatus,
      retryUpload
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