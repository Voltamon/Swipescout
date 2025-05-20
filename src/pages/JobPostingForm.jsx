"use client"

import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Button,
  Container,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Avatar,
  Divider,
  IconButton,
  Paper,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material"

const JobPostingForm = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    employmentType: "",
    requirements: "",
    remoteWorkAllowed: false,
  })

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
  }

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return
    }
    setDrawerOpen(open)
  }

  const navLinks = [
    { text: "Home", href: "#" },
    { text: "Jobs", href: "#" },
    { text: "Candidates", href: "#" },
    { text: "Profile", href: "#" },
    { text: "Logout", href: "#" },
  ]

  const navList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton component="a" href={link.href}>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>


      {/* Mobile Navigation Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {navList}
      </Drawer>

      <Divider />

      {/* Main Content */}
      <Container maxWidth="md" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" align="center" sx={{ mb: 4, color: "#333", fontWeight: "medium" }}>
          Post a New Job
        </Typography>

        <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Job Title
                </Typography>
                <TextField
                  fullWidth
                  name="jobTitle"
                  placeholder="Enter job title"
                  variant="outlined"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Job Description
                </Typography>
                <TextField
                  fullWidth
                  name="jobDescription"
                  placeholder="Enter job description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formData.jobDescription}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Location
                </Typography>
                <TextField
                  fullWidth
                  name="location"
                  placeholder="Enter location"
                  variant="outlined"
                  value={formData.location}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Minimum Salary ($)
                </Typography>
                <TextField
                  fullWidth
                  name="minSalary"
                  placeholder="e.g. 50000"
                  variant="outlined"
                  value={formData.minSalary}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Maximum Salary ($)
                </Typography>
                <TextField
                  fullWidth
                  name="maxSalary"
                  placeholder="e.g. 90000"
                  variant="outlined"
                  value={formData.maxSalary}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Employment Type
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="employmentType"
                  defaultValue=""
                  variant="outlined"
                  value={formData.employmentType}
                  onChange={handleChange}
                >
                  <MenuItem value="" disabled>
                    Select employment type
                  </MenuItem>
                  <MenuItem value="full-time">Full-time</MenuItem>
                  <MenuItem value="part-time">Part-time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Requirements
                </Typography>
                <TextField
                  fullWidth
                  name="requirements"
                  placeholder="Enter job requirements"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox name="remoteWorkAllowed" checked={formData.remoteWorkAllowed} onChange={handleChange} />
                  }
                  label="Remote work allowed"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    py: 1.5,
                    bgcolor: "#2563eb",
                    "&:hover": { bgcolor: "#1e40af" },
                  }}
                >
                  Post Job
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ mt: "auto", py: 3, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            gap: { xs: 1.5, sm: 3 },
            mb: 2,
            px: 2,
          }}
        >
          <Link href="#" underline="none" color="inherit">
            About Us
          </Link>
          <Link href="#" underline="none" color="inherit">
            Contact Us
          </Link>
          <Link href="#" underline="none" color="inherit">
            Privacy Policy
          </Link>
          <Link href="#" underline="none" color="inherit">
            Terms and Conditions
          </Link>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <IconButton size="small" color="inherit">
            <FacebookIcon />
          </IconButton>
          <IconButton size="small" color="inherit">
            <TwitterIcon />
          </IconButton>
          <IconButton size="small" color="inherit">
            <LinkedInIcon />
          </IconButton>
          <IconButton size="small" color="inherit">
            <InstagramIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Accessibility buttons on the right side */}
      <Box sx={{ position: "fixed", right: 20, bottom: 100, display: "flex", flexDirection: "column", gap: 1 }}>
        <Avatar sx={{ bgcolor: "#333" }}>
          <span role="img" aria-label="accessibility">
            ♿
          </span>
        </Avatar>
        <Avatar sx={{ bgcolor: "#333" }}>
          <span role="img" aria-label="settings">
            ⚙️
          </span>
        </Avatar>
        <Avatar sx={{ bgcolor: "#333" }}>
          <span role="img" aria-label="chat">
            💬
          </span>
        </Avatar>
      </Box>
    </Box>
  )
}

export default JobPostingForm

      {/* Header */}
      // <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: "white" }}>
      //   <Toolbar sx={{ justifyContent: "space-between" }}>
      //     <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center" }}>
      //       <Box component="span" sx={{ color: "#2563eb", fontWeight: "bold" }}>
      //         Swip
      //       </Box>
      //       <Box component="span" sx={{ color: "#f59e0b", fontWeight: "bold" }}>
      //         scout
      //       </Box>
      //     </Typography>

      //     {isMobile ? (
      //       <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
      //         <MenuIcon />
      //       </IconButton>
      //     ) : (
      //       <Box sx={{ display: "flex", gap: 3 }}>
      //         {navLinks.map((link) => (
      //           <Link key={link.text} href={link.href} underline="none" color="inherit">
      //             {link.text}
      //           </Link>
      //         ))}
      //       </Box>
      //     )}

      //     <Avatar sx={{ bgcolor: "#2563eb" }}>JD</Avatar>
      //   </Toolbar>
      // </AppBar>