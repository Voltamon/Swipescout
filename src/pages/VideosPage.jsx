import React, { useState, useEffect, useRef } from 'react';
import { useVideoContext } from '@/contexts/VideoContext';
import { useNavigate } from 'react-router-dom';
import api, { deleteVideo } from '@/services/api';
import normalizeRole from '@/utils/normalizeRole';
import { Card, CardContent } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { useToast } from '@/hooks/use-toast';
import OpenChatModal from '@/components/Chat/OpenChatModal.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/UI/dialog.jsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/UI/alert-dialog.jsx';
import {
  Video,
  Upload,
  Loader2,
  Play,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Volume2,
  VolumeX,
  Eye,
  Edit2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { sendConnection } from '@/services/connectionService.js';
import themeColors from '@/config/theme-colors';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function VideosPage({ setVideoTab }) {
  const { videos: localVideos, retryUpload, removeVideo } = useVideoContext();
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const videoRefs = useRef({});
  
  // Debug logging for role detection
  useEffect(() => {
    console.log('[VideosPage] User:', user);
    console.log('[VideosPage] Context role:', role);
    console.log('[VideosPage] User role:', user?.role);
    console.log('[VideosPage] Role type:', typeof role);
    console.log('[VideosPage] Is Array:', Array.isArray(role));
    if (Array.isArray(role)) {
      console.log('[VideosPage] Role includes employer:', role.includes('employer'));
    }
  }, [user, role]);

  const [serverVideos, setServerVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadLimitReached, setUploadLimitReached] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [connectionMap, setConnectionMap] = useState({});
  const [openConversation, setOpenConversation] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    video_position: '',
    hashtags: '',
    privacy: 'public'
  });

  const VIDEOS_PER_PAGE = 9;

  const fetchServerVideos = async (pageNum) => {
    try {
      setLoading(true);
      console.log('[VideosPage] Fetching videos for page:', pageNum);

      // Fetch *all* videos for the logged-in user (use /videos/user/:id) so we don't filter by uploader_role
      let userFetch = Promise.resolve({ data: { videos: [], totalPages: 1 } });
      if (user && user.id) {
        userFetch = api.get(`/videos/user/${encodeURIComponent(user.id)}`, { params: { page: pageNum, limit: VIDEOS_PER_PAGE } });
      }

      const userResp = await userFetch;
      const userVideos = userResp.data?.videos || [];

      setServerVideos(userVideos);

      // Use paging info from userResp
      setTotalPages(userResp.data?.totalPages || 1);
      setUploadLimitReached(userResp.data?.uploadLimitReached || false);

    } catch (err) {
      console.error('[VideosPage] Failed to fetch videos:', err);
      console.error('[VideosPage] Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      // Don't show error toast if it's just a network issue during initialization
      if (err.response?.status && err.response.status !== 401) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load videos",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkUploadLimit = async () => {
    try {
      const response = await api.get(`/videos/upload-limit`);
      setUploadLimitReached(response.data.limitReached);
      return response.data.limitReached;
    } catch (err) {
      console.error('Failed to check upload limit:', err);
      return false;
    }
  };

  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;
    
    try {
      if (videoToDelete.isLocal) {
        removeVideo(videoToDelete.id);
        toast({
          title: "Success",
          description: "Video removed successfully",
        });
      } else {
        await deleteVideo(videoToDelete.id);
        removeVideo(videoToDelete.id);
        toast({
          title: "Success",
          description: "Video deleted successfully",
        });
        await fetchServerVideos(page);
      }
    } catch (err) {
      console.error('Failed to delete video:', err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete video",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setVideoToDelete(null);
    }
  };

  const handleRetry = async (video) => {
    try {
      if (video.status === 'failed' || video.isLocal) {
        await retryUpload(video.id);
      } else if (video.status === 'processing') {
        await api.post(`/videos/${video.id}/retry-processing`);
      }
      
      await fetchServerVideos(page);
      toast({
        title: "Success",
        description: "Retry started successfully",
      });
    } catch (error) {
      console.error('Retry failed:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Retry failed",
        variant: "destructive",
      });
    }
  };

  const handleEditVideo = (video) => {
    setVideoToEdit(video);
    setEditFormData({
      title: video.title || video.video_title || '',
      description: video.description || '',
      video_position: video.video_position || '',
      hashtags: video.hashtags || '',
      privacy: video.privacy || 'public'
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!videoToEdit) return;
    try {
      // Send both title and video_title to ensure compatibility with backend
      const payload = {
        ...editFormData,
        video_title: editFormData.title, // backend may use video_title
      };
      await api.put(`/videos/${videoToEdit.id}`, payload);
      
      // Update local state immediately so UI reflects changes
      setServerVideos(prev => prev.map(v => 
        v.id === videoToEdit.id 
          ? { ...v, ...payload, title: editFormData.title, video_title: editFormData.title }
          : v
      ));
      
      toast({
        title: "Success",
        description: "Video updated successfully",
      });
      setEditDialogOpen(false);
      setVideoToEdit(null);
    } catch (err) {
      console.error('Failed to update video:', err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update video",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchServerVideos(page);
    checkUploadLimit();

    // Prefetch connections mapping so we can display connect/pending/connected status per user
    (async () => {
      try {
        const [connRes, pendingSentRes, pendingReceivedRes] = await Promise.all([
          import('@/services/connectionService.js').then(m => m.getConnections()),
          import('@/services/connectionService.js').then(m => m.getPendingSent()),
          import('@/services/connectionService.js').then(m => m.getPendingReceived()),
        ]);
        const map = {};
        const accepted = (connRes?.data?.connections || connRes?.data || []);
        accepted.forEach(a => { map[a.id] = { status: 'accepted', id: a.id }; });
        const sent = pendingSentRes?.data?.pendingSent || [];
        sent.forEach(s => { map[s.receiver?.id || s.receiverId || s.receiver?.userId] = { status: 'pending', id: s.connectionId, isSender: true }; });
        const rec = pendingReceivedRes?.data?.pendingReceived || [];
        rec.forEach(r => { map[r.sender?.id || r.senderId] = { status: 'pending', id: r.connectionId, isSender: false }; });
        setConnectionMap(map);
      } catch (e) {
        console.warn('Failed to fetch connections map', e);
      }
    })();
  }, [page, role, user]);

  const handleUploadClick = async () => {
    const limitReached = await checkUploadLimit();
    if (limitReached) {
      toast({
        title: "Upload Limit Reached",
        description: "You have reached your daily upload limit. Please try again tomorrow.",
      });
      return;
    }
  // role is an array, check if it includes 'employer' (normalize)
  const isEmployer = role && Array.isArray(role) && role.some(r => normalizeRole(r) === 'employer');
    console.log('[VideosPage] Upload button clicked:', {
      user: user,
      role: user?.role,
      isEmployer,
      targetUrl: isEmployer ? '/employer-tabs?group=companyContent&tab=video-upload' : '/jobseeker-tabs?group=profileContent&tab=video-upload'
    });
    if (isEmployer) {
      navigate('/employer-tabs?group=companyContent&tab=video-upload');
    } else {
      navigate('/jobseeker-tabs?group=profileContent&tab=video-upload');
    }
  };

  const handleVideoHover = (videoId, isHovering) => {
    if (isHovering) {
      setHoveredVideo(videoId);
      // the video element may not be mounted yet (we render poster first), so wait briefly
      setTimeout(() => {
        const videoEl = videoRefs.current[videoId];
        if (videoEl) {
          try {
            videoEl.currentTime = 0;
            videoEl.play().catch(e => console.log('Autoplay prevented:', e));
          } catch (e) {
            console.warn('Failed to play video on hover', e);
          }
        }
      }, 120);
    } else {
      const videoEl = videoRefs.current[videoId];
      if (videoEl && !videoEl.paused) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
      setHoveredVideo(null);
    }
  };

  const handleVideoClick = (video) => {
    navigate(`/video-player/${video.id}`, {
      state: {
        currentVideo: video,
        allVideos: filteredVideos,
        initialPage: page,
      }
    });
  };

  // Normalize video fields so UI can rely on common keys (title, videoUrl, thumbnailUrl)
  const allVideos = [
    ...localVideos.map(v => ({ ...v, isLocal: true })),
    ...serverVideos.map(v => ({
      // preserve original server props but map common aliases
      ...v,
      isLocal: false,
      status: v.status || 'completed',
      // title aliases: title, video_title, videoTitle, name
      title: v.title || v.video_title || v.videoTitle || v.name || v.original_name || v.videoName || v.videoTitle,
      // video url aliases
      videoUrl: v.videoUrl || v.video_url || v.secure_url || v.videoUrl || v.video_url_signed || v.file_url,
      // thumbnail aliases
      thumbnailUrl: v.thumbnailUrl || v.thumbnail_url || v.thumb || v.poster || v.preview_image,
    }))
  ];

  const filteredVideos = allVideos.filter(video => {
    if (video.isLocal && video.status === 'completed') {
      return !serverVideos.some(sv => sv.id === video.id);
    }
    return true;
  });

  const getStatusBadge = (video) => {
    const formatPrivacyLabel = (v) => {
      const raw = (v.privacy || v.visibility || v.privacy_setting || v._visibilityRaw || '').toString().toLowerCase().trim();
      if (!raw) return null;
      if (raw === 'public') return 'Public';
      if (raw === 'private') return 'Private';
      // fall back to capitalized raw value
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    };

    const privacyLabel = formatPrivacyLabel(video);

    // Common badge templates
    if (video.status === 'uploading') {
      return (
        <div className="flex items-center gap-2">
          {privacyLabel && <span className="text-xs text-muted-foreground">{privacyLabel}</span>}
          <Badge className="bg-blue-100 text-blue-800">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Uploading {video.progress ?? ''}
          </Badge>
        </div>
      );
    }
    if (video.status === 'processing') {
      return (
        <div className="flex items-center gap-2">
          {privacyLabel && <span className="text-xs text-muted-foreground">{privacyLabel}</span>}
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        </div>
      );
    }
    if (video.status === 'failed') {
      return (
        <div className="flex items-center gap-2">
          {privacyLabel && <span className="text-xs text-muted-foreground">{privacyLabel}</span>}
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        </div>
      );
    }
    // Completed & other statuses
    const completedLabel = (
      <div className="flex items-center gap-2">
        {privacyLabel && <span className="text-xs text-muted-foreground">{privacyLabel}</span>}
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Ready
        </Badge>
      </div>
    );

    return completedLabel;
  };

  if (loading && serverVideos.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className={`h-12 w-12 animate-spin ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className={`${themeColors.text.gradient} text-4xl font-bold  mb-2`}>
              My Videos
            </h1>
            <p className="text-muted-foreground">
              Manage your video content
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              onClick={handleUploadClick}
              disabled={uploadLimitReached}
              className={`${themeColors.buttons.primary} text-white `}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </div>
        </div>

        {uploadLimitReached && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Upload Limit Reached</p>
              <p className="text-sm text-yellow-700">
                You have reached your daily upload limit. Please try again tomorrow.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                videoRefs={videoRefs}
                hoveredVideo={hoveredVideo}
                isMuted={isMuted}
                onHover={handleVideoHover}
                onClick={handleVideoClick}
                onDelete={(v) => {
                  setVideoToDelete(v);
                  setDeleteConfirmOpen(true);
                }}
                onRetry={handleRetry}
                onEdit={handleEditVideo}
                getStatusBadge={getStatusBadge}
                connectionMap={connectionMap}
                setConnectionMap={setConnectionMap}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2 px-4">
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first video to get started
            </p>
            <Button
              onClick={handleUploadClick}
              className={`${themeColors.buttons.primary} text-white `}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{videoToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVideo}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Video Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>
              Update video information and settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Video Preview */}
            {videoToEdit && (
              <div className="bg-black rounded-lg overflow-hidden aspect-video max-h-48 flex items-center justify-center">
                <video
                  src={videoToEdit.videoUrl?.startsWith('http') || videoToEdit.videoUrl?.startsWith('blob:') ? videoToEdit.videoUrl : `${VITE_API_BASE_URL}${videoToEdit.videoUrl}`}
                  className="max-w-full max-h-full object-contain"
                  controls
                  muted
                />
              </div>
            )}

            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Video title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px]"
                placeholder="Video description"
              />
            </div>

            {/* Video Position */}
            <div>
              <label className="text-sm font-medium mb-1 block">Video Position</label>
              <select
                value={editFormData.video_position}
                onChange={(e) => setEditFormData(prev => ({ ...prev, video_position: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">None</option>
                <option value="main">Main</option>
                <option value="secondary">Secondary</option>
                <option value="portfolio">Portfolio</option>
              </select>
            </div>

            {/* Hashtags */}
            <div>
              <label className="text-sm font-medium mb-1 block">Hashtags</label>
              <input
                type="text"
                value={editFormData.hashtags}
                onChange={(e) => setEditFormData(prev => ({ ...prev, hashtags: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="#tag1 #tag2 #tag3"
              />
            </div>

            {/* Privacy */}
            <div>
              <label className="text-sm font-medium mb-1 block">Privacy</label>
              <select
                value={editFormData.privacy}
                onChange={(e) => setEditFormData(prev => ({ ...prev, privacy: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-cyan-600 hover:bg-cyan-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OpenChatModal open={openChat} onOpenChange={setOpenChat} conversation={openConversation} />
    </div>
  );
}

// Video Card Component
function VideoCard({ video, videoRefs, hoveredVideo, isMuted, onHover, onClick, onDelete, onRetry, onEdit, getStatusBadge, connectionMap, setConnectionMap }) {
  // Use hooks inside the card so it has access to auth, navigation and toast
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isProcessing = video.status === 'uploading' || video.status === 'processing';
  const isFailed = video.status === 'failed';

  // Check if video is currently being uploaded to server (serverProcessing flag)
  const isServerProcessing = video.serverProcessing || false;

  return (
    <Card
      className={`group relative overflow-hidden hover:shadow-lg transition-all duration-200 ${
        isServerProcessing ? 'border-2 border-yellow-400 border-dashed' : 
        isProcessing ? 'border-l-4 border-l-blue-500' : 
        isFailed ? 'border-l-4 border-l-red-500' : ''
      }`}
      onMouseEnter={() => onHover(video.id, true)}
      onMouseLeave={() => onHover(video.id, false)}
    >
      {/* Video Preview */}
      <div className="relative aspect-[9/16] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden flex items-center justify-center">
        {
          // compute poster and video src safely (handle absolute or relative paths)
        }
        {(() => {
          const posterUrl = video.thumbnailUrl
            ? (video.thumbnailUrl.startsWith('http') || video.thumbnailUrl.startsWith('blob:') ? video.thumbnailUrl : `${VITE_API_BASE_URL}${video.thumbnailUrl}`)
            : null;
          const videoSrc = video.videoUrl
            ? (video.videoUrl.startsWith('http') || video.videoUrl.startsWith('blob:') ? video.videoUrl : `${VITE_API_BASE_URL}${video.videoUrl}`)
            : null;

          // If we have a poster and the card is not currently hovered, show the poster image
          if (posterUrl && hoveredVideo !== video.id && !isServerProcessing) {
            return (
              <img
                src={posterUrl}
                alt={video.title || 'Video thumbnail'}
                className="max-w-full max-h-full object-contain cursor-pointer"
                onClick={() => !isFailed && onClick(video)}
              />
            );
          }

          // Otherwise, if we have a video source, render the video element (plays on hover)
          if (videoSrc) {
            return (
              <video
                ref={el => (videoRefs.current[video.id] = el)}
                src={videoSrc}
                poster={posterUrl || undefined}
                preload="metadata"
                muted={isMuted}
                loop
                className="max-w-full max-h-full object-contain cursor-pointer"
                onClick={() => !isFailed && onClick(video)}
              />
            );
          }

          // Fallback UI when no media is available
          return (
            <div className="w-full h-full flex items-center justify-center">
              <Video className="h-16 w-16 text-gray-400" />
            </div>
          );
        })()}

        {/* Bottom uploading indicator for serverProcessing (doesn't block video) */}
        {isServerProcessing && (
          <div className="absolute bottom-0 left-0 right-0 bg-yellow-400/90 text-yellow-900 text-xs font-medium py-1.5 px-2 flex items-center gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Uploading to server...</span>
          </div>
        )}

        {/* Processing Overlay - only for actual processing status (not serverProcessing) */}
        {isProcessing && !isServerProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-2" />
              <p className="text-sm">
                {video.status === 'uploading' ? `Uploading ${video.progress}%` : 'Processing...'}
              </p>
            </div>
          </div>
        )}

        {/* Failed Overlay */}
        {isFailed && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-500" />
              <p className="text-sm">Upload Failed</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 text-white border-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onRetry(video);
                }}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Hover Play Icon */}
        {!isProcessing && !isFailed && hoveredVideo !== video.id && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Play className="h-8 w-8 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-semibold truncate" title={video.title || 'Untitled'}>
              {video.title || 'Untitled'}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 h-5 font-normal capitalize">
              {video.privacy || 'Public'}
            </Badge>
          </div>
          <div className="shrink-0">
            {getStatusBadge(video)}
          </div>
        </div>

        {video.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {video.description}
          </p>
        )}

        {/* Server processing indicator in card body */}
        {isServerProcessing && (
          <div className="mb-3 flex items-center gap-1.5 text-xs text-yellow-600">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
            <span>Processing on server</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!isProcessing && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(video);
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(video);
                }}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(video);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
          {isFailed && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onRetry(video);
              }}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Upload
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
