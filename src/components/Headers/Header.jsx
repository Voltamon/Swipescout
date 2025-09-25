import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';

const Header = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo Section */}
        <div className="logo">
          <img
            src={`${VITE_BASE_URL}/public/logoT.png`}
            alt="SwipeScout Logo"
            className="logo-img"
          />
          <Link to="/" className="logo-text">
            Swipe<span className="scout">scout</span>
            <span className="tagline">Your next career starts here</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About Us</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contact</NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>How SwipeScout Works</NavLink>
          <NavLink to="/FAQs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>FAQ</NavLink>
          <Link to="#" className="nav-link">Credits</Link>
          <NavLink to="/customer-support" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Customer Support</NavLink>
        </nav>

        {/* Login Button and Avatar */}
        <div className="header-actions">
          {!user || !user.id ? (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          ) : (
            <>
              <div className="user-avatar" onClick={handleMenuOpen}>
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>

              {/* Simple dropdown menu */}
              {open && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={handleMenuClose}>Profile Settings</div>
                  <div className="dropdown-item" onClick={handleMenuClose}>Account</div>
                  <div className="dropdown-item" onClick={handleMenuClose}>Help Center</div>
                  <div className="dropdown-item" onClick={handleLogout}>Logout</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="menu-toggle">
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;