"use client"
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material"
import { LocationOn, PlayArrow, Work, Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material"
import { useState } from "react"

export default function CandidateProfilePage() {
  const theme = useTheme()
  theme.palette.background.default = "#ffffff"

  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [drawerOpen, setDrawerOpen] = useState(false)

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
    <Box sx={{ flexGrow: 1, background: "#ffffff" }}>
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

            {isMobile ? (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", gap: 3 }}>
                {navLinks.map((link) => (
                  <Button key={link.text} color="inherit" sx={{ fontWeight: 500 }} href={link.href}>
                    {link.text}
                  </Button>
                ))}
              </Box>
            )}

            <Avatar sx={{ bgcolor: "#3366ff" }}>JD</Avatar>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {navList}
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        {/* Candidate Profile Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 5, flexDirection: { xs: "column", sm: "row" } }}>
          <Avatar
            sx={{
              bgcolor: "#f5f5f5",
              color: "#3366ff",
              width: 120,
              height: 120,
              fontSize: "2.5rem",
              fontWeight: "bold",
              mr: { xs: 0, sm: 4 },
              mb: { xs: 3, sm: 0 },
            }}
          >
            AS
          </Avatar>

          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1, color: "#333" }}>
              Alice Smith
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                mb: 2,
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} />
                <Typography variant="body1" color="text.secondary">
                  San Francisco, CA
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Work fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} />
                <Typography variant="body1" color="text.secondary">
                  5+ years experience
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: { xs: "center", sm: "flex-start" } }}>
              <Chip
                label="JavaScript"
                sx={{
                  bgcolor: "#e3f2fd",
                  color: "#2196f3",
                  borderRadius: "16px",
                }}
              />
              <Chip
                label="React"
                sx={{
                  bgcolor: "#e3f2fd",
                  color: "#2196f3",
                  borderRadius: "16px",
                }}
              />
              <Chip
                label="Node.js"
                sx={{
                  bgcolor: "#e3f2fd",
                  color: "#2196f3",
                  borderRadius: "16px",
                }}
              />
              <Chip
                label="TypeScript"
                sx={{
                  bgcolor: "#e3f2fd",
                  color: "#2196f3",
                  borderRadius: "16px",
                }}
              />
              <Chip
                label="Redux"
                sx={{
                  bgcolor: "#e3f2fd",
                  color: "#2196f3",
                  borderRadius: "16px",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Video Resume Section */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              color: "#3366ff",
              fontWeight: "bold",
              mb: 2,
              pb: 1,
              borderBottom: "2px solid #3366ff",
              display: "inline-block",
            }}
          >
            Video Resume
          </Typography>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "#f5f5f5",
              height: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
            }}
          >
            <IconButton
              sx={{
                bgcolor: "white",
                "&:hover": {
                  bgcolor: "white",
                  opacity: 0.9,
                },
                width: 80,
                height: 80,
              }}
            >
              <PlayArrow sx={{ color: "#3366ff", fontSize: 40 }} />
            </IconButton>
          </Paper>
        </Box>

        {/* Experience Section */}
        <Box>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              color: "#3366ff",
              fontWeight: "bold",
              mb: 3,
              pb: 1,
              borderBottom: "2px solid #3366ff",
              display: "inline-block",
            }}
          >
            Experience
          </Typography>

          <Paper elevation={0} sx={{ p: 3, border: "1px solid #eaeaea", borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                  Senior Frontend Developer
                </Typography>
                <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
                  TechCorp Inc.
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, sm: 0 } }}>
                Jan 2020 - Present
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: "#555" }}>
              Led the development of responsive web applications using React, Redux, and TypeScript. Collaborated with
              UX/UI designers to implement pixel-perfect interfaces. Mentored junior developers and conducted code
              reviews to ensure high code quality.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

