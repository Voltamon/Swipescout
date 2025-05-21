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
    useTheme,
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
// import { getCompanyVideos } from '../services/companyService'; // Assuming this service exists

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
  const [activeIndustry, setActiveIndustry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [industries, setIndustries] = useState([
    { id: "all", name: "All Companies", icon: <BusinessIcon /> },
    { id: "tech", name: "Information Technology", icon: <BusinessIcon /> },
    { id: "finance", name: "Finance and Banking", icon: <BusinessIcon /> },
    { id: "healthcare", name: "Healthcare", icon: <BusinessIcon /> },
    { id: "education", name: "Education", icon: <BusinessIcon /> },
    { id: "retail", name: "Retail", icon: <BusinessIcon /> }
  ]);

  useEffect(
    () => {
      const fetchCompanyVideos = async () => {
        try {
          setLoading(true);
          // const response = await getCompanyVideos({
          //   industry: activeIndustry !== 'all' ? activeIndustry : undefined,
          //   search: searchQuery || undefined
          // });
          // setVideos(response.data.videos);

          // Placeholder data for demonstration
          setVideos([
            {
              id: "1",
              title: "Life at Tech Innovations",
              company: {
                id: "c1",
                name: "Tech Innovations Inc.",
                logo_url: "/placeholder-logo.png",
                location: "New York, USA",
                industry: "Information Technology",
                size: "100-500",
                website: "techinnovations.com",
                description: "A great place to work!"
              },
              thumbnail_url: "/placeholder-thumbnail.jpg",
              video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
            },
            {
              id: "2",
              title: "Working at Global Marketing",
              company: {
                id: "c2",
                name: "Global Marketing Ltd.",
                logo_url: "/placeholder-logo.png",
                location: "London, UK",
                industry: "Marketing",
                size: "50-200",
                website: "globalmarketing.co.uk",
                description: "Join our dynamic team."
              },
              thumbnail_url: "/placeholder-thumbnail.jpg",
              video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
            },
            {
              id: "3",
              title: "Inside Creative Solutions",
              company: {
                id: "c3",
                name: "Creative Solutions Co.",
                logo_url: "/placeholder-logo.png",
                location: "San Francisco, USA",
                industry: "Design",
                size: "20-100",
                website: "creativesolutions.io",
                description: "Innovate with us."
              },
              thumbnail_url: "/placeholder-thumbnail.jpg",
              video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
            },
            {
              id: "4",
              title: "Careers at Alpha Finance",
              company: {
                id: "c4",
                name: "Alpha Finance Group",
                logo_url: "/placeholder-logo.png",
                location: "Chicago, USA",
                industry: "Finance",
                size: "500+",
                website: "alphafinance.com",
                description: "Build your financial career."
              },
              thumbnail_url: "/placeholder-thumbnail.jpg",
              video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
            },
            {
              id: "5",
              title: "Our Culture at People First",
              company: {
                id: "c5",
                name: "People First Corp.",
                logo_url: "/placeholder-logo.png",
                location: "Berlin, Germany",
                industry: "Human Resources",
                size: "100-300",
                website: "peoplefirst.de",
                description: "People are our priority."
              },
              thumbnail_url: "/placeholder-thumbnail.jpg",
              video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
            },
            {
              id: "6",
              title: "A Day at Web Wizards",
              company: {
                id: "c6",
                name: "Web Wizards Inc.",
                logo_url: "/placeholder-logo.png",
                location: "Los Angeles, USA",
                industry: "Information Technology",
                size: "50-150",
                website: "webwizards.com",
                description: "Crafting the web, one line at a time."
              },
              thumbnail_url: "/placeholder-thumbnail.jpg",
              video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
          ]);
        } catch (error) {
          console.error("Error fetching company videos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCompanyVideos();
    },
    [activeIndustry, searchQuery]
  );

  const handleIndustryClick = industryId => {
    setActiveIndustry(industryId);
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const handleVideoClick = video => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const filteredVideos = videos.filter(
    video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
    const theme = useTheme(); // Get current theme
  

  return (
    <CompanyVideosContainer sx={{  background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%), url('/backgrounds/bkg1.png')`,
    backgroundSize: 'auto',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top right',
    padding: theme.spacing(2),
    
    mt: 2,
    paddingBottom: 4,
}}>
      <Box
        sx={{
          display: "flex",
          mb: 3,
          justifyContent: "space-between",
          alignItems: "center",
          
   
        }}
      >
        <Typography variant="h4">Company Videos</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder="Search for companies..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
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
                Industries
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List disablePadding>
                {industries.map(industry =>
                  <ListItem key={industry.id} disablePadding disableGutters>
                    <SidebarButton
                      fullWidth
                      active={activeIndustry === industry.id}
                      onClick={() => handleIndustryClick(industry.id)}
                      startIcon={industry.icon}
                    >
                      {industry.name}
                    </SidebarButton>
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Popular Companies
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <IndustryChip
                  label="Telecom Company"
                  onClick={() => setSearchQuery("Telecom Company")}
                />
                <IndustryChip
                  label="Riyadh Bank"
                  onClick={() => setSearchQuery("Riyadh Bank")}
                />
                <IndustryChip
                  label="Aramco"
                  onClick={() => setSearchQuery("Aramco")}
                />
                <IndustryChip
                  label="Microsoft"
                  onClick={() => setSearchQuery("Microsoft")}
                />
                <IndustryChip
                  label="Google"
                  onClick={() => setSearchQuery("Google")}
                />
                <IndustryChip
                  label="Amazon"
                  onClick={() => setSearchQuery("Amazon")}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          {loading
            ? <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress />
              </Box>
            : filteredVideos.length === 0
              ? <Box sx={{ textAlign: "center", p: 5 }}>
                  <Typography variant="h6" color="textSecondary">
                    No company videos found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    Try changing your search or filter criteria
                  </Typography>
                </Box>
              : <Grid container spacing={3}>
                  {filteredVideos.map(video =>
                    <Grid item xs={12} sm={6} md={4} key={video.id}>
                      <VideoCard onClick={() => handleVideoClick(video)}>
                        <VideoCardMedia
                          image={
                            video.thumbnail_url || "/placeholder-thumbnail.jpg"
                          }
                          title={video.title}
                        >
                          <PlayButton aria-label="play">
                            <PlayArrowIcon fontSize="large" />
                          </PlayButton>
                        </VideoCardMedia>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1
                            }}
                          >
                            <Avatar
                              src={video.company.logo_url}
                              sx={{ width: 32, height: 32, mr: 1 }}
                            />
                            <Typography variant="h6" noWrap>
                              {video.company.name}
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            color="textSecondary"
                            noWrap
                          >
                            {video.title}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1
                            }}
                          >
                            <LocationOnIcon
                              fontSize="small"
                              color="action"
                              sx={{ mr: 0.5 }}
                            />
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              noWrap
                            >
                              {video.company.location || "Not specified"}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1
                            }}
                          >
                            <BusinessIcon
                              fontSize="small"
                              color="action"
                              sx={{ mr: 0.5 }}
                            />
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              noWrap
                            >
                              {video.company.industry || "Not specified"}
                            </Typography>
                          </Box>
                        </CardContent>
                      </VideoCard>
                    </Grid>
                  )}
                </Grid>}
        </Grid>
      </Grid>

      {/* Video Player Modal */}
      {selectedVideo &&
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            p: 3
          }}
          onClick={handleCloseVideo}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 900,
              maxHeight: "80vh",
              position: "relative",
              backgroundColor: "black",
              borderRadius: 1,
              overflow: "hidden"
            }}
            onClick={e => e.stopPropagation()}
          >
            <Box
              component="video"
              sx={{
                width: "100%",
                maxHeight: "70vh"
              }}
              controls
              autoPlay
              src={selectedVideo.video_url}
            />

            <Box sx={{ p: 2, backgroundColor: "white" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  src={selectedVideo.company.logo_url}
                  sx={{ width: 40, height: 40, mr: 1 }}
                />
                <Box>
                  <Typography variant="h6">
                    {selectedVideo.company.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedVideo.title}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body2">
                      {selectedVideo.company.location || "Not specified"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <BusinessIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body2">
                      {selectedVideo.company.industry || "Not specified"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PeopleIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body2">
                      {selectedVideo.company.size || "Not specified"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LanguageIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body2">
                      {selectedVideo.company.website || "Not specified"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {selectedVideo.company.description &&
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    {selectedVideo.company.description}
                  </Typography>
                </Box>}

              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" fullWidth>
                  View Company Jobs
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>}

      {/* Filter Drawer */}
      <FilterDrawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={toggleFilterDrawer}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filter Companies
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Company Size
          </Typography>
          <List>
            <ListItem button>
              <ListItemText primary="Startup (1-50)" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Small (51-200)" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Medium (201-1000)" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Large (1000+)" />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Location
          </Typography>
          <List>
            <ListItem button>
              <ListItemText primary="Riyadh" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Jeddah" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Dammam" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Other" />
            </ListItem>
          </List>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={toggleFilterDrawer}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleFilterDrawer}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </FilterDrawer>
    </CompanyVideosContainer>
  );
};

export default CompanyVideos;