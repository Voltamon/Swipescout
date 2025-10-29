import AdminDashboard from "@/pages/AdminDashboard";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import ContentModerationPage from "@/pages/admin/ContentModerationPage";
import BlogListPage from "@/pages/admin/BlogListPage";
import BlogEditorPage from "@/pages/admin/BlogEditorPage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import SystemSettingsPage from "@/pages/admin/SystemSettingsPage";
import AdminJobsPage from "@/pages/admin/AdminJobsPage";
import AdminVideosPage from "@/pages/admin/AdminVideosPage";

export const getAdminTabCategories = t => {
  return [
    {
      key: "dashboard",
      label: t("admin.nav.overview", "Overview"),
      tabs: [
        {
          label: t("admin.nav.dashboard", "Dashboard"),
          icon: { name: "LayoutDashboard" },
          path: "overview",
          component: AdminDashboard,
          description: t(
            "admin.nav.dashboardDesc",
            "Platform statistics and insights"
          )
        }
      ]
    },
    {
      key: "users",
      label: t("admin.nav.userManagement", "User Management"),
      tabs: [
        {
          label: t("admin.nav.allUsers", "All Users"),
          icon: { name: "Users" },
          path: "users",
          component: UserManagementPage,
          description: t("admin.nav.allUsersDesc", "Manage all platform users")
        }
      ]
    },
    {
      key: "content",
      label: t("admin.nav.contentManagement", "Content Management"),
      tabs: [
        {
          label: t("admin.nav.jobs", "Jobs"),
          icon: { name: "Briefcase" },
          path: "jobs",
          component: AdminJobsPage,
          description: t("admin.nav.jobsDesc", "View and manage job postings")
        },
        {
          label: t("admin.nav.videos", "Videos"),
          icon: { name: "Film" },
          path: "videos",
          component: AdminVideosPage,
          description: t("admin.nav.videosDesc", "Manage platform videos")
        },
        {
          label: t("admin.nav.moderation", "Moderation"),
          icon: { name: "Shield" },
          path: "moderation",
          component: ContentModerationPage,
          description: t("admin.nav.moderationDesc", "Review reported content")
        }
      ]
    },
    {
      key: "blog",
      label: t("admin.nav.blogManagement", "Blog Management"),
      tabs: [
        {
          label: t("admin.nav.allBlogs", "All Blogs"),
          icon: { name: "FileText" },
          path: "blogs",
          component: BlogListPage,
          description: t("admin.nav.allBlogsDesc", "Manage blog posts")
        },
        {
          label: t("admin.nav.createBlog", "Create Blog"),
          icon: { name: "PenTool" },
          path: "blogs/new",
          component: BlogEditorPage,
          description: t("admin.nav.createBlogDesc", "Write a new blog post")
        }
      ]
    },
    {
      key: "analytics",
      label: t("admin.nav.analytics", "Analytics"),
      tabs: [
        {
          label: t("admin.nav.platformAnalytics", "Platform Analytics"),
          icon: { name: "BarChart3" },
          path: "analytics",
          component: AdminAnalyticsPage,
          description: t(
            "admin.nav.platformAnalyticsDesc",
            "Detailed platform metrics"
          )
        }
      ]
    },
    {
      key: "settings",
      label: t("admin.nav.settings", "Settings"),
      tabs: [
        {
          label: t("admin.nav.systemSettings", "System Settings"),
          icon: { name: "Settings" },
          path: "settings",
          component: SystemSettingsPage,
          description: t(
            "admin.nav.systemSettingsDesc",
            "Configure platform settings"
          )
        }
      ]
    }
  ];
};
