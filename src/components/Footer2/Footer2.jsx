import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div>
          <h3>SwipeScout</h3>
          <p>Find your job/employees faster, better.</p>
        </div>

        <div className="footer-links">
          <Link to="/About">About</Link>
          <Link to="/FAQs">FAQs</Link>
          <Link to="#">Contact Us</Link>
        </div>
      </div>

      <div className="social-icons">
        <a href="#">
          <FaInstagram />
        </a>
        <a href="#">
          <FaFacebookF />
        </a>
        <a href="#">
          <FaTwitter />
        </a>
        <a href="#">
          <FaYoutube />
        </a>
      </div>

      <p className="copyright">© 2025 SwipeScout. All rights reserved</p>
    </footer>
  );
};

export default Footer;
