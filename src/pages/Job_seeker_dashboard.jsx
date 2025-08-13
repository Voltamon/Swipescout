import React from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  Grid,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';

// Mock data for video job feed with professional video examples
const mockJobVideos = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Google",
    location: "Remote",
    salary: "$120K - $150K",
    videoUrl: "https://www.youtube.com/embed/Sz4U-4ZbukM?autoplay=1&mute=1", // Corporate Overview Video
    description: "Join our dynamic team to build cutting-edge web applications using React and TypeScript. We are looking for passionate developers who thrive in a fast-paced environment.",
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "Netflix",
    location: "Los Angeles, CA",
    salary: "$130K - $150K",
    videoUrl: "https://www.youtube.com/embed/z2fQciTa7SM?autoplay=1&mute=1", // Corporate Video Examples
    description: "Analyze large datasets to extract actionable insights and build predictive models. Experience with Python, R, and machine learning frameworks is a plus.",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Adobe",
    location: "San Jose, CA",
    salary: "$100K - $130K",
    videoUrl: "https://www.youtube.com/embed/h1W-Suf2ao0?autoplay=1&mute=1", // Corporate Overview by Top Brands
    description: "Design intuitive and engaging user experiences for our next generation of creative tools. A strong portfolio demonstrating your design process is required.",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Spotify",
    location: "New York, NY",
    salary: "$110K - $140K",
    videoUrl: "https://www.youtube.com/embed/uTE5MKwUz0A?autoplay=1&mute=1", // Construction Company Corporate Video
    description: "Lead the development of new features for our music streaming platform. You'll work closely with engineering, design, and marketing teams to bring products to life.",
  },
];

// VideoCard component for the swipeable feed
const VideoCard = ({ job, theme, isMobile }) => (
  <Card
    sx={{
      borderRadius: theme.shape.borderRadius * 2, // More rounded for video cards
      boxShadow: theme.shadows[4], // Stronger shadow
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[6],
      },
      display: 'flex',
      flexDirection: 'column',
      height: '100%', // Ensure cards take full height in grid
      backgroundColor: theme.palette.background.paper,
      overflow: 'hidden', // Hide overflow for rounded corners
    }}
  >
    <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
      <iframe
        src={job.videoUrl}
        title={job.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: theme.shape.borderRadius * 2 }}
      ></iframe>
    </Box>
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 0.5, color: theme.palette.text.primary }}>
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {job.company} • {job.location} • {job.salary}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
          {job.description.substring(0, isMobile ? 80 : 120)}... {/* Truncate description */}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{
          mt: 'auto', // Push button to the bottom
          borderRadius: theme.shape.borderRadius,
          fontWeight: 600,
          py: 1,
          px: 2,
          boxShadow: theme.shadows[2],
          '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-1px)',
          },
        }}
      >
        Apply Now
      </Button>
    </CardContent>
  </Card>
);


function JobSeekerDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Mock user data for display
  const userName = user?.displayName || user?.name || "Job Seeker";
  const userRole = user?.role?.replace('_', ' ') || "Job Seeker";

  return (
    <Box
      sx={{
        padding: theme.spacing(isMobile ? 1 : 3),
        borderRadius: theme.shape.borderRadius,
        minHeight: '100%', // Ensure it takes full height of MainContent
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3), // Spacing between sections
      }}
    >
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3 }}>
          Welcome back, {userName}!
        </Typography>

        {/* Profile Completion */}
        <Card sx={{ mb: 4, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[2] }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              Profile Completion
            </Typography>
            <LinearProgress
              variant="determinate"
              value={80}
              sx={{
                mb: 2,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.grey[300],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 4,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              80% Complete
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/Job-seeker-profile')}
              sx={{ borderRadius: theme.shape.borderRadius, fontWeight: 600 }}
            >
              Complete Profile
            </Button>
          </CardContent>
        </Card>

        {/* Swipeable Video Job Feed */}
        <Card sx={{ mb: 4, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[2] }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              Recommended Video Jobs
            </Typography>
            <Grid container spacing={isMobile ? 1 : 3}>
              {mockJobVideos.map((job) => (
                <Grid item xs={12} sm={6} md={4} key={job.id}>
                  <VideoCard job={job} theme={theme} isMobile={isMobile} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/jobseeker-video-feed')}
                sx={{ borderRadius: theme.shape.borderRadius, fontWeight: 600 }}
              >
                Explore More Videos
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card sx={{ mb: 4, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[2] }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              Recent Applications
            </Typography>
            <List>
              <ListItem sx={{ borderRadius: theme.shape.borderRadius, mb: 1, '&:hover': { bgcolor: theme.palette.action.hover } }}>
                <ListItemText
                  primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>UI Designer at Adobe</Typography>}
                  secondary="Applied 2 days ago • In Review"
                  primaryTypographyProps={{ color: theme.palette.text.primary }}
                  secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                />
              </ListItem>
              <ListItem sx={{ borderRadius: theme.shape.borderRadius, mb: 1, '&:hover': { bgcolor: theme.palette.action.hover } }}>
                <ListItemText
                  primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>Product Manager at Spotify</Typography>}
                  secondary="Applied 5 days ago • Interview Scheduled"
                  primaryTypographyProps={{ color: theme.palette.text.primary }}
                  secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                />
              </ListItem>
              <ListItem sx={{ borderRadius: theme.shape.borderRadius, '&:hover': { bgcolor: theme.palette.action.hover } }}>
                <ListItemText
                  primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>Frontend Developer at Netflix</Typography>}
                  secondary="Applied 1 week ago • Rejected"
                  primaryTypographyProps={{ color: theme.palette.text.primary }}
                  secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card sx={{ borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[2] }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              Notifications
            </Typography>
            <List>
              <ListItem sx={{ borderRadius: theme.shape.borderRadius, mb: 1, '&:hover': { bgcolor: theme.palette.action.hover } }}>
                <ListItemText
                  primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>Your application for Software Engineer has been reviewed.</Typography>}
                  primaryTypographyProps={{ color: theme.palette.text.primary }}
                />
              </ListItem>
              <ListItem sx={{ borderRadius: theme.shape.borderRadius, '&:hover': { bgcolor: theme.palette.action.hover } }}>
                <ListItemText
                  primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>New job recommendation: Senior UX Designer at Google.</Typography>}
                  primaryTypographyProps={{ color: theme.palette.text.primary }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
 
export default JobSeekerDashboard;
