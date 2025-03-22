import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms">Terms and Conditions</a>
        </div>
        <div className="social-icons">
          <a href="#">
            <i className="fab fa-facebook" />
          </a>
          <a href="#">
            <i className="fab fa-twitter" />
          </a>
          <a href="#">
            <i className="fab fa-linkedin" />
          </a>
        </div>
        <p>© 2025 Swipscout. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
