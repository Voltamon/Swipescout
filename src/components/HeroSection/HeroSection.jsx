import React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import phoneImage from "../../assets/phone.png";

// ====== Styled Components ======

const Hero = styled("section")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  paddingTop: "70px",
  background: "linear-gradient(to right, #1a032a, #003366)",
  color: "#5D9BCF",
  [theme.breakpoints.down("900")]: {
    flexDirection: "column",
    textAlign: "center",
    padding: "0px",
  },
}));

const HeroText = styled(Box)(({ theme }) => ({
  maxWidth: "50%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  marginTop: 0, 
  [theme.breakpoints.down("900")]: {
    maxWidth: "100%",
    marginTop: "20px", 
  },
}));

const H1 = styled("h1")({
  fontSize: "48px",
  fontWeight: "bold",
  margin: 0,
});

const H2 = styled("h2")({
  fontSize: "32px",
  fontWeight: "bold",
  color: "#5D9BCF",
  margin: "10px 0",
});

const P = styled("p")({
  fontSize: "18px",
  margin: "10px 0",
  maxWidth: "500px",
});

const HeroButtons = styled(Box)({
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  gap: "15px",
});

const PrimaryBtn = styled(Button)({
  background: "#5D9BCF",
  color: "white",
  padding: "12px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#4a8bb8",
  },
});

const SecondaryBtn = styled(Button)({
  background: "transparent",
  border: "2px solid #5D9BCF",
  color: "#5D9BCF",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(93, 155, 207, 0.1)",
  },
});

const HeroImage = styled("img")(({ theme }) => ({
  maxWidth: "300px",
  margin: 0,
  [theme.breakpoints.down("900")]: {
    maxWidth: "250px",
    marginTop: "20px",
  },
}));

// ====== Component ======

const HeroSection = () => {
  return (
    <Hero>
      <HeroText>
        <H1>Swipe Scout</H1>
        <H2>something something</H2>
        <P>
          From the small stuff to the big picture, organizes the work so teams
          know what to do, why it matters, and how to get it done.
        </P>
        <HeroButtons>
          <PrimaryBtn>Sign up for Newsletter</PrimaryBtn>
          <SecondaryBtn>Donate</SecondaryBtn>
        </HeroButtons>
      </HeroText>
      <Box className="hero-image">
        <HeroImage src={phoneImage} alt="App Preview" />
      </Box>
    </Hero>
  );
};

export default HeroSection;
