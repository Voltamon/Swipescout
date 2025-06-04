import React from "react";
import {
  Box,
  useTheme,
  Typography,
  Stack,
  Grid,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import Header2 from "../components/Header2";

const MarketingVideos = () => {
  const theme = useTheme();

  const videos = [
    {
      url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1749054422/4_fjx3qm.mp4",
      title: "Company Culture"
    },
    {
      url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1749054422/2_jr5boo.mp4",
      title: "Our Products"
    },
    {
      url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1749054422/3_ciur80.mp4",
      title: "Customer Stories"
    },
    {
      url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1749054422/1_cnbtm5.mp4",
      title: "Brand Overview"
    }
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%), url('/backgrounds/bkg1.png')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top right',
        padding: theme.spacing(4),
        minHeight: '100vh',
      }}
    >
      <Typography 
        variant="h3" 
        align="center" 
        sx={{ 
          mt: 4, 
          mb: 6,
          fontWeight: 'bold',
          color: "rgba(172, 214, 238, 0.9)",
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        Marketing Videos
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {videos.map((video, index) => (
          <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
            <Card 
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6
                }
              }}
            >
              <Typography 
                variant="h6" 
                align="center" 
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 'bold'
                }}
              >
                {video.title}
              </Typography>
              <CardContent sx={{ flexGrow: 1, p: 0 }}>
                <video
                  controls
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8
                  }}
                >
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MarketingVideos;