"use client"
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material"
import { LocationOn, Search, PlayArrow, Code, WorkOutline } from "@mui/icons-material"

export default function CandidateSearchPage() {
  const theme = useTheme()

  return (
    <Box sx={{ flexGrow: 1,background:'#ffffff' }}>
      {/* Navigation Bar */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ backgroundColor: "white", borderBottom: "1px solid #eaeaea" }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center" }}>
              <Box component="span" sx={{ color: "#3366ff", fontWeight: "bold" }}>
                Swip
              </Box>
              <Box component="span" sx={{ color: "#ffc107", fontWeight: "bold" }}>
                scout
              </Box>
            </Typography>

            <Box sx={{ display: "flex", gap: 3 }}>
              <Button color="inherit" sx={{ fontWeight: 500 }}>
                Home
              </Button>
              <Button color="inherit" sx={{ fontWeight: 500 }}>
                Jobs
              </Button>
              <Button color="inherit" sx={{ fontWeight: 500 }}>
                Candidates
              </Button>
              <Button color="inherit" sx={{ fontWeight: 500 }}>
                Profile
              </Button>
              <Button color="inherit" sx={{ fontWeight: 500 }}>
                Logout
              </Button>
            </Box>

            <Avatar sx={{ bgcolor: "#3366ff" }}>JD</Avatar>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        {/* Candidate Search Section */}
        <Card sx={{ mb: 5, p: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h1" sx={{ color: "#3366ff", fontWeight: "bold", mb: 3 }}>
              Find the Right Candidate
            </Typography>

            {/* Search Bar */}
            <Box sx={{ display: "flex", mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search for candidates..."
                variant="outlined"
                size="medium"
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#3366ff",
                  minWidth: "56px",
                  "&:hover": {
                    bgcolor: "#2952cc",
                  },
                }}
              >
                <Search />
              </Button>
            </Box>

            {/* Filter Options */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Skills */}
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Skills
                </Typography>
                <TextField fullWidth placeholder="Select skills" variant="outlined" size="small" />
              </Grid>

              {/* Experience Level */}
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Experience Level
                </Typography>
                <FormControl fullWidth size="small">
                  <Select defaultValue="any" displayEmpty>
                    <MenuItem value="any">Any</MenuItem>
                    <MenuItem value="entry">Entry Level</MenuItem>
                    <MenuItem value="mid">Mid Level</MenuItem>
                    <MenuItem value="senior">Senior Level</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Location */}
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Location
                </Typography>
                <TextField fullWidth placeholder="Select location" variant="outlined" size="small" />
              </Grid>

              {/* Education Level */}
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Education Level
                </Typography>
                <FormControl fullWidth size="small">
                  <Select defaultValue="any" displayEmpty>
                    <MenuItem value="any">Any</MenuItem>
                    <MenuItem value="bachelor">Bachelor's Degree</MenuItem>
                    <MenuItem value="master">Master's Degree</MenuItem>
                    <MenuItem value="phd">PhD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Apply Filters Button */}
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#ffa000",
                color: "white",
                py: 1.5,
                "&:hover": {
                  bgcolor: "#ff8f00",
                },
              }}
            >
              Apply Filters
            </Button>
          </CardContent>
        </Card>

        {/* Candidate Listings */}
        <Typography variant="h5" component="h2" sx={{ color: "#3366ff", fontWeight: "bold", mb: 3 }}>
          Candidate Listings
        </Typography>

        <Grid container spacing={3}>
          {/* Candidate Card 1 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <Box
                sx={{
                  position: "relative",
                  bgcolor: "#f5f5f5",
                  height: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "white",
                    "&:hover": {
                      bgcolor: "white",
                      opacity: 0.9,
                    },
                    width: 60,
                    height: 60,
                  }}
                >
                  <PlayArrow sx={{ color: "#3366ff", fontSize: 30 }} />
                </IconButton>
              </Box>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
                  Sarah Johnson
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Code fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    JavaScript, React, Node.js
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <WorkOutline fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    5 years experience
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    San Francisco, CA
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#3366ff",
                    "&:hover": {
                      bgcolor: "#2952cc",
                    },
                  }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Candidate Card 2 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <Box
                sx={{
                  position: "relative",
                  bgcolor: "#f5f5f5",
                  height: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "white",
                    "&:hover": {
                      bgcolor: "white",
                      opacity: 0.9,
                    },
                    width: 60,
                    height: 60,
                  }}
                >
                  <PlayArrow sx={{ color: "#3366ff", fontSize: 30 }} />
                </IconButton>
              </Box>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
                  Michael Chen
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Code fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Python, Django, Machine Learning
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <WorkOutline fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    7 years experience
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Remote
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#3366ff",
                    "&:hover": {
                      bgcolor: "#2952cc",
                    },
                  }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Candidate Card 3 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <Box
                sx={{
                  position: "relative",
                  bgcolor: "#f5f5f5",
                  height: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "white",
                    "&:hover": {
                      bgcolor: "white",
                      opacity: 0.9,
                    },
                    width: 60,
                    height: 60,
                  }}
                >
                  <PlayArrow sx={{ color: "#3366ff", fontSize: 30 }} />
                </IconButton>
              </Box>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
                  David Wilson
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Code fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Java, Spring Boot, AWS
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <WorkOutline fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    4 years experience
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    New York, NY
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#3366ff",
                    "&:hover": {
                      bgcolor: "#2952cc",
                    },
                  }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

