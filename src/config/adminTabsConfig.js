import AdminDashboard from "@/pages/adminDashboard.jsx";
import UserManagementPage from "@/pages/admin/UserManagementPage.jsx";
import ContentModerationPage from "@/pages/admin/ContentModerationPage.jsx";
import BlogListPage from "@/pages/admin/BlogListPage.jsx";
import BlogEditorPage from "@/pages/admin/BlogEditorPage.jsx";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage.jsx";
import SystemSettingsPage from "@/pages/admin/SystemSettingsPage.jsx";
import AdminJobsPage from "@/pages/admin/AdminJobsPage.jsx";
import AdminVideosPage from "@/pages/admin/AdminVideosPage.jsx";
import QuickTipsAdminPage from "@/pages/admin/QuickTipsAdminPage.jsx";
import CareerPathsAdminPage from "@/pages/admin/CareerPathsAdminPage.jsx";

export const getAdminTabCategories = t => {
  return [
    {
      key: "dashboard",
      label: t("adminTabs:categories.dashboard"),
      tabs: [
        {
          label: t("adminTabs:tabs.overview"),
          icon: { name: "LayoutDashboard" },
          path: "overview",
          component: AdminDashboard,
          description: t("adminTabs:descriptions.overview")
        },
        {
          label: t("adminTabs:tabs.analytics"),
          icon: { name: "BarChart3" },
          path: "analytics",
          component: AdminAnalyticsPage,
          description: t("adminTabs:descriptions.analytics")
        }
      ]
    },
    {
      key: "users",
      label: t("adminTabs:categories.userManagement"),
      tabs: [
        {
          label: t("adminTabs:tabs.users"),
          icon: { name: "Users" },
          path: "users",
          component: UserManagementPage,
          description: t("adminTabs:descriptions.users")
        }
      ]
    },
    {
      key: "content",
      label: t("adminTabs:categories.contentManagement"),
      tabs: [
        {
          label: t("adminTabs:tabs.jobs"),
          icon: { name: "Briefcase" },
          path: "jobs",
          component: AdminJobsPage,
          description: t("adminTabs:descriptions.jobs")
        },
        {
          label: t("adminTabs:tabs.videos"),
          icon: { name: "Film" },
          path: "videos",
          component: AdminVideosPage,
          description: t("adminTabs:descriptions.videos")
        },
        {
          label: t("adminTabs:tabs.quickTips"),
          icon: { name: "Lightbulb" },
          path: "quick-tips",
          component: QuickTipsAdminPage,
          description: t("adminTabs:descriptions.quickTips")
        },
        {
          label: t("adminTabs:tabs.careerPaths"),
          icon: { name: "Map" },
          path: "career-paths",
          component: CareerPathsAdminPage,
          description: t("adminTabs:descriptions.careerPaths")
        },
        {
          label: t("adminTabs:tabs.reports"),
          icon: { name: "Shield" },
          path: "moderation",
          component: ContentModerationPage,
          description: t("adminTabs:descriptions.reports")
        }
      ]
    },
    {
      key: "blog",
      label: t("adminTabs:categories.blogManagement"),
      tabs: [
        {
          label: t("adminTabs:tabs.allBlogs"),
          icon: { name: "FileText" },
          path: "blogs",
          component: BlogListPage,
          description: t("adminTabs:descriptions.allBlogs")
        },
        {
          label: t("adminTabs:tabs.createBlog"),
          icon: { name: "PenTool" },
          path: "blogs/new",
          component: BlogEditorPage,
          description: t("adminTabs:descriptions.createBlog")
        }
      ]
    },
    {
      key: "settings",
      label: t("adminTabs:categories.platformSettings"),
      tabs: [
        {
          label: t("adminTabs:tabs.settings"),
          icon: { name: "Settings" },
          path: "settings",
          component: SystemSettingsPage,
          description: t("adminTabs:descriptions.settings")
        }
      ]
    }
  ];
};
