import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedVideos, unsaveVideo } from '@/services/api';
import { Card, CardContent } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select.jsx';
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
  Bookmark,
  BookmarkCheck,
  Play,
  Search,
  Share2,
  Trash2,
  Eye,
  Loader2,
  Filter,
  SortAsc
} from 'lucide-react';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helpers to normalize video objects returned by backend
function normalizeVideo(v) {
  return {
    id: v.id || v.videoId || v.video_id,
    // prefer friendly keys but fallback to DB column names
    title: v.title || v.videoTitle || v.video_title || 'Untitled',
    description: v.description || v.videoDescription || v.video_description || '',
    videoUrl: v.videoUrl || v.video_url || v.video_url_full || v.secure_url || '',
    thumbnail: v.thumbnail || v.thumbnailUrl || v.thumbnail_url || null,
    uploaderName: v.uploaderName || v.uploader_name || (v.user && (v.user.displayName || v.user.display_name)) || null,
    uploaderType: v.uploaderType || v.uploader_type || (v.user && v.user.role) || null,
    savedAt: v.savedAt || v.saved_at || null,
    createdAt: v.createdAt || v.submittedAt || v.submitted_at || null,
    // keep original for any additional fields
    _raw: v
  };
}

function getTitle(v) {
  return v.title || v.videoTitle || v.video_title || 'Untitled';
}

function getDescription(v) {
  return v.description || v.videoDescription || v.video_description || '';
}

function getVideoSrc(v) {
  const url = v.videoUrl || v.video_url || v._raw?.videoUrl || v._raw?.video_url || '';
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // ensure leading slash
  return `${VITE_API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function getThumbnailSrc(v) {
  const thumb = v.thumbnail || v.thumbnailUrl || v._raw?.thumbnail || v._raw?.thumbnail_url || null;
  if (!thumb) return undefined;
  if (thumb.startsWith('http://') || thumb.startsWith('https://')) return thumb;
  return `${VITE_API_BASE_URL}${thumb.startsWith('/') ? '' : '/'}${thumb}`;
}

export default function SavedVideosPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRefs = useRef({});

  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('saved_date');
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const fetchSavedVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSavedVideos();
      // normalize videos for safer frontend usage
      const videos = (response.data.videos || []).map(normalizeVideo);
      setSavedVideos(videos);
    } catch (error) {
      console.error('Failed to fetch saved videos:', error);
      toast({
        title: "Error",
        description: "Failed to load saved videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSavedVideos();
  }, [fetchSavedVideos]);

  const handleUnsaveVideo = async () => {
    if (!videoToDelete) return;

    try {
      await unsaveVideo(videoToDelete.id);
      setSavedVideos(prev => prev.filter(v => v.id !== videoToDelete.id));
      toast({
        title: "Success",
        description: "Video removed from saved collection",
      });
    } catch (error) {
      console.error('Failed to unsave video:', error);
      toast({
        title: "Error",
        description: "Failed to remove video",
        variant: "destructive",
      });
    } finally {
      setDeleteDialog(false);
      setVideoToDelete(null);
    }
  };

  const handleShareVideo = async (video) => {
    try {
      const shareUrl = `${window.location.origin}/video-player/${video.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Video link copied to clipboard",
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to share video:', error);
      }
    }
  };

  const handleVideoClick = (video) => {
    navigate(`/video-player/${video.id}`, {
      state: {
        currentVideo: video,
        allVideos: filteredVideos,
      }
    });
  };

  const handleVideoHover = (videoId, isHovering) => {
    if (isHovering) {
      setHoveredVideo(videoId);
      const videoEl = videoRefs.current[videoId];
      if (videoEl) {
        videoEl.currentTime = 0;
        videoEl.play().catch(e => console.log('Autoplay prevented:', e));
      }
    } else {
      const videoEl = videoRefs.current[videoId];
      if (videoEl && !videoEl.paused) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
      setHoveredVideo(null);
    }
  };

  // Filter and sort videos
  const filteredVideos = savedVideos
    .filter(video => {
      const matchesSearch = (getTitle(video) || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (getDescription(video) || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      if (filterType === 'jobseeker') return matchesSearch && video.uploaderType === 'jobseeker';
      if (filterType === 'employer') return matchesSearch && video.uploaderType === 'employer';
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'saved_date') return new Date(b.savedAt) - new Date(a.savedAt);
      if (sortBy === 'title') return getTitle(a).localeCompare(getTitle(b));
      if (sortBy === 'upload_date') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Saved Videos
        </h1>
        <p className="text-muted-foreground">
          Your bookmarked video collection ({savedVideos.length} videos)
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search saved videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Videos</SelectItem>
            <SelectItem value="jobseeker">Job Seekers</SelectItem>
            <SelectItem value="employer">Employers</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="saved_date">Recently Saved</SelectItem>
            <SelectItem value="upload_date">Recently Uploaded</SelectItem>
            <SelectItem value="title">Title (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 border-l-cyan-500"
              onMouseEnter={() => handleVideoHover(video.id, true)}
              onMouseLeave={() => handleVideoHover(video.id, false)}
            >
              {/* Video Preview */}
              <div className="relative aspect-[9/16] bg-black overflow-hidden">
                <video
                  ref={el => videoRefs.current[video.id] = el}
                  src={getVideoSrc(video)}
                  poster={getThumbnailSrc(video)}
                  muted
                  loop
                  className="w-full h-full object-cover"
                  onClick={() => handleVideoClick(video)}
                />

                {/* Saved Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-cyan-100 text-cyan-800">
                    <BookmarkCheck className="h-3 w-3 mr-1" />
                    Saved
                  </Badge>
                </div>

                {/* Hover Play Icon */}
                {hoveredVideo !== video.id && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1 mb-1">{getTitle(video)}</h3>
                
                {video.uploaderName && (
                  <p className="text-sm text-muted-foreground mb-2">
                    by {video.uploaderName}
                  </p>
                )}

                {(getDescription(video)) && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {getDescription(video)}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleVideoClick(video)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareVideo(video)}
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setVideoToDelete(video);
                      setDeleteDialog(true);
                    }}
                  >
                    <Bookmark className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No matching videos' : 'No saved videos yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : 'Start saving videos to build your collection'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/jobseeker-tabs?group=discovery&tab=all-videos')}>
                Discover Videos
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Unsave Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Saved</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{videoToDelete ? getTitle(videoToDelete) : ''}" from your saved collection?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnsaveVideo}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
