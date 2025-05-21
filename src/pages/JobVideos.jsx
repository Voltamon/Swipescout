import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Button,
    Chip,
    CircularProgress,
    TextField,
    InputAdornment,
    useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import { useAuth } from '../hooks/useAuth';
// import { getJobVideos } from '../services/jobService'; // Assuming this service exists

const JobVideosContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: 'calc(100vh - 56px)',
}));

const SidebarButton = styled(Button)(({ theme, active }) => ({
    justifyContent: 'flex-start',
    textAlign: 'left',
    padding: theme.spacing(1.5, 3),
    borderRadius: 0,
    borderLeft: active ? `4px solid ${theme.palette.primary.main}` : 'none',
    backgroundColor: active ? theme.palette.action.selected : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const VideoCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[6],
    },
}));

const VideoCardMedia = styled(CardMedia)(({ theme }) => ({
    paddingTop: '56.25%', // 16:9 aspect ratio
    position: 'relative',
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
}));

const FilterDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: 280,
        padding: theme.spacing(2),
    },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const JobVideos = () => {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [categories, setCategories] = useState([
        { id: 'all', name: 'All Jobs', icon: <WorkIcon /> },
        { id: 'tech', name: 'Information Technology', icon: <WorkIcon /> },
        { id: 'marketing', name: 'Marketing', icon: <WorkIcon /> },
        { id: 'design', name: 'Design', icon: <WorkIcon /> },
        { id: 'finance', name: 'Finance', icon: <WorkIcon /> },
        { id: 'hr', name: 'Human Resources', icon: <WorkIcon /> },
    ]);

    useEffect(() => {
        const fetchJobVideos = async () => {
            try {
                setLoading(true);
                // Assuming getJobVideos is a function that takes category and search as parameters
                // const response = await getJobVideos({
                //     category: activeCategory !== 'all' ? activeCategory : undefined,
                //     search: searchQuery || undefined
                // });
                // setVideos(response.data.videos);

                // Placeholder data for demonstration
                setVideos([
                    { id: '1', job: { title: 'Software Engineer', company: { name: 'Tech Innovations Inc.' }, location: 'New York, USA', skills: [{ id: 's1', name: 'React' }, { id: 's2', name: 'JavaScript' }], category: { name: 'Information Technology' } }, thumbnail_url: '/placeholder-thumbnail.jpg', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                    { id: '2', job: { title: 'Marketing Manager', company: { name: 'Global Marketing Ltd.' }, location: 'London, UK', skills: [{ id: 's3', name: 'Digital Marketing' }, { id: 's4', name: 'SEO' }], category: { name: 'Marketing' } }, thumbnail_url: '/placeholder-thumbnail.jpg', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                    { id: '3', job: { title: 'UI/UX Designer', company: { name: 'Creative Solutions Co.' }, location: 'San Francisco, USA', skills: [{ id: 's5', name: 'UI Design' }, { id: 's6', name: 'UX Research' }], category: { name: 'Design' } }, thumbnail_url: '/placeholder-thumbnail.jpg', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                    { id: '4', job: { title: 'Financial Analyst', company: { name: 'Alpha Finance Group' }, location: 'Chicago, USA', skills: [{ id: 's7', name: 'Financial Modeling' }, { id: 's8', name: 'Data Analysis' }], category: { name: 'Finance' } }, thumbnail_url: '/placeholder-thumbnail.jpg', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                    { id: '5', job: { title: 'HR Manager', company: { name: 'People First Corp.' }, location: 'Berlin, Germany', skills: [{ id: 's9', name: 'Talent Acquisition' }, { id: 's10', name: 'Employee Relations' }], category: { name: 'Human Resources' } }, thumbnail_url: '/placeholder-thumbnail.jpg', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                    { id: '6', job: { title: 'Front-end Developer', company: { name: 'Web Wizards Inc.' }, location: 'Los Angeles, USA', skills: [{ id: 's1', name: 'React' }, { id: 's2', name: 'JavaScript' }, { id: 's11', name: 'HTML' }, { id: 's12', name: 'CSS' }], category: { name: 'Information Technology' } }, thumbnail_url: '/placeholder-thumbnail.jpg', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                ]);
            } catch (error) {
                console.error('Error fetching job videos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobVideos();
    }, [activeCategory, searchQuery]);

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    const handleCloseVideo = () => {
        setSelectedVideo(null);
    };

    const toggleFilterDrawer = () => {
        setFilterDrawerOpen(!filterDrawerOpen);
    };

    const filteredVideos = videos.filter(video =>
        video.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.job.company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  const theme = useTheme()

    return (
        <JobVideosContainer sx={{
    background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%), url('/backgrounds/bkg1.png')`,
    backgroundSize: 'auto',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top right',
    padding: theme.spacing(2),
    
    mt: 2,
    }}><br></br>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between', alignItems: 'center' ,
    paddingBottom: 4,
}}>
                <Typography variant="h4">Job Videos</Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        placeholder="Search for jobs..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={toggleFilterDrawer}
                    >
                        Filter
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Categories
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                {categories.map((category) => (
                                    <ListItem
                                        key={category.id}
                                        disablePadding
                                        disableGutters
                                    >
                                        <SidebarButton
                                            fullWidth
                                            active={activeCategory === category.id}
                                            onClick={() => handleCategoryClick(category.id)}
                                            startIcon={category.icon}
                                        >
                                            {category.name}
                                        </SidebarButton>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Popular Skills
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <SkillChip label="React" onClick={() => setSearchQuery('React')} />
                                <SkillChip label="JavaScript" onClick={() => setSearchQuery('JavaScript')} />
                                <SkillChip label="Node.js" onClick={() => setSearchQuery('Node.js')} />
                                <SkillChip label="UI/UX" onClick={() => setSearchQuery('UI/UX')} />
                                <SkillChip label="Digital Marketing" onClick={() => setSearchQuery('Digital Marketing')} />
                                <SkillChip label="Project Management" onClick={() => setSearchQuery('Project Management')} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={9}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredVideos.length === 0 ? (
                        <Box sx={{ textAlign: 'center', p: 5 }}>
                            <Typography variant="h6" color="textSecondary">
                                No job videos found
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                Try changing your search or filter criteria
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredVideos.map((video) => (
                                <Grid item xs={12} sm={6} md={4} key={video.id}>
                                    <VideoCard onClick={() => handleVideoClick(video)}>
                                        <VideoCardMedia
                                            image={video.thumbnail_url || '/placeholder-thumbnail.jpg'}
                                            title={video.job.title}
                                        >
                                            <PlayButton aria-label="play">
                                                <PlayArrowIcon fontSize="large" />
                                            </PlayButton>
                                        </VideoCardMedia>
                                        <CardContent>
                                            <Typography variant="h6" noWrap>
                                                {video.job.title}
                                            </Typography>

                                            <Typography variant="body2" color="textSecondary" noWrap>
                                                {video.job.company.name}
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                                                <Typography variant="body2" color="textSecondary" noWrap>
                                                    {video.job.location}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mt: 1 }}>
                                                {video.job.skills && video.job.skills.slice(0, 3).map(skill => (
                                                    <SkillChip
                                                        key={skill.id}
                                                        label={skill.name}
                                                        size="small"
                                                        sx={{ mr: 0.5, mb: 0.5 }}
                                                    />
                                                ))}
                                                {video.job.skills && video.job.skills.length > 3 && (
                                                    <Chip
                                                        label={`+${video.job.skills.length - 3}`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>
                                        </CardContent>
                                    </VideoCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </Grid>

            {/* Video Player Modal */}
            {selectedVideo && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        p: 3,
                    }}
                    onClick={handleCloseVideo}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 900,
                            maxHeight: '80vh',
                            position: 'relative',
                            backgroundColor: 'black',
                            borderRadius: 1,
                            overflow: 'hidden',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Box
                            component="video"
                            sx={{
                                width: '100%',
                                maxHeight: '70vh',
                            }}
                            controls
                            autoPlay
                            src={selectedVideo.video_url}
                        />

                        <Box sx={{ p: 2, backgroundColor: 'white' }}>
                            <Typography variant="h6">{selectedVideo.job.title}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {selectedVideo.job.company.name}
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                                        <Typography variant="body2">
                                            {selectedVideo.job.location}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <BusinessIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                                        <Typography variant="body2">
                                            {selectedVideo.job.employment_type}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AttachMoneyIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                                        <Typography variant="body2">
                                            {selectedVideo.job.salary_min && selectedVideo.job.salary_max
                                                ? `${selectedVideo.job.salary_min} - ${selectedVideo.job.salary_max}`
                                                : 'Not specified'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CategoryIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                                        <Typography variant="body2">
                        {selectedVideo.job.category?.name || 'Not specified'}
                      </Typography>
                      
                      </Box>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 2 }}>
                                <Button variant="contained" color="primary" fullWidth>
                                    Apply for Job
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Filter Drawer */}
            <FilterDrawer
                anchor="right"
                open={filterDrawerOpen}
                onClose={toggleFilterDrawer}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Filter Jobs
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                        Job Type
                    </Typography>
                    <List>
                        <ListItem button>
                            <ListItemText primary="Full-time" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Part-time" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Remote" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Internship" />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                        Level
                    </Typography>
                    <List>
                        <ListItem button>
                            <ListItemText primary="Entry-level" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Mid-level" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Senior-level" />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                        Salary
                    </Typography>
                    <List>
                        <ListItem button>
                            <ListItemText primary="Less than $5,000" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="$5,000 - $10,000" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="$10,000 - $15,000" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="More than $15,000" />
                        </ListItem>
                    </List>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="outlined" onClick={toggleFilterDrawer}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={toggleFilterDrawer}>
                            Apply
                        </Button>
                    </Box>
                </Box>
            </FilterDrawer>
        </JobVideosContainer>
    );
};

export default JobVideos;
