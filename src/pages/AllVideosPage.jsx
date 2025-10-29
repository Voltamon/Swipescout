// AllVideosPage.jsx - TikTok Style Vertical Video Feed with Tailwind
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVideoContext } from '../contexts/VideoContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Play, Pause, VolumeX, Volume2, Share2, Heart,
  Bookmark, UserPlus, ArrowUp, ArrowDown, Home, X,
  MessageCircle, Eye, Clock, ChevronUp, ChevronDown
} from 'lucide-react';
import themeColors from '@/config/theme-colors';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAllVideos, 
  getEmployerPublicVideos, 
  getJobSeekersVideos,
  likeVideo,
  saveVideo,
  connectWithUser,
  searchVideos
} from '../services/api';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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

  // Combine real videos with sample videos
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

  // Handle video navigation
  const goToVideo = useCallback((index) => {
    if (index >= 0 && index < allVideos.length) {
      setCurrentVideoIndex(index);

      const currentVideo = videoRefs.current[allVideos[currentVideoIndex]?.id];
      if (currentVideo) {
        currentVideo.pause();
      }

      setTimeout(() => {
        const newVideo = videoRefs.current[allVideos[index]?.id];
        if (newVideo) {
          newVideo.currentTime = 0;
          newVideo.muted = isMuted;
          if (isPlaying) {
            newVideo.play().catch(e => console.log('Autoplay prevented:', e));
          }
        }
      }, 100);
    }
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

  const handleConnect = (video) => {
    if (video.isSample) {
      toast({ description: t("videos.sampleVideoMessage") });
      return;
    }
    toast({ description: t("videos.connectionRequestSent") });
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
            <Badge className="bg-yellow-500 text-black">Sample</Badge>
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
              <Avatar className="w-12 h-12 mr-3 border-2 border-white">
                <AvatarImage src={currentVideo.user?.profile_image} />
                <AvatarFallback>{currentVideo.user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">
                  @{currentVideo.user?.display_name || 'Unknown User'}
                </h3>
                <Badge className={
                  currentVideo.user?.role === 'employer' ?
                  'bg-green-600' : 'bg-blue-600'
                }>
                  {currentVideo.user?.role || currentVideo.video_type}
                </Badge>
              </div>
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
    </div>
  );
};

export default AllVideosPage;
