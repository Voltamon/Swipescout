"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Button,
  Switch,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  styled,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material"
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  Close as CloseIcon,
  VideoLibrary as VideoLibraryIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4F46E5", // Indigo color from the original design
    },
    background: {
      default: "#F9FAFB",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.1rem",
    },
    subtitle1: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 56,
          "@media (min-width:0px)": {
            minHeight: 56,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
  },
})

// Styled components
const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  marginBottom: theme.spacing(2),
}))

const VideoThumbnail = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: "50%",
  margin: "0 auto",
  marginBottom: theme.spacing(2),
  position: "relative",
  overflow: "hidden",
  border: "4px solid white",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
}))

const PlayIconOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.3)",
  borderRadius: "50%",
  cursor: "pointer",
}))

const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
}))

const SectionTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}))

const ExperienceItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: "none",
  },
}))

const VideoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: 200,
  borderRadius: theme.spacing(1.5),
  overflow: "hidden",
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.grey[900],
}))

// Modified BottomNav to span full width
const BottomNav = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "space-around",
  padding: theme.spacing(0.5, 0),
  zIndex: 100,
  // Removed maxWidth property
  // Added width: 100% to ensure it spans the full width
  width: "100%",
}))

const NavItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  cursor: "pointer",
  "&.active": {
    color: theme.palette.primary.main,
  },
}))

export default function ProfilePage() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [availabilityOn, setAvailabilityOn] = useState(true)
const navigate = useNavigate();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
    navigate("/event.currentTarget");
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleVideoOpen = () => {
    setVideoModalOpen(true)
  }

  const handleVideoClose = () => {
    setVideoModalOpen(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ pb: 10, minHeight: "100vh" }}>
        {/* Top Navigation */}
        <AppBar position="sticky" color="default" elevation={0} sx={{ height: "auto" }}>
          <Toolbar sx={{ minHeight: { xs: "48px" }, px: 2 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                fontSize: "1.25rem",
                "& span": { color: "primary.main" },
              }}
            >
              Swipe<span>Scout</span>
            </Typography>
            <IconButton size="small" edge="end" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <VisibilityIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>View as Employer</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="sm" sx={{ py: 2 }}>
          {/* Profile Header */}
          <ProfileHeader>
            <VideoThumbnail onClick={handleVideoOpen}>
              <Box
                component="img"
                // src="/placeholder.svg?height=120&width=120"
                // alt="Profile video thumbnail"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <PlayIconOverlay>
                <PlayArrowIcon sx={{ color: "white", fontSize: 40 }} />
              </PlayIconOverlay>
            </VideoThumbnail>

            <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
              Alex Chen
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              UX/UI Designer
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mb: 2 }}>
              <Chip label="Figma" size="small" sx={{ bgcolor: "rgba(79, 70, 229, 0.1)", color: "primary.main" }} />
              <Chip
                label="User Research"
                size="small"
                sx={{ bgcolor: "rgba(79, 70, 229, 0.1)", color: "primary.main" }}
              />
              <Chip label="HTML/CSS" size="small" sx={{ bgcolor: "rgba(79, 70, 229, 0.1)", color: "primary.main" }} />
              <Chip
                label="Prototyping"
                size="small"
                sx={{ bgcolor: "rgba(79, 70, 229, 0.1)", color: "primary.main" }}
              />
              <Chip
                label="Wireframing"
                size="small"
                sx={{ bgcolor: "rgba(79, 70, 229, 0.1)", color: "primary.main" }}
              />
              <Chip label="UX Writing" size="small" sx={{ bgcolor: "rgba(79, 70, 229, 0.1)", color: "primary.main" }} />
            </Box>
          </ProfileHeader>

          {/* Experience Section */}
          <Section>
            <SectionTitle>
              <Typography variant="h6">Experience</Typography>
              <Button startIcon={<EditIcon fontSize="small" />} color="primary" size="small">
                Edit
              </Button>
            </SectionTitle>

            <ExperienceItem>
              <Typography variant="subtitle1">Senior UX Designer</Typography>
              <Typography variant="body2" color="text.secondary">
                DigitalAgency Inc.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2020 - 2023
              </Typography>
            </ExperienceItem>

            <ExperienceItem>
              <Typography variant="subtitle1">UI Designer</Typography>
              <Typography variant="body2" color="text.secondary">
                Creative Studio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2018 - 2020
              </Typography>
            </ExperienceItem>
          </Section>

          {/* Education Section */}
          <Section>
            <SectionTitle>
              <Typography variant="h6">Education</Typography>
              <Button startIcon={<EditIcon fontSize="small" />} color="primary" size="small">
                Edit
              </Button>
            </SectionTitle>

            <ExperienceItem>
              <Typography variant="subtitle1">B.A. in Design</Typography>
              <Typography variant="body2" color="text.secondary">
                Stanford University
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2014 - 2018
              </Typography>
            </ExperienceItem>
          </Section>

          {/* Video Resume Section */}
          <Section>
            <SectionTitle>
              <Typography variant="h6">Video Resume</Typography>
              <Button startIcon={<EditIcon fontSize="small" />} color="primary" size="small">
                Edit
              </Button>
            </SectionTitle>

            <VideoContainer onClick={handleVideoOpen}>
              <Box
                component="img"
                src="/placeholder.svg?height=200&width=400"
                alt="Video resume"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlayArrowIcon sx={{ color: "white", fontSize: 60 }} />
              </Box>
            </VideoContainer>

            <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
              <Button variant="outlined" fullWidth size="small">
                Re-record
              </Button>
              <Button variant="contained" fullWidth size="small" onClick={handleVideoOpen}>
                Play Preview
              </Button>
            </Box>
          </Section>

          {/* Availability Section */}
          <Section>
            <SectionTitle>
              <Typography variant="h6">Availability</Typography>
            </SectionTitle>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Available for interviews
              </Typography>
              <Switch
                checked={availabilityOn}
                onChange={(e) => setAvailabilityOn(e.target.checked)}
                color="primary"
                size="small"
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button variant="outlined" fullWidth size="small">
                Schedule meeting
              </Button>
              <Button variant="contained" fullWidth size="small">
                Message
              </Button>
            </Box>
          </Section>
        </Container>

        {/* Bottom Navigation */}
        <BottomNav square>
          <NavItem>
            <VideoLibraryIcon sx={{ mb: 0.5, fontSize: "1.3rem" }} />
            <Typography variant="caption">Feed</Typography>
          </NavItem>
          <NavItem>
            <ChatIcon sx={{ mb: 0.5, fontSize: "1.3rem" }} />
            <Typography variant="caption">Inbox</Typography>
          </NavItem>
          <NavItem className="active">
            <PersonIcon sx={{ mb: 0.5, fontSize: "1.3rem" }} />
            <Typography variant="caption">Profile</Typography>
          </NavItem>
        </BottomNav>

        {/* Video Modal */}
        <Dialog
          fullWidth
          maxWidth="sm"
          open={videoModalOpen}
          onClose={handleVideoClose}
          PaperProps={{
            sx: {
              bgcolor: "black",
              color: "white",
              borderRadius: 2,
            },
          }}
        >
          <IconButton
            onClick={handleVideoClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ p: 0, overflow: "hidden" }}>
            <Box
              component="video"
              controls
              autoPlay
              sx={{ width: "100%", display: "block" }}
              poster="/placeholder.svg?height=400&width=600"
            >
              <source src="https://example.com/resume-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}
