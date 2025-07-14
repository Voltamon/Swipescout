import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
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

const StyledFooter = styled(Box)({
  background:
    "linear-gradient(170deg, rgba(1, 58, 68, 0.9) 0%, rgba(96, 159, 196, 0.85) 70%)",
  color: "#e2e8f0",
  padding: "64px 24px",
  textAlign: "center"
});

const FooterLink = styled(Link)({
  color: "#f8fafc",
  textDecoration: "none",
  fontSize: "1rem",
  fontWeight: 600,
  transition: "color 0.2s ease-in-out",
  "&:hover": {
    color: "#fbbf24"
  }
});

const SocialButton = styled(IconButton)({
  color: "#f8fafc",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
    color: "#fbbf24"
  }
});

const Footer = () => {
  return (
    <StyledFooter>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 3
        }}
      >
        <FooterLink href="/about" underline="hover">
          About Us
        </FooterLink>
        <FooterLink href="#" underline="hover">
          Customer Support
        </FooterLink>
        <FooterLink href="#" underline="hover">
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
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ color: "#dbeafe", mb: 3 }}>
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
          gap: 4,
          mb: 4,
          flexWrap: "wrap"
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "#dbeafe", display: "flex", alignItems: "center" }}
        >
          <CheckCircle sx={{ color: "#4ade80", mr: 1, fontSize: "1rem" }} />
          Verified Companies
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "#dbeafe", display: "flex", alignItems: "center" }}
        >
          <TrendingUp sx={{ color: "#60a5fa", mr: 1, fontSize: "1rem" }} />
          87% Success Rate
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "#dbeafe", display: "flex", alignItems: "center" }}
        >
          <People sx={{ color: "#f59e0b", mr: 1, fontSize: "1rem" }} />
          24/7 Support
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ color: "#dbeafe" }}>
        © {new Date().getFullYear()} SwipeScout. All rights reserved.
      </Typography>
    </StyledFooter>
  );
};

export default Footer;
