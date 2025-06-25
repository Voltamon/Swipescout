import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Grid, Card, CardMedia, Typography, Button, CircularProgress, Box,
  IconButton, Pagination, AppBar, Toolbar, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { PlayArrow, VolumeUp, VolumeOff, Search as SearchIcon, Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
// Assume api calls are defined as in your AllVideosPage.jsx
import { getAllVideos, getEmployerPublicVideos, getJobSeekersVideos } from '../services/api';
import { useAuth } from '../hooks/useAuth'; // Assuming useAuth provides user and role
import SwipeScoutWatermark from "../components/SwipeScoutWatermark"; // Corrected path
import Footer2 from "../components/Footer2/Footer2"; // Corrected path
import { red } from '@mui/material/colors';

// Mock API calls and useAuth for standalone example
const mockVideos = [
  { id: '1', video_url: 'https://cdn.pixabay.com/video/2021/08/04/81442-56214387a55ad7d72745330e7195e5b7.mp4', video_title: 'Software Engineer Role', video_type: 'Job Post', video_duration: 35, status: 'completed' },
  { id: '2', video_url: 'https://cdn.pixabay.com/video/2023/12/12/191539-894738595_large.mp4', video_title: 'My UX Design Portfolio', video_type: 'Resume', video_duration: 40, status: 'completed' },
  { id: '3', video_url: 'https://cdn.pixabay.com/video/2024/02/20/203496-913401777_large.mp4', video_title: 'Hiring Marketing Lead', video_type: 'Job Post', video_duration: 28, status: 'completed' },
  { id: '4', video_url: 'https://cdn.pixabay.com/video/2023/07/04/172605-840616149_small.mp4', video_title: 'Data Scientist Intro', video_type: 'Resume', video_duration: 45, status: 'completed' },
  { id: '5', video_url: 'https://cdn.pixabay.com/video/2024/01/21/200557-900592867_small.mp4', video_title: 'Life at TechCorp', video_type: 'Company', video_duration: 50, status: 'completed' },
  { id: '6', video_url: 'https://cdn.pixabay.com/video/2024/04/23/210515-927161877_small.mp4', video_title: 'Seeking Junior Developer', video_type: 'Job Post', video_duration: 30, status: 'completed' },
  { id: '7', video_url: 'https://cdn.pixabay.com/video/2023/11/06/186591-884949575_small.mp4', video_title: 'My Sales Pitch', video_type: 'Resume', video_duration: 38, status: 'completed' },
  { id: '8', video_url: 'https://cdn.pixabay.com/video/2024/02/09/202538-909282375_large.mp4', video_title: 'Future of AI', video_type: 'Company', video_duration: 55, status: 'completed' },
  { id: '9', video_url: 'https://cdn.pixabay.com/video/2024/06/13/217983-941913985_small.mp4', video_title: 'React Dev Available', video_type: 'Resume', video_duration: 32, status: 'completed' },
  { id: '10', video_url: 'https://cdn.pixabay.com/video/2024/06/18/218561-943063518_small.mp4', video_title: 'HR Manager Opening', video_type: 'Job Post', video_duration: 42, status: 'completed' },
];

const mockGetAllVideos = async (page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedVideos = mockVideos.slice(startIndex, endIndex);
  return {
    data: {
      videos: paginatedVideos,
      totalPages: Math.ceil(mockVideos.length / limit),
      uploadLimitReached: false,
    }
  };
};

const mockUseAuth = () => {
  const [user, setUser] = useState(null); // null means not logged in
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const storedUser = localStorage.getItem('swipescout_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (role) => {
    const newUser = { id: 'user123', name: 'Guest User', role: role };
    localStorage.setItem('swipescout_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('swipescout_user');
    setUser(null);
  };

  return { user, loading, login, logout };
};

// Custom Theme for bright colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF4081', // Bright Pink
    },
    secondary: {
      main: '#40C4FF', // Bright Blue
    },
    success: {
      main: '#76FF03', // Bright Green
    },
    error: {
      main: '#FF1744', // Bright Red
    },
    warning: {
      main: '#FFEA00', // Bright Yellow
    },
    info: {
      main: '#2979FF', // Bright Indigo
    },
    background: {
      default: '#F5F5F5', // Light Grey background for overall page
      paper: '#FFFFFF', // White for cards/components
    },
    text: {
      primary: '#212121', // Dark grey for general text
      secondary: '#757575', // Medium grey for secondary text
      white: '#FFFFFF', // White text for contrasts
    },
    accent: { // Custom accent colors
      pink: '#FF4081',
      blue: '#40C4FF',
      green: '#76FF03',
      yellow: '#FFEA00',
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: {
      fontWeight: 700,
      color: '#212121',
    },
    h5: {
      fontWeight: 600,
      color: '#212121',
    },
    h6: {
      fontWeight: 600,
      color: '#212121',
    },
    body1: {
      color: '#424242',
    },
    body2: {
      color: '#616161',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #FF4081 30%, #FF8A80 90%)', // Pink gradient
          color: 'white',
        },
        outlinedPrimary: {
          borderColor: '#FF4081',
          color: '#FF4081',
          '&:hover': {
            backgroundColor: 'rgba(255, 64, 129, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #FF4081 0%, #40C4FF 100%)', // Pink to Blue gradient
          boxShadow: 'none',
        },
      },
    },
  },
});

const StatusBorder = styled('div')(({ status, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '8px',
  border: `8px solid ${status === 'processing' ? theme.palette.info.main : theme.palette.error.main}`,
  background: 'transparent',
  zIndex: 2,
  pointerEvents: 'none',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { opacity: 0.9 },
    '50%': { opacity: 0.5 },
    '100%': { opacity: 0.9 },
  },
}));

const StyledHeader = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #FF4081 0%, #40C4FF 100%)', // Bright pink to blue gradient
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  color: 'white',
  padding: theme.spacing(1, 0),
  zIndex: theme.zIndex.drawer + 1,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontWeight: 600,
  fontSize: '1rem',
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '8px',
  },
  transition: 'background-color 0.3s ease',
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #FF8A80 0%, #80D8FF 100%)', // Softer pink to blue for filter bar
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
}));

const SwipescoutStartingPage = () => {
  const [serverVideos, setServerVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'jobseeker', 'employer', 'company'

  const videoRefs = useRef({});
  const navigate = useNavigate();
  const { user, loading: authLoading, login, logout } = mockUseAuth(); // Use mockUseAuth for user status

  const VIDEOS_PER_PAGE = 9;

  const toggleMute = (e, videoId) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
    const videoEl = videoRefs.current[videoId];
    if (videoEl) {
      videoEl.muted = !isMuted;
    }
  };

  const fetchServerVideos = async (pageNum, typeFilter) => {
    try {
      setLoading(true);
      let response;
      if (typeFilter === 'all') {
        response = await mockGetAllVideos(pageNum, VIDEOS_PER_PAGE);
      } else if (typeFilter === 'jobseeker') {
        response = await mockGetAllVideos(pageNum, VIDEOS_PER_PAGE);
        response.data.videos = response.data.videos.filter(v => v.video_type === 'Resume');
      } else if (typeFilter === 'employer') {
        response = await mockGetAllVideos(pageNum, VIDEOS_PER_PAGE);
        response.data.videos = response.data.videos.filter(v => v.video_type === 'Job Post');
      } else if (typeFilter === 'company') {
        response = await mockGetAllVideos(pageNum, VIDEOS_PER_PAGE);
        response.data.videos = response.data.videos.filter(v => v.video_type === 'Company');
      }

      setServerVideos(response.data.videos);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerVideos(page, filterType);
  }, [page, filterType]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const handleVideoHover = (videoId, isHovering) => {
    if (isHovering) {
      setHoveredVideo(videoId);
      const videoEl = videoRefs.current[videoId];
      if (videoEl) {
        videoEl.currentTime = 0;
        videoEl.muted = isMuted;
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

  const handleVideoClick = (video) => {
    // Navigate to a dedicated video player page, maybe /video-player/:id
    navigate(`/video-player/${video.id}`, { state: { currentVideo: video } });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
        {/* Header */}
        <StyledHeader position="sticky">
          <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'white' }}>
              SwipeScout
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <NavButton component={Link} to="/about">About Us</NavButton>
              <NavButton component={Link} to="/FAQs">FAQs</NavButton>
              {user ? (
                // User is logged in, show dashboard link
                <NavButton component={Link} to={user.role === 'employer' ? '/employer-dashboard' : '/dashboard'}>
                  <AccountCircle sx={{ mr: 1 }} /> Dashboard
                </NavButton>
              ) : (
                // User is not logged in, show login/signup
                <>
                  <NavButton component={Link} to="/login">Log In</NavButton>
                  <Button variant="contained" color="secondary" component={Link} to="/register"
                    sx={{
                      ml: 2,
                      background: 'linear-gradient(45deg, #40C4FF 30%, #80D8FF 90%)', // Blue gradient
                      '&:hover': {
                        background: 'linear-gradient(45deg, #80D8FF 30%, #40C4FF 90%)',
                      },
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </StyledHeader>

        <Container maxWidth={false} sx={{
          flexGrow: 1,
          background: `linear-gradient(135deg, ${theme.palette.secondary.light} 10%, ${theme.palette.accent.blue} 60%), url('/backgrounds/abstract-bg.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: "center center",
          backgroundSize: 'cover',
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 5,
          pb: 5,
          px: { xs: 2, md: 4 },
        }}>
          <SwipeScoutWatermark />

          <Box sx={{ textAlign: 'center', mb: 4, width: '100%', maxWidth: '800px', p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.white, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              Discover Talent. Find Your Next Opportunity.
            </Typography>
            <Typography variant="h6" sx={{ color: theme.palette.text.white, mb: 3, opacity: 0.9 }}>
              Connect with video resumes and job postings that speak volumes.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to={user ? (user.role === 'employer' ? '/video-upload' : '/video-upload') : '/register'} // Direct to upload/register
              sx={{
                mr: 2,
                background: 'linear-gradient(45deg, #FF4081 30%, #FF8A80 90%)', // Bright pink gradient
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8A80 30%, #FF4081 90%)',
                },
              }}
            >
              Upload Your Video
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              component={Link}
              to={user ? (user.role === 'employer' ? '/Post-job-page' : '/Job-seeker-explore') : '/register'} // Direct to post job/find jobs/register
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderColor: 'white',
                },
              }}
            >
              Explore Opportunities
            </Button>
          </Box>

          <FilterContainer>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="video-type-filter-label" sx={{ color: 'white' }}>Filter By</InputLabel>
              <Select
                labelId="video-type-filter-label"
                id="video-type-filter"
                value={filterType}
                label="Filter By"
                onChange={handleFilterChange}
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.light,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.light,
                  },
                  '.MuiSvgIcon-root': {
                    color: 'white',
                  },
                  '.MuiMenuItem-root': { // Targeting individual menu items
                    color: theme.palette.text.primary, // Dark text for options
                  },
                  '.MuiSelect-select': { // Ensures the selected value itself is white
                    color: 'white',
                  }
                }}
              >
                <MenuItem value="all">All Videos</MenuItem>
                <MenuItem value="jobseeker">Job Seeker Resumes</MenuItem>
                <MenuItem value="employer">Employer Job Posts</MenuItem>
                <MenuItem value="company">Company Profiles</MenuItem>
              </Select>
            </FormControl>
          </FilterContainer>

          {error && (
            <Box sx={{ color: theme.palette.error.main, mb: 3, textAlign: 'center' }}>
              <Typography variant="body1">{error}</Typography>
            </Box>
          )}

          {loading && page === 1 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress sx={{ color: theme.palette.primary.main }} />
            </Box>
          ) : serverVideos.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.white }}>
                No videos found matching your criteria.
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={4} sx={{ justifyContent: 'center', maxWidth: '1200px' }}>
                {serverVideos.map((video) => (
                  <Grid item key={video.id} xs={12} sm={6} md={4} lg={3}>
                    <Card
                      sx={{
                        width: '300px',
                        maxWidth: '100%',
                        borderRadius: 3, // More rounded corners
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)', // Stronger shadow
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.03)', // Slightly larger scale on hover
                          boxShadow: '0 15px 40px rgba(0,0,0,0.25)', // More pronounced shadow on hover
                        },
                        position: 'relative',
                        overflow: 'hidden',
                        aspectRatio: "9/16", // Vertical aspect ratio like TikTok
                        backgroundColor: theme.palette.background.paper,
                      }}
                      onMouseEnter={() => handleVideoHover(video.id, true)}
                      onMouseLeave={() => handleVideoHover(video.id, false)}
                      onClick={() => handleVideoClick(video)}
                    >
                      {(video.status === 'processing') && (
                        <StatusBorder status={video.status} theme={theme} />
                      )}

                      <CardMedia
                        component="div"
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#000',
                          cursor: 'pointer'
                        }}
                      >
                        {video.video_url && (
                          <video
                            ref={el => videoRefs.current[video.id] = el}
                            src={video.video_url}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                            muted={isMuted}
                            loop
                            playsInline
                            disablePictureInPicture
                            controlsList="nodownload"
                          />
                        )}

                        <Box
                          className="play-icon-overlay"
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "#fff",
                            bgcolor: theme.palette.primary.main, // Bright pink play icon
                            borderRadius: "50%",
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: hoveredVideo === video.id ? 0 : 1,
                            transition: "opacity 0.3s",
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                          }}
                        >
                          <PlayArrow fontSize="large" />
                        </Box>

                        <IconButton
                          onClick={(e) => toggleMute(e, video.id)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 2,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.7)',
                            },
                          }}
                        >
                          {isMuted ? <VolumeOff /> : <VolumeUp />}
                        </IconButton>

                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 2,
                            color: 'white',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', // Darker gradient for text readability
                            zIndex: 1,
                          }}
                        >
                          <Typography variant="subtitle1" noWrap sx={{ color: 'white', fontWeight: 600 }}>
                            {video.video_title || 'Untitled Video'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {video.video_type || 'Uncategorized'} • {Math.round(video.video_duration || 0)}s
                          </Typography>
                        </Box>
                      </CardMedia>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: 'white',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.4)',
                        },
                      },
                      '& .Mui-selected': {
                        backgroundColor: 'rgba(255,255,255,0.6)',
                        fontWeight: 'bold',
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
        <Footer2 />
      </Box>
    </ThemeProvider>
  );
};

export default SwipescoutStartingPage;