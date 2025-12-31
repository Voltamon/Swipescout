import i18n from 'i18next';
// AllVideosPage.jsx - TikTok Style Vertical Video Feed with Tailwind
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVideoContext } from '@/contexts/VideoContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Play, Pause, VolumeX, Volume2, Share2, Heart,
  Bookmark, UserPlus, ArrowUp, ArrowDown, Home, X,
  MessageCircle, Eye, Clock, ChevronUp, ChevronDown, User,
  Video, Loader2
} from 'lucide-react';
import themeColors from '@/config/theme-colors-employer';
import { useAuth } from '@/contexts/AuthContext';
import useConnectionMap from '@/hooks/useConnectionMap.jsx';
import { 
  getAllVideos, 
  getEmployerPublicVideos, 
  getJobSeekersVideos,
  likeVideo,
  saveVideo,
  connectWithUser,
  searchVideos
} from '@/services/api';
import { Card, CardContent } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { useToast } from '@/hooks/use-toast';
import OpenChatModal from '@/components/Chat/OpenChatModal.jsx';

// Sample videos data generator
const getSampleVideos = (t) => [
  {
    id: '2b1f4b8e-9f3c-4d2a-9c6b-1a2d3e4f5a61',
    video_title: t('sampleVideos.softwareEngineerResume'),
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    video_type: t('sampleVideos.jobSeeker'),
    video_duration: 30,
    user: {
      displayName: t('sampleVideos.ahmedHassan'),
      profile_image: null,
      role: 'jobseeker'
    },
    hashtags: '#SoftwareEngineer #React #JavaScript',
    isSample: true,
    likes_count: 245,
    views_count: 1200
  },
  {
    id: '3c2e5a9d-6b4f-4e1a-8d7c-2b3a4f6e7d82',
    video_title: t('sampleVideos.marketingManagerPosition'),
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    video_type: t('sampleVideos.jobSeeker'),
    video_duration: 25,
    user: {
      displayName: t('sampleVideos.saraAhmed'),
      profile_image: null,
      role: 'jobseeker'
    },
    hashtags: '#Marketing #Manager #Creative',
    isSample: true,
    likes_count: 189,
    views_count: 890
  },
  {
    id: '4d3f6b0a-7c5e-4f2b-9e8a-3c4b5a6d8e93',
    video_title: t('sampleVideos.techCompanyHiring'),
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    video_type: t('sampleVideos.employer'),
    video_duration: 35,
    user: {
      displayName: t('sampleVideos.techCorpSolutions'),
      profile_image: null,
      role: 'employer'
    },
    hashtags: '#Hiring #TechJobs #Innovation',
    isSample: true,
    likes_count: 312,
    views_count: 1500
  },
  {
    id: '5e4a7c1b-8d6f-4a3c-0f9b-4d5c6b7a9f04',
    video_title: t('sampleVideos.dataScientistResume'),
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    video_type: t('sampleVideos.jobSeeker'),
    video_duration: 28,
    user: {
      displayName: t('sampleVideos.omarKhaled'),
      profile_image: null,
      role: 'jobseeker'
    },
    hashtags: '#DataScience #Python #AI',
    isSample: true,
    likes_count: 156,
    views_count: 720
  }
];

const AllVideosPage = ({ 
  pagetype: propPagetype, 
  onClose,
  context = 'general',
  filterType = null,
  showSidebar = true,
  showHeader = true,
  fullScreen = false 
}) => {
  const { t } = useTranslation();
  const { videos: localVideos } = useVideoContext();
  const [serverVideos, setServerVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [savedVideos, setSavedVideos] = useState(new Set());

  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const { pagetype: urlPagetype } = useParams();
  const pagetype = propPagetype || urlPagetype;
  const { user } = useAuth();
  const { toast } = useToast();
  const { connectionMap, refresh: refreshConnections } = useConnectionMap();
  const [openConversation, setOpenConversation] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const dragStartY = useRef(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // Combine real videos with sample videos (must be declared before effects that reference it)
  const allVideos = React.useMemo(() => {
    const realVideos = [
      ...serverVideos.map(v => ({ ...v, isLocal: false, status: v.status || 'completed' }))
    ];

    if (realVideos.length < 5) {
      const sampleVideos = getSampleVideos(t);
      
      let filteredSamples = sampleVideos;
      if (pagetype === 'jobseekers') {
        filteredSamples = sampleVideos.filter(v => v.user.role === 'jobseeker');
      } else if (pagetype === 'employers') {
        filteredSamples = sampleVideos.filter(v => v.user.role === 'employer');
      }

      return [...realVideos, ...filteredSamples];
    }

    return realVideos;
  }, [serverVideos, pagetype, t]);
  
  // keyboard navigation while modal open
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        setCurrentVideoIndex(i => Math.min(allVideos.length - 1, i + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        setCurrentVideoIndex(i => Math.max(0, i - 1));
      } else if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, allVideos.length]);

  // Gesture / fling helpers
  const lastPointerY = useRef(0);
  const lastPointerTime = useRef(0);
  const velocityRef = useRef(0);
  const animFrameRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const dragDeltaRef = useRef(0);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    isPointerDownRef.current = true;
    dragStartY.current = e.clientY;
    lastPointerY.current = e.clientY;
    lastPointerTime.current = performance.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current) return;
    const now = performance.now();
    const dy = e.clientY - lastPointerY.current;
    const dt = Math.max(1, now - lastPointerTime.current);
    velocityRef.current = dy / dt; // px per ms
    lastPointerY.current = e.clientY;
    lastPointerTime.current = now;
    const v = e.clientY - dragStartY.current;
    dragDeltaRef.current = v;
    setDragDelta(v);
  };

  const handlePointerUp = (e) => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const v = velocityRef.current;
    const delta = dragDeltaRef.current || 0;
    const threshold = 80; // pixels
    const velocityThreshold = 0.5; // px/ms
    if (Math.abs(v) > velocityThreshold) {
      // start fling animation in the direction of velocity
      startFling(v);
    } else {
      if (delta < -threshold) {
        goToVideo(currentVideoIndex + 1);
      } else if (delta > threshold) {
        goToVideo(currentVideoIndex - 1);
      }
      dragDeltaRef.current = 0;
      setDragDelta(0);
      velocityRef.current = 0;
    }
  };

  // Touch fallback for older browsers (iOS Safari pre-PointerEvents)
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    setIsDragging(true);
    isPointerDownRef.current = true;
    const y = e.touches[0].clientY;
    dragStartY.current = y;
    lastPointerY.current = y;
    lastPointerTime.current = performance.now();
  };

  const handleTouchMove = (e) => {
    if (!isPointerDownRef.current || !e.touches || e.touches.length === 0) return;
    const y = e.touches[0].clientY;
    const now = performance.now();
    const dy = y - lastPointerY.current;
    const dt = Math.max(1, now - lastPointerTime.current);
    velocityRef.current = dy / dt;
    lastPointerY.current = y;
    lastPointerTime.current = now;
    const v = y - dragStartY.current;
    dragDeltaRef.current = v;
    setDragDelta(v);
  };

  const handleTouchEnd = (e) => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    const v = velocityRef.current;
    const delta = dragDeltaRef.current || 0;
    const threshold = 80;
    const velocityThreshold = 0.5;
    if (Math.abs(v) > velocityThreshold) {
      startFling(v);
    } else {
      if (delta < -threshold) {
        goToVideo(currentVideoIndex + 1);
      } else if (delta > threshold) {
        goToVideo(currentVideoIndex - 1);
      }
      dragDeltaRef.current = 0;
      setDragDelta(0);
      velocityRef.current = 0;
    }
  };

  // Pause all non-active videos and play active one (reduces CPU)
  useEffect(() => {
    const activeId = allVideos[currentVideoIndex]?.id;
    Object.entries(videoRefs.current).forEach(([id, el]) => {
      try {
        if (!el) return;
        if (id === activeId) {
          el.muted = isMuted;
          if (isPlaying) el.play().catch(() => {});
        } else {
          try { el.pause(); } catch (e) {}
        }
      } catch (e) {
        // ignore
      }
    });
  }, [currentVideoIndex, allVideos, isMuted, isPlaying]);

  // Start a fling/inertia animation based on velocity (px/ms)
  const startFling = (initialVelocity) => {
    // convert px/ms to px per frame (~16ms per frame)
    let v = initialVelocity * 16;
    const decay = 0.95; // decay per frame
    let local = dragDeltaRef.current || 0;
    const step = () => {
      v *= decay;
      local += v;
      dragDeltaRef.current = local;
      setDragDelta(local);

      // if we've dragged past threshold, navigate
      const threshold = 80;
      if (local < -threshold) {
        goToVideo(currentVideoIndex + 1);
        dragDeltaRef.current = 0;
        setDragDelta(0);
        velocityRef.current = 0;
        animFrameRef.current = null;
        return;
      }
      if (local > threshold) {
        goToVideo(currentVideoIndex - 1);
        dragDeltaRef.current = 0;
        setDragDelta(0);
        velocityRef.current = 0;
        animFrameRef.current = null;
        return;
      }

      // stop when velocity decays small
      if (Math.abs(v) < 0.5) {
        dragDeltaRef.current = 0;
        setDragDelta(0);
        velocityRef.current = 0;
        animFrameRef.current = null;
        return;
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);
  };

  // Cleanup video elements on unmount
  useEffect(() => {
    return () => {
      Object.values(videoRefs.current).forEach(el => {
        try {
          if (!el) return;
          el.pause();
          // remove src to free memory
          el.removeAttribute('src');
        } catch (e) {}
      });
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, []);

  // Get context from navigation state
  const navigationContext = location.state?.context;
  const contextVideos = location.state?.videos;
  const initialVideoId = location.state?.videoId;

  // Fetch videos from server based on context
  const fetchServerVideos = async () => {
    try {
      setLoading(true);
      let response;
      
      if (contextVideos && contextVideos.length > 0) {
        setServerVideos(contextVideos);
        
        if (initialVideoId) {
          const initialIndex = contextVideos.findIndex(video => video.id === initialVideoId);
          if (initialIndex !== -1) {
            setCurrentVideoIndex(initialIndex);
          }
        }
        
        setLoading(false);
        return;
      }

      if (navigationContext) {
        const params = {
          category: navigationContext.category,
          subcategory: navigationContext.subcategory,
          search: navigationContext.search,
          sort: navigationContext.sort,
          page: 1,
          limit: 50,
        };
        response = await searchVideos(params);
      } else {
        switch (context) {
          case 'my-videos':
            response = await getAllVideos(1, 50, { userId: user?.id });
            break;
          case 'saved-videos':
            response = await getAllVideos(1, 50, { saved: true });
            break;
          case 'liked-videos':
            response = await getAllVideos(1, 50, { liked: true });
            break;
          case 'candidate-videos':
            response = await getJobSeekersVideos(1, 50);
            break;
          case 'company-videos':
            response = await getEmployerPublicVideos(1, 50);
            break;
          case 'jobseeker-feed':
            response = await getJobSeekersVideos(1, 50);
            break;
          case 'analytics':
            response = await getAllVideos(1, 50, { analytics: true });
            break;
          default:
            if (propPagetype === 'all' || urlPagetype === 'all') {
              response = await getAllVideos(1, 50);
            } else if (propPagetype === 'jobseekers' || urlPagetype === 'jobseekers') {
              response = await getJobSeekersVideos(1, 50);
            } else if (propPagetype === 'employers' || urlPagetype === 'employers') {
              response = await getEmployerPublicVideos(1, 50);
            } else {
              response = await getAllVideos(1, 50);
            }
        }
      }

      const fetchedVideos = response.data.videos || [];
      setServerVideos(fetchedVideos);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerVideos();
  }, [pagetype, context]);

  

  // Handle video navigation
  // Change index with explicit pause/cleanup of previous video to reduce CPU
  const goToVideo = useCallback((index) => {
    const target = Math.max(0, Math.min(allVideos.length - 1, index));
    if (target === currentVideoIndex) return;

    // cancel any running fling animation
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const prevId = allVideos[currentVideoIndex]?.id;
    try {
      const prevEl = videoRefs.current[prevId];
      if (prevEl && !prevEl.paused) {
        prevEl.pause();
      }
    } catch (e) {}

    setCurrentVideoIndex(target);

    // start target video after a tiny delay to allow DOM updates
    setTimeout(() => {
      try {
        const newEl = videoRefs.current[allVideos[target]?.id];
        if (newEl) {
          newEl.currentTime = 0;
          newEl.muted = isMuted;
          if (isPlaying) newEl.play().catch(() => {});
        }
      } catch (e) {}
    }, 80);
  }, [allVideos, currentVideoIndex, isMuted, isPlaying]);

  // Handle scroll navigation
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        goToVideo(currentVideoIndex + 1);
      } else {
        goToVideo(currentVideoIndex - 1);
      }
    };

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          goToVideo(currentVideoIndex - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          goToVideo(currentVideoIndex + 1);
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentVideoIndex, goToVideo]);

  // Auto-play current video
  useEffect(() => {
    const currentVideo = videoRefs.current[allVideos[currentVideoIndex]?.id];
    if (currentVideo && isPlaying) {
      currentVideo.muted = isMuted;
      currentVideo.play().catch(e => console.log('Autoplay prevented:', e));
    }
  }, [currentVideoIndex, allVideos, isPlaying, isMuted]);

  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[allVideos[currentVideoIndex]?.id];
    if (currentVideo) {
      if (currentVideo.paused) {
        currentVideo.play();
        setIsPlaying(true);
      } else {
        currentVideo.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    const currentVideo = videoRefs.current[allVideos[currentVideoIndex]?.id];
    if (currentVideo) {
      currentVideo.muted = !currentVideo.muted;
      setIsMuted(currentVideo.muted);
    }
  };

  const handleLike = (videoId) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
        toast({ description: t("videos.removedFromLikes") });
      } else {
        newSet.add(videoId);
        toast({ description: t("videos.addedToLikes") });
      }
      return newSet;
    });
  };

  const handleSave = (videoId) => {
    setSavedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
        toast({ description: t("videos.removedFromSaved") });
      } else {
        newSet.add(videoId);
        toast({ description: t("videos.savedToCollection") });
      }
      return newSet;
    });
  };

  const handleShare = (video) => {
    if (navigator.share) {
      navigator.share({
        title: video.video_title,
        text: t("videos.checkOutThisVideo", { videoTitle: video.video_title }),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ description: t("videos.linkCopied") });
    }
  };

  const handleConnect = async (video) => {
    if (video.isSample) {
      toast({ description: t("videos.sampleVideoMessage") });
      return;
    }
    try {
      const ownerId = video.userId || video.user?.id;
      const c = connectionMap[ownerId];
      if (c && c.status === 'accepted') {
        toast({ description: 'Already connected' });
        return;
      }
      if (c && c.status === 'pending' && !c.isSender) {
        // prompt to accept or decline
        // Auto-accept for now (if viewing recipient) - better UX: show dialog
        const { data } = await import('@/services/connectionService.js').then(m => m.acceptConnection(c.id));
        await refreshConnections();
        toast({ description: 'Connection accepted' });
        if (data?.conversation) { setOpenConversation(data.conversation); setOpenChat(true); }
        return;
      }
      // If not connected, send request
      await import('@/services/connectionService.js').then(m => m.sendConnection(ownerId));
      await refreshConnections();
      toast({ description: t("videos.connectionRequestSent") });
    } catch (err) {
      console.error('Connection failed', err);
      toast({ description: t('errors.networkError'), variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <Loader2 className={`h-12 w-12 animate-spin ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
        <p className="ml-4 text-lg font-bold">{t('videos.loadingVideos')}</p>
      </div>
    );
  }

  if (error || allVideos.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black text-white text-center p-6">
        <h1 className="text-4xl font-bold mb-4">
          {error ? t('videos.oops') : t('videos.noVideosYet')}
        </h1>
        <p className="text-lg opacity-80 mb-8">
          {error || t('videos.beTheFirstToShare')}
        </p>
        <Button
          onClick={() => navigate('/video-upload')}
          className={`${themeColors.buttons.primary} text-white px-8 py-6 text-lg rounded-full`}
        >
          <Play className="h-5 w-5 mr-2" />
          {t('videos.uploadVideo')}
        </Button>
      </div>
    );
  }

  const currentVideo = allVideos[currentVideoIndex];

  // If not full screen, render in grid layout
  if (!fullScreen) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className={`${themeColors.text.gradient} text-3xl font-bold mb-2`}>
                {pagetype === 'all' ? 'All Videos' :
                 pagetype === 'jobseekers' ? 'Employer'  : 'Job Seekers Videos' }
              </h1>
              <p className="text-muted-foreground">{i18n.t('auto_discover_and_explore_video_content')}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {allVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                videoRefs={videoRefs}
                isMuted={isMuted}
                onClick={() => {
                  // open enlarged feed/modal starting at this video
                  setCurrentVideoIndex(index);
                  setModalOpen(true);
                }}
                onLike={() => handleLike(video.id)}
                onSave={() => handleSave(video.id)}
                onShare={() => handleShare(video)}
                onConnect={() => handleConnect(video)}
                liked={likedVideos.has(video.id)}
                saved={savedVideos.has(video.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">{i18n.t('auto_no_videos_yet')}</h3>
              <p className="text-muted-foreground mb-4">{i18n.t('auto_be_the_first_to_share_your_video_content')}</p>
              <Button
                onClick={() => navigate('/video-upload')}
                className={`${themeColors.buttons.primary} text-white `}
              >
                <Play className="h-4 w-4 mr-2" />{i18n.t('auto_upload_video')}</Button>
            </CardContent>
          </Card>
        )}
        {/* Modal / enlarged vertical feed (TikTok-style) */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black">
            <div className="absolute top-4 left-4">
              <Button size="icon" onClick={() => { setModalOpen(false); }} className="bg-white/10 text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="w-full h-full flex items-center justify-center">
              <div
                className="relative w-full h-full overflow-hidden"
                // Pointer handlers (use pointer events when available)
                onPointerDown={(e) => handlePointerDown(e)}
                onPointerMove={(e) => handlePointerMove(e)}
                onPointerUp={(e) => handlePointerUp(e)}
                // Touch fallback for older browsers that may not support Pointer Events
                onTouchStart={(e) => handleTouchStart(e)}
                onTouchMove={(e) => handleTouchMove(e)}
                onTouchEnd={(e) => handleTouchEnd(e)}
              >
                {/* Virtualized 3-slot slider (prev, current, next) */}
                <VirtualSlider
                  allVideos={allVideos}
                  currentIndex={currentVideoIndex}
                  dragDelta={dragDelta}
                  isDragging={isDragging}
                  isMuted={isMuted}
                  videoRefs={videoRefs}
                  setCurrentVideoIndex={setCurrentVideoIndex}
                  handleLike={handleLike}
                  handleSave={handleSave}
                  handleShare={handleShare}
                  handleConnect={handleConnect}
                  likedVideos={likedVideos}
                  savedVideos={savedVideos}
                />
              </div>
            </div>
          </div>
        )}
        <OpenChatModal open={openChat} onOpenChange={setOpenChat} conversation={openConversation} />
      </div>
    );
  }

  // Full screen layout (original TikTok-style)
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-10 text-white">
        <div className="flex items-center gap-4">
          {onClose ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <Home className="h-6 w-6" />
            </Button>
          )}

          <h2 className="text-xl font-bold">
            {pagetype === 'all' ? 'All Videos' :
             pagetype === 'jobseekers' ? 'Job Seekers' : 'Employers'}
          </h2>
          {currentVideo?.isSample && (
            <Badge className="bg-yellow-500 text-black">{i18n.t('auto_sample')}</Badge>
          )}
        </div>
        <p className="text-sm opacity-80">
          {currentVideoIndex + 1} / {allVideos.length}
        </p>
      </div>

      {/* Video Container */}
      {currentVideo && (
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={el => videoRefs.current[currentVideo.id] = el}
            src={currentVideo.video_url}
            loop
            playsInline
            muted={isMuted}
            onClick={togglePlayPause}
            className="w-full h-full object-cover cursor-pointer"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

          {/* Video Info */}
          <div className="absolute bottom-0 left-0 right-20 p-6 text-white z-10 drop-shadow-[2px_2px_8px_rgba(0,0,0,0.9)]">
            <div className="flex items-center mb-4">
              <Avatar 
                className="w-12 h-12 mr-3 border-2 border-white cursor-pointer hover:ring-2 hover:ring-cyan-400 transition-all"
                onClick={() => !currentVideo.isSample && currentVideo.user?.id && navigate(`/profile/${currentVideo.user.id}`)}
              >
                <AvatarImage src={currentVideo.user?.profile_image || currentVideo.user?.profilePicture} />
                <AvatarFallback>{(currentVideo.user?.display_name || currentVideo.user?.displayName || 'U').charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold">
                  @{currentVideo.user?.display_name || currentVideo.user?.displayName || 'Unknown User'}
                </h3>
                <Badge className={
                  currentVideo.user?.role === 'employer' ?
                  'bg-green-600' : 'bg-blue-600'
                }>
                  {currentVideo.user?.role || currentVideo.video_type}
                </Badge>
              </div>
              {!currentVideo.isSample && currentVideo.user?.id && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/profile/${currentVideo.user.id}`)}
                  className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                >
                  <User className="h-4 w-4 mr-1" />{i18n.t('auto_view_profile')}</Button>
              )}
            </div>

            <h2 className="text-3xl font-bold mb-2">{currentVideo.video_title}</h2>
            <p className="text-lg mb-3 opacity-90">{currentVideo.hashtags}</p>

            <div className="flex gap-6 text-sm opacity-80">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {currentVideo.views_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {currentVideo.likes_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.round(currentVideo.video_duration || 0)}s
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute right-4 bottom-24 flex flex-col gap-4 z-10">
            <Button
              size="icon"
              onClick={() => handleLike(currentVideo.id)}
              className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:scale-110 transition-all"
            >
              <Heart
                className={`h-6 w-6 ${likedVideos.has(currentVideo.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
              />
            </Button>

            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:scale-110 transition-all"
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </Button>

            <Button
              size="icon"
              onClick={() => handleSave(currentVideo.id)}
              className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:scale-110 transition-all"
            >
              <Bookmark
                className={`h-6 w-6 ${savedVideos.has(currentVideo.id) ? 'fill-yellow-500 text-yellow-500' : 'text-white'}`}
              />
            </Button>

            <Button
              size="icon"
              onClick={() => handleShare(currentVideo)}
              className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:scale-110 transition-all"
            >
              <Share2 className="h-6 w-6 text-white" />
            </Button>

            <Button
              size="icon"
              onClick={() => handleConnect(currentVideo)}
              className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:scale-110 transition-all"
            >
              <UserPlus className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        <Button
          size="icon"
          onClick={() => goToVideo(currentVideoIndex - 1)}
          disabled={currentVideoIndex === 0}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 disabled:opacity-30"
        >
          <ChevronUp className="h-6 w-6 text-white" />
        </Button>

        <Button
          size="icon"
          onClick={togglePlayPause}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60"
        >
          {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
        </Button>

        <Button
          size="icon"
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60"
        >
          {isMuted ? <VolumeX className="h-6 w-6 text-white" /> : <Volume2 className="h-6 w-6 text-white" />}
        </Button>

        <Button
          size="icon"
          onClick={() => goToVideo(currentVideoIndex + 1)}
          disabled={currentVideoIndex === allVideos.length - 1}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 disabled:opacity-30"
        >
          <ChevronDown className="h-6 w-6 text-white" />
        </Button>
      </div>
    <OpenChatModal open={openChat} onOpenChange={setOpenChat} conversation={openConversation} />
    </div>
  );
};

export default AllVideosPage;

// Video Card Component for grid layout
function VideoCard({ video, videoRefs, isMuted, onClick, onLike, onSave, onShare, onConnect, liked, saved }) {
  const [isHovered, setIsHovered] = useState(false);
  const [posterUrl, setPosterUrl] = useState(
    video.thumbnail_url || video.thumbnailUrl || video.poster || null
  );

  // Generate thumbnail from first frame if no poster is available
  useEffect(() => {
    if (posterUrl || !video.video_url) return;

    let cancelled = false;
    const vid = document.createElement('video');
    vid.crossOrigin = 'anonymous';
    vid.src = video.video_url;
    vid.muted = true;
    vid.playsInline = true;

    const cleanup = () => {
      try { vid.pause(); } catch (e) {}
      vid.src = '';
    };

    const handleLoaded = () => {
      try {
        vid.currentTime = 0.1; // seek a little into the video to avoid black frames
      } catch (e) {
        // some browsers throw if seeking too early
      }
    };

    const handleSeeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = vid.videoWidth || 320;
        canvas.height = vid.videoHeight || 180;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        if (!cancelled) setPosterUrl(dataUrl);
      } catch (err) {
        // CORS or other errors - ignore and leave poster null
        console.warn('Thumbnail capture failed', err);
      } finally {
        cleanup();
      }
    };

    vid.addEventListener('loadeddata', handleLoaded);
    vid.addEventListener('seeked', handleSeeked);
    // load metadata then seek
    vid.load();

    // fallback timeout to cleanup
    const to = setTimeout(() => {
      cleanup();
    }, 5000);

    return () => {
      cancelled = true;
      clearTimeout(to);
      vid.removeEventListener('loadeddata', handleLoaded);
      vid.removeEventListener('seeked', handleSeeked);
      cleanup();
    };
  }, [posterUrl, video.video_url]);

  useEffect(() => {
    const videoEl = videoRefs.current[video.id];
    if (isHovered) {
      if (videoEl) {
        try {
          videoEl.currentTime = 0;
          videoEl.muted = isMuted;
          videoEl.play().catch(() => {});
        } catch (e) {}
      }
    } else {
      if (videoEl && !videoEl.paused) {
        try { videoEl.pause(); videoEl.currentTime = 0; } catch (e) {}
      }
    }
  }, [isHovered, video.id, isMuted, videoRefs]);

  return (
    <Card
      className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Video Preview with poster */}
      <div className="relative aspect-[9/16] bg-black overflow-hidden">
        {!isHovered && posterUrl ? (
          <img
            src={posterUrl}
            alt={video.video_title || 'Video thumbnail'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <video
            ref={el => videoRefs.current[video.id] = el}
            src={video.video_url}
            poster={posterUrl || undefined}
            preload="metadata"
            muted={isMuted}
            loop
            className="w-full h-full object-cover"
          />
        )}

        {/* Hover Play Icon */}
        {!isHovered && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
        )}

        {/* Video Duration */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {Math.round(video.video_duration || 0)}s
        </div>
      </div>

      {/* Video Info */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={video.user?.profile_image || video.user?.profilePicture} />
              <AvatarFallback>{(video.user?.display_name || video.user?.displayName || 'U').charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm line-clamp-1">
                @{video.user?.display_name || video.user?.displayName || 'Unknown User'}
              </h3>
              <Badge className={`text-xs ${
                video.user?.role === 'employer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {video.user?.role || video.video_type}
              </Badge>
            </div>
          </div>
          {video.isSample && (
            <Badge className="bg-yellow-500 text-black text-xs">{i18n.t('auto_sample')}</Badge>
          )}
        </div>

        <h4 className="font-medium line-clamp-2 mb-2 text-sm">{video.video_title}</h4>
        
        {video.hashtags && (
          <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{video.hashtags}</p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {video.views_count || 0}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {video.likes_count || 0}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={`flex-1 ${liked ? 'bg-red-50 border-red-200' : ''}`}
          >
            <Heart className={`h-3 w-3 mr-1 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            {liked ? 'Liked' : 'Like'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className={`flex-1 ${saved ? 'bg-yellow-50 border-yellow-200' : ''}`}
          >
            <Bookmark className={`h-3 w-3 mr-1 ${saved ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
          >
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// VirtualSlider: 3-slot recycler (prev, current, next)
function VirtualSlider({ allVideos, currentIndex, dragDelta, isDragging, isMuted, videoRefs, setCurrentVideoIndex, handleLike, handleSave, handleShare, handleConnect, likedVideos, savedVideos }) {
  const len = allVideos.length;
  const slots = [-1, 0, 1];

  const clampIndex = (i) => Math.max(0, Math.min(len - 1, i));

  return (
    <>
      {slots.map((offset) => {
        const idx = clampIndex(currentIndex + offset);
        const v = allVideos[idx];
        if (!v) return null;
        const basePercent = offset * 100;
        const transform = `translateY(calc(${basePercent}% + ${dragDelta}px))`;
        const transition = isDragging ? 'none' : 'transform 300ms ease';

        return (
          <div key={`slot-${offset}-${v.id}`} className={`absolute inset-0 z-20`} style={{ transform, transition }}>
            <div className="w-full h-full flex items-center justify-center bg-black">
              <video
                ref={el => videoRefs.current[v.id] = el}
                src={v.video_url}
                loop
                playsInline
                controls
                autoPlay={idx === currentIndex}
                muted={isMuted}
                className="max-h-full max-w-full object-contain mx-auto"
              />

              {/* Caption / info panel */}
              <div className="absolute bottom-0 left-0 right-20 p-6 text-white z-30 drop-shadow-[2px_2px_8px_rgba(0,0,0,0.9)]">
                <div className="flex items-center mb-4">
                  <Avatar className="w-12 h-12 mr-3">
                    <AvatarImage src={v.user?.profile_image || v.user?.profilePicture} />
                    <AvatarFallback>{(v.user?.display_name || v.user?.displayName || 'U').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">@{v.user?.display_name || v.user?.displayName || 'Unknown'}</h3>
                    <Badge className={v.user?.role === 'employer' ? 'bg-green-600' : 'bg-blue-600'}>{v.user?.role || v.video_type}</Badge>
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-2">{v.video_title}</h2>
                <p className="text-lg mb-3 opacity-90">{v.hashtags}</p>

                <div className="flex gap-6 text-sm opacity-80">
                  <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{v.views_count || 0}</span>
                  <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{v.likes_count || 0}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{Math.round(v.video_duration || 0)}s</span>
                </div>

                {/* Action buttons */}
                <div className="absolute right-4 bottom-24 flex flex-col gap-4 z-40">
                  <Button size="icon" onClick={() => handleLike(v.id)} className="w-14 h-14 rounded-full bg-black/40">
                    <Heart className={`h-6 w-6 ${likedVideos.has(v.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </Button>
                  <Button size="icon" onClick={() => handleSave(v.id)} className="w-14 h-14 rounded-full bg-black/40">
                    <Bookmark className={`h-6 w-6 ${savedVideos.has(v.id) ? 'fill-yellow-500 text-yellow-500' : 'text-white'}`} />
                  </Button>
                  <Button size="icon" onClick={() => handleShare(v)} className="w-14 h-14 rounded-full bg-black/40"><Share2 className="h-6 w-6 text-white" /></Button>
                  <Button size="icon" onClick={() => handleConnect(v)} className="w-14 h-14 rounded-full bg-black/40"><UserPlus className="h-6 w-6 text-white" /></Button>
                </div>

                {/* Comments placeholder */}
                <div className="mt-6 p-3 bg-black/40 rounded-lg max-w-md">
                  <p className="text-sm text-muted-foreground">{i18n.t('auto_comments_area_placeholder')}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
