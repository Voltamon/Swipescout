import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Container,
  Grid
} from "@mui/material";
import {
  Notifications,
  Home,
  Work,
  Person,
  ExitToApp
} from "@mui/icons-material";

function JobSeekerDashboard() {
  return (
    <Box >


      {/* Dashboard Content */}
      <Container sx={{ marginTop: 4 }} >
        <Typography variant="h4" gutterBottom>
          Welcome back, Alex!
        </Typography>

        {/* Profile Completion */}
        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profile Completion
            </Typography>
            <LinearProgress
              variant="determinate"
              value={80}
              sx={{ marginBottom: 2 }}
            />
            <Typography variant="body2" gutterBottom>
              80% Complete
            </Typography>
            <Button variant="contained" color="primary">
              Complete Profile
            </Button>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Applications
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="UI Designer at Adobe"
                  secondary="Applied 2 days ago • In Review"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Product Manager at Spotify"
                  secondary="Applied 5 days ago • Interview Scheduled"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Frontend Developer at Netflix"
                  secondary="Applied 1 week ago • Rejected"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Recommended Jobs */}
        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recommended Jobs
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      Senior Frontend Developer
                    </Typography>
                    <Typography variant="body2">
                      Google • Remote • $120K - $150K
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: 2 }}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Data Scientist</Typography>
                    <Typography variant="body2">
                      Netflix • Los Angeles, CA • $130K - $150K
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: 2 }}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Your application for Software Engineer has been reviewed." />
              </ListItem>
              <ListItem>
                <ListItemText primary="New job recommendation: Senior UX Designer at Google." />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "#333",
          color: "white",
          padding: 4,
          marginTop: 4,
          textAlign: "center"
        }}
      >
        <Typography variant="body2">
          © 2023 Swipscout. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default JobSeekerDashboard;
