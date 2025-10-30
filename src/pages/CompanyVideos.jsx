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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { useToast } from '@/hooks/use-toast';
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
import themeColors from '@/config/theme-colors';

export default function CompanyVideos() {
    const { user } = useAuth();
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

    const FilterSidebar = () => (
        <Box sx={{ width: 280, p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Filters
            </Typography>
            
            <Box mb={3}>
                <Typography variant="subtitle2" gutterBottom>
                    Category
                </Typography>
                {categories.map((category) => (
                    <Button
                        key={category.value}
                        fullWidth
                        variant={selectedCategory === category.value ? 'contained' : 'text'}
                        onClick={() => setSelectedCategory(category.value)}
                        sx={{ justifyContent: 'flex-start', mb: 0.5 }}
                    >
                        {category.label}
                    </Button>
                ))}
            </Box>

            <Box mb={3}>
                <Typography variant="subtitle2" gutterBottom>
                    Location
                </Typography>
                {locations.map((location) => (
                    <Button
                        key={location.value}
                        fullWidth
                        variant={selectedLocation === location.value ? 'contained' : 'text'}
                        onClick={() => setSelectedLocation(location.value)}
                        sx={{ justifyContent: 'flex-start', mb: 0.5 }}
                    >
                        {location.label}
                    </Button>
                ))}
            </Box>

            <Box mb={3}>
                <Typography variant="subtitle2" gutterBottom>
                    Company Size
                </Typography>
                {companySizes.map((size) => (
                    <Button
                        key={size.value}
                        fullWidth
                        variant={selectedCompanySize === size.value ? 'contained' : 'text'}
                        onClick={() => setSelectedCompanySize(size.value)}
                        sx={{ justifyContent: 'flex-start', mb: 0.5 }}
                    >
                        {size.label}
                    </Button>
                ))}
            </Box>
        </Box>
    );

    return (
        <Container maxWidth="xl">
            <CompanyVideosContainer>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" fontWeight="bold">
                        Company Videos
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<FilterList />}
                        onClick={() => setDrawerOpen(true)}
                    >
                        Filters
                    </Button>
                </Box>

                {/* Search */}
                <TextField
                    fullWidth
                    placeholder="Search companies, videos, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 4 }}
                />

                {/* Videos Grid */}
                {loading ? (
                    <Box display="flex" justifyContent="center" py={8}>
                        <CircularProgress size={60} />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {filteredVideos.map((video) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                                <VideoCard onClick={() => handleVideoClick(video)}>
                                    <Box position="relative">
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={video.thumbnail || '/placeholder-video.jpg'}
                                            alt={video.title}
                                        />
                                        <PlayButton>
                                            <PlayArrow fontSize="large" />
                                        </PlayButton>
                                        
                                        {/* Video Actions */}
                                        <Box
                                            position="absolute"
                                            top={8}
                                            right={8}
                                            display="flex"
                                            flexDirection="column"
                                            gap={1}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAnchorEl(e.currentTarget);
                                                    setMenuVideo(video);
                                                }}
                                                sx={{ 
                                                    backgroundColor: 'rgba(0,0,0,0.5)', 
                                                    color: 'white',
                                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                                }}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                        </Box>

                                        {/* Video Stats */}
                                        <Box
                                            position="absolute"
                                            bottom={8}
                                            left={8}
                                            display="flex"
                                            gap={1}
                                        >
                                            <Chip
                                                size="small"
                                                label={`${video.views || 0} views`}
                                                sx={{ 
                                                    backgroundColor: 'rgba(0,0,0,0.7)', 
                                                    color: 'white',
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <Avatar
                                                src={video.companyLogo}
                                                sx={{ width: 32, height: 32, mr: 1 }}
                                            >
                                                {video.company?.[0]}
                                            </Avatar>
                                            <Typography variant="h6" noWrap>
                                                {video.company}
                                            </Typography>
                                        </Box>
                                        
                                        <Typography variant="body1" fontWeight="medium" gutterBottom>
                                            {video.title}
                                        </Typography>
                                        
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary" 
                                            sx={{ 
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {video.description}
                                        </Typography>

                                        {video.location && (
                                            <Box display="flex" alignItems="center" mt={1}>
                                                <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {video.location}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                            <Box display="flex" gap={1}>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleLike(video.id, e)}
                                                    color={likedVideos.has(video.id) ? "error" : "default"}
                                                >
                                                    {likedVideos.has(video.id) ? <Favorite /> : <FavoriteBorder />}
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleSave(video.id, e)}
                                                    color={savedVideos.has(video.id) ? "primary" : "default"}
                                                >
                                                    {savedVideos.has(video.id) ? <Bookmark /> : <BookmarkBorder />}
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleComment(video);
                                                    }}
                                                >
                                                    <Comment />
                                                </IconButton>
                                            </Box>
                                            
                                            <Button
                                                size="small"
                                                variant="contained"
                                                startIcon={<Connect />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleConnect(video);
                                                }}
                                            >
                                                Connect
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </VideoCard>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Filter Drawer */}
                <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >
                    <FilterSidebar />
                </Drawer>

                {/* Video Dialog */}
                <Dialog
                    open={videoDialog}
                    onClose={() => setVideoDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    {selectedVideo && (
                        <>
                            <DialogContent sx={{ p: 0 }}>
                                <video
                                    width="100%"
                                    height="400"
                                    controls
                                    autoPlay
                                    src={selectedVideo.videoUrl}
                                />
                                <Box p={3}>
                                    <Typography variant="h5" gutterBottom>
                                        {selectedVideo.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        {selectedVideo.company}
                                    </Typography>
                                    <Typography variant="body2">
                                        {selectedVideo.description}
                                    </Typography>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setVideoDialog(false)}>
                                    Close
                                </Button>
                                <Button variant="contained" onClick={() => handleConnect(selectedVideo)}>
                                    Connect with Company
                                </Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>

                {/* Comment Dialog */}
                <Dialog
                    open={commentDialog.open}
                    onClose={() => setCommentDialog({ open: false, video: null })}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        Comments - {commentDialog.video?.title}
                    </DialogTitle>
                    <DialogContent>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddComment}
                                sx={{ mt: 1 }}
                                disabled={!newComment.trim()}
                            >
                                Add Comment
                            </Button>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <List>
                            {comments.map((comment, index) => (
                                <ListItem key={index} alignItems="flex-start">
                                    <Avatar sx={{ mr: 2 }}>
                                        {comment.author?.[0]}
                                    </Avatar>
                                    <ListItemText
                                        primary={comment.author}
                                        secondary={comment.text}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCommentDialog({ open: false, video: null })}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Action Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={(e) => handleShare(menuVideo, e)}>
                        <ListItemIcon><Share /></ListItemIcon>
                        <ListItemText>Share</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => window.open(`/company/${menuVideo?.companyId}`, '_blank')}>
                        <ListItemIcon><Visibility /></ListItemIcon>
                        <ListItemText>View Company Profile</ListItemText>
                    </MenuItem>
                </Menu>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert 
                        onClose={() => setSnackbar({ ...snackbar, open: false })} 
                        severity={snackbar.severity}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </CompanyVideosContainer>
        </Container>
    );
}   

