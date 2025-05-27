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
  return <Box sx={{ background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%), url('/backgrounds/bkg1.png')`, backgroundSize: "cover", backgroundPosition: "top right" ,mt:2 ,height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}

      {/* Main Content */}
      <Container sx={{ flex: 1, py: 1.5, display: "flex", flexDirection: "column", mt:2 }}>
        {/* Stepper */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 2 }}>
          <MobileStepper variant="dots" steps={3} position="static" activeStep={activeStep} sx={{ background: "transparent", width: "auto", "& .MuiMobileStepper-dot": { margin: "0 3px", width: 10, height: 10 }, "& .MuiMobileStepper-dotActive": { backgroundColor: "#3366ff" } }} nextButton={<Box />} backButton={<Box />} />
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

  
    </Box>;
}
