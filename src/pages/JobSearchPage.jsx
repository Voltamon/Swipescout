"use client"
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material"
import { BusinessCenter, LocationOn, Search } from "@mui/icons-material"

export default function JobSearchPage() {
  const theme = useTheme()

  return (
    <Box sx={{ flexGrow: 1, 
    background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%), url('/backgrounds/bkg1.png')`,
    backgroundSize: 'auto',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top right',
    padding: theme.spacing(2),
    mt: 2,
    mb: 0,
    paddingBottom: 4,
 }}>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 0, mb: 8 }}>
        {/* Job Search Section */}
        <Card sx={{ mb: 5, p: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h1" sx={{ color: "#3366ff", fontWeight: "bold", mb: 3 }}>
              Find Your Dream Job
            </Typography>

            {/* Search Bar */}
            <Box sx={{ display: "flex", mb: 3 }}>
              <TextField fullWidth placeholder="Search for jobs..." variant="outlined" size="medium" sx={{ mr: 1 }} />
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
              {/* Location */}
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Location
                </Typography>
                <TextField fullWidth placeholder="Enter location" variant="outlined" size="small" />
              </Grid>

              {/* Salary Range */}
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Salary Range
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField placeholder="Min" variant="outlined" size="small" sx={{ width: "50%" }} />
                  <TextField placeholder="Max" variant="outlined" size="small" sx={{ width: "50%" }} />
                </Box>
              </Grid>

              {/* Job Type */}
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Job Type
                </Typography>
                <Box>
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label={<Typography variant="body2">Full-Time</Typography>}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label={<Typography variant="body2">Part-Time</Typography>}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label={<Typography variant="body2">Contract</Typography>}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label={<Typography variant="body2">Freelance</Typography>}
                  />
                </Box>
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

        {/* Job Listings */}
        <Typography variant="h5" component="h2" sx={{ color: "#3366ff", fontWeight: "bold", mb: 3 }}>
          Job Listings
        </Typography>

        <Grid container spacing={3}>
          {/* Job Card 1 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
                  Senior Frontend Developer
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    TechCorp Inc.
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    San Francisco, CA
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: "#4caf50", fontWeight: "medium", mb: 2 }}>
                  $ 110,000 - $140,000
                </Typography>

                <Box sx={{ mb: 2 }}>
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
                    Full-Time
                  </Button>
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
                  View Details
                </Button>
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
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    DesignHub
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Remote
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: "#4caf50", fontWeight: "medium", mb: 2 }}>
                  $ 90,000 - $120,000
                </Typography>

                <Box sx={{ mb: 2 }}>
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
                    Full-Time
                  </Button>
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
                  View Details
                </Button>
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
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    DataSystems
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    New York, NY
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: "#4caf50", fontWeight: "medium", mb: 2 }}>
                  $ 100,000 - $130,000
                </Typography>

                <Box sx={{ mb: 2 }}>
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
                    Full-Time
                  </Button>
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
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Job Card 4 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
                  Product Manager
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    ProductLabs
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Chicago, IL
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: "#4caf50", fontWeight: "medium", mb: 2 }}>
                  $ 120,000 - $150,000
                </Typography>

                <Box sx={{ mb: 2 }}>
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
                    Full-Time
                  </Button>
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
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Job Card 5 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
                  DevOps Engineer
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    CloudTech
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Remote
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: "#4caf50", fontWeight: "medium", mb: 2 }}>
                  $ 115,000 - $145,000
                </Typography>

                <Box sx={{ mb: 2 }}>
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
                    Full-Time
                  </Button>
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
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Job Card 6 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
                  Data Scientist
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    AnalyticsPro
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Boston, MA
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: "#4caf50", fontWeight: "medium", mb: 2 }}>
                  $ 125,000 - $160,000
                </Typography>

                <Box sx={{ mb: 2 }}>
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
                    Full-Time
                  </Button>
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
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Accessibility Buttons - Fixed on the right side */}
        <Box
          sx={{
            position: "fixed",
            right: 20,
            bottom: 100,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Avatar sx={{ bgcolor: "#212121" }}>
            <Typography variant="body2">A</Typography>
          </Avatar>
          <Avatar sx={{ bgcolor: "#212121" }}>
            <Typography variant="body2">S</Typography>
          </Avatar>
          <Avatar sx={{ bgcolor: "#212121" }}>
            <Typography variant="body2">C</Typography>
          </Avatar>
        </Box>
      </Container>
    </Box>
  )
}

      {/* Navigation Bar */}
      // <AppBar
      //   position="static"
      //   color="default"
      //   elevation={0}
      //   sx={{ backgroundColor: "white", borderBottom: "1px solid #eaeaea" }}
      // >
      //   <Container maxWidth="lg">
      //     <Toolbar sx={{ justifyContent: "space-between" }}>
      //       <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center" }}>
      //         <Box component="span" sx={{ color: "#3366ff", fontWeight: "bold" }}>
      //           Swip
      //         </Box>
      //         <Box component="span" sx={{ color: "#ffc107", fontWeight: "bold" }}>
      //           scout
      //         </Box>
      //       </Typography>

      //       <Box sx={{ display: "flex", gap: 3 }}>
      //         <Button color="inherit" sx={{ fontWeight: 500 }}>
      //           Home
      //         </Button>
      //         <Button color="inherit" sx={{ fontWeight: 500 }}>
      //           Jobs
      //         </Button>
      //         <Button color="inherit" sx={{ fontWeight: 500 }}>
      //           Applications
      //         </Button>
      //         <Button color="inherit" sx={{ fontWeight: 500 }}>
      //           Profile
      //         </Button>
      //         <Button color="inherit" sx={{ fontWeight: 500 }}>
      //           Logout
      //         </Button>
      //       </Box>

      //       <Avatar sx={{ bgcolor: "#3366ff" }}>JS</Avatar>
      //     </Toolbar>
      //   </Container>
      // </AppBar>
