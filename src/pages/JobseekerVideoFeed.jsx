import React, { useContext, useState, useRef, useEffect  } from 'react';
import {
  Box,
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
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  BookmarkBorder,
  Bookmark,
  Share,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  Close,
  PlayArrow,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate ,useParams  } from 'react-router-dom';


// Mock data (keep this outside the component to avoid re-creation on every render)
const mockJobVideos = [
  {
    id: '1',
    company: 'Innovate Solutions',
    jobTitle: 'Senior React Developer',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935204/Jobseeker/wvepwzroiy6s942idqal.mp4',
    logoUrl: 'https://via.placeholder.com/48/8E44AD/FFFFFF?text=IS',
    tags: ['React', 'Node.js', 'AWS', 'Full-time'],
    description: 'Lead our next-gen web applications team. You will be responsible for designing and implementing scalable solutions, mentoring junior developers, and pushing technological boundaries.',
    location: 'Remote, USA',
    salary: '$100,000 - $140,000',
    posted: '5 days ago',
    saved: false,
    liked: false
  },
  {
    id: '2',
    company: 'Global Fintech',
    jobTitle: 'Backend Engineer (Python)',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935204/Jobseeker/mrghiax1ijujzwzg5uwg.mp4',
    logoUrl: 'https://via.placeholder.com/48/27AE60/FFFFFF?text=GF',
    tags: ['Python', 'Django', 'APIs', 'Finance'],
    description: 'Build robust and secure backend services for our financial trading platforms. Experience with high-frequency trading systems is a plus.',
    location: 'London, UK',
    salary: '£70,000 - £100,000',
    posted: '1 day ago',
    saved: false,
    liked: false
  },
  {
    id: '3',
    company: 'Creative Agency X',
    jobTitle: 'Digital Marketing Specialist',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935199/Jobseeker/yioadeex8ubryf1uy8su.mp4',
    logoUrl: 'https://via.placeholder.com/48/D35400/FFFFFF?text=CAX',
    tags: ['SEO', 'Content', 'Social Media', 'Marketing'],
    description: 'Drive online presence and lead generation for our diverse client portfolio. A passion for creative campaigns and analytics is key.',
    location: 'Berlin, Germany',
    salary: '€45,000 - €65,000',
    posted: '3 weeks ago',
    saved: false,
    liked: false
  },
  {
    id: '4',
    company: 'MediCare Tech',
    jobTitle: 'Healthcare IT Support',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935200/Jobseeker/mn3dew4rgwaaji9z23xd.mp4',
    logoUrl: 'https://via.placeholder.com/48/1ABC9C/FFFFFF?text=MC',
    tags: ['IT Support', 'Healthcare', 'Troubleshooting', 'Entry-level'],
    description: 'Provide technical assistance to healthcare professionals. Great opportunity for recent graduates looking to start their career in health tech.',
    location: 'Boston, MA',
    salary: '$40,000 - $55,000',
    posted: '4 days ago',
    saved: false,
    liked: false
  },
  {
    id: '5',
    company: 'EduLearn Platform',
    jobTitle: 'Online Course Creator',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935200/Jobseeker/fgb77awqtyrh5praep5u.mp4',
    logoUrl: 'https://via.placeholder.com/48/9B59B6/FFFFFF?text=EL',
    tags: ['Education', 'Content Development', 'E-learning'],
    description: 'Develop engaging video content and curriculum for our online learning platform. Expertise in STEM subjects preferred.',
    location: 'Remote',
    salary: '$50/hour - $80/hour',
    posted: '1 month ago',
    saved: false,
    liked: false
  },
  {
    id: '6',
    company: 'GreenEnergy Solutions',
    jobTitle: 'Renewable Energy Project Manager',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935198/Jobseeker/ghqvk7qvqipsocpet1gp.mp4',
    logoUrl: 'https://via.placeholder.com/48/2ECC71/FFFFFF?text=GE',
    tags: ['Project Management', 'Sustainability', 'Engineering'],
    description: 'Oversee renewable energy projects from conception to completion. Strong leadership and technical background required.',
    location: 'Austin, TX',
    salary: '$95,000 - $130,000',
    posted: '2 days ago',
    saved: false,
    liked: false
  },
  {
    id: '7',
    company: 'Logistics Innovations',
    jobTitle: 'Supply Chain Analyst',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935195/Jobseeker/oqzzdjldzfgd0qpratac.mp4',
    logoUrl: 'https://via.placeholder.com/48/3498DB/FFFFFF?text=LI',
    tags: ['Supply Chain', 'Analytics', 'Logistics', 'Optimization'],
    description: 'Analyze and optimize our global supply chain operations. Help us reduce costs and improve efficiency across all stages.',
    location: 'Chicago, IL',
    salary: '$70,000 - $95,000',
    posted: '1 week ago',
    saved: false,
    liked: false
  },
  {
    id: '8',
    company: 'Artisan Crafts Co.',
    jobTitle: 'E-commerce Manager',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935197/Jobseeker/vsae57raurfootdj5pvi.mp4',
    logoUrl: 'https://via.placeholder.com/48/E67E22/FFFFFF?text=AC',
    tags: ['E-commerce', 'Shopify', 'Online Sales', 'Retail'],
    description: 'Manage and grow our online store for handmade goods. Experience with digital marketing and inventory management is crucial.',
    location: 'Portland, OR',
    salary: '$60,000 - $85,000',
    posted: '3 days ago',
    saved: false,
    liked: false
  },
  {
    id: '9',
    company: 'Digital Health Hub',
    jobTitle: 'Clinical Research Coordinator',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935196/Jobseeker/h5qg3cfiszmjefiquvrm.mp4',
    logoUrl: 'https://via.placeholder.com/48/C0392B/FFFFFF?text=DHH',
    tags: ['Clinical', 'Research', 'Healthcare', 'Data Entry'],
    description: 'Support clinical trials by coordinating study activities, managing patient data, and ensuring compliance with protocols.',
    location: 'San Diego, CA',
    salary: '$55,000 - $70,000',
    posted: '2 weeks ago',
    saved: false,
    liked: false
  },
  {
    id: '10',
    company: 'Future Robotics',
    jobTitle: 'Robotics Engineer',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935194/Jobseeker/zedgzvmwlurqi4zhhluw.mp4',
    logoUrl: 'https://via.placeholder.com/48/7F8C8D/FFFFFF?text=FR',
    tags: ['Robotics', 'AI', 'Embedded Systems', 'R&D'],
    description: 'Design, develop, and test robotic systems for industrial automation. A strong background in mechatronics and control systems is ideal.',
    location: 'Silicon Valley, CA',
    salary: '$110,000 - $160,000',
    posted: '6 days ago',
    saved: false,
    liked: false
  },
  {
    id: '11',
    company: 'Smart City Solutions',
    jobTitle: 'Urban Planner',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935193/Jobseeker/wjlhdsvjbg6pwwe8heoy.mp4',
    logoUrl: 'https://via.placeholder.com/48/F39C12/FFFFFF?text=SCS',
    tags: ['Urban Planning', 'Sustainability', 'GIS', 'Community'],
    description: 'Contribute to sustainable urban development projects. Analyze spatial data, design community initiatives, and prepare reports.',
    location: 'Vancouver, Canada',
    salary: '$75,000 - $100,000',
    posted: '3 days ago',
    saved: false,
    liked: false
  },
  {
    id: '12',
    company: 'Quantum Innovations',
    jobTitle: 'Machine Learning Scientist',
    videoUrl: 'https://res.cloudinary.com/djfvfxrsh/video/upload/v1747935193/Jobseeker/ds9oofsbwgtntxt3zgxx.mp4',
    logoUrl: 'https://via.placeholder.com/48/95A5A6/FFFFFF?text=QI',
    tags: ['Machine Learning', 'Deep Learning', 'AI', 'Research'],
    description: 'Conduct cutting-edge research in machine learning and develop innovative AI solutions for complex problems.',
    location: 'Cambridge, MA',
    salary: '$120,000 - $180,000',
    posted: '4 days ago',
    saved: false,
    liked: false
  }
];

// Styled components (unchanged)
const VideoContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: '#000',
});

const StyledVideo = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const OverlayContent = styled('div')({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '16px',
  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
  color: '#fff',
  zIndex: 1,
});

const RightActionBar = styled('div')({
  position: 'absolute',
  right: '16px',
  bottom: '120px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  zIndex: 2,
});

const ActionButton = styled(IconButton)({
  color: '#fff',
  backgroundColor: 'rgba(0,0,0,0.3)',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

const ConnectButton = styled(Button)({
  position: 'absolute',
  right: '16px',
  bottom: '16px',
  zIndex: 2,
  backgroundColor: '#1976d2',
  color: '#fff',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
});

const JobDetailDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '600px',
    width: '90%',
  },
});


const JobseekerVideoFeed = () => {
  const { vid } = useParams();
  const navigate = useNavigate();

  // Initialize videos state FIRST, so it's available for initialIndex calculation
  const [videos, setVideos] = useState(mockJobVideos);

  const initialIndex = vid ? videos.findIndex(video => video.id === vid) : 0;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  const [isPlaying, setIsPlaying] = useState(false); // Start as false (paused)
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const videoRef = useRef(null);

  const currentVideo = videos[currentVideoIndex];

  // Function to attempt playing the video
  const tryPlayVideo = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.warn('Autoplay prevented:', error);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleSwipeUp = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsLoading(true);
      setIsPlaying(false);
    }
  };

  const handleSwipeDown = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setIsLoading(true);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        tryPlayVideo();
      }
    }
  };

  const toggleLike = () => {
    const updatedVideos = [...videos];
    updatedVideos[currentVideoIndex].liked = !updatedVideos[currentVideoIndex].liked;
    setVideos(updatedVideos);
  };

  const toggleSave = () => {
    const updatedVideos = [...videos];
    updatedVideos[currentVideoIndex].saved = !updatedVideos[currentVideoIndex].saved;
    setVideos(updatedVideos);
  };

  const handleVideoLoaded = () => {
    setIsLoading(false);
    tryPlayVideo();
  };

  const handleVideoError = (e) => {
    console.error('Video loading failed:', e);
    setIsLoading(false);
    setIsPlaying(false);
  };

  const handleOpenDialog = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (videoRef.current) {
      tryPlayVideo();
    }
    setOpenDialog(false);
  };

  const handleCloseFeed = () => {
    navigate(-1); // Go back to the previous page
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        handleSwipeUp();
      } else if (e.key === 'ArrowDown') {
        handleSwipeDown();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentVideoIndex, isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      setIsLoading(true);
      videoRef.current.muted = false; // Ensure video is muted for initial autoplay attempt
      videoRef.current.load(); // Load the new video source

      // After loading, the onLoadedData handler will attempt to play.
      // If it fails due to browser policy, setIsPlaying will remain false,
      // and the play button will be visible.
    }
  }, [currentVideoIndex, currentVideo.videoUrl]); // Depend on videoUrl to trigger reload

  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <VideoContainer
        onClick={togglePlay}
        onTouchStart={(e) => {
          const startY = e.touches[0].clientY;
          const handleTouchEnd = (e) => {
            const endY = e.changedTouches[0].clientY;
            if (endY < startY - 50) {
              handleSwipeUp();
            } else if (endY > startY + 50) {
              handleSwipeDown();
            }
            document.removeEventListener('touchend', handleTouchEnd);
          };
          document.addEventListener('touchend', handleTouchEnd);
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}

        <StyledVideo
          ref={videoRef}
          src={currentVideo.videoUrl}
          loop
          playsInline
          muted={false} // Explicitly set muted to true here
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          crossOrigin="anonymous"
        />

        {/* Play Icon - Only visible when not playing and not loading */}
        {!isPlaying && !isLoading && (
          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 2,
              width: '64px',
              height: '64px',
            }}
            onClick={togglePlay}
          >
            <PlayArrow fontSize="large" />
          </IconButton>
        )}

        {/* Close Button - Top Left */}
        <IconButton
          sx={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            zIndex: 3,
          }}
          onClick={handleCloseFeed}
        >
          <Close />
        </IconButton>

        {/* Overlay Content (Bottom Left) */}
        <OverlayContent>
          <Typography variant="h5" fontWeight="bold" sx={{color:"#fff",}}>
            {currentVideo.jobTitle}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 , color:"rgba(216, 220, 223, 0.5)",}}>
            {currentVideo.company}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {currentVideo.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                }}
              />
            ))}
          </Stack>
          <Typography variant="body2" sx={{ mb: 2 , color:"rgba(238, 238, 238, 0.5)",}}>
            {currentVideo.description}
          </Typography>
        </OverlayContent>

        {/* Right Action Bar (navigation arrows THEN icons) */}
        <RightActionBar>
          {/* Navigation Arrows on the right (TOP) */}
          <IconButton
            sx={{
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
              },
            }}
            onClick={handleSwipeUp}
            disabled={currentVideoIndex >= videos.length - 1}
          >
            <ArrowUpward />
          </IconButton>

          <IconButton
            sx={{
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
              },
            }}
            onClick={handleSwipeDown}
            disabled={currentVideoIndex <= 0}
          >
            <ArrowDownward />
          </IconButton>

          {/* Action Icons (BELOW arrows) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <Avatar src={currentVideo.logoUrl} sx={{ width: 48, height: 48, mb: 1 }} />
            <ActionButton onClick={toggleLike}>
              {currentVideo.liked ? (
                <Favorite sx={{ color: '#ff4081' }} />
              ) : (
                <FavoriteBorder />
              )}
            </ActionButton>
          </Box>

          <ActionButton onClick={toggleSave}>
            {currentVideo.saved ? (
              <Bookmark sx={{ color: '#ffc107' }} />
            ) : (
              <BookmarkBorder />
            )}
          </ActionButton>

          <ActionButton>
            <Share />
          </ActionButton>

          <ActionButton onClick={handleOpenDialog}>
            <MoreVert />
          </ActionButton>
        </RightActionBar>

        <ConnectButton
          variant="contained"
          size="large"
          onClick={handleOpenDialog}
        >
          Connect
        </ConnectButton>
      </VideoContainer>

      {/* Job Details Dialog */}
      <JobDetailDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Job Details</Typography>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={currentVideo.logoUrl} sx={{ width: 64, height: 64, mr: 2 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {currentVideo.jobTitle}
              </Typography>
              <Typography variant="subtitle1">{currentVideo.company}</Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              {currentVideo.description}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {currentVideo.tags.map((tag, index) => (
              <Chip key={index} label={tag} color="primary" variant="outlined" />
            ))}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Location
            </Typography>
            <Typography variant="body1">{currentVideo.location}</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Salary Range
            </Typography>
            <Typography variant="body1">{currentVideo.salary}</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Posted
            </Typography>
            <Typography variant="body1">{currentVideo.posted}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={handleCloseDialog}>
              Close
            </Button>
            <Button variant="contained" color="primary">
              Apply Now
            </Button>
          </Box>
        </DialogContent>
      </JobDetailDialog>
    </Box>
  );
};

export default JobseekerVideoFeed;