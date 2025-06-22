import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Divider,
  Button,
  Grid,
  Avatar,
  useTheme,
  styled,
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  IconButton,
  LinearProgress,
  Tooltip
} from "@mui/material";
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Business as BusinessIcon,
  PlayCircle as PlayIcon,
  Pause as PauseIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  List as ListIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  VolumeUp,
  VolumeOff
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { getJobDetails } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useVideoContext } from '../context/VideoContext';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%)`,
  minHeight: "100vh",
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4),
  pt: {
    xs: 20,
    sm: 16
  }
}));


const VideoHeroContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "60vh",
  minHeight: "400px",
  maxHeight: "800px",
  backgroundColor: "#000",
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  marginBottom: theme.spacing(3),
  position: "relative",
  boxShadow: theme.shadows[4],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  '&:hover': {
    cursor: 'pointer',
  }
}));

const VideoOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(4),
  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
  color: "#fff",
  zIndex: 2
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  color:'rgba(248, 241, 241, 0.98)',
  backgroundColor: 'rgba(226, 224, 224, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 3
}));


const DetailCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(2),
  "& .MuiSvgIcon-root": {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1.5),
    marginTop: theme.spacing(0.5),
  },
}));

const StatusBorder = styled('div')(({ status, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '8px',
  border: `4px solid ${
    status === 'uploading' ? 'rgb(46, 68, 194)' : 
    status === 'processing' ? 'rgb(46, 68, 194)' : 
    theme.palette.error.main
  }`,
  background: 'transparent',
  zIndex: 2,
  pointerEvents: 'none',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { opacity: 0.7 },
    '50%': { opacity: 0.3 },
    '100%': { opacity: 0.7 },
  },
}));

const JobDetailsPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [showVideoInfo, setShowVideoInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { role } = useAuth();
  const { videos: localVideos } = useVideoContext();
  const videoRef = React.useRef(null);
  const [isHovering, setIsHovering] = useState(false);
const [isMouseOverControls, setIsMouseOverControls] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await getJobDetails(id);
        setJob(response.data.job);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details");
        setLoading(false);
        setSnackbar({
          open: true,
          message: "Failed to load job details",
          severity: "error"
        });
      }
    };

    fetchJobDetails();
  }, [id]);

  const getDisplayVideo = () => {
    // 1. Check for local videos first (uploading/processing)
    const associatedLocalVideo = localVideos.find(v => v.job_id === id);
    
    if (associatedLocalVideo && 
        (associatedLocalVideo.status === 'uploading' || 
         associatedLocalVideo.status === 'processing' || 
         associatedLocalVideo.status === 'failed') && 
        associatedLocalVideo.video_url
    ) {
      return associatedLocalVideo;
    }

    // 2. Check for completed server video in job data
    if (job?.video?.video_url && job.video.status === 'completed') {
      return job.video;
    }

    // 3. Check if job has a video_id but no full video object
    if (job?.video_id) {
      return {
        id: job.video_id,
        status: job.video?.status || 'processing',
        video_title: job.title ? `${job.title} Video` : 'Job Video',
        submitted_at: job.video?.submitted_at || new Date().toISOString(),
        video_url: null
      };
    }
    
    // 4. Check if there's a completed local video for this job
    const completedLocalVideo = localVideos.find(v => 
      v.job_id === id && v.status === 'completed'
    );
    if (completedLocalVideo) {
      return completedLocalVideo;
    }

    return null;
  };

  const displayVideo = getDisplayVideo();
  const hasVideo = () => !!displayVideo;
  const getVideoUrl = () => displayVideo?.video_url || null;

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => console.log("Play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatSalary = (amount) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderVideoHero = () => {
    if (!hasVideo()) return null;

    const videoUrl = getVideoUrl();
    const video = displayVideo;



const handleMouseEnterVideo = () => {
  setIsHovering(true);
  if (!isPlaying && !isMouseOverControls) {
    videoRef.current?.play().catch(e => console.log("Play failed:", e));
  }
};

const handleMouseLeaveVideo = () => {
  setIsHovering(false);
  if (isPlaying && !isMouseOverControls) {
    videoRef.current?.pause();
  }
};



    
    return (
      <VideoHeroContainer onClick={togglePlayback} 
          onMouseEnter={handleMouseEnterVideo}
    onMouseLeave={handleMouseLeaveVideo}
 >
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              controls={false}
              autoPlay={isPlaying}
              muted={isMuted}
              loop
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0
              }}
            />
            
            <VideoControls>
              <IconButton 
                size="small" 
                color="inherit" 
                onClick={togglePlayback}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
              <Typography variant="caption" color="inherit">
                {videoRef.current ? formatTime(videoRef.current.currentTime) : '00:00'} / 
                {videoRef.current ? formatTime(videoRef.current.duration) : '00:00'}
              </Typography>
              <IconButton 
                size="small" 
                color="inherit" 
                onClick={toggleMute}
              >
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
            </VideoControls>
          </>
        ) : (
          <Box
                onMouseEnter={() => setIsMouseOverControls(true)}
      onMouseLeave={() => setIsMouseOverControls(false)}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.grey[900],
              color: theme.palette.common.white,
              p: 3
            }}
          >
            {(video.status === 'uploading' || video.status === 'processing') && (
              <>
                <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
                <Typography variant="h5" align="center">
                  {video.status === 'uploading' ? 
                    `Uploading: ${video.progress || 0}%` : 
                    "Processing your video..."}
                </Typography>
                {video.status === 'uploading' && (
                  <LinearProgress 
                    variant="determinate" 
                    value={video.progress || 0} 
                    sx={{ width: '80%', mt: 2 }}
                  />
                )}
                <Typography variant="body2" sx={{ mt: 2 }}>
                  This may take a few moments...
                </Typography>
              </>
            )}
            {video.status === 'failed' && (
              <>
                <Error color="error" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" align="center">
                  Video upload failed
                </Typography>
                <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                  Please check the videos page for details or try again
                </Typography>
              </>
            )}
            {(!video.status || video.status === 'completed') && !videoUrl && (
              <>
                <InfoIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" align="center">
                  Video content not available
                </Typography>
              </>
            )}
          </Box>
        )}

        {(video.status === 'processing' || video.status === 'failed') && (
          <StatusBorder status={video.status} />
        )}




        <VideoOverlay>
  {/* Job title and company info at the bottom */}
  <Box sx={{ mb: 4 }}>
    <Typography variant="h3" component="h1" sx={{ color: "#fff", mb: 1 }}>
      {job?.title}
    </Typography>
    <Stack direction="row" spacing={2}>
      <Typography
        variant="subtitle1"
        sx={{ color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center" }}
      >
        <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
        {job?.company_name}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center" }}
      >
        <LocationIcon fontSize="small" sx={{ mr: 1 }} />
        {job?.location}
      </Typography>
    </Stack>
  </Box>

  {/* Video info at the top */}
  { displayVideo && (
    <Box 
      sx={{ 
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    maxWidth: "300px",
    transition: 'all 0.3s ease',

  }}
    >
      {/* <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
        Video Information
      </Typography> */}
      <Typography variant="body2">
        <Box component="span" sx={{ opacity: 0.8 }}></Box> {displayVideo.video_title || "Video Title"}
      </Typography>
      {/* <Typography variant="body2">
        <Box component="span" sx={{ opacity: 0.8 }}>Status:</Box> {displayVideo.status || "Not specified"}
      </Typography>
      {displayVideo.status === 'uploading' && (
        <Typography variant="body2">
          <Box component="span" sx={{ opacity: 0.8 }}>Progress:</Box> {displayVideo.progress || 0}%
        </Typography>
      )}
      <Typography variant="body2">
        <Box component="span" sx={{ opacity: 0.8 }}>Uploaded:</Box> {new Date(displayVideo.submitted_at).toLocaleDateString()}
      </Typography> */}
    </Box>
  )}
</VideoOverlay>
      </VideoHeroContainer>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        </Container>
      </PageContainer>
    );
  }

  if (error || !job) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mt: 3 }}>
            {error || "Job not found"}
          </Alert>
          <Button
            variant="outlined"
            startIcon={<WorkIcon />}
            onClick={() => navigate("/jobs")}
            sx={{ mt: 2 }}
          >
            Back to Jobs
          </Button>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <Button
          variant="outlined"
          startIcon={<WorkIcon />}
          onClick={() => navigate("/jobs")}
          sx={{ mb: 3 }}
        >
          Back to Jobs
        </Button>

        {hasVideo() && renderVideoHero()}

        <DetailCard elevation={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    mr: 2,
                    width: 60,
                    height: 60
                  }}
                >
                  <BusinessIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h3" component="h1" fontWeight="bold">
                    {job.title}
                  </Typography>
                  <Stack direction="row" spacing={2} mt={1}>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <EventIcon fontSize="small" sx={{ mr: 1 }} />
                      Posted: {formatDate(job.posted_at)}
                    </Typography>
                    {job.deadline && (
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <EventIcon fontSize="small" sx={{ mr: 1 }} />
                        Expires: {formatDate(job.deadline)}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailItem>
                <LocationIcon />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {job.location} {job.remote_ok ? "(Remote OK)" : ""}
                  </Typography>
                </Box>
              </DetailItem>

              <DetailItem>
                <MoneyIcon />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Salary Range
                  </Typography>
                  <Typography variant="body1">
                    {job.salary_min || job.salary_max
                      ? `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`
                      : "Not specified"}
                  </Typography>
                </Box>
              </DetailItem>

              <DetailItem>
                <ScheduleIcon />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Employment Type
                  </Typography>
                  <Typography variant="body1">
                    {job.employment_type
                      ? job.employment_type.replace("-", " ").toUpperCase()
                      : "Not specified"}
                  </Typography>
                </Box>
              </DetailItem>
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailItem>
                <StarIcon />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Experience Level
                  </Typography>
                  <Typography variant="body1">
                    {job.experience_level === "entry"
                      ? "Entry Level"
                      : job.experience_level === "mid"
                      ? "Mid Level"
                      : job.experience_level === "senior"
                      ? "Senior Level"
                      : job.experience_level === "executive"
                      ? "Executive"
                      : "Not specified"}
                  </Typography>
                </Box>
              </DetailItem>

              <DetailItem>
                <SchoolIcon />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Education Level
                  </Typography>
                  <Typography variant="body1">
                    {job.education_level === "high_school"
                      ? "High School"
                      : job.education_level === "associate"
                      ? "Associate Degree"
                      : job.education_level === "bachelor"
                      ? "Bachelor's Degree"
                      : job.education_level === "master"
                      ? "Master's Degree"
                      : job.education_level === "phd"
                      ? "PhD"
                      : "Not specified"}
                  </Typography>
                </Box>
              </DetailItem>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <DetailItem>
                <DescriptionIcon />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Job Description
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {job.description}
                  </Typography>
                </Box>
              </DetailItem>
            </Grid>

            {job.requirements && job.requirements.length > 0 && (
              <Grid item xs={12}>
                <DetailItem>
                  <ListIcon />
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      Requirements
                    </Typography>
                    <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                      {job.requirements.map((req, index) => (
                        <Box component="li" key={index} sx={{ mb: 1 }}>
                          <Typography variant="body1">{req}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </DetailItem>
              </Grid>
            )}

            {job.responsibilities && job.responsibilities.length > 0 && (
              <Grid item xs={12}>
                <DetailItem>
                  <ListIcon />
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      Responsibilities
                    </Typography>
                    <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                      {job.responsibilities.map((resp, index) => (
                        <Box component="li" key={index} sx={{ mb: 1 }}>
                          <Typography variant="body1">{resp}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </DetailItem>
              </Grid>
            )}

            {job.skills && job.skills.length > 0 && (
              <Grid item xs={12}>
                <DetailItem>
                  <StarIcon />
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      Required Skills
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                      {job.skills.map((skill) => (
                        <Chip
                          key={skill.id}
                          label={skill.name}
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: "0.875rem" }}
                        />
                      ))}
                    </Box>
                  </Box>
                </DetailItem>
              </Grid>
            )}

            {job.categories && job.categories.length > 0 && (
              <Grid item xs={12}>
                <DetailItem>
                  <ListIcon />
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      Categories
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                      {job.categories.map((category) => (
                        <Chip
                          key={category.id}
                          label={category.name}
                          color="secondary"
                          variant="outlined"
                          sx={{ fontSize: "0.875rem" }}
                        />
                      ))}
                    </Box>
                  </Box>
                </DetailItem>
              </Grid>
            )}
          </Grid>
        </DetailCard>

        {role === "job_seeker" && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(`/apply/${job.id}`)}
              sx={{ px: 6, py: 1.5, fontSize: "1.1rem" }}
            >
              Apply Now
            </Button>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default JobDetailsPage;