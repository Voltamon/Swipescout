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
    Checkbox,
  IconButton,
  FormControlLabel,
  Box,
  Container
} from "@mui/material";
import { Home, Work, People, Person, ExitToApp } from "@mui/icons-material";

function PostJobPage() {
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

      {/* Post Job Form */}
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Post a New Job
        </Typography>
        <Card>
          <CardContent>
            <TextField
              fullWidth
              label="Job Title"
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Job Description"
              variant="outlined"
              multiline
              rows={4}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Min Salary"
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Max Salary"
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Employment Type"
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Requirements"
              variant="outlined"
              multiline
              rows={4}
              sx={{ marginBottom: 2 }}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Remote work allowed"
            />
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Post Job
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

export default PostJobPage;
