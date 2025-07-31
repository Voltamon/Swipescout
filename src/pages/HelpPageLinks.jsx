import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Link,
  useTheme,
  useMediaQuery,
  Grid
} from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";

// Custom Discord icon as an inline SVG to match MUI's style
const DiscordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24px"
    height="24px"
    aria-hidden="true"
  >
    <path d="M21.17,1.83a2.38,2.38,0,0,0-1.28-.79C17.75,0,14.63,0,11.5,0A22.82,22.82,0,0,0,1.72,1.15a2.37,2.37,0,0,0-1.28.79A2.37,2.37,0,0,0,0,2.94,22.39,22.39,0,0,0,1.3,16.27,2.37,2.37,0,0,0,2,17.43a2.38,2.38,0,0,0,1.28.79A22.82,22.82,0,0,0,11.5,19.34a22.82,22.82,0,0,0,8.22-1.12,2.38,2.38,0,0,0,1.28-.79,2.37,2.37,0,0,0,.72-1.16,22.39,22.39,0,0,0,1.3-13.33A2.37,2.37,0,0,0,21.17,1.83Zm-1.84,14.4a.79.79,0,0,1-.46.33,18.73,18.73,0,0,1-7.37,1,18.73,18.73,0,0,1-7.37-1,.79.79,0,0,1-.46-.33,18.84,18.84,0,0,1-.7-3.95A19.46,19.46,0,0,1,2.83,6.23a.79.79,0,0,1,.46-.33A18.73,18.73,0,0,1,11.5,5a18.73,18.73,0,0,1,7.37,1,.79.79,0,0,1,.46.33A19.46,19.46,0,0,1,20.08,12.3Z" />
    <path d="M12.91,12.35a2.4,2.4,0,0,1-1.39.46,2.4,2.4,0,0,1-1.39-.46,2.16,2.16,0,0,1-.39-.56,3.87,3.87,0,0,1-.13-.7,4.3,4.3,0,0,1,.13-.7,2.16,2.16,0,0,1,.39-.56A2.4,2.4,0,0,1,11.5,9.45a2.4,2.4,0,0,1,1.39.46,2.16,2.16,0,0,1,.39.56,3.87,3.87,0,0,1,.13.7,4.3,4.3,0,0,1-.13.7,2.16,2.16,0,0,1-.39.56Z" />
    <path d="M16.14,12.35a2.4,2.4,0,0,1-1.39.46,2.4,2.4,0,0,1-1.39-.46,2.16,2.16,0,0,1-.39-.56,3.87,3.87,0,0,1-.13-.7,4.3,4.3,0,0,1,.13-.7,2.16,2.16,0,0,1,.39-.56,2.4,2.4,0,0,1,1.39-.46,2.4,2.4,0,0,1,1.39.46,2.16,2.16,0,0,1,.39.56,3.87,3.87,0,0,1,.13.7,4.3,4.3,0,0,1-.13.7,2.16,2.16,0,0,1-.39.56Z" />
    <path d="M11.5,14.61a.7.7,0,0,1-.41-.12,5.77,5.77,0,0,1-1.5-.7,4.2,4.2,0,0,1-.7-.84.79.79,0,0,1,.16-.83.77.77,0,0,1,.71-.16.7.7,0,0,1,.41.12,4.55,4.55,0,0,0,1.07.56A4.55,4.55,0,0,0,12.5,12.9a.7.7,0,0,1,.41-.12.77.77,0,0,1,.71.16.79.79,0,0,1,.16.83,4.2,4.2,0,0,1-.7.84,5.77,5.77,0,0,1-1.5.7A.7.7,0,0,1,11.5,14.61Z" />
  </svg>
);

export default function HelpPageLinks() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const discordLink = "https://discord.gg/mHcdMn6yMh";

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
      {/* Main heading for the page */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: "bold",
          mb: 4,
          fontSize: isMobile ? '1.75rem' : '2.125rem',
          color: "#3366ff",
        }}
      >
        Help Center
      </Typography>

      {/* Introduction text */}
      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        We are here to help you get the most out of Swipscout. Whether you have a question, need technical support, or just want to connect with the community, you can reach out to us through the following channels.
      </Typography>

      <Grid container spacing={4}>
        {/* Email Support Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              height: "100%",
              borderRadius: "16px",
              boxShadow: theme.shadows[4],
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <EmailIcon sx={{ fontSize: 60, color: "#3366ff", mb: 2 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                Email Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                For general inquiries and technical assistance, please send us an email.
              </Typography>
              <Link
                href="mailto:info@swipescout.xyz"
                sx={{
                  textDecoration: "none",
                  fontWeight: "bold",
                  color: "#3366ff",
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                info@swipescout.xyz
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* Discord Community Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              height: "100%",
              borderRadius: "16px",
              boxShadow: theme.shadows[4],
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ color: "#7289DA", fontSize: 60, mb: 2 }}>
                <DiscordIcon />
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                Join Our Discord
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Connect with the community, get real-time help, and stay updated on all things Swipscout.
              </Typography>
              <Button
                variant="contained"
                href={discordLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: "#7289DA",
                  color: "#fff",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: "#677bc4",
                  },
                }}
              >
                Join Discord
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
