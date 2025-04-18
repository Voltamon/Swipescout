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
  InputAdornment
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
// import { getJobVideos } from '../services/jobService';

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
    { id: 'all', name: 'جميع الوظائف', icon: <WorkIcon /> },
    { id: 'tech', name: 'تقنية المعلومات', icon: <WorkIcon /> },
    { id: 'marketing', name: 'التسويق', icon: <WorkIcon /> },
    { id: 'design', name: 'التصميم', icon: <WorkIcon /> },
    { id: 'finance', name: 'المالية', icon: <WorkIcon /> },
    { id: 'hr', name: 'الموارد البشرية', icon: <WorkIcon /> },
  ]);

  useEffect(() => {
    const fetchJobVideos = async () => {
      try {
        setLoading(true);
        const response = await getJobVideos({
          category: activeCategory !== 'all' ? activeCategory : undefined,
          search: searchQuery || undefined
        });
        setVideos(response.data.videos);
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

  return (
    <JobVideosContainer>
      <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">فيديوهات الوظائف</Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="بحث عن وظائف..."
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
            تصفية
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                التصنيفات
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
                المهارات الشائعة
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <SkillChip label="React" onClick={() => setSearchQuery('React')} />
                <SkillChip label="JavaScript" onClick={() => setSearchQuery('JavaScript')} />
                <SkillChip label="Node.js" onClick={() => setSearchQuery('Node.js')} />
                <SkillChip label="UI/UX" onClick={() => setSearchQuery('UI/UX')} />
                <SkillChip label="تسويق رقمي" onClick={() => setSearchQuery('تسويق رقمي')} />
                <SkillChip label="إدارة المشاريع" onClick={() => setSearchQuery('إدارة المشاريع')} />
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
                لم يتم العثور على فيديوهات وظائف
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                جرب تغيير معايير البحث أو التصفية
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
                      <PlayButton aria-label="تشغيل">
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
      
      {/* مشغل الفيديو */}
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
                        : 'غير محدد'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CategoryIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {selectedVideo.job.category?.name || 'غير محدد'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" fullWidth>
                  التقدم للوظيفة
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      
      {/* درج التصفية */}
      <FilterDrawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={toggleFilterDrawer}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            تصفية الوظائف
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            نوع الوظيفة
          </Typography>
          <List>
            <ListItem button>
              <ListItemText primary="دوام كامل" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="دوام جزئي" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="عن بعد" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="تدريب" />
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            المستوى
          </Typography>
          <List>
            <ListItem button>
              <ListItemText primary="مبتدئ" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="متوسط" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="خبير" />
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            الراتب
          </Typography>
          <List>
            <ListItem button>
              <ListItemText primary="أقل من 5,000" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="5,000 - 10,000" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="10,000 - 15,000" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="أكثر من 15,000" />
            </ListItem>
          </List>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={toggleFilterDrawer}>
              إلغاء
            </Button>
            <Button variant="contained" color="primary" onClick={toggleFilterDrawer}>
              تطبيق
            </Button>
          </Box>
        </Box>
      </FilterDrawer>
    </JobVideosContainer>
  );
};

export default JobVideos;
