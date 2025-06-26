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
import "./Header.css";
import { Box } from "@mui/material";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return <><header className="header" sx={{mb:6 ,width:'100%'}}>
      <div className="logo" onClick={() => navigate("/home-page")}>
        <img src={logo} alt="Logo" />
        <p style={{ cursor: "pointer" }}>SwipeScout</p>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <Link className="nav-link" to="/About">
          Categories..
        </Link>
        

      </nav>

      <div className="social-icons">
        <a href="#">
          
       
        </a>
      </div>
    </header>
    <br/>
    </> ;
};

export default Header;
