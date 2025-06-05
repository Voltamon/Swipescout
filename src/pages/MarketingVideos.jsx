import React from "react";
import {
  Box,
  useTheme,
  Typography,
  Stack,
  Grid,
  Paper,
  Card,
  CardContent, Container
} from "@mui/material";
import Header2 from "../components/Header2";
import MovieIcon from '@mui/icons-material/Movie';


const MarketingVideos = () => {
  const theme = useTheme();

  const videos = [
    {
      url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1749054422/1_cnbtm5.mp4",
      title: "Me and Swipescout"
    },
    {
      url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1749054422/4_fjx3qm.mp4",
      title: "Why Korea"
    },
    {
      url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1749054422/3_ciur80.mp4",
      title: "Idea"
    },
    {
      url: "https://res.cloudinary.com/djfvfxrsh/video/upload/v1749054422/2_jr5boo.mp4",
      title: "Current Way"
    }
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%), url('/backgrounds/bkg1.png')`, // Make sure this path is correct
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top right',
        padding: theme.spacing(4),
        minHeight: '100vh',
        width: '100%', // Ensure the main Box takes full width
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

      {/* Use Container to constrain content width on larger screens and center it */}
      <Container maxWidth="lg"> {/* Set maxWidth to lg or xl as needed. "lg" is 1200px, "xl" is 1536px */}
        <Grid container spacing={3} justifyContent="center">
          {videos.map((video, index) => (
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} key={index}>
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
                  },
                  // Ensure card can shrink as needed within its grid item
                  width: '100%',
                  minWidth: 0, // Important for flex items within grid
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
                      width: '100%', // Make video responsive within its parent
                      height: 'auto',
                      display: 'block',
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                      minWidth: 0, // Prevent video from pushing layout due to intrinsic width
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
      </Container>
    </Box>
  );
};

export default MarketingVideos;