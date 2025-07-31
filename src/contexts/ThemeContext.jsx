import React, { createContext, useState, useContext } from 'react';

// Utility function to get dynamic classes based on bright mode
const getDynamicClasses = (isBrightMode) => ({
  // General backgrounds
  appBg: isBrightMode ? 'bg-gray-50' : 'bg-gray-900',
  headerBg: isBrightMode ? 'bg-white' : 'bg-gray-800',
  sidebarBg: isBrightMode ? 'bg-white' : 'bg-gray-800',
  pageContainerBg: isBrightMode ? 'bg-white' : 'bg-gray-800',
  innerSectionBg: isBrightMode ? 'bg-gray-100' : 'bg-gray-700',
  listItemBg: isBrightMode ? 'bg-gray-200' : 'bg-gray-600',
  videoPlayerBg: isBrightMode ? 'bg-gray-200' : 'bg-gray-900',
  timelineBg: isBrightMode ? 'bg-gray-200' : 'bg-gray-900',
  progressBarBg: isBrightMode ? 'bg-blue-600' : 'bg-blue-500',
  playheadBg: isBrightMode ? 'bg-blue-500' : 'bg-blue-400',
  fileInputBg: isBrightMode ? 'file:bg-blue-100' : 'file:bg-blue-50',
  fileInputHoverBg: isBrightMode ? 'hover:file:bg-blue-200' : 'hover:file:bg-blue-100',

  // Footer specific colors - Matches header background
  footerBg: isBrightMode ? 'bg-white' : 'bg-gray-800',
  footerText: isBrightMode ? 'text-gray-700' : 'text-gray-300',
  footerLinkHover: isBrightMode ? 'hover:text-blue-600' : 'hover:text-blue-300',
  footerBorder: isBrightMode ? 'border-gray-300' : 'border-gray-700',
  footerIconBg: isBrightMode ? 'bg-gray-300' : 'bg-gray-700',
  footerIconHoverBg: isBrightMode ? 'hover:bg-gray-400' : 'hover:bg-gray-600',
  footerIconColor: isBrightMode ? 'text-gray-800' : 'text-white',
  footerBrandColor: isBrightMode ? 'text-blue-700' : 'text-blue-400',
  footerBrandAccent: isBrightMode ? 'text-blue-600' : 'text-blue-300',

  // Text colors
  primaryText: isBrightMode ? 'text-gray-900' : 'text-white',
  secondaryText: isBrightMode ? 'text-gray-700' : 'text-gray-300',
  tertiaryText: isBrightMode ? 'text-gray-600' : 'text-gray-400',
  quaternaryText: isBrightMode ? 'text-gray-500' : 'text-gray-500',
  blueTextPrimary: isBrightMode ? 'text-blue-700' : 'text-blue-400',
  blueTextSecondary: isBrightMode ? 'text-blue-600' : 'text-blue-300',
  greenText: isBrightMode ? 'text-green-600' : 'text-green-400',

  // Button colors
  buttonBg: isBrightMode ? 'bg-blue-600' : 'bg-blue-600',
  buttonHoverBg: isBrightMode ? 'hover:bg-blue-700' : 'hover:bg-blue-700',
  disabledButtonBg: isBrightMode ? 'bg-gray-300' : 'bg-gray-500',

  // Borders
  borderPrimary: isBrightMode ? 'border-gray-300' : 'border-gray-600',
  borderBlue: isBrightMode ? 'border-blue-700' : 'border-blue-400',

  // Icon colors
  iconColor: isBrightMode ? '#4f46e5' : '#a78bfa',

  // Common transition for all elements
  transition: 'transition-colors duration-300 ease-in-out',

  // Dynamic hover background colors for interactive elements
  hoverBg: isBrightMode ? 'hover:bg-gray-100' : 'hover:bg-gray-700',
  hoverBgDarker: isBrightMode ? 'hover:bg-gray-200' : 'hover:bg-gray-600',
});

// Create the context
const ThemeContext = createContext(null);

// Create a custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Create the ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [isBrightMode, setIsBrightMode] = useState(false); // Default to dark mode
  const classes = getDynamicClasses(isBrightMode);

  const value = {
    isBrightMode,
    setIsBrightMode,
    classes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
