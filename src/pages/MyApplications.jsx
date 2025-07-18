import React from "react";
import {
  Box,
  useTheme,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import Header2 from "../components/Header2";
import JobCard from "../components/JobCard"; // Optional if you plan to use it later

const appliedJobs = [
  {
    company: "Google",
    title: "Senior UX Designer",
    location: "Remote",
    salary: "120K-$150K",
    posted: "2 days ago",
    status: "Applied",
  },
  {
    company: "Microsoft",
    title: "Frontend Developer",
    location: "Seattle, WA",
    salary: "$110K-$130K",
    posted: "1 day ago",
    status: "Under Review",
  },
];

const MyApplications = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: 'background.jobseeker',
        minHeight: '100vh',
        mt: 0,
      }}
    >

      <Typography variant="h4" align="center" sx={{ mt: 4, mb: 2 }}>
        My Applications
      </Typography>

      <Stack spacing={3} alignItems="center">
        {appliedJobs.map((job, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: 600,
              padding: 3,
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6">{job.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {job.company} – {job.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {job.salary} • Posted {job.posted}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Status:</strong> {job.status}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default MyApplications;
