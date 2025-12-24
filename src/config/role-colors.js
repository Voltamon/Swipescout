import { themeColors as jobseekerTheme } from "./theme-colors-jobseeker.js";
import { themeColors as employerTheme } from "./theme-colors-employer.js";
import { themeColors as adminTheme } from "./theme-colors-admin.js";

export const roleColorSchemes = {
  job_seeker: {
    bg:
      "bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-950/30 dark:to-cyan-950/30",
    text: `!${jobseekerTheme.badges.primary.split(" ")[1]} dark:!text-teal-400`,
    icon: `${jobseekerTheme.badges.primary.split(" ")[1]} dark:text-teal-400`
  },
  employer: {
    bg:
      "bg-gradient-to-r from-blue-100 to-slate-100 dark:from-blue-950/30 dark:to-slate-950/30",
    text: `!${employerTheme.badges.primary.split(" ")[1]} dark:!text-blue-400`,
    icon: `${employerTheme.badges.primary.split(" ")[1]} dark:text-blue-400`
  },
  admin: {
    bg:
      "bg-gradient-to-r from-emerald-100 to-slate-100 dark:from-emerald-950/30 dark:to-slate-950/30",
    text: `!${adminTheme.badges.secondary.split(
      " "
    )[1]} dark:!text-emerald-400`,
    icon: `${adminTheme.badges.secondary.split(" ")[1]} dark:text-emerald-400`
  },
  default: {
    bg:
      "bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-950/30 dark:to-cyan-950/30",
    text: "!text-purple-700 dark:!text-purple-400",
    icon: "text-purple-700 dark:text-purple-400"
  }
};
