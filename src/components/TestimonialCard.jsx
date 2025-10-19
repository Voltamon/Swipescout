
import React, { useContext } from "react";
import { Box, Typography, Avatar } from "@mui/material";


const TestimonialCard = ({ image, name, role, testimonial }) => {
  return (
    <Box
      className="testimonial-card"
      sx={{
        width: '300px',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        background: '#ffffff',
        color: 'black',
      }}
    >
      {image && (
        <Avatar
          src={image}
          alt={name}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '200px',
            objectFit: 'cover',
            borderRadius: '10px',
            marginBottom: '15px',
          }}
        />
      )}
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'gray', marginBottom: '10px' }}>
        {role}
      </Typography>
      <Typography variant="body1">{testimonial}</Typography>
    </Box>
  );
};

export default TestimonialCard;
