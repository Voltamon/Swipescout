import i18n from 'i18next';
import React, { useContext } from "react";
import {
  Box,
  useTheme,
  Typography,
  Stack,
  Paper,
} from "@mui/material";

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

const NotificationsPage = () => {
  // const theme = useTheme(); // Removed: unused variable

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

      <Typography variant="h4" align="center" sx={{ mt: 4, mb: 2 }}>{i18n.t('auto_notifications')}</Typography>


    </Box>
  );
};

export default NotificationsPage;

