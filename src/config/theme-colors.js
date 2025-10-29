/**
 * Centralized Theme Colors Configuration
 * 
 * Change colors here and they will be applied across all pages.
 * All gradients, backgrounds, and UI colors are defined in one place.
 */

export const themeColors = {
  // Primary brand gradients
  gradients: {
    primary: "from-purple-600 to-cyan-600",
    primaryHover: "from-purple-700 to-cyan-700",
    secondary: "from-blue-500 to-purple-600",
    success: "from-green-500 to-teal-600",
    warning: "from-yellow-500 to-orange-600",
    danger: "from-red-500 to-pink-600",
    info: "from-cyan-500 to-blue-600",
    dark: "from-gray-800 to-gray-900",
    light: "from-gray-100 to-gray-200"
  },

  // Background colors
  backgrounds: {
    page: "bg-gradient-to-br from-gray-50 to-blue-50",
    card: "bg-white",
    cardHover: "hover:bg-gray-50",
    dark: "bg-gray-900",
    light: "bg-gray-50"
  },

  // Text colors
  text: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    muted: "text-gray-500",
    inverse: "text-white",
    gradient:
      "bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent"
  },

  // Border colors
  borders: {
    default: "border-gray-200",
    light: "border-gray-100",
    dark: "border-gray-800",
    primary: "border-purple-500",
    gradient:
      "border-2 border-transparent bg-gradient-to-r from-purple-600 to-cyan-600"
  },

  // Status colors
  status: {
    success: "text-green-600 bg-green-50",
    warning: "text-yellow-600 bg-yellow-50",
    error: "text-red-600 bg-red-50",
    info: "text-blue-600 bg-blue-50",
    pending: "text-orange-600 bg-orange-50"
  },

  // Badge colors
  badges: {
    primary: "bg-purple-100 text-purple-800",
    secondary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-cyan-100 text-cyan-800",
    gray: "bg-gray-100 text-gray-800"
  },

  // Button colors (for gradient buttons)
  buttons: {
    primary:
      "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700",
    secondary:
      "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
    success:
      "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700",
    outline: "border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
  },

  // Chart.js color configurations
  charts: {
    line: {
      primary: {
        borderColor: "rgba(147, 51, 234, 1)", // purple-600
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        pointBackgroundColor: "rgba(147, 51, 234, 1)",
        pointBorderColor: "#fff"
      },
      secondary: {
        borderColor: "rgba(6, 182, 212, 1)", // cyan-600
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        pointBackgroundColor: "rgba(6, 182, 212, 1)",
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
      primary: "rgba(147, 51, 234, 0.8)", // purple-600
      secondary: "rgba(6, 182, 212, 0.8)", // cyan-600
      success: "rgba(34, 197, 94, 0.8)", // green-500
      warning: "rgba(234, 179, 8, 0.8)", // yellow-500
      danger: "rgba(239, 68, 68, 0.8)" // red-500
    },
    doughnut: [
      "rgba(147, 51, 234, 0.8)", // purple-600
      "rgba(6, 182, 212, 0.8)", // cyan-600
      "rgba(59, 130, 246, 0.8)", // blue-500
      "rgba(34, 197, 94, 0.8)", // green-500
      "rgba(234, 179, 8, 0.8)", // yellow-500
      "rgba(239, 68, 68, 0.8)" // red-500
    ],
    doughnutBorders: [
      "rgba(147, 51, 234, 1)",
      "rgba(6, 182, 212, 1)",
      "rgba(59, 130, 246, 1)",
      "rgba(34, 197, 94, 1)",
      "rgba(234, 179, 8, 1)",
      "rgba(239, 68, 68, 1)"
    ]
  },

  // Icon background colors
  iconBackgrounds: {
    primary: "bg-purple-100 text-purple-600",
    secondary: "bg-blue-100 text-blue-600",
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    danger: "bg-red-100 text-red-600",
    info: "bg-cyan-100 text-cyan-600"
  },

  // Shadow colors
  shadows: {
    sm: "shadow-sm",
    default: "shadow",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    gradient: "shadow-lg shadow-purple-500/50"
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
