import React from "react";

import "./Signfornews.css";    

const Signfornews = () => {
  return (
    <footer className="footer-container">
      <div className="newsletter-card">
        <h2>Sign up for our News</h2>
        <p>We’ll mail you once a month with updates about SwipeScout</p>
        <div className="email-form">
          <input type="email" placeholder="Your e-mail" className="email-input" />
          <button className="arrow-button">➜</button>
        </div>
      </div>
      </footer>);
};

export default Signfornews;