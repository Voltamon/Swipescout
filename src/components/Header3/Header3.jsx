import React from "react";
import logo from "../../assets/logo.png";
import { FaInstagram, FaYoutube, FaTwitter, FaDribbble } from "react-icons/fa";
import "./Header3.css";

const Header3 = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo" />
        <p>SwipeScout</p>
      </div>
      <nav className="nav">
        <a href="#">News</a>
        <a href="#">FAQs</a>
        <a href="#">About</a>
      </nav>
      <div className="social-icons">
        <a href="#">
          <FaInstagram />
        </a>
        <a href="#">
          <FaDribbble />
        </a>
        <a href="#">
          <FaTwitter />
        </a>
        <a href="#">
          <FaYoutube />
        </a>
      </div>
    </header>
  );
};

export default Header3;

