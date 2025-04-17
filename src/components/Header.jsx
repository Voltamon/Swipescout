import React from "react";

const Header = () => {
  return (
    <header>
      <div className="app-container">
        <div className="logo">Swipscout</div>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/About">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
           
            <li>
              <a href="/signin" className="btn-primary">
                Sign In
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
