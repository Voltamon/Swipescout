
import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const FeatureCard = ({ icon, title, description, sx }) => {
  return (
    <Box
      className="feature-card"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6F0FA", 
        borderRadius: "16px", 
        padding: "24px", 
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
        textAlign: "center",
        minHeight: "200px",
        ...sx, 
      }}
    >
      <Box
        className="icon"
        sx={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(52.09deg, #5D9BCF 18%, #A9C4F3 98.44%)", // Gradient for the icon background
          margin: "0 auto",
        }}
      >
        <Avatar sx={{ background: "transparent", color: "white", fontSize: "24px" }}>
          {icon}
        </Avatar>
      </Box>
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          fontWeight: "bold", 
          color: "black",
          fontSize: "1.25rem", 
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "black",
          marginTop: 1,
          fontSize: "0.9rem", 
          lineHeight: 1.5, 
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default FeatureCard;