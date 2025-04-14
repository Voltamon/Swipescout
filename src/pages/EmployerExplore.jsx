import React, { useState, useRef } from 'react';
import {
  Box,
  Grid,
  IconButton,
  Typography,
  Chip,
  Stack,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Paper,
  Rating,
  Divider
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import {
  Search,
  FilterList,
  BookmarkBorder,
  Bookmark,
  MoreVert,
  PlayArrow,
  Pause,
  School,
  WorkHistory,
  Code,
  Language,
  Star
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  shadows: Array(25).fill('none') // Ensures all shadow levels exist
});


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
const mockCandidateVideos = [
  {
    id: '1',
    name: 'Alex Johnson',
    jobTitle: 'Frontend Developer',
    videoUrl: 'public/videos/vid2.mkv',
    profilePic: 'src/public/logo.jpg',
    skills: ['React', 'TypeScript', 'UI/UX'],
    experience: '3 years',
    education: 'Computer Science, Stanford',
    rating: 4.5,
    location: 'San Francisco, CA',
    languages: ['English', 'Spanish'],
    saved: false
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

const EmployerExplore = () => {
  const [candidates, setCandidates] = useState(mockCandidateVideos);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef({});

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenDialog(true);
  };

  const togglePlay = (candidateId, event) => {
    event.stopPropagation();
    if (playingVideo === candidateId) {
      videoRefs.current[candidateId].pause();
      setPlayingVideo(null);
    } else {
      if (playingVideo) {
        videoRefs.current[playingVideo].pause();
      }
      videoRefs.current[candidateId].play();
      setPlayingVideo(candidateId);
    }
  };

  const toggleSave = (candidateId, event) => {
    event.stopPropagation();
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId ? { ...candidate, saved: !candidate.saved } : candidate
    ));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // In a real app, you would filter candidates based on the tab
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Discover Talent
        </Typography>
        <Typography color="text.secondary">
          Find candidates that match your job requirements
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search candidates, skills, or roles"
          variant="outlined"
          size="small"
          sx={{ width: '50%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outlined" startIcon={<FilterList />}>
          Filters
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Recommended" />
        <Tab label="Recent" />
        <Tab label="Saved" />
        <Tab label="Local" />
      </Tabs>

      <Grid container spacing={3}>
        {filteredCandidates.map((candidate) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={candidate.id}>
            <VideoCard onClick={() => handleCandidateClick(candidate)}>
              <VideoPlayer
                ref={(el) => (videoRefs.current[candidate.id] = el)}
                src={candidate.videoUrl}
                loop
                muted
                playsInline
                onClick={(e) => e.stopPropagation()}
              />
              
              {playingVideo !== candidate.id && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#fff',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)',
                    },
                  }}
                  onClick={(e) => togglePlay(candidate.id, e)}
                >
                  <PlayArrow fontSize="large" />
                </IconButton>
              )}
              
              <VideoOverlay>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {candidate.name}
                    </Typography>
                    <Typography variant="body2">{candidate.jobTitle}</Typography>
                  </Box>
                  <Avatar src={candidate.profilePic} sx={{ width: 40, height: 40 }} />
                </Box>
                
                <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1 }}>
                  {candidate.skills.slice(0, 2).map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                  ))}
                </Stack>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Rating
                    value={candidate.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                    emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => toggleSave(candidate.id, e)}
                    sx={{ color: candidate.saved ? '#ffc107' : '#fff' }}
                  >
                    {candidate.saved ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Box>
              </VideoOverlay>
            </VideoCard>
          </Grid>
        ))}
      </Grid>

      {/* Candidate Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Candidate Profile</Typography>
          <IconButton onClick={() => setOpenDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCandidate && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <VideoPlayer
                  autoPlay
                  controls
                  src={selectedCandidate.videoUrl}
                  style={{ width: '100%', borderRadius: '8px' }}
                />
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>Skills</Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    {selectedCandidate.skills.map((skill, index) => (
                      <Chip key={index} label={skill} color="primary" />
                    ))}
                  </Stack>
                </Box>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar src={selectedCandidate.profilePic} sx={{ width: 80, height: 80, mr: 3 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {selectedCandidate.name}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {selectedCandidate.jobTitle}
                    </Typography>
                    <Rating
                      value={selectedCandidate.rating}
                      precision={0.5}
                      readOnly
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkHistory color="primary" />
                      <Typography>{selectedCandidate.experience} experience</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn color="primary" />
                      <Typography>{selectedCandidate.location}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <School color="primary" />
                      <Typography>{selectedCandidate.education}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Language color="primary" />
                      <Typography>{selectedCandidate.languages.join(', ')}</Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>About</Typography>
                  <Typography>
                    Experienced frontend developer with a passion for creating intuitive user interfaces.
                    Specialized in React and TypeScript with a strong focus on performance and accessibility.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Experience</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography fontWeight="bold">Senior Frontend Developer</Typography>
                    <Typography color="text.secondary">TechCorp • 2020-Present</Typography>
                    <Typography>
                      - Led the migration from Angular to React<br />
                      - Improved page load performance by 40%<br />
                      - Mentored junior developers
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    Connect
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                  >
                    Shortlist
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EmployerExplore;