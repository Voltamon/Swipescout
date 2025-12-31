import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { 
    getEmployerPublicVideos, 
    likeVideo, 
    unlikeVideo, 
    saveVideo, 
    unsaveVideo,
    shareVideo,
    addVideoComment,
    getVideoComments,
    connectWithCandidate
} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/UI/dialog.jsx';
import { Textarea } from '@/components/UI/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select.jsx';
import { useToast } from '@/hooks/use-toast';
import OpenChatModal from '@/components/Chat/OpenChatModal.jsx';
import useConnectionMap from '@/hooks/useConnectionMap.jsx';
import {
    Play,
    Filter,
    Search,
    Building2,
    MapPin,
    Users,
    Globe,
    Tag,
    Heart,
    Bookmark,
    BookmarkCheck,
    Share2,
    MessageCircle,
    Eye,
    MoreVertical,
    Handshake,
    Loader2,
    PlayCircle
} from 'lucide-react';
import themeColors from '@/config/theme-colors-employer';

export default function CompanyVideos() {
  // const { user } = useAuth(); // Removed: unused variable
    const { toast } = useToast();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedCompanySize, setSelectedCompanySize] = useState('all');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoDialog, setVideoDialog] = useState(false);
    const [commentDialog, setCommentDialog] = useState({ open: false, video: null });
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [likedVideos, setLikedVideos] = useState(new Set());
    const [savedVideos, setSavedVideos] = useState(new Set());
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const { connectionMap, refresh: refreshConnections } = useConnectionMap();
    const [openConversation, setOpenConversation] = useState(null);
    const [openChat, setOpenChat] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuVideo, setMenuVideo] = useState(null);

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'technology', label: 'Technology' },
        { value: 'finance', label: 'Finance' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'education', label: 'Education' },
        { value: 'retail', label: 'Retail' },
        { value: 'manufacturing', label: 'Manufacturing' }
    ];

    const locations = [
        { value: 'all', label: 'All Locations' },
        { value: 'remote', label: 'Remote' },
        { value: 'new-york', label: 'New York' },
        { value: 'san-francisco', label: 'San Francisco' },
        { value: 'london', label: 'London' },
        { value: 'toronto', label: 'Toronto' }
    ];

    const companySizes = [
        { value: 'all', label: 'All Company Sizes' },
        { value: 'startup', label: 'Startup (1-50)' },
        { value: 'medium', label: 'Medium (51-500)' },
        { value: 'large', label: 'Large (500+)' }
    ];

    useEffect(() => {
        fetchVideos();
    }, [selectedCategory, selectedLocation, selectedCompanySize, searchTerm]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const response = await getEmployerPublicVideos(1, 20);
            setVideos(response.data.videos || []);
        } catch (error) {
            console.error('Error fetching company videos:', error);
            toast({
                title: "Error",
                description: "Failed to load company videos",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        setVideoDialog(true);
    };

    const handleLike = async (videoId, event) => {
        event.stopPropagation();
        try {
            if (likedVideos.has(videoId)) {
                await unlikeVideo(videoId);
                setLikedVideos(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(videoId);
                    return newSet;
                });
            } else {
                await likeVideo(videoId);
                setLikedVideos(prev => new Set(prev).add(videoId));
            }
        } catch (error) {
            console.error('Error liking video:', error);
            toast({
                title: "Error",
                description: "Failed to like video",
                variant: "destructive",
            });
        }
    };

    const handleSave = async (videoId, event) => {
        event.stopPropagation();
        try {
            if (savedVideos.has(videoId)) {
                await unsaveVideo(videoId);
                setSavedVideos(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(videoId);
                    return newSet;
                });
                toast({
                    description: "Video removed from saved list",
                });
            } else {
                await saveVideo(videoId);
                setSavedVideos(prev => new Set(prev).add(videoId));
                toast({
                    title: "Saved!",
                    description: "Video saved successfully",
                });
            }
        } catch (error) {
            console.error('Error saving video:', error);
            toast({
                title: "Error",
                description: "Failed to save video",
                variant: "destructive",
            });
        }
    };

    const handleShare = async (video, event) => {
        event.stopPropagation();
        try {
            if (navigator.share) {
                await navigator.share({
                    title: video.title,
                    text: `Check out this company video from ${video.company}`,
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast({
                    description: "Link copied to clipboard",
                });
                setSnackbar({
                    open: true,
                    message: 'Link copied to clipboard',
                    severity: 'success'
                });
            }
        } catch (error) {
            console.error('Error sharing video:', error);
            toast({
                title: "Error",
                description: "Failed to share the video",
                variant: "destructive",
            });
        }
    };

    const handleComment = async (video) => {
        setCommentDialog({ open: true, video });
        try {
            const response = await getVideoComments(video.id);
            setComments(response.data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        
        try {
            await addVideoComment(commentDialog.video.id, newComment);
            setNewComment('');
            // Refresh comments
            const response = await getVideoComments(commentDialog.video.id);
            setComments(response.data || []);
            setSnackbar({
                open: true,
                message: 'Comment added successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            setSnackbar({
                open: true,
                message: 'Failed to add comment',
                severity: 'error'
            });
        }
    };

    const handleConnect = async (video) => {
        try {
            await connectWithCandidate(video.userId, `Hi! I'm interested in learning more about ${video.company}. Your company video was very impressive!`);
            setSnackbar({
                open: true,
                message: 'Connection request sent successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error connecting:', error);
            setSnackbar({
                open: true,
                message: 'Failed to send connection request',
                severity: 'error'
            });
        }
    };

    const filteredVideos = videos.filter(video => {
        const matchesSearch = video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            video.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            video.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
        const matchesLocation = selectedLocation === 'all' || video.location === selectedLocation;
        const matchesSize = selectedCompanySize === 'all' || video.companySize === selectedCompanySize;
        
        return matchesSearch && matchesCategory && matchesLocation && matchesSize;
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-4xl font-bold">{i18n.t('auto_company_videos')}</h1>
                    <Button variant="outline" onClick={() => setDrawerOpen(true)}>
                        <Filter className="mr-2 h-4 w-4" />{i18n.t('auto_filters')}</Button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        className="pl-10 w-full"
                        placeholder={i18n.t('auto_search_companies_videos_or_descriptions')} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Videos Grid */}
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-12 w-12 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredVideos.map((video) => (
                            <Card key={video.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleVideoClick(video)}>
                                <div className="relative">
                                    <img
                                        className="w-full h-[200px] object-cover"
                                        src={video.thumbnail || '/placeholder-video.jpg'}
                                        alt={video.title}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                                            <PlayCircle className="h-12 w-12 text-white" />
                                        </div>
                                    </div>
                                    
                                    {/* Video Actions */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white h-8 w-8"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setAnchorEl(e.currentTarget);
                                                setMenuVideo(video);
                                            }}
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Video Stats */}
                                    <div className="absolute bottom-2 left-2 flex gap-1">
                                        <Badge variant="secondary" className="bg-black bg-opacity-70 text-white text-xs">
                                            <Eye className="h-3 w-3 mr-1" />
                                            {video.views || 0} views
                                        </Badge>
                                    </div>
                                </div>
                                
                                <CardContent>
                                    <div className="flex items-center mb-2">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage src={video.companyLogo} />
                                            <AvatarFallback>{video.company?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <h3 className="font-semibold truncate">{video.company}</h3>
                                    </div>
                                    
                                    <h4 className="font-medium mb-1">{video.title}</h4>
                                    
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {video.description}
                                    </p>

                                    {video.location && (
                                        <div className="flex items-center mt-2">
                                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                            <span className="text-xs text-gray-500">{video.location}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center mt-3">
                                        <div className="flex gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={(e) => handleLike(video.id, e)}
                                            >
                                                <Heart className={`h-4 w-4 ${likedVideos.has(video.id) ? 'fill-red-500 text-red-500' : ''}`} />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={(e) => handleSave(video.id, e)}
                                            >
                                                {savedVideos.has(video.id) ? (
                                                    <BookmarkCheck className="h-4 w-4 text-blue-500" />
                                                ) : (
                                                    <Bookmark className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleComment(video);
                                                }}
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        
                                        {(() => {
                                            const ownerId = video.userId || video.user_id || video.ownerId || (video.user && video.user.id);
                                            const c = connectionMap[ownerId];
                                            if (c && c.status === 'accepted') {
                                                return <Button size="sm" disabled className="bg-green-600 text-white">{i18n.t('auto_connected')}</Button>;
                                            }
                                            if (c && c.status === 'pending' && c.isSender) {
                                                return <Button size="sm" disabled>{i18n.t('auto_pending')}</Button>;
                                            }
                                            if (c && c.status === 'pending' && !c.isSender) {
                                                return (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={async () => { try { const { data } = await import('@/services/connectionService.js').then(m => m.acceptConnection(c.id)); await refreshConnections(); setSnackbar({ open: true, message: 'Connection accepted', severity: 'success' }); if (data?.conversation) { setOpenConversation(data.conversation); setOpenChat(true); } } catch (err) { setSnackbar({ open: true, message: 'Failed to accept', severity: 'error' }); } }} className="bg-gradient-to-r from-cyan-600 to-purple-600">{i18n.t('auto_accept')}</Button>
                                                        <Button size="sm" variant="outline" onClick={async () => { try { await import('@/services/connectionService.js').then(m => m.rejectConnection(c.id)); await refreshConnections(); setSnackbar({ open: true, message: 'Connection declined', severity: 'info' }); } catch (err) { setSnackbar({ open: true, message: 'Failed to decline', severity: 'error' }); } }}>{i18n.t('auto_decline')}</Button>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <Button
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleConnect(video);
                                                    }}
                                                >
                                                    <Handshake className="h-4 w-4 mr-1" />{i18n.t('auto_connect')}</Button>
                                            );
                                        })()}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Video Dialog */}
                <Dialog open={videoDialog} onOpenChange={setVideoDialog}>
                    <DialogContent className="max-w-3xl">
                        {selectedVideo && (
                            <>
                                <DialogHeader>
                                    <DialogTitle>{selectedVideo.title}</DialogTitle>
                                    <DialogDescription>{selectedVideo.company}</DialogDescription>
                                </DialogHeader>
                                <div className="p-0">
                                    <video
                                        className="w-full h-[400px]"
                                        controls
                                        autoPlay
                                        src={selectedVideo.videoUrl}
                                    />
                                    <div className="p-4">
                                        <p className="text-sm text-gray-600">
                                            {selectedVideo.description}
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setVideoDialog(false)}>{i18n.t('auto_close')}</Button>
                                    <Button onClick={() => handleConnect(selectedVideo)}>{i18n.t('auto_connect_with_company')}</Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Comment Dialog */}
                <Dialog open={commentDialog.open} onOpenChange={(open) => setCommentDialog({ open, video: commentDialog.video })}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Comments - {commentDialog.video?.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Textarea
                                    className="w-full"
                                    rows={3}
                                    placeholder={i18n.t('auto_add_a_comment')} 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button
                                    className="mt-2"
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim()}
                                >{i18n.t('auto_add_comment')}</Button>
                            </div>
                            
                            <div className="border-t pt-4">
                                <div className="space-y-4">
                                    {comments.map((comment, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <Avatar>
                                                <AvatarFallback>{comment.author?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{comment.author}</p>
                                                <p className="text-sm text-gray-600">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCommentDialog({ open: false, video: null })}>{i18n.t('auto_close')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <OpenChatModal open={openChat} onOpenChange={setOpenChat} conversation={openConversation} />
            </div>
        </div>
    );
}   

