// VideoUploadStyles.js
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Slider,
  Chip,
  CircularProgress
} from "@mui/material";

// Styled components are now separated into their own file for better management.
const VideoUploadStyles = theme => {
  const UploadBox = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    minHeight: "170px",
    textAlign: "center",
    marginBottom: theme.spacing(2),
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.action.hover
    }
  }));

  const VideoButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1, 4),
    borderRadius: "25px",
    boxShadow: theme.shadows[3],
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: theme.shadows[6]
    }
  }));

  const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      backgroundColor: theme.palette.background.paper,
      borderRadius: "16px",
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[24]
    }
  }));

  const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(3)
  }));

  const StyledSlider = styled(Slider)(({ theme }) => ({
    height: 8,
    "& .MuiSlider-thumb": {
      display: "none"
    },
    "& .MuiSlider-track": {
      border: "none"
    },
    "& .MuiSlider-rail": {
      backgroundColor: theme.palette.mode === "light" ? "#e8e8e8" : "#424242"
    }
  }));

  const StyledChip = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText
  }));

  const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
    color: theme.palette.primary.contrastText
  }));

  return {
    UploadBox,
    VideoButton,
    StyledDialog,
    StyledDialogContent,
    StyledSlider,
    StyledChip,
    StyledCircularProgress
  };
};

export default VideoUploadStyles;
