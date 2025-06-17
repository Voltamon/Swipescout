// src/components/VideoFeedViewer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { VolumeUp, VolumeOff, BookmarkBorder, Share } from '@mui/icons-material';
import api from '../services/api';

const VideoFeedViewer = () => {
  const { state } = useLocation();
  const { currentVideo, allVideos = [], initialPage = 1 } = state || {};

  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const navigate = useNavigate();

  const [mutedStates, setMutedStates] = useState({});
  const [playingStates, setPlayingStates] = useState({});
  const [videos, setVideos] = useState(allVideos);
  const [page, setPage] = useState(initialPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isMuted, setIsMuted] = useState(true);


  // Scroll to selected video on load
  useEffect(() => {
    const index = videos.findIndex(v => v.id === currentVideo.id);
    if (index !== -1 && containerRef.current) {
      setTimeout(() => {
        containerRef.current.scrollTo({
          top: index * window.innerHeight,
          behavior: 'instant'
        });
      }, 50);
    }
  }, [currentVideo, videos]);

  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    },
    {
      threshold: 0.6, // play when 60% of the video is visible
    }
  );

  Object.values(videoRefs.current).forEach(video => {
    if (video) observer.observe(video);
  });

  return () => {
    observer.disconnect();
  };
}, []);

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !loadingMore) {
        loadNextPage();
      }
    };

    const el = containerRef.current;
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  const loadNextPage = async () => {
    setLoadingMore(true);
    try {
      const res = await api.get(`/videos/?page=${page + 1}&limit=10`);
      const newVideos = res.data.videos;
      if (!newVideos || newVideos.length === 0) {
        setHasMore(false);
      } else {
        setVideos(prev => [...prev, ...newVideos]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to fetch more videos', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Pause videos out of view
  useEffect(() => {
    const handleScroll = () => {
      const all = Object.entries(videoRefs.current);
      all.forEach(([id, video]) => {
        if (!video) return;
        const rect = video.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;


        if (inView) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    };

    const el = containerRef.current;
    el.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

const toggleMute = () => {
  setIsMuted(prev => !prev);
};


  const togglePlay = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayingStates(prev => ({ ...prev, [id]: true }));
      } else {
        video.pause();
        setPlayingStates(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        
      }}
    >
      {videos.map((video) => {
        

        return (
          <div
            key={video.id}
            style={{
              height: '100vh',
              scrollSnapAlign: 'start',
              position: 'relative',
              backgroundColor: 'black',
              mt:'0px'
            }}
          >
            <video
              ref={el => videoRefs.current[video.id] = el}
              src={video.video_url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer'
              }}
              muted={isMuted}
              loop
              playsInline
              autoPlay
              onClick={() => togglePlay(video.id)}
            />

            {/* Title and info */}
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: '20px',
              color: 'white',
              zIndex: 10,
            }}>
              <h3>{video.video_title || 'Untitled'}</h3>
              <p>{video.video_type} • {Math.round(video.video_duration || 0)}s</p>
            </div>

            {/* Mute/Unmute icon */}
            <IconButton
              onClick={toggleMute}
              sx={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: 100,
              }}
            >
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>

            {/* Save & Share buttons */}
            <div style={{
              position: 'absolute',
              bottom: '30px',
              right: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              zIndex: 100,
            }}>
              <IconButton sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}>
                <BookmarkBorder />
              </IconButton>
              <IconButton sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}>
                <Share />
              </IconButton>
            </div>

            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 10px',
                cursor: 'pointer',
                zIndex: 100,
              }}
            >
              Back
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default VideoFeedViewer;
