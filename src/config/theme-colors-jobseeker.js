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
  // Primary brand gradients - a fresh, modern look for jobseekers (teal/cyan/sky)
  gradients: {
    primary: "from-teal-500 via-cyan-500 to-sky-600",
    primaryHover: "from-teal-600 via-cyan-600 to-sky-700",
    secondary: "from-sky-500 to-cyan-600",
    success: "from-green-500 to-emerald-600",
    warning: "from-amber-500 to-orange-600",
    danger: "from-red-500 to-rose-600",
    info: "from-sky-500 to-blue-600",
    dark: "from-slate-800 to-slate-900",
    light: "from-slate-100 to-slate-200"
  },

  // Background colors
  backgrounds: {
    page: "bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50",
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
      "bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600 bg-clip-text text-transparent"
  },

  // Border colors
  borders: {
    default: "border-slate-200",
    light: "border-slate-100",
    dark: "border-slate-800",
    primary: "border-teal-500",
    gradient:
      "border-2 border-transparent bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600"
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
    primary: "bg-teal-100 text-teal-800",
    secondary: "bg-cyan-100 text-cyan-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-sky-100 text-sky-800",
    gray: "bg-slate-100 text-slate-800"
  },

  // Button colors (for gradient buttons)
  buttons: {
    primary:
      "bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600 hover:from-teal-600 hover:via-cyan-600 hover:to-sky-700",
    secondary:
      "bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700",
    success:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
    outline: "border-2 border-teal-600 text-teal-600 hover:bg-teal-50"
  },

  // Chart.js color configurations - aligned with home theme
  charts: {
    line: {
      primary: {
        borderColor: "rgba(20, 184, 166, 1)", // teal-500
        backgroundColor: "rgba(20, 184, 166, 0.1)",
        pointBackgroundColor: "rgba(20, 184, 166, 1)",
        pointBorderColor: "#fff"
      },
      secondary: {
        borderColor: "rgba(8, 145, 178, 1)", // cyan-600
        backgroundColor: "rgba(8, 145, 178, 0.1)",
        pointBackgroundColor: "rgba(8, 145, 178, 1)",
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
      primary: "rgba(20, 184, 166, 0.8)", // teal-500
      secondary: "rgba(8, 145, 178, 0.8)", // cyan-600
      success: "rgba(34, 197, 94, 0.8)", // green-500
      warning: "rgba(245, 158, 11, 0.8)", // amber-500
      danger: "rgba(239, 68, 68, 0.8)" // red-500
    },
    doughnut: [
      "rgba(20, 184, 166, 0.8)", // teal-500
      "rgba(8, 145, 178, 0.8)", // cyan-600
      "rgba(14, 165, 233, 0.8)", // sky-500
      "rgba(34, 197, 94, 0.8)", // green-500
      "rgba(245, 158, 11, 0.8)", // amber-500
      "rgba(239, 68, 68, 0.8)" // red-500
    ],
    doughnutBorders: [
      "rgba(20, 184, 166, 1)",
      "rgba(8, 145, 178, 1)",
      "rgba(14, 165, 233, 1)",
      "rgba(34, 197, 94, 1)",
      "rgba(245, 158, 11, 1)",
      "rgba(239, 68, 68, 1)"
    ]
  },

  // Icon background colors
  iconBackgrounds: {
    primary: "bg-teal-100 text-teal-600",
    secondary: "bg-cyan-100 text-cyan-600",
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
    gradient: "shadow-lg shadow-teal-500/50"
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
