/**
 * Centralized Theme Colors Configuration - JOBSEEKER DASHBOARD
 * 
 * Change colors here and they will be applied across all jobseeker pages.
 * All gradients, backgrounds, and UI colors are defined in one place.
 * 
 * This is a separate theme file for jobseekers, allowing independent customization
 * from the employer theme (theme-colors.js)
 */

export const themeColors = {
  // Primary brand gradients - aligned with home theme (indigo/purple/blue)
  gradients: {
    primary: "from-indigo-600 via-purple-600 to-blue-600",
    primaryHover: "from-indigo-700 via-purple-700 to-blue-700",
    secondary: "from-blue-500 to-indigo-600",
    success: "from-green-500 to-emerald-600",
    warning: "from-amber-500 to-orange-600",
    danger: "from-red-500 to-rose-600",
    info: "from-sky-500 to-blue-600",
    dark: "from-slate-800 to-slate-900",
    light: "from-slate-100 to-slate-200"
  },

  // Background colors
  backgrounds: {
    page: "bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50",
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
      "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
  },

  // Border colors
  borders: {
    default: "border-slate-200",
    light: "border-slate-100",
    dark: "border-slate-800",
    primary: "border-indigo-500",
    gradient:
      "border-2 border-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600"
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
    primary: "bg-indigo-100 text-indigo-800",
    secondary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-sky-100 text-sky-800",
    gray: "bg-slate-100 text-slate-800"
  },

  // Button colors (for gradient buttons)
  buttons: {
    primary:
      "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700",
    secondary:
      "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
    success:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
  },

  // Chart.js color configurations - aligned with home theme
  charts: {
    line: {
      primary: {
        borderColor: "rgba(79, 70, 229, 1)", // indigo-600
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        pointBackgroundColor: "rgba(79, 70, 229, 1)",
        pointBorderColor: "#fff"
      },
      secondary: {
        borderColor: "rgba(37, 99, 235, 1)", // blue-600
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        pointBackgroundColor: "rgba(37, 99, 235, 1)",
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
      primary: "rgba(79, 70, 229, 0.8)", // indigo-600
      secondary: "rgba(37, 99, 235, 0.8)", // blue-600
      success: "rgba(34, 197, 94, 0.8)", // green-500
      warning: "rgba(245, 158, 11, 0.8)", // amber-500
      danger: "rgba(239, 68, 68, 0.8)" // red-500
    },
    doughnut: [
      "rgba(79, 70, 229, 0.8)", // indigo-600
      "rgba(147, 51, 234, 0.8)", // purple-600
      "rgba(37, 99, 235, 0.8)", // blue-600
      "rgba(34, 197, 94, 0.8)", // green-500
      "rgba(245, 158, 11, 0.8)", // amber-500
      "rgba(239, 68, 68, 0.8)" // red-500
    ],
    doughnutBorders: [
      "rgba(79, 70, 229, 1)",
      "rgba(147, 51, 234, 1)",
      "rgba(37, 99, 235, 1)",
      "rgba(34, 197, 94, 1)",
      "rgba(245, 158, 11, 1)",
      "rgba(239, 68, 68, 1)"
    ]
  },

  // Icon background colors
  iconBackgrounds: {
    primary: "bg-indigo-100 text-indigo-600",
    secondary: "bg-blue-100 text-blue-600",
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
    gradient: "shadow-lg shadow-indigo-500/50"
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
