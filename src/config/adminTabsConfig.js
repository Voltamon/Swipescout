import AdminDashboard from "@/pages/adminDashboard.jsx";
import UserManagementPage from "@/pages/admin/UserManagementPage.jsx";
import AdminConnectionsPage from "@/pages/admin/AdminConnectionsPage.jsx";
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
      labelKey: "adminTabs:categories.dashboard",
      label: t("adminTabs:categories.dashboard"),
      tabs: [
        {
          labelKey: "adminTabs:tabs.overview",
          label: t("adminTabs:tabs.overview"),
          icon: { name: "LayoutDashboard" },
          path: "overview",
          component: AdminDashboard,
          description: t("adminTabs:descriptions.overview")
        },
        {
          labelKey: "adminTabs:tabs.analytics",
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
      labelKey: "adminTabs:categories.userManagement",
      label: t("adminTabs:categories.userManagement"),
      tabs: [
        {
          labelKey: "adminTabs:tabs.users",
          label: t("adminTabs:tabs.users"),
          icon: { name: "Users" },
          path: "users",
          component: UserManagementPage,
          description: t("adminTabs:descriptions.users")
        },
        {
          labelKey: "adminTabs:tabs.connections",
          label: t("adminTabs:tabs.connections"),
          icon: { name: "Link" },
          path: "connections",
          component: AdminConnectionsPage,
          description: t("adminTabs:descriptions.connections")
        }
      ]
    },
    {
      key: "content",
      labelKey: "adminTabs:categories.contentManagement",
      label: t("adminTabs:categories.contentManagement"),
      tabs: [
        {
          labelKey: "adminTabs:tabs.jobs",
          label: t("adminTabs:tabs.jobs"),
          icon: { name: "Briefcase" },
          path: "jobs",
          component: AdminJobsPage,
          description: t("adminTabs:descriptions.jobs")
        },
        {
          labelKey: "adminTabs:tabs.videos",
          label: t("adminTabs:tabs.videos"),
          icon: { name: "Film" },
          path: "videos",
          component: AdminVideosPage,
          description: t("adminTabs:descriptions.videos")
        },
        {
          labelKey: "adminTabs:tabs.quickTips",
          label: t("adminTabs:tabs.quickTips"),
          icon: { name: "Lightbulb" },
          path: "quick-tips",
          component: QuickTipsAdminPage,
          description: t("adminTabs:descriptions.quickTips")
        },
        {
          labelKey: "adminTabs:tabs.careerPaths",
          label: t("adminTabs:tabs.careerPaths"),
          icon: { name: "Map" },
          path: "career-paths",
          component: CareerPathsAdminPage,
          description: t("adminTabs:descriptions.careerPaths")
        },
        {
          labelKey: "adminTabs:tabs.reports",
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
      labelKey: "adminTabs:categories.blogManagement",
      label: t("adminTabs:categories.blogManagement"),
      tabs: [
        {
          labelKey: "adminTabs:tabs.allBlogs",
          label: t("adminTabs:tabs.allBlogs"),
          icon: { name: "FileText" },
          path: "blogs",
          component: BlogListPage,
          description: t("adminTabs:descriptions.allBlogs")
        },
        {
          labelKey: "adminTabs:tabs.createBlog",
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
      labelKey: "adminTabs:categories.platformSettings",
      label: t("adminTabs:categories.platformSettings"),
      tabs: [
        {
          labelKey: "adminTabs:tabs.settings",
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
