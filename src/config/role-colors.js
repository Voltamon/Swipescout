import { themeColors as jobseekerTheme } from "./theme-colors-jobseeker.js";
import { themeColors as employerTheme } from "./theme-colors-employer.js";
import { themeColors as adminTheme } from "./theme-colors-admin.js";

export const roleColorSchemes = {
  job_seeker: {
    bg: `bg-gradient-to-r ${jobseekerTheme.gradients.primary} shadow-md shadow-teal-500/20`,
    text: "!text-white",
    icon: "text-white",
    hoverBg: "hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 dark:hover:from-teal-950/30 dark:hover:to-cyan-950/30"
  },
  employer: {
    bg: `bg-gradient-to-r ${employerTheme.gradients.primary} shadow-md shadow-blue-500/20`,
    text: "!text-white",
    icon: "text-white",
    hoverBg: "hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50 dark:hover:from-blue-950/30 dark:hover:to-slate-950/30"
  },
  admin: {
    bg: `bg-gradient-to-r ${adminTheme.gradients.primary} shadow-md shadow-slate-500/20`,
    text: "!text-white",
    icon: "text-white",
    hoverBg: "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-slate-50 dark:hover:from-emerald-950/30 dark:hover:to-slate-950/30"
  },
  default: {
    bg: "bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 shadow-md shadow-purple-500/20",
    text: "!text-white",
    icon: "text-white",
    hoverBg: "hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-950/30 dark:hover:to-indigo-950/30"
  }
};
