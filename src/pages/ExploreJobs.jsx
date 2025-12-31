import i18n from 'i18next';
import React, { useContext, useState, useRef, useEffect  } from 'react';
import {
  Box,
  Grid,
  IconButton,
  Typography,
  Chip,
  Stack,
  Avatar,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Paper,
  useTheme
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import {
  Search,
  FilterList,
  FavoriteBorder,
  Favorite,
  BookmarkBorder,
  Bookmark,
  Share,
  MoreVert,
  PlayArrow,
  Pause,
  LocationOn,
  Business,
  Work,
  AttachMoney,
  Schedule
} from '@mui/icons-material';
import { styled } from '@mui/system';

const VideoOverlay = styled('div')({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    color: '#fff',
  });

// Mock data - replace with API calls
const mockJobVideos = [
  {
    id: '1',
    company: 'TechCorp',
    jobTitle: 'Frontend Developer',
    videoUrl: 'public/videos/vid2.mkv',
    logoUrl: 'src/public/logo.jpg',
    tags: ['React', 'JavaScript', 'Remote'],
    description: 'Join our team to build amazing user experiences with React and modern frontend technologies.',
    location: 'San Francisco, CA',
    salary: '$90,000 - $120,000',
    employmentType: 'Full-time',
    posted: '2 days ago',
    saved: false,
    liked: false
  },
  // Add more mock data
];

const VideoCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px',
  overflow: 'hidden',
  height: '300px',
  backgroundColor: '#000',
  cursor: 'pointer',
   transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)' // MUI shadow 4 equivalent
  }
}));

const VideoPlayer = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});




const JobSeekerExplore = () => {
  const [videos, setVideos] = useState(mockJobVideos);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef({});

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setOpenDialog(true);
  };

  const togglePlay = (videoId, event) => {
    event.stopPropagation();
    if (playingVideo === videoId) {
      videoRefs.current[videoId].pause();
      setPlayingVideo(null);
    } else {
      if (playingVideo) {
        videoRefs.current[playingVideo].pause();
      }
      videoRefs.current[videoId].play();
      setPlayingVideo(videoId);
    }
  };

  const toggleLike = (videoId, event) => {
    event.stopPropagation();
    setVideos(videos.map(video => 
      video.id === videoId ? { ...video, liked: !video.liked } : video
    ));
  };

  const toggleSave = (videoId, event) => {
    event.stopPropagation();
    setVideos(videos.map(video => 
      video.id === videoId ? { ...video, saved: !video.saved } : video
    ));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // In a real app, you would filter videos based on the tab
  };

  const filteredVideos = videos.filter(video =>
    video.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

    const theme = useTheme(); // Get current theme

  return <Box sx={{ p: 3,
        //backgroundclr
        backgroundSize: "auto", backgroundRepeat: "no-repeat", backgroundPosition: "top right", padding: theme.spacing(2), height: "100vh", mt: 2, mb: 0, paddingBottom: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>{i18n.t('auto_explore_jobs')}</Typography>
        <Typography color="text.secondary">{i18n.t('auto_discover_opportunities_that_match_your_s')}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField placeholder={i18n.t('auto_search_jobs_companies_or_skills')}  variant="outlined" size="small" sx={{ width: "50%" }} InputProps={{ startAdornment: <InputAdornment position="start">
                <Search />
              </InputAdornment> }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <Button variant="outlined" startIcon={<FilterList />}>{i18n.t('auto_filters')}</Button>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={i18n.t('auto_recommended')}  />
        <Tab label={i18n.t('auto_recent')}  />
        <Tab label={i18n.t('auto_remote')}  />
        <Tab label={i18n.t('auto_saved')}  />
      </Tabs>

      <Grid container spacing={3}>
        {filteredVideos.map(video =>
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <VideoCard onClick={() => handleVideoClick(video)}>
              <VideoPlayer
                ref={el => (videoRefs.current[video.id] = el)}
                src={video.videoUrl}
                loop
                muted
                playsInline
                onClick={e => e.stopPropagation()}
              />

              {playingVideo !== video.id &&
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#fff",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.7)"
                    }
                  }}
                  onClick={e => togglePlay(video.id, e)}
                >
                  <PlayArrow fontSize="large" />
                </IconButton>}

              <VideoOverlay>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {video.jobTitle}
                    </Typography>
                    <Typography variant="body2">
                      {video.company}
                    </Typography>
                  </Box>
                  <Avatar
                    src={video.logoUrl}
                    sx={{ width: 40, height: 40 }}
                  />
                </Box>

                <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1 }}>
                  {video.tags.slice(0, 2).map((tag, index) =>
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        backdropFilter: "blur(10px)"
                      }}
                    />
                  )}
                </Stack>

                <Box
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={e => toggleLike(video.id, e)}
                      sx={{ color: video.liked ? "#ff4081" : "#fff" }}
                    >
                      {video.liked ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={e => toggleSave(video.id, e)}
                      sx={{ color: video.saved ? "#ffc107" : "#fff" }}
                    >
                      {video.saved ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Box>
                  <Typography variant="caption">
                    {video.posted}
                  </Typography>
                </Box>
              </VideoOverlay>
            </VideoCard>
          </Grid>
        )}
      </Grid>

      {/* Job Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">{i18n.t('auto_job_details')}</Typography>
          <IconButton onClick={() => setOpenDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedVideo && <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <VideoPlayer autoPlay controls src={selectedVideo.videoUrl} style={{ width: "100%", borderRadius: "8px" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar src={selectedVideo.logoUrl} sx={{ width: 64, height: 64, mr: 2 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedVideo.jobTitle}
                    </Typography>
                    <Typography variant="subtitle1">
                      {selectedVideo.company}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  {selectedVideo.tags.map((tag, index) =>
                    <Chip
                      key={index}
                      label={tag}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Typography variant="body1" paragraph>
                  {selectedVideo.description}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOn color="primary" />
                      <Typography>
                        {selectedVideo.location}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachMoney color="primary" />
                      <Typography>
                        {selectedVideo.salary}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Work color="primary" />
                      <Typography>
                        {selectedVideo.employmentType}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Schedule color="primary" />
                      <Typography>
                        {selectedVideo.posted}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button variant="contained" color="primary" size="large" fullWidth>{i18n.t('auto_apply_now')}</Button>
                  <Button variant="outlined" size="large" fullWidth>{i18n.t('auto_save_for_later')}</Button>
                </Box>
              </Box>
            </Box>}
        </DialogContent>
      </Dialog>
    </Box>;
};

export default JobSeekerExplore;