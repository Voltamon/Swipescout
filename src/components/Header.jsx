import React from "react";

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="logo">Swipscout</div>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/signup" className="btn-primary">
                Sign Up
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
