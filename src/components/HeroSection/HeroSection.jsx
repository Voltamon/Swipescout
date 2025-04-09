import React from "react";
import "./HeroSection.css";
import phoneImage from "../../assets/phone.png";    

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Swipe Scout</h1>
        <h2>something something</h2>
        <p>
          From the small stuff to the big picture, organizes the work so teams
          know what to do, why it matters, and how to get it done.
        </p>
        <div className="hero-buttons">
          <button className="primary-btn">Sign up for News</button>
        </div>
      </div>
      <div className="hero-image">
        <img src={phoneImage} alt="App Preview" />
      </div>
    </section>
  );
};

export default HeroSection;
