// src/context/VideoContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('videoResumes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('videoResumes', JSON.stringify(videos));
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
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, ...updates } : video
    ));
  };

  return (
    <VideoContext.Provider value={{ videos, addLocalVideo, updateVideoStatus }}>
      {children}
    </VideoContext.Provider>
  );
};

// Custom hook to use the video context
export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};