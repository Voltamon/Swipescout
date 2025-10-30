import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { likeVideo, unlikeVideo, shareVideo, saveVideo, unsaveVideo, addVideoComment, getVideoComments, getVideoStats } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  ChevronUp, 
  ChevronDown, 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX,
  Send,
  Eye,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Ensure axios sends cookies by default (helps when backend uses session cookies)
axios.defaults.withCredentials = true;

// add API base constant (from Vite env or fallback)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api' || 'http://localhost:5000/api';

// Helper function to safely get array from localStorage
const getLocalStorageArray = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return [];
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn(`Failed to parse localStorage key "${key}":`, e);
    return [];
  }
};

// Helper: robustly extract numbers/booleans from different possible API field names
const _extractNumber = (obj, candidates = [], fallback = 0) => {
  for (const k of candidates) {
    if (!obj) continue;
    const val = obj[k];
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val !== '') {
      const parsed = Number(val);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return fallback;
};

const _extractBoolean = (obj, candidates = [], fallback = false) => {
  for (const k of candidates) {
    if (!obj) continue;
    const val = obj[k];
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return !!val;
    if (typeof val === 'string') {
      const lower = val.toLowerCase();
      if (lower === 'true' || lower === '1') return true;
      if (lower === 'false' || lower === '0') return false;
    }
  }
  return fallback;
};

const normalizeVideoFromApi = (v) => {
  if (!v) return v;
  const likes = _extractNumber(v, ['likes', 'likes_count', 'likesCount'], 0);
  const comments = _extractNumber(v, ['comments', 'comments_count', 'commentsCount', 'comment_count'], 0);
  const shares = _extractNumber(v, ['shares', 'shares_count', 'sharesCount'], 0);
  const savesCount = _extractNumber(v, ['savesCount', 'saves', 'saves_count'], 0);
  // saved flag may be boolean or derived from savesCount
  const saved = _extractBoolean(v, ['saved', 'is_saved', 'isSaved', 'saved_flag'], savesCount > 0);
  const isLiked = _extractBoolean(v, ['isLiked', 'is_liked', 'liked', 'is_liked_flag'], false);
  const views = _extractNumber(v, ['views', 'views_count', 'viewsCount'], v.views ?? 0);

  return {
    ...v,
    // provide both <name>Count and shorthand for compatibility
    likesCount: likes,
    likes,
    commentsCount: comments,
    comments,
    sharesCount: shares,
    shares,
    savesCount,
    saves: savesCount,
    saved,
    isLiked,
    views,
  };
};

// Patch global fetch ONCE so same-origin /api/ requests include credentials and optional Authorization header.
// This is idempotent and safe to run at module load.
if (typeof window !== 'undefined' && !window.__fetchCredentialsPatched) {
  const _fetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    try {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      const shouldAttach = url.includes('/api/') || url.startsWith('/') || url.startsWith(window.location.origin);
      if (shouldAttach) {
        init = { ...init, credentials: init.credentials || 'include' };
        const existingHeaders = init.headers instanceof Headers
          ? Object.fromEntries(init.headers.entries())
          : (init.headers || {});
        // Attach Authorization from global token if available
        const token = window.__authToken;
        init.headers = { ...existingHeaders, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      }
    } catch (e) {
      // swallow any errors — fallback to default fetch
    }
    return _fetch(input, init);
  };
  window.__fetchCredentialsPatched = true;
}

// Animated gradient background component
const SwipeScoutBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <style>{`
      @keyframes floatGradient {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        25% { transform: translate3d(5%, -3%, 0) scale(1.05); }
        50% { transform: translate3d(-5%, 3%, 0) scale(1.08); }
        75% { transform: translate3d(3%, -5%, 0) scale(1.03); }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0) scale(1); opacity: 0.05; }
        50% { transform: translateY(-20px) scale(1.05); opacity: 0.12; }
      }
    `}</style>

    {/* Main gradient background */}
    <div
      className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900"
      style={{
        animation: 'floatGradient 20s ease-in-out infinite'
      }}
    />

    {/* Overlay gradient for depth */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

    {/* Shimmer effect */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 8s linear infinite'
      }}
    />

    {/* Floating brand text */}
    <div className="absolute top-8 left-8 md:top-12 md:left-16">
      <h1
        className="text-2xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200"
        style={{
          animation: 'float 6s ease-in-out infinite',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}
      >
        <span className="text-xs md:text-base font-semibold text-white/70 tracking-wide mr-2">©</span>
        SwipeScout
      </h1>
    </div>

    {/* Decorative circles */}
    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
  </div>
);

// VideoCard component (replace existing VideoCard with this)
const VideoCard = React.memo(({
  video,
  isPlaying,
  onTogglePlay,
  onToggleMute,
  isMuted,
  onLike,
  onShare,
  onCommentToggle,
  onSave,
  showComments,
  onPrev,
  onNext,
  isMaximized,
  onToggleMaximize,
  onAddComment,
  commentList = [],
  commentsLoading = false,
  commentSubmitting = false,
  commentCount = 0,
  shouldLoad = false
}) => {
  const videoRef = useRef(null);
  const { t } = useTranslation();

  // Safely parse hashtags
  let hashtags = '';
  try {
    hashtags = Array.isArray(video.hashtags)
      ? video.hashtags.join(' ')
      : JSON.parse(video.hashtags || '[]').join(' ');
  } catch (e) {
    hashtags = ''; // Fallback to empty string if parsing fails
  }

  // width reserved for action buttons (px)
  const actionsWidth = 96; // adjust to match the actual buttons column width

  // ensure autoplay works (temporarily mute to satisfy browser autoplay policies)
  useEffect(() => {
    if (!videoRef.current) return;
    if (!shouldLoad) {
      videoRef.current?.pause?.();
      return;
    }
    const v = videoRef.current;
    if (isPlaying) {
      // Temporarily ensure muted to allow autoplay, then restore according to isMuted.
      v.muted = true;
      // call play and handle promise rejection
      const p = v.play();
      if (p && p.then) {
        p
          .then(() => {
            // restore to UI-controlled mute state after playback started
            v.muted = !!isMuted;
          })
          .catch(() => {
            // Autoplay blocked or other error — keep muted to avoid repeated rejections
            v.muted = true;
            // swallow error (already expected in some browsers)
            // console.debug('play() rejected', err);
          });
      } else {
        // older browsers: fallback
        v.muted = !!isMuted;
      }
    } else {
      videoRef.current?.pause?.();
    }
    // ...other side effects remain untouched...
  }, [isPlaying, isMuted, shouldLoad]);

  const handleVideoClick = () => {
  if (isMaximized) return; // Prevent play/pause toggle when maximized
  onTogglePlay(video.id);
};
  const handleMuteClick = (e) => { e.stopPropagation(); onToggleMute(video.id); };

  // single margin used for top & bottom spacing — preserved
  const marginSize = 12;
  const videoHeightCalc = `calc(100vh - ${marginSize * 2}px)`;
  // const videoWidthCalc = `calc(100wh - ${marginSize * 6}px)`;

  // submit helper reused by button and Enter
  const handleSubmitComment = (inputElem) => {
    if (!inputElem) return;
    if (commentSubmitting) return; // ignore while submitting
    const text = inputElem.value.trim();
    if (!text) return;
    // clear input immediately so the text "goes" as soon as user submits
    inputElem.value = '';
    if (typeof inputElem.blur === 'function') {
      inputElem.blur();
    }
    if (onAddComment) onAddComment(video.id, text, inputElem);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        marginBottom: `${marginSize}px`,
       
        position: 'relative'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1100,
          display: 'flex',
          gap: 2,
          
          alignItems: 'stretch',
          px: { xs: 2, md: 3 },
          boxSizing: 'border-box',
          flexDirection: { xs: 'column', md: 'row' },
          position: 'relative'
        }}
      >
        {/* Left: Comments + Metadata: when maximized -> overlay (bottom-left), otherwise bottom-aligned column */}
        <Box
          sx={{
            width: { xs: '100%', md: 280 },
            flexShrink: 0,
            order: { xs: 2, md: 0 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            justifyContent: 'flex-end',
            minHeight: isMaximized ? 'auto' : '100vh',
            boxSizing: 'border-box',
            pb: { xs: 2, md: 3 },

            // overlay styling when maximized - hide to prevent overlap
            ...(isMaximized && {
              display: 'none'
            })
          }}
        >
          {/* Comments panel (left) — only shown when toggled */}
          {showComments && (
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 2,
                maxHeight: { xs: 220, md: 420 },
                overflowY: 'auto',
                bgcolor: 'rgba(255,255,255,0.1)',
                color: '#fff',
              }}
            >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Comments ({commentCount})
            </Typography>
            {commentsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {commentList.length > 0 ? (
                  commentList.map((c) => (
                    <Box
                      key={c.id}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: 'grey.300',
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {c.user?.name || 'Anonymous'}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {c.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(c.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    No comments yet — be the first to comment!
                  </Typography>
                )}
              </Box>
            )}

            {/* Simple comment input / submitting placeholder */}
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              {commentSubmitting ? (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, px: 2, py: '8px', borderRadius: 1, bgcolor: 'background.default' }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">Submitting...</Typography>
                </Box>
              ) : (
                <>
                  <input
                    aria-label="comment-input"
                    placeholder={'Add a comment...'}
                    style={{ 
                      flex: 1, 
                      padding: '8px 10px', 
                      borderRadius: 6, 
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      color: '#000',
                      fontSize: '14px'
                    }}
                    id={`comment-input-${video.id}`}
                    onFocus={(e) => {
                      // Check if user needs to login for non-sample videos
                      const videoType = video?.videoType || video?.video_type || video?.type || null;
                      const isUserLoggedIn = !!(user && user.role !== null);
                      
                      if (videoType !== 'sample' && !isUserLoggedIn) {
                        e.target.blur(); // Remove focus from input
                        ensureLoggedInThen(() => {
                          // After login, refocus the input
                          setTimeout(() => {
                            const input = document.getElementById(`comment-input-${video.id}`);
                            if (input) input.focus();
                          }, 100);
                        });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const input = e.target;
                        handleSubmitComment(input);
                      }
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      const input = document.getElementById(`comment-input-${video.id}`);
                      if (!input) return;
                      handleSubmitComment(input);
                    }}
                    aria-label="post-comment"
                  >
                    <Comment />
                  </IconButton>
                </>
              )}
            </Box>
          </Paper>
          )}

          {/* Video info */}
          <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.1)',
              color: '#fff',
            }}
          >
            {video.videoTitle && (
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {video.videoTitle}
              </Typography>
            )}
            {hashtags && (
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.8)' }}>
                {hashtags}
              </Typography>
            )}
            {video.views > 0 && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'rgba(255,255,255,0.6)' }}>
                {video.views} views
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Center: Video */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          order: 1, 
          justifyContent: 'center',
          // When maximized, take full screen minus button space
          ...(isMaximized && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1400,
            width: '100vw',
            height: '100vh',
          })
        }}>
          <Box sx={{ 
            width: '100%', 
            maxWidth: isMaximized ? '100%' : 720, 
            height: isMaximized ? '100vh' : 'auto',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            position: 'relative'
          }}>
            <Box
              onClick={handleVideoClick}
              sx={{
                width: isMaximized ? 'calc(100vw - 120px)' : '100%', // Reserve 120px for right buttons when maximized
                maxWidth: '100%',
                height: isMaximized ? '100vh' : 'calc(100vh - 24px)',
                bgcolor: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: isMaximized ? 'fixed' : 'relative',
                top: isMaximized ? 0 : 'auto',
                left: isMaximized ? 0 : 'auto',
                borderRadius: isMaximized ? 0 : 2,
                overflow: 'hidden',
                zIndex: isMaximized ? 1400 : 'auto',
              }}
            >
              <video
                ref={videoRef}
                src={shouldLoad ? video.videoUrl : undefined}
                loop
                playsInline
                autoPlay={isPlaying}
                muted={isMuted || !isPlaying}
                preload={shouldLoad ? 'auto' : 'metadata'}
                poster={video.thumbnail}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: isMaximized ? 'contain' : 'cover',
                  backgroundColor: 'black',
                }}
              />
              {video.videoType === 'sample' && (
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  Sample
                </Typography>
              )}

              {/* Maximize toggle button */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMaximize(video.id);
                }}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.35)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                }}
                aria-label={isMaximized ? 'Exit fullscreen' : 'Maximize'}
              >
                {isMaximized ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>

              {/* Mute toggle button */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMute(video.id);
                }}
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.35)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Right: Action buttons and stats */}
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            order: { xs: 3, md: 2 },
            position: isMaximized ? 'fixed' : 'relative',
            right: isMaximized ? { xs: 4, md: 8 } : 'auto',
            top: isMaximized ? '50%' : 'auto',
            transform: isMaximized ? 'translateY(-50%)' : 'none',
            zIndex: isMaximized ? 1450 : 1200,
            pointerEvents: 'auto',
            width: isMaximized ? { xs: '80px', md: '100px' } : { xs: '100%', md: 80 },
            bgcolor: isMaximized ? 'rgba(0,0,0,0.3)' : 'transparent',
            borderRadius: isMaximized ? 2 : 0,
            py: isMaximized ? 2 : 0,
          }}
        >
          <Stack spacing={1} alignItems="center" sx={{ justifyContent: 'center', width: '100%' }}>
            <IconButton 
              onClick={onPrev} 
              size="large" 
              aria-label="previous"
              sx={{ color: isMaximized ? '#fff' : 'inherit' }}
            >
              <KeyboardArrowUp />
            </IconButton>

            <Box sx={{ textAlign: 'center', p: 1 }}>
              <IconButton 
                color={video.isLiked ? 'error' : 'default'} 
                onClick={() => onLike(video.id)} 
                aria-label="like"
                sx={{ color: isMaximized && !video.isLiked ? '#fff' : undefined }}
              >
                <Favorite />
              </IconButton><br></br>
              <Typography variant="caption" sx={{  
  color: isMaximized ? '#fff' : '#ffffffff',
  fontWeight: 'bold',
  borderRadius: '12px',
  px: 1,
  py: .7, }}>{video.likesCount ?? 0}</Typography>
            </Box>

            <Box sx={{ textAlign: 'center', p: 1 }}>
              <IconButton 
                onClick={() => onCommentToggle(video.id)} 
                aria-label="comment"
                sx={{ color: isMaximized ? '#fff' : 'inherit' }}
              >
                <Comment />
              </IconButton><br></br>
              <Typography variant="caption" sx={{  
  color: isMaximized ? '#fff' : '#ffffffff',
  fontWeight: 'bold',
  borderRadius: '12px',
  px: 1,
  py: .7, }}>{commentCount}</Typography>
            </Box>

            <Box sx={{ textAlign: 'center', p: 1 }}>
              <IconButton 
                onClick={() => onShare(video.id)} 
                aria-label="share"
                sx={{ color: isMaximized ? '#fff' : 'inherit' }}
              >
                <Share />
              </IconButton><br></br>
              <Typography variant="caption" sx={{  
  color: isMaximized ? '#fff' : '#ffffffff',
  fontWeight: 'bold',
  borderRadius: '12px',
  px: 1,
  py: .7, }}>{video.sharesCount ?? 0}</Typography>
            </Box>

            <Box sx={{ textAlign: 'center', p: 1 }}>
              <IconButton 
                onClick={() => onSave(video.id)} 
                aria-label="save" 
                color={video.saved ? 'primary' : 'default'}
                sx={{ color: isMaximized && !video.saved ? '#fff' : undefined }}
              >
                <Bookmark />
              </IconButton>
              <Typography 
                variant="caption"
                sx={{ color: isMaximized ? '#fff' : 'inherit' }}
              >{video.saved ? t('homePage.saved', 'Saved') : t('homePage.save', 'Save')}</Typography>
            </Box>

            <IconButton 
              onClick={onNext} 
              size="large" 
              aria-label="next"
              sx={{ color: isMaximized ? '#fff' : 'inherit' }}
            >
              <KeyboardArrowDown />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
});

const Videos = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [isMuted, setIsMuted] = useState(false); // FIX: Add global mute state
  const [visibleCommentsFor, setVisibleCommentsFor] = useState(null);
  const [maximizedVideoId, setMaximizedVideoId] = useState(null);
  const [commentsByVideo, setCommentsByVideo] = useState({});
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const containerRef = useRef(null);
  const isFetchingMore = useRef(false);
  const isScrollingRef = useRef(false);
  const wheelTimeoutRef = useRef(null);
  const touchStartYRef = useRef(0);
  const touchDeltaYRef = useRef(0);
  const { id: initialVideoId } = useParams();

  useEffect(() => {
    fetchVideos(initialVideoId);
  }, [initialVideoId]);

  // Helper: fetch stats for multiple videos and merge into videos state
  const fetchStatsForVideos = async (ids = []) => {
    if (!ids || !ids.length) return;
    try {
      const promises = ids.map(async (id) => {
        const video = videos.find((v) => v.id === id);
        const videoType = video?.videoType || video?.video_type || video?.type || null;

        if (videoType === "sample") {
          // For sample videos, return mock stats or fetch from a public endpoint if available
          return {
            id,
            stats: {
              likes: video?.likes || 0,
              comments: video?.comments || 0,
              shares: video?.shares || 0,
              isLiked: video?.isLiked || false,
              saved: video?.saved || false,
            },
          };
        } else {
          // For non-sample videos, fetch stats from the API
          try {
            const response = await getVideoStats(id);
            return { id, stats: response?.data?.data ?? response?.data };
          } catch {
            return { id, stats: null };
          }
        }
      });

      const results = await Promise.all(promises);
      
      // Get localStorage state for anonymous users
      const likedVideos = getLocalStorageArray('likedVideos');
      const savedVideos = getLocalStorageArray('savedVideos');

      // Apply stats to state (normalize returned stats fields)
      setVideos((prev) =>
        prev.map((v) => {
          const res = results.find((r) => r.id === v.id);
          if (!res || !res.stats) return v;
          const s = res.stats;
          return {
            ...v,
            likes: _extractNumber(s, ['likes', 'likes_count', 'likesCount'], v.likes ?? 0),
            comments: _extractNumber(s, ['comments', 'comments_count', 'commentsCount'], v.comments ?? 0),
            shares: _extractNumber(s, ['shares', 'shares_count', 'sharesCount'], v.shares ?? 0),
            // For anonymous users, prefer localStorage state; for logged-in users, use server state
            isLiked: (!user || user.role === null)
              ? likedVideos.includes(v.id)
              : _extractBoolean(s, ['isLiked', 'is_liked', 'liked'], v.isLiked ?? false),
            saved: (!user || user.role === null)
              ? savedVideos.includes(v.id)
              : _extractBoolean(s, ['saved', 'is_saved', 'isSaved'], v.saved ?? false),
          };
        })
      );
    } catch (e) {
      console.error('Failed to fetch video stats batch', e);
    }
  };

  // Helper: refresh single video stats (use after an action)
  const refreshVideoStats = async (videoId) => {
    if (!videoId) return;
    try {
      const r = await getVideoStats(videoId);
      const s = r?.data?.data ?? r?.data;
      if (!s) return;
      
      setVideos((prev) => prev.map((v) => {
        if (v.id !== videoId) return v;
        return {
          ...v,
          likes: _extractNumber(s, ['likes', 'likes_count', 'likesCount'], v.likes ?? 0),
          likesCount: _extractNumber(s, ['likes', 'likes_count', 'likesCount'], v.likesCount ?? 0),
          comments: _extractNumber(s, ['comments', 'comments_count', 'commentsCount'], v.comments ?? 0),
          commentsCount: _extractNumber(s, ['comments', 'comments_count', 'commentsCount'], v.commentsCount ?? 0),
          shares: _extractNumber(s, ['shares', 'shares_count', 'sharesCount'], v.shares ?? 0),
          sharesCount: _extractNumber(s, ['shares', 'shares_count', 'sharesCount'], v.sharesCount ?? 0),
          // Always use server state for logged-in users
          isLiked: _extractBoolean(s, ['isLiked', 'is_liked', 'liked'], v.isLiked ?? false),
          saved: _extractBoolean(s, ['saved', 'is_saved', 'isSaved', 'isSavedFlag'], v.saved ?? false)
        };
      }));
    } catch (err) {
      console.error('Failed to refresh stats for', videoId, err);
    }
  };

  const fetchVideos = async (startId = null, append = false) => {
    if (isFetchingMore.current) return;
    isFetchingMore.current = true;

    try {
      setLoading(!append);
      console.log('Fetching videos with startId:', startId);
      // Use public endpoint alias to avoid "No token provided" when unauthenticated.
      // Be tolerant to multiple response shapes (array, { videos: [...] }, { data: { videos: [...] } }, etc.)
      const response = await axios.get(`${API_BASE_URL}/videos/public/getVideosForHomePage`, { params: { id: startId } });
      console.log('Videos response:', response);
      const payload = response?.data ?? response ?? {};

      let rawList = [];
      if (Array.isArray(payload)) {
        rawList = payload;
      } else if (Array.isArray(payload.videos)) {
        rawList = payload.videos;
      } else if (Array.isArray(payload.data?.videos)) {
        rawList = payload.data.videos;
      } else if (Array.isArray(payload.data)) {
        rawList = payload.data;
      } else if (Array.isArray(payload.videos?.data)) {
        rawList = payload.videos.data;
      } else {
        // last-resort: try to find any array field
        const arrField = Object.values(payload).find((v) => Array.isArray(v));
        if (Array.isArray(arrField)) rawList = arrField;
      }

      const normalized = rawList.map((v) => {
        const n = normalizeVideoFromApi(v);
        return {
          ...n,
          id: n?.id ?? v?.id,
        };
      });

      // Restore anonymous user interaction state from localStorage
      const likedVideos = getLocalStorageArray('likedVideos');
      const savedVideos = getLocalStorageArray('savedVideos');
      
      const restoredVideos = normalized.map(v => ({
        ...v,
        isLiked: likedVideos.includes(v.id) || v.isLiked || false,
        saved: savedVideos.includes(v.id) || v.saved || false,
      }));

      setVideos((prev) => {
        const next = append ? [...prev, ...restoredVideos] : restoredVideos;
        // If nothing is playing yet, start autoplay on the first video
        if (!playingVideoId && next.length > 0) {
          setPlayingVideoId(next[0].id);
          setCurrentVideoIndex(0);
        }
        return next;
      });
       // Merge authoritative stats for those videos (best-effort)
       fetchStatsForVideos(normalized.map(v => v.id));
      // Use returned total if provided, otherwise base on received page length
      const returnedTotal = (payload?.total ?? payload?.data?.total) ?? null;
      if (returnedTotal != null) {
        setHasMoreVideos((prev) => {
          // if total > current length then more exists
          return returnedTotal > (append ? videos.length + normalized.length : normalized.length);
        });
      } else {
        setHasMoreVideos(normalized.length > 0);
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to fetch videos";
      setError(errorMsg);
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
      isFetchingMore.current = false;
    }
  };

  const handleScroll = () => {
    if (!hasMoreVideos || isFetchingMore.current) return;

    const container = containerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        // Fetch more videos when near the bottom
        const lastVideoId = videos[videos.length - 1]?.id;
        fetchVideos(lastVideoId, true);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [videos, hasMoreVideos]);

  useEffect(() => {
    if (initialVideoId && videos.length > 0) {
      const index = videos.findIndex((v) => v.id === initialVideoId);
      if (index !== -1) {
        setCurrentVideoIndex(index);
        setPlayingVideoId(videos[index].id);
        setMutedVideoId(videos[index].id);
        const container = containerRef.current;
        const child = container?.children[index];
        if (child) child.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [initialVideoId, videos]);

  // Navigation helpers
  const goToIndex = useCallback((idx) => {
    if (!videos.length) return;
    const newIndex = (idx + videos.length) % videos.length;
    const targetVideoId = videos[newIndex].id;
    setCurrentVideoIndex(newIndex);
    setPlayingVideoId(targetVideoId);
    setMaximizedVideoId((prev) => (prev ? targetVideoId : null));
    // scroll the container to the target child to keep in view
    const container = containerRef.current;
    if (container) {
      const child = container.children[newIndex];
      if (child) {
        child.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [videos]);

  const goNext = useCallback(() => goToIndex(currentVideoIndex + 1), [goToIndex, currentVideoIndex]);
  const goPrev = useCallback(() => goToIndex(currentVideoIndex - 1), [goToIndex, currentVideoIndex]);

  const handleTogglePlay = (videoId) => {
    setPlayingVideoId((prev) => (prev === videoId ? null : videoId));
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev); // Toggle global mute state
  };

  const handleActionWithAnonymousUser = async (actionFn, videoId, ...args) => {
    const targetVideo = videos.find((v) => v.id === videoId);
    const videoType = targetVideo?.videoType || targetVideo?.video_type || targetVideo?.type || null;
    const isUserLoggedIn = !!(user && user.role !== null);

    // If this is a non-sample video and the user is not logged in, require login first.
    if (videoType !== 'sample' && !isUserLoggedIn) {
      await ensureLoggedInThen(() => actionFn(videoId, ...args));
      return;
    }

    // For sample videos, the backend will accept unauthenticated requests and map them to a canonical
    // anonymous user. To support optimistic UI we create a lightweight client-side placeholder id
    // (if one doesn't already exist) and call the action directly. The server will still record the
    // real anonymous user and return canonical IDs when it responds.
    if (videoType === 'sample' && !window.__anonymousUserId) {
      window.__anonymousUserId = `anon-temp-${Date.now()}`;
    }

    try {
      await actionFn(videoId, ...args);
    } catch (err) {
      // If the server still rejects with 401, fall back to login flow.
      if (err?.response?.status === 401) {
        await ensureLoggedInThen(() => actionFn(videoId, ...args));
      } else {
        // Re-throw for higher-level handlers to catch (UI will show toast where appropriate)
        throw err;
      }
    }
  };

  const handleLike = async (videoId) => {
    await handleActionWithAnonymousUser(async (videoId) => {
      const target = videos.find((v) => v.id === videoId);
      const wasLiked = target?.isLiked || false;
      
      // Optimistic update
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? { 
                ...v, 
                isLiked: !wasLiked, 
                likes: wasLiked ? Math.max(0, (v.likes || 0) - 1) : (v.likes || 0) + 1,
                likesCount: wasLiked ? Math.max(0, (v.likesCount || 0) - 1) : (v.likesCount || 0) + 1
              }
            : v
        )
      );

      try {
        if (wasLiked) {
          await unlikeVideo(videoId);
          // Track anonymous unlike in localStorage
          if (!user || user.role === null) {
            const likedVideos = getLocalStorageArray('likedVideos');
            localStorage.setItem('likedVideos', JSON.stringify(likedVideos.filter(id => id !== videoId)));
          }
          toast.success("Removed like");
        } else {
          await likeVideo(videoId);
          // Track anonymous like in localStorage
          if (!user || user.role === null) {
            const likedVideos = getLocalStorageArray('likedVideos');
            if (!likedVideos.includes(videoId)) {
              likedVideos.push(videoId);
              localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
            }
          }
          toast.success("You liked the video");
        }
        // Don't refresh immediately - the optimistic update is correct
        // The server will have the authoritative count on next fetch
      } catch (err) {
        // Revert optimistic update on error
        setVideos((prev) =>
          prev.map((v) =>
            v.id === videoId
              ? { 
                  ...v, 
                  isLiked: wasLiked, 
                  likes: wasLiked ? (v.likes || 0) + 1 : Math.max(0, (v.likes || 0) - 1),
                  likesCount: wasLiked ? (v.likesCount || 0) + 1 : Math.max(0, (v.likesCount || 0) - 1)
                }
              : v
          )
        );
        toast.error("Failed to update like");
        console.error("Like error:", err);
      }
    }, videoId);
  };

  const handleShare = async (videoId) => {
    await handleActionWithAnonymousUser(async (videoId) => {
      try {
        const response = await shareVideo(videoId);
        const shareableLink = response?.data?.data?.shareableLink;

        if (shareableLink) {
          const popup = window.open(
            `/share?link=${encodeURIComponent(shareableLink)}`,
            "Share Video",
            "width=600,height=700"
          );
          if (!popup) {
            toast.error("Popup blocked. Please allow popups and try again.");
          }
        } else {
          toast.error("Failed to generate shareable link.");
        }

        // Optimistically increment the share count
        setVideos((prev) =>
          prev.map((v) =>
            v.id === videoId ? { 
              ...v, 
              shares: (v.shares || 0) + 1,
              sharesCount: (v.sharesCount || 0) + 1
            } : v
          )
        );
        
        // Track anonymous share in localStorage
        if (!user || user.role === null) {
          const sharedVideos = getLocalStorageArray('sharedVideos');
          if (!sharedVideos.includes(videoId)) {
            sharedVideos.push(videoId);
            localStorage.setItem('sharedVideos', JSON.stringify(sharedVideos));
          }
        }

        // Don't refresh immediately - the optimistic update is correct
      } catch (err) {
        toast.error("Failed to share video");
        console.error("Share error:", err);
      }
    }, videoId);
  };

  const handleSave = async (videoId) => {
    await handleActionWithAnonymousUser(async (videoId) => {
      const target = videos.find((v) => v.id === videoId);
      const wasSaved = target?.saved || false;
      
      // Optimistic toggle
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, saved: !wasSaved } : v))
      );

      try {
        if (wasSaved) {
          await unsaveVideo(videoId);
          // Track anonymous unsave in localStorage
          if (!user || user.role === null) {
            const savedVideos = getLocalStorageArray('savedVideos');
            localStorage.setItem('savedVideos', JSON.stringify(savedVideos.filter(id => id !== videoId)));
          }
          toast.success("Removed from saved");
        } else {
          await saveVideo(videoId);
          // Track anonymous save in localStorage
          if (!user || user.role === null) {
            const savedVideos = getLocalStorageArray('savedVideos');
            if (!savedVideos.includes(videoId)) {
              savedVideos.push(videoId);
              localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
            }
          }
          toast.success("Saved");
        }
        // Don't refresh immediately - the optimistic update is correct
      } catch (err) {
        // Revert optimistic toggle on error
        setVideos((prev) =>
          prev.map((v) => (v.id === videoId ? { ...v, saved: wasSaved } : v))
        );
        toast.error("Failed to save");
        console.error("Save error:", err);
      }
    }, videoId);
  };

  const fetchComments = useCallback(async (videoId, page = 1, limit = 20) => {
    setCommentsByVideo((prev) => ({ ...prev, [videoId]: { ...(prev[videoId] || {}), loading: true, submitting: prev?.[videoId]?.submitting || false } }));
    try {
      const resp = await getVideoComments(videoId, page, limit);
      const payload = resp?.data ?? resp;

      let comments = [];
      let total = 0;

      if (Array.isArray(payload)) {
        comments = payload;
        total = payload.length;
      } else if (payload?.comments && Array.isArray(payload.comments)) {
        comments = payload.comments;
        total = payload.total ?? comments.length;
      } else if (payload?.data) {
        const inner = payload.data;
        if (Array.isArray(inner)) {
          comments = inner;
          total = inner.length;
        } else if (inner?.comments && Array.isArray(inner.comments)) {
          comments = inner.comments;
          total = inner.total ?? comments.length;
        }
      } else if (payload?.success && payload?.comments && Array.isArray(payload.comments)) {
        comments = payload.comments;
        total = payload.total ?? comments.length;
      }

      setCommentsByVideo((prev) => ({
        ...prev,
        [videoId]: {
          comments,
          page,
          total,
          loading: false,
          submitting: prev?.[videoId]?.submitting || false
        }
      }));
    } catch (err) {
      console.error('Failed to load comments', err);
      setCommentsByVideo((prev) => ({ ...prev, [videoId]: { ...(prev[videoId] || {}), loading: false, submitting: prev?.[videoId]?.submitting || false } }));
    }
  }, []);

  const handleCommentToggle = (videoId) => {
    setVisibleCommentsFor((prev) => {
      const next = prev === videoId ? null : videoId;
      // if opening and not loaded, fetch first page
      if (next === videoId && (!commentsByVideo[videoId] || !commentsByVideo[videoId].comments)) {
        fetchComments(videoId, 1);
      }
      return next;
    });
  };

  const handleAddComment = async (videoId, text, inputElem) => {
    await handleActionWithAnonymousUser(async (videoId, text, inputElem) => {
      setCommentsByVideo((prev) => ({
        ...prev,
        [videoId]: { ...(prev[videoId] || {}), submitting: true },
      }));

      try {
        const response = await addVideoComment(videoId, { content: text });
        const savedComment = response?.data?.comment || {
          id: `temp-${Date.now()}`,
          content: text,
          user: { id: user.id, name: user.name || "Anonymous" },
          createdAt: new Date().toISOString(),
        };

        setCommentsByVideo((prev) => {
          const existing = prev[videoId] || { comments: [], total: 0 };
          return {
            ...prev,
            [videoId]: {
              ...existing,
              comments: [savedComment, ...existing.comments],
              total: existing.total + 1,
              submitting: false,
            },
          };
        });

        setVideos((prev) =>
          prev.map((v) =>
            v.id === videoId ? { ...v, comments: (v.comments || 0) + 1 } : v
          )
        );

        if (inputElem) {
          inputElem.value = "";
          inputElem.blur();
        }

        toast.success("Comment added");
        // Don't refresh immediately - the optimistic update is correct
      } catch (err) {
        setCommentsByVideo((prev) => ({
          ...prev,
          [videoId]: { ...(prev[videoId] || {}), submitting: false },
        }));
        toast.error("Failed to add comment");
      }
    }, videoId, text, inputElem);
  };

  // Open a login popup and wait for authentication to complete via AuthContext postMessage or storage event.
  const ensureLoggedInThen = (actionFn) => {
    return new Promise((resolve, reject) => {
      // If user became available in the meantime, run immediately
      if (user && user.role !== null) {
        try { actionFn(); resolve(); } catch (e) { reject(e); }
        return;
      }

      const popup = window.open('/login', 'login_popup', 'width=600,height=700');
      if (!popup) {
        toast.error(t('common.popupBlocked','Popup blocked. Please allow popups and try again.'));
        return reject(new Error('Popup blocked'));
      }

      const cleanup = () => {
        window.removeEventListener('message', messageListener);
        window.removeEventListener('storage', storageListener);
        clearTimeout(timeout);
        try { if (popup && !popup.closed) popup.close(); } catch (e) {}
      };

      const finalize = () => {
        cleanup();
        // Wait longer for AuthContext to update user before running actionFn
        setTimeout(() => {
          try { 
            // Just run the action - the user context will be updated
            actionFn(); 
          } catch (e) { 
            console.error('Action after login failed', e); 
          }
          resolve();
        }, 500); // Increased delay to ensure user context is updated
      };

      const messageListener = (event) => {
        if (event.origin !== window.location.origin) return;
        const data = event.data || {};
        if (data.type === 'OAUTH_COMPLETE' || data.type === 'LINKEDIN_AUTH_SUCCESS' || data.type === 'google-oauth-complete') {
          setTimeout(finalize, 300);
        }
      };

      const storageListener = (event) => {
        if (event.key === 'accessToken' && event.newValue) {
          setTimeout(finalize, 200);
        }
      };

      // Fallback timeout: close listeners after 5 minutes
      const timeout = setTimeout(() => {
        cleanup();
        toast.error(t('common.loginTimeout','Login timed out'));
        reject(new Error('Login timed out'));
      }, 5 * 60 * 1000);

      window.addEventListener('message', messageListener);
      window.addEventListener('storage', storageListener);

      // Also observe AuthContext user change by polling briefly (non-intensive)
      let waitCount = 0;
      const interval = setInterval(() => {
        if (user && user.role !== null) {
          clearInterval(interval);
          finalize();
        }
        waitCount += 1;
        if (waitCount > 40) { // stop after ~4s
          clearInterval(interval);
        }
      }, 100);
    });
  };

  // toggle maximize state
  const handleToggleMaximize = useCallback((videoId) => {
    setMaximizedVideoId((prev) => (prev === videoId ? null : videoId));
  }, []);

  // lock body scroll when a video is maximized
  // NOTE: Previously body scrolling was disabled when a video was maximized (overflow: hidden).
  // Requirement: allow normal page scrolling while maximized, so we intentionally DO NOT
  // lock body scroll anymore. This effect kept for future hook / documentation.
  useEffect(() => {
    // no-op on maximize now to keep scrolling enabled
  }, [maximizedVideoId]);

  

  // ---- Wheel & touch listeners: set passive:false and preventDefault so any wheel triggers navigation ----
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wheelHandler = (e) => {
      e.preventDefault();
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;
      if (e.deltaY > 0) goNext(); else goPrev();
      clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = setTimeout(() => { isScrollingRef.current = false; }, 600);
    };

    const touchStart = (e) => { touchStartYRef.current = e.touches[0].clientY; touchDeltaYRef.current = 0; };
    const touchMove = (e) => { touchDeltaYRef.current = e.touches[0].clientY - touchStartYRef.current; };
    const touchEnd = () => {
      const dy = touchDeltaYRef.current;
      const threshold = 50;
      if (Math.abs(dy) > threshold) {
        if (dy < 0) goNext();
        else goPrev();
      }
      touchDeltaYRef.current = 0;
    };

    
  el.addEventListener('wheel', wheelHandler, { passive: false });
    el.addEventListener('touchstart', touchStart, { passive: true });
    el.addEventListener('touchmove', touchMove, { passive: true });
    el.addEventListener('touchend', touchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', wheelHandler);
      el.removeEventListener('touchstart', touchStart);
      el.removeEventListener('touchmove', touchMove);
      el.removeEventListener('touchend', touchEnd);
    };
  }, [goNext, goPrev]);

  // Keep axios Authorization header and global fetch token in sync with AuthContext user token
  useEffect(() => {
    const token = user?.token || user?.accessToken || user?.access_token || null;
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      window.__authToken = token;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      window.__authToken = null;
    }
    // no cleanup required — we explicitly delete header when user becomes null
  }, [user]);

  // Refetch stats when user changes (login/logout) to get user-specific flags
  useEffect(() => {
    if (videos.length > 0) {
      // Refresh stats for currently visible videos
      const visibleRange = 2; // Videos before and after current
      const startIdx = Math.max(0, currentVideoIndex - visibleRange);
      const endIdx = Math.min(videos.length, currentVideoIndex + visibleRange + 1);
      const visibleVideos = videos.slice(startIdx, endIdx);
      
      visibleVideos.forEach(v => {
        refreshVideoStats(v.id).catch(() => {});
      });
    }
  }, [user?.id, user?.userId]); // Only trigger when user ID changes (login/logout)

  // Refetch stats when user changes (login/logout)
  useEffect(() => {
    if (videos.length > 0) {
      fetchStatsForVideos(videos.map(v => v.id));
    }
  }, [user, videos.length]);

  // Proactively fetch comment counts for videos that are active or near the viewport
  useEffect(() => {
    if (!videos || !videos.length) return;
    const idsToFetch = [];
    videos.forEach((v, idx) => {
      const distance = Math.abs(idx - currentVideoIndex);
      const shouldFetch = distance <= 1 || v.id === playingVideoId || maximizedVideoId === v.id;
      if (shouldFetch) {
        const meta = commentsByVideo[v.id];
        if (!meta || (!meta.loading && (meta.comments == null || meta.total == null))) {
          idsToFetch.push(v.id);
        }
      }
    });

    if (!idsToFetch.length) return;
    // Fire-and-forget small requests (limit=1) to populate totals; swallow errors
    idsToFetch.forEach((id) => {
      // fetch only first page with limit=1 to get total without pulling all comments
      fetchComments(id, 1, 1).catch(() => {});
    });
  }, [videos, currentVideoIndex, playingVideoId, commentsByVideo, maximizedVideoId, fetchComments]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>Oops!</Typography>
          <Typography variant="body1">{error}</Typography>
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please try refreshing the page or contact support if the problem persists.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchVideos(initialVideoId);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#1976d2',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 20px',
              borderRadius: 6,
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: '#000',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            Go Home
          </button>
        </Box>
      </Box>
    );
  }

  if (!videos.length) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h5">{t('homePage.noVideosAvailable', 'No videos available.')}</Typography>
        <Typography variant="body1">{t('homePage.uploadPrompt', 'Start by uploading some videos!')}</Typography>
      </Box>
    );
  }

  return (
    <>
      <SwipeScoutBackground />
      <Box
        ref={containerRef}
        data-main-container
        sx={{
          minHeight: '100vh',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          position: 'relative',
          zIndex: 1,
          background: 'transparent',
          '& > div': { scrollSnapAlign: 'start' },
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {videos.map((video, index) => {
          const commentMeta = commentsByVideo[video.id] || {};
          const resolvedCommentCount = commentMeta?.total ?? (Array.isArray(commentMeta?.comments) ? commentMeta.comments.length : undefined) ?? video.comments ?? 0;
          const distanceFromActive = Math.abs(index - currentVideoIndex);
          const isActive = playingVideoId === video.id;
          const isMaximized = maximizedVideoId === video.id;
          const shouldRenderCard = distanceFromActive <= 2 || isActive || isMaximized;
          const shouldLoadVideo = shouldRenderCard || distanceFromActive <= 1 || isMaximized;

          return (
            <Box key={video.id} sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
              {shouldRenderCard ? (
                <VideoCard
                  video={video}
                  isPlaying={isActive}
                  onTogglePlay={handleTogglePlay}
                  onToggleMute={handleToggleMute}
                  isMuted={isMuted}
                  onLike={handleLike}
                  onShare={handleShare}
                  onCommentToggle={handleCommentToggle}
                  onSave={handleSave}
                  showComments={visibleCommentsFor === video.id}
                  onPrev={goPrev}
                  onNext={goNext}
                  isMaximized={isMaximized}
                  onToggleMaximize={handleToggleMaximize}
                  onAddComment={handleAddComment}
                  commentList={commentMeta?.comments || []}
                  commentsLoading={commentMeta?.loading || false}
                  commentSubmitting={commentMeta?.submitting || false}
                  commentCount={resolvedCommentCount}
                  shouldLoad={shouldLoadVideo}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 720,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CircularProgress size={32} />
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default Videos;
 