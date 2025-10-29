/**
 * Home Pages Theme Colors Configuration
 * 
 * Customizable color scheme for home-related components:
 * - Contact Us
 * - Cookie Policy
 * - Privacy Policy
 * - Terms of Service
 * 
 * Change colors here to update all home page styling consistently.
 */

export const homeThemeColors = {
  // Primary brand colors for home pages
  brand: {
    primary: "indigo-600",      // Main brand color
    secondary: "blue-600",       // Secondary actions
    accent: "purple-600",        // Accent elements
    light: "sky-500",           // Light accents
  },

  // Gradient combinations
  gradients: {
    header: "from-indigo-600 via-purple-600 to-blue-600",
    headerHover: "from-indigo-700 via-purple-700 to-blue-700",
    card: "from-indigo-50 via-purple-50 to-blue-50",
    cardDark: "from-indigo-100 via-purple-100 to-blue-100",
    badge: "from-indigo-500 to-purple-500",
    button: "from-indigo-600 to-purple-600",
    buttonHover: "from-indigo-700 to-purple-700",
    subtle: "from-slate-50 to-indigo-50",
  },

  // Background colors
  backgrounds: {
    page: "bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50",
    dialog: "bg-white dark:bg-slate-950",
    card: "bg-white dark:bg-slate-900",
    cardHover: "hover:bg-slate-50 dark:hover:bg-slate-800",
    section: "bg-slate-50 dark:bg-slate-900",
    highlight: "bg-indigo-50 dark:bg-indigo-950/30",
  },

  // Text colors
  text: {
    primary: "text-slate-900 dark:text-slate-100",
    secondary: "text-slate-700 dark:text-slate-300",
    muted: "text-slate-600 dark:text-slate-400",
    inverse: "text-white",
    link: "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300",
    gradient: "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent",
  },

  // Border colors
  borders: {
    default: "border-slate-200 dark:border-slate-700",
    light: "border-slate-100 dark:border-slate-800",
    primary: "border-indigo-200 dark:border-indigo-800",
    accent: "border-purple-200 dark:border-purple-800",
    hover: "hover:border-indigo-300 dark:hover:border-indigo-700",
  },

  // Component-specific colors
  components: {
    // Contact section cards
    contact: {
      email: {
        bg: "bg-gradient-to-br from-indigo-500 to-purple-600",
        border: "border-indigo-100 hover:border-indigo-300",
        text: "text-indigo-600",
      },
      discord: {
        bg: "bg-gradient-to-br from-[#5865F2] to-[#4752C4]",
        border: "border-blue-100 hover:border-blue-300",
        button: "bg-[#5865F2] hover:bg-[#4752C4]",
      },
    },

    // Policy section headers
    section: {
      heading: "text-slate-900 dark:text-slate-100 font-bold text-lg",
      subheading: "text-slate-700 dark:text-slate-300 font-semibold text-base",
      text: "text-slate-600 dark:text-slate-400 leading-relaxed",
    },

    // Badge variants
    badge: {
      default: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
      outline: "border-indigo-300 text-indigo-700 dark:border-indigo-700 dark:text-indigo-300",
      info: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    },
  },

  // Icon colors
  icons: {
    primary: "text-indigo-600 dark:text-indigo-400",
    secondary: "text-purple-600 dark:text-purple-400",
    accent: "text-blue-600 dark:text-blue-400",
    muted: "text-slate-500 dark:text-slate-400",
    inverse: "text-white",
  },

  // Shadow utilities
  shadows: {
    sm: "shadow-sm shadow-indigo-100/50 dark:shadow-indigo-950/50",
    md: "shadow-md shadow-indigo-200/50 dark:shadow-indigo-950/50",
    lg: "shadow-lg shadow-indigo-300/50 dark:shadow-indigo-950/50",
    xl: "shadow-xl shadow-indigo-400/50 dark:shadow-indigo-950/50",
  },

  // Responsive utilities
  responsive: {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    section: "py-8 sm:py-12 lg:py-16",
    spacing: "space-y-4 sm:space-y-6 lg:space-y-8",
  },
};

/**
 * Helper function to get gradient classes
 */
export const getHomeGradient = (type = 'header') => {
  return `bg-gradient-to-r ${homeThemeColors.gradients[type]}`;
};

/**
 * Helper function to get component-specific classes
 */
export const getHomeComponentClass = (component, variant = 'default') => {
  const comp = homeThemeColors.components[component];
  if (!comp) return '';
  return typeof comp === 'string' ? comp : (comp[variant] || '');
};

/**
 * Helper function to build responsive class strings
 */
export const getHomeResponsiveClass = (type = 'container') => {
  return homeThemeColors.responsive[type] || '';
};

export default homeThemeColors;
