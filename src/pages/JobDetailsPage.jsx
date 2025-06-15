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
  Snackbar
} from "@mui/material";
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Business as BusinessIcon,
  PlayCircle as PlayIcon
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { getJobDetails } from "../services/api";

const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4)
}));

const VideoContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "500px",
  backgroundColor: "#000",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative"
}));

const PlayButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  zIndex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.7)"
  }
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

  useEffect(
    () => {
      const fetchJobDetails = async () => {
        try {
          setLoading(true);
          const response = await getJobDetails(id);
          setJob(response.data);
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
    },
    [id]
  );

  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        </Container>
      </PageContainer>
    );
  }

  if (error || !job) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Alert severity="error">
            {error || "Job not found"}
          </Alert>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      sx={{
        background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%)`,
        minHeight: "100vh",
        py: 3,
        pt: {
          xs: 20,
          sm: 16
        }
      }}
    >
      <Container maxWidth="lg">
        <Button
          startIcon={<WorkIcon />}
          onClick={() => navigate("/jobs")}
          sx={{ mb: 2 }}
        >
          Back to Jobs
        </Button>

        {job.video_url &&
          <VideoContainer>
            <video
              src={job.video_url}
              controls
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            {!job.video_url &&
              <PlayButton startIcon={<PlayIcon />} size="large">
                Play Video
              </PlayButton>}
          </VideoContainer>}

        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                  <BusinessIcon />
                </Avatar>
                <Typography variant="h4" component="h1">
                  {job.title}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="subtitle1" color="textSecondary">
                  Posted on: {new Date(job.posted_at).toLocaleDateString()}
                </Typography>
                {job.expires_at &&
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ ml: 2 }}
                  >
                    Expires on: {new Date(job.expires_at).toLocaleDateString()}
                  </Typography>}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <LocationIcon sx={{ mr: 1 }} /> Location
                </Typography>
                <Typography>
                  {job.location} {job.remote_ok && "(Remote OK)"}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <MoneyIcon sx={{ mr: 1 }} /> Salary Range
                </Typography>
                <Typography>
                  ${job.salary_min} - ${job.salary_max}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <ScheduleIcon sx={{ mr: 1 }} /> Employment Type
                </Typography>
                <Typography>
                  {job.employment_type.replace("-", " ")}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <StarIcon sx={{ mr: 1 }} /> Experience Level
                </Typography>
                <Typography>
                  {job.experience_level === "entry" && "Entry Level"}
                  {job.experience_level === "mid" && "Mid Level"}
                  {job.experience_level === "senior" && "Senior Level"}
                  {job.experience_level === "executive" && "Executive"}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <SchoolIcon sx={{ mr: 1 }} /> Education Level
                </Typography>
                <Typography>
                  {job.education_level === "high_school" && "High School"}
                  {job.education_level === "associate" && "Associate Degree"}
                  {job.education_level === "bachelor" && "Bachelor's Degree"}
                  {job.education_level === "master" && "Master's Degree"}
                  {job.education_level === "phd" && "PhD"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Job Description
              </Typography>
              <Typography paragraph>
                {job.description}
              </Typography>
            </Grid>

            {job.requirements &&
              job.requirements.length > 0 &&
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Requirements
                </Typography>
                <ul style={{ paddingLeft: "24px" }}>
                  {job.requirements.map((req, index) =>
                    <li key={index}>
                      <Typography>
                        {req}
                      </Typography>
                    </li>
                  )}
                </ul>
              </Grid>}

            {job.responsibilities &&
              job.responsibilities.length > 0 &&
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Responsibilities
                </Typography>
                <ul style={{ paddingLeft: "24px" }}>
                  {job.responsibilities.map((resp, index) =>
                    <li key={index}>
                      <Typography>
                        {resp}
                      </Typography>
                    </li>
                  )}
                </ul>
              </Grid>}

            {job.skills &&
              job.skills.length > 0 &&
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Required Skills
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {job.skills.map(skill =>
                    <Chip
                      key={skill.id}
                      label={skill.name}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Grid>}

            {job.categories &&
              job.categories.length > 0 &&
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Categories
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {job.categories.map(category =>
                    <Chip
                      key={category.id}
                      label={category.name}
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Grid>}
          </Grid>
        </Paper>

        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(`/apply/${job.id}`)}
          >
            Apply Now
          </Button>
        </Box>
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
