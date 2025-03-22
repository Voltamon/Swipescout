import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  TextField,
  Slider,
  Checkbox,
  IconButton,
  FormControlLabel,
  Pagination,
  Box,
  Container,
  Grid
} from "@mui/material";
import { Home, Work, Person, ExitToApp } from "@mui/icons-material";

function JobSearchPage() {
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

      {/* Search and Filters */}
      <Container sx={{ marginTop: 4 }}>
        <TextField
          fullWidth
          label="Search for jobs..."
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Location" variant="outlined" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">Salary Range</Typography>
            <Slider
              defaultValue={[50, 150]}
              valueLabelDisplay="auto"
              min={0}
              max={200}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">Job Type</Typography>
            <FormControlLabel control={<Checkbox />} label="Full-Time" />
            <FormControlLabel control={<Checkbox />} label="Part-Time" />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Apply Filters
        </Button>
      </Container>

      {/* Job Listings */}
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Job Listings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Senior Frontend Developer</Typography>
                <Typography variant="body2">
                  Google • Remote • $120K - $150K
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  View Details
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
                  View Details
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

export default JobSearchPage;
