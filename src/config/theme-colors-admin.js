/**
 * Centralized Theme Colors for Admin Dashboard
 * 
 * This file contains all color definitions for the admin dashboard.
 * Modify these values to customize the admin color scheme independently.
 * 
 * Color Scheme: Professional slate/emerald with authoritative amber accents
 */

const themeColors = {
  // Gradient combinations for headers, buttons, etc.
  gradients: {
    primary: "from-slate-700 to-emerald-700", // Main admin gradient
    secondary: "from-indigo-600 to-blue-600", // Secondary actions
    success: "from-emerald-600 to-green-600", // Success states
    warning: "from-amber-600 to-orange-600", // Warnings/alerts
    danger: "from-red-600 to-rose-600", // Critical actions
    info: "from-blue-600 to-cyan-600", // Informational
    dark: "from-slate-800 to-gray-900", // Dark elements
    light: "from-gray-100 to-slate-200" // Light backgrounds
  },

  // Background colors
  backgrounds: {
    page: "bg-gray-50",
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
      "bg-gradient-to-r from-slate-700 to-emerald-700 bg-clip-text text-transparent"
  },

  // Border colors
  borders: {
    primary: "border-emerald-500",
    secondary: "border-slate-300",
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
    default: "bg-slate-100 text-slate-800",
    primary: "bg-emerald-100 text-emerald-800",
    secondary: "bg-indigo-100 text-indigo-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  },

  // Button variants
  buttons: {
    primary:
      "bg-gradient-to-r from-slate-700 to-emerald-700 hover:from-slate-800 hover:to-emerald-800",
    secondary:
      "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700",
    success:
      "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700",
    warning:
      "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700",
    outline: "border-2 border-slate-700 text-slate-700 hover:bg-slate-50"
  },

  // Chart colors for analytics (Chart.js compatible)
  charts: {
    line: {
      borderColor: "rgba(71, 85, 105, 1)", // slate-600
      backgroundColor: "rgba(71, 85, 105, 0.1)",
      pointBackgroundColor: "rgba(16, 185, 129, 1)", // emerald-500
      pointBorderColor: "#fff"
    },
    bar: {
      backgroundColor: [
        "rgba(71, 85, 105, 0.8)", // slate-600
        "rgba(16, 185, 129, 0.8)", // emerald-500
        "rgba(79, 70, 229, 0.8)", // indigo-600
        "rgba(245, 158, 11, 0.8)", // amber-500
        "rgba(239, 68, 68, 0.8)" // red-500
      ],
      borderColor: [
        "rgba(71, 85, 105, 1)",
        "rgba(16, 185, 129, 1)",
        "rgba(79, 70, 229, 1)",
        "rgba(245, 158, 11, 1)",
        "rgba(239, 68, 68, 1)"
      ],
      borderWidth: 1
    },
    doughnut: {
      backgroundColor: [
        "rgba(71, 85, 105, 0.8)", // slate-600
        "rgba(16, 185, 129, 0.8)", // emerald-500
        "rgba(79, 70, 229, 0.8)", // indigo-600
        "rgba(245, 158, 11, 0.8)", // amber-500
        "rgba(239, 68, 68, 0.8)", // red-500
        "rgba(59, 130, 246, 0.8)" // blue-500
      ],
      borderColor: "#fff",
      borderWidth: 2
    }
  },

  // Icon background colors (for stat cards)
  iconBackgrounds: {
    primary: "bg-slate-100 text-slate-700",
    secondary: "bg-emerald-100 text-emerald-700",
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
