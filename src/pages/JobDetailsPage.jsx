import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Box,
  Container,
  Grid
} from "@mui/material";
import { Home, Work, Person, ExitToApp } from "@mui/icons-material";

function JobDetailsPage() {
  return (
    <Box>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Swipscout
          </Typography>
          <IconButton color="inherit">
            <Home />
          </IconButton>
          <IconButton color="inherit">
            <Work />
          </IconButton>
          <IconButton color="inherit">
            <Person />
          </IconButton>
          <IconButton color="inherit">
            <ExitToApp />
          </IconButton>
          <Avatar sx={{ marginLeft: 2 }}>A</Avatar>
        </Toolbar>
      </AppBar>

      {/* Job Details */}
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Senior Frontend Developer
        </Typography>
        <Typography variant="h6" gutterBottom>
          Google • Remote • $120K - $150K
        </Typography>

        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Job Description
            </Typography>
            <Typography variant="body2" gutterBottom>
              We are looking for a Senior Frontend Developer to join our team...
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Requirements
            </Typography>
            <Typography variant="body2" gutterBottom>
              - 5+ years of experience in frontend development...
            </Typography>
          </CardContent>
        </Card>

        <Button variant="contained" color="primary" sx={{ marginBottom: 4 }}>
          Apply Now
        </Button>

        {/* Company Details */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              About the Company
            </Typography>
            <Typography variant="body2" gutterBottom>
              Google is a global technology company...
            </Typography>
            <Button variant="outlined" color="primary">
              Visit Website
            </Button>
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

export default JobDetailsPage;
