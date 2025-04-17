import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaDribbble,
  FaBars,
  FaTimes
} from "react-icons/fa";
import "./Header3.css";

const Header3 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" />
        <p style={{ cursor: "pointer" }}>SwipeScout</p>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <Link className="nav-link" to="/About">
          About
        </Link>
        <Link className="nav-link" to="/FAQs">
          FAQs
        </Link>
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
