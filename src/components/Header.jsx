import React, { useContext } from 'react';
import { useTheme } from '../hooks/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>SwipeScout</h1>
        </div>
        <nav className="navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/jobs">Jobs</a></li>
            <li><a href="/candidates">Candidates</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? 'ًںŒ™' : 'âک€ï¸ڈ'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

