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
  TextField,
  Box,
  Container,
  Grid,
  Pagination
} from "@mui/material";
import { Home, Work, People, Person, ExitToApp } from "@mui/icons-material";

function CandidateSearchPage() {
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
            <People />
          </IconButton>
          <IconButton color="inherit">
            <Person />
          </IconButton>
          <IconButton color="inherit">
            <ExitToApp />
          </IconButton>
          <Avatar sx={{ marginLeft: 2 }}>E</Avatar>
        </Toolbar>
      </AppBar>

      {/* Search and Filters */}
      <Container sx={{ marginTop: 4 }}>
        <TextField
          fullWidth
          label="Search for candidates..."
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Skills" variant="outlined" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Experience Level" variant="outlined" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Location" variant="outlined" />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Apply Filters
        </Button>
      </Container>

      {/* Candidate Listings */}
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Candidate Listings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Alex Johnson</Typography>
                <Typography variant="body2">
                  Senior Frontend Developer • 5 years experience • Remote
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Jane Doe</Typography>
                <Typography variant="body2">
                  Data Scientist • 7 years experience • Los Angeles, CA
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Pagination
          count={10}
          sx={{ marginTop: 4, display: "flex", justifyContent: "center" }}
        />
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

export default CandidateSearchPage;
