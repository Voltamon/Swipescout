import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { FaInstagram, FaYoutube, FaTwitter, FaDribbble } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";   
import "./Header3.css";

const Header3 = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <p>SwipeScout</p>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <a href="#">News</a>
        <a href="#">FAQs</a>
        <a href="#">About</a>
      </nav>

      <div className="social-icons">
        <a href="#"><FaInstagram /></a>
        <a href="#"><FaDribbble /></a>
        <a href="#"><FaTwitter /></a>
        <a href="#"><FaYoutube /></a>
      </div>
    </header>
  );
};

export default Header3;
