import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Link,
  IconButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(to right, #1a032a, #003366)",
        padding: { xs: "20px", md: "50px 20px" },
        color: "#021024",
        textAlign: "center",
        position: "relative",
        margin: "100px auto 0",
      }}
    >
      <Card
        sx={{
          background: "#5d9bcf",
          color: "#021024",
          borderRadius: "20px",
          padding: { xs: "10px", sm: "15px", md: "30px" },
          textAlign: "center",
          width: { xs: "95%", sm: "90%", md: "70%", lg: "50%" },
          margin: "0 auto",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          position: "absolute",
          left: "50%",
          top: { xs: "-80px", sm: "-50px", md: "-60px", lg: "-80px" },
          transform: "translateX(-50%)",
        }}
      >
        <Typography variant="h5" sx={{ color: "#021024" }}>
          Sign up for our Newsletter
        </Typography>
        <Typography variant="body2">
          We’ll mail you once a month with updates about SwipeScout
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: "10px",
          }}
        >
          <TextField
            placeholder="Your e-mail"
            type="email"
            variant="outlined"
            size="small"
            sx={{
              width: { xs: "85%", sm: "80%", md: "70%", lg: "60%" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                background: "white",
              },
            }}
          />
          <Button
            sx={{
              background: "white",
              borderRadius: "50%",
              minWidth: "40px",
              height: "40px",
              ml: "10px",
              "&:hover": { background: "white" },
            }}
          >
            <ArrowForwardIcon />
          </Button>
        </Box>
      </Card>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          maxWidth: "1100px",
          margin: { xs: "80px auto 0", md: "150px auto 0" },
          padding: "20px",
          color: "#5d9bcf",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Typography variant="h6" sx={{ color: "#5d9bcf" }}>
            SwipeScout
          </Typography>
          <Typography variant="body2">
            Find your job/employees faster, better.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "20px",
            flexDirection: { xs: "column", md: "row" },
            mt: { xs: "10px", md: 0 },
          }}
        >
          <Link href="#" underline="none" sx={{ color: "#5d9bcf", fontWeight: "bold" }}>
            About
          </Link>
          <Link href="#" underline="none" sx={{ color: "#5d9bcf", fontWeight: "bold" }}>
            News
          </Link>
          <Link href="#" underline="none" sx={{ color: "#5d9bcf", fontWeight: "bold" }}>
            FAQs
          </Link>
          <Link href="#" underline="none" sx={{ color: "#5d9bcf", fontWeight: "bold" }}>
            Contact Us
          </Link>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          fontSize: { xs: "16px", md: "20px" },
          mt: "20px",
          color: "#5d9bcf",
        }}
      >
        <IconButton sx={{ color: "#5d9bcf" }}>
          <FaInstagram />
        </IconButton>
        <IconButton sx={{ color: "#5d9bcf" }}>
          <FaFacebookF />
        </IconButton>
        <IconButton sx={{ color: "#5d9bcf" }}>
          <FaTwitter />
        </IconButton>
        <IconButton sx={{ color: "#5d9bcf" }}>
          <FaYoutube />
        </IconButton>
      </Box>

      <Typography
        variant="body2"
        sx={{
          mt: "20px",
          fontSize: { xs: "12px", md: "14px" },
          color: "#5d9bcf",
        }}
      >
        © 2025 SwipeScout. All rights reserved
      </Typography>
    </Box>
  );
};

export default Footer;