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
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import LanguageIcon from '@mui/icons-material/Language';
import CategoryIcon from '@mui/icons-material/Category';
import { useAuth } from '../hooks/useAuth';
// import { getCompanyVideos } from '../services/companyService';

const CompanyVideosContainer = styled(Box)(({ theme }) => ({
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

const IndustryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const CompanyVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndustry, setActiveIndustry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [industries, setIndustries] = useState([
    { id: 'all', name: 'جميع الشركات', icon: <BusinessIcon /> },
    { id: 'tech', name: 'تقنية المعلومات', icon: <BusinessIcon /> },
    { id: 'finance', name: 'المالية والبنوك', icon: <BusinessIcon /> },
    { id: 'healthcare', name: 'الرعاية الصحية', icon: <BusinessIcon /> },
    { id: 'education', name: 'التعليم', icon: <BusinessIcon /> },
    { id: 'retail', name: 'التجزئة', icon: <BusinessIcon /> },
  ]);

  useEffect(() => {
    const fetchCompanyVideos = async () => {
      try {
        setLoading(true);
        // const response = await getCompanyVideos({
        //   industry: activeIndustry !== 'all' ? activeIndustry : undefined,
        //   search: searchQuery || undefined
        // });
        // setVideos(response.data.videos);
      } catch (error) {
        console.error('Error fetching company videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyVideos();
  }, [activeIndustry, searchQuery]);

  const handleIndustryClick = (industryId) => {
    setActiveIndustry(industryId);
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
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CompanyVideosContainer>
      <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">فيديوهات الشركات</Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="بحث عن شركات..."
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
                الصناعات
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List disablePadding>
                {industries.map((industry) => (
                  <ListItem 
                    key={industry.id} 
                    disablePadding 
                    disableGutters
                  >
                    <SidebarButton
                      fullWidth
                      active={activeIndustry === industry.id}
                      onClick={() => handleIndustryClick(industry.id)}
                      startIcon={industry.icon}
                    >
                      {industry.name}
                    </SidebarButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الشركات الشائعة
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <IndustryChip label="شركة الاتصالات" onClick={() => setSearchQuery('شركة الاتصالات')} />
                <IndustryChip label="بنك الرياض" onClick={() => setSearchQuery('بنك الرياض')} />
                <IndustryChip label="أرامكو" onClick={() => setSearchQuery('أرامكو')} />
                <IndustryChip label="مايكروسوفت" onClick={() => setSearchQuery('مايكروسوفت')} />
                <IndustryChip label="جوجل" onClick={() => setSearchQuery('جوجل')} />
                <IndustryChip label="أمازون" onClick={() => setSearchQuery('أمازون')} />
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
                لم يتم العثور على فيديوهات شركات
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
                      title={video.title}
                    >
                      <PlayButton aria-label="تشغيل">
                        <PlayArrowIcon fontSize="large" />
                      </PlayButton>
                    </VideoCardMedia>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar 
                          src={video.company.logo_url} 
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Typography variant="h6" noWrap>
                          {video.company.name}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {video.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="textSecondary" noWrap>
                          {video.company.location || 'غير محدد'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <BusinessIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="textSecondary" noWrap>
                          {video.company.industry || 'غير محدد'}
                        </Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  src={selectedVideo.company.logo_url} 
                  sx={{ width: 40, height: 40, mr: 1 }}
                />
                <Box>
                  <Typography variant="h6">{selectedVideo.company.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedVideo.title}
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {selectedVideo.company.location || 'غير محدد'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {selectedVideo.company.industry || 'غير محدد'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {selectedVideo.company.size || 'غير محدد'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LanguageIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {selectedVideo.company.website || 'غير محدد'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {selectedVideo.company.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    {selectedVideo.company.description}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" fullWidth>
                  عرض وظائف الشركة
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
            تصفية الشركات
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            حجم الشركة
          </Typography>
          <List>
            <ListItem button>
              <ListItemText primary="شركة ناشئة (1-50)" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="صغيرة (51-200)" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="متوسطة (201-1000)" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="كبيرة (1000+)" />
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            الموقع
          </Typography>
          <List>
            <ListItem button>
              <ListItemText primary="الرياض" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="جدة" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="الدمام" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="أخرى" />
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
    </CompanyVideosContainer>
  );
};

export default CompanyVideos;
