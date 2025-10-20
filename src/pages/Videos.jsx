import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { likeVideo, unlikeVideo, shareVideo, saveVideo, unsaveVideo, addVideoComment, getVideoComments, getVideoStats } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import VideoEmptyState from '../components/UI/VideoEmptyState';

axios.defaults.withCredentials = true;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : 'http://localhost:5000/api';

const Spinner = () => (
  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
);

const icons = {
  Heart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.35-9-7.03C1.54 11.71 3 8 6 6c1.66-1 3.83-.33 4.99 1.02C12.17 5.67 14.34 5 16 6c3 2 4.46 5.71 3 7.97C19 16.65 12 21 12 21z"/></svg>
  ),
  Comment: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6h-18v11h4v3l3-3h11z"/></svg>
  ),
  Share: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.03-.47-.09-.7L15.96 7.1A3 3 0 1 0 14 4a3 3 0 0 0 2.96 3.1L8.04 9.9A3.01 3.01 0 1 0 9 12c0-.24-.04-.47-.09-.7l7.13 4.14c.53.47 1.21.77 1.97.77A3 3 0 1 0 18 16.08z"/></svg>
  ),
  Bookmark: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12v19l-6-3-6 3V2z"/></svg>
  ),
  Up: (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>),
  Down: (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>),
  Fullscreen: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm10 5h-3v2h5v-5h-2v3zM7 5h3V3H5v5h2V5zm10 0v3h2V3h-5v2h3z"/></svg>),
  VolumeUp: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>),
  VolumeOff: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>)
};

const SwipeScoutBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#1e1e2f] via-[#2b2b4f] to-[#181828]">
    <h1 className="absolute top-6 left-16 transform -translate-x-1/2 text-white/8 font-mono font-semibold tracking-widest select-none text-[1.4rem] md:text-6xl drop-shadow-lg">SwipeScout</h1>
  </div>
);

// Fallback anonymous resolver (best-effort). Tries API then generates a stable fallback.
async function resolveAnonymousUserId() {
  try {
    const r = await axios.post(`${API_BASE_URL}/auth/anonymous`);
    return r?.data?.id ?? r?.data?.userId ?? null;
  } catch (e) {
    // fall back to a reasonably stable client id
    const stored = localStorage.getItem('_ss_anon_id');
    if (stored) return stored;
    const id = `anon-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    try { localStorage.setItem('_ss_anon_id', id); } catch (e) {}
    return id;
  }
}

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
  onPrev,
  onNext,
  isMaximized,
  onToggleMaximize,
  onAddComment,
  commentList = [],
  commentsLoading = false,
  commentSubmitting = false,
  commentCount = 0,
  shouldLoad = false,
  visibleCommentsFor = null
}) => {
  const videoRef = useRef(null);
  const { t } = useTranslation();

  let hashtags = '';
  try { hashtags = Array.isArray(video.hashtags) ? video.hashtags.join(' ') : JSON.parse(video.hashtags || '[]').join(' '); } catch (e) { hashtags = ''; }

  useEffect(() => {
    if (!videoRef.current) return;
    if (!shouldLoad) { videoRef.current.pause?.(); return; }
    const v = videoRef.current;
    if (isPlaying) {
      v.muted = true;
      const p = v.play();
      if (p && p.then) p.then(() => { v.muted = !!isMuted; }).catch(() => { v.muted = true; });
    } else v.pause?.();
  }, [isPlaying, isMuted, shouldLoad]);

  const handleVideoClick = () => {
    if (isMaximized) return; // Prevent play/pause toggle when maximized
    onTogglePlay(video.id);
  };

  const handleSubmitComment = (inputElem) => {
    if (!inputElem) return;
    const text = (inputElem.value || '').trim();
    if (!text) return;
    // clear immediately for snappy UX
    inputElem.value = '';
    if (typeof inputElem.blur === 'function') inputElem.blur();
    if (onAddComment) onAddComment(video.id, text, inputElem);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center box-border mb-3 relative">
      <div className="w-full max-w-[1100px] flex gap-4 items-stretch px-3 box-border flex-col md:flex-row relative">
  <div className={`${isMaximized ? 'fixed left-4 right-4 bottom-4 top-auto w-[90%] z-[1500] bg-transparent text-white p-2 rounded-lg' : ''} w-full md:w-[340px] lg:w-[360px] shrink-0 order-2 md:order-0 flex flex-col gap-4 justify-start min-h-screen pb-6`}>
          {/* Comments Section */}
          <div className="p-4 rounded-lg max-h-[280px] md:max-h-[400px] overflow-y-auto bg-white/10 backdrop-blur-sm text-white border border-white/20">
            <div className="font-semibold mb-3 text-lg">Comments ({commentCount})</div>
            {commentsLoading ? <div className="flex justify-center py-4"><Spinner /></div> : (
              <div className="flex flex-col gap-3">{commentList.length > 0 ? commentList.map((c) => (
                <div key={c.id} className="flex gap-3 items-start p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm">
                    {(c.user?.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{c.user?.name || 'Anonymous'}</div>
                    <div className="whitespace-pre-wrap text-sm mt-1 leading-relaxed">{c.content}</div>
                    <div className="text-xs text-white/60 mt-2">{new Date(c.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              )) : (<div className="text-center text-white/70 py-8">No comments yet — be the first to comment!</div>)}</div>
            )}

            <div className="mt-4 flex gap-2">
              {commentSubmitting ? <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded bg-white/5"><Spinner /><div className="text-sm text-white/70">Submitting...</div></div> : (
                <>
                  <input 
                    aria-label="comment-input" 
                    placeholder={'Add a comment...'} 
                    className="flex-1 p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
                    id={`comment-input-${video.id}`} 
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(e.target); } }} 
                  />
                  <button 
                    onClick={() => { const input = document.getElementById(`comment-input-${video.id}`); if (!input) return; handleSubmitComment(input); }} 
                    aria-label="post-comment" 
                    className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {icons.Comment}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Video Info Section */}
          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 shadow-lg">
            {video.videoTitle && <div className="text-xl font-bold mb-3 leading-tight text-white drop-shadow-sm">{video.videoTitle}</div>}
            {hashtags && <div className="mt-2 text-blue-300 text-sm leading-relaxed font-medium">{hashtags}</div>}
            {video.views > 0 && <div className="mt-4 text-sm text-white/70 flex items-center gap-2 bg-black/10 rounded px-2 py-1 border border-white/10">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              {video.views} views
            </div>}
          </div>
        </div>

  <div className="flex-1 flex items-center order-1 justify-center px-2 md:px-6 relative">
          <div className="w-full max-w-[720px] flex items-center justify-center relative">
            <div onClick={() => onTogglePlay(video.id)} className={`relative ${isMaximized ? 'fixed inset-0 w-[96vw] max-w-none h-screen z-[1400]' : 'w-full'} bg-black flex items-center justify-center ${isMaximized ? '' : 'rounded-lg overflow-hidden'}`} style={{ height: isMaximized ? '100vh' : 'calc(100vh - 24px)' }}>
              <video ref={videoRef} src={shouldLoad ? video.videoUrl : undefined} loop playsInline preload={shouldLoad ? 'auto' : 'metadata'} poster={video.thumbnail} className={`w-full h-full ${isMaximized ? 'object-contain' : 'object-cover'}`} />
              {video.videoType === 'sample' && <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">Sample</div>}
              <button onClick={(e) => { e.stopPropagation(); onToggleMute(video.id); }} className="absolute bottom-3 left-3 text-white bg-black/40 p-2 rounded hover:bg-black/50" aria-label={isMuted ? 'Unmute' : 'Mute'}>{isMuted ? icons.VolumeOff : icons.VolumeUp}</button>
            </div>
            
            {/* Interaction Buttons positioned on the right side of video */}
            <div className={`${isMaximized ? 'fixed right-4 top-1/2 transform -translate-y-1/2 z-[1450] w-[92px]' : 'absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-[80px] md:w-[100px]'} flex justify-center`}>
          <div className="flex flex-col items-center justify-center gap-2 md:gap-4 w-auto md:w-full">
            {/* Maximize Button */}
            <button 
              onClick={() => onToggleMaximize(video.id)} 
              aria-label={isMaximized ? 'Exit fullscreen' : 'Maximize'} 
              className="p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/30 hover:scale-110 active:scale-95"
            >
              {icons.Fullscreen}
            </button>
            
            {/* Navigation Buttons */}
            <button 
              onClick={onPrev} 
              aria-label="previous" 
              className="p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 hover:scale-110 active:scale-95"
            >
              {icons.Up}
            </button>
            
            {/* Like Button */}
            <div className="text-center">
              <button 
                onClick={() => onLike(video.id)} 
                aria-label="like" 
                className={`p-3 md:p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 ${
                  video.isLiked 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse' 
                    : 'bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/30'
                }`}
              >
                {icons.Heart}
              </button>
              <div className="text-xs text-white font-bold rounded px-1 md:px-2 py-1 mt-1 md:mt-2 bg-black/20 backdrop-blur-sm border border-white/10">
                {video.likes ?? 0}
              </div>
            </div>
            
            {/* Comment Button */}
            <div className="text-center">
              <button 
                onClick={() => onCommentToggle(video.id)} 
                aria-label="comment" 
                className={`p-3 md:p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 ${
                  visibleCommentsFor === video.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 animate-pulse' 
                    : 'bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/30'
                }`}
              >
                {icons.Comment}
              </button>
              <div className="text-xs text-white font-bold rounded px-1 md:px-2 py-1 mt-1 md:mt-2 bg-black/20 backdrop-blur-sm border border-white/10">
                {commentCount}
              </div>
            </div>
            
            {/* Share Button */}
            <div className="text-center">
              <button 
                onClick={() => onShare(video.id)} 
                aria-label="share" 
                className="p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/30 hover:scale-110 active:scale-95"
              >
                {icons.Share}
              </button>
              <div className="text-xs text-white font-bold rounded px-1 md:px-2 py-1 mt-1 md:mt-2 bg-black/20 backdrop-blur-sm border border-white/10">
                {video.shares ?? 0}
              </div>
            </div>
            
            {/* Save Button */}
            <div className="text-center">
              <button 
                onClick={() => onSave(video.id)} 
                aria-label="save" 
                className={`p-3 md:p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 ${
                  video.saved 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 animate-pulse' 
                    : 'bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/30'
                }`}
              >
                {icons.Bookmark}
              </button>
              <div className="text-xs text-white font-bold rounded px-1 md:px-2 py-1 mt-1 md:mt-2 bg-black/20 backdrop-blur-sm border border-white/10">
                {video.saved ? t('common.saved', 'Saved') : t('common.save', 'Save')}
              </div>
            </div>
            
            {/* Next Button */}
            <button 
              onClick={onNext} 
              aria-label="next" 
              className="p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 hover:scale-110 active:scale-95"
            >
              {icons.Down}
            </button>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function Videos() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
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

  useEffect(() => { fetchVideos(initialVideoId); }, [initialVideoId]);

  const fetchStatsForVideos = async (ids = []) => {
    if (!ids || !ids.length) return;
    try {
      const promises = ids.map(async (id) => {
        const video = videos.find((v) => v.id === id);
        const videoType = video?.videoType || video?.video_type || video?.type || null;
        if (videoType === 'sample') return { id, stats: { likes: video?.likes || 0, comments: video?.comments || 0, shares: video?.shares || 0, isLiked: video?.isLiked || false, saved: video?.saved || false } };
        try { const response = await getVideoStats(id); return { id, stats: response?.data?.data ?? response?.data }; } catch { return { id, stats: null }; }
      });
      const results = await Promise.all(promises);
      setVideos((prev) => prev.map((v) => {
        const res = results.find((r) => r.id === v.id); if (!res || !res.stats) return v; const s = res.stats; return { ...v, likes: typeof s.likes === 'number' ? s.likes : v.likes, comments: typeof s.comments === 'number' ? s.comments : v.comments, shares: typeof s.shares === 'number' ? s.shares : v.shares, isLiked: typeof s.isLiked === 'boolean' ? s.isLiked : v.isLiked, saved: typeof s.saved === 'boolean' ? s.saved : v.saved };
      }));
    } catch (e) { console.error('Failed to fetch video stats batch', e); }
  };

  const refreshVideoStats = async (videoId) => {
    if (!videoId) return; try { const r = await getVideoStats(videoId); const s = r?.data?.data ?? r?.data; if (!s) return; setVideos((prev) => prev.map((v) => v.id !== videoId ? v : { ...v, likes: typeof s.likes === 'number' ? s.likes : v.likes, comments: typeof s.comments === 'number' ? s.comments : v.comments, shares: typeof s.shares === 'number' ? s.shares : v.shares, isLiked: typeof s.isLiked === 'boolean' ? s.isLiked : v.isLiked, saved: typeof s.isSaved === 'boolean' ? s.isSaved : v.saved })); } catch (err) { console.error('Failed to refresh stats for', videoId, err); }
  };

  async function fetchVideos(startId = null, append = false) {
    if (isFetchingMore.current) return; isFetchingMore.current = true; try {
      setLoading(!append);
      const response = await axios.get(`${API_BASE_URL}/videos/public/getVideosForHomePage`, { params: { id: startId } });
      const payload = response?.data ?? response ?? {};
      let rawList = [];
      if (Array.isArray(payload)) rawList = payload;
      else if (Array.isArray(payload.videos)) rawList = payload.videos;
      else if (Array.isArray(payload.data?.videos)) rawList = payload.data.videos;
      else if (Array.isArray(payload.data)) rawList = payload.data;
      else if (Array.isArray(payload.videos?.data)) rawList = payload.videos.data;
      else { const arrField = Object.values(payload).find((v) => Array.isArray(v)); if (Array.isArray(arrField)) rawList = arrField; }
      const normalized = rawList.map((v) => ({ ...v, likes: v?.likes ?? 0, comments: v?.comments ?? 0, shares: v?.shares ?? 0, saved: v?.saved ?? false, isLiked: v?.isLiked ?? false, id: v?.id }));
      setVideos((prev) => (append ? [...prev, ...normalized] : normalized));
      fetchStatsForVideos(normalized.map(v => v.id));
      const returnedTotal = (payload?.total ?? payload?.data?.total) ?? null;
      if (returnedTotal != null) setHasMoreVideos((prev) => returnedTotal > (append ? videos.length + normalized.length : normalized.length));
      else setHasMoreVideos(normalized.length > 0);
    } catch (err) { setError('Failed to fetch videos'); console.error(err); } finally { setLoading(false); isFetchingMore.current = false; }
  }

  const handleScroll = () => { if (!hasMoreVideos || isFetchingMore.current) return; const container = containerRef.current; if (container) { const { scrollTop, scrollHeight, clientHeight } = container; if (scrollHeight - scrollTop <= clientHeight * 1.5) { const lastVideoId = videos[videos.length - 1]?.id; fetchVideos(lastVideoId, true); } } };

  useEffect(() => { const container = containerRef.current; if (container) { container.addEventListener('scroll', handleScroll); return () => container.removeEventListener('scroll', handleScroll); } }, [videos, hasMoreVideos]);

  useEffect(() => { if (initialVideoId && videos.length > 0) { const index = videos.findIndex((v) => v.id === initialVideoId); if (index !== -1) { setCurrentVideoIndex(index); setPlayingVideoId(videos[index].id); const container = containerRef.current; const child = container?.children[index]; if (child) child.scrollIntoView({ behavior: 'smooth', block: 'start' }); } } }, [initialVideoId, videos]);

  const goToIndex = useCallback((idx) => { if (!videos.length) return; const newIndex = (idx + videos.length) % videos.length; const targetVideoId = videos[newIndex].id; setCurrentVideoIndex(newIndex); setPlayingVideoId(targetVideoId); setMaximizedVideoId((prev) => (prev ? targetVideoId : null)); const container = containerRef.current; if (container) { const child = container.children[newIndex]; if (child) child.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, [videos]);
  const goNext = useCallback(() => goToIndex(currentVideoIndex + 1), [goToIndex, currentVideoIndex]);
  const goPrev = useCallback(() => goToIndex(currentVideoIndex - 1), [goToIndex, currentVideoIndex]);

  const handleTogglePlay = (videoId) => setPlayingVideoId((prev) => (prev === videoId ? null : videoId));
  const handleToggleMute = () => setIsMuted((prev) => !prev);
  const handleToggleMaximize = (videoId) => setMaximizedVideoId((prev) => (prev === videoId ? null : videoId));

  const ensureLoggedInThen = (actionFn) => new Promise((resolve, reject) => {
    if (user && user.role !== null) { try { actionFn(); resolve(); } catch (e) { reject(e); } return; }
    const popup = window.open('/login', 'login_popup', 'width=600,height=700'); if (!popup) { toast.error(t('common.popupBlocked','Popup blocked. Please allow popups and try again.')); return reject(new Error('Popup blocked')); }
    const cleanup = () => { window.removeEventListener('message', messageListener); window.removeEventListener('storage', storageListener); clearTimeout(timeout); try { if (popup && !popup.closed) popup.close(); } catch (e) {} };
    const finalize = () => { cleanup(); setTimeout(() => { try { actionFn(); } catch (e) { console.error('Action after login failed', e); } resolve(); }, 100); };
    const messageListener = (event) => { if (event.origin !== window.location.origin) return; const data = event.data || {}; if (data.type === 'OAUTH_COMPLETE' || data.type === 'LINKEDIN_AUTH_SUCCESS' || data.type === 'google-oauth-complete') setTimeout(finalize, 200); };
    const storageListener = (event) => { if (event.key === 'accessToken' && event.newValue) setTimeout(finalize, 100); };
    const timeout = setTimeout(() => { cleanup(); toast.error(t('common.loginTimeout','Login timed out')); reject(new Error('Login timed out')); }, 5 * 60 * 1000);
    window.addEventListener('message', messageListener); window.addEventListener('storage', storageListener);
    let waitCount = 0; const interval = setInterval(() => { if (user && user.role !== null) { clearInterval(interval); finalize(); } waitCount += 1; if (waitCount > 40) clearInterval(interval); }, 100);
  });

  const handleActionWithAnonymousUser = async (actionFn, videoId, ...args) => {
    const targetVideo = videos.find((v) => v.id === videoId);
    const videoType = targetVideo?.videoType || targetVideo?.video_type || targetVideo?.type || null;
    const isUserLoggedIn = !!(user && user.role !== null);
    if (videoType !== 'sample' && !isUserLoggedIn) { await ensureLoggedInThen(() => actionFn(videoId, ...args)); return; }
    if (videoType === 'sample') {
      if (!window.__anonymousUserId) { const anonymousUserId = await resolveAnonymousUserId(); if (!anonymousUserId) { toast.error('Failed to resolve anonymous user.'); return; } window.__anonymousUserId = anonymousUserId; }
      if (user) user.id = window.__anonymousUserId;
      actionFn(videoId, ...args);
    } else { actionFn(videoId, ...args); }
  };

  const handleLike = async (videoId) => {
    await handleActionWithAnonymousUser(async (videoId) => {
      setVideos((prev) => prev.map((v) => v.id === videoId ? { ...v, isLiked: !v.isLiked, likes: v.isLiked ? v.likes - 1 : v.likes + 1 } : v));
      try { const target = videos.find((v) => v.id === videoId); if (target && target.isLiked) { await unlikeVideo(videoId); toast.success('Removed like'); } else { await likeVideo(videoId); toast.success('You liked the video'); } refreshVideoStats(videoId); } catch (err) { setVideos((prev) => prev.map((v) => v.id === videoId ? { ...v, isLiked: !v.isLiked, likes: v.isLiked ? v.likes + 1 : v.likes - 1 } : v)); toast.error('Failed to update like'); }
    }, videoId);
  };

  const handleShare = async (videoId) => {
    await handleActionWithAnonymousUser(async (videoId) => {
      try { const response = await shareVideo(videoId); const shareableLink = response?.data?.data?.shareableLink; if (shareableLink) { const popup = window.open(`/share?link=${encodeURIComponent(shareableLink)}`, 'Share Video', 'width=600,height=700'); if (!popup) toast.error('Popup blocked. Please allow popups and try again.'); } else toast.error('Failed to generate shareable link.'); setVideos((prev) => prev.map((v) => v.id === videoId ? { ...v, shares: (v.shares || 0) + 1 } : v)); refreshVideoStats(videoId); } catch (err) { toast.error('Failed to share video'); }
    }, videoId);
  };

  const handleSave = async (videoId) => {
    await handleActionWithAnonymousUser(async (videoId) => {
      setVideos((prev) => prev.map((v) => (v.id === videoId ? { ...v, saved: !v.saved } : v)));
      try { const target = videos.find((v) => v.id === videoId); if (target && target.saved) { await unsaveVideo(videoId); toast.success('Removed from saved'); } else { await saveVideo(videoId); toast.success('Saved'); } refreshVideoStats(videoId); } catch (err) { setVideos((prev) => prev.map((v) => (v.id === videoId ? { ...v, saved: !v.saved } : v))); toast.error('Failed to save'); }
    }, videoId);
  };

  const fetchComments = useCallback(async (videoId, page = 1, limit = 20) => {
    setCommentsByVideo((prev) => ({ ...prev, [videoId]: { ...(prev[videoId] || {}), loading: true, submitting: prev?.[videoId]?.submitting || false } }));
    try { const resp = await getVideoComments(videoId, page, limit); const payload = resp?.data ?? resp; let comments = []; let total = 0; if (Array.isArray(payload)) { comments = payload; total = payload.length; } else if (payload?.comments && Array.isArray(payload.comments)) { comments = payload.comments; total = payload.total ?? comments.length; } else if (payload?.data) { const inner = payload.data; if (Array.isArray(inner)) { comments = inner; total = inner.length; } else if (inner?.comments && Array.isArray(inner.comments)) { comments = inner.comments; total = inner.total ?? comments.length; } } else if (payload?.success && payload?.comments && Array.isArray(payload.comments)) { comments = payload.comments; total = payload.total ?? comments.length; } setCommentsByVideo((prev) => ({ ...prev, [videoId]: { comments, page, total, loading: false, submitting: prev?.[videoId]?.submitting || false } })); } catch (err) { console.error('Failed to load comments', err); setCommentsByVideo((prev) => ({ ...prev, [videoId]: { ...(prev[videoId] || {}), loading: false, submitting: prev?.[videoId]?.submitting || false } })); }
  }, []);

  const handleCommentToggle = (videoId) => { setVisibleCommentsFor((prev) => { const next = prev === videoId ? null : videoId; if (next === videoId && (!commentsByVideo[videoId] || !commentsByVideo[videoId].comments)) fetchComments(videoId, 1); return next; }); };

  const handleAddComment = async (videoId, text, inputElem) => {
    await handleActionWithAnonymousUser(async (videoId, text, inputElem) => {
      setCommentsByVideo((prev) => ({ ...prev, [videoId]: { ...(prev[videoId] || {}), submitting: true } }));
      try { const response = await addVideoComment(videoId, { content: text }); const savedComment = response?.data?.comment || { id: `temp-${Date.now()}`, content: text, user: { id: user?.id, name: user?.name || 'Anonymous' }, createdAt: new Date().toISOString() }; setCommentsByVideo((prev) => { const existing = prev[videoId] || { comments: [], total: 0 }; return { ...prev, [videoId]: { ...existing, comments: [savedComment, ...existing.comments], total: existing.total + 1, submitting: false } }; }); setVideos((prev) => prev.map((v) => v.id === videoId ? { ...v, comments: (v.comments || 0) + 1 } : v)); if (inputElem) { inputElem.value = ''; inputElem.blur(); } toast.success('Comment added'); refreshVideoStats(videoId); } catch (err) { setCommentsByVideo((prev) => ({ ...prev, [videoId]: { ...(prev[videoId] || {}), submitting: false } })); toast.error('Failed to add comment'); }
    }, videoId, text, inputElem);
  };

  useEffect(() => { /* body scroll behavior intentionally no-op */ }, [maximizedVideoId]);

  useEffect(() => {
    const el = containerRef.current; if (!el) return; const wheelHandler = (e) => { e.preventDefault(); if (isScrollingRef.current) return; isScrollingRef.current = true; if (e.deltaY > 0) goNext(); else goPrev(); clearTimeout(wheelTimeoutRef.current); wheelTimeoutRef.current = setTimeout(() => { isScrollingRef.current = false; }, 600); };
    const touchStart = (e) => { touchStartYRef.current = e.touches[0].clientY; touchDeltaYRef.current = 0; };
    const touchMove = (e) => { touchDeltaYRef.current = e.touches[0].clientY - touchStartYRef.current; };
    const touchEnd = () => { const dy = touchDeltaYRef.current; const threshold = 50; if (Math.abs(dy) > threshold) { if (dy < 0) goNext(); else goPrev(); } touchDeltaYRef.current = 0; };
    el.addEventListener('wheel', wheelHandler, { passive: false }); el.addEventListener('touchstart', touchStart, { passive: true }); el.addEventListener('touchmove', touchMove, { passive: true }); el.addEventListener('touchend', touchEnd, { passive: true });
    return () => { el.removeEventListener('wheel', wheelHandler); el.removeEventListener('touchstart', touchStart); el.removeEventListener('touchmove', touchMove); el.removeEventListener('touchend', touchEnd); };
  }, [goNext, goPrev]);

  useEffect(() => { const token = user?.token || user?.accessToken || user?.access_token || null; if (token) { axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; window.__authToken = token; } else { delete axios.defaults.headers.common['Authorization']; window.__authToken = null; } }, [user]);

  useEffect(() => { if (videos.length > 0) fetchStatsForVideos(videos.map(v => v.id)); }, [user, videos.length]);

  if (loading) return (<div className="flex items-center justify-center min-h-screen"><Spinner /></div>);
  if (error) return (<div className="p-4"><div className="bg-red-600 text-white px-4 py-3 rounded">{error}</div></div>);
  if (!videos.length) return <VideoEmptyState />;

  return (
    <>
      <SwipeScoutBackground />
      <div ref={containerRef} data-main-container className="min-h-screen overflow-y-auto snap-y snap-mandatory relative z-10 bg-transparent hide-scrollbar">
        {videos.map((video, index) => {
          const commentMeta = commentsByVideo[video.id] || {};
          const resolvedCommentCount = commentMeta?.total ?? (Array.isArray(commentMeta?.comments) ? commentMeta.comments.length : undefined) ?? video.comments ?? 0;
          const distanceFromActive = Math.abs(index - currentVideoIndex);
          const isActive = playingVideoId === video.id;
          const isMax = maximizedVideoId === video.id;
          const shouldRenderCard = distanceFromActive <= 2 || isActive || isMax;
          const shouldLoadVideo = shouldRenderCard || distanceFromActive <= 1 || isMax;

          return (
            <div key={video.id} className="min-h-screen flex items-center justify-center relative z-20 snap-start">
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
                  isMaximized={isMax}
                  onToggleMaximize={handleToggleMaximize}
                  onAddComment={handleAddComment}
                  commentList={commentMeta?.comments || []}
                  commentsLoading={commentMeta?.loading || false}
                  commentSubmitting={commentMeta?.submitting || false}
                  commentCount={resolvedCommentCount}
                  shouldLoad={shouldLoadVideo}
                  visibleCommentsFor={visibleCommentsFor}
                />
              ) : (
                <div className="w-full max-w-[720px] min-h-screen flex items-center justify-center"><Spinner /></div>
              )}
            </div>
          );
        })}
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}

