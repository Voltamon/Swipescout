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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
  useMediaQuery,
} from "@mui/material"
import { LocationOn, ArrowForward, People, ExpandMore, VideoCall, Menu as MenuIcon, Close } from "@mui/icons-material"
import { useState } from "react"

export default function EmployerDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // Connect dropdown state
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  
  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  
  const handleClose = () => {
    setAnchorEl(null)
  }
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setDrawerOpen(open)
  }

  // Available people for meetings
  const availablePeople = [
    { name: "Alice Smith", status: "Available now" },
    { name: "Michael Johnson", status: "Available in 30 min" },
    { name: "Sarah Williams", status: "Available now" },
    { name: "David Brown", status: "Available tomorrow" },
  ]
  
  // Navigation items
  const navItems = ["Home", "Jobs", "Candidates", "Profile", "Logout"]

  return (
    <Box sx={{ flexGrow: 1, background: '#ffffff', height: '100%' }}>
      {/* Navigation Bar */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ backgroundColor: "white", borderBottom: "1px solid #eaeaea" }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center" }}>
              <Box component="span" sx={{ color: "#3366ff", fontWeight: "bold" }}>
                Swip
              </Box>
              <Box component="span" sx={{ color: "#ffc107", fontWeight: "bold" }}>
                scout
              </Box>
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 3 }}>
                {navItems.map((item) => (
                  <Button key={item} color="inherit" sx={{ fontWeight: 500 }}>
                    {item}
                  </Button>
                ))}
              </Box>
            )}

            {/* Mobile Hamburger Icon - Centered */}
            {isMobile && (
              <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <IconButton 
                  color="inherit" 
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}

            <Avatar sx={{ bgcolor: "#3366ff" }}>JD</Avatar>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': { 
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <IconButton onClick={toggleDrawer(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton sx={{ borderRadius: 1 }}>
                  <Typography variant="body1">{item}</Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        {/* Welcome Message and Connect Button */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? "flex-start" : "center", 
          justifyContent: "space-between", 
          mb: 4,
          gap: isMobile ? 2 : 0
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: "bold", 
              color: "#333",
              fontSize: isMobile ? '1.75rem' : '2.125rem'
            }}
          >
            Welcome back, John Doe!
          </Typography>
          
          <Button
            color="primary"
            variant="contained"
            endIcon={<ExpandMore />}
            onClick={handleClick}
            sx={{ 
              fontWeight: 500,
              backgroundColor: "#3366ff",
              '&:hover': {
                backgroundColor: "#2952cc"
              }
            }}
          >
            Connect
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 3,
              sx: { 
                width: 250,
                maxHeight: 300,
                mt: 1
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold', color: '#666' }}>
              Available for Meeting
            </Typography>
            {availablePeople.map((person, index) => (
              <MenuItem key={index} onClick={handleClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "#e3f2fd", color: "#3366ff", fontSize: '0.875rem' }}>
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary={person.name} 
                  secondary={person.status}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
                <VideoCall fontSize="small" sx={{ color: "#3366ff" }} />
              </MenuItem>
            ))}
          </Menu>
        </Box>

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
