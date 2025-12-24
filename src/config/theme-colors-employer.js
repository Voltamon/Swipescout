/**
 * Centralized Theme Colors Configuration
 * 
 * Change colors here and they will be applied across all pages.
 * All gradients, backgrounds, and UI colors are defined in one place.
 * for employer
 */

export const themeColors = {
  // Primary brand gradients - corporate and strong (deep blues and slate)
  gradients: {
    primary: "from-blue-700 via-blue-800 to-gray-900",
    primaryHover: "from-blue-800 via-blue-900 to-black",
    secondary: "from-slate-600 to-slate-800",
    success: "from-green-500 to-emerald-600",
    warning: "from-amber-500 to-orange-600",
    danger: "from-red-500 to-rose-600",
    info: "from-sky-500 to-blue-600",
    dark: "from-slate-800 to-slate-900",
    light: "from-slate-100 to-slate-200"
  },

  // Background colors
  backgrounds: {
    page: "bg-slate-100",
    card: "bg-white",
    cardHover: "hover:bg-slate-50",
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
      "bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 bg-clip-text text-transparent"
  },

  // Border colors
  borders: {
    default: "border-slate-200",
    light: "border-slate-100",
    dark: "border-slate-800",
    primary: "border-blue-700",
    gradient:
      "border-2 border-transparent bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900"
  },

  // Status colors
  status: {
    success: "text-green-600 bg-green-50",
    warning: "text-amber-600 bg-amber-50",
    error: "text-red-600 bg-red-50",
    info: "text-blue-600 bg-blue-50",
    pending: "text-orange-600 bg-orange-50"
  },

  // Badge colors
  badges: {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-slate-100 text-slate-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-sky-100 text-sky-800",
    gray: "bg-slate-100 text-slate-800"
  },

  // Button colors (for gradient buttons)
  buttons: {
    primary:
      "bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 hover:from-blue-800 hover:via-blue-900 hover:to-black",
    secondary:
      "bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900",
    success:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
    outline: "border-2 border-blue-700 text-blue-700 hover:bg-blue-50"
  },

  // Chart.js color configurations
  charts: {
    line: {
      primary: {
        borderColor: "rgba(29, 78, 216, 1)", // blue-700
        backgroundColor: "rgba(29, 78, 216, 0.1)",
        pointBackgroundColor: "rgba(29, 78, 216, 1)",
        pointBorderColor: "#fff"
      },
      secondary: {
        borderColor: "rgba(51, 65, 85, 1)", // slate-700
        backgroundColor: "rgba(51, 65, 85, 0.1)",
        pointBackgroundColor: "rgba(51, 65, 85, 1)",
        pointBorderColor: "#fff"
      },
      success: {
        borderColor: "rgba(34, 197, 94, 1)", // green-500
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff"
      }
    },
    bar: {
      primary: "rgba(29, 78, 216, 0.8)", // blue-700
      secondary: "rgba(51, 65, 85, 0.8)", // slate-700
      success: "rgba(34, 197, 94, 0.8)", // green-500
      warning: "rgba(245, 158, 11, 0.8)", // amber-500
      danger: "rgba(239, 68, 68, 0.8)" // red-500
    },
    doughnut: [
      "rgba(29, 78, 216, 0.8)", // blue-700
      "rgba(30, 64, 175, 0.8)", // blue-800
      "rgba(17, 24, 39, 0.8)", // gray-900
      "rgba(34, 197, 94, 0.8)", // green-500
      "rgba(245, 158, 11, 0.8)", // amber-500
      "rgba(239, 68, 68, 0.8)" // red-500
    ],
    doughnutBorders: [
      "rgba(29, 78, 216, 1)",
      "rgba(30, 64, 175, 1)",
      "rgba(17, 24, 39, 1)",
      "rgba(34, 197, 94, 1)",
      "rgba(245, 158, 11, 1)",
      "rgba(239, 68, 68, 1)"
    ]
  },

  // Icon background colors
  iconBackgrounds: {
    primary: "bg-blue-100 text-blue-700",
    secondary: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-600",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-red-100 text-red-600",
    info: "bg-sky-100 text-sky-600"
  },

  // Shadow colors
  shadows: {
    sm: "shadow-sm",
    default: "shadow",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    gradient: "shadow-lg shadow-blue-500/50"
  }
};

/**
 * Helper function to get gradient classes as a string
 */
export const getGradient = (type = "primary") => {
  return `bg-gradient-to-r ${themeColors.gradients[type]}`;
};

/**
 * Helper function to get badge classes
 */
export const getBadgeClass = (variant = "primary") => {
  return themeColors.badges[variant] || themeColors.badges.primary;
};

/**
 * Helper function to get status classes
 */
export const getStatusClass = status => {
  return themeColors.status[status] || themeColors.status.info;
};

/**
 * Helper function to get button gradient classes
 */
export const getButtonClass = (variant = "primary") => {
  return themeColors.buttons[variant] || themeColors.buttons.primary;
};

export default themeColors;
