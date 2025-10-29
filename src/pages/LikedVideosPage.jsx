import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserLikedVideos, 
  unlikeVideo, 
  saveVideo,
  unsaveVideo,
  shareVideo 
} from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Heart,
  Play,
  Search,
  Share2,
  Bookmark,
  BookmarkCheck,
  Eye,
  Loader2,
  Filter,
  SortAsc
} from 'lucide-react';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function LikedVideosPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const videoRefs = useRef({});

  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('liked_date');
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [savedVideos, setSavedVideos] = useState(new Set());

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      setLoading(true);
      const response = await getUserLikedVideos();
      setLikedVideos(response.data.videos || []);
      
      // Track which videos are saved
      const saved = new Set(
        response.data.videos
          .filter(v => v.isSaved)
          .map(v => v.id)
      );
      setSavedVideos(saved);
    } catch (error) {
      console.error('Failed to fetch liked videos:', error);
      toast({
        title: "Error",
        description: "Failed to load liked videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlikeVideo = async (videoId) => {
    try {
      await unlikeVideo(videoId);
      setLikedVideos(prev => prev.filter(v => v.id !== videoId));
      toast({
        title: "Success",
        description: "Video removed from liked collection",
      });
    } catch (error) {
      console.error('Failed to unlike video:', error);
      toast({
        title: "Error",
        description: "Failed to remove like",
        variant: "destructive",
      });
    }
  };

  const handleToggleSave = async (videoId) => {
    try {
      if (savedVideos.has(videoId)) {
        await unsaveVideo(videoId);
        setSavedVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
        toast({
          title: "Removed",
          description: "Video removed from saved collection",
        });
      } else {
        await saveVideo(videoId);
        setSavedVideos(prev => new Set(prev).add(videoId));
        toast({
          title: "Saved",
          description: "Video added to saved collection",
        });
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
      toast({
        title: "Error",
        description: "Failed to update saved status",
        variant: "destructive",
      });
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
  const filteredVideos = likedVideos
    .filter(video => {
      const matchesSearch = video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      if (filterType === 'jobseeker') return matchesSearch && video.uploaderType === 'jobseeker';
      if (filterType === 'employer') return matchesSearch && video.uploaderType === 'employer';
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'liked_date') return new Date(b.likedAt) - new Date(a.likedAt);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'upload_date') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Liked Videos
        </h1>
        <p className="text-muted-foreground">
          Videos you've liked ({likedVideos.length} videos)
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search liked videos..."
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
            <SelectItem value="liked_date">Recently Liked</SelectItem>
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
              className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 border-l-pink-500"
              onMouseEnter={() => handleVideoHover(video.id, true)}
              onMouseLeave={() => handleVideoHover(video.id, false)}
            >
              {/* Video Preview */}
              <div className="relative aspect-[9/16] bg-black overflow-hidden">
                <video
                  ref={el => videoRefs.current[video.id] = el}
                  src={`${VITE_API_BASE_URL}${video.videoUrl}`}
                  poster={video.thumbnailUrl ? `${VITE_API_BASE_URL}${video.thumbnailUrl}` : undefined}
                  muted
                  loop
                  className="w-full h-full object-cover"
                  onClick={() => handleVideoClick(video)}
                />

                {/* Liked Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-pink-100 text-pink-800">
                    <Heart className="h-3 w-3 mr-1 fill-current" />
                    Liked
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
                <h3 className="font-semibold line-clamp-1 mb-1">{video.title || 'Untitled'}</h3>
                
                {video.uploaderName && (
                  <p className="text-sm text-muted-foreground mb-2">
                    by {video.uploaderName}
                  </p>
                )}

                {video.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {video.description}
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
                    onClick={() => handleToggleSave(video.id)}
                  >
                    {savedVideos.has(video.id) ? (
                      <BookmarkCheck className="h-3 w-3" />
                    ) : (
                      <Bookmark className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                    onClick={() => handleUnlikeVideo(video.id)}
                  >
                    <Heart className="h-3 w-3 fill-current" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No matching videos' : 'No liked videos yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : 'Start liking videos to build your collection'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/jobseeker-tabs?group=discovery&tab=all-videos')}>
                Discover Videos
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
