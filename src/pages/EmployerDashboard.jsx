"use client"
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material"
import { LocationOn, ArrowForward, People } from "@mui/icons-material"

export default function EmployerDashboard() {
  const theme = useTheme()

  return (
    <Box sx={{ flexGrow: 1,background:'#ffffff',height:'100%' }}>
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
        {/* Welcome Message */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 4, color: "#333" }}>
          Welcome back, John Doe!
        </Typography>

        {/* Posted Jobs */}
        <Typography variant="h5" component="h2" sx={{ color: "#3366ff", fontWeight: "bold", mb: 3 }}>
          Posted Jobs
        </Typography>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          {/* Job Card 1 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
                  Senior Frontend Developer
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <People fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    24 Applications
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    San Francisco, CA
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      bgcolor: "#e8f5e9",
                      color: "#4caf50",
                      border: "none",
                      borderRadius: "16px",
                      "&:hover": {
                        bgcolor: "#d7eeda",
                        border: "none",
                      },
                    }}
                  >
                    Open
                  </Button>

                  <Button size="small" endIcon={<ArrowForward />} sx={{ color: "#3366ff" }}>
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Job Card 2 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
                  UX/UI Designer
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <People fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    18 Applications
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Remote
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#2196f3",
                      border: "none",
                      borderRadius: "16px",
                      "&:hover": {
                        bgcolor: "#d0e8fd",
                        border: "none",
                      },
                    }}
                  >
                    Filled
                  </Button>

                  <Button size="small" endIcon={<ArrowForward />} sx={{ color: "#3366ff" }}>
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Job Card 3 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
                  Backend Engineer
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <People fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    32 Applications
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    New York, NY
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      bgcolor: "#e8f5e9",
                      color: "#4caf50",
                      border: "none",
                      borderRadius: "16px",
                      "&:hover": {
                        bgcolor: "#d7eeda",
                        border: "none",
                      },
                    }}
                  >
                    Open
                  </Button>

                  <Button size="small" endIcon={<ArrowForward />} sx={{ color: "#3366ff" }}>
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Shortlisted Candidates */}
        <Typography variant="h5" component="h2" sx={{ color: "#3366ff", fontWeight: "bold", mb: 3 }}>
          Shortlisted Candidates
        </Typography>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          {/* Candidate Card 1 */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
                <Avatar
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#3366ff",
                    width: 50,
                    height: 50,
                    mr: 2,
                  }}
                >
                  AS
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                    Alice Smith
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Senior Frontend Developer
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
                    Interview Scheduled
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Candidate Card 2 */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
                <Avatar
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#3366ff",
                    width: 50,
                    height: 50,
                    mr: 2,
                  }}
                >
                  MJ
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                    Michael Johnson
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Backend Engineer
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
                    Hired
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Notifications */}
        <Typography variant="h5" component="h2" sx={{ color: "#3366ff", fontWeight: "bold", mb: 3 }}>
          Notifications
        </Typography>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 1 }}>
              New application for Senior Frontend Developer position.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              2 hours ago
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Michael Johnson accepted your offer for Backend Engineer.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1 day ago
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

