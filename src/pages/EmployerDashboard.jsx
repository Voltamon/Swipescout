import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Container,
  Grid
} from "@mui/material";
import { Home, Work, People, Person, ExitToApp } from "@mui/icons-material";

function EmployerDashboard() {
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

      {/* Dashboard Content */}
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, Employer!
        </Typography>

        {/* Posted Jobs */}
        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Posted Jobs
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Senior Frontend Developer"
                  secondary="10 Applications • Open"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Data Scientist"
                  secondary="5 Applications • Closed"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Shortlisted Candidates */}
        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shortlisted Candidates
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Alex Johnson"
                  secondary="Senior Frontend Developer • Interview Scheduled"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Jane Doe"
                  secondary="Data Scientist • Hired"
                />
              </ListItem>
            </List>
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
                <ListItemText primary="New application for Software Engineer." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Interview scheduled with Alex Johnson." />
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

export default EmployerDashboard;
