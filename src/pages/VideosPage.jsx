import React, { useState, useEffect, useRef } from 'react';
import { useVideoContext } from '@/contexts/VideoContext';
import { useNavigate } from 'react-router-dom';
import api, { deleteVideo } from '@/services/api';
import { Card, CardContent } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { useToast } from '@/hooks/use-toast';
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
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { sendConnection } from '@/services/connectionService.js';
import themeColors from '@/config/theme-colors';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function VideosPage({ setVideoTab }) {
  const { videos: localVideos, retryUpload, removeVideo } = useVideoContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const videoRefs = useRef({});

  const [serverVideos, setServerVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadLimitReached, setUploadLimitReached] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const VIDEOS_PER_PAGE = 9;

  const fetchServerVideos = async (pageNum) => {
    try {
      setLoading(true);
      const response = await api.get(`/videos/?page=${pageNum}&limit=${VIDEOS_PER_PAGE}`);
      setServerVideos(response.data.videos || []);
      setTotalPages(response.data.totalPages || 1);
      setUploadLimitReached(response.data.uploadLimitReached || false);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
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

  useEffect(() => {
    fetchServerVideos(page);
    checkUploadLimit();
  }, [page]);

  const handleUploadClick = async () => {
    const limitReached = await checkUploadLimit();
    if (limitReached) {
      toast({
        title: "Upload Limit Reached",
        description: "You have reached your daily upload limit. Please try again tomorrow.",
      });
      return;
    }
    navigate('/jobseeker-tabs?group=profileContent&tab=video-upload');
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
    if (video.status === 'uploading') {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Uploading {video.progress}%
        </Badge>
      );
    }
    if (video.status === 'processing') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Processing
        </Badge>
      );
    }
    if (video.status === 'failed') {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      );
    }
    if (video.status === 'completed') {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Ready
        </Badge>
      );
    }
    return null;
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
                getStatusBadge={getStatusBadge}
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
    </div>
  );
}

// Video Card Component
function VideoCard({ video, videoRefs, hoveredVideo, isMuted, onHover, onClick, onDelete, onRetry, getStatusBadge }) {
  const isProcessing = video.status === 'uploading' || video.status === 'processing';
  const isFailed = video.status === 'failed';

  return (
    <Card
      className={`group relative overflow-hidden hover:shadow-lg transition-all duration-200 ${
        isProcessing ? 'border-l-4 border-l-blue-500' : isFailed ? 'border-l-4 border-l-red-500' : ''
      }`}
      onMouseEnter={() => onHover(video.id, true)}
      onMouseLeave={() => onHover(video.id, false)}
    >
      {/* Video Preview */}
      <div className="relative aspect-[9/16] bg-black overflow-hidden">
        {
          // compute poster and video src safely (handle absolute or relative paths)
        }
        {(() => {
          const posterUrl = video.thumbnailUrl
            ? (video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${VITE_API_BASE_URL}${video.thumbnailUrl}`)
            : null;
          const videoSrc = video.videoUrl
            ? (video.videoUrl.startsWith('http') ? video.videoUrl : `${VITE_API_BASE_URL}${video.videoUrl}`)
            : null;

          // If we have a poster and the card is not currently hovered, show the poster image
          if (posterUrl && hoveredVideo !== video.id) {
            return (
              <img
                src={posterUrl}
                alt={video.title || 'Video thumbnail'}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => !isProcessing && !isFailed && onClick(video)}
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
                className="w-full h-full object-cover"
                onClick={() => !isProcessing && !isFailed && onClick(video)}
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

        {/* Processing Overlay */}
        {isProcessing && (
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
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold line-clamp-1">{video.title || 'Untitled'}</h3>
          {getStatusBadge(video)}
        </div>

        {video.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {video.description}
          </p>
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
              {/* Connect button - only show if we can infer an owner */}
              {(() => {
                const ownerId = video.userId || video.user_id || video.ownerId || (video.user && video.user.id);
                if (ownerId && ownerId !== (user && user.id)) {
                  return (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!user) {
                          toast({ description: 'Please log in to connect', variant: 'default' });
                          return navigate('/login');
                        }
                        try {
                          await sendConnection(ownerId);
                          toast({ title: 'Connection sent', description: 'Connection request sent successfully.' });
                        } catch (err) {
                          console.error('Connection failed', err);
                          toast({ title: 'Error', description: err.response?.data?.message || 'Failed to send connection', variant: 'destructive' });
                        }
                      }}
                    >
                      Connect
                    </Button>
                  );
                }
                return null;
              })()}
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
