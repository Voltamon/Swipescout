/**
 * Centralized Theme Colors for Admin Dashboard
 * 
 * This file contains all color definitions for the admin dashboard.
 * Modify these values to customize the admin color scheme independently.
 * 
 * Color Scheme: Professional slate/emerald with authoritative amber accents
 */

export const themeColors = {
  // Gradient combinations for headers, buttons, etc.
  gradients: {
    primary: "from-slate-800 via-slate-900 to-black", // Main admin gradient
    secondary: "from-emerald-600 to-emerald-800", // Secondary actions
    success: "from-green-600 to-green-700", // Success states
    warning: "from-amber-500 to-orange-600", // Warnings/alerts
    danger: "from-red-600 to-rose-700", // Critical actions
    info: "from-blue-600 to-cyan-600", // Informational
    dark: "from-gray-800 to-black", // Dark elements
    light: "from-gray-100 to-slate-200" // Light backgrounds
  },

  // Background colors
  backgrounds: {
    page: "bg-gray-100",
    card: "bg-white",
    cardHover: "hover:bg-gray-50",
    dark: "bg-slate-900",
    light: "bg-slate-50"
  },

  // Text colors
  text: {
    primary: "text-slate-900",
    secondary: "text-slate-600",
    muted: "text-slate-500",
    inverse: "text-white",
    gradient:
      "bg-gradient-to-r from-slate-800 via-emerald-700 to-slate-900 bg-clip-text text-transparent"
  },

  // Border colors
  borders: {
    primary: "border-slate-800",
    secondary: "border-emerald-500",
    light: "border-gray-200",
    dark: "border-slate-700"
  },

  // Status colors for badges, indicators
  status: {
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    suspended: "bg-red-100 text-red-800 border-red-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-rose-100 text-rose-800 border-rose-200",
    warning: "bg-orange-100 text-orange-800 border-orange-200",
    info: "bg-blue-100 text-blue-800 border-blue-200"
  },

  // Badge styles
  badges: {
    default: "bg-slate-200 text-slate-800",
    primary: "bg-slate-800 text-white",
    secondary: "bg-emerald-100 text-emerald-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  },

  // Button variants
  buttons: {
    primary:
      "bg-gradient-to-r from-slate-800 via-slate-900 to-black hover:from-slate-900 hover:to-black",
    secondary:
      "bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900",
    success:
      "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
    warning:
      "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800",
    outline: "border-2 border-slate-800 text-slate-800 hover:bg-slate-100"
  },

  // Chart colors for analytics (Chart.js compatible)
  charts: {
    line: {
      borderColor: "rgba(30, 41, 59, 1)", // slate-800
      backgroundColor: "rgba(30, 41, 59, 0.1)",
      pointBackgroundColor: "rgba(5, 150, 105, 1)", // emerald-600
      pointBorderColor: "#fff"
    },
    bar: {
      backgroundColor: [
        "rgba(30, 41, 59, 0.9)", // slate-800
        "rgba(5, 150, 105, 0.9)", // emerald-600
        "rgba(217, 119, 6, 0.9)", // amber-600
        "rgba(220, 38, 38, 0.9)", // red-600
        "rgba(29, 78, 216, 0.9)" // blue-700
      ],
      borderColor: [
        "rgba(30, 41, 59, 1)",
        "rgba(5, 150, 105, 1)",
        "rgba(217, 119, 6, 1)",
        "rgba(220, 38, 38, 1)",
        "rgba(29, 78, 216, 1)"
      ],
      borderWidth: 1
    },
    doughnut: {
      backgroundColor: [
        "rgba(30, 41, 59, 0.9)", // slate-800
        "rgba(5, 150, 105, 0.9)", // emerald-600
        "rgba(217, 119, 6, 0.9)", // amber-600
        "rgba(220, 38, 38, 0.9)", // red-600
        "rgba(29, 78, 216, 0.9)", // blue-700
        "rgba(75, 85, 99, 0.9)" // gray-600
      ],
      borderColor: "#fff",
      borderWidth: 2
    }
  },

  // Icon background colors (for stat cards)
  iconBackgrounds: {
    primary: "bg-slate-200 text-slate-800",
    secondary: "bg-emerald-100 text-emerald-800",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700"
  },

  // Shadow utilities
  shadows: {
    card: "shadow-lg shadow-slate-200/50",
    cardHover: "hover:shadow-xl hover:shadow-slate-300/50",
    glow: "shadow-2xl shadow-emerald-500/20"
  }
};

/**
 * Helper function to get gradient class
 */
export const getGradient = (type = "primary") => {
  return themeColors.gradients[type] || themeColors.gradients.primary;
};

/**
 * Helper function to get badge class
 */
export const getBadgeClass = (variant = "default") => {
  return themeColors.badges[variant] || themeColors.badges.default;
};

/**
 * Helper function to get status class
 */
export const getStatusClass = status => {
  return themeColors.status[status] || themeColors.status.info;
};

/**
 * Helper function to get button class
 */
export const getButtonClass = (variant = "primary") => {
  return themeColors.buttons[variant] || themeColors.buttons.primary;
};

export default themeColors;
