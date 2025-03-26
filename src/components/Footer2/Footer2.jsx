import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Footer.css";    

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="newsletter-card">
        <h2>Sign up for our Newsletter</h2>
        <p>We’ll mail you once a month with updates about SwipeScout</p>
        <div className="email-form">
          <input type="email" placeholder="Your e-mail" className="email-input" />
          <button className="arrow-button">➜</button>
        </div>
      </div>

      <div className="footer-content">
        <div>
          <h3>SwipeScout</h3>
          <p>Find your job/employees faster, better.</p>
        </div>

        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">News</a>
          <a href="#">FAQs</a>
          <a href="#">Contact Us</a>
        </div>
      </div>

      <div className="social-icons">
        <FaInstagram />
        <FaFacebookF />
        <FaTwitter />
        <FaYoutube />
      </div>

      <p className="copyright">© 2025 SwipeScout. All rights reserved</p>
    </footer>
  );
};

export default Footer;
