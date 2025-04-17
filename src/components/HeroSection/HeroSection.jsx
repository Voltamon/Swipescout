import React from "react";
import "./HeroSection.css";
import phoneImage from "../../assets/phone.png";

const HeroSection = () => {
  return (
    <section className="hero-landing-page">
      <div className="hero-text">
        <h1>Swipe Scout</h1>
        <h2>Introducing Smart Video Recruitment</h2>
        <p>
          SwipeScout replaces boring resumes with 15–45 second video pitches
          that let job seekers show off their personality, skills, and
          confidence. Employers swipe through talent fast, make smarter
          decisions, and connect instantly—all in a format today’s generation
          actually enjoys.
        </p>
        <div className="hero-buttons" />
      </div>
      <div className="hero-image">
        <img src={phoneImage} alt="App Preview" />
      </div>
    </section>
  );
};

export default HeroSection;
