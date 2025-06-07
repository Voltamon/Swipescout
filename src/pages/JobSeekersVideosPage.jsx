import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Divider,
  Paper,
  styled,
  useTheme,
  useMediaQuery,
  Tooltip,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUserVideos } from '../services/videoService';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4)
}));

const VideoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  }
}));

const VideoCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '177.78%', // 16:9 aspect ratio for vertical videos
  position: 'relative',
}));

const VideoPlayButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }
}));

const VideoActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  bottom: theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const VideoInfo = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: `2px solid ${theme.palette.primary.main}`,
}));

const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  }
}));

const JobSeekersVideosPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [playingVideo, setPlayingVideo] = useState(null);
  
  // Refs
  const videoRefs = React.useRef({});
  
  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        // Fetch videos with filters
        const response = await getUserVideos({
          page,
          limit: 12,
          search: searchQuery,
          sortBy,
          skill: filterSkill,
          location: filterLocation
        });
        
        setVideos(response.data.videos);
        setTotalPages(response.data.totalPages);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [page, searchQuery, sortBy, filterSkill, filterLocation]);
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  // Handle search
  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      setPage(1);
    }
  };
  
  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };
  
  // Handle filter change
  const handleFilterSkillChange = (event) => {
    setFilterSkill(event.target.value);
    setPage(1);
  };
  
  const handleFilterLocationChange = (event) => {
    setFilterLocation(event.target.value);
    setPage(1);
  };
  
  // Handle video play
  const handlePlayVideo = (videoId) => {
    // Pause currently playing video if any
    if (playingVideo && videoRefs.current[playingVideo]) {
      videoRefs.current[playingVideo].pause();
    }
    
    // Play selected video
    if (videoRefs.current[videoId]) {
      videoRefs.current[videoId].play();
      setPlayingVideo(videoId);
    }
  };
  
  // Handle video pause
  const handlePauseVideo = (videoId) => {
    if (videoRefs.current[videoId]) {
      videoRefs.current[videoId].pause();
      setPlayingVideo(null);
    }
  };
  
  // Handle video ended
  const handleVideoEnded = () => {
    setPlayingVideo(null);
  };
  
  // Navigate to job seeker profile
  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };
  
  // Mock data for demonstration
  const mockVideos = [
    {
      id: '1',
      title: 'مقدمة عن مهاراتي في تطوير الواجهات الأمامية',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 30,
      views: 120,
      likes: 45,
      user: {
        id: '101',
        name: 'أحمد محمد',
        title: 'مطور واجهات أمامية',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        location: 'الرياض، المملكة العربية السعودية'
      },
      skills: ['React', 'JavaScript', 'HTML/CSS'],
      hashtags: ['#frontend', '#webdev', '#react']
    },
    {
      id: '2',
      title: 'خبراتي في تطوير تطبيقات الموبايل',
      thumbnail: 'https://i.ytimg.com/vi/LDZX4ooRsWs/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 45,
      views: 85,
      likes: 32,
      user: {
        id: '102',
        name: 'سارة أحمد',
        title: 'مطورة تطبيقات موبايل',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        location: 'جدة، المملكة العربية السعودية'
      },
      skills: ['Flutter', 'Dart', 'Firebase'],
      hashtags: ['#mobile', '#flutter', '#apps']
    },
    {
      id: '3',
      title: 'مهاراتي في تحليل البيانات',
      thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 40,
      views: 67,
      likes: 28,
      user: {
        id: '103',
        name: 'محمد علي',
        title: 'محلل بيانات',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        location: 'دبي، الإمارات العربية المتحدة'
      },
      skills: ['Python', 'SQL', 'Power BI'],
      hashtags: ['#data', '#analysis', '#python']
    },
    {
      id: '4',
      title: 'تجربتي في إدارة المشاريع التقنية',
      thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 35,
      views: 92,
      likes: 41,
      user: {
        id: '104',
        name: 'نورة سعيد',
        title: 'مديرة مشاريع تقنية',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        location: 'الرياض، المملكة العربية السعودية'
      },
      skills: ['Agile', 'Scrum', 'JIRA'],
      hashtags: ['#projectmanagement', '#agile', '#tech']
    },
    {
      id: '5',
      title: 'مهاراتي في تصميم واجهات المستخدم',
      thumbnail: 'https://i.ytimg.com/vi/RgKAFK5djSk/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 42,
      views: 105,
      likes: 53,
      user: {
        id: '105',
        name: 'خالد عبدالله',
        title: 'مصمم واجهات مستخدم',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        location: 'القاهرة، مصر'
      },
      skills: ['Figma', 'Adobe XD', 'UI/UX'],
      hashtags: ['#design', '#ui', '#ux']
    },
    {
      id: '6',
      title: 'خبراتي في تطوير الخلفيات البرمجية',
      thumbnail: 'https://i.ytimg.com/vi/fRh_vgS2dFE/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 38,
      views: 73,
      likes: 29,
      user: {
        id: '106',
        name: 'عمر فاروق',
        title: 'مطور خلفيات برمجية',
        avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
        location: 'عمّان، الأردن'
      },
      skills: ['Node.js', 'Express', 'MongoDB'],
      hashtags: ['#backend', '#nodejs', '#api']
    },
    {
      id: '7',
      title: 'مهاراتي في اختبار البرمجيات',
      thumbnail: 'https://i.ytimg.com/vi/PT2_F-1esPk/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 33,
      views: 61,
      likes: 24,
      user: {
        id: '107',
        name: 'ليلى محمد',
        title: 'مهندسة اختبار برمجيات',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        location: 'الدوحة، قطر'
      },
      skills: ['Selenium', 'Jest', 'Cypress'],
      hashtags: ['#testing', '#qa', '#automation']
    },
    {
      id: '8',
      title: 'خبراتي في أمن المعلومات',
      thumbnail: 'https://i.ytimg.com/vi/YQl0CONLGHU/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 44,
      views: 88,
      likes: 37,
      user: {
        id: '108',
        name: 'فهد العتيبي',
        title: 'مهندس أمن معلومات',
        avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
        location: 'أبوظبي، الإمارات العربية المتحدة'
      },
      skills: ['Penetration Testing', 'Ethical Hacking', 'Security Auditing'],
      hashtags: ['#security', '#cybersecurity', '#infosec']
    },
    {
      id: '9',
      title: 'مهاراتي في الذكاء الاصطناعي',
      thumbnail: 'https://i.ytimg.com/vi/hHW1oY26kxQ/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 39,
      views: 112,
      likes: 48,
      user: {
        id: '109',
        name: 'سلمى حسين',
        title: 'مهندسة ذكاء اصطناعي',
        avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
        location: 'الرياض، المملكة العربية السعودية'
      },
      skills: ['Machine Learning', 'TensorFlow', 'Python'],
      hashtags: ['#ai', '#machinelearning', '#datascience']
    },
    {
      id: '10',
      title: 'خبراتي في إدارة قواعد البيانات',
      thumbnail: 'https://i.ytimg.com/vi/papuvlVeZg8/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 36,
      views: 79,
      likes: 31,
      user: {
        id: '110',
        name: 'طارق سعيد',
        title: 'مدير قواعد بيانات',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        location: 'الكويت، الكويت'
      },
      skills: ['SQL', 'PostgreSQL', 'Database Design'],
      hashtags: ['#database', '#sql', '#datamanagement']
    },
    {
      id: '11',
      title: 'مهاراتي في تطوير الألعاب',
      thumbnail: 'https://i.ytimg.com/vi/mLqsgBLBQ7o/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 41,
      views: 95,
      likes: 43,
      user: {
        id: '111',
        name: 'يوسف أحمد',
        title: 'مطور ألعاب',
        avatar: 'https://randomuser.me/api/portraits/men/37.jpg',
        location: 'القاهرة، مصر'
      },
      skills: ['Unity', 'C#', 'Game Design'],
      hashtags: ['#gamedev', '#unity', '#gaming']
    },
    {
      id: '12',
      title: 'خبراتي في تطوير تطبيقات الويب',
      thumbnail: 'https://i.ytimg.com/vi/orJSJGHjBLI/maxresdefault.jpg',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: 37,
      views: 83,
      likes: 35,
      user: {
        id: '112',
        name: 'رنا محمود',
        title: 'مطورة تطبيقات ويب',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        location: 'دبي، الإمارات العربية المتحدة'
      },
      skills: ['React', 'Node.js', 'MongoDB'],
      hashtags: ['#webdev', '#fullstack', '#javascript']
    }
  ];
  
  // Mock skills for filter
  const mockSkills = [
    'React', 'JavaScript', 'HTML/CSS', 'Flutter', 'Dart', 'Firebase',
    'Python', 'SQL', 'Power BI', 'Agile', 'Scrum', 'JIRA',
    'Figma', 'Adobe XD', 'UI/UX', 'Node.js', 'Express', 'MongoDB',
    'Selenium', 'Jest', 'Cypress', 'Penetration Testing', 'Ethical Hacking',
    'Machine Learning', 'TensorFlow', 'PostgreSQL', 'Unity', 'C#'
  ];
  
  // Mock locations for filter
  const mockLocations = [
    'الرياض، المملكة العربية السعودية',
    'جدة، المملكة العربية السعودية',
    'دبي، الإمارات العربية المتحدة',
    'أبوظبي، الإمارات العربية المتحدة',
    'القاهرة، مصر',
    'عمّان، الأردن',
    'الدوحة، قطر',
    'الكويت، الكويت'
  ];
  
  // Use mock data if real data is not available
  const videoData = videos.length > 0 ? videos : mockVideos;
  
  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <PageContainer>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            فيديوهات الباحثين عن عمل
          </Typography>
          <Typography variant="body1" color="textSecondary">
            استعرض فيديوهات السير الذاتية للباحثين عن عمل واكتشف المواهب المناسبة لشركتك
          </Typography>
        </Box>
        
        {/* Filters */}
        <FilterPaper elevation={1}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="ابحث عن مهارات، عناوين، أو أسماء..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel>المهارات</InputLabel>
                <Select
                  value={filterSkill}
                  onChange={handleFilterSkillChange}
                  label="المهارات"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">الكل</MenuItem>
                  {mockSkills.map((skill) => (
                    <MenuItem key={skill} value={skill}>{skill}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel>الموقع</InputLabel>
                <Select
                  value={filterLocation}
                  onChange={handleFilterLocationChange}
                  label="الموقع"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">الكل</MenuItem>
                  {mockLocations.map((location) => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel>الترتيب</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="الترتيب"
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="recent">الأحدث</MenuItem>
                  <MenuItem value="popular">الأكثر مشاهدة</MenuItem>
                  <MenuItem value="likes">الأكثر إعجاباً</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </FilterPaper>
        
        {/* Videos Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : videoData.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              لا توجد فيديوهات متاحة
            </Typography>
            <Typography variant="body2" color="textSecondary">
              حاول تغيير معايير البحث أو الفلترة
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {videoData.map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                <VideoCard>
                  <VideoCardMedia
                    image={video.thumbnail}
                    title={video.title}
                  >
                    <video
                      ref={(el) => { videoRefs.current[video.id] = el; }}
                      src={video.url}
                      width="100%"
                      height="100%"
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        objectFit: 'cover',
                        display: playingVideo === video.id ? 'block' : 'none'
                      }}
                      onEnded={handleVideoEnded}
                    />
                    
                    {playingVideo === video.id ? (
                      <VideoPlayButton 
                        aria-label="pause"
                        onClick={() => handlePauseVideo(video.id)}
                      >
                        <PauseIcon fontSize="large" />
                      </VideoPlayButton>
                    ) : (
                      <VideoPlayButton 
                        aria-label="play"
                        onClick={() => handlePlayVideo(video.id)}
                      >
                        <PlayArrowIcon fontSize="large" />
                      </VideoPlayButton>
                    )}
                    
                    <VideoActions>
                      <Tooltip title="إعجاب" arrow placement="left">
                        <IconButton color="inherit">
                          <FavoriteIcon />
                        </IconButton>
                      </Tooltip>
                      <Typography variant="caption" color="inherit">
                        {video.likes}
                      </Typography>
                      <Tooltip title="مشاركة" arrow placement="left">
                        <IconButton color="inherit">
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="حفظ" arrow placement="left">
                        <IconButton color="inherit">
                          <BookmarkIcon />
                        </IconButton>
                      </Tooltip>
                    </VideoActions>
                    
                    <VideoInfo>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <UserAvatar 
                          src={video.user.avatar} 
                          alt={video.user.name}
                          onClick={() => navigateToProfile(video.user.id)}
                          sx={{ cursor: 'pointer' }}
                        />
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle2" sx={{ color: '#fff' }}>
                            {video.user.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#ddd' }}>
                            {video.user.title}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#ddd' }}>
                          {formatDuration(video.duration)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#ddd' }}>
                          {video.views} مشاهدة
                        </Typography>
                      </Box>
                    </VideoInfo>
                  </VideoCardMedia>
                  <CardContent>
                    <Typography variant="subtitle1" component="h3" gutterBottom noWrap>
                      {video.title}
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      {video.skills.slice(0, 2).map((skill, index) => (
                        <SkillChip 
                          key={index} 
                          label={skill} 
                          size="small"
                        />
                      ))}
                      {video.skills.length > 2 && (
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                          +{video.skills.length - 2}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="textSecondary" sx={{ ml: 0.5 }} noWrap>
                        {video.user.location}
                      </Typography>
                    </Box>
                  </CardContent>
                </VideoCard>
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        )}
      </Container>
    </PageContainer>
  );
};

export default JobSeekersVideosPage;
