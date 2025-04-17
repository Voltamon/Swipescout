"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  MobileStepper,
  useTheme,
  styled,
  Stack,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import VideocamIcon from "@mui/icons-material/Videocam"
import RssFeedIcon from "@mui/icons-material/RssFeed"
import InboxIcon from "@mui/icons-material/Inbox"
import PersonIcon from "@mui/icons-material/Person"
import { useNavigate } from "react-router-dom";




// Styled components
const UploadBox = styled(Box)(({ theme }) => ({

  border: "2px dashed #f0f0f0",
  borderRadius: "8px",
  padding: theme.spacing(4), // Reduced padding
  backgroundColor: "#f9f9f9",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  minHeight: "170px", // Reduced height
  textAlign: "center",
  marginBottom: theme.spacing(2), // Reduced margin
  "&:hover": {
    borderColor: "#3366ff",
    backgroundColor: "#e9f7ff",
  },
}))


const SelectVideoButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#3366ff",
  color: "white",
  padding: theme.spacing(1), // Reduced padding
  borderRadius: "8px",
  "&:hover": {
    transform: "translateY(-5px)",
  },
  width: "100%",
  marginBottom: theme.spacing(1.5), // Reduced margin
}))

const RecordVideoButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white",
  color: "black",
  padding: theme.spacing(1), // Reduced padding
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  width: "100%",
}))

const NavButton = styled(Button)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: 0,
  flex: 1,
  padding: theme.spacing(0.75), // Reduced padding
  color: "grey",
  "&.active": {
    color: "#3366ff",
  },
}))

export default function VideoResumeUpload() {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const [activeNav, setActiveNav] = useState("profile")

  const handleFileUpload = (event) => {
    // Handle file upload logic here
    console.log("File uploaded:", event.target.files[0])
  }
const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: "1px solid #e0e0e0" }}>
        <Toolbar variant="dense">
          {" "}
          {/* Using dense toolbar to reduce height */}
          <IconButton edge="start" color="inherit" aria-label="close" size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold", fontSize: "1.1rem" }}
          >
            Create Video Resume
          </Typography>
          <Box sx={{ width: 28 }} /> {/* Reduced spacer */}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ flex: 1, py: 1.5, display: "flex", flexDirection: "column" }}>
        {/* Stepper */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 2 }}>
          <MobileStepper
            variant="dots"
            steps={3}
            position="static"
            activeStep={activeStep}
            sx={{
              background: "transparent",
              width: "auto",
              "& .MuiMobileStepper-dot": {
                margin: "0 3px",
                width: 10,
                height: 10,
              },
              "& .MuiMobileStepper-dotActive": {
                backgroundColor: "#3366ff",
              },
            }}
            nextButton={<Box />}
            backButton={<Box />}
          />
        </Box>

        {/* Title and Description */}
        <Typography variant="h5" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 0.5 }}>
          Upload Your Video
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 2 }}>
          Show employers who you are in 45 seconds or less
        </Typography>

        {/* Upload Area */}
        <UploadBox component="label" htmlFor="video-upload">
          <input id="video-upload" type="file" accept="video/mp4" hidden onChange={handleFileUpload} />
          <VideocamIcon sx={{ fontSize: 50, color: "#555", mb: 1.5 }} />
          <Typography variant="body1" sx={{ fontWeight: "medium", mb: 0.5 }}>
            Drag & drop video here
          </Typography>
          <Typography variant="body2" color="textSecondary">
            or click to browse files (MP4, max 45s)
          </Typography>
        </UploadBox>

        {/* Action Buttons */}
        <Stack spacing={1.5} sx={{ mt: "20px" }}>
          <SelectVideoButton variant="contained" disableElevation size="small">
            Select Video
          </SelectVideoButton>
          <RecordVideoButton variant="outlined" disableElevation size="small">
            Record New Video
          </RecordVideoButton>
        </Stack>
      </Container>

      {/* Bottom Navigation */}
      <Paper sx={{ position: "sticky", bottom: 0, left: 0, right: 0 }} elevation={3}>
        <Box sx={{ display: "flex", justifyContent: "space-around", borderTop: "1px solid #e0e0e0" }}>
          <NavButton className={activeNav === "feed" ? "active" : ""} onClick={() => {
            setActiveNav("feed");
            navigate("/video-feed");
          }
          }>
            <RssFeedIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
              Feed
            </Typography>
          </NavButton>
          <NavButton className={activeNav === "inbox" ? "active" : ""} onClick={() => {
            setActiveNav("inbox");
            navigate("/inbox");
          }
          }>
            <InboxIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
              Inbox
            </Typography>
          </NavButton>
          <NavButton className={activeNav === "profile" ? "active" : ""} onClick={() => {
            setActiveNav("profile");
            navigate("/profile");
          }
          }>
            <PersonIcon fontSize="small" />
            <Typography
              variant="caption"
              sx={{ fontSize: "0.7rem" }}
              color={activeNav === "profile" ? "#3366ff" : "inherit"}
            >
              Profile
            </Typography>
          </NavButton>
        </Box>
      </Paper>
    </Box>
  )
}
