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
  IconButton
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
  Event as EventIcon,
  Description as DescriptionIcon,
  List as ListIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { getJobDetails } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useVideoContext } from '../context/VideoContext'; // Import useVideoContext

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
  justifyContent: "center"
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

const VideoInfoButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "#fff",
  zIndex: 3,
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.7)"
  }
}));

const VideoInfoPanel = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  width: "300px",
  padding: theme.spacing(2),
  backgroundColor: "rgba(255,255,255,0.9)",
  zIndex: 4,
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius
}));

// Styled component for the main detail card (was missing)
const DetailCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
}));

// Component for individual detail items (was missing)
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
  const { role } = useAuth();
  const { videos: localVideos } = useVideoContext(); // Get local videos from context

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await getJobDetails(id);
        setJob(response.data.job);
        setLoading(false);
      } catch (err) {
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

  // Determine the video to display
  const getDisplayVideo = () => {
    // 1. Find the local video entry associated with this job ID
    // This will find the video regardless of whether its ID is a temporary local one
    // or has been updated to the server-assigned ID, as long as job_id matches.
    const associatedLocalVideo = localVideos.find(v => v.job_id === id);

    // 2. Prioritize the local video if it's currently uploading or processing.
    // This ensures real-time updates and displays the local blob URL.
    // Also include 'failed' videos that are local, so users can see them and potentially retry.
    if (associatedLocalVideo && 
        (associatedLocalVideo.status === 'uploading' || associatedLocalVideo.status === 'processing' || associatedLocalVideo.status === 'failed') && 
        associatedLocalVideo.video_url // Ensure it has a blob URL to play/display progress
    ) {
        console.log("[JobDetailsPage] Displaying local, in-progress or failed video:", associatedLocalVideo);
        return associatedLocalVideo;
    }

    // 3. Fallback to server-provided video if available and completed.
    // If the server's job data includes a completed video for this job, use it.
    if (job?.video?.video_url && job.video.status === 'completed') {
      console.log("[JobDetailsPage] Displaying server-completed video:", job.video);
      return job.video;
    }

    // 4. If the job has a video_id from the server (meaning a video is associated)
    // but no full video object or URL is yet available from the server API,
    // AND we didn't find an actively uploading/processing local video matching.
    // This implies the server is processing it, or it's a server-side failed video.
    if (job?.video_id && (!job?.video?.video_url || job.video.status !== 'completed')) {
      console.log("[JobDetailsPage] Server has video_id but no completed URL, assuming processing or pending:", job.video_id);
      return {
          id: job.video_id, 
          status: job.video?.status || 'processing', // Use server status if available, else 'processing'
          video_title: job.title ? `${job.title} Video` : 'Job Video', 
          submitted_at: job.video?.submitted_at || new Date().toISOString(), 
          video_url: null // No URL available yet from server
      };
    }
    
    console.log("[JobDetailsPage] No video to display for this job.");
    return null; // No video found to display
  };

  const displayVideo = getDisplayVideo(); 

  const hasVideo = () => {
    return !!displayVideo;
  };

  const getVideoUrl = () => {
    return displayVideo?.video_url || null;
  };

  const renderVideoHero = () => {
    const videoUrl = getVideoUrl();
    
    if (!hasVideo()) return null;

    return (
      <VideoHeroContainer>
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.grey[900],
              color: theme.palette.common.white
            }}
          >
            {displayVideo.status === 'uploading' && (
                <Typography variant="h5">Video is uploading: {displayVideo.progress}%</Typography>
            )}
            {displayVideo.status === 'processing' && (
                <Typography variant="h5">Video is processing...</Typography>
            )}
            {displayVideo.status === 'failed' && (
                <Typography variant="h5">Video upload failed. Please check the videos page for details or retry.</Typography>
            )}
            {(!displayVideo.status || displayVideo.status === 'completed') && !videoUrl && (
                <Typography variant="h5">Video content not available.</Typography>
            )}
          </Box>
        )}

        <VideoInfoButton onClick={() => setShowVideoInfo(!showVideoInfo)}>
          {showVideoInfo ? <CloseIcon /> : <InfoIcon />}
        </VideoInfoButton>

        {showVideoInfo && displayVideo && ( 
          <VideoInfoPanel>
            <Typography variant="subtitle1" gutterBottom>
              Video Information
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Title:</strong> {displayVideo.video_title || "Not specified"}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Type:</strong> {displayVideo.video_type || "Not specified"}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Status:</strong> {displayVideo.status || "Not specified"}
            </Typography>
            <Typography variant="body2">
              <strong>Uploaded:</strong> {new Date(displayVideo.submitted_at).toLocaleDateString()}
            </Typography>
          </VideoInfoPanel>
        )}

        <VideoOverlay>
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

        {/* Render the video hero only if hasVideo() is true */}
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
                    {job.expires_at && (
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <EventIcon fontSize="small" sx={{ mr: 1 }} />
                        Expires: {formatDate(job.expires_at)}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailItem
                icon={<LocationIcon />}
                title="Location"
                value={`${job.location} ${job.remote_ok ? "(Remote OK)" : ""}`}
              />

              <DetailItem
                icon={<MoneyIcon />}
                title="Salary Range"
                value={
                  job.salary_min || job.salary_max
                    ? `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`
                    : "Not specified"
                }
              />

              <DetailItem
                icon={<ScheduleIcon />}
                title="Employment Type"
                value={job.employment_type
                  ? job.employment_type.replace("-", " ").toUpperCase()
                  : null}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailItem
                icon={<StarIcon />}
                title="Experience Level"
                value={
                  job.experience_level === "entry"
                    ? "Entry Level"
                    : job.experience_level === "mid"
                    ? "Mid Level"
                    : job.experience_level === "senior"
                    ? "Senior Level"
                    : job.experience_level === "executive"
                    ? "Executive"
                    : null
                }
              />

              <DetailItem
                icon={<SchoolIcon />}
                title="Education Level"
                value={
                  job.education_level === "high_school"
                    ? "High School"
                    : job.education_level === "associate"
                    ? "Associate Degree"
                    : job.education_level === "bachelor"
                    ? "Bachelor's Degree"
                    : job.education_level === "master"
                    ? "Master's Degree"
                    : job.education_level === "phd"
                    ? "PhD"
                    : null
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <DetailItem
                icon={<DescriptionIcon />}
                title="Job Description"
                value={job.description}
              />
            </Grid>

            {job.requirements && job.requirements.length > 0 && (
              <Grid item xs={12}>
                <DetailItem
                  icon={<ListIcon />}
                  title="Requirements"
                >
                  <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                    {job.requirements.map((req, index) => (
                      <Box component="li" key={index} sx={{ mb: 1 }}>
                        <Typography variant="body1">{req}</Typography>
                      </Box>
                    ))}
                  </Box>
                </DetailItem>
              </Grid>
            )}

            {job.responsibilities && job.responsibilities.length > 0 && (
              <Grid item xs={12}>
                <DetailItem
                  icon={<ListIcon />}
                  title="Responsibilities"
                >
                  <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                    {job.responsibilities.map((resp, index) => (
                      <Box component="li" key={index} sx={{ mb: 1 }}>
                        <Typography variant="body1">{resp}</Typography>
                      </Box>
                    ))}
                  </Box>
                </DetailItem>
              </Grid>
            )}

            {job.skills && job.skills.length > 0 && (
              <Grid item xs={12}>
                <DetailItem
                  icon={<StarIcon />}
                  title="Required Skills"
                >
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
                </DetailItem>
              </Grid>
            )}

            {job.categories && job.categories.length > 0 && (
              <Grid item xs={12}>
                <DetailItem
                  icon={<ListIcon />}
                  title="Categories"
                >
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
