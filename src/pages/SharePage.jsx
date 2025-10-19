import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  TextField,
  Button,
  useTheme
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  ContentCopy,
  Close
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

const PLATFORM = {
  facebook: { color: "#1877F2", url: (l) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(l)}` },
  twitter: { color: "#1DA1F2", url: (l) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(l)}` },
  linkedin: { color: "#0A66C2", url: (l) => `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(l)}` },
  whatsapp: { color: "#25D366", url: (l) => `https://api.whatsapp.com/send?text=${encodeURIComponent(l)}` }
};

const SharePage = () => {
  const [searchParams] = useSearchParams();
  const [shareableLink, setShareableLink] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const link = searchParams.get("link");
    if (link) {
      try { setShareableLink(decodeURIComponent(link)); }
      catch { setShareableLink(link); }
    } else {
      toast.error("No shareable link provided.");
    }
  }, [searchParams]);

  const handleCopyLink = async () => {
    if (!shareableLink) return toast.error("No link to copy");
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link.");
    }
  };

  const openSocialMedia = (url) => {
    window.open(url, "_blank", "noopener,noreferrer,width=800,height=600");
  };

  const closeWindow = () => {
    try { window.close(); } catch (e) { /* ignore */ }
  };

  const iconSize = 32;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 2,
          p: { xs: 2, md: 3 },
          textAlign: "center",
          position: "relative"
        }}
      >
        <IconButton
          onClick={closeWindow}
          aria-label="close"
          size="large"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <Close />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Share this video
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Share the video using your preferred app or copy the link.
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
          <TextField
            value={shareableLink}
            placeholder="Shareable link"
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              readOnly: true,
              sx: { pr: 0 }
            }}
          />
          <Tooltip title="Copy link">
            <IconButton
              onClick={handleCopyLink}
              color="primary"
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                "&:hover": { bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.06)" }
              }}
              aria-label="copy-link"
              size="large"
            >
              <ContentCopy sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2, flexWrap: "wrap" }}>
          <Tooltip title="Share on Facebook">
            <IconButton
              onClick={() => openSocialMedia(PLATFORM.facebook.url(shareableLink))}
              aria-label="facebook"
              sx={{
                bgcolor: PLATFORM.facebook.color,
                color: "#fff",
                width: 64,
                height: 64,
                "&:hover": { bgcolor: "#145dbf" }
              }}
            >
              <Facebook sx={{ fontSize: iconSize }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share on Twitter">
            <IconButton
              onClick={() => openSocialMedia(PLATFORM.twitter.url(shareableLink))}
              aria-label="twitter"
              sx={{
                bgcolor: PLATFORM.twitter.color,
                color: "#fff",
                width: 64,
                height: 64,
                "&:hover": { bgcolor: "#1997e8" }
              }}
            >
              <Twitter sx={{ fontSize: iconSize }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share on LinkedIn">
            <IconButton
              onClick={() => openSocialMedia(PLATFORM.linkedin.url(shareableLink))}
              aria-label="linkedin"
              sx={{
                bgcolor: PLATFORM.linkedin.color,
                color: "#fff",
                width: 64,
                height: 64,
                "&:hover": { bgcolor: "#0958a8" }
              }}
            >
              <LinkedIn sx={{ fontSize: iconSize }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share on WhatsApp">
            <IconButton
              onClick={() => openSocialMedia(PLATFORM.whatsapp.url(shareableLink))}
              aria-label="whatsapp"
              sx={{
                bgcolor: PLATFORM.whatsapp.color,
                color: "#fff",
                width: 64,
                height: 64,
                "&:hover": { bgcolor: "#1ecb5b" }
              }}
            >
              <WhatsApp sx={{ fontSize: iconSize }} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button variant="contained" onClick={handleCopyLink} startIcon={<ContentCopy />} size="large">
            Copy Link
          </Button>
          <Button variant="outlined" onClick={closeWindow} size="large">
            Close
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SharePage;
