import React, { createContext, useContext, useState, useEffect } from 'react';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('videoResumes');
    return saved ? JSON.parse(saved) : [];
  });

  // Add this useEffect to clean up blob URLs when videos are removed
  useEffect(() => {
    return () => {
      videos.forEach(video => {
        if (video.isLocal && video.video_url?.startsWith('blob:')) {
          URL.revokeObjectURL(video.video_url);
        }
      });
    };
  }, [videos]);

  const addLocalVideo = (video) => {
    const newVideo = {
      ...video,
      isLocal: true,
      status: 'uploading',
      progress: 0,
      submitted_at: new Date().toISOString()
    };
    setVideos(prev => [...prev, newVideo]);
    return newVideo;
  };

  const updateVideoStatus = (id, updates) => {
    setVideos(prev => prev.map(video => {
      if (video.id === id) {
        // If updating from local to server version, clean up blob URL
        if (video.isLocal && !updates.isLocal && video.video_url?.startsWith('blob:')) {
          URL.revokeObjectURL(video.video_url);
        }
        return { ...video, ...updates };
      }
      return video;
    }));
  };

  return (
    <VideoContext.Provider value={{ videos, addLocalVideo, updateVideoStatus }}>
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