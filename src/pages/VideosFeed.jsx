import i18n from 'i18next';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios'; // ADDED
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Paper
} from '@mui/material';
import {
  PlayArrow,
  VolumeUp,
  VolumeOff,
  Share,
  Favorite,
  Comment,
  Bookmark,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { likeVideo, unlikeVideo, shareVideo, saveVideo, unsaveVideo, addVideoComment, getVideoComments, getVideoStats } from '@/services/api'; // removed getVideosForHomePage - using public endpoint directly
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

// Ensure axios sends cookies by default (helps when backend uses session cookies)
axios.defaults.withCredentials = true;

// add API base constant (from Vite env or fallback)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api' || 'http://localhost:5000/api';

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
  commentSubmitting = false, // added prop
  commentCount = 0, // NEW: display count coming from parent
  shouldLoad = false // whether to set video.src / preload (lazy load)
}) => {
  const videoRef = useRef(null);
  const { t } = useTranslation();

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
            minHeight: '100vh',
            boxSizing: 'border-box',
            pb: { xs: 2, md: 3 },

            // overlay styling when maximized
            ...(isMaximized && {
              position: 'fixed',
              left: 16,
              right: 16,
              bottom: 16,
              top: 'auto',
              width: '90%', //to calc
              zIndex: 1500,
              bgcolor: 'transparent', //rgba(0,0,0,0.45)
              color: '#fff',
              borderRadius: 2,
              p: 2
            })
          }}
        >
          {/* Comments panel (left) — only shown when toggled */}
          <Paper
            elevation={1}
            sx={{
              p: 1,
              borderRadius: 1,
              maxHeight: { xs: 220, md: 420 },
              overflowY: 'auto',
              display: showComments ? 'block' : 'none',
              ...(isMaximized && { bgcolor: 'transparent', boxShadow: 'none', color: '#fff' })
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Comments ({commentCount ?? (video.comments ?? 0)})
            </Typography>

            {/* Real comments list */}
            {commentsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {commentList && commentList.length > 0 ? (
                  commentList.map((c) => (
                    <Box key={c.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'grey.300', flexShrink: 0 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {c.user?.name || 'Anonymous'}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{c.content}</Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleString()}</Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: isMaximized ? '#fff' : undefined }}>{i18n.t('auto_no_comments_yet_be_the_first_to_comment_1')}</Typography>
                )}
              </Box>
            )}

            {/* Simple comment input / submitting placeholder */}
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              {commentSubmitting ? (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, px: 2, py: '8px', borderRadius: 1, bgcolor: 'background.default' }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_submitting')}</Typography>
                </Box>
              ) : (
                <>
                  <input
                    aria-label={i18n.t('auto_comment_input')} 
                    placeholder={'Add a comment...'}
                    style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc' }}
                    id={`comment-input-${video.id}`}
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
                    aria-label={i18n.t('auto_post_comment')} 
                  >
                    <Comment />
                  </IconButton>
                </>
              )}
            </Box>
          </Paper>

          {/* Compact preview when comments hidden on desktop */}
          {!showComments && (
            <Paper
              elevation={0}
              onClick={() => onCommentToggle(video.id)}
              sx={{
                display: { xs: 'none', md: 'block' },
                p: 1,
                borderRadius: 1,
                bgcolor: isMaximized ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                color: isMaximized ? '#fff' : undefined,
                cursor: 'pointer',
                '&:hover': { bgcolor: isMaximized ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }
              }}
            >
              <Typography variant="subtitle2">View comments ({commentCount ?? (video.comments ?? 0)})</Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ color: isMaximized ? 'rgba(255,255,255,0.85)' : undefined }}>
                {video.top_comment || 'No comments yet — be the first to comment!'}
              </Typography>
            </Paper>
          )}

          {/* Metadata always visible and aligned toward bottom (or as overlay when maximized) */}
          <Box sx={{ mt: 0, mb: 1, color: isMaximized ? '#fff' : undefined }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              @{video.username}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {video.description}
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: isMaximized ? 'rgba(255,255,255,0.85)' : 'text.secondary' }}>
              {video.tags && video.tags.length ? `#${video.tags.join(' #')}` : ''}
            </Typography>
          </Box>
        </Box>

        {/* Center: Video */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', order: 1, justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              onClick={handleVideoClick}
              sx={{
                width: isMaximized ? '96vw' : '100%',
                maxWidth: '100%', // Allow full width
                height: isMaximized ? '100vh' : videoHeightCalc,
                bgcolor: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: isMaximized ? 'fixed' : 'relative',
                top: isMaximized ? 0 : 'auto',
                left: isMaximized ? 0 : 'auto',
                // Calculate width to account for action buttons
                right: isMaximized ? `${actionsWidth}px` : 'auto',
                bottom: isMaximized ? 0 : 'auto',
                zIndex: isMaximized ? 1400 : 'auto',
                borderRadius: isMaximized ? 0 : 2,
                overflow: 'hidden',
                margin: 0,
              }}
            >
              <video
                ref={videoRef}
                src={shouldLoad ? video.videoUrl : undefined}
                loop
                playsInline
                preload={shouldLoad ? 'auto' : 'metadata'}
                poster={video.poster || video.thumbnail}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: isMaximized ? 'contain' : 'cover',
                  backgroundColor: 'black',
                }}
              />

              {/* Play overlay */}
              {!isPlaying && (
                <IconButton
                  sx={{ position: 'absolute', color: 'white', fontSize: '3rem', opacity: 0.85 }}
                  onClick={handleVideoClick}
                >
                  <PlayArrow fontSize="inherit" />
                </IconButton>
              )}

              {/* Mute Button (bottom-left) */}
              <IconButton
                sx={{ position: 'absolute', bottom: 12, left: 12, color: 'white', opacity: 0.85 }}
                onClick={handleMuteClick}
                aria-label={i18n.t('auto_mute')} 
              >
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>

              {/* Maximize toggle top-right */}
              <IconButton
                onClick={(e) => { e.stopPropagation(); onToggleMaximize(video.id); }}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.35)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' }
                }}
                aria-label={isMaximized ? 'Exit full' : 'Maximize'}
              >
                {isMaximized ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Right: action buttons centered vertically; fixed to the right edge when maximized */}
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            order: { xs: 3, md: 2 },
            // When maximized, pin the actions to the right edge and make width equal to actionsWidth
            position: isMaximized ? 'fixed' : 'relative',
            right: isMaximized ? 0 : 'auto',
            top: isMaximized ? '50%' : 'auto',
            transform: isMaximized ? 'translateY(-50%)' : 'none',
            zIndex: isMaximized ? 1450 : 1200,
            pointerEvents: 'auto',
            width: isMaximized ? `${actionsWidth}px` : { xs: '100%', md: 80 }
          }}
        >
          <Stack spacing={1} alignItems="center" sx={{ justifyContent: 'center', width: '100%' }}>
            <IconButton onClick={onPrev} size="large" aria-label={i18n.t('auto_previous_1')}  sx={{ bgcolor: 'background.paper' }}>
              <KeyboardArrowUp />
            </IconButton>

            <IconButton color={video.isLiked ? 'error' : 'default'} onClick={() => onLike(video.id)} aria-label={i18n.t('auto_like_1')} >
              <Favorite />
            </IconButton>
            <Typography variant="caption">{video.likes ?? 0}</Typography>

            <IconButton onClick={() => onCommentToggle(video.id)} aria-label={i18n.t('auto_comment_1')} >
              <Comment />
            </IconButton>
            <Typography variant="caption">{commentCount ?? (video.comments ?? 0)}</Typography>

            <IconButton onClick={() => onShare(video.id)} aria-label={i18n.t('auto_share_1')} >
              <Share />
            </IconButton>
            <Typography variant="caption">{video.shares ?? 0}</Typography>

            <IconButton onClick={() => onSave(video.id)} aria-label={i18n.t('auto_save_2')}  color={video.saved ? 'primary' : 'default'}>
              <Bookmark />
            </IconButton>
            <Typography variant="caption">{video.saved ? t('homePage.saved','Saved') : t('homePage.save','Save')}</Typography>

            <IconButton onClick={onNext} size="large" aria-label={i18n.t('auto_next_1')}  sx={{ bgcolor: 'background.paper' }}>
              <KeyboardArrowDown />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
});

const HomePage = () => {
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
      const promises = ids.map(id =>
        getVideoStats(id)
          .then((r) => ({ id, stats: r?.data?.data ?? r?.data }))
          .catch(() => ({ id, stats: null }))
      );
      const results = await Promise.all(promises);
      // apply to state
      setVideos((prev) =>
        prev.map((v) => {
          const res = results.find((r) => r.id === v.id);
          if (!res || !res.stats) return v;
          const s = res.stats;
          return {
            ...v,
            likes: typeof s.likes === 'number' ? s.likes : v.likes,
            comments: typeof s.comments === 'number' ? s.comments : v.comments,
            shares: typeof s.shares === 'number' ? s.shares : v.shares, // Include shares
            isLiked: typeof s.isLiked === 'boolean' ? s.isLiked : v.isLiked,
            saved: typeof s.isSaved === 'boolean' ? s.isSaved : v.saved
          };
        })
      );
    } catch (e) {
      // swallow — stats are best-effort
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
          likes: typeof s.likes === 'number' ? s.likes : v.likes,
          comments: typeof s.comments === 'number' ? s.comments : v.comments,
          shares: typeof s.shares === 'number' ? s.shares : v.shares, // Include shares
          isLiked: typeof s.isLiked === 'boolean' ? s.isLiked : v.isLiked,
          saved: typeof s.isSaved === 'boolean' ? s.isSaved : v.saved
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
      // Use public endpoint alias to avoid "No token provided" when unauthenticated.
      // Be tolerant to multiple response shapes (array, { videos: [...] }, { data: { videos: [...] } }, etc.)
      const response = await axios.get(`${API_BASE_URL}/videos/public/getVideosForHomePage`, { params: { id: startId } });
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

      const normalized = rawList.map((v) => ({
        ...v,
        likes: v?.likes ?? 0,
        comments: v?.comments ?? 0,
        shares: v?.shares ?? 0,
        saved: v?.saved ?? false,
        isLiked: v?.isLiked ?? false,
        id: v?.id,
      }));

      setVideos((prev) => (append ? [...prev, ...normalized] : normalized));
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
      setError("Failed to fetch videos");
      console.error(err);
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

    if (videoType !== 'sample' && !isUserLoggedIn) {
      await ensureLoggedInThen(() => actionFn(videoId, ...args));
      return;
    }

    if (videoType === 'sample' && !window.__anonymousUserId) {
      window.__anonymousUserId = `anon-temp-${Date.now()}`;
    }

    try {
      await actionFn(videoId, ...args);
    } catch (err) {
      if (err?.response?.status === 401) {
        await ensureLoggedInThen(() => actionFn(videoId, ...args));
      } else {
        throw err;
      }
    }
  };

  const handleLike = async (videoId) => {
    await handleActionWithAnonymousUser(async (videoId) => {
      // Optimistic update
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? { ...v, isLiked: !v.isLiked, likes: v.isLiked ? v.likes - 1 : v.likes + 1 }
            : v
        )
      );

      try {
        const target = videos.find((v) => v.id === videoId);
        if (target && target.isLiked) {
          await unlikeVideo(videoId);
          toast.success("Removed like");
        } else {
          await likeVideo(videoId);
          toast.success("You liked the video");
        }
        refreshVideoStats(videoId);
      } catch (err) {
        // Revert optimistic update on error
        setVideos((prev) =>
          prev.map((v) =>
            v.id === videoId
              ? { ...v, isLiked: !v.isLiked, likes: v.isLiked ? v.likes + 1 : v.likes - 1 }
              : v
          )
        );
        toast.error("Failed to update like");
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
            v.id === videoId ? { ...v, shares: (v.shares || 0) + 1 } : v
          )
        );

        refreshVideoStats(videoId);
      } catch (err) {
        toast.error("Failed to share video");
      }
    }, videoId);
  };

  const handleSave = async (videoId) => {
    await handleActionWithAnonymousUser(async (videoId) => {
      // Optimistic toggle
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, saved: !v.saved } : v))
      );

      try {
        const target = videos.find((v) => v.id === videoId);
        if (target && target.saved) {
          await unsaveVideo(videoId);
          toast.success("Removed from saved");
        } else {
          await saveVideo(videoId);
          toast.success("Saved");
        }
        refreshVideoStats(videoId);
      } catch (err) {
        // Revert optimistic toggle on error
        setVideos((prev) =>
          prev.map((v) => (v.id === videoId ? { ...v, saved: !v.saved } : v))
        );
        toast.error("Failed to save");
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
        refreshVideoStats(videoId);
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
      if (user) {
        try { actionFn(); resolve(); } catch (e) { reject(e); }
        return;
      }

      const popup = window.open('/auth/login', 'login_popup', 'width=600,height=700');
      if (!popup) {
        toast.error(t('common.popupBlocked','Popup blocked. Please allow popups and try again.'));
        return reject(new Error('Popup blocked'));
      }

      const cleanup = () => {
        window.removeEventListener('message', messageListener);
        window.removeEventListener('storage', storageListener);
        clearTimeout(timeout);
      };

      const finalize = () => {
        cleanup();
        try { actionFn(); } catch (e) { console.error('Action after login failed', e); }
        resolve();
      };

      const messageListener = (event) => {
        if (event.origin !== window.location.origin) return;
        const data = event.data || {};
        if (data.type === 'OAUTH_COMPLETE' || data.type === 'LINKEDIN_AUTH_SUCCESS' || data.type === 'google-oauth-complete') {
          // AuthContext will handle storing tokens; wait shortly to allow it to persist
          setTimeout(finalize, 200);
        }
      };

      const storageListener = (event) => {
        if (event.key === 'accessToken' && event.newValue) {
          // accessToken was set by popup or other window
          setTimeout(finalize, 100);
        }
      };

      // Fallback timeout: close listeners after 5 minutes
      const timeout = setTimeout(() => {
        cleanup();
        try { if (popup && !popup.closed) popup.close(); } catch (e) {}
        toast.error(t('common.loginTimeout','Login timed out'));
        reject(new Error('Login timed out'));
      }, 5 * 60 * 1000);

      window.addEventListener('message', messageListener);
      window.addEventListener('storage', storageListener);

      // Also observe AuthContext user change by polling briefly (non-intensive)
      let waitCount = 0;
      const interval = setInterval(() => {
        if (user) {
          clearInterval(interval);
          finalize();
        }
        waitCount += 1;
        if (waitCount > 20) { // stop after ~2s
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
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
    <Box
      ref={containerRef}
        data-main-container // Add this

      sx={{
        minHeight: '100vh',
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
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
          <Box key={video.id} sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {shouldRenderCard ? (
              <VideoCard
                video={video}
                isPlaying={isActive}
                onTogglePlay={handleTogglePlay}
                onToggleMute={handleToggleMute}
                isMuted={isMuted} // Use global mute state
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

export default HomePage;
