import React from "react";
import {
  Box,
  Typography,
  Link,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  CheckCircle,
  TrendingUp,
  People
} from "@mui/icons-material";
import { styled } from "@mui/system";

const StyledFooter = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.dark, // Dark primary color for footer
  color: theme.palette.primary.contrastText, // White text
  padding: theme.spacing(6, 3), // Generous padding
  textAlign: "center",
  borderRadius: theme.shape.borderRadius, // Apply global border radius
  boxShadow: theme.shadows[4], // More prominent shadow
  margin: theme.spacing(2), // Add margin for a floating effect
  width: `calc(100% - ${theme.spacing(5)})`, // Account for margin
  left: "49%",
  transform: "translateX(-50%)", // Center the footer
  position: "relative" // Ensure position for pseudo-elements if any
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText, // White links
  textDecoration: "none",
  fontSize: "1rem",
  fontWeight: 600,
  transition: "color 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.secondary.light // Light secondary on hover
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText, // White icons
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
    color: theme.palette.secondary.light // Light secondary on hover
  },
  backgroundColor: "rgba(255,255,255,0.1)", // Subtle background
  borderRadius: theme.shape.borderRadius // Rounded buttons
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledFooter>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: { xs: 2, md: 3 } // Responsive gap
        }}
      >
        <FooterLink href="/about" underline="hover">
          About Us
        </FooterLink>
        <FooterLink href="/customer-support" underline="hover">
          Customer Support
        </FooterLink>
        <FooterLink href="/contact" underline="hover">
          Contact
        </FooterLink>
        <FooterLink href="/how-it-works" underline="hover">
          How SwipeScout Works
        </FooterLink>
        <FooterLink href="/FAQs" underline="hover">
          FAQ
        </FooterLink>
        <FooterLink href="#" underline="hover">
          Credits
        </FooterLink>
        <FooterLink href="#" underline="hover">
          Privacy Policy
        </FooterLink>
        <FooterLink href="#" underline="hover">
          Terms and Conditions
        </FooterLink>
        <FooterLink href="#" underline="hover">
          Cookie Policy
        </FooterLink>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body1"
          sx={{ color: theme.palette.primary.contrastText + "CC", mb: 3 }}
        >
          Join our community of professionals
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <SocialButton href="#">
            <Facebook />
          </SocialButton>
          <SocialButton href="#">
            <Twitter />
          </SocialButton>
          <SocialButton href="#">
            <LinkedIn />
          </SocialButton>
          <SocialButton href="#">
            <Instagram />
          </SocialButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: { xs: 2, md: 4 }, // Responsive gap
          mb: 4,
          flexWrap: "wrap"
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.primary.contrastText + "CC",
            display: "flex",
            alignItems: "center"
          }}
        >
          <CheckCircle
            sx={{ color: theme.palette.success.main, mr: 1, fontSize: "1rem" }}
          />{" "}
          {/* Green for success */}
          Verified Companies
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.primary.contrastText + "CC",
            display: "flex",
            alignItems: "center"
          }}
        >
          <TrendingUp
            sx={{ color: theme.palette.info.main, mr: 1, fontSize: "1rem" }}
          />{" "}
          {/* Blue for info */}
          87% Success Rate
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.primary.contrastText + "CC",
            display: "flex",
            alignItems: "center"
          }}
        >
          <People
            sx={{ color: theme.palette.warning.main, mr: 1, fontSize: "1rem" }}
          />{" "}
          {/* Orange for warning/attention */}
          24/7 Support
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{ color: theme.palette.primary.contrastText + "CC" }}
      >
        © {new Date().getFullYear()} SwipeScout. All rights reserved.
      </Typography>
    </StyledFooter>
  );
};

export default Footer;
